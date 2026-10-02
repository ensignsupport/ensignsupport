# 0006. The whole site scales to every screen

Date: 2 October 2026. Asked for by Allen: "Hero or no hero, the entire website regardless of what page it is should scale to every screen to not look weird."

## Problem

- Every size in the design is fixed for a 1440 by 900 screen, with the content capped at 1280px wide.
- On phones, tablets and laptops that is right: the design's breakpoints and fluid headlines already handle them.
- On bigger screens (a 27 inch monitor at full resolution, a 16 inch MacBook Pro, ultrawide and 4K monitors) every page sat in a small strip in the middle, with small text and wide empty sides.
- The tests only checked widths at one height (900px), so none of this showed up.

## Decision

One scale for the whole site, `--px` in `app/globals.css`:

```
--px: clamp(1px, min(100vw / 1440, 100svh / 900), 1.6px);
```

- Every size in every style sheet is written as `N * var(--px)` instead of `Npx`. Icons and the band flag follow it too.
- At the design's own screen (1440 wide, 900 tall) and anything smaller, `--px` is exactly 1px, so the site is the design pixel for pixel. All the design comparison tests still pass unchanged.
- On a bigger screen it grows with whichever is tighter, width or height, so the page keeps the design's proportions and never grows taller than the screen allows. It stops at 1.6 times (a 4K monitor at 100%), so text never gets silly.
- Breakpoints stay in plain px: they decide the layout for phones and tablets.
- Hairlines of 2px or less stay as they are, so borders stay crisp.
- `npm run check:scale` fails the build if anyone writes a fixed px size again.

## Measured

| Screen | Scale |
| --- | --- |
| Phone, tablet, laptops up to 1440 x 900 | 1 (exactly the design) |
| 1920 x 1080 | 1.2 |
| 2560 x 1300 (27 inch) | 1.44 |
| 2560 x 1600 (16 inch MacBook Pro) | 1.6 |
| 3440 x 1340 (ultrawide) | 1.49 |
| 3840 x 2000 (4K at 100%) | 1.6 |

## How it is checked

`tests/every-screen.spec.ts` opens every page on 14 real screens, from a phone to a 4K monitor and a monitor turned sideways, and fails on anything a person would call weird: sideways scrolling, text on top of text, text cut off, a button wrapping, a photo stretched past its real size, a big empty band, the headline missing from the first screen, a sticky panel taller than the screen, or content in a strip under half the screen width. Screen list: `tests/screens.ts`.
