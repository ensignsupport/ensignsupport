# SKILL-CORRECTIONS.md
Running list of Allen's corrections to the website-builder skill, captured live during the Ensign rebuild.
Format per entry: Wrong / Rule / Where in skill / Date.
Status: all entries are PROPOSED until Step E (skill-creator pass). Nothing here is in the skill yet.

---

## C1. No copy or claims rules in the skill
- **Wrong:** The skill has no voice, banned word, claims or em dash rules. Anand's build had nothing to stop invented facts, triads, outcome promises or banned words.
- **Rule:** Every client site follows Archway's copy and claims rules (SOURCE-OF-TRUTH v2.1 sections 5, 6, 7, 8): pain as a scene, mechanism not outcome, no triads, one negation-reframe per page, banned word list, no em dashes, no invented numbers or testimonials, credentials after the work, regulated-part boundary, Australian English. Any missing fact is marked [ASK ALLEN] and left blank.
- **Where in skill:** New "Copy and claims rules" section in Critical rules, plus a copy check gate before Phase 6 build. Full rules as a reference file (references/copy-and-claims-rules.md).
- **Date:** 16 Sep 2026

## C2. Pages are tiring to read
- **Wrong:** Build is wordy and unstructured. A visitor has to work hard to find anything.
- **Rule:** On every site, a visitor can read the whole page without feeling tired. Each section answers one question a customer of THIS business would ask, in the order they would ask it. Write every page from the customer's seat: "If I needed this service, what would I want to see here, and where?" Headline plus a short line; detail sits one tap away, never deleted. Benchmark: mightymoosemowing.com.au (built by Allen).
- **Where in skill:** Critical rules (new rule), Phase 3 brief (customer questions list per page), Phase 5 design guide (information order per page), Phase 6 build check.
- **Date:** 16 Sep 2026

## C3. "Premium" standard not defined
- **Wrong:** Design is boring and repetitive. Nothing in the skill sets the bar for how good it must look and work.
- **Rule:** Every Archway site must be the best website in its market for that type of business, in look and feel, functionality and features. The owner should feel it on first view. How this shows up depends on the business and its audience (for example, calm craft and restraint for NDIS; could be bolder elsewhere). Premium is never added effects for their own sake.
- **Where in skill:** Phase 4 research (benchmark the best sites for that business type), Phase 5 design guide (state how this design beats each benchmark), blind review gate before approval.
- **Date:** 16 Sep 2026
- **Note:** "Mind-blowing" itself is taste and cannot be checked by a skill. The checkable part is the benchmark comparison and the blind review.

## C4. Stack forced to static HTML
- **Wrong:** Skill mandates a static site on Netlify for every client.
- **Rule:** Choose the stack at intake. Simple brochure sites: static HTML and CSS. Sites that need more (server forms, file uploads, portals, logins, dynamic content): Next.js. Record the choice and the reason in the brief.
- **Where in skill:** Phase 0 intake (new question), Phase 3 brief, references/build-and-deploy.md.
- **Date:** 16 Sep 2026

## C5. One big skill, hard to enforce step by step
- **Wrong:** All phases live in one skill, so an operator can skip steps (Anand's repo has no research.md, website-brief.md or design-guide.html).
- **Rule (ACCEPTED by Allen 16 Sep 2026, replaces the one-pass Step E):** Split into phase skills run like a factory line, built one phase at a time as we work through Ensign. Each phase has one owner, a fixed input file, a fixed output file, and a gate check that refuses to start if the previous phase's output file is missing or unapproved. Phases can be assigned to different team members.
- **Where in skill:** Whole skill structure.
- **Date:** 16 Sep 2026

## C6. Design preferences asked as open questions
- **Wrong:** The questionnaire asks clients open questions about look and feel ("colours or a feeling you are drawn to", "websites you like"). Clients answer everything, and the design gets pulled in every direction.
- **Rule:** Ask design preferences as closed-ended choices. Show a small fixed set of visual options (for example 3 or 4 style directions as picture cards, plus pick-one options for colour mood, imagery, motion and text density) and ask the client to pick. Open text is only allowed for "anything you definitely do not want".
- **Where in skill:** Phase 2 questionnaire (Section 5 Brand and look in questionnaire-new.md, Section 3 in questionnaire-existing.md). Becomes part of the Phase 2 skill.
- **Date:** 16 Sep 2026

## C7. Phase 1 is sound
- **Note (not a correction):** Allen has had no issues with Phase 1 (extract or capture). Carry it into its phase skill largely unchanged.
- **Date:** 16 Sep 2026

## C8. Phase structure replaced
- **Wrong:** The skill's 8 phases (intake, extract or capture, questionnaire, brief, research, design guide, build, deploy) have no copy phase, no testing phase, no showcase and no go-live plan.
- **Rule:** Seven phases, each its own step by step skill with a locked output: 1 Information validation, correction and collection. 2 Market, customer and design research, ending with the client's closed-ended design pick. 3 Content and design (copy first with a sign-off gate, then visuals). 4 Build. 5 Testing (Playwright and manual, accessibility, speed, forms, copy and claims check). 6 Showcase, feedback and corrections (retest every fix). 7 Go live and hypercare (implementation, rollback and hypercare plans; domain, email, Google Business Profile, analytics, privacy policy).
- **Where in skill:** Whole skill structure. Replaces the one-pass update in Step E.
- **Date:** 16 Sep 2026

## C9. Phase 1 must check the facts, not just collect them
- **Wrong:** Anand's site copy added service promises the client never made ("within one business day", "seven days", "written summary before each plan review", same day reference number, first week meeting, phone coaching, billing and invoicing promises).
- **Rule:** Phase 1 builds a fact register. Every fact on the site traces to a client answer or an official source, tagged Confirmed, Added, Conflict or Missing. Anything Added is either confirmed by the client in the follow-up questions or removed. Regulated facts (registration, what can be delivered unregistered) are checked against the regulator's own site.
- **Where in skill:** Phase 1 skill, core step.
- **Date:** 16 Sep 2026

## C10. Archway rules treated as hard limits on the client
- **Wrong:** Phase 1 recommended overriding the client's referral form and hiding details because Archway's copy and claims rules said so.
- **Rule:** What the client wants wins. Archway's rules are guidelines for how we write and build, not limits on what the client may have. Only in rare regulatory cases (for example collecting health information, which brings in the Privacy Act) do we pause, explain the obligation in plain English, and get the client's explicit consent before building it. Record that consent in the fact register.
- **Where in skill:** Critical rules (top of every phase skill). Copy and claims reference file gets a header line saying it is guidance, overridden by client instruction except for law.
- **Date:** 16 Sep 2026

## C11. Placeholders are allowed when the client says so
- **Wrong:** Rule "never invent, leave blank" would block progress when the client has not yet got a phone number or wants market typical service descriptions for now.
- **Rule:** If the client or Allen says "use a placeholder", use one that is obviously a placeholder in the register and in code (tagged PLACEHOLDER), and list every placeholder in the go live checklist so none ship without client sign off. Never invent silently.
- **Where in skill:** Phase 1 fact register statuses (add "Placeholder"), Phase 3 copy, Phase 7 go live checklist.
- **Date:** 16 Sep 2026

## C12. Phase 1 output is a fixed file
- **Wrong:** No single file carries the verified facts forward, so later phases (and Anand's build) pulled facts from memory and invented some.
- **Rule:** Phase 1 ends with `facts.md`: every usable fact with value, source, status (Confirmed, Placeholder, Open), plus an open items table with an owner for each. Phase 2 refuses to start without it. Phase 3 copy may only use facts from it.
- **Where in skill:** Phase 1 skill output, Phase 2 and 3 gate checks.
- **Date:** 16 Sep 2026

## C13. Too many questions left for a second client round
- **Wrong:** The first questionnaire missed basics (owner's name, experience and exact qualifications, which days the hours apply, reply time, exact suburbs or regions, what is not offered, languages, photos, whether already trading), so Phase 1 needed a follow-up round. Allen does not want to go back to the client unless absolutely necessary.
- **Rule:** Capture everything in the first round. The Phase 1 questionnaire must include every field the fact register needs, as tick boxes where possible. After answers come back, resolve gaps in this order: (1) research or public sources, (2) Allen or the operator, (3) a placeholder the client later signs off, (4) bundle into the Phase 6 showcase. A separate client follow-up only for a legal or regulatory item that cannot wait. Fine details (exact wording, degree names, small promises) do not justify a follow-up; settle them at the showcase. Aim for the first questionnaire to capture as much as possible, not perfection.
- **Where in skill:** Phase 1 skill: questionnaire field list and gap resolution order.
- **Date:** 16 Sep 2026

## C14. Legal pages drafted as a stop gap
- **Wrong:** A client with no lawyer yet would block go live on a required legal page (privacy policy when collecting health information).
- **Rule:** If the site legally needs a page (privacy policy, collection notice, terms) and the client has no lawyer's version, draft a thorough stop gap version, marked internally as not lawyer written, with placeholders listed. Client consents to using it. Replace it when a lawyer's version arrives. Record in facts.md.
- **Where in skill:** Phase 1 (flag need and get consent), Phase 3 (draft), Phase 7 go live checklist.
- **Date:** 16 Sep 2026

## C15. Public information scraped only when there is no website
- **Wrong:** Phase 1 draft only searched Google Business Profile, socials, reviews and directories when the client had no website. With a website, it only extracted the site.
- **Rule:** Always scrape both: the client's website (every page) and all public information (Google Business Profile, reviews, social pages, industry directories and registers, ABN Lookup, the owner's public professional profile, web mentions). Record value, source URL and date for every fact. The questionnaire then only asks the client to confirm what was found and fill what was not.
- **Where in skill:** Phase 1 skill, Step 1.
- **Date:** 16 Sep 2026

## C16. Design pick is a recommendation proven by research, not a menu
- **Wrong:** Phase 2 plan ended with the client picking freely from 3 directions plus options.
- **Rule:** Show the client 3 designs, and prove with the market research which one is the best to go with. Each design is scored against the benchmark bar. One is recommended, with the evidence laid out in plain English. The client still makes the final call.
- **Where in skill:** Phase 2 skill, final steps (directions and pick sheet).
- **Date:** 16 Sep 2026

## C17. Design tools used with no instructions on when or how
- **Wrong:** Anand's build already had Taste Skill (design-taste-frontend) and Impeccable available, and still came out weak. The tools were used without a phase telling him when to use them, with which settings, or how to check the result. Their defaults also lean bold and animated (Taste default dials 8/6/4, Impeccable "go all out"), which suits a SaaS landing page, not a calm NDIS site.
- **Rule:** Do not copy these tools into our skills. Name them at specific steps, with Archway settings on top:
  - Phase 2 Step 6 (3 designs): run Impeccable `shape` first (plan before designing). State a Taste Skill "Design Read" line and set the dials from the audience (trust-first or accessibility-critical audiences: variance 3 to 4, motion 2 to 3, density 4 to 5). Build the 3 designs like Emil Kowalski's `prototype` skill: each on a named, different axis, behind a picker.
  - Phase 3 (content and design): Impeccable `clarify` (copy), `typeset`, `colorize`, `layout`.
  - Phase 4 (build): Impeccable craft floor rules, Emil `animate` and `mobile-native`.
  - Phase 5 (testing): Impeccable `critique` and `audit` as the blind review, Emil `review-animations`.
  - Skip for normal client sites: Taste brutalist, GSAP and image-generation skills; Emil Swift, Expo and Sonner skills.
  - The operator must install the tools before the phase starts: Impeccable (npx impeccable install), Emil Kowalski skills (npx skills add emilkowalski/skills). Taste Skill and emil-design-eng are already on Allen's account. Test that Impeccable's checker runs in the operator's environment before relying on it.
- **Where in skill:** Phase 2, 3, 4 and 5 skills, at the named steps. Plus a "Tools" list at the top of each phase skill.
- **Date:** 16 Sep 2026

## C18. Fonts not researched alongside colour
- **Wrong:** Phase 2 did a colour palette but no fonts or font pairings. Anand's build picked Outfit and Manrope, both on Taste Skill's default list, so the type read as templated.
- **Rule:** Phase 2 Step 4 covers colour AND type. Shortlist 3 to 4 font pairings, each rendered with real client facts in light and dark mode. Every pairing must pass: legibility for the audience (distinct I, l, 1 and O, 0, tall lowercase, readable at 18px body), fit with the brand feeling the client asked for, not an AI default (no Inter, Fraunces or Instrument Serif by default, and never repeat the last project's pairing), free and self-hostable. State why each is ruled in or out, with sources. Fonts are shortlisted, not locked alone: each of the 3 designs in Step 6 uses its best-matched pairing.
- **Where in skill:** Phase 2 skill, Step 4 (colour and type).
- **Date:** 16 Sep 2026

## C19. Fonts picked from AI memory, by name
- **Wrong:** Font options came from a small pool of free Google Fonts the AI already knows, chosen by name and shown with stand-ins. That pool is exactly what makes sites look AI generated. Allen: fonts are one of the biggest differences between a generic site and an exceptional one.
- **Rule:** Fonts are never picked from memory. Every candidate must pass 5 steps: (1) evidence: extract the exact fonts used by the benchmark sites and check Fonts In Use for the client's sector; (2) wide pool: Adobe Fonts (if the operator has Creative Cloud), Fontshare, paid foundries (for example Klim, Grilli Type, Pangram Pangram, Displaay) as well as Google Fonts; (3) test with the real font files (foundry trial fonts for mockups) in the client's real first screen, desktop and mobile, light and dark, with no font names shown; (4) tune the type system (scale, weights, letter spacing, line length, line height) using Impeccable `typeset`; (5) blind review by a reviewer who does not know the names, plus a licence check before locking. Buy a licence only for the chosen font.
- **Where in skill:** Phase 2 skill, Step 4 (colour and type).
- **Date:** 16 Sep 2026

## C20. Type and design judged inside an AI-made template
- **Wrong:** 11 font pairings were tested inside one layout the AI built (small line above headline, big headline, short paragraph, two buttons, pill tags, rounded photo card, cream background). That layout is itself an AI pattern, so every option looked AI generated. Allen was not satisfied with any of them.
- **Rule:** Never judge fonts or design direction inside a generic template. Direction starts from real human-designed references: collect about 20 live sites made by real studios (Awwwards, SiteInspire, Godly, Fonts In Use, foundry showcases), relevant to the sector and to solo professional practices. The operator (Allen) picks 3 to 5. Extract their exact fonts, layout moves and spacing, and design from those. The Phase 2 direction step may be owned by a human designer (a short brand and type sprint), with AI building from their direction.
- **Where in skill:** Phase 2 skill, before Step 4 (colour and type) and Step 6 (3 designs).
- **Date:** 16 Sep 2026

## C21. Designer scored their own designs
- **Wrong:** The 3 designs were shown with self-estimated scores (A 39, B 33, C 34 out of 40), breaking the "never self-assess" rule. The blind reviewer then scored them A1 25, B 30, C 27. The self-estimates were inflated by 3 to 14 points and ranked the designs in the wrong order.
- **Rule:** Never show self-estimated scores for designs. Only scores from a blind reviewer (who has not seen the brief, the recommendation or the operator's preference, with designs relabelled and shuffled) may be shown to the operator or client. Where fonts or assets could not load for the reviewer, say so next to the scores. The recommendation to the client must be consistent with the blind review, or explain plainly why it differs.
- **Where in skill:** Phase 2 skill, Steps 6 and 7 (designs, blind review), and every later phase that scores work.
- **Date:** 16 Sep 2026

## C22. One blind review is not a stable score
- **Wrong (found, not caused by Allen):** The same unchanged designs B and C scored 30 and 27 in blind review round 1, then 25 and 23 in round 2 with a fresh reviewer. Scores moved by up to 5 points between reviewers.
- **Rule:** Treat a single blind score as a range of about plus or minus 5. Compare designs within the same review round only (all candidates in one relabelled batch). Before telling a client one design "beats the benchmark", confirm with a second independent round or state the uncertainty.
- **Where in skill:** Phase 2 Step 7 (blind review), and Phase 5 testing.
- **Date:** 16 Sep 2026

## C23. Standard two-button hero instead of a conversational enquiry
- **Wrong:** The hero used two plain buttons ("Refer someone", "Call Andrew").
- **Rule (Archway house pattern):** The main enquiry is a form that does not feel like a form. The visitor taps simple choices (for example "Who is this for?", then "Where?"), the card flips to a short details step (name, phone, optional note), then on submit: on a phone it opens the visitor's native messaging app with all their details pre-written to the business, and they press send; on a computer it submits as a form and the lead is delivered by Resend. No pre-selected choices, real radio buttons with labels, keyboard and screen reader friendly, reduced-motion respected. Keep sensitive details (health, finance) out of the text message; use a separate secure form for those. Recommend also saving the lead on the server when a phone visitor taps the button, so leads are not lost if they never press send. Test pre-filled messages on real iPhone and Android devices.
- **Where in skill:** Phase 3 (content and design: hero pattern), Phase 4 (build: sms link, Resend delivery, fallback save), Phase 5 (device testing).
- **Date:** 16 Sep 2026

## C24. Plain square portrait with centred caption lines
- **Wrong:** The owner's photo sat in a plain square frame with caption lines centred underneath, forming an uneven cone shape. It looked boring.
- **Rule:** The owner's portrait must feel designed and human: a distinctive, hand-made frame shape (Allen preferred a paint brush stroke over an arch; the stroke must be painted with a real brush and traced, not generated), a slight tilt or offset shape behind it (perfect imperfection), and the name and credentials set as a deliberate element (for example a small tilted name card overlapping the photo, or text on a curve), never loose centred lines of different lengths. Decorative text on a curve must repeat information that also appears as normal text.
- **Where in skill:** Phase 3 (design), Phase 2 Step 6 (design options).
- **Date:** 16 Sep 2026

## C25. Enquiry flow styled as a boxed card with chunky chips
- **Wrong:** The conversational enquiry (C23) was built as a bordered card with pill-like chips that wrapped unevenly, a small "1 of 3" label and a visible focus box on the question. Allen: the function is right but the design looks poor.
- **Rule:** Style the enquiry flow as part of the page, not a widget: no box, the question set in the headline font, answers as full-width rows with hairline dividers and an arrow (matching the site's other link lists), a thin progress line instead of "1 of 3" (step count kept for screen readers only), underlined inputs on the details step, and a quiet fade between steps. Never show a focus outline on programmatic focus, only on keyboard focus.
- **Where in skill:** Phase 3 (design: enquiry pattern), Phase 4 (build).
- **Date:** 16 Sep 2026

## C26. Enquiry rows correct but flat to interact with
- **Wrong:** The redesigned rows (C25) looked clean but felt flat to click. Allen asked for them to be more interesting to interact with.
- **Rule:** Interactive choices get purposeful feedback, kept calm: on hover a soft tint sweeps in from the left and the label eases right, a round arrow button fills and nudges forward; on select, a hand-drawn line draws itself under the choice (tying into the site's hand-made marks) and the next step fades in after about half a second. Hover effects only on devices that hover, a pressed state on touch, all motion off under reduced motion, durations under about 0.5 seconds with ease-out curves (Emil Kowalski `animate` guidance).
- **Where in skill:** Phase 3 (design: interaction details), Phase 4 (build), Phase 5 (review-animations check).
- **Date:** 16 Sep 2026

## C27. Favicon looked like a famous brand
- **Wrong:** The first Ensign favicon (white lowercase "e" on a blue tile) looked like the old Internet Explorer logo.
- **Rule:** Before showing any favicon or logo, check it against well-known brand marks that share its letter, shape or colour (search the letter plus "logo" and compare at 16px). Avoid a single lowercase letter on a blue square. Favicons are designed after, or together with, the logo in Phase 3, not before it; any earlier favicon is marked as a placeholder.
- **Where in skill:** Phase 3 (logo and favicon).
- **Date:** 16 Sep 2026

## C28. Phase 2 went too far into design
- **Wrong:** Phase 2 moved from research into full homepage designs, component details (enquiry flow, portrait frame, interactions) and several design revisions. That is Phase 3 work and made Phase 2 too big to hand over.
- **Rule:** Phase 2 ends with research and findings only: everything Phase 3 needs to write the content and design the website. No page designs in Phase 2. Visual tests are allowed only to check a finding (for example a colour contrast check), never to design pages. Design drafts already made are carried into Phase 3 as inputs, not locked outputs.
- **Where in skill:** Phase 2 skill scope and exit gate; Phase 3 skill inputs.
- **Date:** 17 Sep 2026

## C29. Layout busy, no spacing system
- **Wrong:** A1 v6 felt busy with text and did not follow a clear design framework for spacing and organising content on screen.
- **Rule:** Phase 3 sets a spacing and layout system before designing sections: a spacing scale (for example 4 or 8 point steps), a type scale, a content width, and section rhythm (generous space between sections, tight space within). Each section gets one job and the fewest words that do it. Use Impeccable `layout` and `distill` for rhythm and cutting, and Emil Kowalski's design engineering guidance for component polish.
- **Where in skill:** Phase 3 (design system first, then sections).
- **Date:** 17 Sep 2026

## C30. Process and details shown as text and lines
- **Wrong:** "How it starts" and the key details list were plain text with rules. Allen wants them as simple visual representations that are easy to understand at a glance.
- **Rule:** Any sequence (steps, process) or set of key facts is shown visually first: simple icons or illustrations, a path or timeline that shows movement, and very short labels, with the detail secondary. Visuals must still work for screen readers (real text, not text in images) and on phone.
- **Where in skill:** Phase 3 (content and design patterns).
- **Date:** 17 Sep 2026

## C31. Leads only living in a text message or an inbox
- **Wrong (prevented):** The enquiry flow opened Messages on phones with nothing saved, and desktop leads existed only as emails.
- **Rule:** Every enquiry and referral is saved on the server the moment it is submitted or a phone visitor taps to open Messages. The site includes a simple admin page listing all leads, locked behind a password stored as a hosting environment variable (Netlify). Store leads in private server storage, never in public site files. If leads include health or other sensitive information, treat the admin page as covered by the privacy policy.
- **Where in skill:** Phase 1 questionnaire (ask where leads should be viewed), Phase 3 (admin page in the sitemap), Phase 4 (build), Phase 5 (test).
- **Date:** 17 Sep 2026

## C32. Separate copy sign-off gate
- **Wrong:** Phase 3 planned a copy sign-off gate (and an optional client read of copy) before any design.
- **Rule:** Write all the copy first, then go straight to design with no operator or client copy approval step. The operator reviews copy and design together on the page designs. The client (Andrew) reviews everything at the Phase 6 showcase. An automated copy rules check (facts traced, banned words, triads, em dashes) still runs before design, because it needs no human.
- **Where in skill:** Phase 3 skill, copy step and gates.
- **Date:** 17 Sep 2026

## C33. Treating the blind reviewer's pick as the decision
- **Wrong (prevented):** The blind reviewer preferred font option B (30.5/40). The operator chose A (29/40), inside the ±5 margin.
- **Rule:** Blind review is evidence, not a vote. When scores sit within the ±5 margin, show the options side by side on real sections and let the operator decide. Record the choice and move on; do not re-argue it.
- **Where in skill:** Phase 3 skill, design system step (font choice), and every closed-ended design choice.
- **Date:** 17 Sep 2026

## C34. Logo that only looks nice, in a common font
- **Wrong:** Round 1 logos used the site font (Figtree). The operator said the wordmark "feels like an appliance brand", and the best mark (a path) "does not denote what Andrew is doing".
- **Rule:** The logo font is chosen separately from the site font. Source rare typefaces from independent open foundries (not Google Fonts, not AI-default fonts), verify the licence allows commercial logo and web use, and save the licence file with the font. Every logo mark must show what the client actually does for their customer, stated in one plain sentence under the concept. Blind review each concept for lookalikes (wordmark and favicon separately) and legibility at 16px.
- **Where in skill:** Phase 3 skill, logo and favicon step.
- **Date:** 17 Sep 2026

## C35. Polished logo details that no one could draw
- **Wrong:** Four refined underline versions (dry brush, weave, signature loop, two strokes) were built and blind reviewed. The operator rejected all: it "needs to be interesting and easy to draw by hand".
- **Rule:** Hand-made brand marks must be simple gestures a person can draw with a pen in a few seconds, at one steady thickness, in one colour. Show quick direction sketches (about 6, each with a plain "draw it" instruction and a meaning) and let the operator pick a direction before refining or blind reviewing.
- **Where in skill:** Phase 3 skill, logo step and any hand-drawn marks (C24, C34).
- **Date:** 17 Sep 2026

## C36. Applying an old correction over a design the operator later liked
- **Wrong:** The enquiry component was rebuilt as boxless rows with arrows (following C25 from 16 Sep), although Allen had since seen and liked the white card with full-width pill choices in the locked design system test page (17 Sep).
- **Rule:** The most recent design the operator has seen and approved wins over an older correction. Before building a component, check the latest approved renders, and if they conflict with a logged rule, show both or ask in one line. Enquiry pattern now: white card, thin progress bars plus visible "Question 1 of 3", question in the heading font, full-width pill choices. Hover: border turns indigo and a hand-drawn line draws under the label. Selected: thicker indigo border, pale indigo tint, bold label, line stays (no dark fill). This supersedes the visual part of C25 and C26; their behaviour rules still apply.
- **Where in skill:** Phase 3 skill, components step.
- **Date:** 17 Sep 2026

## C37. Trust handled as "add reviews" only
- **Wrong (prevented):** The Home page blind review scored trust 6/10 and the fix offered was only "get testimonials". Andrew has no public reviews yet.
- **Rule (Allen's trust framework):** People trust a business when they have enough **relationship** (they feel they know the person), **low risk** (starting feels safe) and **proof** (it can deliver the outcome). For every client, map what the site already shows under each of the three, then close gaps with confirmed facts only: relationship (face, first person voice, short video or voice note, local and language ties), low risk (reply times, pricing honesty, easy first step, clear limits, confirmed free first chat or exit terms), proof (credentials, checks, experience, process samples, genuine permission-given quotes, professional endorsements). With no reviews yet, never invent or show empty review blocks; plan a review collection flow for Phase 7 (for example Google Business Profile plus a request after the first month). Write the map as a trust plan doc.
- **Where in skill:** Phase 1 questionnaire (ask for proof assets and exit or first chat terms), Phase 2 research (competitor trust signals), Phase 3 copy and page design (trust strip, placement), Phase 7 (review collection).
- **Date:** 17 Sep 2026

## C38. Editing a multi-page copy doc by the first matching heading
- **Wrong:** A script replaced "### 1. Page header" through "### 3. The form" to update the Refer page, but matched the Services page's first heading instead. Services and About copy were overwritten. It was caught and restored from the earlier saved copy the same day.
- **Rule:** In a copy doc with repeated section names, always anchor edits to the page heading first (for example find "## Refer someone", then search for "### 1." after it), assert the page name of the matched block before writing, and diff the page list and word count before and after every scripted edit.
- **Where in skill:** Phase 3 skill (copy step, any scripted edit), all phases that edit shared docs.
- **Date:** 17 Sep 2026

## C39. Pages that are orderly but boring
- **Wrong:** The first Services page reused the same pattern for every section (eyebrow, heading, paragraph, four tiles, button). Allen: "clumsy, unorderly and unstructured... it looks boring". The "How Andrew works" band of big words also didn't land.
- **Rule:** Give each page one clear structure (for example "choose your path" cards, then one chapter per option, alternating sides) and give each section its own visual metaphor taken from the approved copy (a plan pinned on the fridge with hand-drawn ticks, a wave for good and hard days). Pair opposites side by side (what you can count on vs what is not included). Never repeat the same section layout twice in a row. Keep all words from the copy doc; metaphors are drawn, not written.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 17 Sep 2026

## C40. Layout bug missed because only the top of a long page was checked
- **Wrong:** On the Privacy page, list rows used a two-column grid. Rows containing bold text or links split each word and link into its own grid cell, so section 10.3 rendered as scattered words. Automated checks passed and only the first screen was reviewed.
- **Rule:** Any grid or flex row that holds rich text must wrap the text in one element. For long pages, screenshot and look at every section (or every row type with bold, links and placeholders), not just the top, before showing the operator.
- **Where in skill:** Phase 3 page design check, Phase 5 visual testing.
- **Date:** 17 Sep 2026

## C41. Two columns centred but with edges that nearly line up
- **Wrong:** The Home hero put the text column and the portrait side by side with the two columns centred on each other. Their centres matched to within 2px, but the tops missed by 44px and the bottoms by 47px. Allen: "this whole section is unevenly placed for a hero section... it feels uneven and messy". A blind reviewer put it the same way: a 200px offset reads as a decision, a 45px offset reads as a mistake.
- **Rule:** In any two column block, edges either line up exactly or are offset far enough to read as deliberate (100px or more). Never leave a near miss. The cheapest fix is to let the taller element stretch to the row height (`align-items:stretch` plus `aspect-ratio:auto` on the image), so both columns share a top and a bottom. Measure the bounding boxes with the browser and print them; do not judge alignment by eye.
- **Where in skill:** Phase 3 skill, page design step and the check step.
- **Date:** 17 Sep 2026

## C42. A hard line break swallowing the word space
- **Wrong:** A `<br class="dbr">` was used to control where a subheading wrapped on a computer, written as `with you<br class="dbr">and comes`. The break is hidden on a phone with `display:none`, and because there was no space in the source the phone rendered "youand".
- **Rule:** Every optional `<br>` used for line control must have a real space before it in the source. After adding one, render at phone width and read the sentence back. Never let markup supply a word space.
- **Where in skill:** Phase 3 skill, copy and page design steps, and the phone check.
- **Date:** 17 Sep 2026

## C43. A block of text where a picture was needed
- **Wrong:** The Home "Four providers on the list" band was a big heading beside two paragraphs. Allen: "This feels boring no one is going to read this text unless it feels visual, nice to read like the other components we have."
- **Rule:** Any section whose job is to explain a problem gets turned into a shown comparison, not a written one. The house pattern is two panels side by side with a hand-drawn arrow between them: the current state muted and outlined, the better state a white lifted card with blue ticks, three short parallel lines each. On a phone they stack and the arrow rotates. Every line must already exist in the approved copy; nothing new is invented to fill a panel.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 17 Sep 2026

## C44. The same facts stated twice in one section
- **Wrong:** After the two panels were added, the intro paragraph still said "a budget and a list of names... the ringing around... a week of waiting", which is exactly what the left panel listed. A blind reviewer flagged the repetition and that it leans on the pain longer than the point needs.
- **Rule:** When copy is turned into a visual, delete the prose it replaced. Read the section aloud and check no fact appears twice. For a vulnerable audience, state the problem once and move to the answer.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 17 Sep 2026

## C45. Fixed size overlays on fluid images
- **Wrong:** The name card over Andrew's portrait was the same 190x81px at every width. On a computer it covered 37% of the photo, on a phone 82%, with only a 3px inset left and a leftover strip of photo underneath.
- **Rule:** Any label, badge or card sitting on top of a responsive image must scale with it. Set smaller padding and type at the phone breakpoint and check the inset as a percentage, not in pixels.
- **Where in skill:** Phase 3 skill, component step, and Phase 5 visual testing.
- **Date:** 17 Sep 2026

## C46. Small craft defects that only a blind reviewer catches
- **Wrong:** Straight apostrophes throughout the site, a hand-drawn underline running into the tail of a "y", three different blues doing one job (#2850d3, #6993fa, #506fd6), an arrow that looked off centre because its SVG viewBox had dead space on one side, and decorative markers at 1.17:1 that were invisible although they passed automated checks.
- **Rule:** Before locking any page, run a blind reviewer whose only question is "what here is actually broken or wrong, as opposed to a matter of taste". Then check the list every time: curly apostrophes in text (never inside script or style blocks), no decoration touching a descender, one accent colour per motif, SVG viewBoxes trimmed to the drawing, and decorative elements checked by eye because automated contrast checks ignore them.
- **Where in skill:** Phase 3 skill, check step.
- **Date:** 17 Sep 2026

## C47. Stretching a photo to force two columns to line up
- **Wrong:** To fix the uneven hero (C41), the portrait was stretched to the full height of the text column by setting `align-items:stretch` and `aspect-ratio:auto`. The tops and bottoms then matched exactly, but `object-fit:cover` cropped the photo into a tall narrow frame. Allen: "This feels too messy now. the image looks too big and unnatural."
- **Rule:** A photograph keeps its natural crop. Never stretch or re-crop a portrait to make a grid line up. Fix evenness with the things that have no natural shape: line breaks, column ratio, type size, the width of the card beside it. If two columns still cannot match, centre them so the leftover space is equal top and bottom, and stop there. Evenness never costs the photo.
- **Where in skill:** Phase 3 skill, page design step (supersedes the stretch advice in C41).
- **Date:** 17 Sep 2026

## C48. A short question flow that looks like a form before it is one
- **Wrong:** The enquiry flow sat inside a white card with a progress bar from the very first screen, so the first thing a visitor saw was a form. Allen: "simplify the form to make it look like its just some buttons to click and not a proper form until they get to the part where they enter details."
- **Rule:** In a multi step enquiry flow, the choice steps are not a form. No card, no surface, no progress bars: just the question and full width buttons on the page background, each one a real button with a white fill, a soft shadow, a lift on hover and a chevron on the right. Keep a small muted line of orientation ("Question 1 of 3"). The card, the progress bar and the form styling appear only on the step that asks for name and contact details. Drive it from the visible step with `:has(.step[data-step="n"]:not([hidden]))` so no extra JavaScript is needed, and check that the card returns on the details step and the back button still works.
- **Where in skill:** Phase 3 skill, component step (enquiry flow, extends C23 and C36).
- **Date:** 17 Sep 2026

## C49. Scroll reveal animation that can leave a section blank
- **Wrong:** The "How it starts" steps and the key facts were hidden with `opacity:0` and revealed by an IntersectionObserver adding a class. In a full page capture the observer fired for one group and not the other, so an entire section rendered as half a screen of empty background with a stray button under it. The always visible fallback existed, but it was locked inside the `prefers-reduced-motion:reduce` block, so it helped nobody else.
- **Rule:** Any reveal on scroll must fail open. Keep the observer, and add a timer (about 2 seconds) that adds the visible class to every observed element regardless. Never put the always visible fallback only inside a reduced motion query. Check every reveal section in a full page screenshot and assert in the browser that no element is left below full opacity after the page has settled.
- **Where in skill:** Phase 3 skill, page design step and the check step; Phase 5 visual testing.
- **Date:** 17 Sep 2026

## C50. Two rounds of hero layouts before the shape was right
- **Wrong:** Three rounds of hero fixes were tried before asking what the hero should be. Tweaks first (line breaks, column ratio, centring), then a stretched photo Allen rejected, then three fresh layouts, then two more from reference sites Allen supplied. He said it plainly: "Nothing has changed, Just the hero section desperately needs another layout."
- **Rule:** When the operator says a section feels wrong twice in a row, stop adjusting it. Build two or three genuinely different layouts, not variations, and show them side by side in one round. Ask for a reference site early: one screenshot from the operator settles more than three rounds of guessing. When a reference is given, build it properly (cut out the photo, match the composition), do not approximate it.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 17 Sep 2026

## C51. A multi step flow sized by its tallest step, and a mis-diagnosis of why
- **Wrong:** The Home enquiry flow was locked into a fixed 516px box so the panel stayed the same size on every stage. The box was set by question 2's ten location buttons. Question 1 needed 284px, so 232px of panel sat empty and nothing could fill it. The note left in OPEN-ITEMS said to fix it by splitting the details stage in two. Measuring every stage showed the details stage was 439px, not the tallest, so that fix would have changed nothing and cost a round.
- **Rule:** Before padding a multi step box, measure every step and print the numbers. If the tallest is more than about 25 percent taller than the shortest, do not pad the short ones, redesign the tall one until they match: put long option lists in a grid, move the rare options behind one "Somewhere else" button that opens a field in place rather than below, and split a long details step into several one question steps. Then click every step at every width and print the container height. Equal to within a pixel, or it is not fixed. Never write a rule about a box you have not measured at every step.
- **Where in skill:** Phase 3 skill, component step and check step.
- **Date:** 18 Sep 2026

## C52. Satellite elements around a focal shape at wildly different distances
- **Wrong:** Four chips floated around the circular portrait. Measured from the circle's edge to each chip's nearest point they ran from 81px inside the circle to 66px outside it, a 147px spread. Two crowded the photo, two drifted in dead space. Allen could see it was wrong but had no words for it.
- **Rule:** Place satellite elements polar, from the focal shape's centre, on one radius: `left:calc(50% + var(--cr) * var(--cx))` with `translate(-50%,-50%)`, where --cx and --cy are the cosine and sine of each element's angle. Choose angles to leave whatever else occupies the frame alone. Animate the `translate` property, never `transform`, so a float or bob composes with the centring transform instead of destroying it. Then print each element's nearest-point distance to the shape and check the spread is under about 25px.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 18 Sep 2026

## C53. An element bleeding out of its container and stopping 1px short
- **Wrong:** The dark card was set to `right:-11%` of its parent, which landed its right edge 1px inside the panel's right edge, while every other element in the panel had 58px of breathing room. It read as a collision with the corner.
- **Rule:** Anything that breaks out of its container's padding must either line up exactly with a real edge, or clear that edge by the container's own padding value. Never stop 1 to 20px short. Print the element's edge and the container's edge and compare the numbers. This is C41's near miss rule applied to container edges, not just to columns.
- **Where in skill:** Phase 3 skill, page design step. Extends C41.
- **Date:** 18 Sep 2026

## C54. A display rule silently beating the hidden attribute
- **Wrong:** `.where-other{display:grid}` was written for a disclosure panel that carries the `hidden` attribute. `display:grid` overrides `[hidden]`'s `display:none`, so an invisible panel was still adding 126px to a fixed height box. Nothing looked broken, the box was just mysteriously too tall.
- **Rule:** Any rule that sets `display` on an element that also uses the `hidden` attribute must be written `:not([hidden])`, or the sheet must carry `[hidden]{display:none!important}`. After adding any disclosure, measure the container with it closed and assert the height is unchanged.
- **Where in skill:** Phase 3 skill, component step; Phase 5 testing.
- **Date:** 18 Sep 2026

## C55. A new class name colliding with an existing one
- **Wrong:** A new `.creds` class was added for the hero credentials. `.creds` already existed in the portrait component with `max-width:560px`, so the credentials rendered squashed into a narrow column with every label broken one word per line.
- **Rule:** Before introducing a class name, grep every CSS file and build script in the pack for it. If it already exists anywhere, prefix the new one to its block. Component sheets that get merged into one page share a global namespace.
- **Where in skill:** Phase 3 skill, page design step.
- **Date:** 18 Sep 2026

## C56. A build pack that could not rebuild its own locked output
- **Wrong:** Phase 3 was locked with a build pack that could not run. `rebuild_all.sh` and `fullcheck.py` hardcoded the previous session's cloud paths. Four build inputs were missing from the repo entirely (the design system CSS, the design system markup, the web font, axe-core). `rebuild_all.sh` ran `add_dev.py` on a page whose builder it never called, so it always failed on the last line. Worst of all, the logo, favicon and photo files committed to the repo were not the ones inlined in the built pages, so a rebuild silently inflated every page by 10 to 46KB. The optimised assets existed only inside the built HTML and had to be recovered by decoding them back out.
- **Rule:** A phase is not locked until a clean checkout rebuilds the locked output byte for byte. Every path in the pack is relative to the pack. Every input is committed, including the exact optimised assets that get inlined, not the originals they came from. The pack ships a reproduce check that rebuilds and diffs against the committed output and fails loudly on any difference. Run it as the last step before writing the lock file.
- **Where in skill:** Phase 3 lock step, and every phase that hands over a build pack.
- **Date:** 18 Sep 2026

## C57. A check that asserted the value set, not the pixels the browser drew
- **Wrong:** The new progress bar was verified by reading `bar.style.width`, which returned 93%. The browser was painting 33%. Allen spotted it on screen after the check had passed. A stale `max-width:56px` from the superseded three-segment bar was clamping the fill.
- **Rule:** Never assert the value you just wrote. Every visual check measures what the browser painted: `getBoundingClientRect()` on the element and its container, and a ratio. If a check can pass while the screen is wrong, it is not a check.
- **Where in skill:** Phase 3 check step; Phase 5 testing.
- **Date:** 18 Sep 2026

## C58. Repurposing an element inherits every constraint, not just display
- **Wrong:** C54 caught `display` beating `[hidden]` and C55 caught a class name collision. The same class of bug returned twice more in one session: a `max-width` from a superseded design clamped a reused element, and a `margin-top:32px` from an earlier layout silently inflated a box that was supposed to be a fixed height.
- **Rule:** When reusing a class from a design that has been replaced, print every computed property that can constrain it: display, width, max-width, min-width, flex, position, margin, padding. Reset the ones you are not using explicitly. An old rule that no longer has a matching design is still in the sheet.
- **Where in skill:** Phase 3 page design and check steps. Extends C54 and C55.
- **Date:** 18 Sep 2026

## C59. A deploy step that reused one staging filename shipped a stale copy
- **Wrong:** Every push used the same staging filename. The transfer sent a cached older copy twice, so Allen was reviewing a different page from the one being checked, and said twice that a change had not appeared. The same script also defaulted to the wrong layout variant, so two pushes sent a rejected arrangement.
- **Rule:** Stamp every deploy with a unique version in the filename. Never default a variant flag to a value the operator has not chosen. After writing to the operator's machine, read the file back and assert the change is present. Trust the target, not the send.
- **Where in skill:** Phase 3 delivery habits; any phase with a live preview loop.
- **Date:** 18 Sep 2026

## C60. A fixed height box must choose which end the slack sits at
- **Wrong:** A fixed-height enquiry box was tried three ways in one session. Content centred put the gap between the progress bar and the question. Content top-aligned put a large gap above the next section. Only bottom-aligned read correctly, because the box sits directly above a divider.
- **Rule:** A fixed-height container always has slack on some step. Decide deliberately where it collects. Above a rule or a following section, pin the content to the bottom so the slack reads as breathing room above. Never leave it centred by default.
- **Where in skill:** Phase 3 component step.
- **Date:** 18 Sep 2026

## C61. The fold is a budget with a ceiling, and the ceiling must be stated
- **Wrong:** The hero was 947px tall. Allen could not see the credentials strip on his laptop. Each later request to enlarge type ate the remaining margin without anyone tracking it.
- **Rule:** Measure the hero against real laptop content heights (1280x800 and 1512x850 as the floor cases) and print the remaining pixels with every change. When the margin drops below about 15px, say the ceiling has been reached and offer the trades (shorter lead, fewer credentials, or accept it slipping below the fold on the smallest laptops). Never silently cap the operator's request.
- **Where in skill:** Phase 3 page design step.
- **Date:** 18 Sep 2026

## C62. A progress indicator that was half full before anyone touched it
- **Wrong:** The bar was set to a non-linear curve starting at 40% so the flow would feel nearly done. On an untouched form it read as dishonest. Allen: "it is already half filled before any one clicks on anything".
- **Rule:** A progress indicator starts near empty, about 8%. The first answer earns the biggest jump. After that it runs ahead of the real progress so later steps feel close to done (for example 8, 45, 66, 82, 93, 100 across five steps). Never show meaningful progress for work not yet done.
- **Where in skill:** Phase 3 component step.
- **Date:** 18 Sep 2026

## C63. Emotional copy written with no research behind it
- **Wrong:** Asked to make a comparison band speak to pain points and emotions. The Phase 2 findings for this client contained no customer emotions at all: questions, trust builders and accessibility needs only. Any emotional line would have been a guess about how a vulnerable person feels, printed on the client's site as if understood.
- **Rule:** Emotional copy needs a source in the Phase 2 audience findings. If it is not there, say so before writing, offer a version grounded in the locked facts, mark every new line in `copy.md` as NEW with the date, and add it to the open items for the client to confirm. Never put words in a customer's mouth without the client agreeing they sound right.
- **Where in skill:** Phase 3 copy step; Phase 2 audience research.
- **Date:** 18 Sep 2026

## C64. Amplifying pain for a vulnerable audience
- **Wrong:** The request was to lean harder into the pain points. For an audience that may include people in psychosocial crisis, the standard direct-response move is the wrong instrument.
- **Rule:** For vulnerable audiences, name the feeling once in plain words and resolve it immediately. One line of recognition, one line of relief. No dwelling, no stacking, no second pass over the same wound. Say this to the operator before building, then build what they decide.
- **Where in skill:** Phase 3 copy step. Extends C44.
- **Date:** 18 Sep 2026

## C65. Muted text made with opacity, which broke AA
- **Wrong:** A comparison panel was dimmed with `opacity:.86` to push the contrast between the two sides. Its text was already a muted grey token, so the extra opacity dropped five nodes below WCAG AA and axe failed the page.
- **Rule:** Never get "muted" from `opacity`. Muted comes from colour tokens that have been contrast-tested. Get visual de-emphasis from weight, size, elevation and border instead. Opacity on text is a contrast bug waiting to happen.
- **Where in skill:** Phase 3 design system and page design steps.
- **Date:** 18 Sep 2026

## C66. A proper noun split across two lines
- **Wrong:** A credential wrapped as "Master of Social Work, University / of Queensland", splitting the institution name.
- **Rule:** Keep proper nouns, phone numbers and short phrases together with non-breaking spaces inside the string, not with an optional `<br>`. A non-breaking space survives every width. A `<br>` only works at the width it was tuned for and carries the C42 word-space trap.
- **Where in skill:** Phase 3 page design step. Extends C42.
- **Date:** 18 Sep 2026

## C67. Guessing which element the operator meant
- **Wrong:** The operator said "remove the tile like thing and make it seamless with the background". Two elements on screen could be called a tile: the white form card and the large rounded panel. Guessing would have cost a full build and review round.
- **Rule:** When the operator points at something with a vague word and more than one element fits, ask one short either or question before building. One question costs a minute. A wrong guess costs a round, and after two wrong guesses C50 applies and the cost is three.
- **Where in skill:** Phase 3, all steps.
- **Date:** 18 Sep 2026

## C68. A reference's small element made into a big one
- **Wrong:** The operator supplied a reference hero whose signature move was a small dark teaser card overlapping a photo. Built to that arrangement with the client's actual enquiry form in the card, the form covered the subject and left a meaningless strip of shoulder. The proportions of the reference were right. The mass of the content was not.
- **Rule:** When adapting a reference, check whether your content weighs the same as the element you are copying. A teaser card and a five step form are not the same object. If the mass differs, the arrangement must change even though the reference was measured correctly. Build it, look at it yourself, and show the operator the failure rather than shipping it.
- **Where in skill:** Phase 3 page design step. Extends C50.
- **Date:** 18 Sep 2026

## C69. Header scrolled away and no review caught it
- **Wrong:** The site header was never given a sticky rule. It scrolled off the top and stayed gone on all seven pages. Four rounds of whole-site blind review, an axe pass on every page, and a fold measurement to the pixel all passed, because every check looked at the page at rest. Nobody scrolled. The operator found it.
- **Rule:** Page behaviour on scroll is a checked item, not an assumption. Before a page is called done, assert the header's position after a scroll, not just at rest. If it is meant to stay, prove it stays, prove nothing paints over it across its full width, and prove it does not eat fold budget. The wider rule: every check must exercise the state the visitor will actually be in. A page at rest is one state out of many.
- **Where in skill:** Phase 3 verification step (A5). Add scroll state to the per page checks alongside overflow and axe.
- **Date:** 20 Sep 2026

## C70. A superseded design left rules behind that broke the replacement
- **Wrong:** Three separate failures with one cause. The progress bar's old three segment design left `max-width:56px` in the base sheet, so the bar was dead on the Contact page while working on Home, which had an override. The superseded hero 6 sheet left `.home-hero` order rules behind, which silently decided three of five children in the new hero and put the buttons above the headline on a phone. C54's `[hidden]` versus `display` clash came back a third time.
- **Rule:** When a design is replaced, delete its rules. Do not override them. An override fixes the one surface you are looking at and leaves the old rule live everywhere else, and the failure surfaces on the page you did not check. After replacing a component, grep the sheets for the old class names and remove them, then prove the new component behaves identically on every page that uses it, not just the one you built it on. For whole classes of bug, prefer one rule that makes the mistake impossible: `[hidden]{display:none!important}` is now in the base sheet and C54 cannot happen again.
- **Where in skill:** Phase 3, design system step and verification step.
- **Date:** 21 Sep 2026

## C71. A timer that outlives the thing it was waiting for
- **Wrong:** Choosing an answer started a 480ms timer to advance. Tapping "Somewhere else" or Back inside that window did not cancel it, so the form jumped a step with no location recorded. The visitor then filled in three more questions, pressed Send, and nothing happened, ever, with no error, because the failed check set its message on a step that was hidden. A silent dead end on the primary conversion path.
- **Rule:** Any deferred action must be cancelled by every event that changes the state it was going to act on. And a validation failure must never land on something the visitor cannot see: if a check fails on a hidden step, show that step first, and make sure the message itself is visible before setting it. Test every control pair at 100, 200, 300 and 400ms apart, not just at human speed.
- **Where in skill:** Phase 3 enquiry flow step and verification step.
- **Date:** 21 Sep 2026

## C72. Scroll reveals that strand content
- **Wrong:** The four recovery coaching steps used an IntersectionObserver with a negative rootMargin. A fast flick past them, or a jump down the page, carried them through without ever intersecting, so they stayed at opacity 0 permanently. A reviewer reading a screenshot reported the card as a broken empty box, and they were right.
- **Rule:** A reveal is decoration. Content that never arrives is a defect. Every reveal needs two fail-safes: a scroll sweep that shows anything which has reached the screen whether or not the observer fired, and an absolute timeout that shows everything. Verify by jumping straight to the bottom of the page and asserting that nothing is left under 5 percent opacity. Capture review screenshots by scrolling in viewport steps, never one jump, or the reviewer judges a page that no visitor sees.
- **Where in skill:** Phase 3 verification step.
- **Date:** 21 Sep 2026

## C73. Only the surface being looked at got checked
- **Wrong:** The same enquiry flow exists on Home and on Contact. Every fix went onto Home, where the operator was looking. Contact kept a dead progress bar, a box that changed height by 305px between steps, and one column areas that made one step taller than the phone screen. The operator's rule that the box never grows had been stated once and enforced on one page.
- **Rule:** A component used on more than one page is verified on every page that uses it, at every breakpoint, before it is called done. Write the check as a loop over pages, not as a one off on the page in front of you. The same applies to a rule the operator states: it is a rule for the component, not for the screen where they said it.
- **Where in skill:** Phase 3 components step and verification step.
- **Date:** 21 Sep 2026
