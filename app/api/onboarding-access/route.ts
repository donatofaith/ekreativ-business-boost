import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function accessSignature(secret: string) {
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
    new TextEncoder().encode("ekreativ-onboarding-access"),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  try {
    const configuredCode = process.env.ONBOARDING_ACCESS_CODE?.trim();

    if (!configuredCode) {
      return NextResponse.json(
        { success: false, message: "Onboarding access is not configured yet." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const submittedCode = String(body?.code ?? "").trim();

    if (!submittedCode || submittedCode !== configuredCode) {
      return NextResponse.json(
        { success: false, message: "That access code is not valid." },
        { status: 401 },
      );
    }

    const signature = await accessSignature(configuredCode);
    const response = NextResponse.json({ success: true });

    response.cookies.set("ekreativ_onboarding_access", signature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "We could not verify the access code. Please try again." },
      { status: 500 },
    );
  }
}
