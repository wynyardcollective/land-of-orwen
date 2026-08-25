import {
  createSessionForUser,
  getAuthStore,
  hashPassword,
  isValidEmail,
  isValidPassword,
  sessionCookieOptions,
} from "@/lib/server/auth";
import { createInitialState } from "@/lib/game/save";
import { getSaveStore } from "@/lib/server/save-store";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      heroName?: string;
    };
    const email = body.email ?? "";
    const password = body.password ?? "";
    const heroName = (body.heroName ?? "Wanderer").trim().slice(0, 24) || "Wanderer";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const auth = await getAuthStore();
    const existing = await auth.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await auth.createUser({ email, passwordHash, heroName });

    const saveStore = await getSaveStore();
    const initial = createInitialState(user.playerId, heroName);
    await saveStore.put(initial);

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
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
    if (code === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }
    console.error("register failed", err);
    return NextResponse.json({ error: "Could not create account." }, { status: 500 });
  }
}
