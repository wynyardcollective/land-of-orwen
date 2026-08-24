import { getSaveStore } from "@/lib/server/save-store";
import type { GameState } from "@/lib/game/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get("playerId");
  if (!playerId) {
    return NextResponse.json({ error: "playerId required" }, { status: 400 });
  }
  try {
    const store = await getSaveStore();
    const state = await store.get(playerId);
    if (!state) {
      return NextResponse.json({ state: null });
    }
    return NextResponse.json({ state });
  } catch (err) {
    console.error("save GET failed", err);
    return NextResponse.json({ error: "Failed to load save" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { state?: GameState };
    const state = body.state;
    if (!state?.playerId || state.version !== 1) {
      return NextResponse.json({ error: "Invalid save payload" }, { status: 400 });
    }
    const store = await getSaveStore();
    await store.put({ ...state, updatedAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("save PUT failed", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
