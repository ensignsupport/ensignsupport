import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import pg from "pg";
import { randomUUID } from "node:crypto";
import { expectNoAxeViolations, expectNoSidewaysScroll } from "./helpers";

// Forms share one throwaway database, so these tests run one at a time.
test.describe.configure({ mode: "serial" });

const RESULTS = path.join(__dirname, "..", "test-results");
const ORIGIN = `http://localhost:${Number(process.env.TEST_PORT ?? 3100)}`;
/** What a browser on this site sends with a form post. */
const api = (ip: string) => ({ "x-forwarded-for": ip, origin: ORIGIN });
const BROKEN = `http://localhost:${Number(process.env.TEST_PORT ?? 3100) + 1}`;

async function sql<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const client = new pg.Client({ connectionString: readFileSync(path.join(RESULTS, ".db-url"), "utf8") });
  await client.connect();
  try {
    return (await client.query(text, params)).rows as T[];
  } finally {
    await client.end();
  }
}

function emails(file = "emails.jsonl"): { to: string[]; subject: string; text: string }[] {
  return readFileSync(path.join(RESULTS, file), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

let ipCounter = 10;
/** Each test looks like a different visitor, so the hourly limit never interferes. */
async function freshVisitor(page: Page) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `203.0.113.${ipCounter++}` });
}

const PRO = {
  name: "Test Referrer Pro",
  org: "Test Plan Co, plan manager",
  phone: "0400 111 222",
  email: "pro.referrer@example.test",
  pName: "Test Participant One",
  pPhone: "0411 222 333",
  pEmail: "participant.one@example.test",
  pPref: "Their sister, 0422 333 444",
  suburb: "Springfield 4300",
  reason: "Unique reason text 7f3a for the referral test.",
};

async function chooseAndContinue(page: Page, label: string) {
  await page.getByRole("radio", { name: new RegExp(label) }).check({ force: true });
  await page.getByRole("button", { name: "Continue" }).click();
}

test("professional referral: every step, saved exactly, alert has no details", async ({ page }) => {
  await freshVisitor(page);
  await page.goto("/referral");
  const countMine = async () =>
    (await sql<{ n: number }>(`SELECT count(*)::int AS n FROM referrals WHERE reason = $1`, [PRO.reason]))[0].n;
  const before = await countMine();

  // Step: who. Continue waits for a choice.
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await chooseAndContinue(page, "A professional");

  // Step 1: your details, with organisation and role for professionals.
  await expect(page.getByText("Step 1 of 4 · Your details")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Thanks, now a little about you" })).toBeFocused();
  await page.getByLabel("Full name").fill(PRO.name);
  await page.getByLabel("Organisation and role (optional)").fill(PRO.org);
  await page.getByLabel("Phone").fill(PRO.phone);
  await page.getByLabel("Email").fill(PRO.email);
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 2: the participant.
  await expect(page.getByText("Step 2 of 4 · Participant")).toBeVisible();
  await page.getByLabel("Participant full name").fill(PRO.pName);
  await page.getByLabel("Participant phone").fill(PRO.pPhone);
  await page.getByLabel("Participant email").fill(PRO.pEmail);
  await page.getByLabel("Preferred contact, if different (optional)").fill(PRO.pPref);
  await page.getByLabel("Suburb and postcode").fill(PRO.suburb);
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 3: service, plan and reason. Continue waits for both choices.
  await expect(page.getByText("Step 3 of 4 · Support")).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(5);
  await expect(page.getByText(/NDIA-managed|Agency-managed/i)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("radio", { name: /^Both/ }).check({ force: true });
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("radio", { name: "Plan-managed" }).check({ force: true });
  await page.getByLabel("In a sentence or two, what would help most right now?").fill(PRO.reason);
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 4: consent. Send waits for the tick.
  await expect(page.getByText("Step 4 of 4 · Confirm")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send Referral" })).toBeDisabled();
  await page.getByRole("button", { name: "Plan manager" }).click();
  await page.getByLabel(/agree to (this referral|send these details)/).check();
  await page.getByRole("button", { name: "Send Referral" }).click();

  await expect(page.getByRole("heading", { name: "Thank you, your referral is in" })).toBeVisible();
  await expect(page.getByText("Ensign Support Services will contact you about next steps.")).toBeVisible();

  const rows = await sql<Record<string, unknown>>(`SELECT * FROM referrals WHERE reason = $1`, [PRO.reason]);
  expect(rows).toHaveLength(1);
  const r = rows[0];
  expect(r).toMatchObject({
    status: "new",
    referrer_type: "professional",
    referrer_name: PRO.name,
    referrer_org_role: PRO.org,
    referrer_phone: PRO.phone,
    referrer_email: PRO.email,
    participant_name: PRO.pName,
    participant_preferred_contact: PRO.pPref,
    participant_phone: PRO.pPhone,
    participant_email: PRO.pEmail,
    participant_suburb: PRO.suburb,
    plan_type: "plan_managed",
    service: "both",
    consent: true,
    heard_via: "Plan manager",
  });
  expect(r.consent_at).toBeTruthy();
  expect(await countMine()).toBe(before + 1);
  const history = await sql(`SELECT from_status, to_status FROM referral_status_history WHERE referral_id = $1`, [r.id]);
  expect(history).toEqual([{ from_status: null, to_status: "new" }]);

  // The alert went out, with the reference number and none of the details.
  const alert = emails().find((m) => m.subject === `New referral ${r.ref}`);
  expect(alert, "alert email").toBeTruthy();
  expect(alert!.to).toEqual(["alerts@example.test"]);
  expect(alert!.text).toContain(`/admin/referrals?ref=${r.ref}`);
  for (const secret of [PRO.name, PRO.pName, PRO.pEmail, PRO.pPhone, PRO.email, "7f3a", "Springfield", "Plan Co"]) {
    expect(alert!.text, `alert leaks "${secret}"`).not.toContain(secret);
    expect(alert!.subject).not.toContain(secret);
  }
  const outbox = await sql(`SELECT status FROM email_outbox WHERE ref = $1`, [r.ref]);
  expect(outbox).toEqual([{ status: "sent" }]);
});

test("self referral: no participant contact fields, their own details are stored as the participant's", async ({ page }) => {
  await freshVisitor(page);
  await page.goto("/referral");
  await chooseAndContinue(page, "I am the participant");
  await expect(page.getByRole("heading", { name: "Great, tell us about you" })).toBeVisible();
  await expect(page.getByLabel("Organisation and role (optional)")).toHaveCount(0);
  await page.getByLabel("Full name").fill("Test Self Referrer");
  await page.getByLabel("Phone").fill("0400 555 666");
  await page.getByLabel("Email").fill("self@example.test");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "Where are you based?" })).toBeVisible();
  await expect(page.getByLabel("Participant full name")).toHaveCount(0);
  await page.getByLabel("Suburb and postcode").fill("Ipswich 4305");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: /^Psychosocial recovery coaching/ }).check({ force: true });
  await page.getByRole("radio", { name: "Self-managed" }).check({ force: true });
  await page.getByLabel(/what would help most/).fill("Self referral test 91b2.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/agree to (this referral|send these details)/).check();
  await page.getByRole("button", { name: "Send Referral" }).click();
  await expect(page.getByRole("heading", { name: "Thank you, your referral is in" })).toBeVisible();

  const [r] = await sql(`SELECT * FROM referrals WHERE reason = $1`, ["Self referral test 91b2."]);
  expect(r).toMatchObject({
    referrer_type: "participant",
    referrer_org_role: null,
    participant_name: "Test Self Referrer",
    participant_phone: "0400 555 666",
    participant_email: "self@example.test",
    participant_preferred_contact: null,
    participant_suburb: "Ipswich 4305",
    plan_type: "self_managed",
    service: "recovery_coaching",
    heard_via: null,
  });
});

test("validation: clear messages, focus on the first problem, on the step the visitor can see", async ({ page }) => {
  await freshVisitor(page);
  await page.goto("/referral");
  await chooseAndContinue(page, "Family member or carer");
  await expect(page.getByLabel("Organisation and role (optional)")).toHaveCount(0);

  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter your full name")).toBeVisible();
  await expect(page.getByText("Enter your phone number")).toBeVisible();
  await expect(page.getByText("Enter your email address")).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeFocused();
  await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");

  await page.getByLabel("Full name").fill("Test Family");
  await page.getByLabel("Phone").fill("12ab");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText(/Enter your phone number using numbers only/)).toBeVisible();
  await expect(page.getByText("Enter your email address in the format name@example.com")).toBeVisible();
  await expect(page.getByLabel("Phone")).toBeFocused();

  await page.getByLabel("Phone").fill("0400 777 888");
  await page.getByLabel("Email").fill("family@example.test");
  await page.getByRole("button", { name: "Continue" }).click();

  // Both participant phone and email are required (Allen, 2 Oct 2026).
  await page.getByLabel("Suburb and postcode").fill("Springfield");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter the participant’s full name")).toBeVisible();
  await expect(page.getByText("Enter the participant’s phone number")).toBeVisible();
  await expect(page.getByText("Enter the participant’s email address")).toBeVisible();
  await expect(page.getByText(/4 digit postcode/)).toBeVisible();

  // Back keeps what was typed.
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Test Family");
});

test("the server refuses what the brief rules out, even when the browser is bypassed", async ({ request }) => {
  const good = {
    referrerType: "family",
    referrerName: "API Test",
    referrerPhone: "0400 000 000",
    referrerEmail: "api@example.test",
    participantName: "API Participant",
    participantPhone: "0400 000 001",
    participantEmail: "apip@example.test",
    participantSuburb: "Springfield 4300",
    service: "support_coordination",
    planType: "plan_managed",
    reason: "API test",
    consent: true,
  };
  const headers = api("198.51.100.1");
  const id = () => ({ submissionId: randomUUID() });

  const ndia = await request.post("/api/referral", { data: { ...good, ...id(), planType: "ndia_managed" }, headers });
  expect(ndia.status()).toBe(422);
  expect((await ndia.json()).fields.planType).toBeTruthy();

  const noConsent = await request.post("/api/referral", { data: { ...good, ...id(), consent: false }, headers });
  expect(noConsent.status()).toBe(422);

  const extra = await request.post("/api/referral", {
    data: { ...good, ...id(), ndisNumber: "430000000", diagnosis: "x", medicare: "1234" },
    headers,
  });
  expect(extra.status()).toBe(200);
  const cols = await sql<{ column_name: string }>(`SELECT column_name FROM information_schema.columns WHERE table_name = 'referrals'`);
  expect(cols.map((c) => c.column_name).join(",")).not.toMatch(/ndis_number|diagnosis|medicare|file|upload/);

  const crossSite = await request.post("/api/referral", { data: { ...good, ...id() }, headers: { ...headers, origin: "https://evil.example" } });
  expect(crossSite.status()).toBe(403);
  const noOrigin = await request.post("/api/referral", { data: { ...good, ...id() }, headers: { "x-forwarded-for": "198.51.100.1" } });
  expect(noOrigin.status()).toBe(403);

  // A phone number padded past 20 characters is a clear field error, not an outage.
  const longPhone = await request.post("/api/referral", { data: { ...good, ...id(), referrerPhone: "0400   000   000   000" }, headers });
  expect(longPhone.status()).toBe(422);
  expect((await longPhone.json()).fields.referrerPhone).toContain("under 20 characters");

  // The same form sent twice (for example a retry after a dropped connection) is saved once.
  const once = { ...good, ...id(), reason: "Idempotency test e41c" };
  expect((await request.post("/api/referral", { data: once, headers })).status()).toBe(200);
  expect((await request.post("/api/referral", { data: once, headers })).status()).toBe(200);
  expect(await sql(`SELECT ref FROM referrals WHERE reason = $1`, ["Idempotency test e41c"])).toHaveLength(1);
});

test("a bot that fills the hidden field is thanked and nothing is saved", async ({ request }) => {
  const countBots = async () =>
    (await sql<{ n: number }>(`SELECT count(*)::int AS n FROM enquiries WHERE email = 'bot@example.test'`))[0].n;
  const before = await countBots();
  const res = await request.post("/api/enquiry", {
    data: { name: "Bot", email: "bot@example.test", message: "spam", submissionId: randomUUID(), ens_hp_7x: "http://spam.example" },
    headers: api("198.51.100.2"),
  });
  expect(res.status()).toBe(200);
  expect(await countBots()).toBe(before);
});

test("more than 5 referrals an hour from one address are slowed down", async ({ request }) => {
  const data = {
    referrerType: "participant",
    referrerName: "Rate Test",
    referrerPhone: "0400 000 000",
    referrerEmail: "rate@example.test",
    participantSuburb: "Springfield 4300",
    service: "support_coordination",
    planType: "plan_managed",
    reason: "Rate test",
    consent: true,
  };
  const headers = api("198.51.100.3");
  for (let i = 0; i < 5; i++) {
    expect((await request.post("/api/referral", { data: { ...data, submissionId: randomUUID() }, headers })).status()).toBe(200);
  }
  expect((await request.post("/api/referral", { data: { ...data, submissionId: randomUUID() }, headers })).status()).toBe(429);
});

test("when the database cannot be reached the visitor is told, never thanked, and Ensign is alerted", async ({ page }) => {
  await freshVisitor(page);
  await page.goto(`${BROKEN}/referral`);
  await chooseAndContinue(page, "I am the participant");
  await page.getByLabel("Full name").fill("Broken Test");
  await page.getByLabel("Phone").fill("0400 999 000");
  await page.getByLabel("Email").fill("broken@example.test");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Suburb and postcode").fill("Springfield 4300");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: /^Support coordination/ }).check({ force: true });
  await page.getByRole("radio", { name: "Plan-managed" }).check({ force: true });
  await page.getByLabel(/what would help most/).fill("Broken database test.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel(/agree to (this referral|send these details)/).check();
  await page.getByRole("button", { name: "Send Referral" }).click();

  await expect(page.getByRole("form", { name: "Referral form" }).getByRole("alert")).toContainText("Sorry, your referral did not send");
  await expect(page.getByRole("heading", { name: "Thank you, your referral is in" })).toHaveCount(0);
  // Everything they typed is still there to try again.
  await expect(page.getByLabel(/agree to (this referral|send these details)/)).toBeChecked();

  const alert = emails("emails-broken.jsonl").find((m) => m.subject === "Website: a referral could not be saved");
  expect(alert, "save failed alert").toBeTruthy();
  expect(alert!.text).not.toContain("Broken Test");
  expect(alert!.text).not.toContain("broken@example.test");
});

test("enquiry: validation, saved, thank you, alert with no details, privacy line", async ({ page }) => {
  await freshVisitor(page);
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "General enquiry" });
  await expect(form.getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy");

  await form.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.getByText("Enter your name")).toBeVisible();
  await expect(page.getByText("Enter your message")).toBeVisible();
  await expect(form.getByLabel("Name")).toBeFocused();

  await form.getByLabel("Name").fill("Test Enquirer");
  await form.getByLabel("Email").fill("enquirer@example.test");
  await form.getByLabel("Message").fill("Do you cover Logan? Test 55c1.");
  await form.getByRole("button", { name: "Send Enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Thank you, your enquiry is in" })).toBeVisible();

  const [e] = await sql(`SELECT * FROM enquiries WHERE message = $1`, ["Do you cover Logan? Test 55c1."]);
  expect(e).toMatchObject({ status: "new", name: "Test Enquirer", email: "enquirer@example.test", phone: null });
  const alert = emails().find((m) => m.subject === `New enquiry ${e.ref}`);
  expect(alert).toBeTruthy();
  expect(alert!.text).not.toContain("Logan");
  expect(alert!.text).not.toContain("Test Enquirer");
});

test("forms pass WCAG 2.2 AA and never scroll sideways, at every step", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await freshVisitor(page);
    await page.goto("/referral");
    await expectNoAxeViolations(page);
    await chooseAndContinue(page, "A professional");
    await page.getByRole("button", { name: "Continue" }).click(); // shows errors
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.getByLabel("Full name").fill("A11y Test");
    await page.getByLabel("Phone").fill("0400 000 123");
    await page.getByLabel("Email").fill("a11y@example.test");
    await page.getByRole("button", { name: "Continue" }).click();
    await expectNoAxeViolations(page);
    await page.getByLabel("Participant full name").fill("A11y Participant");
    await page.getByLabel("Participant phone").fill("0400 000 124");
    await page.getByLabel("Participant email").fill("a11yp@example.test");
    await page.getByLabel("Suburb and postcode").fill("Springfield 4300");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: /^Support coordination/ }).check({ force: true });
    await page.getByRole("radio", { name: "Plan-managed" }).check({ force: true });
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);
    await page.getByLabel(/what would help most/).fill("A11y.");
    await page.getByRole("button", { name: "Continue" }).click();
    await expectNoAxeViolations(page);
    await expectNoSidewaysScroll(page);

    await page.goto("/contact");
    await page.getByRole("form", { name: "General enquiry" }).getByRole("button", { name: "Send Enquiry" }).click();
    await expectNoAxeViolations(page);
  }
});

test("keyboard only: the referral can be completed without a mouse", async ({ page }) => {
  await freshVisitor(page);
  await page.goto("/referral");
  await page.getByRole("radio", { name: /I am the participant/ }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Continue" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Great, tell us about you" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Full name")).toBeFocused();
});
