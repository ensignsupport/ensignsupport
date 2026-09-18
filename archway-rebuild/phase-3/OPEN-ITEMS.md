# Ensign: open items after Phase 3 (18 Sep 2026)

Nothing here blocks Phase 4 starting. Everything must be closed before go live (Phase 7). Most are collected at the Phase 6 showcase with Andrew.

## From Andrew: contact and site-wide
- Mobile number (used in the header Call button, SMS enquiries, Contact, footer, Refer, Privacy)
- Business email
- Go live date (Privacy version line)

## From Andrew: words and facts
- Cost wording on Services (confirm with Allen)
- "A normal week" description, for support coordination and for recovery coaching
- Whether he sets up service agreements and bookings (Services)
- The four recovery coaching "How it works" points (Services)
- Recovery coaching card wording (Home)
- Confirm the Tamil word "தமிழ்" on About and that the akku (ஃ) in the logo reads correctly

## From Andrew: hand-made and trust assets (trust-plan.md)
- Handwritten signature on white paper (About note, planned mark)
- One real brush stroke painted on paper, photographed, to trace for the portrait frames
- 30 to 60 second phone video or voice note
- 1 or 2 permission-given quotes from participants, families or referrers
- Colleague endorsement he is happy to quote
- Is the first chat free with no obligation? Exit and notice terms?
- Anonymised sample of a plan review summary (optional)

## Privacy policy (phase-1/ensign-privacy-policy.md)
- Providers used (email, storage, hosting, accounting), what each holds, and their countries
- What each provider's terms say about protecting and limiting use of information
- Multi-factor authentication switched on for email, storage and admin page?
- Paper records kept in a locked cabinet?
- Who else (if anyone) can access records
- Record retention period, and how long enquiries that do not go ahead are kept
- Timeframe for deleting a referral when the person says no
- Complaint acknowledgement time; confirm the 30 day response and resolution targets
- No analytics and no cookies? (confirm before go live)
- Automated decisions: confirm none are used
- Other formats he can provide (easy read, large print)
- Fields included in the referrer email copy
- Lawyer review and sign off

## Referral form
- Confirm "About 5 minutes" once the real form is built

## New, from the hero rebuild (18 Sep 2026)
- **Three new lines in the "Four providers" band** need Andrew's confirmation: "It is a lot to carry on your own.", "One person who does it with you.", "You do not have to chase any of it." They are in ensign-copy.md marked NEW. They make no new claim about the service, but they put words in a participant's mouth about how it feels, so Andrew should agree they sound like him.
- **The four areas shown in question 2.** Brisbane, Ipswich, Logan and Moreton Bay are on screen with a visible yellow PLACEHOLDER tag. Andrew must confirm which four he actually sees most. The other six areas are still reachable through "Somewhere else" and still listed on Contact. The enquiry box gets about 34px shorter once the tag is removed.
- **Copy change to fold into ensign-copy.md.** The flow is now five steps, so the counter reads "Question 1 of 5", not "of 3". The steps are who, where, name, phone and email, anything else.
- **An optional email field was added** to the enquiry flow. Phone stays required so nobody without email is blocked. Confirm with Andrew that he wants email captured, and add it to the privacy policy's list of what is collected.
- **Five steps instead of three** means more taps. Each screen is simpler, which suits low digital confidence, but more steps also means more places to drop out. Worth watching once there is real traffic.

## Phase 4 build decisions (Allen or Anand)
- Lead storage provider and file storage for uploads (private, expiring links)
- Resend setup and sending domain; ensignsupport.com.au domain
- Admin password as a Netlify environment variable (see phase-4-inputs/admin-security-requirements.md)
- Serve fonts and images as cached files (WebP, responsive)
- Real iPhone and Android tests of the SMS enquiry (Phase 5)

## Optional design decisions for Allen (from the whole-site review, not changed)
- Keep or remove the second Andrew portrait on Home
- One shared closing block pattern across Home, Services and About
- Fewer repeats of "Replies within 1 business day"
- Refer link visible in the phone header, and on the 404 page
- One site wide wording of Andrew's checks and qualifications

## More optional design decisions (round 3 blind reviews, 17 Sep 2026, not changed)
- Give the enquiry card a visible edge. Two reviewers said it is near-white on cream so its boundary disappears. Not changed because Allen approved this card (C36).
- Make the three option pills look more tappable (white fill, chevron). Not changed for the same reason.
- Put a tappable phone number directly under the enquiry card. It is currently only in the header and footer.
- Widen the gap between the enquiry card and the portrait. It is 64px against a 148px page margin. Widening it would push the headline to three lines.
- The phone photo is centred inside an otherwise left-aligned stack. One reviewer wanted it full width, another wanted it much smaller.
- Add a call to action at the end of the "Four providers on the list" band.
- Raise the phone page gutter from 17px to 24px. This would touch every page.
