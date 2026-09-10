import { NextRequest, NextResponse } from "next/server";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/onboarding") || pathname === "/onboarding/access") {
    return NextResponse.next();
  }

  const secret = process.env.ONBOARDING_SESSION_SECRET?.trim();

  if (!secret) {
    return NextResponse.redirect(new URL("/onboarding/access", request.url));
  }

  const cookieValue = request.cookies.get("ekreativ_onboarding_access")?.value;

  if (!cookieValue) {
    return NextResponse.redirect(new URL("/onboarding/access", request.url));
  }

  const parts = cookieValue.split(".");

  if (parts.length !== 4) {
    return NextResponse.redirect(new URL("/onboarding/access", request.url));
  }

  const [codeId, sessionId, expiresAtRaw, signature] = parts;
  const payload = `${codeId}.${sessionId}.${expiresAtRaw}`;
  const expectedSignature = await hmac(payload, secret);
  const expiresAt = Number(expiresAtRaw);

  if (
    !codeId ||
    !sessionId ||
    !signature ||
    signature !== expectedSignature ||
    !Number.isFinite(expiresAt) ||
    expiresAt < Date.now()
  ) {
    const response = NextResponse.redirect(new URL("/onboarding/access", request.url));
    response.cookies.delete("ekreativ_onboarding_access");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*"],
};
