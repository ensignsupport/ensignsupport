# Whole-site blind review (Phase 3 Step 7), 17 to 18 Sep 2026

Two rounds by independent reviewers across all 7 public pages, desktop (1440) and phone (390). axe WCAG AA: 0 violations on every page. No horizontal overflow. No script errors.

## Round 1: consistency 7.5, visual 8.5, ease 8, trust 8
Fixed:
- Privacy: broken accesshub.gov.au link; placeholder pills splitting sentences and turning blue in lettered lists; section list highlighting the wrong section; a script error in the phone section list.
- Refer and Privacy: section highlighting replaced with a simpler, reliable scroll check.
- Home: the hero photo was embedded twice (desktop and phone copies). Now one photo moves position on phone (page 500KB to 382KB).
- Contact: avatar now a 7KB thumbnail instead of the full photo (255KB to 114KB).
- Refer: phone header Call and Menu buttons now match every other page.
- All pages: content buttons one height (56px), header buttons one height (48px).
- Services phone: "Lifeline on 13 11 14" no longer breaks.
- Home: smaller gap between "Two ways" and "How it starts"; step titles line up on desktop.
- All pages now link to each other (nav, footer, buttons), so the prototype can be clicked through.

## Round 2: consistency 8, visual 8, ease 8, trust 8
All round 1 items confirmed fixed. Then fixed:
- Headings balance their lines and paragraphs avoid single-word last lines (orphans) on all pages.
- Footer: ABN never splits across lines.
- Refer: space before the footer; hints moved under their inputs so paired fields line up; hero top spacing matches other pages; smaller text on three-across choice pills.
- Privacy: phone numbers never split.

## Not changed (would change a locked design, owner to decide)
- Second portrait on Home (reviewer suggested removing to reduce repetition).
- One shared closing block pattern across Home, Services and About (each is locked as designed).
- "Replies within 1 business day" appears several times per page (copy locked).
- Refer link on the phone header (currently in the Menu) and a Refer option on the 404 page.
- One site wide credential list (Home strip, Home Andrew block and About each word the checks slightly differently, all true).

## For Phase 4 build
- Serve fonts and images as separate cached files (WebP, responsive sizes) instead of inlining them in each page.
