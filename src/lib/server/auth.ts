import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { createPlayerId } from "@/lib/game/save";
import { getD1, type D1Database } from "./db";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export const SESSION_COOKIE = "rough_session";
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = 10;

export interface AuthUser {
  id: string;
  email: string;
  playerId: string;
  heroName: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: number;
  createdAt: number;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  const e = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 254;
}

export function isValidPassword(password: string) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken() {
  return nanoid(48);
}

export function sessionExpiry(now = Date.now()) {
  return now + SESSION_DAYS * 24 * 60 * 60 * 1000;
}

export function sessionCookieOptions(token: string, expiresAt: number) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function clearSessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(0),
  };
}

function newId(prefix: string) {
  return `${prefix}_${nanoid(24)}`;
}

/* ---------- stores ---------- */

interface AuthStore {
  findUserByEmail(email: string): Promise<(AuthUser & { passwordHash: string }) | null>;
  findUserById(id: string): Promise<AuthUser | null>;
  createUser(input: {
    email: string;
    passwordHash: string;
    heroName: string;
  }): Promise<AuthUser>;
  createSession(userId: string, tokenHash: string, expiresAt: number): Promise<SessionRecord>;
  findSessionByTokenHash(
    tokenHash: string,
  ): Promise<(SessionRecord & { user: AuthUser }) | null>;
  deleteSessionByTokenHash(tokenHash: string): Promise<void>;
  deleteSessionsForUser(userId: string): Promise<void>;
  updateHeroName(userId: string, heroName: string): Promise<void>;
}

const DATA_DIR = path.join(process.cwd(), ".data", "auth");

type FileDb = {
  users: Array<{
    id: string;
    email: string;
    passwordHash: string;
    playerId: string;
    heroName: string;
    createdAt: number;
  }>;
  sessions: SessionRecord[];
};

async function readFileDb(): Promise<FileDb> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const raw = await readFile(path.join(DATA_DIR, "store.json"), "utf8");
    return JSON.parse(raw) as FileDb;
  } catch {
    return { users: [], sessions: [] };
  }
}

async function writeFileDb(db: FileDb) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(path.join(DATA_DIR, "store.json"), JSON.stringify(db, null, 2), "utf8");
}

const fileAuthStore: AuthStore = {
  async findUserByEmail(email) {
    const db = await readFileDb();
    const u = db.users.find((x) => x.email === normalizeEmail(email));
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      playerId: u.playerId,
      heroName: u.heroName,
      passwordHash: u.passwordHash,
    };
  },
  async findUserById(id) {
    const db = await readFileDb();
    const u = db.users.find((x) => x.id === id);
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      playerId: u.playerId,
      heroName: u.heroName,
    };
  },
  async createUser({ email, passwordHash, heroName }) {
    const db = await readFileDb();
    const normalized = normalizeEmail(email);
    if (db.users.some((u) => u.email === normalized)) {
      throw Object.assign(new Error("Email already registered"), { code: "EMAIL_TAKEN" });
    }
    const user: AuthUser = {
      id: newId("usr"),
      email: normalized,
      playerId: createPlayerId(),
      heroName: heroName.trim().slice(0, 24) || "Wanderer",
    };
    db.users.push({
      ...user,
      passwordHash,
      createdAt: Date.now(),
    });
    await writeFileDb(db);
    return user;
  },
  async createSession(userId, tokenHash, expiresAt) {
    const db = await readFileDb();
    const session: SessionRecord = {
      id: newId("ses"),
      userId,
      tokenHash,
      expiresAt,
      createdAt: Date.now(),
    };
    db.sessions.push(session);
    await writeFileDb(db);
    return session;
  },
  async findSessionByTokenHash(tokenHash) {
    const db = await readFileDb();
    const now = Date.now();
    db.sessions = db.sessions.filter((s) => s.expiresAt > now);
    const session = db.sessions.find((s) => s.tokenHash === tokenHash);
    if (!session) {
      await writeFileDb(db);
      return null;
    }
    const user = db.users.find((u) => u.id === session.userId);
    if (!user) return null;
    await writeFileDb(db);
    return {
      ...session,
      user: {
        id: user.id,
        email: user.email,
        playerId: user.playerId,
        heroName: user.heroName,
      },
    };
  },
  async deleteSessionByTokenHash(tokenHash) {
    const db = await readFileDb();
    db.sessions = db.sessions.filter((s) => s.tokenHash !== tokenHash);
    await writeFileDb(db);
  },
  async deleteSessionsForUser(userId) {
    const db = await readFileDb();
    db.sessions = db.sessions.filter((s) => s.userId !== userId);
    await writeFileDb(db);
  },
  async updateHeroName(userId, heroName) {
    const db = await readFileDb();
    const u = db.users.find((x) => x.id === userId);
    if (u) {
      u.heroName = heroName;
      await writeFileDb(db);
    }
  },
};

async function ensureAuthSchema(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        player_id TEXT NOT NULL UNIQUE,
        hero_name TEXT NOT NULL DEFAULT 'Wanderer',
        created_at INTEGER NOT NULL
      )`,
    )
    .run();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        expires_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )`,
    )
    .run();
}

const d1AuthStore = (db: D1Database): AuthStore => ({
  async findUserByEmail(email) {
    try {
      const row = await db
        .prepare(
          `SELECT id, email, password_hash as passwordHash, player_id as playerId, hero_name as heroName
           FROM users WHERE email = ? COLLATE NOCASE`,
        )
        .bind(normalizeEmail(email))
        .first<{
          id: string;
          email: string;
          passwordHash: string;
          playerId: string;
          heroName: string;
        }>();
      return row ?? null;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("no such table")) {
        await ensureAuthSchema(db);
        return null;
      }
      throw err;
    }
  },
  async findUserById(id) {
    const row = await db
      .prepare(
        `SELECT id, email, player_id as playerId, hero_name as heroName FROM users WHERE id = ?`,
      )
      .bind(id)
      .first<AuthUser>();
    return row ?? null;
  },
  async createUser({ email, passwordHash, heroName }) {
    const user: AuthUser = {
      id: newId("usr"),
      email: normalizeEmail(email),
      playerId: createPlayerId(),
      heroName: heroName.trim().slice(0, 24) || "Wanderer",
    };
    try {
      await db
        .prepare(
          `INSERT INTO users (id, email, password_hash, player_id, hero_name, created_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(user.id, user.email, passwordHash, user.playerId, user.heroName, Date.now())
        .run();
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("UNIQUE") || message.includes("unique")) {
        throw Object.assign(new Error("Email already registered"), { code: "EMAIL_TAKEN" });
      }
      if (message.includes("no such table")) {
        await ensureAuthSchema(db);
        await db
          .prepare(
            `INSERT INTO users (id, email, password_hash, player_id, hero_name, created_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .bind(user.id, user.email, passwordHash, user.playerId, user.heroName, Date.now())
          .run();
        return user;
      }
      throw err;
    }
  },
  async createSession(userId, tokenHash, expiresAt) {
    const session: SessionRecord = {
      id: newId("ses"),
      userId,
      tokenHash,
      expiresAt,
      createdAt: Date.now(),
    };
    await db
      .prepare(
        `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(session.id, session.userId, session.tokenHash, session.expiresAt, session.createdAt)
      .run();
    return session;
  },
  async findSessionByTokenHash(tokenHash) {
    try {
      const row = await db
        .prepare(
          `SELECT s.id, s.user_id as userId, s.token_hash as tokenHash,
                  s.expires_at as expiresAt, s.created_at as createdAt,
                  u.email, u.player_id as playerId, u.hero_name as heroName, u.id as uid
           FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.token_hash = ?`,
        )
        .bind(tokenHash)
        .first<{
          id: string;
          userId: string;
          tokenHash: string;
          expiresAt: number;
          createdAt: number;
          email: string;
          playerId: string;
          heroName: string;
          uid: string;
        }>();
      if (!row) return null;
      if (row.expiresAt <= Date.now()) {
        await db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(tokenHash).run();
        return null;
      }
      return {
        id: row.id,
        userId: row.userId,
        tokenHash: row.tokenHash,
        expiresAt: row.expiresAt,
        createdAt: row.createdAt,
        user: {
          id: row.uid,
          email: row.email,
          playerId: row.playerId,
          heroName: row.heroName,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("no such table")) {
        await ensureAuthSchema(db);
        return null;
      }
      throw err;
    }
  },
  async deleteSessionByTokenHash(tokenHash) {
    await db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(tokenHash).run();
  },
  async deleteSessionsForUser(userId) {
    await db.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(userId).run();
  },
  async updateHeroName(userId, heroName) {
    await db
      .prepare(`UPDATE users SET hero_name = ? WHERE id = ?`)
      .bind(heroName, userId)
      .run();
  },
});

export async function getAuthStore(): Promise<AuthStore> {
  const db = await getD1();
  if (db) return d1AuthStore(db);
  return fileAuthStore;
}

export function parseSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split("=");
    if (rawName === SESSION_COOKIE) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}

export async function getUserFromRequest(request: Request): Promise<AuthUser | null> {
  const token = parseSessionCookie(request.headers.get("cookie"));
  if (!token) return null;
  const store = await getAuthStore();
  const session = await store.findSessionByTokenHash(hashToken(token));
  return session?.user ?? null;
}

export async function createSessionForUser(userId: string) {
  const token = createSessionToken();
  const expiresAt = sessionExpiry();
  const store = await getAuthStore();
  await store.createSession(userId, hashToken(token), expiresAt);
  return { token, expiresAt };
}
