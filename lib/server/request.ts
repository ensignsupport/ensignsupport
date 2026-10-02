import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { log } from "./log";

/**
 * The visitor's address, as Netlify reports it (a header visitors cannot
 * fake). Returns null anywhere else, so the limiter is skipped rather than
 * trusting a header anyone can set. Tests opt in with TRUST_FORWARDED_FOR=1.
 * Only ever stored hashed.
 */
export function clientIp(request: Request): string | null {
  return ipFromHeaders(request.headers);
}

export function ipFromHeaders(headers: Headers): string | null {
  const netlify = headers.get("x-nf-client-connection-ip");
  if (netlify) return netlify;
  if (process.env.TRUST_FORWARDED_FOR === "1") return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  return null;
}

// The salt must be the same on every server instance, or the same address
// hashes differently on each and the limits split apart. HASH_SALT if set,
// otherwise derived from the database address (a secret Netlify sets, the
// same everywhere). A random one only where neither exists (never on Netlify).
function makeSalt(): string {
  if (process.env.HASH_SALT) return process.env.HASH_SALT;
  if (process.env.NETLIFY_DB_URL) return createHash("sha256").update(`ensign-salt|${process.env.NETLIFY_DB_URL}`).digest("hex");
  // Should never happen on Netlify. Said out loud so it is noticed in the logs.
  log("rate_limit.random_salt");
  return randomBytes(32).toString("hex");
}

const SALT = makeSalt();

export function hashKey(...parts: string[]): string {
  return createHash("sha256").update([SALT, ...parts].join("|")).digest("hex").slice(0, 32);
}

/**
 * Accept form posts only from this site. Browsers send Origin on every
 * fetch POST; Sec-Fetch-Site is the fallback. Anything else is refused.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return request.headers.get("sec-fetch-site") === "same-origin";
  try {
    return new URL(origin).host === new URL(request.url).host || origin === process.env.SITE_URL;
  } catch {
    return false;
  }
}
