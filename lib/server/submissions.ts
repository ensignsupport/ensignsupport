import "server-only";
import type { Enquiry, Referral } from "@/lib/forms/schema";
import { batch, first } from "./db";

/**
 * Saves a referral and queues its alert in one batch, so a referral never
 * exists without its alert and an alert never points at nothing.
 *
 * D1 cannot read a row mid-transaction and decide what to write next, so each
 * statement is keyed on the submission id the browser made and does nothing if
 * its work is already done. A retried save adds nothing and gives back the
 * reference the first attempt made.
 *
 * The reference itself is read after the batch, not returned by the insert:
 * SQLite fills RETURNING before the trigger that sets the reference runs.
 */
export async function saveReferral(r: Referral): Promise<string> {
  const self = r.referrerType === "participant";
  await batch([
    {
      sql: `INSERT INTO referrals (
              submission_id, referrer_type, referrer_name, referrer_org_role, referrer_phone, referrer_email,
              participant_name, participant_preferred_contact, participant_phone, participant_email, participant_suburb,
              plan_type, service, reason, consent, consent_at, heard_via)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), ?)
            ON CONFLICT (submission_id) DO NOTHING`,
      params: [
        r.submissionId,
        r.referrerType,
        r.referrerName,
        r.referrerType === "professional" ? (r.referrerOrgRole ?? null) : null,
        r.referrerPhone,
        r.referrerEmail,
        self ? r.referrerName : r.participantName,
        self ? null : (r.participantPreferredContact ?? null),
        self ? r.referrerPhone : r.participantPhone,
        self ? r.referrerEmail : r.participantEmail,
        r.participantSuburb,
        r.planType,
        r.service,
        r.reason,
        r.heardVia ?? null,
      ],
    },
    {
      sql: `INSERT INTO referral_status_history (referral_id, from_status, to_status)
            SELECT r.id, NULL, 'new' FROM referrals r
             WHERE r.submission_id = ?
               AND NOT EXISTS (SELECT 1 FROM referral_status_history h WHERE h.referral_id = r.id)`,
      params: [r.submissionId],
    },
    {
      sql: `INSERT INTO email_outbox (kind, ref)
            SELECT 'new_referral', r.ref FROM referrals r
             WHERE r.submission_id = ?
               AND NOT EXISTS (SELECT 1 FROM email_outbox o WHERE o.kind = 'new_referral' AND o.ref = r.ref)`,
      params: [r.submissionId],
    },
  ]);
  const row = await first<{ ref: string }>(`SELECT ref FROM referrals WHERE submission_id = ?`, [r.submissionId]);
  if (!row) throw new Error("referral was not saved");
  return row.ref;
}

export async function saveEnquiry(e: Enquiry): Promise<string> {
  await batch([
    {
      sql: `INSERT INTO enquiries (submission_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT (submission_id) DO NOTHING`,
      params: [e.submissionId, e.name, e.email, e.phone ?? null, e.message],
    },
    {
      sql: `INSERT INTO enquiry_status_history (enquiry_id, from_status, to_status)
            SELECT q.id, NULL, 'new' FROM enquiries q
             WHERE q.submission_id = ?
               AND NOT EXISTS (SELECT 1 FROM enquiry_status_history h WHERE h.enquiry_id = q.id)`,
      params: [e.submissionId],
    },
    {
      sql: `INSERT INTO email_outbox (kind, ref)
            SELECT 'new_enquiry', q.ref FROM enquiries q
             WHERE q.submission_id = ?
               AND NOT EXISTS (SELECT 1 FROM email_outbox o WHERE o.kind = 'new_enquiry' AND o.ref = q.ref)`,
      params: [e.submissionId],
    },
  ]);
  const row = await first<{ ref: string }>(`SELECT ref FROM enquiries WHERE submission_id = ?`, [e.submissionId]);
  if (!row) throw new Error("enquiry was not saved");
  return row.ref;
}

/**
 * True when the database refused the data itself (a check, a unique column or
 * the wrong kind of value), not because it was unreachable. Trying again cannot
 * help. D1 reports these in the error text rather than as a code, the way
 * Postgres did with its 22 and 23 classes.
 */
export function isDataError(error: unknown): boolean {
  const message = error instanceof Error ? `${error.message} ${error.cause instanceof Error ? error.cause.message : ""}` : String(error);
  return /SQLITE_CONSTRAINT|SQLITE_MISMATCH|constraint failed|datatype mismatch|too big/i.test(message);
}

/** Tries the save, waits a moment, and tries once more, unless the data itself was refused. */
export async function withRetry<T>(work: () => Promise<T>, waitMs = 600): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (isDataError(error)) throw error;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    return work();
  }
}
