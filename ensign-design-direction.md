# Ensign Support Coordination — Design Direction

**Prepared for:** Business Edified
**Date:** 7 September 2026
**Build target:** Next.js (App Router), JavaScript — no TypeScript
**Status:** Direction document. Not copy, not a logo, not production code.

Evidence tags used throughout: `[OBSERVED]` = seen on a page opened during this research · `[INFERRED]` = reasoning from observed patterns · `[ESTIMATE]` = educated guess with reasoning stated.

---

## Executive summary

Recommended direction: **Quiet Authority** — a warm oat-and-forest palette, a humanist serif for headings paired with Atkinson Hyperlegible for body, photography set *beside* text rather than behind it, and an unusually calm page rhythm. It reads as a considered professional practice rather than a care-sector template, and every colour pair clears WCAG AA by margin.

The three decisions that matter most:

1. **Put a three-card action row directly under the hero** — one card each for participants, families, and referrers. This is the only mechanism observed in the wild that serves both audiences without splitting the homepage in half.
2. **Make "Refer a participant" a header button, not a nav link.** Breakthru does this; nobody else in SEQ does. Referrers spend under a minute and should never have to hunt.
3. **Use photography beside text, never behind it.** Every reference that put headline copy over a photograph failed contrast. Every one.

Biggest risk: Ensign is one person with no testimonials, no track record and no registration. The design must carry all the credibility, and the temptation to overclaim will be strongest exactly where it is most dangerous.

---

## 1. Dribbble harvest — what worked and what didn't

### Access problem, resolved

`[OBSERVED]` Dribbble's `/search/` routes returned a "Human Verification" interstitial on first access. I do not complete CAPTCHAs. Tag pages (`/tags/ndis`, `/tags/disability`, `/tags/aged-care`) were reachable throughout and I worked from those; search access resumed later in the session and the harvest below draws on both.

### Query families that produced usable results

| Query | Verdict |
|---|---|
| `/tags/ndis` | `[OBSERVED]` 240 shots, but ~70% are NDIS **software dashboards** (one designer, Azmir Sheikh, accounts for most of them). Almost nothing for provider marketing sites. |
| `search/support-coordination` | `[OBSERVED]` Best single query. Surfaced three directly on-brief shots. |
| `web-design?q=disability care` | `[OBSERVED]` Strongest for actual website layouts. |
| `/tags/disability` | `[OBSERVED]` Dead end for web design — almost entirely editorial illustration. |
| `/tags/aged-care` | `[OBSERVED]` Dead end. Thin, mostly logos. |
| `web-design?q=accessible inclusive website` | `[OBSERVED]` **Complete dead end** — returned a bakery website and an LMS teacher dashboard. |

### The finding that matters most about Dribbble

`[OBSERVED]` **"Accessible" and "inclusive" are not concepts Dribbble indexes.** Searching those terms returns work that has nothing to do with accessibility. Dribbble ranks by likes, and likes reward visual novelty — low-contrast type, text over photographs, dense hero collages. For this brief that means Dribbble is useful for *palette and mood* and close to useless for *layout and legibility*. Every layout decision below is anchored on the live competitor teardown, not on the shots.

`[OBSERVED]` A second caveat: at least four of the shots reviewed are **perspective laptop mockups**, where the design is rendered at an angle. You cannot judge spacing, line length or contrast from these. They were used for palette only.

**Longlist opened: 12 Dribbble shots + 5 live provider sites.** Full appendix at the end. I did not pad to 25 — the usable pool genuinely isn't that deep for this niche, and inflating it would have meant citing shots I'd already ruled out.

---

## 2. Competitor teardown

Five live Australian providers, all opened.

| | **Breakthru** | **Hively Coordination** | **CaRelief** | **Access My Support** | **The Do Network** |
|---|---|---|---|---|---|
| **Nav structure** | Two-tier: utility bar (Funding, Feedback, Donate, Careers, phone) + main (Our services, Our locations, About us) | Single tier + hours/phone/email utility bar | Single tier with dropdowns | Single tier | Dual-level + breadcrumb |
| **Referrer path** | **"Referral" as an outline button in the header, beside "Contact"** | "Referrals" nav item | None — contact only | Downloadable PDF referral form | A dedicated on-page section, "NDIS Support Coordinators in Queensland", with its own intake link |
| **Hero** | Split: headline left, participant photography right in an arch crop | Full-width navy rounded card, headline only, **no CTA, no image** | Headline + body + founder portrait in a circle | Hero image + headline | Headline + service-area list |
| **Trust signals** | "25 years", "1000's of Australians", Registered NDIS Provider logo, Registered Charity badge, IEA provider badge | "Registered NDIS Provider 405 009 0586", expertise list, LGBTQIA2+ values statement | ABN, NDIS ID, Google rating widget (4.4★), founder photo | "NDIS Registered Provider" badge, org number, established 2018, founder named | "We are an NDIS registered provider", Medicare-registered clinicians |
| **Colour** | Plum/purple primary, coral–orange–yellow gradient underline accent | Deep navy card on white | Saturated blue, green-outlined CTA | — | — |
| **Type** | Heavy black display sans, custom brush underline | Geometric sans (Poppins-like), very large hero | Rounded humanist sans | — | — |
| **Two done well** | Referral promoted to a header button; real participant photography, not stock | Big readable hero type; hours in the utility bar | Founder's face above the fold — strongest single trust move seen; free-consultation offer | Founder named and dated (2018) | Referrers addressed in their own words, in their own section |
| **Two done badly** | Utility bar is a 10-item wall; accessibility overlay widget bottom-right | **Broken icon glyphs in the utility bar** (renders as `□`); hero has no call to action at all | **Four simultaneous overlays** — interstitial popup, cookie bar, Google review badge, accessibility widget — burying the hero | Referral form is a **PDF download**, not an online form | Nine service lines listed with no hierarchy |

### What the teardown tells you

`[OBSERVED]` **Every competitor with an NDIS registration number puts it in the header or hero.** Ensign cannot. That gap has to be filled by something else above the fold — see §9.

`[OBSERVED]` **Nobody in this set has a well-designed online referral form.** Access My Support makes referrers download a PDF. Breakthru and Hively link to a form page. CaRelief has none. An online referral form with document upload, done properly, is a genuine competitive advantage for Ensign — and it happens to be the one thing the client already specified in detail.

`[OBSERVED]` **Hively is exiting.** Their own page states they are closed for support coordination referrals and will exit the service line across 2026–2027. One of the three reference competitors is leaving the Brisbane market in the exact window Ensign is entering it. Worth raising with the client — it changes the positioning conversation, and it may free up referrer relationships.

`[OBSERVED]` The client-supplied Breakthru URL (`/services/ndis-support-coordination/brisbane/`) redirects to a generic `/services/` page. The Brisbane-specific page no longer exists.

`[OBSERVED]` **Two of five run third-party accessibility overlay widgets** (the floating blue accessibility icon). These are widely criticised in the accessibility community, do not achieve WCAG conformance, and have attracted litigation in other jurisdictions. Do not fit one to Ensign. Build it accessible instead.

---

## 3. Accessibility screen — rejection log

Applied before aesthetic selection, as briefed.

| Reference | Failed on | Why it mattered |
|---|---|---|
| *NDIS Support Coordination Web Ui Design* — Haris Suleman | Craft + unreadable | Perspective mockup with a literal **"Logo Here"** placeholder. Not a design, a template mock. |
| *Ncare NDIS Disability Care Landing Page* — Mehedii Mohammad | Colour semantics, density, microcopy | Alarm-red primary on desaturated photography. Red reads as *emergency* in a care context. Broken microcopy ("Click To Registered To Get NDIS Providers", "Leatest News"). |
| *NDIS Disability Service Website Design in Australia* — Abidul Islam Shaon | Type size, imagery | Body copy would render around 13px in dense four-paragraph blocks. Photography of prison bars. Grim, and wrong for a general-population provider. |
| *Peak Coordination* — B-YOND | Legibility, craft | Letterspaced centred body text, mid-sentence caps, and an unlicensed-Windows activation watermark baked into the export. **Palette retained, layout rejected.** |
| *Limitless Guidance* — Jai Vaidya | Contrast | Hero headline set in white directly over a photograph with no scrim. Amber on cream will not clear 4.5:1. **Structure retained, contrast approach rejected.** |
| *Inclusive Care* — Orbillo | Contrast, verifiability | Dark text over a peach→lilac→blue gradient; contrast changes across the hero. Perspective mockup, so layout is unverifiable. **Copy angle retained.** |
| *Tranquility Home Care* — Mid-Hudson Web | Contrast | Hero text over photography; small pale-blue buttons. **Three-card action row retained** — the single most useful structural idea found. |
| *Website for disability and age care support agency* — Svetlana Kuzibaeva | Partial — one failure | White on salmon `#E28C7E` ≈ 2.3:1 `[ESTIMATE]`, fails. **Remediation:** darken the button ground to `#A8451B` (white on it = 5.95:1) and keep everything else. Passes on every other criterion. |
| CaRelief (live) | Cognitive load | Four overlapping overlays over the hero. Textbook cognitive-load failure. |
| Hively (live) | Craft + task completion | Broken icon glyphs; hero with no action to take. |
| Breakthru (live) | Nav density | Ten items in the utility bar above the main nav. |

**Survived the gate with useful material:** Svetlana Kuzibaeva (in full, with the one fix), plus retained fragments from Limitless Guidance, Tranquility Home Care and Peak Coordination, plus the Breakthru header-button pattern and the CaRelief founder-portrait move.

---

## 4. Three directions

### Direction A — "Quiet Authority"

**Idea:** A considered professional practice. Warm oat ground, deep forest-teal, terracotta used sparingly. Serif headings, generous whitespace, photography beside text.

**Supported by:** Svetlana Kuzibaeva's oat/periwinkle/rose layout (text on solid blocks, photo beside, very large body copy); Peak Coordination's sage–terracotta–forest palette (a real Australian SC brand); Breakthru's header-button referral pattern.

**Signals to participants:** calm, unhurried, adult. Not clinical, not childish.
**Signals to referrers:** a practitioner who thinks carefully. Serif reads as considered rather than sales-driven.
**Risk:** serif headings can tip into "boutique law firm" if the type scale is too tight. Needs air.

---

### Direction B — "Warm Welcome"

**Idea:** Cream and amber, photography-led, a face above the fold. Rounded pill CTAs, an icon trust strip immediately under the hero.

**Supported by:** Limitless Guidance (cream + amber, badge pill in hero, four-icon trust strip); CaRelief's founder portrait above the fold; Tranquility Home Care's three-card action row.

**Signals to participants:** friendly, human, approachable. Lowest barrier to a first phone call.
**Signals to referrers:** less. Warmth is not the register referrers scan in.
**Risk:** amber-on-cream is the single hardest palette to get past AA — the reference itself fails it. And the closer this gets to the category norm, the more Ensign looks like every other provider.

---

### Direction C — "Plain and Clear"

**Idea:** Near-zero decoration. Off-white, near-black, one deep accent. Very large type, short lines, generous targets, no imagery in the hero at all. Cognitive load driven to the floor.

**Supported by:** `[INFERRED]` Nothing on Dribbble supports this — Dribbble does not reward restraint. It is inferred from the accessibility gate applied to what was rejected, and is closest in spirit to government service design.

**Signals to participants:** maximally usable. Nothing in the way.
**Signals to referrers:** competent but generic. Could be any agency.
**Risk:** with no logo, no photography and no track record, austerity reads as *unfinished* rather than *deliberate*. A brand-new sole trader cannot afford to look like a placeholder.

---

## 5. Recommendation — Direction A, "Quiet Authority"

**Why it beats B:** Warm Welcome optimises for the participant and effectively ignores the referrer. But referrers are where a pre-launch sole trader's first caseload actually comes from — participants self-referring to a provider with no reviews and no registration number is the hardest cold start there is. `[INFERRED]` Quiet Authority carries warmth in the palette while keeping a register that a hospital discharge planner takes seriously. B also picks the one colour relationship most likely to fail AA.

**Why it beats C:** Plain and Clear is the safest accessibility answer and the worst business answer for a business with nothing else to show. Restraint reads as authority only when the reader already knows who you are.

**What you give up by choosing A:**

- The serif adds a webfont and a real risk of looking precious if the build is sloppy. It needs discipline in the type scale.
- It is less immediately *friendly* than B. A participant's parent landing at 11pm may find B warmer.
- Oat-and-forest is less category-conventional. Some referrers pattern-match "NDIS" to blue. That is a cost, and it is the price of not looking like a template.

---

## 6. Design system

### 6.1 Palette — every ratio calculated

Calculated with the WCAG 2.x relative-luminance formula, `[OBSERVED]` computed rather than estimated.

| Token | Hex | Role |
|---|---|---|
| `--surface` | `#FBF8F3` | Page ground, warm off-white |
| `--surface-alt` | `#F1EBE0` | Alternating section bands, cards |
| `--surface-invert` | `#12332C` | Footer, one dark feature band |
| `--ink` | `#1B2422` | Body and heading text |
| `--ink-muted` | `#4C5A56` | Secondary text, captions |
| `--primary` | `#14544A` | Buttons, links, headings accent |
| `--primary-hover` | `#0D3C34` | Hover/active |
| `--accent` | `#A8451B` | Terracotta — sparing emphasis, active states |
| `--accent-soft` | `#F6E3D8` | Accent-tinted panels |
| `--border-input` | `#6F6555` | Form field borders |
| `--border-strong` | `#8A7F6C` | Card and divider borders |
| `--focus` | `#0B6BCB` | Focus ring |
| `--success` | `#1D6A45` | Form success |
| `--warning` | `#8A5A00` | Form warning |

**Measured contrast**

| Pair | Ratio | Verdict |
|---|---|---|
| `ink` on `surface` | **14.99:1** | AAA |
| `ink` on `surface-alt` | **13.39:1** | AAA |
| `ink-muted` on `surface` | **6.83:1** | AA body |
| `ink-muted` on `surface-alt` | **6.09:1** | AA body |
| `primary` on `surface` | **8.27:1** | AAA |
| `primary` on `surface-alt` | **7.38:1** | AAA |
| `accent` on `surface` | **5.61:1** | AA body |
| `accent` on `accent-soft` | **4.78:1** | AA body |
| white on `primary` | **8.76:1** | AAA |
| white on `primary-hover` | **12.26:1** | AAA |
| white on `accent` | **5.95:1** | AA body |
| white on `surface-invert` | **13.68:1** | AAA |
| `surface-alt` on `surface-invert` | **11.53:1** | AAA |
| `focus` on `surface` | **4.98:1** | AA body, clears 3:1 UI |
| `success` on `surface` | **6.20:1** | AA body |
| `warning` on `surface` | **5.59:1** | AA body |
| `border-input` on `surface` | **5.40:1** | Clears 3:1 for input boundaries (WCAG 1.4.11) |
| `border-strong` on `surface` | **3.72:1** | Clears 3:1 |

**One trap, and its fix.** `--focus` `#0B6BCB` measures only **2.59:1 against `--surface-invert`** — it disappears in the footer. Do not solve this with a second focus colour; solve it with a halo that works on any ground:

```css
:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 5px var(--surface); /* light halo separates ring from dark grounds */
}
```

The halo (`--surface` `#FBF8F3`) measures **12.91:1** against the dark ground, and the blue ring against that halo measures **4.98:1**. The ring is visible on every surface in the system.

**Dark mode: do not build it.** `[INFERRED]` For a five-page brochure site owned by a sole trader, a second theme roughly doubles the contrast-verification surface and the maintenance burden for a feature the audience mostly gets from OS-level reader tools anyway. Ship light only, and set `color-scheme: light` explicitly so the browser doesn't invent a dark treatment for form controls. Revisit if the site grows a participant portal.

### 6.2 Type

**Headings — Fraunces** (Google Fonts, variable, soft serif). Warm without being decorative, and it has a *soft* optical axis that avoids the cold authority of a classical serif. **Use at 24px and above only** — it loses legibility small.

**Body — Atkinson Hyperlegible** (Google Fonts). Designed by the Braille Institute specifically for low-vision readers: exaggerated letterform differentiation so `I`/`l`/`1` and `O`/`0` cannot be confused, open apertures, unambiguous punctuation. For a disability services site this is not a style choice, it is a defensible functional one — and it is a line you can say out loud to the client.

`[ESTIMATE]` Risk to check at build: Atkinson ships a narrower weight range than a typical UI sans and has a large x-height, so the visual size at a given px is bigger than Inter. Set the scale by eye against real copy, not by number. **Fallback if it reads too quirky at length:** Source Sans 3.

```
--font-display: "Fraunces", Georgia, serif;
--font-body: "Atkinson Hyperlegible", "Source Sans 3", system-ui, sans-serif;
```

**Scale** (rem, 1rem = 16px base; never set body below 1rem)

| Step | Size | Line height | Use |
|---|---|---|---|
| Display | 3rem / 2.25rem mobile | 1.1 | Hero headline |
| H1 | 2.25rem | 1.15 | Page title |
| H2 | 1.75rem | 1.25 | Section heading |
| H3 | 1.25rem | 1.35 | Card heading |
| Body-lg | 1.25rem | 1.6 | Hero subhead, intro paragraphs |
| Body | 1.125rem | 1.65 | Default body — **18px, deliberately above the 16px floor** |
| Small | 1rem | 1.55 | Captions, form help text |

**Max line length: 65 characters** (`max-width: 65ch`). Non-negotiable — it is the single highest-leverage cognitive-load control on the page.

### 6.3 Spacing, radius, borders

- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Section vertical rhythm:** 96px desktop, 64px mobile. Generous. Air is the point.
- **Radius:** `--r-sm: 8px` (inputs, small chips), `--r-md: 16px` (cards, buttons), `--r-lg: 28px` (hero and feature panels). The large radius is where the warmth lives — Hively's rounded hero card is the one thing it does well.
- **Elevation:** one shadow only — `0 2px 8px rgba(18,51,44,0.08)`. Cards are separated by ground colour and border, not by stacked shadows.
- **Borders:** `1px solid var(--border-strong)` on cards; `2px solid var(--border-input)` on form fields (2px because thin borders vanish for low-vision users).

### 6.4 Motion

**Allowed:** opacity and 8px translate on section entry, 150ms ease-out; colour transitions on hover/focus, 120ms.
**Banned:** parallax, scroll-jacking, autoplay video, animated backgrounds, count-up number animations, carousels that advance on their own.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.5 Imagery

**Decision: photography, used sparingly, always beside text and never behind it.** `[OBSERVED]` Every reference that put headline copy over a photograph failed the contrast gate — Limitless Guidance, Tranquility, Ncare, the Abidul Islam Shaon shot. Svetlana Kuzibaeva's layout, which sets type on a solid colour block *next to* the photo, was the only photographic approach that survived.

**The launch problem:** no logo, no team photos, no participant photos, no consent to use any. So at launch the site runs on stock, and stock disability photography carries a specific failure mode — the pitying portrait, the hand-on-shoulder, the wheelchair user photographed from above. That reads as tokenistic to the exact audience it is aimed at.

**Three stock briefs, written to avoid it:**

1. *Two adults at a kitchen table, one with a visible disability, both looking at the same laptop or paperwork.* Eye level. Neither person is being helped by the other — they are working on something together. Use in the About or "how it works" section.
2. *A person with a disability out in their own neighbourhood* — a bus stop, a shopping strip, a park path — doing an ordinary thing, unaccompanied, in natural light. Australian street furniture and vegetation if you can find it. Use in the hero.
3. *Hands and documents on a desk, no faces* — a plan, a notebook, a phone. Warm daylight. This one is the safety valve: it carries the "we handle the paperwork" idea with zero representation risk. Use on the Referral page.

**Rules:** eye level always, never shot from above. No one is being assisted in frame unless assistance is the literal subject. Ordinary clothes, ordinary settings. Australian where possible.

**Budget note:** `[ESTIMATE]` three or four licensed stock images from a mid-tier library will run roughly AU$60–200 depending on source and licence; free libraries (Unsplash, Pexels) have thin and often stereotyped disability collections. Flag the cost rather than assuming it away. Commissioned photography of the operator, once he has been running a few months, will beat all of it — plan for a swap at month 6.

**Illustration:** use it for process and structure only (a three-step "how referral works" diagram), in flat single-colour line work from the same palette. Never illustrate people — illustrated disability drifts into infantilising fast.

### 6.6 Iconography

**Lucide** — MIT licensed, free, consistent 24px stroke grid, tree-shakeable via `lucide-react`. Use at 24px minimum, always with a visible text label, never colour-coded alone. Stroke weight 1.75.

---

## 7. Page-by-page direction

### 7.1 Home — and how it resolves the two-audience problem

**The mechanism: a three-card action row directly beneath the hero.** `[OBSERVED]` Adapted from Tranquility Home Care, which places three action cards ("Submit Your Referrals" / "Set An Appointment" / insurance) immediately under the hero — the only pattern found that gives a referrer a first-class path without demoting the participant.

**Why it beats the alternatives:** A dual-path split hero (two big buttons, "I'm a participant" / "I'm a referrer") forces a self-identification most people don't want to make and halves the hero's impact. A referrer strip in the footer is invisible to someone who scans for 60 seconds. A secondary nav entry is where Hively put it, and it reads as an afterthought. Three cards under the hero puts all three intents in the first scroll, at equal weight, in plain language.

**Section stack:**

1. **Header** — logo left; nav (Home, About, Services, Contact); **"Refer a participant" as a filled button** and phone number as a visible link, both right. The referral button is the Breakthru move, and no other SEQ provider does it.
2. **Hero** — headline (≤10 words), subhead (≤30 words), one primary CTA. Photo *beside*, on a `--surface-alt` block. Include the honest status line here (see §9).
3. **Three action cards** — *New to us? Start here* (participants) · *Referring someone?* (referrers) · *Call us — 7am to 7pm* (everyone). One sentence each, one action each.
4. **What Ensign does** — two services, side by side, ~60 words each, plain language. Heading intent: what it *is*, not what it's *called*.
5. **Who this is for** — plan-managed and self-managed, all ages, all disability types, SEQ. This section exists to let people rule themselves in or out fast. ~80 words.
6. **How it works** — three steps, illustrated diagram. ~25 words per step.
7. **Credentials strip** — the permitted trust signals as an icon row (see §9).
8. **Closing CTA** — phone, referral, contact. `--surface-invert` band.
9. **Footer** — contact, hours, coverage, ABN, business name, NDIS Code of Conduct reference, privacy link.

**Mobile:** action cards stack full-width; hero photo drops *below* the text, not above — text first is the accessibility-correct order and the conversion-correct one.

### 7.2 About

Stack: page title → the operator, first person, with a portrait once one exists → the three values as prose, not icon cards (Compassion/Integrity/Advocacy are the differentiator; icon cards flatten them) → credentials and screening → coverage and expansion → CTA.

`[INFERRED]` This page carries more weight than usual, because it is the only place the business's credibility actually lives. Give it real word count — 400–600 words — not the usual thin About page.

### 7.3 Services

Two services, each a full section: what it is in plain language, what a first month looks like, who it suits, one CTA. Then a short "what we don't do" note — the client left this blank in the questionnaire, but referrers value it highly and it prevents wasted referrals. **Flag to client: this needs an answer.**

Explicitly state plan-management eligibility here: self-managed and plan-managed, and that NDIA-managed participants need a registered provider. Being upfront about it reads as competence, not as a limitation.

### 7.4 Referral

Its own page, linked from the header button. Above the form: a two-sentence statement of what happens after submission and how fast. Then the form (see §8). Then a fallback — phone and email — because some referrers will always prefer to call, and forcing a form loses referrals.

### 7.5 Contact

Phone (a `tel:` link, large, first), email (`mailto:`), hours (7am–7pm), coverage area, and a short enquiry form — name, contact, message, and nothing else. **Keep it distinct from the referral form.** Merging them is the most common mistake here: it makes a participant's simple question feel like a clinical intake.

---

## 8. Referral form UX

The locked field list is long, sensitive and document-heavy. Treat it as a professional tool, not a contact form.

### Steps

Three steps with a visible progress indicator ("Step 2 of 3"), not one long scroll and not a wizard that hides what's coming:

1. **About you** — referrer name, phone/email, role, organisation. Short, builds momentum.
2. **About the participant** — name, DOB, plan dates, service requested (radio, two options), plan management type (radio, two options). **Put the plan-management question early**, and if NDIA-managed is ever added as an option, branch immediately rather than letting someone complete a form they aren't eligible for.
3. **Documents and notes** — upload field, free-text box, consent statement, submit.

Self-referring participants and families will land here too. Add a plain-language line at the top: *referring yourself or a family member? Fill in your own details as the referrer.* `[INFERRED]` Otherwise the word "organisation" stops them dead.

### File upload

The hard part. NDIS plans, functional capacity reports and OT reports are large PDFs, often scanned, sometimes 20MB+, frequently attached from a phone over patchy reception.

- Accept multiple files. State the limit and accepted types **before** the picker, not in an error afterwards.
- Per-file progress with a cancel affordance, and per-file error states — one failed upload must never discard the other four.
- Never block submission on upload. Offer *submit now, email documents to us* with a reference number as the fallback. Losing a referral because a scan timed out is the worst outcome available.
- Drag-and-drop is a desktop enhancement only. The button must be a real `<input type="file">` and reachable by keyboard.

### Validation, errors, resume

- Validate on blur, never on keystroke. Announce errors in a `role="alert"` live region and move focus to the first invalid field on submit.
- Plain-language messages: *"We need a phone number or an email so we can get back to you"* — not *"Invalid input."*
- **Save/resume without a backend:** keep step 1 and 2 values in `sessionStorage` so a browser back-navigation or accidental refresh doesn't wipe the form. Do **not** persist to `localStorage` — this is health-related information about a third party sitting on a shared or clinic computer. Clear on successful submit. `[INFERRED]`

### Consent and privacy — needs professional review

Place a short collection notice **immediately above the submit button**, not buried in a footer link, with a required consent checkbox confirming the referrer has the participant's consent to share their information.

**This is the highest-risk area of the build and it needs professional review, not my wording.** `[OBSERVED]` The form collects health-related information about a third party who is not present: NDIS plans, functional capacity reports, allied health and OT reports. Under Australian privacy law that is a sensitive-information category with specific handling obligations, and the participant has not consented directly — the referrer is asserting consent on their behalf.

What the client needs to resolve before launch, with someone qualified:

- The wording of the collection notice and the consent checkbox.
- Where uploaded documents are stored, in which country, and who can access them.
- How long they are retained and how they are destroyed.
- Whether a privacy policy is required and what it must say.
- Whether an unregistered provider carries additional obligations here.

Do not let the build ship without these answered. Do not draft them yourself.

### Confirmation

A real confirmation page, not a toast. State what was received, what happens next, the expected response time, a reference number, and the phone number. Send a copy to the referrer by email.

---

## 9. Trust without testimonials

No reviews, no case studies, no team, no track record, no registration number. Everything the competitors lean on is unavailable. Here is what carries the weight instead.

**1. Radical specificity.** Vagueness reads as inexperience; precision reads as competence. "7am–7pm, seven days" beats "flexible hours". "South East Queensland, in person" beats "servicing the community". "We respond to referrals within one business day" beats "prompt service". `[INFERRED]` Specificity is the cheapest credibility available to a business with no history, and it is the one lever that costs nothing but nerve.

**2. The credentials strip.** The permitted signals, as an icon row with text labels, on the homepage and repeated on About:

> NDIS Worker Screening Check · Blue Card · Police Check · Mental Health First Aid · First Aid & CPR · Public liability insurance

Plain text, no invented badge graphics, no shield icons implying third-party certification.

**Do not display professional indemnity insurance.** It is not held. Do not display anything that implies NDIS registration or NDIS Practice Standards certification.

**3. The registration status line.** Place it in the hero, as a single plain sentence in `--ink-muted` at Small size:

> **Recommended:** *"Ensign is an unregistered NDIS provider, working towards registration. We support self-managed and plan-managed participants."*

Volunteering the limitation *and* immediately answering the reader's next question ("so can you help me?") is what turns it from a red flag into a signal of straight dealing. Pair it with a short FAQ item on the About page explaining that support coordination and psychosocial recovery coaching can be legally delivered unregistered to self- and plan-managed participants.

**Wording that would cross the line — do not use any of these:**

- ❌ "NDIS registered" or "Registered NDIS provider" — false.
- ❌ "NDIS approved", "NDIS accredited", "NDIS certified" — implies a status that doesn't exist.
- ❌ "Fully insured" — public liability only; the phrase implies complete cover.
- ❌ "NDIS Practice Standards compliant" — compliance has not been assessed.
- ❌ A "Registration coming soon" badge styled to look like an accreditation mark. `[INFERRED]` The client's own phrase is honest as a *sentence*; rendered as a badge it borrows the visual authority of the thing it is admitting not to have. Keep it as text.
- ⚠️ "Registration coming soon" on its own implies a timeline. If registration slips, the site is making a promise it isn't keeping. **"Working towards registration"** is safer and needs no maintenance.

**4. The face.** `[OBSERVED]` CaRelief's single strongest move is the founder's photograph above the fold. For a solo operator this is the highest-value asset available and it costs one afternoon. **Recommend to the client: get a professional headshot before launch.** A named, visible human outperforms every badge on the page.

**5. The referral form itself.** A well-built intake form with document upload signals operational competence to a referrer more effectively than any claim. It is the demo.

---

## 10. Next.js implementation notes — JavaScript, no TypeScript

### Routes

```
app/
  layout.js                 # fonts, header, footer, skip link
  page.js                   # Home
  about/page.js
  services/page.js
  referral/page.js
  contact/page.js
  not-found.js
  globals.css               # tokens + reset
  api/
    referral/route.js       # POST handler (see below)
    enquiry/route.js
```

Five static routes. No route groups, no dynamic segments, no middleware. Keep it boring.

### Components

| File | Type | Note |
|---|---|---|
| `components/SiteHeader.js` | **Client** | Mobile menu toggle needs state |
| `components/SkipLink.js` | Server | First focusable element in `<body>` |
| `components/Hero.js` | Server | |
| `components/ActionCards.js` | Server | The three-card row |
| `components/ServiceBlock.js` | Server | |
| `components/CredentialsStrip.js` | Server | |
| `components/HowItWorks.js` | Server | Inline SVG diagram |
| `components/CtaBand.js` | Server | |
| `components/SiteFooter.js` | Server | |
| `components/ReferralForm.js` | **Client** | Steps, validation, uploads |
| `components/EnquiryForm.js` | **Client** | |
| `components/FileUploadField.js` | **Client** | |
| `components/FormField.js` | **Client** | Label, error, describedby wiring |
| `components/RouteAnnouncer.js` | **Client** | Focus + announce on navigation |

Only the header, the forms and the announcer are Client Components. Everything else stays server-rendered — the whole marketing surface ships with almost no JavaScript.

### Tokens: CSS custom properties, not a Tailwind config

**Recommendation: plain CSS custom properties in `globals.css`, with CSS Modules for component styles.** `[INFERRED]` The justification is maintenance by a solo operator: tokens in `:root` are readable and editable by anyone who can open a stylesheet, including the client, and they survive a framework change. Putting them in `tailwind.config.js` means every colour tweak is a build-config edit, and the utility-class markup is materially harder for a non-specialist to read six months later. This site has five pages and no design-system scale problem — Tailwind's payoff doesn't arrive.

If Business Edified's house standard is Tailwind, the compromise is: define the tokens as CSS variables in `globals.css` and reference them from the Tailwind theme, so there is exactly one source of truth.

### What needs client-side JS, and what must not

**Needs it:** mobile nav toggle; form step state; file upload progress; client-side validation (as an enhancement over server validation, never instead of it); route-change focus management.

**Must not have it:** every marketing section. No scroll-triggered reveals gated on JS — if a reveal animation is used, the default state must be *visible*, with the animation applied only when JS runs and `prefers-reduced-motion` allows. Content that is invisible until JS loads is a hard accessibility failure and an SEO one.

### Form submission with file uploads on a static host

| Option | Trade-off |
|---|---|
| **Netlify Forms** | Simplest. Handles file uploads natively. But submissions and clinical documents live in Netlify's system — needs a data-residency and retention answer before it touches health information. |
| **Next.js route handler + object storage** (R2/S3, presigned upload) | Most control over residency, retention and access. Most build effort, and needs a host that runs server routes. |
| **GoHighLevel form + workflow** | `[INFERRED]` Given Business Edified already runs a GHL agency, a sub-account form gives the client a CRM, notifications and follow-up automation for free — a real advantage over a form that just emails. Cost: an embedded GHL form is an iframe you cannot style or fully control for accessibility. **Middle path: build the form in Next.js to this design system, POST to a GHL webhook, upload documents separately to storage, pass the links through.** Best of both, and it fits the studio's existing stack. |
| **Formspree / Basin** | Fast, but a third party holding health documents with no residency guarantee. Weakest option here. |

`[INFERRED]` Recommended: **custom form → route handler → GHL webhook + object storage.** Decide before build, because it changes the form component's submit path.

### Fonts and images

```js
import { Fraunces, Atkinson_Hyperlegible } from 'next/font/google'
```
`display: 'swap'`, subset `latin`, self-hosted automatically by `next/font` — no render-blocking third-party request and no layout shift. Give both a real fallback stack.

Use `next/image` with explicit `width`/`height`, `priority` on the hero image only, and meaningful `alt` on every content image (`alt=""` on decorative ones). AVIF/WebP by default.

### The accessibility details that get missed

1. **Skip link** — first focusable element, visually hidden until focused, targets `<main id="main" tabindex="-1">`.
2. **Focus management on route change** — App Router does not move focus on navigation. `RouteAnnouncer` must focus the `<h1>` (or `<main>`) and announce the new page title in a live region. Screen reader users are otherwise stranded.
3. **Form error announcement** — `role="alert"` container, `aria-invalid` on the field, `aria-describedby` pointing at the error text. Move focus to the first error on submit.
4. **Heading hierarchy** — exactly one `<h1>` per page, no level skips. Card titles are `<h3>` under a section `<h2>`.
5. **Landmarks** — `<header>`, `<nav aria-label="Main">`, `<main>`, `<footer>`. If a second nav exists, label both.
6. **Targets** — 44×44px minimum, including the phone link in the header.
7. **Language** — `<html lang="en-AU">`.
8. **Reduced motion** — the media query in §6.4, applied globally.
9. **`color-scheme: light`** declared, so form controls aren't auto-inverted.
10. **No accessibility overlay widget.** `[OBSERVED]` Two of five competitors run one. Do not copy them.

---

## Challenges to the brief

Four assumptions worth pushing back on. Take them to the client.

**1. "No blog" is the wrong call — and it is the assumption I'd challenge hardest.** `[INFERRED]` A brand-new domain with five pages, no backlinks and no history has almost nothing for Google to rank. Ensign's competitors have years of domain authority. Meanwhile the actual search demand in this niche is informational — people search *"what does a support coordinator do"*, *"can I change support coordinator"*, *"what's the difference between plan managed and self managed"* — and those questions are exactly what a support coordinator is expert in. Five or six genuinely useful articles would do more for the September launch than any design decision in this document. The client said no because a blog sounds like a content treadmill; the honest framing is six evergreen pages written once, not a weekly commitment.

**2. "Mild, warm and welcoming" is right for participants and incomplete for referrers.** `[OBSERVED]` The referrer-facing surfaces on every site reviewed run in a more clinical register — capacity, coverage, screening, intake. Warmth is the homepage's job; the Referral page should be crisper and faster, and that is not a contradiction.

**3. Five pages may be one short.** `[INFERRED]` "For Referrers" was in the questionnaire's suggested list and the client dropped it. The three-card row plus a header button handles it for launch. But if referrals become the main channel — which for a pre-launch sole trader they probably will — a dedicated referrer page (capacity, coverage, what you need to send, response time) is the first page to add. Build the information architecture so it slots in without a rework.

**4. Get the headshot.** The client answered "no" to team photos. `[OBSERVED]` The single strongest trust element found anywhere in the competitor set was CaRelief's founder portrait above the fold. For a one-person business with no testimonials, a face is not a nice-to-have. This is the cheapest, highest-return item on the pre-launch list.

---

## Reference appendix

Every URL below was opened during this research. Nothing is cited from memory.

### Dribbble

| Title | Designer | URL | Contributes | Accessibility caveat |
|---|---|---|---|---|
| Website for disability and age care support agency | Svetlana Kuzibaeva | `dribbble.com/shots/25447652-Website-for-disability-and-age-care-support-agency` | **Primary layout reference.** Text on solid colour blocks beside the photo; very large body copy; oat/periwinkle/rose | Salmon CTA ≈2.3:1 `[ESTIMATE]` — darken the ground |
| Limitless Guidance — NDIS Provider Branding | Jai Vaidya | `dribbble.com/shots/27443239-Limitless-Guidance-NDIS-Provider-Branding-NGO-UI-UX` | Hero status **pill badge**; four-icon trust strip; cream + amber | White headline over photo, no scrim; amber on cream |
| Peak Coordination | B-YOND | `dribbble.com/shots/23272524-Peak-Coordination` | Sage/oat + terracotta + forest green — a real AU support coordination brand | Letterspaced centred body; Windows activation watermark in the export |
| Tranquility Home Care — Senior Care Web Design | Mid-Hudson Web | `dribbble.com/shots/26106643-Tranquility-Home-Care-Senior-Care-Web-Design` | **The three-card action row under the hero** — the key structural idea | Hero text over photo; small pale-blue buttons |
| Inclusive Care — Healthcare & Disability Support | Orbillo | `dribbble.com/shots/27680183-Inclusive-Care-Healthcare-Disability-Support-Website-UI-UX` | Copy angle: *"Support built around the person, not the paperwork"* | Dark text over multi-hue gradient; perspective mockup |
| NDIS Disability Service Website Design in Australia | Abidul Islam Shaon | `dribbble.com/shots/23153706-NDIS-Disability-Service-Website-Design-in-Australia` | Rejected — kept as a density counter-example | ~13px body in dense blocks; grim imagery |
| Ncare NDIS Disability Care Landing Page | Mehedii Mohammad | `dribbble.com/shots/22054840-Ncare-NDIS-Disability-Care-Landing-Page` | Rejected — the "red as primary" counter-example | Alarm red; broken microcopy |
| NDIS Support Coordination Web Ui Design | Haris Suleman | `dribbble.com/shots/20283898-NDIS-Support-Coordination-Web-Ui-Design` | Rejected — template mock | "Logo Here" placeholder |

Also surfaced and reviewed in listings but not opened individually: *Carehood — NDIS provider all pages* (osenorth.), *TriCollective* homepage and logo set (Kel Corbett), *NDIS Youth Support Logo & Brand Identity for Cloud 9* (Red Kite Design), *NDISEE — NDIS Disability React Next JS Template* (ordainit), *UX/UI design for a disability care web service* (Polinas), *Trails for All*.

### Live Australian providers

| Site | URL | Contributes |
|---|---|---|
| Breakthru | `breakthru.org.au/services/` | **"Referral" as a header button** beside "Contact"; real participant photography |
| Hively Coordination | `hivelycoordination.com.au/ndis-support-coordination/` | Rounded hero card; **exiting support coordination 2026–27** |
| CaRelief | `carelief.com.au/ndis-support-coordination` | **Founder portrait above the fold**; four-overlay counter-example |
| Access My Support | `accessmysupport.com.au` | PDF-download referral form — the gap Ensign can beat |
| The Do Network | `thedonetwork.com.au/ndis-services/ndis-support-coordination` | A dedicated on-page section addressing support coordinators |

---

## Open questions for the client

Blank or unresolved in the questionnaire, and needed before or during build.

1. **Phone number and business email.** Not supplied. Blocks the header, footer and Contact page.
2. **Domain.** Not secured. `ensign.com.au` availability unchecked — needs doing now, not in September.
3. **What each service looks like day-to-day.** Left blank. This is the body copy of the Services page.
4. **What Ensign deliberately does *not* offer.** Left blank. Referrers use this to avoid wasting a referral.
5. **Plan-management types.** Section 1 says self- and plan-managed; Section 3's question was left blank. Confirm the site states self- and plan-managed only.
6. **Specialisation.** Left blank. "All ages, all disability types" is honest but undifferentiated — is there anything he wants to be known for?
7. **Words or styles to avoid.** Left blank.
8. **Headshot.** Will he sit for one before launch? Changes the Home and About design materially.
9. **Social profiles.** None supplied — omit the footer social row entirely rather than leaving dead icons.
10. **Google Business Profile.** Not set up. Needed for local search before September.
11. **Privacy, consent and document retention.** See §8 — needs professional review, not a design decision.
12. **Form backend.** Netlify Forms, GHL webhook, or custom storage — decide before the form is built.
13. **Budget.** Not supplied. Affects stock photography, headshot, and whether the blog in "Challenges" is viable.
14. **Response-time commitment.** If the site says "within one business day", the client has to mean it.
