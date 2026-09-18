# Whole-site blind review (Phase 3 Step 7), 17 to 18 Sep 2026

Two rounds by independent reviewers across all 7 public pages, desktop (1440) and phone (390). axe WCAG AA: 0 violations on every page. No horizontal overflow. No script errors.

## Round 1: consistency 7.5, visual 8.5, ease 8, trust 8
Fixed:
- Privacy: broken accesshub.gov.au link; placeholder pills splitting sentences and turning blue in lettered lists; section list highlighting the wrong section; a script error in the phone section list.
- Refer and Privacy: section highlighting replaced with a simpler, reliable scroll check.
- Home: the hero photo was embedded twice (desktop and phone copies). Now one photo moves position on phone (page 500KB to 382KB).
- Contact: avatar now a 7KB thumbnail instead of the full photo (255KB to 114KB).
- Refer: phone header Call and Menu buttons now match every other page.
- All pages: content buttons one height (56px), header buttons one height (48px).
- Services phone: "Lifeline on 13 11 14" no longer breaks.
- Home: smaller gap between "Two ways" and "How it starts"; step titles line up on desktop.
- All pages now link to each other (nav, footer, buttons), so the prototype can be clicked through.

## Round 2: consistency 8, visual 8, ease 8, trust 8
All round 1 items confirmed fixed. Then fixed:
- Headings balance their lines and paragraphs avoid single-word last lines (orphans) on all pages.
- Footer: ABN never splits across lines.
- Refer: space before the footer; hints moved under their inputs so paired fields line up; hero top spacing matches other pages; smaller text on three-across choice pills.
- Privacy: phone numbers never split.

## Not changed (would change a locked design, owner to decide)
- Second portrait on Home (reviewer suggested removing to reduce repetition).
- One shared closing block pattern across Home, Services and About (each is locked as designed).
- "Replies within 1 business day" appears several times per page (copy locked).
- Refer link on the phone header (currently in the Menu) and a Refer option on the 404 page.
- One site wide credential list (Home strip, Home Andrew block and About each word the checks slightly differently, all true).

## For Phase 4 build
- Serve fonts and images as separate cached files (WebP, responsive sizes) instead of inlining them in each page.

---

## Round 3 — 17 September 2026, after Allen viewed the whole site

Allen's two corrections:
1. The Home hero "is unevenly placed for a hero section... it feels uneven and messy." He likes every element in it.
2. The "Four providers on the list" band "feels boring no one is going to read this text unless it feels visual".

### What changed

**Hero**
- Portrait now stretches to the full height of the text column on a computer, so both columns start at the same y and finish at the same y. Measured: both 136 to 919.
- Headline set to two even lines ("One coordinator" / "you know by name."). Display size reduced from 84px to 76px so the second line fits.
- Enquiry card max-width removed inside the hero, so headline and card share one right edge at 748.
- Column ratio 7fr to 5.6fr, portrait no longer pushed right with `margin-left:auto`.
- Name card pulled inside the photo (left 2% instead of -6%).
- Hand-drawn underline dropped from -0.14em to -0.22em so it clears the "y" descender.
- Phone vertical rhythm evened (row-gap 24px, margins removed from the lead).
- Bug fixed: the optional `<br>` had no space before it, so the phone read "youand". See C42.

**Four providers band**
- Rebuilt as two panels with a hand-drawn arrow: "On your own" (muted, outlined) and "With Andrew" (white, lifted, blue ticks).
- The intro paragraph was deleted. It repeated the left panel word for word. See C44.
- Headline now breaks after the full stop.
- Markers in the muted panel lifted from 1.17:1 to a visible weight.
- Arrow recoloured to the same blue as the hero underline, and its viewBox trimmed so it sits centred.

**Site wide**
- Curly apostrophes applied to all visible text on all 8 pages and the components, via a post-build step that skips script and style blocks.
- Portrait name card now scales at the phone breakpoint. See C45.

### Checks
- axe-core WCAG 2.2 AA: clean on all 7 pages, desktop and phone.
- Horizontal overflow: none.
- Page errors: none.
- Enquiry flow clicked through after the apostrophe sweep: question 1 to question 2 works.
- Three blind reviewers, none told who built it. Their remaining items that were NOT actioned because they would change a locked design decision are listed below.

### Reviewer items left for Allen to decide
- The enquiry card sits on a near-white fill on a cream ground, so its edge is faint. Two reviewers wanted a visible border. Not changed: Allen approved this card in C36.
- The option pills do not read as tappable to one reviewer (no fill, no chevron). Not changed: Allen chose the outlined style with the hover line over the indigo fill, C36.
- No phone number directly under the enquiry card. It is in the header and the footer.
- The gutter between the enquiry card and the portrait is 64px against a 148px page margin. Widening it would force the headline onto three lines.
- The phone photo is centred inside an otherwise left-aligned stack. One reviewer wanted it full width, another wanted it much smaller. Left as approved.
- No call to action at the end of the four providers band.
- The page gutter on a phone is 17px. Raising it to 24px would touch every page.

### Round 3a, same day: Allen rejected the stretched photo

- The full-height portrait made both columns line up exactly, but cropping the photo that tall looked unnatural. Allen: "This feels too messy now. the image looks too big and unnatural."
- Reverted to the natural 3:4 crop at 480 by 640, vertically centred, so the leftover space is equal top and bottom (71px each side).
- Everything else from round 3 kept: two-line headline, shared right edge at 748, the fixed word space, the underline drop, the curly apostrophes, the phone name card.
- New rule logged as C47: never stretch or re-crop a photograph to make a grid line up.

---

## Round 4 — 17 September 2026, the Home hero rebuilt

Allen, after three rounds of adjustment: "Nothing has changed, Just the hero section desperately needs another layout." He then sent reference sites.

### What was tried
1. Split screen, photo filling the right half edge to edge.
2. Photo panel with the question card overlapping it, brush frame kept.
3. Headline across the top, card and photo as a matched pair below.
4. Panel with Andrew cut out of his background, standing above it (from Allen's first reference).
5. Soft organic shape with the full photo cropped inside it.
6. **Chosen.** Circle portrait with his work floating around it (from Allen's portfolio reference).

A blind reviewer ranked 1, then 3, then 2. Allen picked 6 after seeing the references built.

### The locked hero (V6)
- Full photo with its own background, cropped to a circle with a thin indigo ring and a white inner ring.
- Four chips drift slowly around it: Reads your plan, Finds who has room, Sets up bookings, Comes to you. Every word comes from the approved copy.
- A dashed ring turns once every 70 seconds. Seven soft indigo bubbles drift behind it.
- Motion: 6 to 15 second cycles, 6 to 9px of travel, all stopped under `prefers-reduced-motion`.
- Screen readers get one sentence instead of the four chips.
- Circle block 522px, photo 334px. Grid 6.6fr to 6fr.
- Enquiry flow: questions 1 and 2 are plain buttons with no card and no progress bar. The card appears on question 3 (C48). Buttons 440 wide and 58 tall.

### Bug found and fixed
- The "How it starts" steps and the key facts could render as a blank half screen if the IntersectionObserver did not fire. A 2 second safety timer now reveals them regardless. See C49.

### Checks
- axe-core WCAG 2.2 AA: clean on all 7 pages, desktop and phone, and on every step of the enquiry flow.
- Horizontal overflow: none at 390, 1000 and 1440.
- Page errors: none.
- Enquiry flow clicked through all three steps on desktop and phone.
- Navigation clicked through.
- Asserted in the browser that no reveal element is left below full opacity after the page settles.

### Still open
- The hero photo is a phone snapshot. It holds up at 334px but a plain backdrop photo would be better. Prompt supplied to Allen.
- Heading sizes across the page run to four different values. Worth one pass to tidy.
