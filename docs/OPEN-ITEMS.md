# Open items

Owner in brackets. Nothing here is fixed silently: each one waits for the owner's answer.

## Copy and compliance clashes found in the design (Allen decides)

1. **Participant data and Archway's own boundary.** The claims rules say Archway builds "no participant data collection beyond a contact form". The referral form and admin store participant details and a reason that can reveal health information. Earlier phases planned this, so it may already be accepted. Needs Allen's explicit yes.
2. **AI photos.** All five photos are AI generated. The "You" and "Your coordinator" tags are now removed (Allen, 2 Oct) and the alt text is neutral ("A support coordinator on the same call"). Still open: real photos of Andrew and consenting participants later, or keep the AI photos.
3. **Partner strip.** The claims rules allow only "Built by Archway Automation" in the footer. The design has the longer partner strip. Keep or shorten?
4. **Groups of three.** Locked by the brief: the three values, the three experience points on About us, the three service choices and the three referrer types. Allen's design choices: the three items in the referral band and the three icon circles beside "7+ Years' experience" in the Home hero.
5. **"All ages supported" stat** on Home comes from the questionnaire, not the brief. Keep or remove?
6. **Enquiry form has no privacy line.** It collects names, emails and messages but has no privacy link. Suggest one line under the form linking to the privacy policy (not in the design).
7. **Participant phone and email are both required** in the design. Some participants may not have email. Suggest "phone or email, at least one".
8. **Home "Why Choose Ensign?" heading.** The brief says the Why Ensign paragraph belongs on About us only. Home has the heading but not the paragraph. Probably fine, flagged for completeness.

## Design questions (Allen decides)

9. ~~Sticky header~~ Decided 2 Oct: the header stays at the top. Built and tested.
10. **Three screens the design does not show:** admin sign in, the status history in the referral panel, and the privacy policy page. Plan: build them in the existing admin and page styles.
11. **Enquiry replies.** When a person replies to Andrew's email, should the reply come back into the admin, or go to Andrew's normal inbox? Recommended: normal inbox first (simpler), admin later if needed.
12. **Export CSV** button is in the design. Build it or hide it?
13. **Accessibility colour changes.** Three design colours were darkened slightly to pass WCAG 2.2 AA (docs/decisions/0002). Keep?

## Headlines Andrew should approve (Andrew)

"NDIS Plans Made Clear", "Support That Works Together", "Helping You Navigate Your Journey", "Your Journey, Our Direction", "Beside you, every step".

## Facts and text Andrew must supply (Andrew)

- Phone, email, hours (the questionnaire says 7am to 7pm, the brief says not supplied, so it stays a placeholder)
- Domain
- Privacy policy text and the collection notice legal wording
- Instagram and Facebook links, or remove the icons
- How long to keep referrals and enquiries (the earlier privacy draft says 7 years after services end)
- Which email address replies and alerts come from, and who receives alerts

## Setup with Allen (milestone 4)

- Netlify Database on the Ensign Netlify team (check it is a credit-based plan)
- Resend account and Ensign's sending domain
- Admin passphrase, stored only in Netlify's settings
