# Ensign Support Services website

The public website and private admin area for Ensign Support Services, built by Archway Automation from the approved design in `design-pack/`.

## Run it on your Mac

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Check it

```bash
npx playwright install chromium   # once, downloads the test browser
npm run check                     # lint, types, em dash check, build, every test
```

## Where things are

| Path | What it is |
| --- | --- |
| `design-pack/` | The approved design v2. Source of truth for how everything looks |
| `SPEC.md` | What is being built |
| `CONSTRAINTS.md` | Rules every change must keep, and the checks to run |
| `BUILD-STATUS.md` | Where the build is up to |
| `tasks/plan.md`, `tasks/todo.md` | Milestones and progress |
| `docs/OPEN-ITEMS.md` | Decisions and facts still needed |
| `docs/decisions/` | Why the big choices were made |
| `lib/site.ts` | Every client fact on the site (phone, email, ABN and so on) |
| `app/tokens.css` | Design tokens, copied from the design pack |
| `app/(site)/` | The public pages |
| `components/` | Shared parts, each with its own CSS Module |
| `tests/` | Browser tests: every page at six widths, accessibility, pixel comparison with the design |
| `archway-rebuild/` | The earlier design pack and Archway's build notes. Kept for reference |

## Important

- Do not push `main` until the build is locked. Netlify publishes `main` to a public address.
- Keys and passwords go in Netlify's environment settings, never in this repo.
