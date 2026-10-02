import "server-only";
import type { Enquiry, Referral } from "@/lib/forms/schema";
import { transaction } from "./db";
import { queueAlert } from "./email";

/**
 * Saves a referral and queues its alert in one transaction, so a referral
 * never exists without its alert and an alert never points at nothing.
 */
export async function saveReferral(r: Referral): Promise<string> {
  const self = r.referrerType === "participant";
  return transaction(async (client) => {
    const { rows } = await client.query<{ id: number; ref: string }>(
      `INSERT INTO referrals (
         submission_id, referrer_type, referrer_name, referrer_org_role, referrer_phone, referrer_email,
         participant_name, participant_preferred_contact, participant_phone, participant_email, participant_suburb,
         plan_type, service, reason, consent, consent_at, heard_via)
       VALUES ($15, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true, now(), $14)
       ON CONFLICT (submission_id) DO NOTHING
       RETURNING id, ref`,
      [
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
        r.submissionId,
      ],
    );
    if (rows.length === 0) {
      // Already saved by an earlier attempt: return that one, add nothing.
      const existing = await client.query<{ ref: string }>(`SELECT ref FROM referrals WHERE submission_id = $1`, [r.submissionId]);
      return existing.rows[0].ref;
    }
    const { id, ref } = rows[0];
    await client.query(`INSERT INTO referral_status_history (referral_id, from_status, to_status) VALUES ($1, NULL, 'new')`, [id]);
    await queueAlert(client, "new_referral", ref);
    return ref;
  });
}

export async function saveEnquiry(e: Enquiry): Promise<string> {
  return transaction(async (client) => {
    const { rows } = await client.query<{ id: number; ref: string }>(
      `INSERT INTO enquiries (submission_id, name, email, phone, message) VALUES ($5, $1, $2, $3, $4)
       ON CONFLICT (submission_id) DO NOTHING
       RETURNING id, ref`,
      [e.name, e.email, e.phone ?? null, e.message, e.submissionId],
    );
    if (rows.length === 0) {
      const existing = await client.query<{ ref: string }>(`SELECT ref FROM enquiries WHERE submission_id = $1`, [e.submissionId]);
      return existing.rows[0].ref;
    }
    const { id, ref } = rows[0];
    await client.query(`INSERT INTO enquiry_status_history (enquiry_id, from_status, to_status) VALUES ($1, NULL, 'new')`, [id]);
    await queueAlert(client, "new_enquiry", ref);
    return ref;
  });
}

/**
 * True when the database refused the data itself (a check or a bad
 * character), not because it was unreachable. Trying again cannot help.
 */
export function isDataError(error: unknown): boolean {
  const code = (error as { code?: unknown } | null)?.code;
  return typeof code === "string" && (code.startsWith("22") || code.startsWith("23"));
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
