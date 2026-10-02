import { readFileSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const ROOT = path.resolve(__dirname, "..");
const PACK = path.join(ROOT, "design-pack");

const FONT_CSS = `
@font-face { font-family: 'Geist'; font-weight: 100 900; font-style: normal; src: url(http://design.local/__fonts/geist.woff2) format('woff2'); }
@font-face { font-family: 'Caveat'; font-weight: 500; font-style: normal; src: url(http://design.local/__fonts/caveat.woff2) format('woff2'); }
`;

const TYPES: Record<string, string> = {
  ".html": "text/html",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".css": "text/css",
  ".woff2": "font/woff2",
};

/**
 * Opens a page from design-pack/previews with the real fonts, offline.
 * The previews ask Google Fonts for Geist and Caveat, so those requests are
 * answered with the same self-hosted files the site uses.
 */
export async function openDesignPreview(page: Page, name: string) {
  await page.route("https://fonts.googleapis.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/css", body: FONT_CSS }),
  );
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("http://design.local/**", (route) => {
    const url = new URL(route.request().url());
    let file: string;
    if (url.pathname === "/__fonts/geist.woff2") file = path.join(ROOT, "app/fonts/Geist-Variable-latin.woff2");
    else if (url.pathname === "/__fonts/caveat.woff2") file = path.join(ROOT, "app/fonts/Caveat-500-latin.woff2");
    else file = path.join(PACK, decodeURIComponent(url.pathname));
    try {
      const body = readFileSync(file);
      return route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] ?? "application/octet-stream", body });
    } catch {
      return route.fulfill({ status: 404, body: "" });
    }
  });
  await page.goto(`http://design.local/previews/${name}.html`);
  // Apply the three documented accessibility colour adjustments
  // (docs/decisions/0002) so the comparison is like for like.
  await page.addStyleTag({ content: AA_ADJUSTMENTS });
  await page.evaluate(() => document.fonts.ready);
}

const AA_ADJUSTMENTS = `
.es-foot-bottom, .es-foot-bottom a { color: #6B718A !important; }
@media (max-width: 600px) {
  .es-foot-grid > :nth-child(2) > span:first-child,
  .es-foot-grid > :nth-child(3) > span:first-child { color: #697291 !important; }
}
h1 span[style*="#7D8DE3"], div span[style*="#7D8DE3"] { color: #7687E2 !important; }
`;

/**
 * Approved changes made after the design was locked, applied to the design
 * previews so comparisons stay like for like.
 * - 2 Oct 2026: the "You" and "Your coordinator" tags on the Home hero photos are removed (Allen).
 */
export async function applyApprovedChanges(page: Page) {
  await page.evaluate(() => {
    for (const span of Array.from(document.querySelectorAll("span"))) {
      const text = span.textContent?.trim();
      if ((text === "You" || text === "Your coordinator") && span.style.position === "absolute") span.remove();
    }
  });
}

export type Diff = { ratio: number; diffPng: Buffer; width: number; height: number };

/** Pixel difference between two screenshots of the same size. */
export function compare(a: Buffer, b: Buffer): Diff {
  const imgA = PNG.sync.read(a);
  const imgB = PNG.sync.read(b);
  const width = Math.min(imgA.width, imgB.width);
  const height = Math.min(imgA.height, imgB.height);
  const crop = (img: PNG) => {
    const out = new PNG({ width, height });
    PNG.bitblt(img, out, 0, 0, width, height, 0, 0);
    return out;
  };
  const ca = crop(imgA);
  const cb = crop(imgB);
  const diff = new PNG({ width, height });
  const changed = pixelmatch(ca.data, cb.data, diff.data, width, height, { threshold: 0.1 });
  return { ratio: changed / (width * height), diffPng: PNG.sync.write(diff), width, height };
}
