import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APP_COOKIE = "orwen_client";
const APP_VALUE = "android-app";

/** Tag Android app / TWA sessions so we can disable web-only ads (Play policy). */
export function middleware(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const hasAppCookie = request.cookies.get(APP_COOKIE)?.value === APP_VALUE;
  const isAppClient = source === APP_VALUE || hasAppCookie;

  const requestHeaders = new Headers(request.headers);
  if (isAppClient) {
    requestHeaders.set("x-orwen-client", APP_VALUE);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (source === APP_VALUE) {
    response.cookies.set(APP_COOKIE, APP_VALUE, {
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/).*)"],
};
