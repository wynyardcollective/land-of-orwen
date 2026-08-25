import {
  clearSessionCookieOptions,
  getAuthStore,
  hashToken,
  parseSessionCookie,
  SESSION_COOKIE,
} from "@/lib/server/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const token = parseSessionCookie(request.headers.get("cookie"));
    if (token) {
      const auth = await getAuthStore();
      await auth.deleteSessionByTokenHash(hashToken(token));
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(clearSessionCookieOptions());
    return res;
  } catch (err) {
    console.error("logout failed", err);
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });
    return res;
  }
}
