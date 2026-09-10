import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

async function sha256(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const configuredCode = process.env.ONBOARDING_ACCESS_CODE?.trim();

    if (!configuredCode) {
      return NextResponse.json(
        { success: false, message: "Onboarding access is not configured yet." },
        { status: 503 },
      );
    }

    const clientIp = getClientIp(request);
    const ipHash = await sha256(clientIp);
    const now = Date.now();

    const { data: attemptRow, error: attemptLookupError } = await supabaseAdmin
      .from("onboarding_access_attempts")
      .select("attempt_count, window_started_at")
      .eq("ip_hash", ipHash)
      .maybeSingle();

    if (attemptLookupError) {
      console.error("Access attempt lookup failed:", attemptLookupError);
    }

    let attemptCount = attemptRow?.attempt_count ?? 0;
    let windowStartedAt = attemptRow?.window_started_at
      ? new Date(attemptRow.window_started_at).getTime()
      : now;

    if (now - windowStartedAt >= WINDOW_MS) {
      attemptCount = 0;
      windowStartedAt = now;
    }

    if (attemptCount >= MAX_ATTEMPTS) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((WINDOW_MS - (now - windowStartedAt)) / 1000),
      );

      return NextResponse.json(
        {
          success: false,
          message: "Too many incorrect attempts. Please wait 15 minutes before trying again.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        },
      );
    }

    const body = await request.json();
    const submittedCode = String(body?.code ?? "").trim();

    if (!submittedCode || submittedCode !== configuredCode) {
      const nextAttemptCount = attemptCount + 1;

      const { error: attemptWriteError } = await supabaseAdmin
        .from("onboarding_access_attempts")
        .upsert(
          {
            ip_hash: ipHash,
            attempt_count: nextAttemptCount,
            window_started_at: new Date(windowStartedAt).toISOString(),
            last_attempt_at: new Date(now).toISOString(),
          },
          { onConflict: "ip_hash" },
        );

      if (attemptWriteError) {
        console.error("Access attempt update failed:", attemptWriteError);
      }

      const attemptsLeft = Math.max(0, MAX_ATTEMPTS - nextAttemptCount);

      return NextResponse.json(
        {
          success: false,
          message:
            attemptsLeft > 0
              ? `That access code is not valid. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`
              : "Too many incorrect attempts. Please wait 15 minutes before trying again.",
        },
        { status: attemptsLeft > 0 ? 401 : 429 },
      );
    }

    await supabaseAdmin
      .from("onboarding_access_attempts")
      .delete()
      .eq("ip_hash", ipHash);

    const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
    const payload = `ekreativ-onboarding-access.${expiresAt}`;
    const signature = await hmac(payload, configuredCode);
    const response = NextResponse.json({ success: true });

    response.cookies.set(
      "ekreativ_onboarding_access",
      `${expiresAt}.${signature}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      },
    );

    return response;
  } catch (error) {
    console.error("Onboarding access error:", error);

    return NextResponse.json(
      { success: false, message: "We could not verify the access code. Please try again." },
      { status: 500 },
    );
  }
}
