import { expect, test } from "@playwright/test";

/**
 * The Home hero fits the first screen on laptops and monitors (C61, raised by
 * Allen 2 Oct 2026). Sizes are the visible browser area, not the whole screen:
 * 1280x800 and 1512x850 are the 13 and 14 inch laptop floor cases.
 */
const SCREENS = [
  { w: 1280, h: 800 },
  { w: 1512, h: 850 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
  { w: 2560, h: 1300 },
];

for (const { w, h } of SCREENS) {
  test(`Home hero fills a ${w}x${h} screen`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(() => {
      const box = (el: Element | null) => el!.getBoundingClientRect();
      const ctas = [...document.querySelectorAll("main a")].filter((a) => a.textContent?.includes("Make a Referral"));
      return {
        cta: box(ctas[0]).bottom,
        image: box(document.querySelector('[class*="heroImageSection"] > div')),
        next: box(document.querySelector('section[aria-label="Our services"]')).top,
      };
    });
    console.log(`${w}x${h}: photo ${Math.round(m.image.height)}px tall, next section ${Math.round(m.next - h)}px from the fold`);
    // The headline, buttons and the whole photo are on the first screen...
    expect(m.cta).toBeLessThan(h);
    expect(m.image.height).toBeGreaterThanOrEqual(360);
    expect(m.image.bottom).toBeLessThanOrEqual(h + 1);
    // ...and the next section starts at the fold, not part way up the screen.
    expect(Math.abs(m.next - h)).toBeLessThanOrEqual(1);
    await context.close();
  });
}

// Short screens: the photo stops shrinking at 360px, so the hero can run a little past the fold.
for (const { w, h } of [{ w: 1280, h: 720 }, { w: 1024, h: 768 }]) {
  test(`Home hero on a short ${w}x${h} screen keeps a usable photo`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await context.newPage();
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const box = await page.locator('[class*="heroImageSection"] > div').evaluate((el) => el.getBoundingClientRect().toJSON());
    expect(box.height).toBeGreaterThanOrEqual(360);
    expect(box.top, "at least half the photo is on the first screen").toBeLessThan(h - 180);
    await context.close();
  });
}
