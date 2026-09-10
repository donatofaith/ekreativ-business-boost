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

function createReadableCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  const raw = Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");

  return `BOOST-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export async function POST(request: Request) {
  try {
    const configuredAdminCode = process.env.ONBOARDING_ADMIN_CODE?.trim();

    if (!configuredAdminCode) {
      return NextResponse.json(
        { success: false, message: "Admin code generation is not configured yet." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const submittedAdminCode = String(body?.adminCode ?? "").trim();
    const clientLabel = String(body?.clientLabel ?? "").trim();

    if (submittedAdminCode !== configuredAdminCode) {
      return NextResponse.json(
        { success: false, message: "Admin access code is incorrect." },
        { status: 401 },
      );
    }

    if (!clientLabel) {
      return NextResponse.json(
        { success: false, message: "Enter a client name or label first." },
        { status: 400 },
      );
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = createReadableCode();
      const codeHash = await sha256(code);

      const { error } = await supabaseAdmin
        .from("onboarding_access_codes")
        .insert({
          code_hash: codeHash,
          client_label: clientLabel,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        });

      if (!error) {
        return NextResponse.json({
          success: true,
          code,
          clientLabel,
          expiresIn: "7 days",
        });
      }

      if (error.code !== "23505") {
        console.error("Access code creation failed:", error);
        return NextResponse.json(
          { success: false, message: "We could not create an access code." },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Could not create a unique code. Please try again." },
      { status: 500 },
    );
  } catch (error) {
    console.error("Access code admin error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong while creating the code." },
      { status: 500 },
    );
  }
}
