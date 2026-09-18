# Ensign build toolchain

These are the scripts that generate every page in `../pages/`. They were written in a
Claude Cowork cloud session and saved here so any future session can rebuild the site
instead of hand editing 350KB HTML files.

## Rebuild everything
```
python3 -m pip install playwright axe-core-python --break-system-packages   # only if missing
cd <this folder>
bash rebuild_all.sh
```
`rebuild_all.sh` runs, in order:
1. `build_home.py`, `build_services2.py`, `build_about.py`, `build_refer_page.py`,
   `build_contact.py`, `build_contact2.py`, `build_privacy.py`
2. `build_hero6.py` (MUST run last of the builders: the other scripts `exec` build_home.py
   and overwrite ensign-home.html as a side effect)
3. `link_pages.py` (turns every `href="#"` into a real page link)
4. `smart_quotes.py` (curly apostrophes in visible text, skips script and style blocks)
5. `add_dev.py` (localhost auto reload, `index.html`, `dev-version.txt`)

Output lands in the same folder. Copy the 8 HTML files plus `index.html` and
`dev-version.txt` into `../pages/`.

## Checks
`fullcheck.py` runs axe-core WCAG 2.2 AA, a horizontal overflow check and a console
error check on all 7 pages at 1440 and 390. It must print CLEAN for every row.

Wait about 4 seconds after a page loads before running axe. Elements mid fade read as
low contrast and produce false failures.

## Key files
- `build.py` .......... design tokens, fonts, logo, shared helpers. `exec`ed by the others.
- `ds-source.css` ..... the design system source. `--page-max` lives here (currently 1340px).
- `build_home.py` ..... header, footer, Home page shell, most of the Home CSS.
- `build_hero6.py` .... the locked Home hero (circle portrait, floating chips, dark card,
                        panel, page texture, the fixed stage height for the enquiry flow).
- `enq.js` / `enq.css`  the 3 step enquiry flow. Step indices are hardcoded in enq.js
                        (0,1,2 = questions, 3 = web done, 4 = sms done). Splitting a step
                        means renumbering those.
- `andrew-cut.webp` ... Andrew with the background removed (rembg, u2net_human_seg model).
                        Not used by the current hero, kept for future layouts.

## Gotchas found the hard way
- Scroll reveals must fail open. `build_visuals.py` has a 2 second timer that shows
  everything even if the IntersectionObserver never fires (C49).
- An optional `<br>` needs a real space before it or the phone renders two words joined (C42).
- Never stretch a photo to make two columns line up (C47).
