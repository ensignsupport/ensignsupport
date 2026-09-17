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
