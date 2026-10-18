import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { query, transaction } from "./db";
import { processOutbox } from "./email";
import { log, logError } from "./log";
import { addressGroup } from "@/lib/address";
import { hashKey, ipFromHeaders } from "./request";

/**
 * Admin sign in (archway-rebuild/phase-4-inputs/admin-security-requirements.md,
 * docs/decisions/0007-admin-sign-in-and-data.md).
 *
 * - One long passphrase, kept only in Netlify's settings as ADMIN_PASSWORD.
 *   Checked on the server in constant time. Under 16 characters, or missing,
 *   means nobody can sign in at all.
 * - The session cookie holds a random token. The database keeps only its hash.
 *   HttpOnly, Secure, SameSite=Strict, a new token at every sign in.
 * - Signed out after 15 minutes without activity, and 8 hours after signing in
 *   whatever happens. Signing out ends the session on the server. Changing the
 *   passphrase ends every session.
 * - 5 failed tries from one address in 15 minutes locks that address for 15
 *   minutes. Requests with no trusted address share one address for this.
 *   IPv6 addresses are grouped by their /64, so one network counts once.
 * - After 20 failed tries in total in 15 minutes, every address is locked
 *   except ones that have signed in successfully in the last 30 days (Andrew's
 *   own), so guessing from many addresses stops while Andrew can still get in.
 * - Andrew gets an email (time only) when a lock starts, and again every 15
 *   minutes while guessing carries on.
 * - Each try is recorded before anything is checked, and the count includes
 *   it, so a burst of guesses sent at once is counted one by one.
 */

export const SESSION_COOKIE = "__Host-ensign_admin";
export const IDLE_MINUTES = 15;
const ABSOLUTE_HOURS = 8;
const WINDOW_MINUTES = 15;
const MAX_FAILS_PER_ADDRESS = 5;
const MAX_FAILS_TOTAL = 20;
const MIN_PASSPHRASE = 16;

const sha256 = (value: string) => createHash("sha256").update(value).digest();
const sessionId = (token: string) => sha256(`ensign-admin-session|${token}`).toString("hex");
/**
 * Ties a session to the passphrase it was made with, so changing the passphrase
 * ends every session. Mixed with the session token (which the database never
 * holds), so the stored value cannot be used to test passphrase guesses.
 */
const passphraseTag = (token: string) =>
  sha256(`ensign-admin-passphrase|${token}|${process.env.ADMIN_PASSWORD ?? ""}`).toString("hex");

/** True only when a passphrase long enough to be safe has been set. */
export function signInConfigured(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length >= MIN_PASSPHRASE;
}

function passphraseMatches(input: string): boolean {
  if (!signInConfigured()) return false;
  // Hashing both sides first makes the comparison the same length, and the same time, every time.
  return timingSafeEqual(sha256(input), sha256(process.env.ADMIN_PASSWORD!));
}

async function addressKey(): Promise<string> {
  const ip = ipFromHeaders(await headers());
  if (!ip) log("admin.sign_in_no_ip");
  // No trusted address: all such tries share one bucket, so they are still limited.
  return hashKey("admin-sign-in", ip ? addressGroup(ip) : "unknown");
}

export type SignInResult = { ok: true } | { ok: false; reason: "wrong" | "locked" | "not_set_up" };

/** Checks the passphrase and, if it is right, starts a session. */
export async function signIn(passphrase: string): Promise<SignInResult> {
  if (!signInConfigured()) {
    log("admin.sign_in_not_set_up");
    return { ok: false, reason: "not_set_up" };
  }
  const address = await addressKey();

  // One try at a time: a lock held only for this transaction, so it is always
  // released, even through a connection pooler. The insert-first counting
  // below is also safe on its own.
  const outcome = await transaction(async (client) => {
    await client.query(`SELECT pg_advisory_xact_lock(hashtext('ensign-admin-sign-in'))`);
    // Record the try first, as a failure, then count up to and including it.
    const { rows: added } = await client.query<{ id: number }>(
      `INSERT INTO login_attempts (ip_hash, succeeded) VALUES ($1, false) RETURNING id`,
      [address],
    );
    const id = added[0].id;
    const { rows: counted } = await client.query<{ mine: number; total: number; known: boolean }>(
      `SELECT count(*) FILTER (WHERE ip_hash = $1 AND succeeded = false)::int AS mine,
              count(*) FILTER (WHERE succeeded = false)::int AS total,
              EXISTS (
                SELECT 1 FROM login_attempts
                 WHERE ip_hash = $1 AND succeeded = true AND attempted_at > now() - interval '30 days'
              ) AS known
         FROM login_attempts
        WHERE attempted_at > now() - make_interval(mins => $2) AND id <= $3`,
      [address, WINDOW_MINUTES, id],
    );
    const { mine, total, known } = counted[0];
    // Counts before this try decide whether it may be checked at all.
    const lockedBefore = mine - 1 >= MAX_FAILS_PER_ADDRESS || (total - 1 >= MAX_FAILS_TOTAL && !known);
    if (lockedBefore) return "locked" as const;
    if (passphraseMatches(passphrase)) {
      await client.query(`UPDATE login_attempts SET succeeded = true WHERE id = $1`, [id]);
      return "ok" as const;
    }
    const lockedNow = mine >= MAX_FAILS_PER_ADDRESS || (total >= MAX_FAILS_TOTAL && !known);
    return lockedNow ? ("just_locked" as const) : ("wrong" as const);
  });

  if (outcome === "locked" || outcome === "just_locked") {
    // One alert per 15 minutes at most while the lock goes on. Time only.
    await transaction(async (client) => {
      await client.query(`SELECT pg_advisory_xact_lock(hashtext('ensign-admin-lockout-alert'))`);
      await client.query(
        `INSERT INTO email_outbox (kind)
         SELECT 'login_lockout'
          WHERE NOT EXISTS (
            SELECT 1 FROM email_outbox WHERE kind = 'login_lockout' AND created_at > now() - make_interval(mins => $1)
          )`,
        [WINDOW_MINUTES],
      );
    });
    // Sent now, not by the hourly job.
    await processOutbox(5).catch((error) => logError("admin.lockout_alert_send_failed", error));
  }

  await query(`DELETE FROM login_attempts WHERE attempted_at < now() - interval '30 days'`);
  if (outcome !== "ok") {
    log(outcome === "wrong" ? "admin.sign_in_failed" : "admin.sign_in_locked");
    return { ok: false, reason: outcome === "wrong" ? "wrong" : "locked" };
  }

  const jar = await cookies();
  // A new token every sign in. Any session this browser already had is ended.
  const previous = jar.get(SESSION_COOKIE)?.value;
  if (previous) await query(`UPDATE admin_sessions SET revoked_at = now() WHERE id = $1`, [sessionId(previous)]);
  const token = randomBytes(32).toString("base64url");
  const id = sessionId(token);
  await query(
    `INSERT INTO admin_sessions (id, passphrase_tag, expires_at) VALUES ($1, $2, now() + make_interval(hours => $3))`,
    [id, passphraseTag(token), ABSOLUTE_HOURS],
  );
  await query(`DELETE FROM admin_sessions WHERE expires_at < now() - interval '7 days'`);
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ABSOLUTE_HOURS * 3600,
  });
  await logAccess(id, "sign_in");
  log("admin.signed_in");
  return { ok: true };
}

/** The current session, or null. Keeps it alive (resets the 15 minute idle clock). */
export async function currentSession(): Promise<{ id: string } | null> {
  if (!signInConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const rows = await query<{ id: string }>(
    `UPDATE admin_sessions SET last_seen_at = now()
      WHERE id = $1 AND revoked_at IS NULL AND expires_at > now()
        AND last_seen_at > now() - make_interval(mins => $2)
        AND passphrase_tag = $3
      RETURNING id`,
    [sessionId(token), IDLE_MINUTES, passphraseTag(token)],
  );
  return rows[0] ?? null;
}

function signInUrl(expired: boolean, next?: string) {
  const params = new URLSearchParams();
  if (expired) params.set("expired", "1");
  if (next && safeNext(next)) params.set("next", next);
  const qs = params.toString();
  return `/admin/sign-in${qs ? `?${qs}` : ""}`;
}

/**
 * Every admin page starts here. Without a live session it sends the browser
 * to the sign in page and nothing else runs.
 */
export async function requireSession(next?: string): Promise<{ id: string }> {
  const session = await currentSession();
  if (!session) {
    const hadCookie = Boolean((await cookies()).get(SESSION_COOKIE));
    redirect(signInUrl(hadCookie, next), RedirectType.replace);
  }
  return session;
}

/**
 * Every admin action starts here. Same check, but a dead session also has its
 * cookie removed, which clears the browser's copy of the admin pages, so the
 * Back button cannot show them again.
 */
export async function requireSessionForAction(): Promise<{ id: string }> {
  const session = await currentSession();
  if (!session) {
    const jar = await cookies();
    const hadCookie = Boolean(jar.get(SESSION_COOKIE));
    jar.delete({ name: SESSION_COOKIE, path: "/", secure: true, httpOnly: true, sameSite: "strict" });
    redirect(signInUrl(hadCookie), RedirectType.replace);
  }
  return session;
}

/** Ends the session on the server and clears the cookie. */
export async function signOut() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const id = sessionId(token);
    await query(`UPDATE admin_sessions SET revoked_at = now() WHERE id = $1`, [id]);
    await logAccess(id, "sign_out");
  }
  jar.delete({ name: SESSION_COOKIE, path: "/", secure: true, httpOnly: true, sameSite: "strict" });
  log("admin.signed_out");
}

/** Only admin pages are allowed as the place to go after signing in. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!/^\/admin\/(referrals|enquiries)(\?[\w=&%.+-]*)?$/.test(next)) return null;
  return next;
}

export type AccessAction =
  | "sign_in"
  | "sign_out"
  | "view_referrals"
  | "view_referral"
  | "change_referral_status"
  | "add_referral_note"
  | "view_enquiries"
  | "view_enquiry"
  | "change_enquiry_status"
  | "send_enquiry_reply"
  | "remove_referral"
  | "remove_enquiry";

/** Who did what and when. A reference number only, never what anyone wrote. */
export async function logAccess(session: string, action: AccessAction, ref?: string) {
  await query(`INSERT INTO access_log (session_id, action, target_ref) VALUES ($1, $2, $3)`, [
    session.slice(0, 16),
    action,
    ref ?? null,
  ]);
}
