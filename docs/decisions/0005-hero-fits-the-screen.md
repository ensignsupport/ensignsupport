# 0005. The Home hero fits the first screen

Since decision 0006, every px figure below is at the design's size. On bigger screens the whole site, the hero included, grows by the site scale.

Date: 2 October 2026. Raised by Allen (screenshots from a 13 inch MacBook and a 27 inch monitor).

## Problem

The design sizes the Home hero by screen width only (headline up to 150px, photo up to 680px tall). Laptops and big monitors are often the same width but very different heights:

- 13 inch MacBook: the headline was already at full size, so most of the photo sat below the fold.
- 27 inch monitor: the hero was shorter than the screen, so the next section peeked in.

## Decision

Above 760px wide, the hero also follows the screen height (`app/(site)/home.module.css`, "Hero fits the first screen"):

- The headline is the smaller of the design size and a height-based size (15% of the screen height less 40px), never under 60px or over 150px.
- The gaps above the headline, above the buttons and above the photo tighten on screens under 960px tall.
- The photo fills whatever height is left, at least 360px tall.
- The hero stops growing at 1345px tall (full-size headline plus an 860px photo). On taller screens (a 16 inch MacBook Pro, a 4K monitor, a monitor turned sideways) the next section shows below the photo rather than an empty band or a stretched photo.
- The photo stops 32px above the bottom of the screen so its rounded corners show (Allen, 2 Oct 2026: the photo touching the screen edge looked cut off). The service row starts right at the fold, so nothing peeks in.
- Because of that, the gap between the photo and the service row is 32px on screens wider than 760px. The design had 20px.

Phones (760px and under) are unchanged: they scroll by nature and the design already fits them.

## What stays the same

On a screen tall enough for the whole designed hero, the hero is exactly the design apart from the 32px gap. The visual test opens Home at that height with the gap set back to 20px and pixel-compares it with the design. `tests/hero-fold.spec.ts` checks real laptop and monitor sizes (1280x800 up to 2560x1300) and the headline on the other pages.

## Measured (visible browser area)

| Screen | Headline | Photo height | Under the photo |
| --- | --- | --- | --- |
| 1280 x 800 | 80px | 360px | 32px gap, service row at the fold |
| 1512 x 850 | 88px | 388px | 32px gap, service row at the fold |
| 1440 x 900 | 95px | 414px | 32px gap, service row at the fold |
| 1920 x 1080 | 122px | 524px | 32px gap, service row at the fold |
| 2560 x 1300 | 150px | 691px | 32px gap, service row at the fold |
| 1280 x 720, 1366 x 768, 1024 x 768, iPad portrait | smaller | 360px or more | runs up to about 25px past the fold |
| 2560 x 1600, 3840 x 2000 | 150px | 860px | 32px gap, then the next section shows |

## Other pages

Allen asked for the same scaling on every page (2 Oct 2026). The other pages do not have a one-screen hero: they are a headline followed by content that scrolls. So only the part that applies carries over (`components/PageHero.module.css`):

- The page headline is the smaller of the design size and a height-based size, never under 52px or over 112px.
- The space above it tightens on screens under 900px tall.
- From 900px tall upwards the page is exactly the design.
- Cards, photos and text below are not squeezed to fit the screen. Shrinking them would make text smaller and harder to read.

Measured: on 1280 x 800 the headline is 95px (was 97px) and content starts at 341px (was 365px). On 1512 x 850 it is 103px (was 112px) and content starts at 365px (was 393px).
