---
name: website-phase-1-information
description: Archway website factory, Phase 1 of 7. Validates, corrects and collects every fact a client website needs and produces a locked facts.md. Use when starting any new or rebuilt client website, or when the operator says "phase 1", "new website client", "client questionnaire", "fact register" or "facts.md".
---

# Website Phase 1: Information validation, correction and collection

Phase 1 of the Archway website factory. One job: every fact the website will use is collected once, checked, and written into one locked file, `facts.md`. Later phases may only use facts from that file.

## The factory (for context)

1. **Information** (this skill). Output: `facts.md`
2. Market, customer and design research. Ends with the client's closed-ended design pick
3. Content and design. Copy first, with a sign-off gate, then visuals
4. Build
5. Testing (Playwright and manual)
6. Showcase, feedback and corrections
7. Go live and hypercare

Never start a phase without the previous phase's locked output file.

## Rules for every step

1. **What the client wants wins.** Archway's copy and claims rules are guidelines for how we write and build. They are not limits on what the client may have. The only exception is the law: if a request has a legal or regulatory side (for example collecting health information, which brings in the Privacy Act), explain the obligation in plain English and record the client's explicit consent in `facts.md`.
2. **Never invent a fact silently.** No made-up promises, numbers, testimonials, response times, hours, qualifications or services. Every fact has a source.
3. **Placeholders are allowed when the client or Allen says so.** Tag them `PLACEHOLDER` so they cannot ship unnoticed.
4. **Write credentials and experience exactly.** Never round up years. Never upgrade a qualification name.
5. **No em dashes, anywhere.** Use a full stop, comma or "and" instead.
6. **Australian English**, Brisbane time, AUD.
7. **Go back to the client as little as possible.** Allen hesitates to go back to a client unless it is absolutely necessary. Capture as much as possible in the first questionnaire.
8. **Show work as files, not promises.** Every step produces a file the operator can open.

## Step 1. Intake fork

Ask the operator:

- Client business name and what they do, in one line
- Does the client have an existing website? (URL)
- Is there an earlier draft build or old copy? (folder, repo or URL)
- Who is the client contact? Who gives final approval?

Then scrape everything public about the business, **always, whether or not they have a website**. Use whatever web tools the session has (web fetch, Firecrawl, or the browser for pages that need scrolling or clicking).

**A. Their website (if they have one).** Pull every page:
- All pages and the menu structure
- All copy, word for word
- Services, prices, areas served
- Phone, email, address, hours
- Team names, roles, bios and qualifications
- Testimonials and stats
- Logo (highest quality file), colours (hex), fonts and images
- Forms and the fields they collect
- Any legal pages (privacy policy, terms)

**B. Everything else public.** Search and record:
- Google Business Profile: hours, phone, address, categories, photos, star rating, review count
- Reviews on Google, Facebook, directories and industry sites. Quote the exact wording and where it lives. Reviews are never used on the site without the client's permission.
- Facebook, Instagram, LinkedIn and any other social pages: handles, bio, services mentioned, photos
- Industry directories and registers (for example the NDIS provider finder, hipages, Oneflare, Yellow Pages)
- ABN Lookup (abr.business.gov.au): legal name, ABN, business names, status
- The owner's public professional profile (for example LinkedIn): roles and qualifications, used only to pre-fill questions the client confirms
- News or other web mentions

**C. Earlier draft build or old copy (if any).** List every fact and promise in it. Treat each one as unverified until the client confirms it.

For every fact, record the value, the source URL and the date seen. Where two sources disagree, record both. List what could not be captured and why (for example login walls, pages that would not load, images you cannot reuse).

Output: `capture.md` (facts found with source and date, conflicts between sources, what could not be captured, and unknowns). The unknowns drive the questionnaire, so the client is only asked to confirm what was found and fill what was not.

## Step 2. Questionnaire (first and main round)

Build one questionnaire that captures everything below. Use tick boxes wherever an answer can be a choice. Pre-fill anything Step 1 found and ask the client to confirm it rather than retype it. Plain, friendly, jargon free. Target: 30 minutes or less.

Deliver it as a Word document (read the docx skill first), then STOP until answers come back.

**Required fields** (skip only what truly does not apply):

Business
- Trading name, exact spelling
- Owner's full name as it should appear on the site
- Business structure and ABN
- Registrations, licences or accreditations the sector requires, and the exact current status of each
- Already trading, or starting on a date?

Services
- Each service: name, and 2 lines on what a normal week or job looks like for the customer
- Services they definitely do NOT offer (tick list of likely ones for the sector, plus Other)
- Who they serve: ages, customer types, conditions or job sizes
- Payment or funding types they accept (tick list)

Where and when
- Exact suburbs or regions they serve (tick list for the area, plus Other)
- How they deliver: at the customer's place, at their premises, remote or phone (tick all)
- Hours, with the days they apply to (tick: Mon to Fri, Mon to Sat, seven days, Other)
- How fast they reply to a new enquiry (tick: same business day, within 1 business day, within 2, don't show a time)

People and proof
- Years of experience, written exactly
- Past roles
- Exact qualification names
- Checks, screening and insurance held, and whether each may be shown on the site
- Languages spoken
- Photos of the owner or team: have them / will get them / none
- Testimonials or reviews with permission to use, and where they live
- Any numbers they can prove and are happy to publish

Brand and site
- Logo: have one and keep it / have one, open to change / none, want one designed
- Any fixed brand decisions (colours, names, taglines)
- Words, images or styles they definitely do NOT want (the only open design question here. Design choices happen at the end of Phase 2 as closed options)
- Pages wanted (tick list)
- Forms wanted, and every field each form must collect
- Domain: owned / being bought (which) / need suggestions
- Phone, email and social links to publish
- Existing legal pages (privacy policy, terms): have them / need them

Practical
- Target launch date or event, if any

## Step 3. Fact register and validation

Merge `capture.md` and the questionnaire answers into a register. Every fact gets one status:

| Status | Meaning | What to do |
|---|---|---|
| Confirmed | Client or Allen said it, or an official source shows it | Use it |
| Added | Appears in a draft build or old copy but nobody confirmed it | Confirm it or remove it |
| Conflict | Two sources disagree | Client's answer wins. Note the discrepancy |
| Placeholder | Client or Allen said to use one for now | Tag PLACEHOLDER. Must be signed off before go live |
| Open | Still unknown | Resolve with the order in Step 4 |

Validate these against official sources and cite the URL:

- Business name and ABN on ABN Lookup
- Any regulated claim (registration, licence, what can legally be offered without registration) on the regulator's own website, for example the NDIS Quality and Safeguards Commission, QBCC or AHPRA. Use secondary sites only when no official page exists, and label them as secondary.
- Legal obligations created by what the site will collect. For example, forms collecting health information mean the Privacy Act applies and a privacy policy is required.

## Step 4. Close the gaps, in this order

1. Research or public sources
2. Ask Allen or the operator
3. A placeholder the client signs off later
4. Save it for the Phase 6 showcase
5. A separate client follow-up, **only** for a legal or regulatory item that cannot wait

Fine details (exact wording, small promises) never justify a follow-up round. Settle them at the showcase.

If the site legally needs a page and the client has no lawyer's version yet (for example a privacy policy), get the client's consent to use a stop gap draft. Record that in `facts.md`. The draft itself is written in Phase 3, or earlier if Allen asks.

## Step 5. Write facts.md

Use this structure exactly:

```
# [Client]: Fact Register
Phase 1 output. Status: DRAFT or LOCKED (date)

## Open items
| # | Item | Why it matters | Owner or resolution |

## Business
| Fact | Value | Source | Status |

## Services
(same table, plus a "Not offered" row)

## Service promises
(bullet list, each confirmed by the client or Allen)

## Area and hours

## People, credentials and proof
(testimonials and numbers: say "none supplied" if none. Never invent)

## Contact and practical

## Forms and data collected
(fields per form, legal obligations, client consent recorded)

## Sources
(every URL used for validation)
```

Also render a simple HTML copy of `facts.md` for the operator to review in a browser.

## Step 6. Blind review

Spawn a reviewer agent that has not seen this conversation. Give it only `facts.md` and the raw questionnaire answers. Ask it to check:

- Every Confirmed fact truly appears in a source
- Nothing is invented or mis-tagged
- No gap the website would need is missing
- No em dashes

Output: a score out of 10 and a table: # | Gap | Evidence | Severity 1 to 5 | Fix. It must not manufacture problems.

Fix real issues. Do not show the reviewer's score as your own assessment.

## Step 7. Lock gate

Send the operator the HTML copy of `facts.md` and a 3 to 5 line summary:

- What was found
- What was added and removed
- The open items and who owns each
- The one decision needed

Then STOP. Wait for "lock". Changes loop back to Step 3. When locked, set the status line to `LOCKED (date)`. Phase 2 may start.

## Output files

- `capture.md`
- The questionnaire (.docx)
- `facts.md` (locked), plus its HTML copy
- Any stop gap legal draft, if Allen asked for it early
