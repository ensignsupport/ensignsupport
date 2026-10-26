import { randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { startDatabase, timeAgo, type TestDatabase } from "../helpers/database";

let database: TestDatabase;
let sink: string;

beforeAll(async () => {
  database = await startDatabase();
  const { useDatabase } = await import("@/lib/server/db");
  useDatabase(database.db);
  sink = path.join(mkdtempSync(path.join(tmpdir(), "ensign-")), "emails.jsonl");
  process.env.SITE_URL = "https://example.test";
  process.env.ALERT_TO = "andrew@example.test";
});

afterAll(async () => {
  const { useDatabase } = await import("@/lib/server/db");
  useDatabase(null);
  await database.stop();
});

beforeEach(async () => {
  await database.reset();
});

async function addReferral(hoursAgo: number, status = "new") {
  await database.sql(
    `INSERT INTO referrals (submission_id, created_at, status, referrer_type, referrer_name, referrer_phone, referrer_email,
       participant_name, participant_phone, participant_email, participant_suburb, plan_type, service, reason, consent, consent_at)
     VALUES (?, ?, ?, 'participant', 'Secret Name', '0400000000', 'secret@example.test',
       'Secret Name', '0400000000', 'secret@example.test', 'Springfield 4300', 'self_managed', 'both', 'secret reason', 1,
       strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    randomUUID(),
    timeAgo(hoursAgo),
    status,
  );
}

const lines = () => readFileSync(sink, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

describe("alerts", () => {
  test("alerts wait in the outbox until email is set up, then go out once", async () => {
    delete process.env.EMAIL_SINK_FILE;
    delete process.env.RESEND_API_KEY;
    const { processOutbox } = await import("@/lib/server/email");
    await database.sql(`INSERT INTO email_outbox (kind, ref) VALUES ('new_referral', 'R-2001')`);

    const waiting = await processOutbox();
    expect(waiting).toEqual({ sent: 0, failed: 0, waiting: 1 });

    process.env.EMAIL_SINK_FILE = sink;
    expect(await processOutbox()).toMatchObject({ sent: 1 });
    expect(await processOutbox()).toMatchObject({ sent: 0 });
    const sent = lines().filter((m) => m.subject === "New referral R-2001");
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toEqual(["andrew@example.test"]);
    expect(sent[0].text).toContain("https://example.test/admin/referrals?ref=R-2001");
  });

  test("daily reminder: only when a referral has been New for over 24 hours, count and link only", async () => {
    process.env.EMAIL_SINK_FILE = sink;
    const { processOutbox, queueDailyReminder } = await import("@/lib/server/email");

    await addReferral(2);
    await addReferral(30, "contacted");
    expect(await queueDailyReminder()).toBe(false);

    await addReferral(30);
    await addReferral(50);
    expect(await queueDailyReminder()).toBe(true);
    await processOutbox();
    const reminder = lines().find((m) => m.subject === "2 referrals still marked New");
    expect(reminder).toBeTruthy();
    expect(reminder.text).toContain("/admin/referrals?status=new");
    expect(JSON.stringify(reminder)).not.toContain("Secret");
    expect(JSON.stringify(reminder)).not.toContain("secret");
  });

  test("replies to enquiries wait until email is set up, then go to the enquirer from Ensign, once", async () => {
    delete process.env.EMAIL_SINK_FILE;
    delete process.env.RESEND_API_KEY;
    const { processOutbox } = await import("@/lib/server/email");
    const submission = randomUUID();
    await database.sql(
      `INSERT INTO enquiries (submission_id, name, email, message) VALUES (?, 'Wendy', 'wendy@example.test', 'Question')`,
      submission,
    );
    // The reference is set by a trigger, so it is read back rather than returned.
    const enquiry = (await database.sql(`SELECT id, ref FROM enquiries WHERE submission_id = ?`, submission))[0];
    const message = (
      await database.sql(`INSERT INTO enquiry_messages (enquiry_id, body) VALUES (?, 'Yes we can help. Reply 77a.') RETURNING id`, enquiry.id)
    )[0];
    await database.sql(`INSERT INTO email_outbox (kind, ref, message_id) VALUES ('enquiry_reply', ?, ?)`, enquiry.ref, message.id);

    expect(await processOutbox()).toMatchObject({ sent: 0, waiting: 1 });
    const pending = await database.sql(`SELECT delivery_status FROM enquiry_messages WHERE id = ?`, message.id);
    expect(pending[0].delivery_status).toBe("pending");

    process.env.EMAIL_SINK_FILE = sink;
    expect(await processOutbox()).toMatchObject({ sent: 1 });
    expect(await processOutbox()).toMatchObject({ sent: 0 });
    const sent = lines().filter((l) => l.text.includes("Reply 77a"));
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toEqual(["wendy@example.test"]);
    expect(sent[0].replyTo).toBe("andrew@example.test");
    const delivered = await database.sql(`SELECT delivery_status FROM enquiry_messages WHERE id = ?`, message.id);
    expect(delivered[0].delivery_status).toBe("sent");
  });

  test("the sign in lockout alert holds the time only", async () => {
    process.env.EMAIL_SINK_FILE = sink;
    const { processOutbox } = await import("@/lib/server/email");
    await database.sql(`INSERT INTO email_outbox (kind) VALUES ('login_lockout')`);
    await processOutbox();
    const alert = lines().find((l) => l.subject === "Admin sign in locked after failed attempts");
    expect(alert.to).toEqual(["andrew@example.test"]);
    expect(alert.text).toMatch(/Brisbane time/);
  });
});
