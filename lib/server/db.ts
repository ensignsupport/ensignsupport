import { getCloudflareContext } from "@opennextjs/cloudflare";
import { logError } from "./log";

/**
 * The D1 database behind the forms and the admin.
 * See docs/decisions/0008-moving-to-cloudflare.md.
 *
 * D1 has no interactive transactions: it cannot open one, read a row, decide
 * something here, then write. What it has is batch(), which Cloudflare runs as
 * one SQL transaction that rolls the whole sequence back if any statement in it
 * fails. So anything that used to decide between a read and a write now decides
 * in the SQL instead, and the whole thing goes through batch().
 */

/** A statement and its values, ready to run on its own or in a batch. */
export type Statement = { sql: string; params?: unknown[] };

let injected: D1Database | null = null;

/**
 * Points the data layer at a database the tests made. Never used by the
 * Worker, which gets its database from the Cloudflare binding below.
 */
export function useDatabase(database: D1Database | null) {
  injected = database;
}

export async function db(): Promise<D1Database> {
  if (injected) return injected;
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    const error = new Error("No D1 binding. Check d1_databases in wrangler.jsonc.");
    logError("db.no_binding", error);
    throw error;
  }
  return env.DB;
}

/**
 * D1 takes null, numbers, strings and blobs only. Booleans are stored as 0 and
 * 1 (the schema uses INTEGER for them), a missing value is null, and a date is
 * written the same way the schema writes its own: UTC with a Z on the end.
 */
function value(v: unknown): null | number | string | ArrayBuffer {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "number" || typeof v === "string") return v;
  if (v instanceof ArrayBuffer) return v;
  return String(v);
}

function prepare(database: D1Database, { sql, params = [] }: Statement) {
  const statement = database.prepare(sql);
  return params.length ? statement.bind(...params.map(value)) : statement;
}

/** Every row the statement returns. */
export async function query<R = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<R[]> {
  const database = await db();
  const { results } = await prepare(database, { sql, params }).all<R>();
  return results ?? [];
}

/** The first row, or null when there is none. */
export async function first<R = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<R | null> {
  const database = await db();
  return (await prepare(database, { sql, params }).first<R>()) ?? null;
}

/** Runs a statement that returns nothing. Says how many rows it changed. */
export async function run(sql: string, params: unknown[] = []): Promise<number> {
  const database = await db();
  const { meta } = await prepare(database, { sql, params }).run();
  return meta.changes ?? 0;
}

/**
 * Runs the statements in one transaction: all of them are saved, or none.
 * Results come back in the order the statements were given.
 */
export async function batch<R = Record<string, unknown>>(statements: Statement[]): Promise<D1Result<R>[]> {
  const database = await db();
  return database.batch<R>(statements.map((statement) => prepare(database, statement)));
}

/** The rows a statement in a finished batch returned, read as the shape asked for. */
export function rowsOf<R>(result: { results?: unknown[] } | undefined): R[] {
  return (result?.results as R[] | undefined) ?? [];
}
