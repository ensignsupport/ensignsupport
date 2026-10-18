import { expect, test, type Page } from "@playwright/test";
import { expectNoAxeViolations, expectNoSidewaysScroll, PUBLIC_PAGES, watchErrors } from "./helpers";

/**
 * Milestone 6 full check: the states and ways of using the site that the
 * other tests do not cover. Keyboard only on every page, landmarks and names
 * for screen readers, reduced motion, and the page not found.
 */

/** Tab through a page and describe every stop: what it is, and whether it can be seen. */
async function tabThrough(page: Page, max = 120) {
  const stops: { name: string; visible: boolean; ring: boolean}[] = [];
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      const hidden = Boolean(el.closest("[hidden], [inert]")) || st.visibility === "hidden" || r.width === 0 || r.height === 0;
      const onScreen = r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
      const ring =
        (st.outlineStyle !== "none" && parseFloat(st.outlineWidth) >= 2) ||
        (st.boxShadow !== "none" && st.boxShadow !== "") ||
        // a radio or checkbox shows its ring on the visible box next to it
        Boolean(el.matches("input[type=radio], input[type=checkbox]"));
      const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40);
      return { name, visible: !hidden && onScreen, ring };
    });
    if (!stop) break; // focus left the page: no trap
    stops.push(stop);
  }
  return stops;
}

for (const width of [1440, 390]) {
  for (const path of PUBLIC_PAGES) {
    test(`${path} at ${width}px: keyboard only, every stop can be seen and shows a focus ring`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const stops = await tabThrough(page);
      expect(stops.length, "Tab reaches the page").toBeGreaterThan(3);
      expect(stops.length, "Tab never gets stuck on the page").toBeLessThan(120);
      const problems = stops
        .filter((s) => !s.visible || !s.ring)
        .map((s) => `${s.name}: ${s.visible ? "" : "hidden or off screen "}${s.ring ? "" : "no focus ring"}`);
      expect(problems).toEqual([]);
    });
  }
}

for (const path of PUBLIC_PAGES) {
  test(`${path}: landmarks and names a screen reader needs`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("banner")).toHaveCount(1);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "en-AU");
    // Several navigation areas are fine, as long as a screen reader can tell them apart.
    const navNames = await page.getByRole("navigation").evaluateAll((navs) =>
      navs.filter((n) => (n as HTMLElement).offsetParent !== null).map((n) => n.getAttribute("aria-label") ?? ""),
    );
    expect(navNames.every(Boolean), `every navigation has a name: ${JSON.stringify(navNames)}`).toBe(true);
    expect(new Set(navNames).size, `navigation names are different: ${JSON.stringify(navNames)}`).toBe(navNames.length);
    // Headings go down one level at a time.
    const levels = await page.locator("main h1, main h2, main h3, main h4").evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1], `heading order ${levels.join(",")}`).toBeLessThanOrEqual(1);
  });
}

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  for (const path of PUBLIC_PAGES) {
    test(`${path}: nothing moves when the visitor has asked for less motion`, async ({ page }) => {
      await page.goto(path);
      const moving = await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 30));
        }
        const hovered = document.querySelector("a[class*=pill], button");
        hovered?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        return document
          .getAnimations()
          .filter((a) => {
            const t = a.effect?.getComputedTiming();
            return a.playState === "running" && Number(t?.duration ?? 0) > 20;
          })
          .map((a) => {
            const target = (a.effect as KeyframeEffect | null)?.target as Element | null;
            return `${a.constructor.name} on ${target?.className.toString().slice(0, 40)}`;
          });
      });
      expect(moving).toEqual([]);
      // Content is all there: nothing waits for an animation to appear.
      const faint = await page.evaluate(() =>
        [...document.querySelectorAll("main *")].filter(
          // A disabled button is dimmed on purpose; anything else faint is waiting for an animation.
          (e) => parseFloat(getComputedStyle(e).opacity) < 0.95 && (e.textContent ?? "").trim() && !e.closest(":disabled"),
        ).length,
      );
      expect(faint).toBe(0);
    });
  }
});

test.describe("page not found", () => {
  for (const width of [1440, 390]) {
    test(`an unknown address shows a proper page at ${width}px, with the site around it`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto("/this-page-does-not-exist");
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toContainText("This page");
      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Go to Home" })).toHaveAttribute("href", "/");
      expect(await page.title()).toContain("Page not found");
      await expectNoSidewaysScroll(page);
      await expectNoAxeViolations(page);
      // The 404 response itself is expected; anything else is not.
      expect(errors.filter((e) => !e.includes("this-page-does-not-exist") && !e.includes("status of 404"))).toEqual([]);
    });
  }
});

test("keyboard only: the contact enquiry can be sent without a mouse", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: /enquiry/i });
  await form.getByRole("textbox").first().focus();
  const fields = await form.locator("input:not([type=hidden]):not([tabindex='-1']), textarea").evaluateAll((els) =>
    els.filter((e) => (e as HTMLElement).offsetParent !== null).map((e) => (e as HTMLInputElement).name),
  );
  const values: Record<string, string> = {
    name: "Keyboard Test",
    email: "keyboard@example.test",
    phone: "0400 000 000",
    message: "Testing that the enquiry form works by keyboard only.",
  };
  for (const name of fields) {
    const key = Object.keys(values).find((k) => name.toLowerCase().includes(k));
    if (key) await page.keyboard.type(values[key]);
    await page.keyboard.press("Tab");
  }
  // The collection notice and its privacy policy link come before the button (APP 5), so one more Tab.
  await expect(page.locator(":focus")).toHaveText(/privacy policy/i);
  await page.keyboard.press("Tab");
  // Tab has reached the send button; Enter sends.
  await expect(page.locator(":focus")).toHaveText(/send/i);
  await page.keyboard.press("Enter");
  await expect(form.or(page.locator("main")).getByText(/Thank you/)).toBeVisible();
});
