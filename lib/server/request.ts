import "server-only";
import { createHash, randomBytes } from "node:crypto";

/**
 * The visitor's address, as Netlify reports it (a header visitors cannot
 * fake). Returns null anywhere else, so the limiter is skipped rather than
 * trusting a header anyone can set. Tests opt in with TRUST_FORWARDED_FOR=1.
 * Only ever stored hashed.
 */
export function clientIp(request: Request): string | null {
  const netlify = request.headers.get("x-nf-client-connection-ip");
  if (netlify) return netlify;
  if (process.env.TRUST_FORWARDED_FOR === "1") return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  return null;
}

// Without HASH_SALT set, each server instance makes its own secret salt, so a
// stored hash can never be reversed back to an address.
const SALT = process.env.HASH_SALT || randomBytes(32).toString("hex");

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
