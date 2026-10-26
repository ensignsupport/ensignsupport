import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { startDatabase, type TestDatabase } from "../helpers/database";

// admin-data is server code; this marker module only stops it reaching the browser.
vi.mock("server-only", () => ({}));

// Removing a Closed referral or enquiry for good (Privacy Policy v2.0 clause 11.3).

let database: TestDatabase;

beforeAll(async () => {
  database = await startDatabase();
  const { useDatabase } = await import("@/lib/server/db");
  useDatabase(database.db);
});

afterAll(async () => {
  const { useDatabase } = await import("@/lib/server/db");
  useDatabase(null);
  await database.stop();
});

beforeEach(async () => {
  await database.reset();
});

/** The reference is set by a trigger, so it is read back rather than returned. */
async function addReferral(status: string): Promise<{ id: number; ref: string }> {
  const submission = randomUUID();
  await database.sql(
    `INSERT INTO referrals (submission_id, status, referrer_type, referrer_name, referrer_phone, referrer_email,
       participant_name, participant_phone, participant_email, participant_suburb, plan_type, service, reason, consent, consent_at)
     VALUES (?, ?, 'family', 'Secret Referrer', '0400000000', 'ref@example.test',
       'Secret Participant', '0400000001', 'part@example.test', 'Springfield 4300', 'self_managed', 'both', 'secret reason', 1,
       strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    submission,
    status,
  );
  const row = (await database.sql(`SELECT id, ref FROM referrals WHERE submission_id = ?`, submission))[0] as {
    id: number;
    ref: string;
  };
  await database.sql(`INSERT INTO referral_notes (referral_id, body) VALUES (?, 'secret note')`, row.id);
  await database.sql(`INSERT INTO referral_status_history (referral_id, from_status, to_status) VALUES (?, 'new', ?)`, row.id, status);
  return row;
}

async function addEnquiry(status: string): Promise<{ id: number; ref: string }> {
  const submission = randomUUID();
  await database.sql(
    `INSERT INTO enquiries (submission_id, status, name, email, phone, message)
     VALUES (?, ?, 'Secret Enquirer', 'enq@example.test', '0400000002', 'secret message')`,
    submission,
    status,
  );
  const row = (await database.sql(`SELECT id, ref FROM enquiries WHERE submission_id = ?`, submission))[0] as {
    id: number;
    ref: string;
  };
  const message = (
    await database.sql(`INSERT INTO enquiry_messages (enquiry_id, body, delivery_status) VALUES (?, 'secret reply', 'sent') RETURNING id`, row.id)
  )[0] as { id: number };
  await database.sql(
    `INSERT INTO email_outbox (kind, ref, message_id, status) VALUES ('enquiry_reply', ?, ?, 'sent')`,
    row.ref,
    message.id,
  );
  await database.sql(`INSERT INTO enquiry_status_history (enquiry_id, from_status, to_status) VALUES (?, 'new', ?)`, row.id, status);
  return row;
}

const count = async (table: string) => Number((await database.sql(`SELECT count(*) AS n FROM ${table}`))[0].n);

describe("removing records", () => {
  test("a Closed referral is deleted with its notes and history, and only a non-identifying row is kept", async () => {
    const { removeReferral } = await import("@/lib/server/admin-data");
    const r = await addReferral("closed");
    expect(await removeReferral(r.ref)).toBe("removed");
    expect(await count("referrals")).toBe(0);
    expect(await count("referral_notes")).toBe(0);
    expect(await count("referral_status_history")).toBe(0);
    const kept = await database.sql(`SELECT * FROM removed_records`);
    expect(kept).toHaveLength(1);
    expect(kept[0]).toMatchObject({ ref: r.ref, kind: "referral" });
    expect(JSON.stringify(kept[0])).not.toMatch(/Secret|secret|example\.test|0400/);
  });

  test("a referral that is not Closed is refused and left as it was", async () => {
    const { removeReferral } = await import("@/lib/server/admin-data");
    const r = await addReferral("accepted");
    expect(await removeReferral(r.ref)).toBe("not_closed");
    expect(await count("referrals")).toBe(1);
    expect(await count("removed_records")).toBe(0);
    expect(await removeReferral("R-999999")).toBe("not_found");
  });

  test("a Closed enquiry is deleted with its replies; the sent-email record keeps only the reference", async () => {
    const { removeEnquiry } = await import("@/lib/server/admin-data");
    const e = await addEnquiry("closed");
    expect(await removeEnquiry(e.ref)).toBe("removed");
    expect(await count("enquiries")).toBe(0);
    expect(await count("enquiry_messages")).toBe(0);
    expect(await count("enquiry_status_history")).toBe(0);
    const outbox = await database.sql(`SELECT ref, message_id FROM email_outbox`);
    expect(outbox).toEqual([{ ref: e.ref, message_id: null }]);
    const kept = await database.sql(`SELECT kind FROM removed_records WHERE ref = ?`, e.ref);
    expect(kept[0].kind).toBe("enquiry");
  });

  test("an enquiry that is not Closed is refused", async () => {
    const { removeEnquiry } = await import("@/lib/server/admin-data");
    const e = await addEnquiry("replied");
    expect(await removeEnquiry(e.ref)).toBe("not_closed");
    expect(await count("enquiries")).toBe(1);
  });
});
