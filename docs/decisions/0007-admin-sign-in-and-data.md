# 0007. Admin sign in and how the admin handles data

Date: 2 October 2026. Follows `archway-rebuild/phase-4-inputs/admin-security-requirements.md`. Decisions from Allen on 2 October: one passphrase with no phone code for now, no Export CSV for now, alerts to Andrew only.

## Sign in

- One long passphrase, kept only in Netlify's settings as `ADMIN_PASSWORD`. Checked on the server in constant time (both sides hashed first). Under 16 characters, or missing, and nobody can sign in at all.
- The session cookie (`__Host-ensign_admin`) holds a random 32 byte token. HttpOnly, Secure, SameSite=Strict, path /. A new token at every sign in. The database stores only a hash of it (`admin_sessions`), so a copy of the database cannot be used to sign in.
- Signed out after 15 minutes without activity, and 8 hours after signing in whatever happens. The browser warns two minutes before the idle sign out, and keeps the session alive while Andrew is clicking or typing. Signing out ends the session on the server.
- 5 wrong passphrases from one network in 15 minutes lock that network for 15 minutes. IPv4 addresses count on their own, IPv6 addresses by their /64 (one home or phone network). Tries with no trusted address share one limit.
- After 20 wrong passphrases in total in 15 minutes, every network is locked except ones that have signed in successfully in the last 30 days, so Andrew's usual home and phone networks still get in. While locked the passphrase is not even checked.
- Every try is recorded before it is checked and counted in order, inside one database transaction holding a lock, so a burst of guesses sent at once is still counted one by one.
- Andrew gets an email with the time only when a lock starts, and again every 15 minutes while guessing carries on.
- Trade-off: someone guessing on purpose keeps the total lock on, and if Andrew is on a network he has never signed in from (a cafe, say) he has to wait until it stops. In an emergency Archway can clear the lock with `DELETE FROM login_attempts WHERE succeeded = false AND attempted_at > now() - interval '15 minutes';` in the Netlify Database console.
- Changing `ADMIN_PASSWORD` in Netlify ends every session straight away.
- No second step (phone code) for now (Allen). It can be added later without changing anything else.

## Every page and every action checks

- `proxy.ts` sends anyone without a session cookie straight to sign in, and adds the admin headers: a strict Content Security Policy with a fresh nonce per request, `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow`, `Referrer-Policy: no-referrer`. The same caching, robots and referrer headers are also set in `next.config.ts`, in case the proxy does not run.
- That is only a first check. Every admin page and every server action checks the session against the database (`requireSession` in `lib/server/admin-auth.ts`) before doing anything, and validates what it was sent. Next.js refuses server actions posted from another site.
- Admin links do not prefetch, so the access log only records pages Andrew actually opened.

## Data

- Referrals and enquiries are read and changed in `lib/server/admin-data.ts`. Nothing is ever deleted. Closed is as far as a record goes.
- Every status change is recorded with the time (`referral_status_history`, `enquiry_status_history`) and shown in the referral panel.
- Notes are kept as a list, newest first, with the time. The design shows one note box; a list keeps every note instead of overwriting the last one.
- Everything a person typed is shown as text by React, never as HTML.
- The access log (`access_log`) records the time, a short session id, the action and the reference number. Never names, notes, messages or replies.
- Replies to enquiries are stored, then sent through the email outbox from Ensign's address to the enquirer, with Andrew's inbox as the reply address (`REPLY_TO`, or the first `ALERT_TO`). The outbox retries hourly and never sends the same reply twice. The admin shows whether each reply has been emailed yet.

## Changes from the admin designs

- "Sample data" labels and the sample people are not in the build.
- Export CSV is not built (Allen).
- A "Sign out" row is added to the sidebar, and a sign out icon to the phone top bar. The designs had no way to sign out.
- The referral panel adds the status history (the brief asks for it) and a "Save note" button with saved notes listed under the box.
- The reading pane says whether a reply has been emailed yet.
- Muted text on a selected row is darkened one step (`#697291` to `#5A6488`) to keep WCAG AA contrast on the tinted background.
