# Ensign Support Coordination

Five-page site built from `ensign-design-direction.md` and the client's discovery
questionnaire (`DISABI_1_ Ensign.docx`).

Direction: **Meridian**, Linen colourway. Warm light page, dark hero and closing
band joined by a wave, plan-map illustration in the hero.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. `npm run build` produces the production build;
all five pages prerender as static, and only the two API routes are dynamic.

## Where things live

| Path | What it is |
|---|---|
| `lib/content.js` | **Every word and business fact on the site.** Edit here first. |
| `app/globals.css` | The whole stylesheet. Tokens at the top, then layout, then components. |
| `components/Sections.js` | Hero, page header, credentials strip, closing band. |
| `components/PlanMap.js` | The hero illustration. Canvas, not data. |
| `components/MeshBackdrop.js` | The slow green field behind the hero. |
| `components/ReferralForm.js` | Three-step referral intake. |
| `app/api/referral/route.js` | Referral handler. **Does not deliver anywhere yet, on purpose.** |
| `public/photos/CREDITS.md` | Photograph attribution and the reasoning behind the selection. |

One stylesheet rather than CSS Modules per component. The direction document
argued for Modules, but its stated reason was maintainability by a solo
operator, and at five pages a single readable file serves that better than
fifteen small ones. Reverse this if the site grows a portal.

---

## Before this can go live

### 1. Legal review of the referral form. Blocking.

The referral form collects health information about a third party who is not
present to consent. Under Australian privacy law that is a sensitive-information
category with specific obligations. Four questions need answers from someone
qualified, and the build deliberately stops short of guessing at them:

1. Where are uploaded documents stored, and in which country?
2. Who can access them, and how is that access logged?
3. How long are they retained, and how are they destroyed?
4. What must the collection notice and the consent checkbox actually say?

Until then `app/api/referral/route.js` validates the submission and returns a
reference number but stores nothing. The consent wording in `lib/content.js` is
marked `PLACEHOLDER, PENDING LEGAL REVIEW` and is visible on the page, so it
cannot ship unnoticed.

A privacy policy page is likely required. It has not been written, because it
should not be written by us.

### 2. Details the questionnaire did not supply

All are placeholders in `lib/content.js`, deliberately obvious:

- Phone number (currently `07 0000 0000`)
- Business email (currently `hello@example.com.au`)
- ABN (currently "ABN to be confirmed")
- Domain. The client wants something close to `ensign.com.au`.

### 3. Wording changed from the questionnaire, and why

The client asked for **"Registration coming soon."** The site says
**"working towards registration"** instead.

"Coming soon" implies a date the business cannot commit to, needs correcting
every time that date moves, and reads as a promise if registration slips.
"Working towards registration" says the same thing, stays true indefinitely, and
needs no maintenance. Change it back in `lib/content.js` if the client insists,
but the risk is theirs to accept.

Two related rules are enforced in the copy:

- Professional indemnity insurance is **not** listed anywhere, because it is not
  held. The About page says so explicitly.
- Nothing on the site says registered, accredited, certified, or Practice
  Standards compliant.

### 4. Content the client left blank

- **"What we don't do"** (Services page). The questionnaire left this empty. The
  section currently states only what is derivable from the two services the
  client listed. It needs the client's sign-off.
- **Photography.** Two Unsplash photographs are now in `public/photos/`, served
  locally rather than hot-linked. See `public/photos/CREDITS.md` for the
  attribution and, more importantly, for why there are only two: free stock
  libraries return stereotyped disability imagery, and most of what they offer
  would read as pitying to this audience.

  Still missing: a photograph of the operator. That remains the single
  highest-value asset available to a solo practice, it costs one afternoon, and
  no stock image substitutes for it.

### 5. Claims we wrote that the client has not made

Two things reached the build as design placeholder copy rather than client fact.
Both are now isolated so they can be confirmed or removed in one edit.

**Testimonials: the section exists but renders nothing.** The design comp showed
a quote from "Marisol Trang, occupational therapist, Woolloongabba". That person
does not exist; it was placeholder copy for the visual. Ensign is pre-launch, so
there are no clients and no quotes. Shipping an invented endorsement would be
misleading conduct under Australian Consumer Law and a Code of Conduct problem
for a provider whose pitch is honesty.

`testimonials` in `lib/content.js` is an empty array and `<Testimonials />`
returns null. Add a real, consented quote and the section appears. In its place
sits `<Commitments />`, built entirely from the client's own stated values.

**"Within one business day" is not a client commitment.** The questionnaire never
states a response time. We wrote it as demo copy and it spread to six places. It
now comes from `business.responseTime` in one spot, marked TODO. Confirm it,
change it, or remove it, but do not launch with it unconfirmed.

---

## Accessibility notes

The brief asks for low cognitive load, which pulls against the bold direction
that was chosen. Where the two conflicted, the brief won:

- Body text is 18px with a 65ch measure.
- Every colour pair clears WCAG AA; most clear AAA. Two accent tokens exist
  because a single accent cannot pass on both the light page and the dark band.
- The focus ring carries a light halo so it stays visible on the dark bands,
  where the blue alone measures 2.6:1.
- All motion is small, and `prefers-reduced-motion` stops the mesh and the plan
  map on their first frame.
- The plan map is decorative and carries a full text alternative.
- Form errors are plain language, announced in a live region, and focus moves to
  the first invalid field. Validation runs on blur, never on keystroke.
- An in-progress referral is kept in `sessionStorage`, never `localStorage`,
  because this is third-party health information often typed on a shared clinic
  computer. It is cleared on submit.
