export type D1Prepared = {
  bind: (...args: unknown[]) => D1Prepared;
  first: <T>() => Promise<T | null>;
  run: () => Promise<unknown>;
  all: <T>() => Promise<{ results: T[] }>;
};

export type D1Database = {
  prepare: (query: string) => D1Prepared;
};

export async function getD1(): Promise<D1Database | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const db = (ctx.env as { DB?: D1Database }).DB;
    return db ?? null;
  } catch {
    return null;
  }
}
