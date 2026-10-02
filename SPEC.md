# Ensign Support Services website: build spec

Locked Phase 3 input: `design-pack/` (design v2, 2 October 2026). This spec turns it into a build. Where this file and the design pack disagree, the design pack wins for looks and the developer brief (`design-pack/source-documents/Ensign-website-developer-brief.pdf`) wins for copy, compliance and form fields.

## The business

- Public name: **Ensign Support Services** (Allen confirmed. The brief says "Ensign Supports".)
- Two services only: NDIS support coordination and psychosocial recovery coaching.
- Unregistered NDIS provider. Self-managed and plan-managed participants only.
- South East Queensland now, Australia later.
- ABN 19 518 036 825. Phone, email, hours, domain, social links and legal wording are not supplied yet and stay as visible placeholders.

## Pages

| Route | Page | Design source |
| --- | --- | --- |
| `/` | Home | `Main.dc.html` |
| `/services` | Services | `Services.dc.html` |
| `/about` | About us | `About.dc.html` |
| `/contact` | Contact, with the general enquiry form | `Contact.dc.html` |
| `/referral` | Referral, a step by step form with the collection notice | `Referral.dc.html` |
| `/privacy` | Privacy policy (placeholder until the legal text is supplied) | not in the design |
| `/admin/referrals` | Admin: referrals | `AdminReferrals.dc.html` |
| `/admin/enquiries` | Admin: enquiries | `AdminEnquiries.dc.html` |
| `/admin/sign-in` | Admin sign in | not in the design |

Shared parts: header (logo, nav, accent Make a Referral button, phone menu), footer (four columns, partner strip, bottom row), referral band ("Your Journey, Our Direction"), page hero.

## Stack (decided 2 October 2026, see docs/decisions/0001-stack.md)

- Next.js 16 (App Router, TypeScript) on Netlify.
- Netlify Database (serverless Postgres) for referrals, enquiries, notes, status history, sessions and the access log.
- Resend for email: alerts to Andrew and enquiry replies from Ensign's address.
- Admin sign in: one long passphrase in a Netlify environment variable, checked on the server, signed session cookie (admin-security-requirements.md).

## Referral form (behaviour from `Referral.dc.html`)

Steps: Start (who is referring) → 1 your details → 2 the participant → 3 service, plan type and reason → 4 consent and how they heard → thank you.

- "Organisation and role" shows only for professionals.
- Self-referrers skip the participant name, phone, email and preferred contact fields. Their own details are stored as the participant's.
- Continue is disabled until the needed choice is made. Send is disabled until consent is ticked.
- Real validation with clear messages on every text field. A failed check always shows on a visible step (C71).
- The thank-you screen shows only after the server confirms the save. No response-time promise.
- Never collected: NDIS number, diagnosis, Medicare details, file uploads.

### Stored fields (exactly the brief's)

- Referrer: name, organisation and role (optional), phone, email, relationship (participant, family or carer, professional).
- Participant: name, preferred contact if different (optional), phone, email, suburb and postcode.
- Plan management: self-managed or plan-managed.
- Service: support coordination, psychosocial recovery coaching, or both.
- Reason: brief text.
- Consent: yes plus a timestamp.
- How they heard: optional.

## Enquiry form

Name, email, phone (optional), message. Stored, then an alert email to Andrew.

## Admin

- Referrals: statuses New, Contacted, In progress, Accepted, Closed. Summary cards, status tabs, filters (service, plan type, referrer type), search, clear filters, sorting (newest, oldest, participant A to Z, status). Slide-in detail panel with status change, call and email buttons, internal notes and a status history.
- Enquiries: statuses New, Replied, Closed. Tabs, search, sorting (newest, oldest, unread first). Reading pane with reply box and status change. Replies go out by email from Ensign's address and the thread is stored.
- Export CSV: left out for now (Allen, 2 Oct 2026). A downloaded spreadsheet of health and contact details can end up anywhere. Easy to add later.
- Sign in: one long passphrase, no phone code for now (Allen, 2 Oct 2026). A second step can be added later.
- No delete button. Closed is the furthest a record can go.

## Data model (Netlify Database, Postgres)

```
referrals                 id, ref (R-1001...), submission_id, created_at, status,
                          referrer_type, referrer_name, referrer_org_role,
                          referrer_phone, referrer_email,
                          participant_name, participant_preferred_contact,
                          participant_phone, participant_email, participant_suburb,
                          plan_type, service, reason,
                          consent (must be true), consent_at, heard_via, updated_at
referral_notes            id, referral_id, body, created_at
referral_status_history   id, referral_id, from_status, to_status, changed_at
enquiries                 id, ref (E-1001...), submission_id, created_at, status, read_at,
                          name, email, phone, message, updated_at
enquiry_messages          id, enquiry_id, body, sent_at, email_id, delivery_status
enquiry_status_history    id, enquiry_id, from_status, to_status, changed_at
admin_sessions            id (hash of the cookie token), created_at, last_seen_at, expires_at
login_attempts            ip_hash, attempted_at, succeeded
access_log                id, at, session_id, action, target_ref  (never record contents)
email_outbox              id, kind, ref, status, attempts, last_error, sent_at  (no details)
rate_limits               key (salted hash), window_start, count
```

Built in milestone 4, plus `admin_sessions`, `login_attempts` and `access_log` in milestone 5 (`docs/decisions/0007-admin-sign-in-and-data.md`). Schema: `netlify/database/migrations/`. How saving, alerts and abuse protection work: `docs/decisions/0004-forms-and-alerts.md`.

## Settings (Netlify environment variables, never in the repo)

| Name | What it is | Needed for |
| --- | --- | --- |
| `SITE_URL` | The site address, for links in alerts | Alerts |
| `ALERT_TO` | Who gets alerts, comma separated. Andrew only (Allen, 2 Oct 2026) | Alerts |
| `RESEND_API_KEY` | Resend key | Alerts and replies |
| `EMAIL_FROM` | Sender, on Ensign's domain | Alerts and replies |
| `ADMIN_PASSWORD` | The admin passphrase, at least 16 characters (a long sentence is best). Mark it secret | Admin sign in |
| `REPLY_TO` | Optional. Where enquirers' answers to Andrew's replies go. Without it, the first `ALERT_TO` address | Enquiry replies |
| `HASH_SALT` | Long random text. Optional: without it each server makes its own | Rate limits |
| `SITE_INDEXING` | `true` on the live site only | Search engines |
| `NETLIFY_DB_URL` | Set by Netlify automatically | Database |

## Not losing a referral (agreed 2 October 2026)

1. Thank-you only after the database confirms the save. One automatic retry. If it still fails the visitor sees an error with a way to reach Ensign, and Andrew gets a "save failed" alert with no details (alerts go to Andrew only, Allen 2 Oct 2026).
2. Every new referral emails Andrew a reference number and a link, nothing else.
3. A daily reminder email lists how many referrals are still New after 24 hours (count and link only).
4. No delete in the admin. Every status change is recorded.
5. Netlify Database backups (3 days free, 7 days on the cheapest paid plan).

## Emails

Alerts contain a reference number and a link to the admin only. Never health details, never form contents.

## Quality bar

- Matches the design at desktop and phone widths. Breakpoints 960, 760 and 600px. No sideways scroll at 390px.
- Every page looks right on every screen, phone to 4K. On big screens the extra room goes into space and width, not bigger text or buttons (docs/decisions/0006-the-site-scales-to-every-screen.md).
- WCAG 2.2 AA. Real buttons, links and labels. Visible focus ring. Motion stops under prefers-reduced-motion. Phone menu is a disclosure button with aria-expanded.
- Fonts self-hosted (Geist, plus Caveat for the one hand-written note). Optimised responsive images.
- A title and meta description per page.
