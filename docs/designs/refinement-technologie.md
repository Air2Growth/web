# Refinement — technologie.html (2026-10-10)

Scope: `technologie.html`, `src/page-designs/technologie.css`, this doc.
Design intent from `docs/designs/technologie.md` (cobalt process lab) preserved:
palette, Barlow Condensed display + Open Sans body, cobalt bench + citron duct,
six sequential tabs with all `data-step`/ARIA hooks, mist equation/FAQ/photo,
citron next-step card. No copy rewrites, no new sections, no palette changes.

## Validation performed (Playwright/Chromium --no-sandbox, dev :5174)

- Viewports 1440x900, 390x844, 320x568 (DE) + 1440x900 and 390x844 (EN).
- Zero horizontal overflow at all widths; no clipped headings
  (H1 fits 20–300px at 320px); duct pills wrap without overflow.
- Reactor label vs. liquid fill: no overlap at any of the 6 steps on desktop
  (prior spacing fix holds).
- Keyboard: roving tabindex correct, ArrowDown/ArrowUp/ArrowLeft/ArrowRight +
  Home/End move selection (shared `main.js`), focus ring visible
  (3px citron on cobalt, verified screenshot `tech-focus.png`).
- Console/page errors: none. Images lazy-load correctly (earlier "broken"
  reading was below-fold lazy state; HEAD 200, naturalWidth 1320 on scroll).
- EN: full translation incl. duct SVG labels, stage pills, captions, FAQ.
- Contrast/gradients/uppercase: unchanged from design doc (all AA, no
  gradients, no uppercase).

## Fix applied (owned files only)

1. Orphaned trail arrow in the specimen diagram at narrow widths.
   At ~320px the wrapped flex row started with a lone "→" before the output
   pill (`mobile320` screenshot). The diagram is `aria-hidden` decoration —
   the kicker/title/description below carry the meaning — so:
   - `technologie.html`: second `.flow-arrow` span gains hook class
     `flow-arrow--trail` (presentational only; no JS/i18n selector depends on
     the exact class list — verified `graphics.js`/`scroll.js`/
     `mobile-simplify.js` never reference `flow-arrow`).
   - `src/page-designs/technologie.css` (`@media max-width: 560px`):
     `.flow-arrow--trail { display: none; }`.
   - Verified: 320px → `[input → reactor]` / `[output]` centered, no orphan;
     390px → all four items fit one row; desktop unchanged (both arrows).
     `hOverflow: 0`, no JS errors.

## Deliberately not changed (coordinator follow-up)

1. **Desktop tab clicks overridden by scroll story (functional bug, shared JS).**
   Repro: 1440x900, scroll `#tab-5` ("Ernte") into view, click it → panel
   shows step 04/05 instead of 06 (`data-active` 3/4, wrong kicker).
   Programmatic `#tab-5.click()` also yields `data-active="3"`.
   Mobile (≤760px) works correctly (`data-active="5"`).
   Cause: `src/scroll.js` `initScrollStories(selectStep)` — when
   `(min-width:761px) and (min-height:650px)` and motion enabled, every scroll
   frame calls `selectStep(index)` from `#technologie` scroll progress,
   overriding the user's explicit click. Suggested options for coordinator:
   suspend scroll-driving for a few seconds after a manual tab click, or drive
   only while the section is in a pinned/sticky region. Do not fix in page CSS.
2. **Footer `href="#"` ("Nach oben")** — dead link pattern, shared across pages
   (no scroll-to-top handler found in `main.js`); leave to coordinator for a
   consistent global fix.
3. **`role=tabpanel` `tabindex="0"`** creates an extra tab stop though the panel
   never scrolls (APG would omit it). Shared pattern — coordinator decision.
4. **`<em>` in "Sechs Schritte / Ein Kreislauf" H2** — kept; renders in the same
   forest voice and carries genuine stress; changing the tag risks i18n keys.
5. **Initial `#process-description` text replaced on load** by the shorter
   `steps[]` strings in shared `main.js` (visible flash, DE+EN). Content lives
   in shared JS — coordinator decision whether to align the two.
6. Full-page screenshots show large blank bands: `data-reveal` sections stay
   hidden until scrolled into view (shared `scroll.js`); viewport screenshots
   after scrolling render correctly. Not a page defect.

## Files changed

- `technologie.html` (1 class hook on second `.flow-arrow`)
- `src/page-designs/technologie.css` (1 rule in the ≤560px block)
- `docs/designs/refinement-technologie.md` (this file)

Screenshots: `/tmp/opencode/tech-{desktop,mobile390,mobile320,hero-320,
focus,equation,photo,en-desktop,en-390,fix-320,fix-390}-*.png`
(fresh captures use port 5174 only).
