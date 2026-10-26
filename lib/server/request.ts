import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { log } from "./log";

/**
 * The visitor's address, as Cloudflare reports it (a header visitors cannot
 * fake, because Cloudflare sets it at the edge). Returns null anywhere else,
 * so the limiter is skipped rather than trusting a header anyone can set.
 * Tests opt in with TRUST_FORWARDED_FOR=1. Only ever stored hashed.
 */
export function clientIp(request: Request): string | null {
  return ipFromHeaders(request.headers);
}

export function ipFromHeaders(headers: Headers): string | null {
  // The opt in comes first on purpose. Cloudflare always sets cf-connecting-ip,
  // and in wrangler dev it is the local address for every request, so the tests
  // could not look like different visitors and the per address limits would
  // lump them all together. TRUST_FORWARDED_FOR is never set in production.
  if (process.env.TRUST_FORWARDED_FOR === "1") {
    const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded) return forwarded;
  }
  return headers.get("cf-connecting-ip");
}

// The salt must be the same on every server instance, or the same address
// hashes differently on each and the limits split apart. D1 has no connection
// string to derive one from, the way Netlify's database address was used, so
// HASH_SALT is now required. A random one only where it is missing, which
// splits the limits and is said out loud so it is noticed in the logs.
function makeSalt(): string {
  if (process.env.HASH_SALT) return process.env.HASH_SALT;
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
