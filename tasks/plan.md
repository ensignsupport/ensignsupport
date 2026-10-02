# Build plan

Six milestones. The build stops after each one for Allen to look, commit in GitHub Desktop and say "go". Milestones 1 and 2 are delivered together because the foundation on its own has nothing to look at.

## M1. Foundation, fonts and tokens

- Fresh Next.js 16 app replaces the old "Meridian" site in the repo root (Allen approved, 2 Oct). The old site stays in git history.
- Self-hosted Geist and Caveat. Design tokens copied exactly.
- Test harness: Playwright, axe (WCAG 2.2 AA), pixel comparison against the design previews.
- Lint, types, em dash check and launch check scripts.
- **Done when:** the app builds, every route loads at all six widths with no errors, no sideways scroll and no axe violations.

## M2. Shared parts

- Header with nav, phone menu (disclosure button) and the accent Make a Referral button.
- Footer with its phone layout, partner strip and bottom row.
- Referral band and page hero.
- **Done when:** header, footer and band match the design at 390, 760, 1024 and 1440px (same size, at least 98.5% of pixels identical), the phone menu works by mouse, touch and keyboard, and every M1 check still passes.

## M3. Public pages

- Home: split hero, service teasers, What We Do, values and stats, referral band.
- Services: two service cards (brief text word for word), We Work Alongside strip.
- About us: journey photo, Who We Are, Why Ensign, Vision and Mission, Values.
- Contact: info cards, Making a Referral card, service area card (the form arrives in M4).
- Optimised responsive images.
- **Done when:** every page matches its design at desktop and phone widths, word for word copy checks pass, and all checks pass.

## M4. Forms and email

- Netlify Database set up with Allen, click by click. Tables and migrations.
- Referral form: every step, the brief's fields, real validation, consent, save then thank-you, retry and failure alert.
- Enquiry form on Contact.
- Resend: reference-and-link alerts to Andrew, daily "still New" reminder.
- **Done when:** a test referral and enquiry really save, the alert arrives, a forced database failure shows the error and never a false thank-you, and all checks pass.

## M5. Admin with sign in

- Sign in page, server-checked passphrase, signed session cookie, idle and absolute limits, rate limit and lockout alert.
- Admin referrals: summary, tabs, filters, search, sort, detail panel, status change with history, notes, call and email.
- Admin enquiries: inbox, reading pane, reply by email with stored thread, status change.
- no-store, noindex, strict Content Security Policy, access log.
- A fresh reviewer checks the security before Allen sees it.
- **Done when:** nothing in the admin loads without signing in (pages and API), every admin action works against real saved data, and all checks pass.

## M6. Full check

- Every page and state at every breakpoint, keyboard only, screen reader names, reduced motion, scroll behaviour.
- Speed: Lighthouse on every public page.
- Copy and compliance sweep against the brief and the claims rules.
- **Done when:** everything passes and the open items list holds only what Andrew must supply.
