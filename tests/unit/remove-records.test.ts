import { NetlifyDB } from "@netlify/database-dev";
import pg from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";

// admin-data is server code; this marker module only stops it reaching the browser.
vi.mock("server-only", () => ({}));

// Removing a Closed referral or enquiry for good (Privacy Policy v2.0 clause 11.3).

let db: NetlifyDB;
let client: pg.Client;

beforeAll(async () => {
  db = new NetlifyDB();
  process.env.NETLIFY_DB_URL = await db.start();
  await db.applyMigrations("./netlify/database/migrations");
  client = new pg.Client({ connectionString: process.env.NETLIFY_DB_URL });
  await client.connect();
});

afterAll(async () => {
  const { closeDb } = await import("@/lib/server/db");
  await closeDb();
  await client.end();
  await db.stop();
});

beforeEach(async () => {
  await client.query(
    `DELETE FROM removed_records; DELETE FROM email_outbox; DELETE FROM enquiry_status_history; DELETE FROM enquiry_messages;
     DELETE FROM enquiries; DELETE FROM referral_notes; DELETE FROM referral_status_history; DELETE FROM referrals;`,
  );
});

async function addReferral(status: string): Promise<{ id: number; ref: string }> {
  const { rows } = await client.query(
    `INSERT INTO referrals (submission_id, status, referrer_type, referrer_name, referrer_phone, referrer_email,
       participant_name, participant_phone, participant_email, participant_suburb, plan_type, service, reason, consent, consent_at)
     VALUES (gen_random_uuid(), $1, 'family', 'Secret Referrer', '0400000000', 'ref@example.test',
       'Secret Participant', '0400000001', 'part@example.test', 'Springfield 4300', 'self_managed', 'both', 'secret reason', true, now())
     RETURNING id, ref`,
    [status],
  );
  await client.query(`INSERT INTO referral_notes (referral_id, body) VALUES ($1, 'secret note')`, [rows[0].id]);
  await client.query(`INSERT INTO referral_status_history (referral_id, from_status, to_status) VALUES ($1, 'new', $2)`, [
    rows[0].id,
    status,
  ]);
  return rows[0];
}

async function addEnquiry(status: string): Promise<{ id: number; ref: string }> {
  const { rows } = await client.query(
    `INSERT INTO enquiries (submission_id, status, name, email, phone, message)
     VALUES (gen_random_uuid(), $1, 'Secret Enquirer', 'enq@example.test', '0400000002', 'secret message') RETURNING id, ref`,
    [status],
  );
  const { rows: msg } = await client.query(
    `INSERT INTO enquiry_messages (enquiry_id, body, delivery_status) VALUES ($1, 'secret reply', 'sent') RETURNING id`,
    [rows[0].id],
  );
  await client.query(`INSERT INTO email_outbox (kind, ref, message_id, status) VALUES ('enquiry_reply', $1, $2, 'sent')`, [
    rows[0].ref,
    msg[0].id,
  ]);
  await client.query(`INSERT INTO enquiry_status_history (enquiry_id, from_status, to_status) VALUES ($1, 'new', $2)`, [
    rows[0].id,
    status,
  ]);
  return rows[0];
}

const count = async (sql: string, params: unknown[] = []) => (await client.query(sql, params)).rows[0].n as number;

describe("removing records", () => {
  test("a Closed referral is deleted with its notes and history, and only a non-identifying row is kept", async () => {
    const { removeReferral } = await import("@/lib/server/admin-data");
    const r = await addReferral("closed");
    expect(await removeReferral(r.ref)).toBe("removed");
    expect(await count(`SELECT count(*)::int AS n FROM referrals`)).toBe(0);
    expect(await count(`SELECT count(*)::int AS n FROM referral_notes`)).toBe(0);
    expect(await count(`SELECT count(*)::int AS n FROM referral_status_history`)).toBe(0);
    const kept = (await client.query(`SELECT * FROM removed_records`)).rows;
    expect(kept).toHaveLength(1);
    expect(kept[0]).toMatchObject({ ref: r.ref, kind: "referral" });
    expect(JSON.stringify(kept[0])).not.toMatch(/Secret|secret|example\.test|0400/);
  });

  test("a referral that is not Closed is refused and left as it was", async () => {
    const { removeReferral } = await import("@/lib/server/admin-data");
    const r = await addReferral("accepted");
    expect(await removeReferral(r.ref)).toBe("not_closed");
    expect(await count(`SELECT count(*)::int AS n FROM referrals`)).toBe(1);
    expect(await count(`SELECT count(*)::int AS n FROM removed_records`)).toBe(0);
    expect(await removeReferral("R-999999")).toBe("not_found");
  });

  test("a Closed enquiry is deleted with its replies; the sent-email record keeps only the reference", async () => {
    const { removeEnquiry } = await import("@/lib/server/admin-data");
    const e = await addEnquiry("closed");
    expect(await removeEnquiry(e.ref)).toBe("removed");
    expect(await count(`SELECT count(*)::int AS n FROM enquiries`)).toBe(0);
    expect(await count(`SELECT count(*)::int AS n FROM enquiry_messages`)).toBe(0);
    expect(await count(`SELECT count(*)::int AS n FROM enquiry_status_history`)).toBe(0);
    const outbox = (await client.query(`SELECT ref, message_id FROM email_outbox`)).rows;
    expect(outbox).toEqual([{ ref: e.ref, message_id: null }]);
    expect((await client.query(`SELECT kind FROM removed_records WHERE ref = $1`, [e.ref])).rows[0].kind).toBe("enquiry");
  });

  test("an enquiry that is not Closed is refused", async () => {
    const { removeEnquiry } = await import("@/lib/server/admin-data");
    const e = await addEnquiry("replied");
    expect(await removeEnquiry(e.ref)).toBe("not_closed");
    expect(await count(`SELECT count(*)::int AS n FROM enquiries`)).toBe(1);
  });
});
