# Open items

Owner in brackets. Nothing here is fixed silently: each one waits for the owner's answer.

## Copy and compliance clashes found in the design (Allen decides)

1. ~~Participant data~~ Decided 2 Oct: build the referral form and admin as designed (Allen), protected by the admin security requirements and the privacy wording.
2. **AI photos.** All five photos are AI generated. The "You" and "Your coordinator" tags are now removed (Allen, 2 Oct) and the alt text is neutral ("A support coordinator on the same call"). Still open: real photos of Andrew and consenting participants later, or keep the AI photos.
3. **Partner strip.** The claims rules allow only "Built by Archway Automation" in the footer. The design has the longer partner strip. Keep or shorten?
4. **Groups of three.** Locked by the brief: the three values, the three experience points on About us, the three service choices and the three referrer types. Allen's design choices: the three items in the referral band and the three icon circles beside "7+ Years' experience" in the Home hero.
5. **"All ages supported" stat** on Home comes from the questionnaire, not the brief. Keep or remove?
6. ~~Enquiry form privacy line~~ Decided 2 Oct: add one line under the form linking to the privacy policy (Allen).
7. ~~Participant phone and email~~ Decided 2 Oct: both required, as designed (Allen).
8. **Home "Why Choose Ensign?" heading.** The brief says the Why Ensign paragraph belongs on About us only. Home has the heading but not the paragraph. Probably fine, flagged for completeness.

## Design questions (Allen decides)

9. ~~Sticky header~~ Decided 2 Oct: the header stays at the top. Built and tested.
10. **Screens and states the design does not show.** Built in the existing style, waiting for Allen's look:
    - Privacy policy page (placeholder text).
    - Form errors: red text under the field and a red border (`--error: #B42318`).
    - "Did not send" message on the referral and enquiry forms.
    - Enquiry thank-you: "Thank you, your enquiry is in. Ensign Support Services will contact you." (same wording style as the referral thank-you, no time promise).
    - The collection notice beside the referral form now stops below the sticky header (the design's 24px gap became 116px).
    - Still to come in M5: admin sign in, and the status history in the referral panel.
11. ~~Enquiry replies~~ Decided 2 Oct: replies from the person go to Andrew's normal inbox. The admin stores the replies Andrew sends (Allen).
12. **Export CSV** button is in the design. Decided 2 Oct 2026: left out for now (Allen).
13. **Accessibility colour changes.** Three design colours were darkened slightly to pass WCAG 2.2 AA (docs/decisions/0002). Keep?

## Headlines Andrew should approve (Andrew)

"NDIS Plans Made Clear", "Support That Works Together", "Helping You Navigate Your Journey", "Your Journey, Our Direction", "Beside you, every step".

## Facts and text Andrew must supply (Andrew)

- Phone, email, hours (the questionnaire says 7am to 7pm, the brief says not supplied, so it stays a placeholder)
- Domain
- Privacy policy text and the collection notice legal wording
- Instagram and Facebook links, or remove the icons
- How long to keep referrals and enquiries (the earlier privacy draft says 7 years after services end)
- Which email address replies and alerts come from. Who receives alerts: Andrew only (Allen, 2 Oct 2026)

## Setup with Allen

- Netlify Database: created automatically on the first push with milestone 4 (check the deploy log says it was provisioned)
- Netlify settings: `SITE_URL`, `ALERT_TO`, then `RESEND_API_KEY` and `EMAIL_FROM` once Resend is set up (see SPEC.md, Settings)
- Resend account, and Ensign's domain verified in Resend (needs access to the DNS for ensignsupport.com.au)
- Turn on two-step sign in (MFA) for the Netlify team "Business Edified": it has 4 members and will hold referral data
- Before launch: delete the test referrals and enquiries made on the dev site
- Admin passphrase (milestone 5), stored only in Netlify's settings
