// Fails if a style sheet sets a fixed size in px (C76).
// Every size is written as N * var(--px) so the whole site scales evenly on big
// screens. Allowed: breakpoints in @media lines, hairlines of 2px or less, the
// --px definition itself, and anything inside a comment.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["app", "components"];
const PX = /(?<![\w.#-])(\d*\.?\d+)px\b/g;

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith(".css")) continue;
    const text = readFileSync(full, "utf8").replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
    text.split("\n").forEach((line, i) => {
      if (line.includes("@media") || line.includes("@container") || /--px\s*:/.test(line)) return;
      for (const m of line.matchAll(PX)) {
        if (parseFloat(m[1]) > 2) hits.push(`${path.relative(ROOT, full)}:${i + 1}  ${m[0]}`);
      }
    });
  }
}
DIRS.forEach((d) => walk(path.join(ROOT, d)));
if (hits.length) {
  console.error(`Fixed px sizes found (write them as N * var(--px)):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("Every size follows the site scale.");
