# 0001. Stack: Next.js on Netlify, Netlify Database, Resend

- **Date:** 2 October 2026
- **Decided by:** Allen

## Decision

- Next.js 16 (App Router, TypeScript), hosted on Netlify.
- Netlify Database (serverless Postgres) for referrals, enquiries, notes, status history, sessions and the access log.
- Resend for email.
- Admin sign in with one long passphrase held in a Netlify environment variable, as set out in `admin-security-requirements.md`. No separate sign-in service.

## Why

- Ensign expects few referrals at first. Netlify Database sleeps after 5 minutes idle and wakes on the next request, so a quiet week never pauses it. Supabase's free plan pauses a project after 7 quiet days, which would break the form.
- One account and one bill for hosting and data.
- Backups are included: 3 days on Netlify's free plan, 7 days on the cheapest paid plan. Recommended: the paid plan for the live site.
- The admin needs one shared sign in, which the security requirements already define, so no sign-in product is needed.

## Things to watch

- Netlify Database only runs on Netlify's credit-based plans. Check Ensign's Netlify team plan at setup (milestone 4).
- Netlify's docs do not say which country the database is in. It may be overseas. The privacy policy must say so (its section 7 already has a place for this).
- The first request after a quiet spell can take about a second longer while the database wakes.

## Rejected

- Supabase (Sydney region, Postgres plus auth): good, but its free plan pauses after 7 days idle and it adds a second account.
- GoHighLevel as the CRM: would replace the approved custom admin design.
- Emailing full referral copies as a backup: breaks security requirement 6 (no health details in email). Replaced by the safeguards in SPEC.md, "Not losing a referral".
