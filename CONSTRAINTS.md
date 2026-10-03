# Constraints

Rules every change must keep. If a change breaks one, it is not done.

## Standing rules (from Allen)

1. Never invent a client fact. Unknowns stay visible placeholders such as `[PHONE]`. All client facts live in `lib/site.ts`.
2. No em dashes anywhere: copy, code, comments, alt text, commit messages.
3. Australian English, Brisbane time, AUD.
4. Nothing goes to the live site, ensignsupport.com.au, until Allen says "lock". Allen commits and pushes with GitHub Desktop. Pushing `main` updates the dev site (ensignweb.netlify.app), which is allowed and never indexed.
5. Never say something works until it has been run and checked.
6. Corrections are logged in `archway-rebuild/SKILL-CORRECTIONS.md` (Wrong / Rule / Where / Date).

## Compliance (from the developer brief)

- Unregistered NDIS provider. Never imply registered or NDIA-endorsed. No NDIS logo.
- Self-managed and plan-managed only. No NDIA-managed option anywhere.
- No promised plan outcomes, funding or response times.
- About us is company level only. No director personal details.
- Two services only. Service area South East Queensland now, Australia later.
- Vision, Mission, Values and Why Ensign are word for word from the brief (name changed to Ensign Support Services, the dash in Why Ensign became a comma).
- Referral form has a collection notice beside it and a privacy policy link.
- Never collect NDIS number, diagnosis, Medicare details or file uploads.

## Design fidelity

- `design-pack/` is the source of truth for how things look. Do not redesign in code. A design question goes back to Allen.
- Colours, type, radii and spacing come from `app/tokens.css` (a copy of `design-tokens.css`) and the named extras in `app/globals.css`. No hard coded hex values in components.
- No global box-sizing reset. The design uses the browser default and sets `border-box` where it needs it. Components do the same.
- Accent `#2236B5` is for Make a Referral actions only (plus focus rings and selected states).
- Three colours are darkened slightly to pass WCAG 2.2 AA. See `docs/decisions/0002-accessibility-colours.md`.
- One CSS Module per component, so class names never collide (C55).
- A big screen is not a zoom (C77). Every size is written as `N * var(--px-<kind>)`, never a fixed px, and the kind says how fast it grows above 1440 by 900: `ui` (buttons, menu, fields, icons, small labels) and `text` (body copy) barely grow, `head` a little, `gap`, `space`, `media` and `wide` (spacing, photo heights, content width) take the extra room. At 1440 by 900 and below the site is the design pixel for pixel. Paragraphs that sit in a column that widens get a `max-width` in `em` so lines stay readable. See `docs/decisions/0006-the-site-scales-to-every-screen.md`.

## Security and privacy

- Follow `archway-rebuild/phase-4-inputs/admin-security-requirements.md`.
- Keys and passwords live only in Netlify's environment settings. Never in code, chat or files.
- Emails never contain health details or form contents. Reference number and link only.
- Logs record what happened, never what a person wrote.
- The sample data in the admin designs is fake and never ships.

## Fast checks (run before every hand-over)

```
npm run lint          # code style
npm run typecheck     # types
npm run check:emdash  # no em dashes in anything we wrote
npm run check:scale   # every size uses one of the growth units, no fixed px
npm run build         # production build
npm test              # unit tests (alerts), then browser tests:
                      # forms really save, alerts carry no details, a database outage is never "sent",
                      # every page at 390, 768, 1024, 1280, 1440, 1600px:
                      # loads clean, no sideways scroll, WCAG 2.2 AA (axe),
                      # shared parts pixel-compared with the design,
                      # Home hero fills the first screen from 1280x800 to 2560x1300,
                      # every page on 14 real screens, phone to 4K, nothing looks broken,
                      # big screens grow gently and never zoom,
                      # keyboard only on every page, landmarks and names, reduced motion, page not found,
                      # admin: nothing opens without signing in, lockout, sessions end,
                      # changes saved and logged without contents, replies emailed
npm run check:launch  # must pass before launch: no placeholders, stand-ins or sample data
```
