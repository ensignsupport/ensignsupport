# Handover prompt: build the Ensign Support Services website (design v2)

Paste everything below the line into a new Cowork or Claude Code session. Attach the "Ensign Support" project and this design pack (unzipped).

---

## WHO AND WHAT

I am Allen, founder of Archway Automation (Brisbane). You are building the website for Ensign Support Services, my brother Andrew Manoba's NDIS business. It offers two services only: NDIS support coordination and psychosocial recovery coaching. It is in South East Queensland now, with potential to work Australia-wide later. It is an unregistered NDIS provider and works with self-managed and plan-managed participants only.

The visual design is finished and approved. Your job is to turn it into a working, accessible, production-ready website with a referral form, an enquiry form, and a private admin area to manage both.

## SOURCE OF TRUTH, IN THIS ORDER

1. **Design pack** (this folder). What every page looks like, at desktop and phone width, including the admin area.
   - Live design canvas, private: https://claude.ai/code/artifact/bf67ba77-18c6-49a3-aa98-b96786da2560
   - `design-source/*.dc.html`: the full markup and styles for every page. Desktop pages are fluid, and the `Mobile*.dc.html` files simply show the same page at 390px.
   - `previews/*.html`: the same pages as plain HTML you can open in a browser. The referral form and admin pages are frozen in one state here. Their real behaviour is in the `<script>` block of the matching `.dc.html` file.
   - `screenshots/desktop` and `screenshots/mobile`: every page and every referral form step.
   - `design-tokens.css`: colours, type, radii, spacing, breakpoints.
   - `images/`: the five photos used, plus `asset-map.json`.
2. **Final developer brief**: `source-documents/Ensign-website-developer-brief.pdf`. Its locked copy, compliance rules and form fields override anything else.
3. **Discovery questionnaire**: `source-documents/Ensign-discovery-questionnaire.docx`. Background only. Where it disagrees with the brief, the brief wins.
4. **Project docs** in "Ensign Support": `claude/archway-client-copy-and-claims-rules.md`, `claude/ensign-status.md`, `claude/SKILL-CORRECTIONS.md`.

**Important: an older design exists.** `claude/ensign-status.md` describes an earlier Phase 3 pack (Figtree font, circle portrait hero, "Ensign Support Coordination", "Replies within 1 business day"). Design v2 in this pack replaces that look and copy. Do not merge the two. Before you delete or reuse anything from the old pack on my Mac, ask me.

## STANDING RULES. NOT NEGOTIABLE

1. **Never invent a client fact.** No phone, email, hours, number, testimonial, credential, response time or outcome that is not in the brief. Anything unknown stays a visible placeholder such as `[PHONE]`.
2. **Hard rule, zero exceptions, everywhere (copy, code comments, commit messages, alt text): never use an em dash.** Use a period, a comma, "and", "but", or restructure.
3. **Australian English.** Brisbane time, AUD.
4. **Nothing is deployed, pushed or made public until I say "lock".**
5. **Talk to me in short, plain dot points.** Assume I have no technical background.
6. **Use a task list** for anything with more than two steps, and always end with a verification step.
7. **Never tell me something works until you have run it and checked it.** If a check fails, tell me which one and what it means.
8. **When I correct you, log it** in `SKILL-CORRECTIONS.md` (Wrong / Rule / Where / Date).
9. If the `aa-director` or `aa-build-phase-4` skill is available, follow it. This pack is the locked Phase 3 input.

## COMPLIANCE (FROM THE BRIEF. CHECK EVERY PAGE AGAINST THIS)

- Public name: **Ensign Support Services** (I confirmed this. The brief says "Ensign Supports". Use Ensign Support Services everywhere).
- Unregistered NDIS provider. Never imply registered or NDIA-endorsed. No NDIS logo.
- Self-managed and plan-managed only. No NDIA-managed option anywhere.
- No promised plan outcomes, funding or response times.
- About us is company level only. No director personal details.
- Services are support coordination and psychosocial recovery coaching only.
- Service area: South East Queensland now, Australia later.
- Referral form needs a collection notice beside it and a privacy policy link. The legal wording is not written yet.
- Vision, Mission, Values and the Why Ensign paragraph are word for word from the brief. Two approved changes: the name is "Ensign Support Services", and the long dash in the Why Ensign paragraph became a comma.

## PAGES

Five public pages plus two admin pages. Each one has a desktop and phone design.

1. **Home**
   - Split-screen hero: participant and coordinator on the same call.
   - Service teaser row, then four "What We Do" cards.
   - Values and the stats card.
   - The "Your Journey, Our Direction" referral band, then the footer.
2. **Services**
   - Two equal service cards with the brief's text, word for word.
   - A "We Work Alongside" strip and the referral band.
3. **About us**
   - Journey photo and the company paragraph with experience points.
   - Why Ensign card, then Vision and Mission cards.
   - Values with full sentences, then the referral band.
4. **Contact**
   - Phone, email, hours and ABN cards.
   - A general enquiry form, a "Making a Referral?" card and a service area card.
5. **Referral**
   - A step-by-step form with the collection notice beside it.
6. **Admin: Referrals**
   - Status summary cards and tabs, filters, search, sorting and a table.
   - A slide-in detail panel with status change, call and email buttons, and internal notes.
7. **Admin: Enquiries**
   - An inbox with status tabs, search and sorting.
   - A reading pane with a reply box and status change.

Shared parts:
- Header: logo, nav and an accent "Make a Referral" button. On phones it becomes a menu button.
- Footer: four columns with the Partner strip linking to archwayautomation.com.au. It has its own phone layout.
- The referral band.

## REFERRAL FORM (BEHAVIOUR IS IN `Referral.dc.html`)

Steps:
- Start: who is referring (participant, family member or carer, professional).
- 1: your details.
- 2: the participant.
- 3: service, plan type and reason.
- 4: consent and how they heard.
- Then a thank-you screen.

Rules:
- "Organisation and role" only appears for professionals. Self-referrers skip the participant contact fields.
- Continue is disabled until the needed choice is made. Send is disabled until consent is ticked.

Data to store, exactly the brief's fields:
- **Referrer:**
  - Name, organisation and role (optional), phone, email.
  - Relationship to the participant (participant, family or carer, professional).
- **Participant:**
  - Name, preferred contact if different (optional), phone, email, suburb and postcode.
- **Plan management:** self-managed or plan-managed.
- **Service:** support coordination, psychosocial recovery coaching, or both.
- **Reason:** brief text.
- **Consent:** boolean plus a timestamp.
- **How they heard:** optional.
- **Never collect:** NDIS number, diagnosis, Medicare details or file uploads.
- **Thank-you wording:** no response-time promise.
- **Validation:** real field validation and clear error messages. The prototype skips validation.

## ADMIN (BEHAVIOUR IS IN `AdminReferrals.dc.html` AND `AdminEnquiries.dc.html`)

**Referrals**
- Statuses: New, Contacted, In progress, Accepted, Closed.
- Filters: service, plan type, referrer type, status. Plus search, and a clear filters link.
- Sorting: newest, oldest, participant A to Z, status.
- Per referral: internal notes and a status history.
- Export CSV: design only so far. Confirm with me before building.

**Enquiries**
- Statuses: New, Replied, Closed. Search, and sorting by newest, oldest or unread first.
- Replies go out by email from Ensign's address, and the thread is stored.

**Security**
- The admin needs proper sign-in and must never be public.
- Follow `phase-4-inputs/admin-security-requirements.md` on my Mac.
- The sample data in the design is fake. Never ship it.

## BUILD NOTES

- **Stack:** earlier sessions planned Next.js on Netlify, Resend for email, and server-side storage for leads. The brief still lists hosting, CMS and the form backend as open. Confirm the stack with me before you scaffold anything.
- **Fonts:** Geist for everything, self-hosted. Caveat for the one hand-written note on the Home hero.
- **Styles:** use `design-tokens.css` exactly. Match spacing and sizes from the `.dc.html` source. Do not round to a framework default.
- **Accent colour:** #2236B5 is for Make a Referral actions only. That is deliberate, so referrals stand out.
- **Responsive:** breakpoints are 960, 760 and 600px. No sideways scroll at 390px.
- **Accessibility:**
  - Target WCAG 2.2 AA. The brief proposes 2.1 AA, so 2.2 AA covers it.
  - Real buttons, links and labels. A visible focus ring.
  - Motion stops under prefers-reduced-motion.
  - The phone menu needs a proper disclosure button with aria-expanded.
- **Images:** serve optimised, responsive images, not inlined.
- **Performance and SEO:** a title and meta description per page. Fast first load.
- **Copy:** keep every word from the design unless I change it. Check it against `archway-client-copy-and-claims-rules.md` and list any clashes for me. Do not fix them silently.

## DECISIONS I STILL NEED TO MAKE. ASK ME, DO NOT GUESS

- **Photos:** all five are AI-generated, including the man shown as the coordinator. The Archway claims rules say no images passed off as the client or their customers. Options: real photos of Andrew and consenting participants, or keep AI images with no implication they show real people.
- **Partner strip:** the claims rules say the footer credit is "Built by Archway Automation" and nothing more. I asked for the longer Partner strip. Keep it or shorten it?
- **Groups of three:** the claims rules prefer two or four items over three. Values (three) are locked by the brief. The three icon items in the referral band and the three referrer cards are my design. Flag them, I decide.
- **Stats:** "All ages supported" comes from the questionnaire, not the brief. Keep or remove?
- **Hours:** the questionnaire says 7am to 7pm, but the brief says hours are not supplied. Placeholder until Andrew confirms.
- **Headlines:** I wrote "NDIS Plans Made Clear", "Support That Works Together", "Helping You Navigate Your Journey", "Your Journey, Our Direction" and "Beside you, every step". Andrew should approve them.

## PLACEHOLDERS ANDREW MUST SUPPLY

Phone, email, hours, domain, privacy policy text, collection notice legal wording, social media links (or remove the icons), CRM or inbox choice. The ABN is supplied: 19 518 036 825.

## HOW TO START

Do these in order, then stop and report back:

1. Read this whole prompt, the brief PDF, and `claude/archway-client-copy-and-claims-rules.md`.
2. Open the design canvas and every screenshot. List each page, component and state you will build.
3. Read `phase-4-inputs/admin-security-requirements.md` on my Mac, if it is connected.
4. Give me, in short dot points:
   - The page and component inventory.
   - Your proposed stack and data model for referrals, enquiries, notes and status history.
   - Any copy or compliance clashes you found.
   - The questions above that block you.
5. Wait for my answers. Then build in milestones: foundation and tokens, shared header and footer, public pages, forms and email, admin with sign-in, then a full check at every breakpoint. Stop after each milestone so I can review.
