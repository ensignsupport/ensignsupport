# 0006. How the site behaves on every screen

Date: 2 October 2026, revised 3 October 2026.

Asked for by Allen: "Hero or no hero, the entire website regardless of what page it is should scale to every screen to not look weird." Then, after testing the first attempt: "scaling means, the spaces, typography images all of them should scale in a manner pleasing to the user ... instead everything just became big." Reference he gave: flightcentre.com.au.

## Problem

- Every size in the design is fixed for a 1440 by 900 screen, with the content capped at 1280px wide.
- On phones, tablets and laptops that is right: the design's breakpoints and fluid headlines already handle them.
- On bigger screens every page sat in a strip in the middle with wide empty sides.

## First attempt (2 Oct, replaced)

One scale for everything, `--px: clamp(1px, min(100vw / 1440, 100svh / 900), 1.6px)`, with every size written as `N * var(--px)`.

It was a zoom. On a 27 inch monitor body text went from 16px to 26px and buttons from 50px to 80px tall, and the page showed exactly what the 1440 design shows, just bigger. A bigger screen gave no extra room. (Correction C77.)

## What good sites do

Measured on flightcentre.com.au at 1440 by 900 and at 2560 by 1440:

- Body text 16px, buttons 40px tall, headings 32px on both screens. Nothing grows.
- Content stays 1249px wide and centred. The big screen just has more room each side.
- Only full width things (the banner photo) stretch edge to edge.

## Decision

A big screen is not a zoom. Each kind of size grows at its own rate, and the extra room goes into space and width, not into bigger text and buttons. Set in `app/globals.css`:

```
--grow: clamp(0px, min((100vw - 1440px) / 1120, (100svh - 900px) / 540), 1px);
```

`--grow` is 0 at the design's screen and anything smaller, and reaches its full amount at 2560 by 1440, following whichever is tighter, width or height. Each kind of size has its own unit:

| Unit | Used for | At 2560 x 1440 |
| --- | --- | --- |
| `--px-ui` | buttons, menu, form fields, icons, small labels, corners | x1.05 (button 50 to 52.5px) |
| `--px-text` | body copy, lead text, width of text blocks | x1.08 (16 to 17.3px) |
| `--px-head` | headings, big numbers | x1.2 |
| `--px-gap` | padding and gaps inside and between cards (20 to 39px) | x1.15 |
| `--px-space` | section spacing, page rhythm (40px and over) | x1.3 |
| `--px-media` | photo heights | x1.25 |
| `--px-wide` | content width, layout columns | x1.25 (1280 to 1600px) |

- Every size in every style sheet is `N * var(--px-<kind>)`. At 1440 by 900 and below every unit is exactly 1px, so the site is the design pixel for pixel and the design comparison tests pass unchanged.
- Only a borderless full-bleed band would stretch to the screen edges. The Home hero photo has rounded corners, so it is a framed picture: it stays inside the content width and grows only as that width grows (Allen, 3 Oct 2026).
- The admin uses `--px-ui` throughout: it is a tool, and tools stay their size.
- Paragraphs in columns that widen get a `max-width` in `em` (36 to 38em, about 75 characters) so lines never get too long to read. Each is wider than the design's own lines, so 1440 is unchanged.
- Breakpoints stay in plain px. Hairlines of 2px or less stay as they are.
- `npm run check:scale` fails on any fixed px size and on any unit that is not one of the seven kinds.

## Measured

| Screen | Body text | Button | Content width |
| --- | --- | --- | --- |
| Phone to 1440 x 900 | 16px | 50px | 1280px (the design) |
| 1920 x 1080 | 16.4px | 50.8px | about 1385px |
| 2560 x 1440 | 17.3px | 52.5px | 1600px |
| 3840 x 2000 | 17.3px | 52.5px | 1600px |

## How it is checked

- `tests/grows-gently.spec.ts` measures every page at 1440 by 900 and on three big screens, element by element. It fails if body text grows more than 10%, a button or field more than 8%, a page headline past 1.2 times the design's largest, a line of text past 38.5em, or if the content area does not get wider at all or grows more than 1.26 times.
- `tests/every-screen.spec.ts` opens every page on 14 real screens, from a phone to a 4K monitor and a monitor turned sideways, and fails on anything a person would call weird: sideways scrolling, text on top of text, text cut off, a button wrapping, a photo stretched past its real size, a big empty band, the headline missing from the first screen, or a sticky panel taller than the screen. Screen list: `tests/screens.ts`.
