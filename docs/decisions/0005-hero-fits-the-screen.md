# 0005. The Home hero fits the first screen

Date: 2 October 2026. Raised by Allen (screenshots from a 13 inch MacBook and a 27 inch monitor).

## Problem

The design sizes the Home hero by screen width only (headline up to 150px, photo up to 680px tall). Laptops and big monitors are often the same width but very different heights:

- 13 inch MacBook: the headline was already at full size, so most of the photo sat below the fold.
- 27 inch monitor: the hero was shorter than the screen, so the next section peeked in.

## Decision

Above 760px wide, the hero also follows the screen height (`app/(site)/home.module.css`, "Hero fits the first screen"):

- The headline is the smaller of the design size and 12% of the screen height, never under 60px or over 150px.
- The gaps above the headline, above the buttons and above the photo tighten on screens under 960px tall.
- The photo fills whatever height is left, between 360px and 860px, so the next section starts right at the fold.

Phones (760px and under) are unchanged: they scroll by nature and the design already fits them.

## What stays the same

On a screen tall enough for the whole designed hero (for example 1440 by 1257), the hero is exactly the design. The visual test opens Home at that height and pixel-compares it with the design. `tests/hero-fold.spec.ts` checks real laptop and monitor sizes (1280x800 up to 2560x1300).

## Measured (visible browser area)

| Screen | Headline | Photo height | Next section |
| --- | --- | --- | --- |
| 1280 x 800 | 96px | 374px | at the fold |
| 1512 x 850 | 102px | 397px | at the fold |
| 1440 x 900 | 108px | 421px | at the fold |
| 1920 x 1080 | 130px | 542px | at the fold |
| 2560 x 1300 | 150px | 723px | at the fold |
| 1280 x 720 | 86px | 360px | 50px below (photo at its minimum) |
| 1024 x 768 | 92px | 360px | 7px below (photo at its minimum) |
