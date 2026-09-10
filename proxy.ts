import { NextRequest, NextResponse } from "next/server";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/onboarding") || pathname === "/onboarding/access") {
    return NextResponse.next();
  }

  const accessCode = process.env.ONBOARDING_ACCESS_CODE?.trim();

  if (!accessCode) {
    const accessUrl = new URL("/onboarding/access", request.url);
    return NextResponse.redirect(accessUrl);
  }

  const expectedSignature = await accessSignature(accessCode);
  const cookieValue = request.cookies.get("ekreativ_onboarding_access")?.value;

  if (cookieValue !== expectedSignature) {
    const accessUrl = new URL("/onboarding/access", request.url);
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*"],
};
