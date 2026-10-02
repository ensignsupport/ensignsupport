import { expect, test } from "@playwright/test";
import { PUBLIC_PAGES } from "./helpers";

const NAV = [
  { path: "/", label: "Home" },
  { path: "/services", label: "Services" },
  { path: "/about", label: "About us" },
  { path: "/contact", label: "Contact" },
  { path: "/referral", label: "Referral" },
];

test.describe("header on wide screens", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const item of NAV) {
    test(`${item.label} is marked as the current page on ${item.path}`, async ({ page }) => {
      await page.goto(item.path);
      const nav = page.getByRole("navigation", { name: "Main" });
      await expect(nav).toBeVisible();
      const current = nav.locator('[aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(item.label);
    });
  }

  test("phone menu button is hidden and Make a Referral goes to the referral page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
    await page.getByRole("banner").getByRole("link", { name: "Make a Referral" }).click();
    await expect(page).toHaveURL(/\/referral$/);
  });

  test("header is 92px tall, as designed", async ({ page }) => {
    await page.goto("/");
    const box = await page.getByRole("banner").boundingBox();
    expect(Math.round(box!.height)).toBe(92);
  });
});

test.describe("phone menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("is a disclosure button that opens, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("navigation", { name: "Main" })).toBeHidden();
    const button = page.getByRole("button", { name: "Menu" });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    const panelId = await button.getAttribute("aria-controls");
    const panel = page.locator(`[id="${panelId}"]`);
    await expect(panel).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu.locator('[aria-current="page"]')).toHaveText("Services");

    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("choosing a page closes the menu", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "About us" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("tapping outside closes the menu", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await page.mouse.click(195, 700);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("the open menu fits inside the screen", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const panel = await page.locator('[id]:has(> nav[aria-label="Mobile"])').boundingBox();
    expect(panel!.x).toBeGreaterThanOrEqual(0);
    expect(panel!.x + panel!.width).toBeLessThanOrEqual(390);
  });
});

test.describe("footer", () => {
  test("on phones the referral link is a full width 48px button", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const link = page.getByRole("contentinfo").getByRole("link", { name: "Make a referral" });
    const box = await link.boundingBox();
    expect(Math.round(box!.height)).toBe(48);
    expect(box!.width).toBeGreaterThan(300);
  });

  test("shows the ABN and the unregistered provider line on every page", async ({ page }) => {
    for (const path of PUBLIC_PAGES) {
      await page.goto(path);
      await expect(page.getByRole("contentinfo")).toContainText("ABN 19 518 036 825 · Not a registered NDIS provider");
    }
  });

  test("partner link opens archwayautomation.com.au in a new tab", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("contentinfo").getByRole("link", { name: /Visit website/ });
    await expect(link).toHaveAttribute("href", "https://archwayautomation.com.au");
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("privacy policy link goes to the privacy page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: "Privacy policy" }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });
});

test.describe("compliance on every page", () => {
  for (const path of PUBLIC_PAGES) {
    test(`${path}: no NDIA-managed option, no registered claim, no NDIS logo`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator("body").innerText()).toLowerCase();
      expect(text).not.toContain("ndia-managed");
      expect(text).not.toContain("agency-managed");
      // "Not a registered NDIS provider" is the only allowed use of the phrase.
      expect(text).not.toMatch(/(?<!not a )registered ndis provider/);
      expect(text).not.toMatch(/ndia[- ]endorsed|endorsed by the ndia/);
      await expect(page.locator('img[src*="ndis" i], img[alt*="ndis logo" i]')).toHaveCount(0);
    });
  }
});

test("keyboard: the first Tab shows the skip link, and it jumps to the content", async ({ page }) => {
  await page.goto("/services");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  const box = await skip.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("keyboard: every header control shows a visible focus ring", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.keyboard.press("Tab"); // skip link
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return { tag: el.tagName, width: style.outlineWidth, styleName: style.outlineStyle };
    });
    expect(outline.styleName, `${outline.tag} has no focus ring`).not.toBe("none");
    expect(parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  }
});
