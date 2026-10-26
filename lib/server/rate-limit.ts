import "server-only";
import { first, run } from "./db";

/**
 * Counts submissions per key per hour. Returns false once the limit is hit.
 * Old windows are cleared as it goes.
 *
 * The window is the top of the current hour, which is what Postgres worked out
 * with date_trunc. The upsert returns the new count, so this stays one
 * statement and two submissions arriving together are still both counted.
 */
export async function allow(key: string, limitPerHour: number): Promise<boolean> {
  const row = await first<{ count: number }>(
    `INSERT INTO rate_limits (key, window_start, count)
     VALUES (?, strftime('%Y-%m-%dT%H:00:00.000Z', 'now'), 1)
     ON CONFLICT (key, window_start) DO UPDATE SET count = count + 1
     RETURNING count`,
    [key],
  );
  await run(`DELETE FROM rate_limits WHERE window_start < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day')`);
  return (row?.count ?? 0) <= limitPerHour;
}
