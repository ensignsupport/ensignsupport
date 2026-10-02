import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { compare, openDesignPreview } from "./design-reference";

/**
 * Each shared part is drawn on the site and in the approved design, at the
 * same width, and compared pixel by pixel. Sizes must match exactly and
 * at least 98.5% of pixels must match. Diff images are attached to the report.
 */
const PARTS = [
  { name: "header", design: "header", site: "header" },
  { name: "referral band", design: "section#referral", site: 'section[aria-labelledby="referral-band-heading"]' },
  { name: "footer", design: "footer", site: "footer" },
];

for (const width of [390, 760, 1024, 1440]) {
  for (const part of PARTS) {
    test(`${part.name} matches the design at ${width}px`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const designPage = await context.newPage();
      await openDesignPreview(designPage, "home");
      const designEl = designPage.locator(part.design).first();
      const designBox = await designEl.boundingBox();
      const designShot = await designEl.screenshot({ animations: "disabled" });

      const sitePage = await context.newPage();
      await sitePage.goto("/");
      await sitePage.evaluate(() => document.fonts.ready);
      const siteEl = sitePage.locator(part.site).first();
      const siteBox = await siteEl.boundingBox();
      const siteShot = await siteEl.screenshot({ animations: "disabled" });

      const diff = compare(designShot, siteShot);
      await testInfo.attach(`design-${part.name}-${width}.png`, { body: designShot, contentType: "image/png" });
      await testInfo.attach(`site-${part.name}-${width}.png`, { body: siteShot, contentType: "image/png" });
      await testInfo.attach(`diff-${part.name}-${width}.png`, { body: diff.diffPng, contentType: "image/png" });
      // Keep a copy outside the report so the images can be opened directly.
      const dir = path.join(__dirname, "..", "test-results", "visual-diffs");
      mkdirSync(dir, { recursive: true });
      const slug = `${part.name.replace(/\s+/g, "-")}-${width}`;
      writeFileSync(path.join(dir, `${slug}-design.png`), designShot);
      writeFileSync(path.join(dir, `${slug}-site.png`), siteShot);
      writeFileSync(path.join(dir, `${slug}-diff.png`), diff.diffPng);

      expect(Math.round(siteBox!.width), "width").toBe(Math.round(designBox!.width));
      expect(Math.round(siteBox!.height), "height").toBe(Math.round(designBox!.height));
      // Allowance covers text anti-aliasing when a part sits half a pixel
      // lower on one page than the other. Real layout faults move far more.
      expect(diff.ratio, `${(diff.ratio * 100).toFixed(2)}% of pixels differ`).toBeLessThan(0.015);
      await context.close();
    });
  }
}
