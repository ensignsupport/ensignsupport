import "server-only";
import { batch, first, query, type Statement } from "./db";
import { log } from "./log";
import { type EnquiryStatus, type ReferralStatus, ENQUIRY_STATUS_IDS, REFERRAL_STATUS_IDS } from "@/lib/admin/labels";

/**
 * Reading and changing referrals and enquiries for the admin.
 * Callers must have checked the session first (app/admin/actions.ts).
 * Records are never deleted by a status change. A Closed record can be removed
 * for good with removeReferral or removeEnquiry, when its keeping period ends
 * (Privacy Policy v2.0 clause 11). Only a non-identifying row in
 * removed_records is kept.
 *
 * D1 has no interactive transactions and no row locks, so each change reads
 * once for the answer the admin sees, then runs a batch whose every statement
 * carries the same condition in its WHERE. The batch is one transaction, so a
 * change either happens completely or not at all. See
 * docs/decisions/0008-moving-to-cloudflare.md.
 */

/** The time, written the way the schema writes its own. */
const NOW = `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`;

/**
 * What the list needs, and no more. Contact details and the reason (which can
 * hold health information) are only sent when a referral is opened, and every
 * opening is recorded in the access log.
 */
export type ReferralRow = {
  ref: string;
  createdAt: string;
  status: ReferralStatus;
  referrerType: string;
  referrerName: string;
  referrerOrgRole: string | null;
  participantName: string;
  participantSuburb: string;
  planType: string;
  service: string;
};

export type HistoryLine = { from: string | null; to: string; at: string };
export type NoteLine = { id: number; body: string; at: string };
export type ReferralDetail = {
  referrerPhone: string;
  referrerEmail: string;
  participantPreferredContact: string | null;
  participantPhone: string;
  participantEmail: string;
  reason: string;
  heardVia: string | null;
  notes: NoteLine[];
  history: HistoryLine[];
};

const MAX_ROWS = 2000;

export async function listReferrals(): Promise<ReferralRow[]> {
  const rows = await query<Record<string, string | null>>(
    `SELECT ref, created_at, status, referrer_type, referrer_name, referrer_org_role,
            participant_name, participant_suburb, plan_type, service
       FROM referrals ORDER BY created_at DESC LIMIT ?`,
    [MAX_ROWS],
  );
  return rows.map((r) => ({
    ref: r.ref!,
    createdAt: new Date(r.created_at!).toISOString(),
    status: r.status as ReferralStatus,
    referrerType: r.referrer_type!,
    referrerName: r.referrer_name!,
    referrerOrgRole: r.referrer_org_role,
    participantName: r.participant_name!,
    participantSuburb: r.participant_suburb!,
    planType: r.plan_type!,
    service: r.service!,
  }));
}

async function referralId(ref: string): Promise<{ id: number; status: string } | null> {
  return first<{ id: number; status: string }>(`SELECT id, status FROM referrals WHERE ref = ?`, [ref]);
}

export async function referralDetail(ref: string): Promise<ReferralDetail | null> {
  const found = await first<{
    id: number;
    referrer_phone: string;
    referrer_email: string;
    participant_preferred_contact: string | null;
    participant_phone: string;
    participant_email: string;
    reason: string;
    heard_via: string | null;
  }>(
    `SELECT id, referrer_phone, referrer_email, participant_preferred_contact, participant_phone,
            participant_email, reason, heard_via
       FROM referrals WHERE ref = ?`,
    [ref],
  );
  if (!found) return null;
  const [notes, history] = await Promise.all([
    query<{ id: number; body: string; created_at: string }>(
      `SELECT id, body, created_at FROM referral_notes WHERE referral_id = ? ORDER BY created_at DESC, id DESC`,
      [found.id],
    ),
    query<{ from_status: string | null; to_status: string; changed_at: string }>(
      `SELECT from_status, to_status, changed_at FROM referral_status_history
        WHERE referral_id = ? ORDER BY changed_at DESC, id DESC`,
      [found.id],
    ),
  ]);
  return {
    referrerPhone: found.referrer_phone,
    referrerEmail: found.referrer_email,
    participantPreferredContact: found.participant_preferred_contact,
    participantPhone: found.participant_phone,
    participantEmail: found.participant_email,
    reason: found.reason,
    heardVia: found.heard_via,
    notes: notes.map((n) => ({ id: n.id, body: n.body, at: new Date(n.created_at).toISOString() })),
    history: history.map((h) => ({ from: h.from_status, to: h.to_status, at: new Date(h.changed_at).toISOString() })),
  };
}

/**
 * The history line has to be written before the update, because it reads the
 * status the record is moving away from. Both carry the same condition, so if
 * the status changed underneath us neither does anything.
 */
function statusChange(table: "referrals" | "enquiries", historyTable: string, idColumn: string, ref: string, to: string): Statement[] {
  return [
    {
      sql: `INSERT INTO ${historyTable} (${idColumn}, from_status, to_status)
            SELECT id, status, ? FROM ${table} WHERE ref = ? AND status <> ?`,
      params: [to, ref, to],
    },
    {
      sql: `UPDATE ${table} SET status = ?, updated_at = ${NOW} WHERE ref = ? AND status <> ?`,
      params: [to, ref, to],
    },
  ];
}

export async function setReferralStatus(ref: string, status: ReferralStatus): Promise<boolean> {
  if (!REFERRAL_STATUS_IDS.includes(status)) return false;
  const row = await referralId(ref);
  if (!row) return false;
  if (row.status === status) return true;
  await batch(statusChange("referrals", "referral_status_history", "referral_id", ref, status));
  log("admin.referral_status_changed", { ref, to: status });
  return true;
}

export async function addReferralNote(ref: string, body: string): Promise<boolean> {
  const found = await referralId(ref);
  if (!found) return false;
  await batch([{ sql: `INSERT INTO referral_notes (referral_id, body) VALUES (?, ?)`, params: [found.id, body] }]);
  log("admin.referral_note_added", { ref });
  return true;
}

/**
 * The inbox gets a short preview of each message, as the design shows. The
 * full message and the phone number are sent only when an enquiry is opened,
 * and every opening is recorded in the access log.
 */
export type EnquiryRow = {
  ref: string;
  createdAt: string;
  status: EnquiryStatus;
  read: boolean;
  name: string;
  email: string;
  preview: string;
};

export type ThreadLine = { body: string; at: string; delivery: "pending" | "sent" | "failed" };
export type EnquiryDetail = { message: string; phone: string | null; thread: ThreadLine[] };

const PREVIEW = 140;

export async function listEnquiries(): Promise<EnquiryRow[]> {
  const rows = await query<{
    ref: string;
    created_at: string;
    status: EnquiryStatus;
    read_at: string | null;
    name: string;
    email: string;
    preview: string;
    long: number;
  }>(
    `SELECT ref, created_at, status, read_at, name, email,
            substr(message, 1, ?) AS preview, length(message) > ? AS long
       FROM enquiries ORDER BY created_at DESC LIMIT ?`,
    [PREVIEW, PREVIEW, MAX_ROWS],
  );
  return rows.map((r) => ({
    ref: r.ref,
    createdAt: new Date(r.created_at).toISOString(),
    status: r.status,
    read: r.read_at !== null,
    name: r.name,
    email: r.email,
    preview: r.long ? `${r.preview.trimEnd()}…` : r.preview,
  }));
}

/** The full message, phone and replies so far. Opening an enquiry marks it read. */
export async function openEnquiry(ref: string): Promise<EnquiryDetail | null> {
  const row = await first<{ id: number; message: string; phone: string | null }>(
    `UPDATE enquiries SET read_at = COALESCE(read_at, ${NOW}) WHERE ref = ? RETURNING id, message, phone`,
    [ref],
  );
  if (!row) return null;
  const messages = await query<{ body: string; sent_at: string; delivery_status: ThreadLine["delivery"] }>(
    `SELECT body, sent_at, delivery_status FROM enquiry_messages WHERE enquiry_id = ? ORDER BY sent_at, id`,
    [row.id],
  );
  return {
    message: row.message,
    phone: row.phone,
    thread: messages.map((m) => ({ body: m.body, at: new Date(m.sent_at).toISOString(), delivery: m.delivery_status })),
  };
}

export async function setEnquiryStatus(ref: string, status: EnquiryStatus): Promise<boolean> {
  if (!ENQUIRY_STATUS_IDS.includes(status)) return false;
  const row = await first<{ status: string }>(`SELECT status FROM enquiries WHERE ref = ?`, [ref]);
  if (!row) return false;
  if (row.status !== status) {
    await batch(statusChange("enquiries", "enquiry_status_history", "enquiry_id", ref, status));
  }
  log("admin.enquiry_status_changed", { ref, to: status });
  return true;
}

/**
 * Stores the reply, queues it to be emailed from Ensign's address, and marks
 * the enquiry Replied, all in one batch. The email goes out through the outbox,
 * so it is retried until it is sent and never sent twice.
 *
 * The outbox row finds the reply by the highest id for that enquiry, because
 * the insert before it in the batch has just made it and D1 cannot hand an id
 * from one statement to the next.
 */
export async function queueEnquiryReply(ref: string, body: string): Promise<boolean> {
  const row = await first<{ id: number }>(`SELECT id FROM enquiries WHERE ref = ?`, [ref]);
  if (!row) return false;
  await batch([
    { sql: `INSERT INTO enquiry_messages (enquiry_id, body) VALUES (?, ?)`, params: [row.id, body] },
    {
      sql: `INSERT INTO email_outbox (kind, ref, message_id)
            SELECT 'enquiry_reply', ?, max(id) FROM enquiry_messages WHERE enquiry_id = ?`,
      params: [ref, row.id],
    },
    ...statusChange("enquiries", "enquiry_status_history", "enquiry_id", ref, "replied"),
  ]);
  log("admin.enquiry_reply_queued", { ref });
  return true;
}

export type RemoveResult = "removed" | "not_found" | "not_closed";

/**
 * Deletes a Closed referral for good: its personal details, the reason, notes
 * and status history. Keeps only the reference number, the day it was received
 * and when it was removed (removed_records). Refuses anything not Closed, so a
 * live referral can never be removed by mistake.
 *
 * received_on is the Brisbane day. Queensland is UTC+10 all year with no
 * daylight saving, so adding 10 hours to the stored UTC time is exact.
 */
export async function removeReferral(ref: string): Promise<RemoveResult> {
  const row = await first<{ status: string }>(`SELECT status FROM referrals WHERE ref = ?`, [ref]);
  if (!row) return "not_found";
  if (row.status !== "closed") return "not_closed";
  await batch([
    {
      sql: `INSERT OR IGNORE INTO removed_records (ref, kind, received_on)
            SELECT ref, 'referral', date(created_at, '+10 hours') FROM referrals WHERE ref = ? AND status = 'closed'`,
      params: [ref],
    },
    {
      sql: `DELETE FROM referral_notes
             WHERE referral_id IN (SELECT id FROM referrals WHERE ref = ? AND status = 'closed')`,
      params: [ref],
    },
    {
      sql: `DELETE FROM referral_status_history
             WHERE referral_id IN (SELECT id FROM referrals WHERE ref = ? AND status = 'closed')`,
      params: [ref],
    },
    { sql: `DELETE FROM referrals WHERE ref = ? AND status = 'closed'`, params: [ref] },
  ]);
  log("admin.referral_removed", { ref });
  return "removed";
}

/**
 * Deletes a Closed enquiry for good: the message, contact details, replies and
 * status history. Sent-email records keep only the reference number. Keeps a
 * non-identifying row in removed_records.
 */
export async function removeEnquiry(ref: string): Promise<RemoveResult> {
  const row = await first<{ status: string }>(`SELECT status FROM enquiries WHERE ref = ?`, [ref]);
  if (!row) return "not_found";
  if (row.status !== "closed") return "not_closed";
  const closed = `(SELECT id FROM enquiries WHERE ref = ? AND status = 'closed')`;
  await batch([
    {
      sql: `INSERT OR IGNORE INTO removed_records (ref, kind, received_on)
            SELECT ref, 'enquiry', date(created_at, '+10 hours') FROM enquiries WHERE ref = ? AND status = 'closed'`,
      params: [ref],
    },
    {
      sql: `UPDATE email_outbox SET message_id = NULL
             WHERE message_id IN (SELECT id FROM enquiry_messages WHERE enquiry_id IN ${closed})`,
      params: [ref],
    },
    { sql: `DELETE FROM enquiry_messages WHERE enquiry_id IN ${closed}`, params: [ref] },
    { sql: `DELETE FROM enquiry_status_history WHERE enquiry_id IN ${closed}`, params: [ref] },
    { sql: `DELETE FROM enquiries WHERE ref = ? AND status = 'closed'`, params: [ref] },
  ]);
  log("admin.enquiry_removed", { ref });
  return "removed";
}
