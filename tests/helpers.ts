import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** Every width the site is checked at (A5 checks). */
export const WIDTHS = [390, 768, 1024, 1280, 1440, 1600] as const;

/** Public pages built so far. */
export const PUBLIC_PAGES = ["/", "/services", "/about", "/contact", "/referral", "/privacy"] as const;

/** Collect console errors and failed requests while a page is in use. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`page: ${err.message}`));
  page.on("requestfailed", (req) => errors.push(`request failed: ${req.url()}`));
  page.on("response", (res) => {
    if (res.status() >= 400) errors.push(`HTTP ${res.status()}: ${res.url()}`);
  });
  return errors;
}

/** WCAG 2.2 AA, which includes 2.1 AA and 2.0 AA. */
export async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
  );
  expect(summary, summary.join("\n")).toEqual([]);
}

/** The page must never scroll sideways. Measures what the browser drew. */
export async function expectNoSidewaysScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth}px wide in a ${clientWidth}px window`).toBeLessThanOrEqual(clientWidth);
}
