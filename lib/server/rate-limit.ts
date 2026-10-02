import "server-only";
import { query } from "./db";

/**
 * Counts submissions per key per hour. Returns false once the limit is hit.
 * Old windows are cleared as it goes.
 */
export async function allow(key: string, limitPerHour: number): Promise<boolean> {
  const rows = await query<{ count: number }>(
    `INSERT INTO rate_limits (key, window_start, count)
     VALUES ($1, date_trunc('hour', now()), 1)
     ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limits.count + 1
     RETURNING count`,
    [key],
  );
  await query(`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`);
  return (rows[0]?.count ?? 0) <= limitPerHour;
}
