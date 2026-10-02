// Fails if an em dash appears in any file we write.
// Skips third party and generated files, and the Next.js managed block in AGENTS.md.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report", "design-pack", "archway-rebuild", "Claude outputs"]);
const SKIP_FILES = new Set(["package-lock.json"]);
const TEXT = /\.(ts|tsx|js|mjs|cjs|css|md|json|html|txt|svg|toml|yml|yaml|sql)$/;
const EM_DASH = String.fromCharCode(0x2014);

const hits = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full);
      continue;
    }
    if (SKIP_FILES.has(name) || !TEXT.test(name) || name.endsWith("-OFL.txt")) continue;
    let text = readFileSync(full, "utf8");
    if (name === "AGENTS.md") text = text.replace(/<!-- BEGIN:nextjs-agent-rules -->[\s\S]*<!-- END:nextjs-agent-rules -->/, "");
    text.split("\n").forEach((line, i) => {
      if (line.includes(EM_DASH)) hits.push(`${path.relative(ROOT, full)}:${i + 1}`);
    });
  }
}
walk(ROOT);
if (hits.length) {
  console.error(`Em dash found in ${hits.length} place(s):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("No em dashes.");
