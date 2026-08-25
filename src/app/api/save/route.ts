import { getUserFromRequest } from "@/lib/server/auth";
import { getSaveStore } from "@/lib/server/save-store";
import type { GameState } from "@/lib/game/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  try {
    const store = await getSaveStore();
    const state = await store.get(user.playerId);
    return NextResponse.json({ state });
  } catch (err) {
    console.error("save GET failed", err);
    return NextResponse.json({ error: "Failed to load save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { state?: GameState };
    const state = body.state;
    if (!state || state.version !== 1) {
      return NextResponse.json({ error: "Invalid save payload" }, { status: 400 });
    }
    const bound: GameState = {
      ...state,
      playerId: user.playerId,
      updatedAt: Date.now(),
    };
    const store = await getSaveStore();
    await store.put(bound);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("save PUT failed", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
