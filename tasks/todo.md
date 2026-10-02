# To do

## M1 and M2 (delivered together, 2 Oct 2026)

- [x] Fresh Next.js 16 app in the repo root, old Meridian site removed (kept in git history)
- [x] Design pack copied into `design-pack/`
- [x] Self-hosted Geist and Caveat
- [x] Design tokens, plus named extras and three AA colour adjustments
- [x] Header, phone menu, footer, referral band, page hero, page shells, privacy placeholder page
- [x] Tests: pages at six widths, axe WCAG 2.2 AA, header and menu behaviour, footer, compliance text, pixel comparison with the design
- [x] Scripts: em dash check, launch check
- [x] SPEC, CONSTRAINTS, plan, build status, decision records
- [x] Allen reviewed and said go (2 Oct): header sticky, hero photo tags removed

## M3. Public pages (2 Oct 2026)

- [x] Sticky header, tested after scrolling at 390 and 1440px
- [x] Home
- [x] Services
- [x] About us
- [x] Contact (cards only, the form arrives in M4)
- [x] Responsive, optimised images (AVIF and WebP, sized to each box)
- [x] Whole-page pixel comparison with the design, word for word copy checks
- [x] Allen reviewed and said go (2 Oct)

## M4. Forms and email (2 Oct 2026)

- [x] Database schema (Netlify Database migration)
- [x] Referral form: every step, the brief's fields, validation, consent, save then thank-you, retry and failure alert
- [x] Enquiry form with privacy line
- [x] Alerts (reference and link only), outbox, hourly retry, 8am reminder
- [x] Abuse protection: origin, size, honeypot, rate limit, no duplicate saves
- [x] Independent security review, all findings fixed and tested
- [ ] Allen pushes, checks Netlify created the database, adds SITE_URL and ALERT_TO
- [ ] Resend account and domain (alerts wait in the outbox until then)

## Fix: Home hero fits the screen (2 Oct 2026)

- [x] Hero follows screen height above 760px, photo fills the rest of the first screen
- [x] Fold test at 1280x800 to 2560x1300, design still matched on a tall screen
- [ ] Allen checks on his 13 inch Mac and 27 inch monitor

## M5. Admin

- [ ] Sign in and sessions
- [ ] Admin referrals
- [ ] Admin enquiries
- [ ] Security review by a fresh reviewer

## M6. Full check

- [ ] Every page, state and breakpoint
- [ ] Speed
- [ ] Copy and compliance sweep
