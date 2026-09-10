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

function redirectToAccess(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/onboarding/access", request.url),
  );
  response.cookies.delete("ekreativ_onboarding_access");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/onboarding/access") {
    return NextResponse.next();
  }

  const isProtectedOnboarding = pathname.startsWith("/onboarding");
  const isProtectedSubmit = pathname === "/api/submit";

  if (!isProtectedOnboarding && !isProtectedSubmit) {
    return NextResponse.next();
  }

  const accessCode = process.env.ONBOARDING_ACCESS_CODE?.trim();

  if (!accessCode) {
    if (isProtectedSubmit) {
      return NextResponse.json(
        { success: false, message: "Onboarding access is not configured." },
        { status: 503 },
      );
    }

    return redirectToAccess(request);
  }

  const cookieValue = request.cookies.get("ekreativ_onboarding_access")?.value;

  if (!cookieValue) {
    if (isProtectedSubmit) {
      return NextResponse.json(
        { success: false, message: "Your onboarding session has expired. Please unlock the form again." },
        { status: 401 },
      );
    }

    return redirectToAccess(request);
  }

  const parts = cookieValue.split(".");

  if (parts.length !== 2) {
    if (isProtectedSubmit) {
      return NextResponse.json(
        { success: false, message: "Invalid onboarding session." },
        { status: 401 },
      );
    }

    return redirectToAccess(request);
  }

  const [expiresAtRaw, signature] = parts;
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    if (isProtectedSubmit) {
      const response = NextResponse.json(
        { success: false, message: "Your onboarding session has expired. Please unlock the form again." },
        { status: 401 },
      );
      response.cookies.delete("ekreativ_onboarding_access");
      return response;
    }

    return redirectToAccess(request);
  }

  const expectedSignature = await hmac(
    `ekreativ-onboarding-access.${expiresAtRaw}`,
    accessCode,
  );

  if (signature !== expectedSignature) {
    if (isProtectedSubmit) {
      const response = NextResponse.json(
        { success: false, message: "Invalid onboarding session." },
        { status: 401 },
      );
      response.cookies.delete("ekreativ_onboarding_access");
      return response;
    }

    return redirectToAccess(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/onboarding/:path*", "/api/submit"],
};
