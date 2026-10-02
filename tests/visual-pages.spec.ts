import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { applyApprovedChanges, compare, openDesignPreview } from "./design-reference";

/**
 * Whole pages compared with the approved design at desktop and phone widths.
 * Photos are hidden on both sides (the box behind each one still shows),
 * because the site serves resized, compressed copies (next/image), which never
 * match the originals pixel for pixel. Everything drawn over a photo is compared.
 * Height must match to within 2px and 98.5% of pixels must be identical.
 *
 * Home above 760px: the hero fills the first screen (change raised by Allen, see
 * docs/decisions/0005-hero-fits-the-screen.md), so the site is opened on a
 * screen exactly as tall as the designed hero, with the design's 20px gap under
 * the photo (the site uses 32px). There it must match the design.
 * tests/hero-fold.spec.ts checks the real gap and shorter and taller screens.
 */
const HIDE_PHOTOS = "img { opacity: 0 !important; }";

const PAGES = [
  { site: "/", design: "home" },
  { site: "/services", design: "services" },
  { site: "/about", design: "about" },
  { site: "/contact", design: "contact" },
  { site: "/referral", design: "referral" },
];

for (const pg of PAGES) {
  for (const width of [390, 760, 1024, 1440]) {
    test(`${pg.site} matches the design at ${width}px`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const designPage = await context.newPage();
      await openDesignPreview(designPage, pg.design);
      await applyApprovedChanges(designPage);
      const designHeight = await designPage.evaluate(() => document.documentElement.scrollHeight);
      await designPage.addStyleTag({ content: HIDE_PHOTOS });
      const designShot = await designPage.screenshot({ fullPage: true, animations: "disabled" });

      const sitePage = await context.newPage();
      if (pg.design === "home" && width > 760) {
        const fold = await designPage.evaluate(() => Math.round(document.querySelector(".es-hero-img")!.getBoundingClientRect().bottom + window.scrollY));
        await sitePage.setViewportSize({ width, height: fold + 20 });
      }
      await sitePage.goto(pg.site);
      if (pg.design === "home" && width > 760) {
        await sitePage.addStyleTag({ content: '[class*="heroFold"], [class*="teaserSection"] { --hero-gap: 20px !important; }' });
      }
      await sitePage.evaluate(() => document.fonts.ready);
      const siteHeight = await sitePage.evaluate(() => document.documentElement.scrollHeight);
      await sitePage.addStyleTag({ content: HIDE_PHOTOS });
      const siteShot = await sitePage.screenshot({ fullPage: true, animations: "disabled" });

      const diff = compare(designShot, siteShot);
      const dir = path.join(__dirname, "..", "test-results", "visual-diffs");
      mkdirSync(dir, { recursive: true });
      const slug = `page-${pg.design}-${width}`;
      writeFileSync(path.join(dir, `${slug}-design.png`), designShot);
      writeFileSync(path.join(dir, `${slug}-site.png`), siteShot);
      writeFileSync(path.join(dir, `${slug}-diff.png`), diff.diffPng);
      await testInfo.attach(`diff-${slug}.png`, { body: diff.diffPng, contentType: "image/png" });

      expect(Math.abs(siteHeight - designHeight), `page height: site ${siteHeight}px, design ${designHeight}px`).toBeLessThanOrEqual(2);
      expect(diff.ratio, `${(diff.ratio * 100).toFixed(2)}% of pixels differ`).toBeLessThan(0.015);
      await context.close();
    });
  }
}

// Contact: the enquiry form arrives in milestone 4, so its parts are compared one by one.
const CONTACT_PARTS = [
  { name: "info cards", design: ".es-info", site: 'section[aria-label="Contact details"] > ul' },
  { name: "referral and area cards", design: 'form[aria-label="General enquiry"] + div', site: "h2:text('Making a') >> xpath=../../.." },
];

for (const part of CONTACT_PARTS) {
  for (const width of [390, 760, 1024, 1440]) {
    test(`/contact ${part.name} match the design at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const designPage = await context.newPage();
      await openDesignPreview(designPage, "contact");
      const designEl = designPage.locator(part.design).first();
      const designBox = await designEl.boundingBox();
      const designShot = await designEl.screenshot({ animations: "disabled" });

      const sitePage = await context.newPage();
      await sitePage.goto("/contact");
      await sitePage.evaluate(() => document.fonts.ready);
      const siteEl = sitePage.locator(part.site).first();
      const siteBox = await siteEl.boundingBox();
      const siteShot = await siteEl.screenshot({ animations: "disabled" });

      const diff = compare(designShot, siteShot);
      expect(Math.round(siteBox!.width), "width").toBe(Math.round(designBox!.width));
      // The side column stretches to the form's height on wide screens, so only check height on phones.
      if (part.name === "info cards" || width < 900) {
        expect(Math.abs(siteBox!.height - designBox!.height), "height").toBeLessThanOrEqual(2);
        expect(diff.ratio, `${(diff.ratio * 100).toFixed(2)}% of pixels differ`).toBeLessThan(0.015);
      }
      await context.close();
    });
  }
}
