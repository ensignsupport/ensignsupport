# Build status: Ensign Support Services website

| Phase | Status |
| --- | --- |
| 0 Kickoff | Done earlier (repo, Netlify site "ensignweb") |
| 1 Information | LOCKED (earlier pack, `archway-rebuild/phase-1`) |
| 2 Research | LOCKED (earlier pack, `archway-rebuild/phase-2`) |
| 3 Spec, content and design | LOCKED 2 Oct 2026: design v2 in `design-pack/`, approved by Allen. Replaces the earlier pack in `archway-rebuild/phase-3` |
| 4 Build | IN PROGRESS: milestone 4 ready for review |
| 5 Test and review | Not started |
| 6 Showcase | Not started |
| 7 Go live | Not started |

## Phase 4 milestones

| Milestone | Status |
| --- | --- |
| M1 Foundation, fonts, tokens | Done 2 Oct |
| M2 Shared parts | Done 2 Oct |
| M3 Public pages | Done 2 Oct |
| M4 Forms and email | Ready for review |
| M5 Admin with sign in | Next |
| M6 Full check | |

## Git

- Work happens on `main`, committed and pushed by Allen in GitHub Desktop.
- Pushing `main` updates the **dev site**, ensignweb.netlify.app. That is fine (Allen, 2 Oct 2026).
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
