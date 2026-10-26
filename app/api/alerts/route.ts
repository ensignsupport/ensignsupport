import { createHash, timingSafeEqual } from "node:crypto";
import { processOutbox, queueDailyReminder } from "@/lib/server/email";
import { log, logError } from "@/lib/server/log";

export const dynamic = "force-dynamic";

/**
 * The hourly alerts job, which replaces the Netlify scheduled function.
 * See docs/decisions/0008-moving-to-cloudflare.md.
 *
 * - Sends any alert email that has not gone out yet (for example while Resend
 *   was not set up, or had a hiccup).
 * - At 8am Brisbane time, queues the daily reminder if any referral has been
 *   marked New for more than 24 hours. Count and link only.
 *
 * Only the Worker's own cron trigger calls this, through worker.ts, which sends
 * the CRON_SECRET. Without that header the route does not admit it exists.
 */
const sha256 = (value: string) => createHash("sha256").update(value).digest();

function allowed(request: Request): boolean {
  const secret = process.env.CRON_SECRET ?? "";
  const given = request.headers.get("x-cron-secret") ?? "";
  if (secret.length < 16 || given.length === 0) return false;
  // Hashing both sides first makes the comparison the same length, and the
  // same time, every time.
  return timingSafeEqual(sha256(given), sha256(secret));
}

export async function POST(request: Request) {
  if (!allowed(request)) return new Response(null, { status: 404 });
  try {
    const hourInBrisbane = Number(
      new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Brisbane", hour: "numeric", hour12: false }).format(new Date()),
    );
    if (hourInBrisbane === 8) {
      const queued = await queueDailyReminder();
      log("reminder.checked", { queued });
    }
    const result = await processOutbox(50);
    log("outbox.processed", result);
    return Response.json({ ok: true, ...result }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    logError("alerts.job_failed", error);
    return Response.json({ ok: false }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
