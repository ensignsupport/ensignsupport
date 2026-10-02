# 0004. How the forms save, alert and protect data

- **Date:** 2 October 2026
- **Decided by:** Allen (email content, safeguards), the build (the mechanics below)

## How a referral is saved

1. The browser checks every field and shows plain messages on the step the visitor can see.
2. The server checks everything again (`lib/forms/schema.ts`). It refuses anything outside the brief: no NDIA-managed option, consent must be ticked, unknown fields are dropped.
3. The referral, its first status ("New") and its alert are saved in one transaction (`lib/server/submissions.ts`). All three are saved, or none.
4. Each form carries a random `submission_id`. If the save is retried after a dropped connection, the same referral is never stored twice.
5. If the database cannot be reached, the server waits a moment and tries once more. If that fails too, the visitor sees "did not send", never "thank you", and Ensign gets a "could not be saved" email with the time only (at most one every 15 minutes).
6. If the database refuses the data itself, that is a field problem, not an outage: no retry and no alert.

## Alerts

- Every new referral and enquiry queues an alert in `email_outbox`. It holds the reference number, never details.
- The alert is sent straight after the save. Anything that fails, or anything queued before Resend is set up, is sent by the hourly job (`netlify/functions/alerts.mts`).
- At 8am Brisbane time the job sends one reminder if any referral has been New for more than 24 hours (count and link only).
- Each alert has an idempotency key, so a retry never sends it twice.

## Abuse protection

- Posts are accepted only from this site (Origin or Sec-Fetch-Site), and only up to 20KB.
- A hidden field that only bots fill in. A filled one gets "thanks" and nothing is saved.
- 5 referrals and 10 enquiries an hour per address. The address comes only from Netlify's own header, and is stored as a salted hash.

## Logs

Logs record events, reference numbers, field names and error codes. Never names, contact details, messages or keys.

## Reviewed

A separate reviewer checked this code against the brief and the security requirements on 2 October 2026. All nine findings were fixed and each one has a test.
