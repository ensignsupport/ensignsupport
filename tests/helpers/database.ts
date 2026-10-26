import { readFileSync } from "node:fs";
import { getPlatformProxy } from "wrangler";

/**
 * A throwaway D1 for the tests. Wrangler reads wrangler.jsonc and hands back
 * the same DB binding the Worker gets, run locally, so the tests talk to real
 * D1 through the real binding. Nothing is written to disk (persist: false), so
 * every run starts empty. The schema is the one that ships
 * (migrations/0001_schema.sql), so the tests check the real thing.
 */

/**
 * Splits the schema into statements. A plain split on the semicolon would cut
 * the triggers in half, because their bodies hold semicolons of their own, so
 * anything from CREATE TRIGGER is kept together until its END.
 */
function statements(sql: string): string[] {
  const withoutComments = sql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n");
  const out: string[] = [];
  let current = "";
  let inTrigger = false;
  for (const piece of withoutComments.split(";")) {
    current += piece;
    if (/\bCREATE\s+TRIGGER\b/i.test(current)) inTrigger = true;
    const done = inTrigger ? /\bEND\s*$/i.test(current.trim()) : true;
    if (done) {
      if (current.trim()) out.push(current.trim());
      current = "";
      inTrigger = false;
    } else {
      current += ";";
    }
  }
  if (current.trim()) out.push(current.trim());
  return out;
}

export type TestDatabase = {
  db: D1Database;
  /** Runs a statement straight at the database, for setting tests up. */
  sql: (text: string, ...params: unknown[]) => Promise<Record<string, unknown>[]>;
  /** Empties every table, so each test starts clean. */
  reset: () => Promise<void>;
  stop: () => Promise<void>;
};

const TABLES = [
  "email_outbox",
  "enquiry_messages",
  "enquiry_status_history",
  "enquiries",
  "referral_notes",
  "referral_status_history",
  "referrals",
  "removed_records",
  "admin_sessions",
  "login_attempts",
  "access_log",
  "rate_limits",
];

export async function startDatabase(schema = "migrations/0001_schema.sql"): Promise<TestDatabase> {
  const platform = await getPlatformProxy<{ DB: D1Database }>({ persist: false });
  const db = platform.env.DB;

  for (const statement of statements(readFileSync(schema, "utf8"))) {
    await db.prepare(statement).run();
  }

  const sql = async (text: string, ...params: unknown[]) => {
    const prepared = params.length ? db.prepare(text).bind(...params) : db.prepare(text);
    const { results } = await prepared.all();
    return (results ?? []) as Record<string, unknown>[];
  };

  return {
    db,
    sql,
    reset: async () => {
      for (const table of TABLES) await db.prepare(`DELETE FROM ${table}`).run();
      // The references carry on climbing, the way they do on the real site.
    },
    stop: () => platform.dispose(),
  };
}

/** The time a test wants, written the way the schema writes its own. */
export function timeAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600_000).toISOString();
}
