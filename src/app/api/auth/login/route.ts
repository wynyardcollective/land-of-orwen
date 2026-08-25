import {
  createSessionForUser,
  getAuthStore,
  isValidEmail,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/server/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email ?? "";
    const password = body.password ?? "";

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const auth = await getAuthStore();
    const user = await auth.findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const { token, expiresAt } = await createSessionForUser(user.id);
    const res = NextResponse.json({
      user: {
        email: user.email,
        playerId: user.playerId,
        heroName: user.heroName,
      },
    });
    res.cookies.set(sessionCookieOptions(token, expiresAt));
    return res;
  } catch (err) {
    console.error("login failed", err);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
