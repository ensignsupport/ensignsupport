# Build status: Ensign Support Services website

| Phase | Status |
| --- | --- |
| 0 Kickoff | Done earlier (repo; host moved to Cloudflare Workers on 26 Oct, see docs/decisions/0008) |
| 1 Information | LOCKED (earlier pack, `archway-rebuild/phase-1`) |
| 2 Research | LOCKED (earlier pack, `archway-rebuild/phase-2`) |
| 3 Spec, content and design | LOCKED 2 Oct 2026: design v2 in `design-pack/`, approved by Allen. Replaces the earlier pack in `archway-rebuild/phase-3` |
| 4 Build | IN PROGRESS: milestone 5 ready for review |
| 5 Test and review | Not started |
| 6 Showcase | Not started |
| 7 Go live | Not started |

## Phase 4 milestones

| Milestone | Status |
| --- | --- |
| M1 Foundation, fonts, tokens | Done 2 Oct |
| M2 Shared parts | Done 2 Oct |
| M3 Public pages | Done 2 Oct |
| M4 Forms and email | Done 2 Oct (pushed) |
| M5 Admin with sign in | Done, pushed |
| M6 Full check | Ready for review |

## Git

- Work happens on `main`, committed and pushed by Allen in GitHub Desktop.
- Pushing `main` updates the **dev site**, the Worker's workers.dev address. That is fine (Allen, 2 Oct 2026).
- The **live site** is ensignsupport.com.au. Nothing goes there until "lock".
- The dev site is never indexed by search engines (app/robots.ts). At launch, set `SITE_INDEXING=true` on the production site only.

## Open items

See `docs/OPEN-ITEMS.md` for decisions waiting on Allen and facts waiting on Andrew.

## Handover log

- 2 Oct 2026: build started from the design v2 handover (`design-pack/HANDOVER-PROMPT.md`).
- 2 Oct 2026: M1 and M2 approved. Header made sticky and hero photo tags removed (Allen). M3 built.
- 2 Oct 2026: M3 approved. M4 built: referral and enquiry forms save to Netlify Database, alerts by Resend (reference and link only).
- 2 Oct 2026: Home hero now fits the first screen on laptops and monitors, with 32px under the photo. Page headlines on the other pages follow screen height too. See docs/decisions/0005-hero-fits-the-screen.md.
- 2 Oct 2026: the whole site scales to every screen, every page checked on 14 screens from a phone to 4K (Allen). See docs/decisions/0006-the-site-scales-to-every-screen.md.
- 2 Oct 2026: M5 built: admin sign in, referrals and enquiries on real data, replies by email. See docs/decisions/0007-admin-sign-in-and-data.md.
- 3 Oct 2026: M6 full check. New tests for keyboard only, landmarks, reduced motion and the page not found (tests/full-check.spec.ts). Dev site checked live. Copy review fixes: neutral photo descriptions, curly apostrophes, the referral "did not send" message, privacy page description, full canonical addresses. Questions left for Allen and Andrew: docs/OPEN-ITEMS.md items 14 to 16 and the business name.
- 3 Oct 2026: Lighthouse, local server, no CDN (phone / desktop performance): Home 80 / 100, Services 97 / 100, About 99 / 100, Contact 96 / 100, Referral 96 / 100, Privacy 99 / 100. Accessibility and best practices 100 everywhere. SEO is low only because the dev site is set to never be indexed. Phone Home photo shows at about 3 s here (target 2.5 s), so it is checked again on the real host with PageSpeed Insights. Inlining the styles brought it to 2.4 s but broke the admin's strict security policy, so it was not kept.
- 3 Oct 2026: big screens fixed (Allen, C77). The old scale zoomed everything, so a 27 inch monitor just showed the 1440 design bigger. Now text, buttons and the menu stay close to the design size, and the extra room goes into space and content width (checked against flightcentre.com.au). New test: tests/grows-gently.spec.ts. See docs/decisions/0006-the-site-scales-to-every-screen.md.
