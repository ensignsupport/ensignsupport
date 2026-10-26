// Starts the built Worker and a throwaway D1 for the browser tests.
//   node scripts/test-server.mjs <port> [--broken-db]
// --broken-db skips the migrations, so every query fails the way an outage
// does, to prove the form never says "sent" when the save fails.
//
// The Worker is built by the test:browser script before Playwright starts,
// not here, because Playwright starts both servers at the same time.
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { appendFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

// Wrangler is run through Node rather than its .cmd shim: Windows refuses to
// spawn a .cmd without a shell, and a shell would mangle the test passphrase,
// which has spaces in it.
const WRANGLER = path.resolve("node_modules/wrangler/bin/wrangler.js");

const port = Number(process.argv[2] ?? 3100);
const broken = process.argv.includes("--broken-db");
const out = path.resolve("test-results");
// Wrangler puts its data in a "v3" folder under whatever --persist-to says,
// while getPlatformProxy (which the browser tests read with) uses its path as
// given. So wrangler gets this folder and the tests read the v3 inside it.
const state = path.join(out, broken ? "state-broken" : "state");
mkdirSync(out, { recursive: true });

// Every run starts from an empty database.
rmSync(state, { recursive: true, force: true });
mkdirSync(state, { recursive: true });

if (!broken) {
  const applied = spawnSync(
    process.execPath,
    [WRANGLER, "d1", "execute", "ensign-support", "--local", "--persist-to", state, "--file", "migrations/0001_schema.sql", "-y"],
    { stdio: "inherit" },
  );
  if (applied.status !== 0) {
    console.error("Could not set up the test database.");
    process.exit(1);
  }
}

// A Worker has no filesystem, so it posts each email here instead and this
// writes the file the tests read.
const sink = path.join(out, broken ? "emails-broken.jsonl" : "emails.jsonl");
writeFileSync(sink, "");
const sinkPort = port + 100;
const sinkServer = createServer((request, response) => {
  let body = "";
  request.on("data", (chunk) => (body += chunk));
  request.on("end", () => {
    if (body) appendFileSync(sink, body.replace(/\n/g, " ") + "\n");
    response.writeHead(200, { "content-type": "application/json" });
    response.end("{}");
  });
});
sinkServer.listen(sinkPort);

const child = spawn(
  process.execPath,
  [
    WRANGLER,
    "dev",
    "--port",
    String(port),
    "--inspector-port",
    String(port + 200),
    "--persist-to",
    state,
    "--var",
    `EMAIL_SINK_URL:http://127.0.0.1:${sinkPort}`,
    "--var",
    "ALERT_TO:alerts@example.test",
    "--var",
    `SITE_URL:http://localhost:${port}`,
    "--var",
    "TRUST_FORWARDED_FOR:1",
    // The same salt every run, so hashed addresses count together.
    "--var",
    "HASH_SALT:ensign-test-salt",
    // A test secret for the hourly alerts job. The real one is a Worker secret.
    "--var",
    "CRON_SECRET:test-cron-secret-long-enough",
    // A test passphrase for the admin. The real one is a Worker secret.
    "--var",
    "ADMIN_PASSWORD:correct horse battery staple test",
  ],
  { stdio: "inherit" },
);

const stop = () => {
  child.kill();
  sinkServer.close();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", stop);
