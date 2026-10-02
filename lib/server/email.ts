import { appendFileSync } from "node:fs";
import { Resend } from "resend";
import { query } from "./db";
import { log, logError } from "./log";

/**
 * Alert emails. Rule (admin-security-requirements.md, item 6): an alert holds a
 * reference number and a link to the admin, never names, health details or
 * anything a person typed.
 *
 * Settings, kept only in Netlify's environment settings:
 *   RESEND_API_KEY  Resend key
 *   EMAIL_FROM      sender, for example "Ensign Support Services <alerts@ensignsupport.com.au>"
 *   ALERT_TO        who gets alerts, comma separated
 *   SITE_URL        the site address, used for admin links
 * Until they are set, alerts wait in the outbox and go out once they are.
 */

export type OutboxKind = "new_referral" | "new_enquiry" | "daily_reminder";

type Message = { to: string[]; subject: string; text: string };

const BRISBANE = new Intl.DateTimeFormat("en-AU", {
  timeZone: "Australia/Brisbane",
  dateStyle: "medium",
  timeStyle: "short",
});

function siteUrl() {
  return (process.env.SITE_URL ?? "").replace(/\/$/, "");
}

function recipients(): string[] {
  return (process.env.ALERT_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function emailReady(): boolean {
  if (!process.env.SITE_URL || recipients().length === 0) return false;
  return Boolean(process.env.EMAIL_SINK_FILE || (process.env.RESEND_API_KEY && process.env.EMAIL_FROM));
}

function compose(kind: OutboxKind, ref: string | null, count?: number): Message {
  const footer = "\n\nThis email has no personal details in it, to keep them private. Sign in to the admin area to read them.";
  if (kind === "new_referral") {
    return {
      to: recipients(),
      subject: `New referral ${ref}`,
      text: `A new referral (${ref}) has come in through the website.\n\nOpen it: ${siteUrl()}/admin/referrals?ref=${ref}${footer}`,
    };
  }
  if (kind === "new_enquiry") {
    return {
      to: recipients(),
      subject: `New enquiry ${ref}`,
      text: `A new enquiry (${ref}) has come in through the Contact page.\n\nOpen it: ${siteUrl()}/admin/enquiries?ref=${ref}${footer}`,
    };
  }
  const n = count ?? 0;
  return {
    to: recipients(),
    subject: `${n} referral${n === 1 ? "" : "s"} still marked New`,
    text: `${n} referral${n === 1 ? " has" : "s have"} been marked New for more than 24 hours.\n\nOpen the list: ${siteUrl()}/admin/referrals?status=new${footer}`,
  };
}

async function deliver(message: Message, idempotencyKey: string): Promise<string> {
  // Tests write emails to a file instead of sending them.
  if (process.env.EMAIL_SINK_FILE) {
    appendFileSync(process.env.EMAIL_SINK_FILE, JSON.stringify({ ...message, idempotencyKey }) + "\n");
    return `sink-${idempotencyKey}`;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send(
    { from: process.env.EMAIL_FROM!, to: message.to, subject: message.subject, text: message.text },
    { idempotencyKey },
  );
  if (error || !data) throw new Error(`Resend: ${error?.name ?? "no response"}`);
  return data.id;
}

/** Queue an alert. Called inside the same transaction that saves the record. */
export async function queueAlert(
  client: { query: (text: string, params?: unknown[]) => Promise<unknown> },
  kind: OutboxKind,
  ref: string | null,
) {
  await client.query(`INSERT INTO email_outbox (kind, ref) VALUES ($1, $2)`, [kind, ref]);
}

/**
 * Sends every alert still waiting. Safe to run at any time: each alert carries
 * an idempotency key, so a retry never sends the same alert twice.
 */
export async function processOutbox(limit = 20): Promise<{ sent: number; failed: number; waiting: number }> {
  if (!emailReady()) {
    const [{ count }] = await query<{ count: number }>(`SELECT count(*)::int AS count FROM email_outbox WHERE status = 'pending'`);
    log("email.not_configured", { waiting: count });
    return { sent: 0, failed: 0, waiting: count };
  }
  const rows = await query<{ id: number; kind: OutboxKind; ref: string | null; attempts: number }>(
    `SELECT id, kind, ref, attempts FROM email_outbox
      WHERE status = 'pending' AND attempts < 8
      ORDER BY created_at LIMIT $1`,
    [limit],
  );
  let sent = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      const count =
        row.kind === "daily_reminder"
          ? (await query<{ count: number }>(
              `SELECT count(*)::int AS count FROM referrals WHERE status = 'new' AND created_at < now() - interval '24 hours'`,
            ))[0].count
          : undefined;
      const providerId = await deliver(compose(row.kind, row.ref, count), `outbox-${row.id}`);
      await query(`UPDATE email_outbox SET status = 'sent', sent_at = now(), attempts = attempts + 1, provider_id = $2 WHERE id = $1`, [
        row.id,
        providerId,
      ]);
      log("email.sent", { kind: row.kind, ref: row.ref });
      sent++;
    } catch (error) {
      const attempts = row.attempts + 1;
      await query(`UPDATE email_outbox SET attempts = $2, last_error = $3, status = $4 WHERE id = $1`, [
        row.id,
        attempts,
        error instanceof Error ? error.message.slice(0, 200) : "error",
        attempts >= 8 ? "failed" : "pending",
      ]);
      logError("email.failed", error, { kind: row.kind, ref: row.ref, attempts });
      failed++;
    }
  }
  return { sent, failed, waiting: rows.length - sent - failed };
}

/** Queue the daily reminder, only when something has been New for over 24 hours. */
export async function queueDailyReminder(): Promise<boolean> {
  const [{ count }] = await query<{ count: number }>(
    `SELECT count(*)::int AS count FROM referrals WHERE status = 'new' AND created_at < now() - interval '24 hours'`,
  );
  if (count === 0) return false;
  await query(`INSERT INTO email_outbox (kind) VALUES ('daily_reminder')`);
  return true;
}

/**
 * Sent straight away, not through the outbox, because it is used when the
 * database itself could not be reached. Holds the time only.
 */
export async function sendSaveFailedAlert(form: "referral" | "enquiry") {
  if (!emailReady()) {
    log("email.save_failed_alert_skipped", { form });
    return;
  }
  const when = BRISBANE.format(new Date());
  const message: Message = {
    to: recipients(),
    subject: `Website: a ${form} could not be saved`,
    text:
      `At ${when} (Brisbane time) someone sent a ${form} and the website could not save it, even after trying again.\n\n` +
      `Their details were not kept. They were asked to try again or get in touch another way.\n\n` +
      `Please check the website, or ask Archway Automation to look at it.`,
  };
  try {
    // One alert per form per 15 minutes at most, however many visitors hit the outage.
    await deliver(message, `save-failed-${form}-${Math.floor(Date.now() / 900_000)}`);
    log("email.save_failed_alert_sent", { form });
  } catch (error) {
    logError("email.save_failed_alert_failed", error, { form });
  }
}
