# 0002. Three design colours darkened to pass WCAG 2.2 AA

- **Date:** 2 October 2026
- **Status:** applied, waiting for Allen's yes (he can ask for the original colours back)

## What the check found

axe (WCAG 2.2 AA) failed three colours from the approved design on the page background `#FBFBFD`:

| Where | Design colour | Contrast | Needs | Used instead | Contrast |
| --- | --- | --- | --- | --- | --- |
| Footer bottom row (copyright, ABN, Privacy policy) | `#7A8098` | 3.78:1 | 4.5:1 | `#6B718A` | 4.67:1 |
| Footer "Pages" and "Services" headings on phones | `#6B7493` | 4.47:1 | 4.5:1 | `#697291` | 4.60:1 |
| Light word in big headings ("Works", "Navigate", "Touch", "Referral", "Made") | `#7D8DE3` | 2.99:1 | 3:1 (large text) | `#7687E2` | 3.21:1 |

## Decision

Each colour is darkened by the smallest step that passes, keeping its hue. The change is hard to see by eye. The originals stay in `app/tokens.css` untouched. The adjusted values are named in `app/globals.css` (`--text-4-aa`, `--label-muted-aa`, `--indigo-400-aa`).

The visual comparison tests apply the same three adjustments to the design previews, so they still compare like for like.
