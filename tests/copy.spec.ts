import { expect, test } from "@playwright/test";

/**
 * Locked copy from the developer brief must appear word for word.
 * Two approved changes: the name is "Ensign Support Services", and the long
 * dash in the Why Ensign paragraph became a comma. Values lost their dash too
 * (the name is the card title, the sentence follows).
 */
const LOCKED: Record<string, string[]> = {
  "/": [
    "Support coordination helps you understand your NDIS plan, find the right supports, and keep those supports working together.",
    "Ensign Support Services works with self-managed and plan-managed NDIS participants.",
    "NDIS support coordination and psychosocial recovery coaching.",
  ],
  "/services": [
    "Ensign Support Services works with self-managed and plan-managed NDIS participants.",
    "We help participants and families understand their NDIS plan, connect with the right supports, and keep services working together. We work alongside plan managers, health professionals, and other providers so the plan is used in a practical, coordinated way.",
    "We support participants living with psychosocial disability to build skills, routines, and community connections that matter to them. Coaching is practical and participant-led. It is not clinical treatment.",
  ],
  "/about": [
    "Ensign Support Services provides NDIS support coordination and psychosocial recovery coaching. We work with people with disability, including psychosocial disability, and with the families and professionals around them. The team brings more than seven years’ experience in mental health and disability services, and practical knowledge of the NDIS.",
    "The word ensign means a flag, a mark of direction. Ensign Support Services helps NDIS participants navigate their disability journey. We stand with them, work with them, and support them on that journey.",
    "Ensign Support Services helps people navigate their disability journey, building independence and meeting their disability-related needs.",
    "Ensign Support Services helps NDIS participants understand their plan, connect with the right service providers, manage their supports, and build their capacity to work towards greater independence.",
    "Genuine care for participants and families, not just service delivery.",
    "Honest hours, honest invoicing to plan managers, honest reporting to the NDIA.",
    "Actively representing participants' interests within the NDIS system, especially those it tends to overlook.",
  ],
  "/contact": [
    "We currently provide services across South East Queensland, with the potential to deliver services across Australia in the future.",
  ],
};

for (const [path, lines] of Object.entries(LOCKED)) {
  test(`${path}: locked copy is word for word`, async ({ page }) => {
    await page.goto(path);
    const text = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    for (const line of lines) expect(text, `missing on ${path}: "${line}"`).toContain(line);
  });
}

test("About us order: company paragraph, then Why Ensign, then Vision, Mission and Values", async ({ page }) => {
  await page.goto("/about");
  const text = await page.locator("main").innerText();
  const order = ["Practical Knowledge", "Why Ensign", "Where We Are Headed", "What We Stand For"].map((h) => text.indexOf(h));
  expect(order.every((i) => i >= 0)).toBe(true);
  expect([...order].sort((a, b) => a - b)).toEqual(order);
});

test("Home does not carry the Why Ensign paragraph (About us only)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).not.toContainText("The word ensign means a flag");
});

test("Home values strip uses the three names only", async ({ page }) => {
  await page.goto("/");
  const values = page.getByRole("list", { name: "Our values" });
  await expect(values.getByRole("listitem")).toHaveText(["Compassion", "Integrity", "Advocacy"]);
});
