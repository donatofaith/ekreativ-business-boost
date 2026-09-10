import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

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

export async function POST(request: Request) {
  try {
    const sessionSecret = process.env.ONBOARDING_SESSION_SECRET?.trim();

    if (!sessionSecret) {
      return NextResponse.json(
        { success: false, message: "Onboarding access is not configured yet." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const submittedCode = String(body?.code ?? "").trim().toUpperCase();

    if (!submittedCode) {
      return NextResponse.json(
        { success: false, message: "Please enter your access code." },
        { status: 400 },
      );
    }

    const codeHash = await sha256(submittedCode);

    const { data: codeRow, error: lookupError } = await supabaseAdmin
      .from("onboarding_access_codes")
      .select("id, redeemed_at, expires_at")
      .eq("code_hash", codeHash)
      .maybeSingle();

    if (lookupError) {
      console.error("Access code lookup failed:", lookupError);
      return NextResponse.json(
        { success: false, message: "We could not verify this code right now." },
        { status: 500 },
      );
    }

    if (!codeRow) {
      return NextResponse.json(
        { success: false, message: "That access code is not valid." },
        { status: 401 },
      );
    }

    if (codeRow.redeemed_at) {
      return NextResponse.json(
        {
          success: false,
          message: "This access code has already been used. Please contact eKreativ Solutions if you need help.",
        },
        { status: 409 },
      );
    }

    if (codeRow.expires_at && new Date(codeRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "This access code has expired." },
        { status: 410 },
      );
    }

    const sessionId = crypto.randomUUID();

    const { data: redeemedRows, error: redeemError } = await supabaseAdmin
      .from("onboarding_access_codes")
      .update({
        redeemed_at: new Date().toISOString(),
        redeemed_session_id: sessionId,
      })
      .eq("id", codeRow.id)
      .is("redeemed_at", null)
      .select("id");

    if (redeemError) {
      console.error("Access code redemption failed:", redeemError);
      return NextResponse.json(
        { success: false, message: "We could not activate this access code." },
        { status: 500 },
      );
    }

    if (!redeemedRows?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "This access code has already been used. Please contact eKreativ Solutions if you need help.",
        },
        { status: 409 },
      );
    }

    const expiresAt = Date.now() + 1000 * 60 * 60 * 24;
    const payload = `${codeRow.id}.${sessionId}.${expiresAt}`;
    const signature = await hmac(payload, sessionSecret);
    const cookieValue = `${payload}.${signature}`;

    const response = NextResponse.json({ success: true });

    response.cookies.set("ekreativ_onboarding_access", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Onboarding access error:", error);

    return NextResponse.json(
      { success: false, message: "We could not verify the access code. Please try again." },
      { status: 500 },
    );
  }
}
