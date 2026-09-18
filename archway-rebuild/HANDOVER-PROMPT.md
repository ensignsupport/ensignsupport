# Handover prompt: Ensign website and the Archway website factory skills

Paste everything below the line into a new Cowork session, with the Ensign Support project attached and the Mac connected.

---

## WHO AND WHAT

I am Allen, founder of Archway Automation (Brisbane). You are continuing work I started in earlier Cowork sessions.

There are two jobs here, and the second one matters more than the first.

1. **Finish the Ensign Support Coordination website** for my brother Andrew Manoba. NDIS support coordination and psychosocial recovery coaching, South East Queensland, sole operator, unregistered provider working with self managed and plan managed participants.
2. **Build the Archway website factory skills.** Seven phase skills, one per phase, that let Anand (my India based engineer, who runs .md skills in Claude Cowork) build client websites at this quality without me. Ensign is the pilot that teaches the skills. Every correction I make is a rule the skill was missing.

Hard stop: my second baby is due any day. When the baby arrives the work goes to Anand. Assume the skills have to stand on their own.

## STANDING RULES. THESE ARE NOT NEGOTIABLE

1. **Never invent a client fact.** No number, testimonial, credential, service, time frame or security measure that is not in `phase-1/ensign-facts.md`. Anything unknown is a visible yellow `PLACEHOLDER: what Andrew must confirm` tag. This includes legal and privacy pages.
2. **Never self assess.** Any score you show me comes from a blind reviewer subagent that has not seen the brief, your preference, or the other options' names. Treat a single blind score as plus or minus 5.
3. **Nothing is exported, deployed, pushed or locked until I say "lock".**
4. **My wishes win** over Archway house rules, except legal and regulatory items, which need Andrew's recorded consent.
5. **Short dot points. Plain English, assume no prior knowledge. Australian English.**
6. **Hard rule, zero exceptions, every surface and every output: never use an em dash.** Use a period, a comma, "and", "but", or restructure.
7. **Log every correction I make** in `archway-rebuild/SKILL-CORRECTIONS.md` the moment it happens, in the format Wrong / Rule / Where in skill / Date, and then fold that rule into the relevant phase skill.
8. **Use the task list** for anything with more than two steps, and include a verification step.

## WHERE EVERYTHING IS

**On my Mac** (connected to the session):
`~/Documents/GitHub/ensign/archway-rebuild/`
- `SKILL-CORRECTIONS.md` .......... C1 to C50. Read the last ten before you touch design.
- `phase-1/` ...................... `ensign-facts.md` (LOCKED), `ensign-privacy-policy.md` v1.1
- `phase-2/` ...................... `ensign-research-findings.md` (LOCKED)
- `phase-3/ensign-copy.md` ........ every word on the site. The source of truth for copy.
- `phase-3/ensign-tokens.css` ..... the design system
- `phase-3/logo/final/` ........... logo, favicons, licence, LOGO-LOCK.md
- `phase-3/pages/` ................ the 8 built HTML pages, plus index.html, dev-version.txt, HOW-TO-PREVIEW.md
- `phase-3/build/` ................ **the build toolchain. Read its README.md first.**
- `phase-3/components/` ........... the component sheets
- `phase-3/OPEN-ITEMS.md` ......... everything Andrew still has to supply, plus design calls left to me
- `phase-3/site-review-log.md` .... four rounds of blind review and what was and was not changed
- `phase-3/PHASE-3-LOCK.md` ....... the pack index, currently revision 3
- `phase-4-inputs/admin-security-requirements.md`
- `skills/website-phase-3-content-design/SKILL.md`

**In the Claude project "Ensign Support"**: `claude/ensign-status.md`, `claude/SKILL-CORRECTIONS.md`, `claude/archway-client-copy-and-claims-rules.md`. Read the status doc before anything else.

**Git**: local branch `archway-rebuild-phase-1-3`, commit 5d38c45, main untouched, nothing pushed. A leftover `.git/index.lock` blocks GitHub Desktop. I remove it myself with `rm -f ~/Documents/GitHub/ensign/.git/index.lock`. You cannot delete files on my Mac.

**Private preview artifact**: claude.ai/artifact/BJTy7Ceh1JMSeRBsUkwp9m. Update it by publishing to that URL, never create a second one.

## HOW WE WORK NOW. READ THIS BEFORE YOU EDIT ANYTHING

I run the site on my own machine and watch it live. No more screenshots for small changes.

```
cd ~/Documents/GitHub/ensign/archway-rebuild/phase-3/pages && python3 -m http.server 8080
```
then http://localhost:8080

The pages carry a dev only script that polls `dev-version.txt` and reloads the tab within about two seconds of a file changing. It only runs on localhost.

**The loop is: I say what is wrong, you edit the build scripts, rebuild, run the checks, commit the changed files plus `dev-version.txt` to my Mac, my tab reloads, I look.**

**Never hand edit the built HTML.** The pages are 100KB to 350KB with inlined fonts and base64 images. They are generated. Edit `phase-3/build/*.py` and run `rebuild_all.sh`. If you hand edit a page, the next rebuild silently destroys your work.

Take a screenshot only when you need to see something yourself, or when I am away from the machine.

## CURRENT STATE

**Locked**: Phase 1 information. Phase 2 research. Phase 3 content and design, revision 3.

The Home hero is locked as V6 after six layouts were built and compared:
- Andrew's photo, full colour with its own background, cropped to a circle with a thin indigo ring
- four chips drifting slowly around it: Reads your plan, Finds who has room, Sets up bookings, Comes to you. Every word already existed in the approved copy
- a dashed ring turning once per 70 seconds, soft indigo bubbles behind
- all motion stops under `prefers-reduced-motion`, and screen readers get one sentence instead of the chips
- the whole hero sits in a wide rounded panel with a soft gradient, on a page with a faint diagonal texture
- a dark glass card overlaps the circle carrying "Replies within 1 business day"
- the enquiry flow: questions 1 and 2 are plain buttons with no card and no progress bar, the card and progress bar appear only at the details step
- the flow sits in a fixed height box so the panel is exactly the same size on all three stages. Verified identical at 1024, 1280 and 1440
- the header is the original one: logo left, nav right with the phone link and a Refer someone outline button. I rejected a centred nav version.

All 7 pages pass axe-core WCAG 2.2 AA, no horizontal overflow at 390, 768, 1024, 1280, 1440, 1600, no console errors, and the enquiry flow has been clicked through on every step at every width.

## WHAT IS NOT DONE

**Ensign, design**
- Question 1 has only three buttons, so there is empty space at the bottom left of the hero panel. Two options I have not chosen: split the details stage into two so the fixed box gets shorter, or make the circle bigger so the right side sets the height. Ask me, do not guess.
- Heading sizes across Home run to four different values with no visible logic. Worth one tidy pass.
- The hero photo is a phone snapshot. It holds at 334px but a plain backdrop photo would be crisper. A Nano Banana prompt for this already exists in the last session, or Andrew reshoots against a blank wall.

**Ensign, content**
- Everything in `OPEN-ITEMS.md`: phone, email, service wording, signature, brush stroke, video, quotes, privacy details, lawyer sign off, the akku and Tamil check with Andrew.

**Ensign, build**
- Phase 4 has not started. Next.js on Netlify, Resend, server side lead storage, the admin page per `phase-4-inputs/admin-security-requirements.md`. Fonts and images served as cached files instead of inlined.
- Phases 5, 6 and 7 after that.

**The skills, which is the real deliverable**
- `website-phase-1-information` exists.
- `website-phase-2-research` exists.
- `website-phase-3-content-design` exists and has been updated through C46. **C47 to C50 are logged but not yet folded into it.** Do that early.
- Phases 4, 5, 6 and 7 skills do not exist yet.
- Skills are delivered with the `propose_skills` tool, which shows me a card I save. Read the existing SKILL.md in full first, then propose the complete updated file. Never hand me a .md to save myself.

## WHAT THE LAST SESSION GOT WRONG. DO NOT REPEAT IT

Read C41 to C50 in full. The four that cost the most time:

- **C50. Stop adjusting after two rejections.** I said the hero felt wrong twice. Three more rounds of tweaks followed before anyone built a genuinely different layout. When I reject the same thing twice: stop, build two or three real alternatives, show them side by side in one round, and ask me for a reference site. One screenshot from me settled more than three rounds of guessing.
- **C47. Never stretch or re-crop a photo to make a grid line up.** Fix evenness with line breaks, column ratios, type size and card widths.
- **C49. Scroll reveals must fail open.** An IntersectionObserver that does not fire left a whole section blank. There is now a 2 second safety timer.
- **When I give you a reference image, measure it.** Do not eyeball it. The last session matched the arrangement of a reference header but every element was about 50 percent too big, and I had to say "they are literally not the same". Crop the reference, measure heights and widths in pixels, build to those numbers, then show me a side by side at the same screen width.

## HOW TO START

Do these in order, then stop and ask me what I want to work on.

1. Read `claude/ensign-status.md` in the project.
2. Read the last ten entries in `SKILL-CORRECTIONS.md` on my Mac.
3. Read `phase-3/build/README.md` and confirm you can run `rebuild_all.sh` and `fullcheck.py` and that `fullcheck.py` prints CLEAN for all 7 pages. If it does not, tell me before changing anything.
4. Tell me in short dot points: what is locked, what is open, and what you think the next highest value move is.
5. Ask me one question: Ensign design polish, Phase 4 build, or writing the Phase 4 skill.

## HONESTY

- If something I ask for will make the site worse for an NDIS participant with low digital confidence, say so plainly before you do it, then do what I decide.
- If you cannot find a fact, say so and put a placeholder. Never fill a gap with something plausible.
- If a check fails, tell me which one and what it means. Do not bury it.
- If you think the last session made the wrong call on something, say it.
- Do not tell me a thing is finished until the checks have actually run and passed.
