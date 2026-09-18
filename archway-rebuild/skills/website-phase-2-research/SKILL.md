---
name: website-phase-2-research
description: "Archway website factory, Phase 2 of 7. Turns locked Phase 1 facts into a research and findings pack for Phase 3, including the customer avatar, the mood set the operator supplies, and the one big idea. Use on 'phase 2', 'website research', 'benchmark', 'mood set', 'design direction', 'findings pack'."
---

# Website Phase 2: Market, customer and design research

Phase 2 of the Archway website factory. One job: gather everything Phase 3 needs to write the content and design the website, and hand it over as one locked findings pack.

**Phase 2 in one line:** Phase 1 facts plus research, then parameters, then the mood set the operator supplies, then a findings pack for Phase 3.

**What only Phase 2 can decide:** who the customer is, what state they are in when they arrive, and the one big idea the whole site will serve. Phase 3 can only be as customer obsessed as this pack lets it be. If the avatar is thin, Phase 3 designs on taste and every Archway site converges.

## The factory (for context)

1. Information. Output: `facts.md` (locked)
2. **Research** (this skill). Output: `research-findings.md` (locked)
3. Content and design. Copy first with a sign-off gate, then visuals
4. Build
5. Testing (Playwright and manual)
6. Showcase, feedback and corrections
7. Go live and hypercare

## Gate: before you start

- Open the client's `facts.md`. If it is missing or its status line is not `LOCKED`, STOP and tell the operator Phase 1 must be locked first.
- Phase 2 may only use facts from `facts.md`. Anything new you learn about the client goes back to the operator as a question, never straight into the findings as fact.

## Scope: what Phase 2 does NOT do

- **No page designs, mockups, hero layouts or component designs.** That is Phase 3. (Lesson from Ensign: Phase 2 drifted into six rounds of homepage design and became too big to hand over.)
- **No copy.** Sample words only inside a test, clearly marked.
- Allowed visual work is limited to checking a finding: a colour contrast test, rendering a font inside a real reference screenshot, a side by side of reference sites.

## Rules for every step

1. **What the client wants wins.** Archway's copy and claims rules are guidelines. Only legal or regulatory items override the client, and then with the client's recorded consent.
2. **Evidence over assertion.** Every finding has a source (URL, named report, or measurement) or is tagged `(inference)` with the reasoning. Thin evidence stays thin. Say so.
3. **Local and sector first.** Prefer sources from the client's country (default Australia) and sector, from the last three years.
4. **Sit in the customer's seat.** Every page must be readable without feeling tired, answering one customer question per section, in the order the customer asks.
5. **Best in the market is the bar.** The site must beat the best site for this type of business. Phase 2 sets that bar with evidence.
6. **Never self-assess.** Scores shown to the operator come from a blind reviewer only (see Step 9). Your own estimates are never shown.
7. **No em dashes, anywhere.** Australian English.
8. **Show work as files.** Each step produces a file the operator can open.

## Tools (install before starting)

- Browser access for live sites (Claude in Chrome or the built-in browser). Cloud fetch tools are often blocked by site firewalls.
- Taste Skill (`design-taste-frontend`): its list of AI design tells and its "trust-first" and audience presets, used in Step 4.
- Impeccable (`npx impeccable install`): its `critique` checks, used for the blind review in Step 9. Test that its checker runs in your environment first.
- Web search for audience and sector research.

## Step 1. Audience research and the avatar

Name each visitor group (for example participants, families, professional referrers; or homeowners, landlords, property managers). For each group, research and write:

- **The questions they ask before they get in touch, in the order they ask them.** 8 to 12 per group. Sources: official sector guidance, forums (for example Reddit), competitor Google reviews (what people praise and complain about), industry bodies.
- **Trust builders and trust killers**, with sources.
- **Common complaints** about providers in this sector.
- **Accessibility and reading needs** for this audience (for example cognitive or low vision needs, W3C COGA guidance, government plain language and Easy Read standards).
- **Thin evidence areas**, stated honestly.
- **One assumption the evidence challenges.**

### Then write the avatar

These fields are what the mood set and Phase 3 actually run on. This was the gap on Ensign: the pack had questions, trust builders and accessibility needs, and nothing about how the customer feels, so Phase 3 could not write emotional copy honestly (C63). Every line is sourced or tagged `(inference)`.

- **Who lands here**, and why they are looking right now
- **What state they are in when they arrive.** Anxious, rushed, sceptical, excited, exhausted. What happened just before they opened the site
- **How they use it.** Phone or desktop, where, what time of day, tech confidence, plain English needed or happy with detail
- **What makes them close the tab.** Three things
- **What makes them feel safe enough to act.** Three things
- **The one thing we want them to do**
- **The words they actually use** for their own problem, quoted from reviews, forums or the client's own inbox. Never paraphrased into industry language, because Phase 3 writes with these words

Output: `research-audiences.md` and `avatar.md`.

## Step 2. Market benchmark

Pick 8 sites:
- 4 local competitors (include any the client named in Phase 1)
- 2 of the best sites in the sector nationally
- 2 excellent sites from other industries that set a premium bar

For each site, look at it live on desktop and phone, measure in the browser (word count, screens of scrolling, body text size, fonts used, phone link, forms, pop-ups), and score 1 to 5 on the same scorecard:

| Criterion | Question |
|---|---|
| Clear in 5 seconds | Can you tell what they do, for whom, and where? |
| Information order | Does it answer the Step 1 questions in the order visitors ask them? |
| Trust | Real named people, proof, credentials, independence |
| Easy to contact or refer | Phone, button or form reachable without hunting, nothing blocking |
| Reading load | Words, text size, walls of text (higher is lighter) |
| Visual craft | Designed on purpose, or a template? |
| Mobile first screen | What a phone visitor sees before scrolling |
| Accessibility basics | Text size, headings, pop-ups, visible contrast |

Record for every site: what works, what fails, fonts measured. Then write three pattern lists:
- **What everyone does** (sameness to avoid)
- **What works** (keep)
- **What nobody does well** (the client's opening)

State the limits honestly (for example tools blocked, a page that no longer exists).

Output: `benchmark.html` (scorecard, site cards with "open site" links, patterns, limits). The scores are sent to the blind reviewer in Step 9 before they are final.

## Step 3. Set the parameters

Before looking for inspiration, write the boundaries that any design must fit. Pull each one from Phase 1 or the research above, and cite where it came from:

- **Audience needs** (from Step 1 and `avatar.md`): for example calm, low reading load, practical questions answered first, trust through a named person.
- **Client's fixed choices** (from `facts.md`): colours, names, logo status, words or images to avoid, pages and forms wanted.
- **Hard rules:** accessibility (WCAG 2.2 AA), facts only from `facts.md`, copy and claims rules, legal items (for example a privacy policy when health information is collected).
- **The bar to beat** (from Step 2): the top benchmark score and why.
- **Style presets:** use Taste Skill's audience presets. Trust-first or accessibility-critical audiences: layout variance 3 to 4, motion 2 to 3, density 4 to 5. Name the AI design tells to avoid.

Output: `parameters.md`. Show it to the operator and get a yes before Step 4.

## Step 4. Find human-made inspiration inside the parameters

**Never judge style inside a layout the AI made.** (Lesson from Ensign: 11 font pairings tested inside one AI-built template all looked AI generated.) Inspiration comes from real sites made by real studios.

- Collect about 20 live sites from Awwwards, SiteInspire, Godly, Fonts In Use and foundry showcase pages. Search by the client's sector, related sectors and solo professional practices.
- Keep only sites that fit the parameters. Drop anything that breaks them (for example heavy motion for a calm audience).
- For each site, capture: name, what the business is, award or source, live link, a screenshot or award thumbnail, and the fonts measured on the live site.
- Note the pattern across the board (for example "several award winners use very common fonts, so layout, space and restraint do most of the work").

Output: `reference-board.html`.

## Step 5. The mood set

This is the step that stops every Archway site looking the same. The operator supplies material no research can produce, and it is chosen **for the customer, not for taste**. One reference from the operator settles more than three rounds of guessing.

### 5a. Send the operator the mood set brief

Fill this from `avatar.md` and Step 2, then send it. It is short on purpose so it gets answered.

```
*MOOD SET: [client name]*

Need your mood input before design starts.
Here is who we are designing for.

*Who lands on this site*
- [who they are, one line]
- [why they are looking right now]

*What state they are in when they arrive*
- [anxious, rushed, sceptical, excited, exhausted]
- [what happened just before they opened the site]

*How they use it*
- Mostly [phone or desktop], [where and when]
- Tech confidence: [low, medium, high]
- Reading: [plain English needed, or happy with detail]

*What makes them close the tab*
- [three things]

*What makes them feel safe enough to act*
- [three things]

*The one thing we want them to do*
- [single action]

*What everyone else in this industry looks like*
- [the visual cliche we must not match]

*Hard constraints*
- [accessibility level, language, cultural marks, existing brand colours]

*What I need back from you*
1. 3 to 5 reference screenshots. One line each on what to TAKE.
   The spacing, the photo treatment, how the form feels.
   Not "I like this"
2. 1 or 2 anti-references. Sites that are wrong for this client, and why
3. Three words it should feel like TO THE CUSTOMER, not to the client
4. Anything the client owns that nobody else has. Objects, handwriting,
   their language, real photos, the words their customers actually use

*The test for every reference*
- Would this client's customer find this easy?
- Beautiful but fails that test = out
```

If the operator is unavailable, whoever runs the phase answers it from `avatar.md` and marks the answers `(operator not consulted)` so the operator can overrule at the Phase 3 lock.

### 5b. Test what comes back

- **The customer test.** For each reference, would this client's customer find it easy? A beautiful site that fails is out, however much the operator likes it. Say so plainly once, then record the operator's decision.
- **The mass check.** Note what the client's real content weighs against the element being admired. A small teaser card in a reference is not the same object as a five step form. Flag any reference whose signature move depends on content lighter than the client's, so Phase 3 does not build it and then discover it fails.
- **The lookalike check.** If a reference would be copied closely enough to be recognised, that is the clone problem wearing someone else's clothes. Take proportion, rhythm and density. Never the composition.
- **The anti-references earn their place.** Knowing what is wrong for this client narrows the search faster than another good example.
- If the operator picks fewer than 3 references, ask once for more. If they stay with fewer, record it.

### 5c. Measure, never eyeball

For each picked reference, measure in pixels: panel width against viewport width, panel aspect ratio, padding, text column width as a share of the panel, type sizes, corner radius, colours (hex), word count, first-screen structure, how people are shown, any hand-made or human touches. Phase 3 builds to those numbers, not to an impression of them.

### 5d. Write the direction

Output: `design-direction.md`. One page, locked with the pack:

- The three words, in the customer's terms
- Each reference: link, screenshot, what to take, what **not** to take, the measurements
- The anti-references and why
- The client-owned material list: objects, handwriting, language, real photos, customer words
- The direction principles, written as instructions a builder can follow (for example "precise, restrained layout plus one hand-made human mark per screen")

## Step 6. The one big idea

One structural idea this site gets and no other Archway site gets. In Phase 3 every section either serves it or is cut.

- It comes from the client-owned material, not from a layout
- It must be sayable in one sentence and visible on the first screen
- Ensign's was "one coordinator you know by name" made literal: his face, his handwriting, his brush stroke, his Tamil. That is Ensign's answer, not a template to reuse
- Write the idea plus three ways it will show up in the design

Output: section in `research-findings.md`.

## Step 7. Colour and type findings

**Colour**
- Start from the client's fixed colour choice and any reference photo they supplied.
- Build a scale (for example 50 to 950) and a set of neutrals that match the feeling the client asked for.
- Test every text and background pair that could ship in light and dark mode against WCAG 2.2 AA (4.5:1 text, 3:1 large text and UI). Record passes, fails and the rules they create.
- Include a **muted text token that passes AA on its own**. Phase 3 is forbidden from making muted text with opacity, so the token has to exist here.
- Output: `colour-sheet.html` plus the palette as JSON.

**Type**
- Fonts are never picked from memory. Build a shortlist from: fonts measured on the benchmark sites and picked references, Fonts In Use examples in the sector, Adobe Fonts (if available), Fontshare, paid foundries (trial fonts allowed for testing only) and Google Fonts.
- Rule out AI defaults (Inter, Fraunces, Instrument Serif as defaults) and the last project's pairing.
- For each candidate: legibility for the audience (I, l, 1 and O, 0 distinct, readable at 18px body), fit with the direction principles, licence and cost for web use.
- Test fonts only inside a real reference layout or a neutral specimen, never inside a designed page.
- Output: `type-findings.md` with a shortlist of 2 to 4 pairings, reasons, licence notes, and what was ruled out and why. **Final font choice happens in Phase 3.**

## Step 8. Page question maps

For each page the client wants (from `facts.md`), write:
- Who arrives on this page and from where
- The questions they ask, in order (from Step 1)
- The facts from `facts.md` that answer each question
- Gaps: questions with no fact to answer them (these go to the operator)
- The one action the page must make easy

Output: section in `research-findings.md`.

## Step 9. Blind review

Spawn a reviewer agent that has not seen this conversation, the parameters or the operator's picks. Give it only the benchmark site list with links and the scorecard. Ask it to score the sites itself and to check the audience findings for unsupported claims.

- Compare its scores with yours. Where they differ by more than 5 on a site, re-check that site and note both.
- Treat any single score as roughly plus or minus 5. Only claim a site is "the best" if two independent rounds agree.
- Only blind scores go into the final pack.

## Step 10. Write the findings pack

One file, `research-findings.md`, plus an HTML copy for easy reading. Use this structure:

```
# [Client]: Research Findings
Phase 2 output. Status: DRAFT or LOCKED (date)

## 1. Summary for Phase 3 (10 dot points max)
## 2. The customer avatar
## 3. Audience findings (per group: questions in order, trust, accessibility)
## 4. Market findings (blind scores, bar to beat, patterns, the client's opening)
## 5. Parameters (with sources)
## 6. Design direction (three words, references, anti-references,
##    client-owned material, measurements, direction principles)
## 7. The one big idea, and three ways it shows up
## 8. Colour findings (palette, contrast rules, the muted token)
## 9. Type findings (shortlist, ruled out, licences)
## 10. Page question maps (one per page)
## 11. Open decisions and assets needed (owner for each)
## 12. Sources
```

Link to the supporting files from Steps 1 to 7.

## Step 11. Lock gate

Send the operator the HTML findings pack and a 3 to 5 line summary: the bar to beat, the client's opening, the one big idea, the direction principles, and the one decision needed. Then STOP. Wait for "lock". Changes loop back to the relevant step. When locked, set the status line to `LOCKED (date)`. Phase 3 may start.

**Phase 3 cannot start without `avatar.md`, `design-direction.md` and the one big idea.** If they are missing, Phase 3 is designing on taste and will rebuild the last client.

## Output files

- `research-audiences.md` and `avatar.md`
- `benchmark.html`
- `parameters.md`
- `reference-board.html`
- `design-direction.md`
- `colour-sheet.html` and palette JSON
- `type-findings.md`
- `research-findings.md` (locked) and its HTML copy