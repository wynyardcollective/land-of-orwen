import { getUserFromRequest } from "@/lib/server/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        email: user.email,
        playerId: user.playerId,
        heroName: user.heroName,
      },
    });
  } catch (err) {
    console.error("auth me failed", err);
    return NextResponse.json({ error: "Could not load session." }, { status: 500 });
  }
}
