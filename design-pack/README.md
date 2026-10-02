# Ensign Support Services: design pack (design v2, 2 October 2026)

Everything a developer needs to build the website and admin area.

## Start here

1. Read `HANDOVER-PROMPT.md`. It is also the prompt to paste into a new build session.
2. Look through `screenshots/` to see every page and state.
3. Open the live design canvas (private): https://claude.ai/code/artifact/bf67ba77-18c6-49a3-aa98-b96786da2560

## What is in here

| Folder or file | What it is |
|---|---|
| `HANDOVER-PROMPT.md` | Kick-off prompt and full build brief |
| `design-tokens.css` | Colours, fonts, sizes, radii, spacing, breakpoints |
| `design-source/` | The source of every page from the canvas (`.dc.html`) plus `canvas.json`. The `Mobile*` files show the same page at 390px |
| `previews/` | Plain HTML of each page. Open in a browser. Forms and admin are frozen in one state |
| `screenshots/desktop/` | 1440px wide, full page, every page plus every referral step and admin state |
| `screenshots/mobile/` | The same at 390px wide |
| `images/` | The five photos used, with `asset-map.json` linking each to where it appears |
| `source-documents/` | The final developer brief (PDF) and the discovery questionnaire (Word) |

## Pages

Home, Services, About us, Contact, Referral, Admin Referrals, Admin Enquiries. Each has a desktop and a phone design.

## Notes

- `design-source` files point to images as `/_blob/...`. Use `images/asset-map.json` to swap in the local files.
- The screenshots may show a fallback font where Geist or Caveat did not load. The canvas shows the real fonts.
- All five photos are AI-generated. See the "decisions" section of the handover before using them in production.
- Sample people and data in the admin designs are fake.
