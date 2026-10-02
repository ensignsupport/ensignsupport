// Fails if a style sheet sets a size that does not follow the site's growth
// rules (C77, docs/decisions/0006-the-site-scales-to-every-screen.md).
// Every size is written as N * var(--px-<kind>), where the kind says how fast it
// grows on big screens: ui, text, head, gap, space, media or wide.
// Allowed as plain px: breakpoints in @media lines, hairlines of 2px or less,
// screen sizes compared with the screen (960px - 100svh), and comments.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["app", "components"];
const KINDS = ["ui", "text", "head", "gap", "space", "media", "wide"];
const PX = /(?<![\w.#-])(\d*\.?\d+)px\b/g;
const SCREEN = /(\d*\.?\d+px\s*-\s*100s?v[wh])|(100s?v[wh]\s*-\s*\d*\.?\d+px)/g;
const UNIT = /var\(--px(-[\w]+)?\b/g;

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!/\.(css|tsx)$/.test(name)) continue;
    const css = name.endsWith(".css");
    const text = readFileSync(full, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
    text.split("\n").forEach((line, i) => {
      const where = `${path.relative(ROOT, full)}:${i + 1}`;
      for (const m of line.matchAll(UNIT)) {
        const kind = m[1]?.slice(1);
        if (!kind || !KINDS.includes(kind)) hits.push(`${where}  ${m[0]}  (use one of --px-${KINDS.join(", --px-")})`);
      }
      if (!css || line.includes("@media") || line.includes("@container") || /--grow\s*:/.test(line)) return;
      for (const m of line.replace(SCREEN, "").matchAll(PX)) {
        if (parseFloat(m[1]) > 2) hits.push(`${where}  ${m[0]}  (write it as N * var(--px-<kind>))`);
      }
    });
  }
}
DIRS.forEach((d) => walk(path.join(ROOT, d)));
if (hits.length) {
  console.error(`Sizes that do not follow the growth rules:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("Every size follows the growth rules.");
