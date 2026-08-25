import type { GameState } from "@/lib/game/types";
import { getD1, type D1Database } from "./db";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export interface SaveStore {
  get(playerId: string): Promise<GameState | null>;
  put(state: GameState): Promise<void>;
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
    try {
      const row = await db
        .prepare("SELECT state_json FROM player_saves WHERE player_id = ?")
        .bind(playerId)
        .first<{ state_json: string }>();
      if (!row?.state_json) return null;
      return JSON.parse(row.state_json) as GameState;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("no such table")) {
        await ensureD1Schema(db);
        return null;
      }
      throw err;
    }
  },
  async put(state) {
    try {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("no such table")) {
        await ensureD1Schema(db);
        await db
          .prepare(
            `INSERT INTO player_saves (player_id, hero_name, state_json, updated_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(player_id) DO UPDATE SET
               hero_name = excluded.hero_name,
               state_json = excluded.state_json,
               updated_at = excluded.updated_at`,
          )
          .bind(
            state.playerId,
            state.heroName,
            JSON.stringify(state),
            state.updatedAt,
          )
          .run();
        return;
      }
      throw err;
    }
  },
});

async function ensureD1Schema(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS player_saves (
        player_id TEXT PRIMARY KEY NOT NULL,
        hero_name TEXT NOT NULL DEFAULT 'Wanderer',
        state_json TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`,
    )
    .run();
}

export async function getSaveStore(): Promise<SaveStore> {
  const db = await getD1();
  if (db) return d1Store(db);
  return fileStore;
}
