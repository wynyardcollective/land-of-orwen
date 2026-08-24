import type { GameState } from "@/lib/game/types";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface SaveStore {
  get(playerId: string): Promise<GameState | null>;
  put(state: GameState): Promise<void>;
}

type D1Database = {
  prepare: (query: string) => {
    bind: (...args: unknown[]) => {
      first: <T>() => Promise<T | null>;
      run: () => Promise<unknown>;
    };
  };
};

async function getD1(): Promise<D1Database | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const db = (ctx.env as { DB?: D1Database }).DB;
    return db ?? null;
  } catch {
    return null;
  }
}

const DATA_DIR = path.join(process.cwd(), ".data", "saves");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

function filePath(playerId: string) {
  const safe = playerId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80);
  return path.join(DATA_DIR, `${safe}.json`);
}

const fileStore: SaveStore = {
  async get(playerId) {
    try {
      await ensureDataDir();
      const raw = await readFile(filePath(playerId), "utf8");
      return JSON.parse(raw) as GameState;
    } catch {
      return null;
    }
  },
  async put(state) {
    await ensureDataDir();
    await writeFile(filePath(state.playerId), JSON.stringify(state), "utf8");
  },
};

const d1Store = (db: D1Database): SaveStore => ({
  async get(playerId) {
    const row = await db
      .prepare("SELECT state_json FROM player_saves WHERE player_id = ?")
      .bind(playerId)
      .first<{ state_json: string }>();
    if (!row?.state_json) return null;
    return JSON.parse(row.state_json) as GameState;
  },
  async put(state) {
    await db
      .prepare(
        `INSERT INTO player_saves (player_id, hero_name, state_json, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(player_id) DO UPDATE SET
           hero_name = excluded.hero_name,
           state_json = excluded.state_json,
           updated_at = excluded.updated_at`,
      )
      .bind(state.playerId, state.heroName, JSON.stringify(state), state.updatedAt)
      .run();
  },
});

export async function getSaveStore(): Promise<SaveStore> {
  const db = await getD1();
  if (db) return d1Store(db);
  return fileStore;
}
