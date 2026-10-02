import { getDatabase } from "@netlify/database";
import type { PoolClient, QueryResultRow } from "pg";
import { logError } from "./log";

type Queryable = {
  query: <R extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => Promise<{ rows: R[] }>;
};

type Pool = Queryable & {
  connect: () => Promise<PoolClient>;
  on: (event: "error", listener: (error: Error) => void) => void;
  end: () => Promise<void>;
};

let pool: Pool | null = null;

/**
 * One shared connection pool per server instance. On Netlify the connection
 * string comes from NETLIFY_DB_URL, which Netlify sets for each deploy.
 */
export function db() {
  if (!pool) {
    pool = getDatabase().pool as unknown as Pool;
    // An idle connection the database closes must not crash the server.
    pool.on("error", (error) => logError("db.idle_connection_error", error));
  }
  return pool;
}

/** Closes the pool. Used by tests. */
export async function closeDb() {
  await pool?.end();
  pool = null;
}

export async function query<R extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await db().query<R>(text, params);
  return result.rows;
}

/** Runs the work in one transaction: all of it is saved, or none of it. */
export async function transaction<T>(work: (client: Queryable) => Promise<T>): Promise<T> {
  const client = await db().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client as unknown as Queryable);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export type { Queryable };
