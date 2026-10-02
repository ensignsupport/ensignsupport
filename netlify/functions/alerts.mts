import type { Config } from "@netlify/functions";
import { processOutbox, queueDailyReminder } from "../../lib/server/email";
import { log, logError } from "../../lib/server/log";

/**
 * Runs every hour.
 * - Sends any alert email that has not gone out yet (for example while Resend
 *   was not set up, or had a hiccup).
 * - At 8am Brisbane time, queues the daily reminder if any referral has been
 *   marked New for more than 24 hours. Count and link only.
 */
const alerts = async () => {
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
  } catch (error) {
    logError("alerts.job_failed", error);
  }
};

export default alerts;

export const config: Config = {
  schedule: "@hourly",
};
