import { readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { expectNoAxeViolations, expectNoSidewaysScroll, watchErrors } from "./helpers";
import { sql } from "./helpers/browser-db";
import { SCREENS } from "./screens";

/**
 * The private admin (milestone 5). Checks the security rules in
 * archway-rebuild/phase-4-inputs/admin-security-requirements.md and the
 * behaviour in the admin designs, against real saved data.
 */
test.describe.configure({ mode: "serial" });

const RESULTS = path.join(__dirname, "..", "test-results");
const PASS = "correct horse battery staple test"; // scripts/test-server.mjs
const COOKIE = "__Host-ensign_admin";

function emails(): { to: string[]; subject: string; text: string; replyTo?: string }[] {
  return readFileSync(path.join(RESULTS, "emails.jsonl"), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

let ipCounter = 10;
/** Each test signs in from its own address, so the per-address lockout never spills over. */
async function freshContext(browser: Browser, width = 1440, height = 900): Promise<BrowserContext> {
  ipCounter += 1;
  return browser.newContext({
    viewport: { width, height },
    extraHTTPHeaders: { "x-forwarded-for": `203.0.113.${ipCounter}` },
  });
}

async function signIn(page: Page, passphrase = PASS) {
  await page.goto("/admin/sign-in");
  await page.getByLabel("Passphrase").fill(passphrase);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until it has either let us in or said why not.
  await expect(
    page.locator("form").getByRole("alert").or(page.getByRole("heading", { level: 1, name: /^(Referrals|Enquiries)$/ })),
  ).toBeVisible();
}

type Seed = Partial<{
  participant_name: string;
  participant_suburb: string;
  reason: string;
  service: string;
  plan_type: string;
  referrer_type: string;
  referrer_name: string;
  status: string;
  created_at: string;
}>;

async function seedReferral(s: Seed = {}): Promise<{ id: number; ref: string }> {
  const submission = randomUUID();
  await sql(
    `INSERT INTO referrals (submission_id, created_at, status, referrer_type, referrer_name, referrer_org_role, referrer_phone,
       referrer_email, participant_name, participant_preferred_contact, participant_phone, participant_email,
       participant_suburb, plan_type, service, reason, consent, consent_at, heard_via)
     VALUES (?, COALESCE(?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')), ?, ?, ?, NULL, '0400 000 201', 'ref@example.test', ?, NULL,
       '0400 000 101', 'participant@example.test', ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), 'Word of mouth')`,
    [
      submission,
      s.created_at ?? null,
      s.status ?? "new",
      s.referrer_type ?? "family",
      s.referrer_name ?? "Test Referrer",
      s.participant_name ?? "Test Participant",
      s.participant_suburb ?? "Springfield 4300",
      s.plan_type ?? "plan_managed",
      s.service ?? "support_coordination",
      s.reason ?? "Test reason.",
    ],
  );
  // The reference is set by a trigger, so it is read back rather than returned.
  const [row] = await sql<{ id: number; ref: string }>(`SELECT id, ref FROM referrals WHERE submission_id = ?`, [submission]);
  await sql(`INSERT INTO referral_status_history (referral_id, from_status, to_status) VALUES (?, NULL, ?)`, [
    row.id,
    s.status ?? "new",
  ]);
  return row;
}

async function seedEnquiry(name: string, message: string): Promise<{ id: number; ref: string }> {
  const submission = randomUUID();
  await sql(`INSERT INTO enquiries (submission_id, name, email, phone, message) VALUES (?, ?, ?, '0400 000 999', ?)`, [
    submission,
    name,
    `${name.split(" ")[0].toLowerCase()}@example.test`,
    message,
  ]);
  const [row] = await sql<{ id: number; ref: string }>(`SELECT id, ref FROM enquiries WHERE submission_id = ?`, [submission]);
  return row;
}

test("nothing in the admin opens without signing in, and the admin is never cached or indexed", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  for (const url of ["/admin", "/admin/referrals", "/admin/enquiries", "/admin/referrals?ref=R-1001"]) {
    await page.goto(url);
    await expect(page).toHaveURL(/\/admin\/sign-in/);
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByText("Referrals submitted through")).toHaveCount(0);
  }
  // The page asked for is remembered for after signing in.
  await page.goto("/admin/referrals?ref=R-1001");
  expect(new URL(page.url()).searchParams.get("next")).toBe("/admin/referrals?ref=R-1001");

  const res = await page.request.get("/admin/sign-in");
  const h = res.headers();
  expect(h["cache-control"]).toContain("no-store");
  expect(h["x-robots-tag"]).toBe("noindex, nofollow");
  expect(h["referrer-policy"]).toBe("no-referrer");
  expect(h["content-security-policy"]).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/);
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  const robots = await (await page.request.get("/robots.txt")).text();
  // The dev site blocks everything; the live site blocks /admin (app/robots.ts).
  expect(robots).toMatch(/Disallow: \/(admin)?\s/);

  // A made-up session cookie gets nowhere either.
  await context.addCookies([{ name: COOKIE, value: "made-up-token", url: "https://localhost:3100", secure: true, httpOnly: true, sameSite: "Strict" }]);
  await page.goto("/admin/referrals");
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  await context.close();
});

test("a wrong passphrase is refused, and 5 wrong tries lock sign in and email Andrew the time only", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page, "not the passphrase at all");
  await expect(page.locator("form").getByRole("alert")).toContainText("That passphrase is not right");
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  for (let i = 0; i < 4; i++) await signIn(page, `wrong guess number ${i}`);
  await expect(page.locator("form").getByRole("alert")).toContainText("locked for 15 minutes");
  // Locked: even the right passphrase does not get in now.
  await signIn(page, PASS);
  await expect(page.locator("form").getByRole("alert")).toContainText("locked for 15 minutes");
  await expect(page).toHaveURL(/\/admin\/sign-in/);

  const alert = emails().find((m) => m.subject === "Admin sign in locked after failed attempts");
  expect(alert, "lockout alert").toBeTruthy();
  expect(alert!.to).toEqual(["alerts@example.test"]);
  expect(alert!.text).not.toMatch(/wrong guess|not the passphrase/);
  await context.close();

  // Another address can still sign in (the lock is per address until 20 tries in total).
  const other = await freshContext(browser);
  const page2 = await other.newPage();
  await signIn(page2);
  await expect(page2).toHaveURL(/\/admin\/referrals/);
  await other.close();
});

test("signing in sets a locked-down cookie, and the database keeps only its hash", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/referrals$/);
  const cookie = (await context.cookies()).find((c) => c.name === COOKIE);
  expect(cookie, "session cookie").toBeTruthy();
  expect(cookie!.httpOnly).toBe(true);
  expect(cookie!.secure).toBe(true);
  expect(cookie!.sameSite).toBe("Strict");
  expect(cookie!.path).toBe("/");
  const stored = await sql<{ id: string }>(`SELECT id FROM admin_sessions WHERE id = ?`, [cookie!.value]);
  expect(stored, "the raw token is never stored").toHaveLength(0);
  const live = await sql<{ n: number }>(`SELECT count(*) AS n FROM admin_sessions WHERE revoked_at IS NULL AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+7 hours')`);
  expect(live[0].n).toBeGreaterThan(0);
  await context.close();
});

test("referrals: real data, no sample label, filters, search, sort and the detail panel", async ({ browser }) => {
  const a = await seedReferral({ participant_name: "Zara Filtertest", participant_suburb: "Ipswich 4305", service: "recovery_coaching", plan_type: "self_managed", referrer_type: "participant", referrer_name: "Zara Filtertest", created_at: "2026-09-01T09:00:00+10:00" });
  const b = await seedReferral({ participant_name: "Adam Filtertest", service: "both", referrer_type: "professional", referrer_name: "Pat Planner", status: "contacted", created_at: "2026-09-02T09:00:00+10:00" });
  const context = await freshContext(browser);
  const page = await context.newPage();
  const errors = watchErrors(page);
  await signIn(page);
  await expect(page.getByRole("heading", { name: "Referrals", level: 1 })).toBeVisible();
  await expect(page.getByText("Sample data")).toHaveCount(0);
  await expect(page.getByText("Sample Participant")).toHaveCount(0);

  await page.getByRole("searchbox", { name: "Search referrals" }).fill("filtertest");
  const list = page.getByRole("list", { name: "Referrals" });
  await expect(list.getByRole("listitem")).toHaveCount(2);
  // Newest first by default.
  await expect(list.getByRole("button").first()).toContainText("Adam Filtertest");
  await page.getByLabel("Sort").selectOption("old");
  await expect(list.getByRole("button").first()).toContainText("Zara Filtertest");
  await page.getByLabel("Sort").selectOption("az");
  await expect(list.getByRole("button").first()).toContainText("Adam Filtertest");
  await page.getByLabel("Filter by service").selectOption("recovery_coaching");
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(list).toContainText("Recovery coaching");
  await page.getByLabel("Filter by service").selectOption("all");
  await page.getByLabel("Filter by referrer").selectOption("professional");
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(list).toContainText("Pat Planner");
  await page.getByLabel("Filter by referrer").selectOption("all");
  await page.getByLabel("Filter by plan type").selectOption("self_managed");
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(page.getByRole("searchbox", { name: "Search referrals" })).toHaveValue("");

  // Status tabs.
  await page.getByRole("searchbox", { name: "Search referrals" }).fill("filtertest");
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: /^Contacted/ }).click();
  await expect(list.getByRole("listitem")).toHaveCount(1);
  await expect(list).toContainText("Adam Filtertest");
  await page.getByRole("group", { name: "Status" }).getByRole("button", { name: /^All/ }).click();

  // The detail panel: opens, shows everything, keyboard friendly.
  const row = page.getByRole("button", { name: /Open referral for Zara Filtertest/ });
  await row.click();
  const panel = page.getByRole("dialog", { name: "Zara Filtertest" });
  await expect(panel).toBeVisible();
  await expect(panel).toContainText(a.ref);
  await expect(panel).toContainText("Psychosocial recovery coaching");
  await expect(panel).toContainText("Self-managed");
  await expect(panel.getByRole("link", { name: "Call participant" })).toHaveAttribute("href", "tel:0400000101");
  await expect(panel.getByRole("link", { name: "Email" })).toHaveAttribute("href", "mailto:participant@example.test");
  await expect(panel.getByRole("heading", { name: "Status history" })).toBeVisible();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(row).toBeFocused();
  expect(b.ref).toMatch(/^R-\d+$/);
  expect(errors, errors.join("\n")).toEqual([]);
  await context.close();
});

test("changing status and adding a note are saved, recorded in history and the access log, with no contents logged", async ({ browser }) => {
  const r = await seedReferral({ participant_name: "Nora Statustest", reason: "Status test reason 7c1." });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto(`/admin/referrals?ref=${r.ref}`);
  const panel = page.getByRole("dialog", { name: "Nora Statustest" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "In progress", exact: true }).click();
  await expect(panel.getByRole("status").first()).toHaveText("Saved");
  await expect(panel.getByRole("button", { name: "In progress", exact: true })).toHaveAttribute("aria-pressed", "true");
  const [saved] = await sql<{ status: string }>(`SELECT status FROM referrals WHERE ref = ?`, [r.ref]);
  expect(saved.status).toBe("in_progress");
  const history = await sql<{ from_status: string; to_status: string }>(
    `SELECT from_status, to_status FROM referral_status_history WHERE referral_id = ? ORDER BY id`,
    [r.id],
  );
  expect(history.map((h) => [h.from_status, h.to_status])).toEqual([[null, "new"], ["new", "in_progress"]]);
  await expect(panel.getByText("In progress, was New")).toBeVisible();

  const note = "Called the family, booked a visit for Tuesday. Note 3f9.";
  await panel.getByLabel("Add a note").fill(note);
  await panel.getByRole("button", { name: "Save note" }).click();
  await expect(panel.getByRole("list", { name: "Saved notes" })).toContainText(note);
  const notes = await sql<{ body: string }>(`SELECT body FROM referral_notes WHERE referral_id = ?`, [r.id]);
  expect(notes.map((n) => n.body)).toEqual([note]);

  // Still there after a reload.
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Nora Statustest" }).getByRole("list", { name: "Saved notes" })).toContainText(note);

  const log = await sql<Record<string, unknown>>(`SELECT * FROM access_log WHERE target_ref = ? ORDER BY id`, [r.ref]);
  expect(log.map((l) => l.action)).toEqual(expect.arrayContaining(["view_referral", "change_referral_status", "add_referral_note"]));
  expect(JSON.stringify(log)).not.toContain("Note 3f9");
  expect(JSON.stringify(log)).not.toContain("Nora");
  expect(Object.keys(log[0]).sort()).toEqual(["action", "at", "id", "session_id", "target_ref"]);
  // Nothing can be deleted from the admin.
  await expect(page.getByRole("button", { name: /delete/i })).toHaveCount(0);
  await context.close();
});

test("anything a person typed is shown as plain text, never run as code", async ({ browser }) => {
  const evil = `<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script> Test 8e2`;
  const r = await seedReferral({ participant_name: "Ivy <b>Bold</b> Escape", reason: evil });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto(`/admin/referrals?ref=${r.ref}`);
  const panel = page.getByRole("dialog", { name: "Ivy <b>Bold</b> Escape" });
  await expect(panel).toContainText(evil);
  expect(await page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned)).toBeUndefined();
  await expect(panel.locator("img, script, b")).toHaveCount(0);
  await context.close();
});

test("enquiries: opening marks read, a reply is stored, emailed from Ensign and marks it Replied", async ({ browser }) => {
  const e = await seedEnquiry("Wendy Replytest", "Do you work in Logan? Reply test 2d4.");
  const context = await freshContext(browser);
  const page = await context.newPage();
  const errors = watchErrors(page);
  await signIn(page);
  await page.getByRole("link", { name: "Enquiries" }).click();
  await expect(page.getByRole("heading", { name: "Enquiries", level: 1 })).toBeVisible();
  await expect(page.getByText("Sample data")).toHaveCount(0);
  await expect(page.getByText("Select an enquiry to read it.")).toBeVisible();
  await page.getByRole("searchbox", { name: "Search enquiries" }).fill("Replytest");
  await page.getByRole("button", { name: /Wendy Replytest/ }).click();
  const pane = page.getByRole("region", { name: "Enquiry", exact: true });
  await expect(pane.getByRole("heading", { name: "Wendy Replytest" })).toBeVisible();
  await expect(pane).toContainText("Do you work in Logan? Reply test 2d4.");
  await expect.poll(async () => (await sql<{ read_at: Date | null }>(`SELECT read_at FROM enquiries WHERE ref = ?`, [e.ref]))[0].read_at).not.toBeNull();

  await expect(pane.getByRole("button", { name: "Send reply" })).toBeDisabled();
  const reply = "Hi Wendy, yes we do. Andrew will call you this week. Reply 6a0.";
  await pane.getByLabel("Reply to Wendy Replytest").fill(reply);
  await pane.getByRole("button", { name: "Send reply" }).click();
  await expect(pane.getByRole("list", { name: "Messages" })).toContainText(reply);
  await expect(pane.getByRole("status").last()).toContainText("Reply sent.");
  await expect(pane.getByRole("button", { name: "Replied" })).toHaveAttribute("aria-pressed", "true");

  const [stored] = await sql<{ body: string; delivery_status: string }>(
    `SELECT m.body, m.delivery_status FROM enquiry_messages m JOIN enquiries e ON e.id = m.enquiry_id WHERE e.ref = ?`,
    [e.ref],
  );
  expect(stored).toEqual({ body: reply, delivery_status: "sent" });
  const [status] = await sql<{ status: string }>(`SELECT status FROM enquiries WHERE ref = ?`, [e.ref]);
  expect(status.status).toBe("replied");
  const sent = emails().find((m) => m.text.includes("Reply 6a0"));
  expect(sent, "reply email").toBeTruthy();
  expect(sent!.to).toEqual(["wendy@example.test"]);
  expect(sent!.replyTo).toBe("alerts@example.test");
  expect(sent!.subject).toBe("Re: your enquiry to Ensign Support Services");
  // The alert to Andrew about the enquiry never carried the message itself.
  expect(emails().filter((m) => m.to.includes("alerts@example.test")).some((m) => m.text.includes("Reply test 2d4"))).toBe(false);

  await expectNoAxeViolations(page);
  expect(errors, errors.join("\n")).toEqual([]);
  await context.close();
});

test("a Closed referral or enquiry can be removed for good, in two steps, keeping only the reference", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  const live = await seedReferral({ participant_name: "Rhea Removetest", status: "accepted" });
  const closed = await seedReferral({ participant_name: "Rory Removetest", status: "closed" });
  await signIn(page);

  // A record that is not Closed has no remove button.
  await page.goto(`/admin/referrals?ref=${live.ref}`);
  const liveDrawer = page.getByRole("dialog", { name: "Rhea Removetest" });
  await expect(liveDrawer.getByRole("heading", { name: "Internal notes" })).toBeVisible();
  await expect(liveDrawer.getByRole("button", { name: "Remove personal details" })).toHaveCount(0);

  // The first click only asks. Cancel keeps everything.
  await page.goto(`/admin/referrals?ref=${closed.ref}`);
  const drawer = page.getByRole("dialog", { name: "Rory Removetest" });
  await drawer.getByRole("button", { name: "Remove personal details" }).click();
  await expect(drawer.getByText(`Remove ${closed.ref} for good?`)).toBeVisible();
  await drawer.getByRole("button", { name: "Cancel" }).click();
  expect((await sql<{ n: number }>(`SELECT count(*) AS n FROM referrals WHERE ref = ?`, [closed.ref]))[0].n).toBe(1);

  await drawer.getByRole("button", { name: "Remove personal details" }).click();
  await drawer.getByRole("button", { name: "Yes, remove for good" }).click();
  await expect(page.getByText(`${closed.ref} removed. Only its reference number is kept.`)).toBeVisible();
  await expect(page.getByText("Rory Removetest")).toHaveCount(0);
  expect((await sql<{ n: number }>(`SELECT count(*) AS n FROM referrals WHERE ref = ?`, [closed.ref]))[0].n).toBe(0);
  expect(await sql(`SELECT kind FROM removed_records WHERE ref = ?`, [closed.ref])).toEqual([{ kind: "referral" }]);
  expect(await sql(`SELECT action FROM access_log WHERE target_ref = ? AND action = 'remove_referral'`, [closed.ref])).toHaveLength(1);

  const enq = await seedEnquiry("Erin Removetest", "Please remove me.");
  await sql(`UPDATE enquiries SET status = 'closed' WHERE id = ?`, [enq.id]);
  await page.goto(`/admin/enquiries?ref=${enq.ref}`);
  const panel = page.getByRole("region", { name: "Enquiry" });
  await panel.getByRole("button", { name: "Remove personal details" }).click();
  await panel.getByRole("button", { name: "Yes, remove for good" }).click();
  await expect(page.getByText(`${enq.ref} removed. Only its reference number is kept.`)).toBeVisible();
  expect((await sql<{ n: number }>(`SELECT count(*) AS n FROM enquiries WHERE ref = ?`, [enq.ref]))[0].n).toBe(0);
  expect(await sql(`SELECT kind FROM removed_records WHERE ref = ?`, [enq.ref])).toEqual([{ kind: "enquiry" }]);
  await context.close();
});

test("a link from an alert email opens that enquiry after signing in", async ({ browser }) => {
  const e = await seedEnquiry("Lenny Linktest", "Link test 0b7.");
  const context = await freshContext(browser);
  const page = await context.newPage();
  await page.goto(`/admin/enquiries?ref=${e.ref}`);
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  await page.getByLabel("Passphrase").fill(PASS);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(new RegExp(`/admin/enquiries\\?ref=${e.ref}$`));
  await expect(page.getByRole("region", { name: "Enquiry", exact: true }).getByRole("heading", { name: "Lenny Linktest" })).toBeVisible();
  await context.close();
});

test("signing out ends the session on the server", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/referrals/);
  const token = (await context.cookies()).find((c) => c.name === COOKIE)!.value;
  await page.getByRole("button", { name: "Sign out" }).first().click();
  await expect(page).toHaveURL(/\/admin\/sign-in\?signed_out=1/);
  await expect(page.getByRole("status")).toHaveText("You are signed out.");
  // Even with the old cookie put back, the session is dead.
  await context.addCookies([{ name: COOKIE, value: token, url: "https://localhost:3100", secure: true, httpOnly: true, sameSite: "Strict" }]);
  await page.goto("/admin/referrals");
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  const revoked = await sql<{ n: number }>(`SELECT count(*) AS n FROM admin_sessions WHERE revoked_at IS NOT NULL`);
  expect(revoked[0].n).toBeGreaterThan(0);
  await context.close();
});

test("15 minutes without activity, or 8 hours in total, signs out, and an action after that does nothing", async ({ browser }) => {
  const r = await seedReferral({ participant_name: "Olive Idletest" });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto(`/admin/referrals?ref=${r.ref}`);
  const panel = page.getByRole("dialog", { name: "Olive Idletest" });
  await expect(panel).toBeVisible();
  // Make every session look idle for 16 minutes, then try to change the status.
  await sql(`UPDATE admin_sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-16 minutes')`);
  await panel.getByRole("button", { name: "Closed", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/sign-in\?expired=1/);
  await expect(page.getByRole("status")).toContainText("nothing happened for 15 minutes");
  const [row] = await sql<{ status: string }>(`SELECT status FROM referrals WHERE ref = ?`, [r.ref]);
  expect(row.status).toBe("new");

  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/referrals/);
  await sql(`UPDATE admin_sessions SET expires_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 minute') WHERE revoked_at IS NULL`);
  await page.reload();
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  await context.close();
});

test("the admin works on a phone, and on every screen size", async ({ browser }) => {
  await seedReferral({ participant_name: "Phoebe Phonetest" });
  for (const s of SCREENS) {
    const context = await freshContext(browser, s.w, s.h);
    const page = await context.newPage();
    await signIn(page);
    await expect(page).toHaveURL(/\/admin\/referrals/);
    for (const url of ["/admin/referrals", "/admin/enquiries"]) {
      await page.goto(url);
      await expectNoSidewaysScroll(page);
      const overlaps = await page.evaluate(() => {
        const els = [...document.querySelectorAll("main h1, main h2, main p, main button, main a, main label, main select, main input")].filter(
          (e) => (e as HTMLElement).offsetParent !== null && !e.closest(".visually-hidden"),
        );
        const out: string[] = [];
        for (let i = 0; i < els.length; i++)
          for (let j = i + 1; j < els.length; j++) {
            if (els[i].contains(els[j]) || els[j].contains(els[i])) continue;
            const a = els[i].getBoundingClientRect();
            const b = els[j].getBoundingClientRect();
            const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
            const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
            if (ox > 4 && oy > 4) out.push(`${els[i].textContent?.trim().slice(0, 20)} / ${els[j].textContent?.trim().slice(0, 20)}`);
          }
        return out;
      });
      expect(overlaps, `${url} at ${s.w}x${s.h}`).toEqual([]);
    }
    if (s.w === 390) {
      await page.goto("/admin/referrals");
      await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
      await page.getByRole("button", { name: /Open referral for Phoebe Phonetest/ }).click();
      await expect(page.getByRole("dialog", { name: "Phoebe Phonetest" })).toBeVisible();
      await expectNoSidewaysScroll(page);
      await expectNoAxeViolations(page);
    }
    await context.close();
  }
});

test("after being signed out for inactivity, the Back button does not show the admin again", async ({ browser }) => {
  const r = await seedReferral({ participant_name: "Bella Backtest" });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await page.clock.install();
  await signIn(page);
  await page.goto(`/admin/referrals?ref=${r.ref}`);
  await expect(page.getByRole("dialog", { name: "Bella Backtest" })).toBeVisible();
  // 15 minutes with nothing happening, as the browser sees it.
  await page.clock.fastForward("15:10");
  await expect(page).toHaveURL(/\/admin\/sign-in\?expired=1/);
  expect((await context.cookies()).some((c) => c.name === COOKIE)).toBe(false);
  await page.goBack();
  await expect(page.getByText("Bella Backtest")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  await context.close();
});

test("after an action finds the session has run out, Back does not show the admin again", async ({ browser }) => {
  const r = await seedReferral({ participant_name: "Carl Backaction" });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto(`/admin/referrals?ref=${r.ref}`);
  const panel = page.getByRole("dialog", { name: "Carl Backaction" });
  await expect(panel).toBeVisible();
  await sql(`UPDATE admin_sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-16 minutes')`);
  await panel.getByRole("button", { name: "Accepted", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/sign-in\?expired=1/);
  expect((await context.cookies()).some((c) => c.name === COOKIE)).toBe(false);
  await page.goBack();
  await expect(page.getByText("Carl Backaction")).toHaveCount(0);
  await context.close();
});

test("the list page never sends a referral's reason or contact details until it is opened", async ({ browser }) => {
  await seedReferral({ participant_name: "Dana Listonly", reason: "Private reason that must not be in the list 4b8." });
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto("/admin/referrals");
  await expect(page.getByRole("button", { name: /Open referral for Dana Listonly/ })).toBeVisible();
  const html = await page.content();
  expect(html).not.toContain("Private reason that must not be in the list 4b8.");
  expect(html).not.toContain("participant@example.test");
  await page.getByRole("button", { name: /Open referral for Dana Listonly/ }).click();
  await expect(page.getByRole("dialog", { name: "Dana Listonly" })).toContainText("Private reason that must not be in the list 4b8.");
  await context.close();
});

test("the inbox list sends only a short preview; the full message and phone come when it is opened", async ({ browser }) => {
  const tail = "and this private ending must not be in the list 5c3.";
  await seedEnquiry("Peta Previewtest", `${"I would like to ask about support. ".repeat(6)}${tail}`);
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await page.goto("/admin/enquiries");
  await expect(page.getByRole("button", { name: /Peta Previewtest/ })).toBeVisible();
  const html = await page.content();
  expect(html).not.toContain(tail);
  expect(html).not.toContain("0400 000 999");
  await page.getByRole("button", { name: /Peta Previewtest/ }).click();
  const pane = page.getByRole("region", { name: "Enquiry", exact: true });
  await expect(pane).toContainText(tail);
  await expect(pane).toContainText("0400 000 999");
  await context.close();
});

test("a session made under an old passphrase no longer works", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/referrals/);
  // Stands in for the passphrase being changed on the Worker: the session's tie to it no longer matches.
  await sql(`UPDATE admin_sessions SET passphrase_tag = 'old' WHERE revoked_at IS NULL`);
  await page.reload();
  await expect(page).toHaveURL(/\/admin\/sign-in/);
  await context.close();
});

test("a burst of guesses sent at once is still counted one by one", async ({ browser }) => {
  const before = (await sql<{ n: number }>(`SELECT count(*) AS n FROM login_attempts WHERE succeeded = 0`))[0].n;
  ipCounter += 1;
  const ip = `203.0.113.${ipCounter}`;
  const contexts = await Promise.all(
    Array.from({ length: 12 }, () => browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } })),
  );
  const pages = await Promise.all(contexts.map((c) => c.newPage()));
  await Promise.all(pages.map((p) => p.goto("/admin/sign-in")));
  await Promise.all(pages.map((p, i) => p.getByLabel("Passphrase").fill(`burst guess ${i}`)));
  await Promise.all(pages.map((p) => p.getByRole("button", { name: "Sign in" }).click()));
  await Promise.all(pages.map((p) => expect(p.locator("form").getByRole("alert")).toBeVisible()));
  const answers = await Promise.all(pages.map((p) => p.locator("form").getByRole("alert").textContent()));
  // Only 5 guesses were ever checked: 4 told "not right", the 5th started the lock,
  // and the other 7 were refused without looking at the passphrase.
  expect(answers.filter((a) => a?.includes("not right"))).toHaveLength(4);
  expect(answers.filter((a) => a?.includes("locked for 15 minutes"))).toHaveLength(8);
  const after = (await sql<{ n: number }>(`SELECT count(*) AS n FROM login_attempts WHERE succeeded = 0`))[0].n;
  expect(after - before).toBe(12); // every try is recorded
  await Promise.all(contexts.map((c) => c.close()));
});

test("the sign in page is accessible and the admin shows no console errors (the strict security policy blocks nothing of ours)", async ({ browser }) => {
  const context = await freshContext(browser);
  const page = await context.newPage();
  const errors = watchErrors(page);
  await page.goto("/admin/sign-in");
  await expectNoAxeViolations(page);
  await signIn(page);
  await expect(page).toHaveURL(/\/admin\/referrals/);
  await expectNoAxeViolations(page);
  await page.goto("/admin/enquiries");
  await expectNoAxeViolations(page);
  expect(errors.filter((e) => !e.includes("HTTP 3")), errors.join("\n")).toEqual([]);
  await context.close();
});

// Runs last: it leaves sign in locked for 15 minutes for every address Andrew has not used.
test("after 20 wrong tries in total, only addresses that have signed in before can still sign in", async ({ browser }) => {
  // Andrew signs in from his usual address first.
  const andrew = await freshContext(browser);
  const a = await andrew.newPage();
  await signIn(a);
  await expect(a).toHaveURL(/\/admin\/referrals/);
  await andrew.clearCookies();

  // Tries that arrive with no trusted address share one limit of 5.
  const noAddressA = await browser.newContext();
  const noAddressB = await browser.newContext();
  const pa = await noAddressA.newPage();
  const pb = await noAddressB.newPage();
  for (let i = 0; i < 3; i++) await signIn(pa, `no address guess a${i}`);
  for (let i = 0; i < 2; i++) await signIn(pb, `no address guess b${i}`);
  await expect(pb.locator("form").getByRole("alert")).toContainText("locked for 15 minutes");
  await signIn(pb, PASS);
  await expect(pb.locator("form").getByRole("alert")).toContainText("locked for 15 minutes");
  await noAddressA.close();
  await noAddressB.close();

  const failed = async () => (await sql<{ n: number }>(`SELECT count(*) AS n FROM login_attempts WHERE succeeded = 0 AND attempted_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-15 minutes')`))[0].n;
  while ((await failed()) < 20) {
    const c = await freshContext(browser);
    const p = await c.newPage();
    for (let i = 0; i < 5 && (await failed()) < 20; i++) await signIn(p, `distributed guess ${i}`);
    await c.close();
  }
  // A new address is refused, even with the right passphrase.
  const stranger = await freshContext(browser);
  const g = await stranger.newPage();
  await signIn(g, PASS);
  await expect(g.locator("form").getByRole("alert")).toContainText("locked for 15 minutes");
  await stranger.close();
  // Andrew, on the address he has signed in from before, still gets in.
  await signIn(a);
  await expect(a).toHaveURL(/\/admin\/referrals/);
  await andrew.close();
});
