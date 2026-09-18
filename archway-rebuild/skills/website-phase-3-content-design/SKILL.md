---
name: website-phase-3-content-design
description: "Archway website factory Phase 3 of 7: copy, design system, logo, components and page designs from locked Phase 1 facts and Phase 2 findings. The laws are identical on every client, the design language is built fresh for each one. Use on 'phase 3', 'content and design', 'design the pages'."
---

# Website Phase 3: Content and design

Phase 3 of the Archway website factory. One job: produce every word and every screen of the website, locked one piece at a time, so Phase 4 can build without guessing.

**Phase 3 in one line:** sitemap, copy, design system, logo, components, pages, whole-site blind review, clone gate, lock.

**The rule that governs this skill.** Part A is identical on every client and never traded away. Part B is a method, so it produces a different answer every time. Nothing here tells you what the site should look like. If two Archway sites could swap a section without anyone noticing, this skill has failed.

## The factory (for context)

1. Information. Output: `facts.md` (locked)
2. Research. Output: `research-findings.md` (locked)
3. **Content and design** (this skill). Output: Phase 3 pack (locked)
4. Build
5. Testing (Playwright and manual)
6. Showcase, feedback and corrections (client sees everything here)
7. Go live and hypercare

## Gate: before you start

- `facts.md` and `research-findings.md` must both say `LOCKED`. If not, STOP and tell the operator.
- The research pack must contain `avatar.md`, `design-direction.md` and the one big idea. If the direction is missing, STOP and run the Phase 2 mood set. Without it you are designing on taste and you will rebuild the last client.
- Read the operator's corrections log (`SKILL-CORRECTIONS.md`) and the latest approved renders. **The most recent thing the operator saw and approved wins over an older rule** (C36). If they conflict, show both or ask in one line.
- Any design drafts from earlier phases are inputs to learn from, never locked outputs.

---

# Part A. Laws

Identical on every client.

## A1. Integrity

1. **Never invent a client fact.** No numbers, promises, testimonials, services, security measures, time frames or credentials that are not in `facts.md`. Anything unknown is a visible yellow `PLACEHOLDER: what the client must confirm` tag. This includes privacy and legal pages (for example multi-factor login, retention periods, response times).
2. **Client wishes win**, except legal and regulatory items, which need the client's recorded consent.
3. **Never self-assess.** Scores shown to the operator come only from a blind reviewer (a subagent that has not seen the brief, your preference or the other options' names). Treat any single blind score as plus or minus 5; compare options only within the same review round (C21, C22).
4. **Blind review is evidence, not a vote.** When options are within the margin, show them side by side and let the operator decide. Record the choice, do not re-argue it (C33).
5. **Emotional copy needs a source** (C63). Feelings attributed to the client's customers come from the Phase 2 avatar and audience findings. If they are not there, say so before writing, offer a version grounded in the locked facts, mark every new line in `copy.md` as `[NEW date]`, and add it to the open items for the client to confirm. Never put words in a customer's mouth without the client agreeing they sound right.
6. **For vulnerable audiences, name the feeling once and resolve it** (C64, extends C44). One line of recognition, one line of relief. No dwelling, no stacking, no second pass over the same wound. The standard direct-response move is the wrong instrument for people who may be in crisis. Say this to the operator before building, then build what they decide.
7. **Log every correction** the operator makes in `SKILL-CORRECTIONS.md` (Wrong, Rule, Where in skill, Date) the moment it happens.

## A2. Copy rules

Archway copy and claims rules: pain as a scene not a feeling; mechanism not outcome; groups of two or four, never three; at most one negation reframe per page; no banned words (streamline, seamless, leverage, transform, unlock, elevate, empower, robust, innovative, comprehensive); credentials after the work; Australian English; **no em dashes anywhere**.

## A3. The premium floor

Premium is not the part that varies between clients. It is the same every time and it is measurable. Nothing ships below this line.

- **One accent colour per motif** (C46). Three near-identical blues doing one job is a defect. The hand-drawn underline and the hand-drawn arrow are the same colour
- **A tight type scale.** No more than four heading sizes on a page, each with a visible reason
- **Real photography, never stock.** If the client has no photo, that is a placeholder, not a stock image
- **Generous whitespace on a strict grid.** Space is the budget, alignment is the discipline
- **Motion under 250ms**, ease-out, nothing bouncy, everything off under `prefers-reduced-motion`
- **Craft sweep, every time** (C46): curly apostrophes in all visible text, applied after the build and skipping script and style blocks; no decoration touching a descender; SVG viewBoxes trimmed to the drawing, because dead space inside a viewBox makes a centred element look off centre; decorative markers and rules checked by eye, because automated contrast checks ignore them
- **Muted never comes from `opacity`** (C65). It comes from the contrast-tested muted token in the Phase 2 palette. Get de-emphasis from weight, size, elevation and border. Opacity on already-muted text is a contrast failure waiting to happen
- **Proper nouns, phone numbers and short phrases are held together with non-breaking spaces** (C66), not an optional `<br>`. A non-breaking space survives every width
- **Optional line breaks carry a real space** (C42). A `<br>` used only at desktop width is hidden on a phone, so the source reads `with you <br class="dbr">and comes`, never `you<br>and`, or the phone renders "youand". After adding one, render at 390px and read the sentence back. If a heading fights `text-wrap: balance`, set `text-wrap: initial` and place the break yourself

## A4. Layout laws

- **No near misses** (C41, C53). Edges either line up exactly or clear each other far enough to read as deliberate (100px or more), or, where an element bleeds out of its container, by the container's own padding value. A 45px offset reads as a mistake; a 150px offset reads as a decision; a 1px gap reads as a collision. Print both numbers and compare them. Never judge alignment by eye
- **Never stretch or re-crop a photo to make a grid line up** (C47, supersedes the stretch advice in C41). A photograph keeps its natural crop. Fix evenness with the things that have no natural shape: line breaks, column ratio, type size, the width of the card beside it. If two columns still cannot match, centre them so the leftover space is equal and stop there. Evenness never costs the photo
- **Anything sitting on a fluid image scales with it** (C45). Smaller padding and type at the phone breakpoint. Check the inset as a percentage of the image, not in pixels. A card covering 37% of the photo on a computer and 82% on a phone is a bug, not a style
- **Satellite elements around a focal shape share one radius** (C52). Position them polar from the focal centre, with angles chosen to avoid whatever else occupies the frame: `left:calc(50% + var(--r) * var(--cx))` with `translate(-50%,-50%)`, where `--cx` and `--cy` are the cosine and sine of the angle. Animate the `translate` property, never `transform`, so a float composes with the centring instead of destroying it. Print each element's nearest-point distance to the shape and keep the spread under about 25px
- **A fixed height container chooses which end its slack sits at** (C60). Above a rule or a following section, pin the content to the bottom so the slack reads as breathing room above. Never leave it centred by default
- **The fold is a budget with a ceiling** (C61). Measure the first screen against 1280x800 and 1512x850 content heights and print the remaining pixels with every change. Below about 15px of margin, say the ceiling is reached and offer the trades. Never silently cap the operator's request
- **One clear structure per page, one visual idea per section** (C39). Never repeat the same section layout twice in a row
- **Even and orderly beats clever** where people compare or act: columns start and end on the same line, paired cards are the same size, big numbers sit on the same baseline. Tilts are for personality pieces only, never for contact details or forms
- **Pair opposites side by side:** what you can count on next to what is not included
- **Headings** balance their line breaks, never leave one short word alone on a line, never break mid-phrase or strand a sentence's last word at the head of a line, and keep phrases and phone numbers from splitting (for example "13 11 14"). Two-line headings want two roughly even lines; reduce the display size a step rather than accept a ragged third line
- **Buttons never wrap.** One arrow size everywhere

## A5. Verification

A check that can pass while the screen is wrong is not a check.

- **Assert painted pixels, never the value you set** (C57). Read `getBoundingClientRect()` on the element and its container and compute the ratio. Reading back the inline style you just wrote proves nothing
- **Reused classes inherit every constraint, not just `display`** (C58). Before repurposing a class from a design that has been replaced, print its computed display, width, max-width, min-width, flex, position, margin and padding, and reset what you are not using. An old rule with no matching design is still in the sheet
- **`[hidden]` must beat `display`** (C54). Any rule setting `display` on an element that also uses the `hidden` attribute is written `:not([hidden])`, or the sheet carries `[hidden]{display:none!important}`. After adding a disclosure, measure the container closed and assert the height is unchanged
- **Grep every sheet before inventing a class name** (C55). Component sheets merged into one page share a global namespace
- **Scroll reveals fail open** (C49). Keep the observer and add a timer of about 2 seconds that adds the visible class to every observed element regardless. Never put the always-visible fallback only inside a reduced-motion query. Assert no element sits below full opacity after the page settles
- **Every page, every time:** axe-core WCAG 2.2 AA with zero violations, no horizontal overflow at 390, 768, 1024, 1280, 1440 and 1600, no console errors
- **Look at every section of long pages** (C40), not just the first screen. Any grid or flex row holding rich text (bold, links, placeholders) wraps that text in one element

## A6. Delivery

- **One piece at a time, the operator locks each.** Nothing is exported, deployed, pushed or locked until the operator says "lock"
- **Closed-ended choices.** 2 to 3 options with a clear recommendation and the reason. One short question at the end
- **When the operator points with a vague word and more than one element fits, ask one either or question first** (C67). One question costs a minute, a wrong guess costs a round
- **When the operator rejects the same thing twice, stop adjusting** (C50). Build two or three genuinely different alternatives, not variations, show them side by side in one round, and ask for a reference site early
- **Short dot point replies**, plain English, assume no prior knowledge
- **Never hand-edit generated HTML.** Edit the build script and rebuild, or the next rebuild silently destroys the work
- **Every deploy is uniquely named and read back** (C59). Stamp a version into the staging filename, never default a variant flag to a value the operator has not chosen, and after writing to the operator's machine read the file back and assert the change is present. Trust the target, not the send. Reusing one staging filename ships a stale copy and the operator reviews a different page from the one you checked

---

# Part B. Method

How to decide. Every rule here produces a different answer on a different client.

## B1. Uniqueness comes from the client, never from your taste

- The distinctive parts of a site are found, not invented
- Mine the client for material nobody else owns: their language, their objects, their rituals, their handwriting, their face, the words their customers actually use
- Ensign is not generic because of the Tamil akku in the logo, Andrew's face, his brush stroke and his own words. That is Ensign's answer. It is not a pattern to reuse
- If a section could carry any other client's name, it is not finished

## B2. Serve the one big idea

- Phase 2 hands you one structural idea in one sentence
- Every section either serves it or is cut
- It must be visible on the first screen

## B3. Build to the direction, measured

- **Measure the reference, never eyeball it** (C50). Crop it, then measure panel width against viewport width, aspect ratio, padding, text column share, type sizes, radius. Build to those numbers, then show the operator a side by side at the same screen width. The failure mode is matching the arrangement while every element is 50% too big
- **Check the mass** (C68). A small teaser card in the reference is not the same object as the client's five step form. If your content weighs more than the element you are copying, the arrangement must change even though the measurements were right. Build it, look at it yourself, and show the operator the failure rather than shipping it
- **Take proportion, rhythm and density. Never the composition.** Copying closely enough to be recognised is the clone problem wearing someone else's clothes

## B4. Turn text into pictures where the job is to show

- **Show the problem, do not write it** (C43). Any section whose job is to explain a problem becomes a comparison you can see: the current state muted and outlined, the better state a lifted card with ticks in the accent colour, parallel lines that align across. On a phone they stack. The *pattern* is per client; what is fixed is that the section is shown, not written
- **Say each fact once** (C44). When copy becomes a visual, delete the prose it replaced. Read the section back and check no fact appears twice
- Every line in a panel already exists in the approved copy unless A1.5 has been followed

---

# Part C. What Phase 3 produces

## The client's design language

Phase 3 **outputs** `DESIGN-LANGUAGE.md`. It never reads another client's. It records the answers this client arrived at:

- The section patterns invented for this site and what each is for
- The component look: surfaces, radius, shadow, the shape of a choice, the shape of a field
- The hand-made marks and where they appear
- The motion vocabulary
- The one big idea and the three places it shows up
- The clone gate verdict
- What was tried and rejected, so Phase 6 does not reopen it

This file keeps a future session consistent **within this client**. It is not doctrine for the next one.

---

## Tools

- Browser rendering: Playwright with Chromium (screenshots and measurements at 390, 768, 1024, 1280, 1440 and 1600).
- axe-core for automated accessibility (WCAG 2.2 AA), plus a horizontal overflow check on every page.
- Impeccable (`layout`, `distill`, `typeset`, `clarify`, `critique`) and Emil Kowalski's design engineering guidance (`emil-design-eng`) for rhythm, polish and motion.
- Taste Skill (`design-taste-frontend`) only for its list of AI design tells. For trust-first audiences keep layout variance 3 to 4, motion 2 to 3, density 4 to 5.
- Font sources: Fontsource via npm for free fonts; independent open foundry GitHub repos for rare logo fonts. Always save the licence file with the font.
- Subagents for every blind review.

## Step 1. Sitemap

- List every page with URL and one job: typically Home, Services, About, Refer or Book, Contact, Privacy, Admin (not linked, not indexed), 404.
- If leads are collected: include the private admin page (C31).
- If health or other sensitive information is collected: include a Privacy page and collection notices.

## Step 2. Copy (all pages, before design)

- Write every page in one `copy.md`: SEO title and description per page, sections in the order visitors ask their questions (Phase 2 page question maps), each section with its job in italics.
- **Use the customer's own words from `avatar.md`**, not industry language.
- Tags: `[PLACEHOLDER: ...]`, `[Mark: ...]` for hand-made marks, `[Visual: ...]` where a section is shown as a visual (C30), `[NEW date]` for any line not traceable to `facts.md` or the research (A1.5).
- Enquiry flow copy: short questions with tap choices, a details step, and honest done states for phone and computer.
- **Automated copy check, no human gate** (C32): a subagent traces every claim to `facts.md` and checks banned words, triads, negations and em dashes. Apply fixes, then go straight to design. The operator reviews copy on the page designs; the client reviews at Phase 6.
- **Scripted edits to a multi-page doc:** anchor to the page heading first, assert the page name before writing, and compare the list of page headings and word count before and after (C38).

## Step 3. Design system (before any section design)

- Spacing scale (4px base, fixed steps only), type scale (18px body minimum for vulnerable audiences, fluid display size), content width (about 60 characters), section rhythm (64px phone to about 128px desktop), radius, touch targets (48px minimum), motion per A3 (C29).
- Colour tokens from the Phase 2 palette, including the contrast-tested muted token. Re-check every text pair with a script.
- **Site font:** test 2 to 3 shortlisted options inside real client sections built on the system, never inside a generic template (C20). Blind review, then the operator picks. Confirm the licence.
- Output: `tokens.css` and a design system page showing tokens and the real sections.

## Step 4. Logo and favicon

- **The logo font is chosen separately from the site font** and must be rare: independent open foundries, not Google Fonts, not AI defaults. Verify commercial logo and web licence and save the licence (C34).
- Every mark must show what the client actually does, in one plain sentence under the concept (C34). Look for meaning the client owns: their name, their language or culture. Always have the client confirm cultural marks read correctly.
- **Hand-made marks must be simple pen gestures**: drawable in a few seconds, one steady thickness, one colour. Show about 6 quick direction sketches, each with a "draw it" instruction and a meaning, before refining (C35). If the operator gives a reference stroke, match it.
- Convert logo lettering to outlines in the final SVG so no font is needed.
- **Lookalike check** (C27): a blind reviewer compares the wordmark and the favicon separately against famous brands and common icons, and checks legibility at 16px. Avoid a single letter on a blue square and three dots in a triangle.
- Output `logo/final/`: logo SVGs (light and dark), favicon SVG and ICO (16, 32, 48), apple-touch-icon 180, icons 192 and 512, font plus licence, and a one-page `LOGO-LOCK.md`.

## Step 5. Components (operator locks each)

Build each as a working HTML prototype with the real header and fonts, test on desktop and phone, run axe, then blind review, fix, then show.

**The behaviour below is law. The look is designed fresh for this client from `design-direction.md` and recorded in `DESIGN-LANGUAGE.md`.** Do not carry another client's surfaces, radius, card or pill shapes into this one.

### 1. Enquiry flow: required behaviour (C23, C31, C36, C48, C51, C60, C62)

- **The choice steps are not a form** (C48). No card, no surface, no progress styling around the early questions. Each choice is a real control with a clear hit area, a lift on hover and a chevron. Keep a small muted line of orientation. The form styling appears only on the step that asks for details. Drive it from the visible step with `:has()` so no extra JavaScript is needed
- **Every step is the same size** (C51). Measure every step before choosing the fixed height. If the tallest is more than about 25 percent taller than the shortest, do not pad the short ones, redesign the tall one: put long option lists in a grid, move the rare options behind one "other" control that opens a field **in place**, split a long details step into several one question steps. Then click every step at every width and print the container height. Equal to within a pixel, or it is not fixed. Never write a rule about a box you have not measured at every step
- **A disclosure replaces its control in the same row.** The control hides, the field appears exactly where it was, nothing below moves. Verify the container height is identical before and after
- **The fixed box pins its content to the end nearest the next section** (C60)
- **Progress starts near empty, then runs ahead** (C62). About 8% untouched, the first answer earns the biggest jump, later steps feel close to done (for example 8, 45, 66, 82, 93, 100 across five steps). Never show meaningful progress for work not yet done
- **Real radio buttons.** Arrow keys move without advancing, Enter or tap advances. Wording adapts to the first answer. Errors are linked to their fields and positioned so they do not change the container height
- **Save first, always** (C31): on a phone save the lead on the server, then open the messaging app with a pre-written human sounding text, and show "Your details are saved. Now press send" with Try again and Call links. On a computer save then send by email. Only show "Sent" after the save succeeds
- **No health details** anywhere in the message or the email

### 2. Owner portrait (C24, C45)

- Photo and any painted or drawn frame share one outline so the border is even
- Anything sitting on top scales with the image (C45)
- Use two different photos if the page shows the owner twice; prefer the warmer, daylight photo

### 3. Process and fit visuals (C30)

- Steps as a sequence with icons, one direction on desktop and another on phone
- Key facts as equal tiles: same icon treatment, same size, same sentence shape. No uppercase labels

### 4. Referral or booking form

A header that gets people into the form fast (big "Start" button, a visual holding the key facts, a "Rather call?" link), sections in cards, choices matching the enquiry flow, optional fields for things referrers often do not know, "Not sure" choices, file upload with type and size checks, an error summary in form order that clears when fixed, an unsaved changes warning, a collection notice with separate consent tick boxes (keep legal wording as drafted), and an email copy with a reference number and no sensitive details.

### 5. Admin page

Password sign in, All tab by default with new items first, search and status filter, phone cards instead of a table, a side panel with a call button that says who it calls, status with Saved and Undo, private notes, 15 minute idle sign out with a warning. Write the Phase 4 security list alongside it (server-side password check, rate limiting, private expiring document links, no-store and noindex headers, escaped output, no health details in emails).

## Step 6. Pages (desktop and phone, one at a time, operator locks each)

Order: Home, Services, About, Refer, Contact, 404, Privacy.

- Apply Part A3 and A4 to every section
- Draw section metaphors from the approved copy, the client-owned material and the one big idea. Never from the last client's site
- **Trust plan** (C37): map the site against relationship, low risk and proof. Close gaps with confirmed facts only (face and first person voice; reply times, honest billing, easy first step, clear limits; credentials, checks, experience). Never show empty review blocks or invented quotes. List what to ask the client for and plan review collection for Phase 7. Save as `trust-plan.md`
- **Crisis and safety lines** (if relevant) appear on every page footer and as tap-to-call tiles on Contact
- **Header:** tap-to-call number on desktop, Call button on phone, current page marked
- **Privacy page:** render the policy exactly, with a short version at the top, sticky section list (folds on phone) and numbered clauses. Before locking, run a privacy review loop: a blind reviewer applying Australian Privacy Principles (APP 1.4, APP 1.7 to 1.9 automated decisions from 10 December 2026, APPs 2, 3, 5, 6, 8, 9, 11, 12, 13), OAIC plain English guidance and a Salinger Privacy style lens (say what you actually do; consent that is voluntary, informed, specific, current and given with capacity; care for vulnerable people). Fix and repeat until approved, keep a round-by-round log, and state clearly that a lawyer must still sign off. Verify every phone number against an official source

**Checks before showing any page:** the whole of Part A5, then a blind review of the page (clarity, reading load, visual quality, trust). Apply fixes that do not undo operator choices, and say which suggestions were not applied and why.

## Step 7. Whole-site blind review, and the clone gate

**Review 1, consistency.** One reviewer checks all pages together on desktop and phone: spacing, buttons, headings and marks; navigation; repeated text; broken or placeholder links; accessibility; page weight (embedded photos and fonts).

**Review 2, what is actually broken** (C46). A second reviewer whose only question is "what here is actually broken or wrong, as opposed to a matter of taste?" This is what finds swallowed word spaces, fixed-size overlays and collided glyphs. Ask for measurements, not impressions.

**Review 3, the clone gate.** A third reviewer gets screenshots of this site and of the last three Archway client sites, with no names and no brief, and one question:

> Could any section of site A be dropped into any of the others without anyone noticing?

- If yes, name those sections and rebuild them
- Record the verdict in `DESIGN-LANGUAGE.md`
- This gate is not optional and not a matter of taste. It is the only check that stops the factory producing clones

Fix, then show the operator the fixes. **Never apply a reviewer suggestion that undoes something the operator locked.** List those separately in the open items file with the reason, so the operator decides.

## Step 7b. Revisions after the operator sees the whole site

The operator will have corrections once they click through the finished prototype. Expect this; it is not a failure of the earlier locks.

- **Every design correction goes back into Phase 3**, never straight into the Phase 4 build. Phase 3 stays the single source of truth for whoever builds it
- Apply the correction, rebuild every page, re-run the link pass so no `href="#"` survives, re-run all checks, then blind review again
- Update `copy.md` in the same turn if the words or the line breaks changed, add a new round to the review log, bump the revision line in the lock file, and log the corrections
- Republish or resend the preview so the operator is always looking at the current version, and verify what landed (A6)

## Step 8. Lock and hand over

Phase 3 pack:
- `copy.md`, `tokens.css`, design system page
- `logo/final/` with `LOGO-LOCK.md`
- `components/` with `COMPONENTS-LOCK.md`
- `pages/` with `PAGES-LOCK.md`
- `DESIGN-LANGUAGE.md`
- `trust-plan.md`, privacy policy and review log, `phase-4-inputs/admin-security-requirements.md`
- **One open items list**: every placeholder and every client ask in one place
- **The build pack**, with its own README

**The reproduce check** (C56). A phase is not locked until a clean checkout rebuilds the locked output byte for byte.

- Every path in the pack is relative to the pack. No absolute paths from the session that built it
- Every input is committed, including the exact optimised assets that get inlined, not the originals they came from
- The pack ships a script that rebuilds and diffs against the committed output and fails loudly on any difference
- Run it as the last step before writing the lock file

Update the project status doc. Tell the operator in short dot points what is locked and what the client still needs to supply.

## Delivery habits

- Save every deliverable into the client's `archway-rebuild/phase-3/` folder and send the file into the chat
- Keep build scripts per component and page so fixes are quick and repeatable; rebuild and re-verify after every change
- Replies: what changed, the numbers that prove it, what was not changed and why, one clear question