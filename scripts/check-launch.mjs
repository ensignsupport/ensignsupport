// Launch readiness. Fails while anything that must not go live is still in the build:
// client fact placeholders, milestone stand-ins, sample data, draft labels.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIRS = ["app", "components", "lib"];
const CHECKS = [
  { name: "client fact placeholder", re: /"\[[A-Z0-9 ,.:'-]+\]"|\[[A-Z][A-Z ]+:[^\]]*\]/ },
  { name: "milestone stand-in (BuildNote)", re: /<BuildNote/ },
  { name: "sample data", re: /Sample (data|Participant|Referrer|Enquirer)/ },
  { name: "draft label", re: />\s*Draft\s*</ },
];

const problems = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    if (!/\.(ts|tsx|css)$/.test(name)) continue;
    readFileSync(full, "utf8").split("\n").forEach((line, i) => {
      for (const check of CHECKS) {
        if (check.re.test(line)) problems.push(`${check.name}: ${path.relative(ROOT, full)}:${i + 1}  ${line.trim().slice(0, 90)}`);
      }
    });
  }
}
DIRS.forEach((d) => walk(path.join(ROOT, d)));
if (problems.length) {
  console.error(`Not ready to launch. ${problems.length} item(s) left:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("Ready to launch: no placeholders, stand-ins or sample data left.");
