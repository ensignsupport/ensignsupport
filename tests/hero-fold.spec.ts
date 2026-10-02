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
        cards: box(document.querySelector('section[aria-label="Our services"] > div')).top,
      };
    });
    console.log(`${w}x${h}: photo ${Math.round(m.image.height)}px tall, ends ${Math.round(h - m.image.bottom)}px above the fold, service row ${Math.round(m.cards - h)}px from the fold`);
    // The headline, buttons and the whole photo are on the first screen,
    expect(m.cta).toBeLessThan(h);
    expect(m.image.height).toBeGreaterThanOrEqual(360);
    // with 32px of space under the photo so its rounded corners show,
    expect(Math.abs(h - m.image.bottom - 32)).toBeLessThanOrEqual(1);
    // and the service row starts at the fold, not part way up the screen.
    expect(Math.abs(m.cards - h)).toBeLessThanOrEqual(1);
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

// Other pages: the headline and the space above it follow screen height too,
// so a 13 inch laptop sees more of the page. From 900px tall they are the design.
for (const path of ["/services", "/about", "/contact", "/referral"]) {
  test(`${path} headline fits a short 1280x800 screen and is full size on a tall one`, async ({ browser }) => {
    const sizes: Record<number, number> = {};
    for (const h of [800, 1300]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: h } });
      const page = await context.newPage();
      await page.goto(path);
      sizes[h] = await page.locator("h1").evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      await context.close();
    }
    expect(sizes[800]).toBeLessThan(100);
    expect(sizes[1300]).toBeCloseTo(109.44, 1); // 7.6% of 1440, the design size
  });
}
