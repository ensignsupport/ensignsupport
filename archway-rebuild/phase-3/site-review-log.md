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

---

# Round 5. Whole site blind review, 21 Sep 2026

Four reviewers, each given only the pages. None saw the brief, Allen's preferences, the other reviewers, or each other's lens.
Scores: visitor experience 6, design craft 6.5, behaviour and robustness 5, trust 6.

## Blockers, reproduced and confirmed by me after the review

1. **The Menu button does nothing.** At 820px and below the CSS hides every nav link, leaving only Call and Menu. Menu has no handler in any file. Verified: DOM length identical before and after the click, only "Call" visible. Every phone and tablet visitor has no navigation except the footer. On Privacy that is 15,500px of scrolling.
2. **Phantom Next button on question 2.** The button carries `hidden` but `.btn{display:inline-flex}` outranks the UA `[hidden]` rule. Verified: `hidden:true, display:flex, 83x36`. It is visible, it is a tab stop, and clicking it does nothing. The validation message it triggers lives inside a genuinely hidden element, so nothing is shown. **This is C54 for the third time.**
3. **Enter key breaks the flow.** Enter on the phone field skips question 5 and submits. Enter on the name field does nothing, because the error it sets is on a hidden step.
4. **Back then forward is a dead end for mouse and touch.** Re-clicking an already-checked radio fires no change event and step 0 has no Next. Keyboard escapes it, mouse and touch do not.
5. **Home enquiry tap targets are 36 to 38px at 390.** The same flow on Contact measures 56 to 64px. A home-page-only regression from the `.v7` overrides, on the primary conversion widget.
6. **Sticky sidebars slide under the sticky header.** Privacy `.pv-nav` at top:24 and Refer `.aside` at top:32 against an 88px header. First items permanently covered. Introduced by C69's fix.
7. **The skip link is covered by the header** (z-index 50 against 60) and `<main>` has no tabindex, so skip to content does nothing.
8. **The enquiry form is unusable with JavaScript off.** No noscript, no fallback, no submit in step 0.
9. **Horizontal overflow at 320px** on Services (49px, caused by a nowrap button) and Privacy (15px, an unbreakable URL).

## Not defects, decisions

- The non-linear progress bar (8/45/66/82/93) was asked for by Allen and built deliberately. One reviewer called it designed to mislead. Allen's call.
- Yellow PLACEHOLDER tags were excluded from scoring, but three reviewers said the empty "How it works" card on Services reads as a broken page rather than a pending fact, and the Privacy draft banner invalidates the policy for a cautious reader.

## Strongest agreement across reviewers

- **No external voice anywhere.** Not one testimonial, reference, or verifiable credential number. Three of four named this as the single biggest gap.
- **The hero's primary button says "Submit a referral"**, which is written for professionals, not for the participant or family member it sits in front of.
- **The home hero is off the site grid.** Portrait right edge 1264 against 1342 everywhere else, and the H1 at 50px is smaller than every H2 below it.
- **The same enquiry widget exists in two visual languages** on Home and Contact.
- Praised by all four: the "Not part of Ensign" exclusions list, the crisis panel in every footer, and the privacy policy's drafting.

## What passed clean

Console and network on all 8 pages at four viewports. Sticky header behaviour. All 31 in-page anchors. Reduced motion. Reveal fail-safes. Focus rings. The referral form's validation, file gate and unsaved-changes guard. The admin page's focus trap, scroll lock and idle logout.

---

# Round 6. After the fixes, 21 Sep 2026

Two fresh reviewers, neither of whom saw round 5 or knew anything had changed.
Scores: behaviour 6 (was 5), visitor 6, craft 6.

Round 5's nine blockers were all fixed and confirmed gone. Round 6 found five more that round 5 had missed, all on the enquiry flow, and all now fixed too:

1. **A 480ms timer that outlived its step.** Tapping a suburb then "Somewhere else" inside that window skipped the Where question with no location recorded, and Send then did nothing at all, forever, with no error. A silent dead end on the primary conversion path. Fixed: every state change cancels the pending advance, and a failed check on a hidden step now shows that step and opens the field its message lives in. 33 timing combinations pass.
2. **Back inside 480ms threw you forward two questions.** Same cause, same fix.
3. **The Contact progress bar was dead.** `max-width:56px` from the superseded three segment design, still in the base sheet. Home had an override, Contact did not. Fixed in the base sheet by deleting the old rules, not overriding them.
4. **The question line slid up to 209px between steps** inside a box that was itself fixed. Fixed: the form fills the stage, so the progress bar and the question sit in the same place on every step. Travel is now 0px on both pages at both viewports.
5. **The buttons sat above the headline on a phone.** Leftover `.home-hero` order rules from hero 6 were deciding three of five children. Fixed with explicit orders. The headline now comes before the ask.

Also fixed in this round: noscript on all 7 pages, the referral error summary landing off screen at 320, every control at 44px or more at 390, the logo and Call button touching at 320, arrow key selection having no visible way forward, and horizontal overflow at 320 on Services, Privacy and Contact.

## Measured after the fixes

| Check | Result |
|---|---|
| Enquiry box height, 5 steps, Home and Contact, 1440 and 390 | spread 0px on all four |
| Question line travel between steps | 0px on all four |
| Progress bar | blue, monotonic, works on both pages |
| Timing races, 33 combinations | 0 failures |
| Horizontal overflow, 8 pages x 5 widths | 0 |
| axe WCAG 2.2 AA, 7 pages, desktop and phone | clean |
| Tap targets at 390, all 7 pages | every control 44px or more |
| Content stranded by scroll reveals | none |
| Home hero fold at 1280x800 | credentials end at 770, 30px clear |

## Still open, and they are Allen's calls not defects

- **No external voice anywhere.** Both rounds, all six reviewers, named this as the biggest gap. It needs Andrew to supply quotes or a referrer reference. It is in ANDREW-QUESTIONS.md.
- **The type scale.** Seven pages still carry seven H1 sizes, and the site's own `--t-display` and `--t-h2` tokens are bypassed by bespoke clamps. The home page inversion is fixed (H1 50px over H2 48px, and 36px over 28px on a phone) but the wider scale was not touched, because those pages were approved and the change is taste, not a defect.
- **The home hero portrait sits inside the right margin rather than on it.** A reviewer called this a grid error. It is not. Allen asked for the image to be smaller and centred, and to match the other portrait on the page. His instruction stands.
- **The progress bar runs ahead of real progress.** Asked for deliberately. One reviewer called it misleading.
