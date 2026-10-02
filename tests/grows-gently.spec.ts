import { expect, test, type Browser } from "@playwright/test";
import { PAGES } from "./screens";

/**
 * A big screen is not a zoom (C77, docs/decisions/0006-the-site-scales-to-every-screen.md).
 * Each page is measured on the design's screen (1440 x 900) and on big screens,
 * element by element, and fails if it behaves like a zoom:
 *   - body text grows more than 10%
 *   - buttons, menu links and form fields grow more than 8%
 *   - a page headline grows past 1.2 times the design's largest size
 *   - a line of text gets longer than 38.5em (about 75 characters), unless the
 *     design itself already had it that long
 *   - the content area does not get any wider (the extra room must be used)
 *   - the content area grows more than 1.26 times
 * Reference: Flight Centre keeps text, buttons and content width the same from
 * 1440 to 2560 wide. This site lets space and width grow a little more.
 */

const DESIGN = { w: 1440, h: 900 };
const BIG = [
  { w: 1920, h: 1080, name: "1080p monitor" },
  { w: 2560, h: 1440, name: "27 inch monitor" },
  { w: 3840, h: 2000, name: "4K monitor at 100%" },
];
/** The design's largest headline on each page (design-pack tokens: --h1-home and --h1-page). */
const H1_MAX = (path: string) => (path === "/" ? 150 : 112);

type Metrics = {
  body: number[];
  measure: number[];
  controls: number[];
  h1: number;
  content: number;
};

async function measure(browser: Browser, path: string, w: number, h: number): Promise<Metrics> {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const m = await page.evaluate(() => {
    const shown = (el: Element) => {
      if (el.closest("[hidden], .visually-hidden")) return false;
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return st.display !== "none" && st.visibility !== "hidden" && r.width > 0 && r.height > 0;
    };
    const paras = [...document.querySelectorAll("main p")].filter((e) => shown(e) && (e.textContent ?? "").trim().length > 40);
    const fs = (e: Element) => parseFloat(getComputedStyle(e).fontSize);
    const controls = [
      ...document.querySelectorAll('header nav a, [class*="pill"], main input:not([type=radio]):not([type=checkbox]), main select, main textarea'),
    ].filter(shown);
    return {
      body: paras.map(fs),
      // The widest line actually drawn, in ems: a fair stand-in for characters per line.
      measure: paras.map((e) => {
        const range = document.createRange();
        range.selectNodeContents(e);
        return Math.max(0, ...[...range.getClientRects()].map((r) => r.width)) / fs(e);
      }),
      controls: controls.map((e) => e.getBoundingClientRect().height),
      h1: fs(document.querySelector("h1")!),
      content: document.querySelector("header > *")!.getBoundingClientRect().width,
    };
  });
  await context.close();
  return m;
}

for (const path of PAGES) {
  test(`${path} grows gently on big screens, it does not zoom`, async ({ browser }) => {
    const base = await measure(browser, path, DESIGN.w, DESIGN.h);
    expect(base.body.length, "found body text to measure").toBeGreaterThan(0);
    const problems: string[] = [];
    for (const s of BIG) {
      const big = await measure(browser, path, s.w, s.h);
      const at = `${s.name} (${s.w}x${s.h})`;
      expect(big.body.length, `${at}: same paragraphs as the design screen`).toBe(base.body.length);
      big.body.forEach((v, i) => {
        if (v > base.body[i] * 1.1 + 0.01) problems.push(`${at}: body text ${base.body[i]}px became ${v.toFixed(1)}px`);
      });
      big.measure.forEach((v, i) => {
        if (v > Math.max(38.5, base.measure[i] + 0.5)) problems.push(`${at}: a text line is ${v.toFixed(1)}em long (design ${base.measure[i].toFixed(1)}em)`);
      });
      big.controls.forEach((v, i) => {
        if (base.controls[i] && v > base.controls[i] * 1.08 + 0.5) {
          problems.push(`${at}: a button or field went from ${Math.round(base.controls[i])}px to ${Math.round(v)}px tall`);
        }
      });
      if (big.h1 > H1_MAX(path) * 1.2 + 0.5) problems.push(`${at}: headline ${Math.round(big.h1)}px, over 1.2 times the design's ${H1_MAX(path)}px`);
      if (big.content <= base.content) problems.push(`${at}: the content area did not get any wider (${Math.round(big.content)}px)`);
      if (big.content > base.content * 1.26) problems.push(`${at}: the content area grew ${(big.content / base.content).toFixed(2)} times`);
    }
    expect(problems).toEqual([]);
  });
}
