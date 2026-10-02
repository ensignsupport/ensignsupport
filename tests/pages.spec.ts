import { expect, test } from "@playwright/test";
import { expectNoAxeViolations, expectNoSidewaysScroll, PUBLIC_PAGES, watchErrors, WIDTHS } from "./helpers";

const EM_DASH = String.fromCharCode(0x2014);

for (const path of PUBLIC_PAGES) {
  for (const width of WIDTHS) {
    test(`${path} at ${width}px: loads clean, no sideways scroll, WCAG 2.2 AA`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);

      await expectNoSidewaysScroll(page);
      await expectNoAxeViolations(page);
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }

  test(`${path}: one h1, a title and a meta description`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const title = await page.title();
    expect(title).toContain("Ensign Support Services");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(40);
  });
}

test("every page has its own title and description", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of PUBLIC_PAGES) {
    await page.goto(path);
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
  }
  expect(titles.size).toBe(PUBLIC_PAGES.length);
  expect(descriptions.size).toBe(PUBLIC_PAGES.length);
});

test("no em dash and no dead # links on any page", async ({ page }) => {
  for (const path of PUBLIC_PAGES) {
    await page.goto(path);
    const html = await page.content();
    const text = await page.locator("body").innerText();
    expect(text.includes(EM_DASH), `em dash in the text of ${path}`).toBe(false);
    expect(html.includes(EM_DASH), `em dash in the markup of ${path}`).toBe(false);
    await expect(page.locator('a[href="#"]'), `dead link on ${path}`).toHaveCount(0);
  }
});

test("fonts are self-hosted and Geist is the font in use", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (req) => {
    const url = new URL(req.url());
    if (url.hostname !== "localhost") external.push(req.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.toLowerCase()),
  );
  expect(loaded.some((family) => family.includes("geist"))).toBe(true);
  expect(external, `requests left the site: ${external.join(", ")}`).toEqual([]);
});

test("the dev site is never indexed by search engines", async ({ page, request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/\s*$/m);
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
