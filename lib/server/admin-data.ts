import "server-only";
import { query, transaction, type Queryable } from "./db";
import { log } from "./log";
import { type EnquiryStatus, type ReferralStatus, ENQUIRY_STATUS_IDS, REFERRAL_STATUS_IDS } from "@/lib/admin/labels";

/**
 * Reading and changing referrals and enquiries for the admin.
 * Callers must have checked the session first (app/admin/actions.ts).
 * Nothing here is ever deleted: Closed is the furthest a record can go.
 */

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
       FROM referrals ORDER BY created_at DESC LIMIT $1`,
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
  const rows = await query<{ id: number; status: string }>(`SELECT id, status FROM referrals WHERE ref = $1`, [ref]);
  return rows[0] ?? null;
}

export async function referralDetail(ref: string): Promise<ReferralDetail | null> {
  const rows = await query<{
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
       FROM referrals WHERE ref = $1`,
    [ref],
  );
  const found = rows[0];
  if (!found) return null;
  const [notes, history] = await Promise.all([
    query<{ id: number; body: string; created_at: Date }>(
      `SELECT id, body, created_at FROM referral_notes WHERE referral_id = $1 ORDER BY created_at DESC, id DESC`,
      [found.id],
    ),
    query<{ from_status: string | null; to_status: string; changed_at: Date }>(
      `SELECT from_status, to_status, changed_at FROM referral_status_history
        WHERE referral_id = $1 ORDER BY changed_at DESC, id DESC`,
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

export async function setReferralStatus(ref: string, status: ReferralStatus): Promise<boolean> {
  if (!REFERRAL_STATUS_IDS.includes(status)) return false;
  return transaction(async (client) => {
    const { rows } = await client.query<{ id: number; status: string }>(
      `SELECT id, status FROM referrals WHERE ref = $1 FOR UPDATE`,
      [ref],
    );
    const row = rows[0];
    if (!row) return false;
    if (row.status === status) return true;
    await client.query(`UPDATE referrals SET status = $2, updated_at = now() WHERE id = $1`, [row.id, status]);
    await client.query(`INSERT INTO referral_status_history (referral_id, from_status, to_status) VALUES ($1, $2, $3)`, [
      row.id,
      row.status,
      status,
    ]);
    log("admin.referral_status_changed", { ref, to: status });
    return true;
  });
}

export async function addReferralNote(ref: string, body: string): Promise<boolean> {
  const found = await referralId(ref);
  if (!found) return false;
  await query(`INSERT INTO referral_notes (referral_id, body) VALUES ($1, $2)`, [found.id, body]);
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
    created_at: Date;
    status: EnquiryStatus;
    read_at: Date | null;
    name: string;
    email: string;
    preview: string;
    long: boolean;
  }>(
    `SELECT ref, created_at, status, read_at, name, email,
            left(message, $2) AS preview, char_length(message) > $2 AS long
       FROM enquiries ORDER BY created_at DESC LIMIT $1`,
    [MAX_ROWS, PREVIEW],
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
  const rows = await query<{ id: number; message: string; phone: string | null }>(
    `UPDATE enquiries SET read_at = COALESCE(read_at, now()) WHERE ref = $1 RETURNING id, message, phone`,
    [ref],
  );
  if (!rows[0]) return null;
  const messages = await query<{ body: string; sent_at: Date; delivery_status: ThreadLine["delivery"] }>(
    `SELECT body, sent_at, delivery_status FROM enquiry_messages WHERE enquiry_id = $1 ORDER BY sent_at, id`,
    [rows[0].id],
  );
  return {
    message: rows[0].message,
    phone: rows[0].phone,
    thread: messages.map((m) => ({ body: m.body, at: new Date(m.sent_at).toISOString(), delivery: m.delivery_status })),
  };
}

async function changeEnquiryStatus(
  client: Queryable,
  id: number,
  from: string,
  to: EnquiryStatus,
) {
  if (from === to) return;
  await client.query(`UPDATE enquiries SET status = $2, updated_at = now() WHERE id = $1`, [id, to]);
  await client.query(`INSERT INTO enquiry_status_history (enquiry_id, from_status, to_status) VALUES ($1, $2, $3)`, [
    id,
    from,
    to,
  ]);
}

export async function setEnquiryStatus(ref: string, status: EnquiryStatus): Promise<boolean> {
  if (!ENQUIRY_STATUS_IDS.includes(status)) return false;
  return transaction(async (client) => {
    const { rows } = await client.query<{ id: number; status: string }>(
      `SELECT id, status FROM enquiries WHERE ref = $1 FOR UPDATE`,
      [ref],
    );
    if (!rows[0]) return false;
    await changeEnquiryStatus(client, rows[0].id, rows[0].status, status);
    log("admin.enquiry_status_changed", { ref, to: status });
    return true;
  });
}

/**
 * Stores the reply, queues it to be emailed from Ensign's address, and marks
 * the enquiry Replied, all at once. The email goes out through the outbox, so
 * it is retried until it is sent and never sent twice.
 */
export async function queueEnquiryReply(ref: string, body: string): Promise<boolean> {
  return transaction(async (client) => {
    const { rows } = await client.query<{ id: number; status: string }>(
      `SELECT id, status FROM enquiries WHERE ref = $1 FOR UPDATE`,
      [ref],
    );
    if (!rows[0]) return false;
    const { rows: msg } = await client.query<{ id: number }>(
      `INSERT INTO enquiry_messages (enquiry_id, body) VALUES ($1, $2) RETURNING id`,
      [rows[0].id, body],
    );
    await client.query(`INSERT INTO email_outbox (kind, ref, message_id) VALUES ('enquiry_reply', $1, $2)`, [ref, msg[0].id]);
    await changeEnquiryStatus(client, rows[0].id, rows[0].status, "replied");
    log("admin.enquiry_reply_queued", { ref });
    return true;
  });
}
