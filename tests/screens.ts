import type { Page } from "@playwright/test";

/**
 * Real screens, short and tall (C75, C76). Sizes are the visible browser area.
 * Widths alone are not screens: the same width comes in very different heights.
 */
export const SCREENS: { w: number; h: number; name: string }[] = [
  { w: 390, h: 844, name: "phone" },
  { w: 760, h: 1024, name: "tablet upright" },
  { w: 1024, h: 768, name: "tablet on its side" },
  { w: 1280, h: 720, name: "short laptop" },
  { w: 1366, h: 768, name: "older Windows laptop" },
  { w: 1280, h: 800, name: "13 inch laptop" },
  { w: 1512, h: 850, name: "14 inch laptop" },
  { w: 1440, h: 900, name: "the design's screen" },
  { w: 1920, h: 1080, name: "1080p monitor" },
  { w: 2560, h: 1300, name: "27 inch monitor" },
  { w: 2560, h: 1600, name: "16 inch MacBook Pro" },
  { w: 3440, h: 1340, name: "ultrawide monitor" },
  { w: 3840, h: 2000, name: "4K monitor at 100%" },
  { w: 1080, h: 1800, name: "monitor turned sideways" },
];

export const PAGES = ["/", "/services", "/about", "/contact", "/referral", "/privacy"];

/** The site-wide scale (--px) in effect on this screen: 1 at the design's size. */
export async function siteScale(page: Page): Promise<number> {
  return page.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:calc(1000 * var(--px))";
    document.body.appendChild(probe);
    const px = probe.getBoundingClientRect().width / 1000;
    probe.remove();
    return px;
  });
}
