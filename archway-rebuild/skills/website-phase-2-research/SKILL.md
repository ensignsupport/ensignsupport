---
name: website-phase-2-research
description: Archway website factory, Phase 2 of 7. Turns locked Phase 1 facts into a research and findings pack (audience, market benchmark, parameters, human-made inspiration picked by the operator, colour and type rules, page question maps) for Phase 3 to write and design from. Use on "phase 2", "website research", "benchmark", "design inspiration", "findings pack".
---

# Website Phase 2: Market, customer and design research

Phase 2 of the Archway website factory. One job: gather everything Phase 3 needs to write the content and design the website, and hand it over as one locked findings pack.

**Phase 2 in one line:** Phase 1 facts plus research, then parameters, then inspiration inside those parameters picked by the operator, then a findings pack for Phase 3.

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
6. **Never self-assess.** Scores shown to the operator come from a blind reviewer only (see Step 8). Your own estimates are never shown.
7. **No em dashes, anywhere.** Australian English.
8. **Show work as files.** Each step produces a file the operator can open.

## Tools (install before starting)

- Browser access for live sites (Claude in Chrome or the built-in browser). Cloud fetch tools are often blocked by site firewalls.
- Taste Skill (`design-taste-frontend`): its list of AI design tells and its "trust-first" and audience presets, used in Step 4.
- Impeccable (`npx impeccable install`): its `critique` checks, used for the blind review in Step 8. Test that its checker runs in your environment first.
- Web search for audience and sector research.

## Step 1. Audience research

Name each visitor group (for example participants, families, professional referrers; or homeowners, landlords, property managers). For each group, research and write:

- **The questions they ask before they get in touch, in the order they ask them.** 8 to 12 per group. Sources: official sector guidance, forums (for example Reddit), competitor Google reviews (what people praise and complain about), industry bodies.
- **Trust builders and trust killers**, with sources.
- **Common complaints** about providers in this sector.
- **Accessibility and reading needs** for this audience (for example cognitive or low vision needs, W3C COGA guidance, government plain language and Easy Read standards).
- **Thin evidence areas**, stated honestly.
- **One assumption the evidence challenges.**

Output: `research-audiences.md`.

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

Output: `benchmark.html` (scorecard, site cards with "open site" links, patterns, limits). The scores are sent to the blind reviewer in Step 8 before they are final.

## Step 3. Set the parameters

Before looking for inspiration, write the boundaries that any design must fit. Pull each one from Phase 1 or the research above, and cite where it came from:

- **Audience needs** (from Step 1): for example calm, low reading load, practical questions answered first, trust through a named person.
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

## Step 5. The operator picks and explains

- The operator (Allen, or the client with Allen) picks **3 to 5 sites** and writes, **in their own words**, what they like about each: fonts, layout, colour, photos, feeling, how information is laid out.
- If the operator picks fewer than 3, ask once for more. If they stay with fewer, record it.
- For each picked site, measure what makes it work: fonts and weights, heading sizes and letter spacing, colours (hex), corner radius, word count, first-screen structure, how people are shown, any hand-made or human touches.
- Turn the operator's words plus the measurements into **direction principles** (for example "precise, restrained layout plus one hand-made human mark per screen").

Output: `reference-analysis.md` (one section per picked site, operator's words quoted exactly, measurements, principles).

## Step 6. Colour and type findings

**Colour**
- Start from the client's fixed colour choice and any reference photo they supplied.
- Build a scale (for example 50 to 950) and a set of neutrals that match the feeling the client asked for.
- Test every text and background pair that could ship in light and dark mode against WCAG 2.2 AA (4.5:1 text, 3:1 large text and UI). Record passes, fails and the rules they create.
- Output: `colour-sheet.html` plus the palette as JSON.

**Type**
- Fonts are never picked from memory. Build a shortlist from: fonts measured on the benchmark sites and picked references, Fonts In Use examples in the sector, Adobe Fonts (if available), Fontshare, paid foundries (trial fonts allowed for testing only) and Google Fonts.
- Rule out AI defaults (Inter, Fraunces, Instrument Serif as defaults) and the last project's pairing.
- For each candidate: legibility for the audience (I, l, 1 and O, 0 distinct, readable at 18px body), fit with the direction principles, licence and cost for web use.
- Test fonts only inside a real reference layout or a neutral specimen, never inside a designed page.
- Output: `type-findings.md` with a shortlist of 2 to 4 pairings, reasons, licence notes, and what was ruled out and why. **Final font choice happens in Phase 3.**

## Step 7. Page question maps

For each page the client wants (from `facts.md`), write:
- Who arrives on this page and from where
- The questions they ask, in order (from Step 1)
- The facts from `facts.md` that answer each question
- Gaps: questions with no fact to answer them (these go to the operator)
- The one action the page must make easy

Output: section in `research-findings.md`.

## Step 8. Blind review

Spawn a reviewer agent that has not seen this conversation, the parameters or the operator's picks. Give it only the benchmark site list with links and the scorecard. Ask it to score the sites itself and to check the audience findings for unsupported claims.

- Compare its scores with yours. Where they differ by more than 5 on a site, re-check that site and note both.
- Treat any single score as roughly plus or minus 5. Only claim a site is "the best" if two independent rounds agree.
- Only blind scores go into the final pack.

## Step 9. Write the findings pack

One file, `research-findings.md`, plus an HTML copy for easy reading. Use this structure:

```
# [Client]: Research Findings
Phase 2 output. Status: DRAFT or LOCKED (date)

## 1. Summary for Phase 3 (10 dot points max)
## 2. Audience findings (per group: questions in order, trust, accessibility)
## 3. Market findings (blind scores, bar to beat, patterns, the client's opening)
## 4. Parameters (with sources)
## 5. Inspiration (picked references, operator's words, measurements, direction principles)
## 6. Colour findings (palette, contrast rules)
## 7. Type findings (shortlist, ruled out, licences)
## 8. Page question maps (one per page)
## 9. Open decisions and assets needed (owner for each)
## 10. Sources
```

Link to the supporting files from Steps 1 to 6.

## Step 10. Lock gate

Send the operator the HTML findings pack and a 3 to 5 line summary: the bar to beat, the client's opening, the direction principles, and the one decision needed. Then STOP. Wait for "lock". Changes loop back to the relevant step. When locked, set the status line to `LOCKED (date)`. Phase 3 may start.

## Output files

- `research-audiences.md`
- `benchmark.html`
- `parameters.md`
- `reference-board.html`
- `reference-analysis.md`
- `colour-sheet.html` and palette JSON
- `type-findings.md`
- `research-findings.md` (locked) and its HTML copy
