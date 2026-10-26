# 0008. Moving from Netlify to Cloudflare, and from Postgres to D1

- **Date:** 26 October 2026
- **Status:** proposed, waiting for Allen's yes

## Why

Pushing code as a team on Netlify needs a Pro subscription. Cloudflare Workers Builds does git deploys for a team on the free plan. Anand took this decision for Archway Automation last week, and Ensign Support is the test run for it.

Anand also decided, on 26 October, that there is to be no fallback site. Netlify is removed rather than kept running beside Cloudflare.

## What moves

| Piece | Netlify now | Cloudflare after |
| --- | --- | --- |
| Build and serve | Netlify Next.js runtime | Workers, through the OpenNext adapter |
| Database | Netlify Database (Postgres, Neon) | D1 (SQLite) |
| Hourly alerts job | `netlify/functions/alerts.mts` | Worker cron trigger |
| Settings and keys | Netlify environment settings | Worker variables and secrets |
| Visitor's address | `x-nf-client-connection-ip` header | `CF-Connecting-IP` header |
| Dev address | `ensignweb.netlify.app` | a `workers.dev` address |

`netlify.toml`, the `netlify/` folder and the three `@netlify/*` packages all come out. The live site, `ensignsupport.com.au`, is not touched by any of this. Nothing goes there until Allen says "lock" (`CONSTRAINTS.md`, standing rule 4).

## The database is the real work

Netlify Database is Postgres. D1 is SQLite. They are not the same database with a different address, so the schema, every SQL statement and the test harness are all rewritten. There is no data to carry across: the database holds test rows only (Anand, 26 October).

### What Postgres does here that SQLite cannot

| Postgres feature | Where it is used | What replaces it |
| --- | --- | --- |
| `CREATE SEQUENCE` and `nextval()` for the `R-1001` and `E-1001` reference numbers | both forms | `AUTOINCREMENT` plus a trigger that sets `ref` from `id + 1000`. The first row is still `R-1001`, and `AUTOINCREMENT` never reuses a number, so a removed record's reference can never come back |
| `BIGSERIAL` | every table | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `TIMESTAMPTZ` and `now()` | every table | text, written by `strftime` as UTC with a `Z` on the end, so JavaScript reads it back as the right moment and a `<` comparison still sorts correctly |
| `interval '24 hours'`, `make_interval(mins => $1)` | reminders, the sign in window, cleanup | `strftime` with a `-24 hours` modifier, and the same with minutes and days |
| `AT TIME ZONE 'Australia/Brisbane'` then a cast to date | `removed_records.received_on` | `date(created_at, '+10 hours')`. Brisbane is UTC+10 all year with no daylight saving, so this is exact |
| Casts to int on counts | counts in the outbox and sign in | dropped, SQLite counts are already numbers |
| `char_length()` and `left()` | check constraints, enquiry previews | `length()` and `substr()` |
| `UUID` type | `submission_id` on both forms | text, still unique, so a retried save still cannot store a form twice |
| Numbered placeholders | everywhere | question marks |
| Postgres error codes 22 and 23 | `isDataError` in `submissions.ts` | matching the SQLite constraint and mismatch errors in the D1 error text |

### The two things that genuinely change behaviour

**1. There are no interactive transactions.** D1 cannot open a transaction, read a row, decide something in JavaScript, and then write. It has `batch()`, which Cloudflare documents as a real SQL transaction that runs its statements in order and rolls the whole sequence back if any one of them fails, but every statement has to be settled before the batch starts.

Nine places do read, decide, then write. Each is rewritten so the decision lives in the SQL rather than in JavaScript, which keeps it atomic:

| Where | What it does | How it is done on D1 |
| --- | --- | --- |
| `submissions.ts` save a referral | insert, then its first history line and its alert | one batch of three, each keyed by the submission id and guarded so it does nothing if the row is already there. The alert still cannot exist without the referral, and a retry still cannot double up |
| `submissions.ts` save an enquiry | the same | the same |
| `admin-data.ts` set referral status | read the status, write the new one and a history line | one batch: insert the history line selecting the old status, then update, both guarded on the reference and the old status |
| `admin-data.ts` set enquiry status | the same | the same |
| `admin-data.ts` queue a reply | store the reply, queue the email, mark it Replied | one batch, with the outbox row finding the reply by the highest id for that enquiry instead of a returned id |
| `admin-data.ts` remove a referral | check it is Closed, delete four ways, keep a record | read for the answer the admin sees, then one batch where every statement is guarded on the status still being Closed |
| `admin-data.ts` remove an enquiry | the same | the same |
| `admin-auth.ts` sign in | record the try, count the window, decide | one batch of insert then count, so the count still includes this try and a burst is still counted one by one. The passphrase check stays in JavaScript afterwards |
| `admin-auth.ts` lockout alert | queue one alert per 15 minutes at most | a single guarded insert, which needs no transaction at all |

**2. The advisory locks go.** Sign in used a Postgres advisory lock to make sure two attempts arriving together were counted one after the other, and the five admin writes used row locks to hold a row while deciding. D1 has neither. It does not need them: a D1 database serialises its writes, and a batch commits as one unit, so the guarded statements above cannot interleave.

One honest loss. In the two removal paths, the answer the admin sees (removed, not closed, or not found) is read just before the batch rather than inside it. If the same record were removed twice at the same instant, one of the two could be told "removed" when the other one did it. The record itself is still correct, because the deletes are guarded. There is one admin user, so this is written down rather than solved.

### What does not change

The privacy rules hold exactly as they are. The outbox still carries a reference number and a link and never form contents. The access log still records the action and never what anyone wrote. Addresses are still hashed before they are stored. `removed_records` still keeps a reference, a date and nothing else. The sign in rules all come across unchanged: 5 failures per address and 20 in total in 15 minutes, a 15 minute idle timeout, 8 hours absolute, a new token at each sign in, and every session ended when the passphrase changes.

## The other code changes

- `lib/server/db.ts` stops being a `pg` pool and becomes the D1 binding, reached through the adapter's Cloudflare context. `transaction()` is replaced by `batch()`.
- `lib/server/request.ts` reads `CF-Connecting-IP`, and the hash salt stops falling back to the database address. `HASH_SALT` becomes a required setting, because D1 has no connection string to derive one from.
- `lib/server/email.ts` writes the test email sink through a dynamic import, so `node:fs` is never pulled into the Worker bundle.
- The unit tests swap `@netlify/database-dev` for a local D1, and `scripts/test-server.mjs` with them.

## Risks Allen should know about

1. This touches sign in, the referral save and record removal, which are the three most sensitive paths on the site. All of them are covered by the existing tests, and those tests are the bar: 12 unit tests pass today and must pass afterwards.
2. D1 is SQLite, so check constraints are enforced a little differently from Postgres. Every constraint is kept, and the tests confirm that a refused save is still refused.
3. Next.js has to go from 16.3.8 to 16.4.3, because the Cloudflare adapter does not accept the version in between. That is a small move inside Next 16, but the full check has to pass after it.
4. There is no fallback site. Once Netlify is removed, the dev site is the Worker. This was Anand's call.
5. **The privacy policy and both form consent notices still name Netlify as the host and say the data is held in the United States.** That is now wrong, and it is shown to participants at the moment they consent. Neither has been touched here: it is the client's legal wording and `CONSTRAINTS.md` says client facts are never invented. It blocks go live, not the dev deploy. See `docs/OPEN-ITEMS.md`.
6. The hourly alerts job runs through the site's own `/api/alerts` route, guarded by the `CRON_SECRET` secret, rather than calling the job directly from the scheduled handler. That way it runs inside a normal request, with the D1 binding in place, the way the rest of the server code expects. Without `CRON_SECRET` set, the route answers 404 and the job logs `alerts.no_cron_secret` and does nothing.

## Checks

The whole of `npm run check` has to pass before this is handed over, the browser tests included. Today's baseline, taken before any of this was started:

```
lint        pass
typecheck   pass
unit        12 passed, 3 files
```
