// Starts a throwaway database and the built site for the browser tests.
//   node scripts/test-server.mjs <port> [--broken-db]
// --broken-db points the site at a database that is not there, to prove the
// form never says "sent" when the save fails.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NetlifyDB } from "@netlify/database-dev";

const port = process.argv[2] ?? "3100";
const broken = process.argv.includes("--broken-db");
const out = path.resolve("test-results");
mkdirSync(out, { recursive: true });

let dbUrl = "postgres://postgres@127.0.0.1:9/postgres"; // nothing listens on port 9
let db;
if (!broken) {
  db = new NetlifyDB();
  dbUrl = await db.start();
  await db.applyMigrations("./netlify/database/migrations");
  writeFileSync(path.join(out, ".db-url"), dbUrl);
}
const sink = path.join(out, broken ? "emails-broken.jsonl" : "emails.jsonl");
writeFileSync(sink, "");

const child = spawn("npx", ["next", "start", "-p", port], {
  stdio: "inherit",
  env: {
    ...process.env,
    NETLIFY_DB_URL: dbUrl,
    EMAIL_SINK_FILE: sink,
    ALERT_TO: "alerts@example.test",
    SITE_URL: `http://localhost:${port}`,
    TRUST_FORWARDED_FOR: "1",
    // A test passphrase for the admin. The real one lives only in Netlify's settings.
    ADMIN_PASSWORD: "correct horse battery staple test",
  },
});

const stop = async () => {
  child.kill();
  await db?.stop();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", () => db?.stop().finally(() => process.exit(0)));
