import path from "node:path";
import { getPlatformProxy } from "wrangler";

/**
 * Reads the same local D1 the test Worker is writing to, so the browser tests
 * can check what really landed in the database. Wrangler writes into a "v3"
 * folder under its --persist-to, and getPlatformProxy takes its path as given,
 * so this one carries the v3. If that ever stops lining up the tests fail with
 * "no such table", which is loud enough to notice.
 */

const STATE = path.join(__dirname, "..", "..", "test-results", "state", "v3");

let platform: Awaited<ReturnType<typeof getPlatformProxy<{ DB: D1Database }>>> | null = null;

async function database(): Promise<D1Database> {
  platform ??= await getPlatformProxy<{ DB: D1Database }>({ persist: { path: STATE } });
  return platform.env.DB;
}

export async function sql<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const db = await database();
  const prepared = params.length ? db.prepare(text).bind(...params) : db.prepare(text);
  const { results } = await prepared.all();
  return (results ?? []) as T[];
}

/** Lets the test process exit once the tests are done. */
export async function closeDatabase() {
  await platform?.dispose();
  platform = null;
}
