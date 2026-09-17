---
name: website-phase-3-content-design
description: Archway website factory, Phase 3 of 7. Turns locked Phase 1 facts and Phase 2 findings into final copy, design system, logo and favicon, components and full page designs (desktop and phone), each locked by the operator. Use on "phase 3", "content and design", "write the copy", "design the pages", "logo", "components".
---

# Website Phase 3: Content and design

Phase 3 of the Archway website factory. One job: produce every word and every screen of the website, locked one piece at a time, so Phase 4 can build without guessing.

**Phase 3 in one line:** sitemap, copy, design system, logo, components, pages, whole-site blind review, lock.

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
- Read the operator's corrections log (`SKILL-CORRECTIONS.md`) and the latest approved renders. **The most recent thing the operator saw and approved wins over an older rule** (C36). If they conflict, show both or ask in one line.
- Any design drafts from earlier phases are inputs to learn from, never locked outputs.

## Non-negotiable rules (every step)

1. **Never invent a client fact.** No numbers, promises, testimonials, services, security measures, time frames or credentials that are not in `facts.md`. Anything unknown is shown as a yellow `PLACEHOLDER: what the client must confirm` tag. This includes privacy and legal pages (for example multi-factor login, retention periods, response times).
2. **Client wishes win**, except legal and regulatory items, which need the client's recorded consent.
3. **Copy rules** (Archway copy and claims rules): pain as a scene not a feeling; mechanism not outcome; groups of two or four, never three; at most one negation reframe per page; no banned words (streamline, seamless, leverage, transform, unlock, elevate, empower, robust, innovative, comprehensive); credentials after the work; Australian English; **no em dashes anywhere**.
4. **Never self-assess.** Scores shown to the operator come only from a blind reviewer (a subagent that has not seen the brief, your preference or the other options' names). Treat any single blind score as plus or minus 5; compare options only within the same review round (C21, C22).
5. **Blind review is evidence, not a vote.** When options are within the margin, show them side by side and let the operator decide. Record the choice, do not re-argue it (C33).
6. **Closed-ended choices.** Show 2 to 3 options with a clear recommendation and the reason. Ask one short question at the end.
7. **One piece at a time, operator locks each.** Nothing is deployed or pushed until the operator says "lock".
8. **Short dot point replies**, plain English, assume no prior knowledge.
9. **Log every correction** the operator makes in `SKILL-CORRECTIONS.md` (Wrong, Rule, Where in skill, Date) the moment it happens.

## Tools

- Browser rendering: Playwright with Chromium (screenshots at 1440px desktop and 390px phone, full page).
- axe-core for automated accessibility (WCAG 2.2 AA), plus a horizontal overflow check on every page.
- Impeccable (`layout`, `distill`, `typeset`, `clarify`, `critique`) and Emil Kowalski's design engineering guidance (`emil-design-eng`) for rhythm, polish and motion.
- Taste Skill (`design-taste-frontend`) only for its list of AI design tells. For trust-first audiences keep layout variance 3 to 4, motion 2 to 3, density 4 to 5.
- Font sources: Fontsource via npm for free fonts; independent open foundry GitHub repos for rare logo fonts (download over raw.githubusercontent.com). Always save the licence file with the font.
- Subagents for every blind review.

## Step 1. Sitemap

- List every page with URL and one job: typically Home, Services, About, Refer or Book, Contact, Privacy, Admin (not linked, not indexed), 404.
- If leads are collected: include the private admin page (C31).
- If health or other sensitive information is collected: include a Privacy page and collection notices.

## Step 2. Copy (all pages, before design)

- Write every page in one `copy.md`: SEO title and description per page, sections in the order visitors ask their questions (Phase 2 page question maps), each section with its job in italics.
- Tags: `[PLACEHOLDER: ...]`, `[Mark: ...]` for hand-made marks, `[Visual: ...]` where a section is shown as a visual (C30).
- Enquiry flow copy: short questions with tap choices, a details step, and honest done states for phone and computer.
- **Automated copy check, no human gate** (C32): a subagent traces every claim to `facts.md` and checks banned words, triads, negations and em dashes. Apply fixes, then go straight to design. The operator reviews copy on the page designs; the client reviews at Phase 6.
- **Scripted edits to a multi-page doc:** anchor to the page heading first, assert the page name before writing, and compare the list of page headings and word count before and after (C38).

## Step 3. Design system (before any section design)

- Spacing scale (4px base, fixed steps only), type scale (18px body minimum for vulnerable audiences, fluid display size), content width (about 60 characters), section rhythm (64px phone to about 128px desktop), radius, touch targets (48px minimum), motion (press shrink about 160ms, ease-out, nothing bouncy, all off under reduced motion) (C29).
- Colour tokens from the Phase 2 palette; check every text pair for WCAG AA contrast with a script.
- **Site font:** test 2 to 3 shortlisted options inside real client sections built on the system, never inside a generic template (C20). Blind review, then the operator picks. Confirm the licence.
- Output: `tokens.css` and a design system page showing tokens and the real sections.

## Step 4. Logo and favicon

- **The logo font is chosen separately from the site font** and must be rare: independent open foundries, not Google Fonts, not AI defaults. Verify commercial logo and web licence and save the licence (C34).
- Every mark must show what the client actually does, in one plain sentence under the concept (C34). Look for meaning the client owns: their name, their language or culture (for Ensign: the Tamil letter akku as the dot on the i, chosen by the operator). Always have the client confirm cultural marks read correctly.
- **Hand-made marks must be simple pen gestures**: drawable in a few seconds, one steady thickness, one colour. Show about 6 quick direction sketches, each with a "draw it" instruction and a meaning, before refining (C35). If the operator gives a reference stroke, match it.
- Convert logo lettering to outlines in the final SVG so no font is needed.
- **Lookalike check** (C27): blind reviewer compares the wordmark and the favicon separately against famous brands and common icons, and checks legibility at 16px. Avoid a single letter on a blue square and three dots in a triangle.
- Output `logo/final/`: logo SVGs (light and dark), favicon SVG and ICO (16, 32, 48), apple-touch-icon 180, icons 192 and 512, font plus licence, and a one-page `LOGO-LOCK.md`.

## Step 5. Components (operator locks each)

Build each as a working HTML prototype with the real header and fonts, test on desktop and phone, run axe, then blind review, fix, then show.

1. **Enquiry flow** (Archway house pattern, C23, C36): white card, thin progress bars plus visible "Question 1 of 3", question in the heading font, full-width pill choices. Hover: border turns accent colour and a hand-drawn line draws under the label. Selected: thicker accent border, pale tint, bold label, line stays, no dark fill.
   - Behaviour: real radio buttons; arrow keys move without advancing, Enter or tap advances; wording adapts to the first answer; errors linked to their fields; no health details in the message.
   - Save first, always (C31): on a phone save the lead on the server, then open the messaging app with a pre-written human sounding text, and show "Your details are saved. Now press send" with Try again and Call links. On a computer save then send by email (Resend). Only show "Sent" after the save succeeds.
2. **Owner portrait** (C24): brush-stroke frame traced from a real painted stroke (placeholder until supplied), photo and painted shape share one outline so the border is even, slight tilt, overlapping name card. Use two different photos if the page shows the owner twice; prefer the warmer, daylight photo.
3. **Process and fit visuals** (C30): steps as numbered icons on a path (horizontal desktop, vertical phone); key facts as equal tiles with the icon in the same rounded square, same size, same sentence shape. No uppercase labels.
4. **Referral or booking form**: a simple header that gets people into the form fast (big "Start" button, a ticket or card visual holding the key facts, a "Rather call?" link), sections in cards, pill choices matching the enquiry flow, optional fields for things referrers often don't know, "Not sure" choices, file upload with type and size checks, error summary in form order that clears when fixed, unsaved changes warning, collection notice and separate consent tick boxes (keep legal wording as drafted), and an email copy with a reference number without sensitive details.
5. **Admin page**: password sign in, All tab by default with new items first, search and status filter, phone cards instead of a table, side panel with a call button that says who it calls, status with Saved and Undo, private notes, 15 minute idle sign out with a warning. Write the Phase 4 security list alongside it (server-side password check, rate limiting, private expiring document links, no-store and noindex headers, escaped output, no health details in emails).

## Step 6. Pages (desktop and phone, one at a time, operator locks each)

Order: Home, Services, About, Refer, Contact, 404, Privacy.

**Page design rules**
- **One clear structure per page, one visual idea per section** (C39). Never repeat the same section layout twice in a row. Draw metaphors from the approved copy (for example a plan pinned on the fridge with hand-drawn ticks; a wave for good days and hard days; a taped personal note in the owner's voice; a business card for contact details; a ticket for a referral). Keep every word from the copy doc.
- **Even and orderly beats clever** where people compare or act: columns start and end on the same line, paired cards are the same size, big numbers sit on the same baseline. Tilts are for personality pieces only (portrait, note), never for contact details or forms.
- **Pair opposites side by side**: what you can count on next to what is not included.
- **Headings:** balance line breaks, never leave one short word alone on a line, keep phrases and phone numbers from splitting (for example "13 11 14").
- **Buttons never wrap**; one arrow size everywhere.
- **Trust plan** (C37): map the site against relationship, low risk and proof. Close gaps with confirmed facts only (face and first person voice; reply times, honest billing, easy first step, clear limits; credentials, checks, experience). Add a trust strip under the first screen. Never show empty review blocks or invented quotes. List what to ask the client for (short video, permission-given quotes, endorsements, free first chat and exit terms) and plan review collection for Phase 7. Save as `trust-plan.md`.
- **Crisis and safety lines** (if relevant) appear on every page footer and as tap-to-call tiles on Contact.
- **Header:** tap-to-call number on desktop, Call button on phone, current page marked.
- **Privacy page:** render the policy exactly, with a short version at the top, sticky section list (folds on phone) and numbered clauses. Before locking, run a privacy review loop: a blind reviewer applying Australian Privacy Principles (APP 1.4, APP 1.7 to 1.9 automated decisions from 10 December 2026, APPs 2, 3, 5, 6, 8, 9, 11, 12, 13), OAIC plain English guidance and a Salinger Privacy style lens (say what you actually do; consent that is voluntary, informed, specific, current and given with capacity; care for vulnerable people). Fix and repeat until approved, keep a round-by-round log, and state clearly that a lawyer must still sign off. Verify every phone number in the policy against an official source.

**Checks before showing any page**
- axe with zero violations, no horizontal overflow at 390px and 1440px, no console errors.
- **Look at every section of long pages**, not just the first screen (C40). Any grid or flex row holding rich text (bold, links, placeholders) wraps the text in one element.
- Blind review the page (clarity, reading load, visual quality, trust), apply fixes that do not undo operator choices, and say which suggestions were not applied and why.

## Step 7. Whole-site blind review

- One reviewer checks all pages together on desktop and phone: consistency of spacing, buttons, headings and marks; navigation; repeated text; broken or placeholder links; accessibility; page weight (embedded photos and fonts).
- Fix, then show the operator the fixes.

## Step 8. Lock and hand over

Phase 3 pack:
- `copy.md`, `tokens.css`, design system page
- `logo/final/` with `LOGO-LOCK.md`
- `components/` with `COMPONENTS-LOCK.md`
- `pages/` with `PAGES-LOCK.md`
- `trust-plan.md`, privacy policy and review log, `phase-4-inputs/admin-security-requirements.md`
- **One open items list**: every placeholder and every client ask in one place.

Update the project status doc. Tell the operator in short dot points what is locked and what the client still needs to supply.

## Delivery habits

- Save every deliverable into the client's `archway-rebuild/phase-3/` folder and send the file into the chat.
- Keep build scripts per component and page so fixes are quick and repeatable; rebuild and re-screenshot after every change.
- Replies: what changed, checks passed, what was not changed and why, one clear question.
