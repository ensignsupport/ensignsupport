# Open items

Owner in brackets. Nothing here is fixed silently: each one waits for the owner's answer.

## Copy and compliance clashes found in the design (Allen decides)

1. ~~Participant data~~ Decided 2 Oct: build the referral form and admin as designed (Allen), protected by the admin security requirements and the privacy wording.
2. **AI photos.** All five photos are AI generated. The "You" and "Your coordinator" tags are removed (Allen, 2 Oct). All alt text is now neutral and never says a person is Ensign's coordinator or participant (3 Oct). Still open: real photos of Andrew and consenting participants later, or keep the AI photos.
3. **Partner strip.** The claims rules allow only "Built by Archway Automation" in the footer. The design has the longer partner strip, which also lists "custom website, software and mobile app needs" (a group of three, and more than this site shows). Keep or shorten?
4. **Groups of three.** Locked by the brief: the three values, the three experience points on About us, the three service choices, the three referrer types, and the brief's own sentences used word for word (Home and Services service descriptions, "We stand with them, work with them, and support them"). Allen's design choices: the three items in the referral band and the three icon circles beside "7+ Years’ experience" in the Home hero. Also in the design: the Home tile "Alongside plan managers, health professionals and providers". Keep all as designed?
5. **"All ages supported" stat** on Home comes from the questionnaire, not the brief. Keep or remove?
6. ~~Enquiry form privacy line~~ Decided 2 Oct: add one line under the form linking to the privacy policy (Allen).
7. ~~Participant phone and email~~ Decided 2 Oct: both required, as designed (Allen).
8. **Home "Why Choose Ensign?" heading.** The brief says the Why Ensign paragraph belongs on About us only. Home has the heading but not the paragraph. Probably fine, flagged for completeness.
14. **Experience line (M6 copy review, 3 Oct).** "7+ Years’ experience" sits in the Home hero, and About says "The team brings more than seven years’ experience". Three things to settle:
    - The rules say credentials come after the work, not on the first screen. Keep it in the hero (your design choice) or move it lower?
    - The questionnaire says Ensign is run by Andrew alone for now. Keep "The team" (the brief's own wording) or change to "Andrew brings"?
    - The site says it three ways: "7+", "Seven or more years" and "more than seven years". Pick one.
15. **"What We Do" on Home (M6 copy review).** The heading "Support That Keeps Your Plan on Track" and the tile lines "Make sense of your NDIS plan" and "Work towards greater independence, at your pace" describe what the visitor will get, not what Ensign does. "At your pace" is in neither the brief nor the questionnaire. Suggest: Andrew approves them with the other headlines, or they are reworded to what Ensign does ("We explain how your plan can be used").
16. **Small design wording (M6 copy review).** All from the design, left as designed until you say:
    - Footer says "Self and plan-managed". Everywhere else says "Self-managed and plan-managed".
    - About shows "Why Ensign" twice in a row (the small label and the heading).
    - Home tile "Keep It Working: Alongside plan managers, health professionals and providers." reads as half a sentence. The brief says "We work alongside plan managers, health professionals, and other providers".
    - Referral badge says "4 quick steps · About 3 minutes". The form shows five screens before Send (its progress line counts four), and the time is an estimate, not a fact.

## Design questions (Allen decides)

9. ~~Sticky header~~ Decided 2 Oct: the header stays at the top. Built and tested.
10. **Screens and states the design does not show.** Built in the existing style, waiting for Allen's look:
    - Privacy policy page (placeholder text).
    - Form errors: red text under the field and a red border (`--error: #B42318`).
    - "Did not send" message on the referral and enquiry forms.
    - Enquiry thank-you: "Thank you, your enquiry is in. Ensign Support Services will contact you." (same wording style as the referral thank-you, no time promise).
    - The collection notice beside the referral form now stops below the sticky header (the design's 24px gap became 116px).
    - Page not found (M6): the site's header and footer, "This page is not here", and a Go to Home button.
11. ~~Enquiry replies~~ Decided 2 Oct: replies from the person go to Andrew's normal inbox. The admin stores the replies Andrew sends (Allen).
12. **Export CSV** button is in the design. Decided 2 Oct 2026: left out for now (Allen).
13. **Accessibility colour changes.** Three design colours were darkened slightly to pass WCAG 2.2 AA (docs/decisions/0002). Keep?

## Headlines Andrew should approve (Andrew)

"NDIS Plans Made Clear", "Support That Works Together", "Helping You Navigate Your Journey", "Your Journey, Our Direction", "Beside you, every step", and "Support That Keeps Your Plan on Track" (item 15).

## Facts and text Andrew must supply (Andrew)

- Phone, email, hours (the questionnaire says 7am to 7pm, the brief says not supplied, so it stays a placeholder)
- Domain
- Privacy policy text and the collection notice legal wording
- Instagram and Facebook links, or remove the icons
- How long to keep referrals and enquiries (the earlier privacy draft says 7 years after services end)
- Which email address replies and alerts come from. Who receives alerts: Andrew only (Allen, 2 Oct 2026)
- **Business name registration.** The site uses "Ensign Support Services" (Allen confirmed). The questionnaire says the registered business name on Andrew's ABN is "Ensign Support Coordination". Before launch Andrew should make sure "Ensign Support Services" is registered as a business name on his ABN (ASIC business names register), or the site uses the registered name.

## Blocks go live: the privacy policy still names Netlify (Allen and Andrew)

The site moved to Cloudflare on 26 October (docs/decisions/0008). The privacy
policy and the two form consent notices still tell people that Netlify hosts the
site and the database, and that their information is stored in the United
States. Both are now wrong, and both are shown to participants at the moment
they consent, so they cannot be left as they are once the site is live.

What has to change, and who decides the wording:

- `lib/legal/privacy-policy.ts`, clauses 9.2, 9.7, 10.3 and 13.4: every mention
  of Netlify as the host and as a data processor.
- `components/forms/ReferralForm.tsx` and `components/forms/EnquiryForm.tsx`:
  the collection notices that name "Netlify and Resend" and say the information
  is stored in the United States.
- Where the data actually sits now: the D1 database was created in Cloudflare's
  Oceania region, so referral and enquiry data is held closer to home than it
  was. That is a better answer than the current wording gives, but it has to be
  checked and stated accurately, not assumed.
- Whether moving from a United States processor to Cloudflare needs anything
  else said under APP 8 (overseas disclosure).

Not changed by anyone here: this is the client's legal wording, and
`CONSTRAINTS.md` says client facts are never invented. The dev site can run on
Cloudflare with the old wording while this is settled, because it is not public
and is never indexed.

## Setup with Allen

- ~~Netlify Database~~ replaced by the Cloudflare D1 database `ensign-support` (Oceania region), created 26 Oct. Apply the schema with `npx wrangler d1 migrations apply ensign-support --remote`.
- Worker secrets to set, none of which carry over from Netlify: `ADMIN_PASSWORD`, `HASH_SALT` (new, and now required), `CRON_SECRET` (new, for the hourly alerts job), `SITE_URL`, `ALERT_TO`, and `RESEND_API_KEY` and `EMAIL_FROM` once Resend is set up (see SPEC.md, Settings). At launch: change `SITE_URL` to the live address.
- Resend account, and Ensign's domain verified in Resend (needs access to the DNS for ensignsupport.com.au)
- Turn on two-step sign in (MFA) for the Cloudflare account that holds the Worker and the D1 database: it will hold referral data
- Before launch: delete the test referrals and enquiries made on the dev site
- Visitor address check: after Allen next signs in to the dev site admin, search the Worker's logs for `sign_in_no_ip`. Nothing found means the lockout sees each visitor's real address. Also search for `rate_limit.random_salt`, which means `HASH_SALT` was not set.
- Speed on the real host: run PageSpeed Insights (pagespeed.web.dev) on the dev site's Home page on a phone setting. Local tests put the phone Home page at about 3 seconds to its main photo (target 2.5), slowed by a local server with no CDN. Every other page and every desktop result meets the targets.
