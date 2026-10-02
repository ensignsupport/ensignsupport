import { expect, test } from "@playwright/test";
import { PAGES, SCREENS, siteScale } from "./screens";

/**
 * Every page on every screen (C76). Hero or no hero, nothing may look broken
 * on any screen from a phone to a 4K monitor. Each check is something a person
 * would call weird, measured instead of eyeballed:
 *   - the page scrolls sideways
 *   - two pieces of text sit on top of each other
 *   - text is cut off inside its box
 *   - a pill button wraps onto two lines
 *   - a photo is stretched past its real size (looks blurry)
 *   - a big empty band with nothing in it
 *   - the page headline is not on the first screen
 *   - a sticky panel is taller than the screen, so its bottom can never be reached
 *   - on a big screen the content sits in a small strip (under half the width)
 */
for (const path of PAGES) {
  for (const s of SCREENS) {
    test(`${path} looks right on a ${s.name} (${s.w}x${s.h})`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: s.w, height: s.h } });
      const page = await context.newPage();
      await page.goto(path, { waitUntil: "networkidle" });
      // Scroll through once so every lazy photo has loaded, then go back to the top.
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForLoadState("networkidle");
      const scale = await siteScale(page);

      // Photos: compare the real pixels of the file the browser chose with the size it is drawn at.
      // (naturalWidth on a responsive image is divided by its density, so load the file on its own.)
      const stretched = await page.evaluate(async () => {
        const out: string[] = [];
        for (const img of document.querySelectorAll("main img")) {
          const el = img as HTMLImageElement;
          const r = el.getBoundingClientRect();
          if (!el.currentSrc || r.width < 10 || el.closest("[hidden]") || getComputedStyle(el).display === "none") continue;
          const file = new Image();
          file.src = el.currentSrc;
          await file.decode().catch(() => undefined);
          if (!file.naturalWidth) continue;
          const cover = getComputedStyle(el).objectFit === "cover";
          const stretch = cover ? Math.max(r.width / file.naturalWidth, r.height / file.naturalHeight) : r.width / file.naturalWidth;
          if (stretch > 1.25) out.push(`photo stretched ${stretch.toFixed(2)}x: ${el.alt.slice(0, 28)}`);
        }
        return out;
      });

      const problems = await page.evaluate((scale) => {
        const out: string[] = [];
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const main = document.querySelector("main")!;
        const shown = (el: Element) => {
          if (el.closest("[hidden], .visually-hidden")) return false;
          const st = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return st.display !== "none" && st.visibility !== "hidden" && parseFloat(st.opacity) > 0.05 && r.width > 0 && r.height > 0;
        };
        const label = (el: Element) => `"${(el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 28)}"`;

        if (document.documentElement.scrollWidth > vw + 1) out.push(`scrolls sideways by ${document.documentElement.scrollWidth - vw}px`);

        const texts = [...main.querySelectorAll("h1, h2, h3, p, a, button, label, li")].filter((e) => shown(e) && (e.textContent ?? "").trim());
        for (const e of texts) {
          const st = getComputedStyle(e);
          if (st.overflow !== "visible" && e.scrollWidth > e.clientWidth + 2) out.push(`text cut off: ${label(e)}`);
        }
        const rects = texts.map((e) => [e, e.getBoundingClientRect()] as const);
        for (let i = 0; i < rects.length; i++) {
          for (let j = i + 1; j < rects.length; j++) {
            const [a, ra] = rects[i];
            const [b, rb] = rects[j];
            if (a.contains(b) || b.contains(a)) continue;
            const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
            const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
            if (ox > 4 && oy > 4) out.push(`text on top of text: ${label(a)} and ${label(b)}`);
          }
        }

        for (const btn of main.querySelectorAll('[class*="pill"]')) {
          if (!shown(btn)) continue;
          const tops = new Set<number>();
          const walker = document.createTreeWalker(btn, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!(node.textContent ?? "").trim() || node.parentElement?.closest(".visually-hidden")) continue;
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const r of range.getClientRects()) tops.add(Math.round(r.top / 4));
          }
          if (tops.size > 1) out.push(`button wraps: ${label(btn)}`);
        }

        // Empty bands: anything with text, a photo, a fill or a border counts as content.
        const filled = [...main.querySelectorAll("*")].filter((e) => {
          if (!shown(e)) return false;
          const st = getComputedStyle(e);
          return (
            e.tagName === "IMG" ||
            [...e.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim()) ||
            st.backgroundColor !== "rgba(0, 0, 0, 0)" ||
            st.backgroundImage !== "none" ||
            parseFloat(st.borderTopWidth) > 0
          );
        });
        const spans = filled.map((e) => {
          const r = e.getBoundingClientRect();
          return [r.top + window.scrollY, r.bottom + window.scrollY];
        });
        spans.sort((a, b) => a[0] - b[0]);
        let reach = spans.length ? spans[0][1] : 0;
        for (const [top, bottom] of spans) {
          if (top - reach > 160 * scale) out.push(`empty band ${Math.round(top - reach)}px tall at ${Math.round(reach)}px`);
          reach = Math.max(reach, bottom);
        }

        const h1 = document.querySelector("h1")!.getBoundingClientRect();
        if (h1.bottom > vh) out.push(`headline ends below the first screen (${Math.round(h1.bottom)}px of ${vh}px)`);

        for (const e of document.querySelectorAll("main *")) {
          const st = getComputedStyle(e);
          if (st.position !== "sticky" || !shown(e)) continue;
          const room = vh - (parseFloat(st.top) || 0);
          if (e.getBoundingClientRect().height > room + 1) out.push(`sticky panel taller than the screen: ${label(e)}`);
        }

        if (vw > 1440) {
          const inner = document.querySelector("header > *")!.getBoundingClientRect();
          if (inner.width < vw * 0.5) out.push(`content only ${Math.round((inner.width / vw) * 100)}% of the screen width`);
        }
        return out;
      }, scale);

      expect([...stretched, ...problems], `${path} at ${s.w}x${s.h} (scale ${scale.toFixed(2)})`).toEqual([]);
      await context.close();
    });
  }
}
