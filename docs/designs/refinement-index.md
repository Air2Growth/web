# Home (`index`) — refinement report (2026-10-10)

Owner scope: `index.html`, `src/page-designs/index.css`. No shared CSS/JS or
translation files edited. Working tree for owned files: clean (no changes
needed — see Fix attempts).

## Baseline

- `index.html` / `src/page-designs/index.css` had no uncommitted changes vs
  `HEAD` (`c940679`); the committed poster redesign is the review baseline.
- Baseline audit (`/tmp/a2g-refine-20261010/baseline/audit.json`): all 10
  index runs (de/en × 320/390/768/1024/1440) report 0 overflow, 0 broken
  anchors, 0 duplicates, 0 axe findings.

## Visual review (fallback Playwright, dev server :5174)

- Viewports: desktop 1440×900, mobile 390×844 and 320×568; `?lang=de` and
  `?lang=en`. Full-page + section viewports. Zero page/console errors on all
  six runs; `body.scrollWidth` equals viewport width everywhere.
- Hero DE (`AUS CO₂ WIRD / NEUES / WACHSTUM.`) and EN (`FROM CO₂ TO / NEW /
  GROWTH.`) both render correctly with sticker, CO₂ orbit badge, caption and
  coordinate bars. Ledger (TRL 4, 7 kg, 800 € + model note), awards row,
  lens section, 6 directory ledger rows, forest contact band, footer — all
  correct in DE; EN hero verified.
- Hero image `/images/landscape.jpg` exists (217 KB) and loads eagerly
  (`fetchpriority="high"`, naturalWidth 1400). Index has no `loading="lazy"`
  images, so the baseline "unscrolled lazy panels" caveat does not apply here.
- Contrast (computed): forest/white 12.15, forest/mist 11.28, forest/citron
  9.89, white/cobalt 6.49, muted/white 8.43, muted/mist 7.82, inline SVG
  resource-tags #67746a/white 4.90 — all pass AA. No contrast fix needed in
  owned CSS.
- Keyboard/state: chapter buttons receive `aria-pressed` from JS (measured
  true/false/false); lab buttons carry `aria-pressed` in markup; disclosure
  open on desktop / closed on mobile as designed; focus-visible rules exist
  for hero and contact surfaces.
- Mobile simplification (`mobile-simplify.css` ≤760px) hides orbit badge,
  hero footnote, recognition row, scene SVG figure, chapter controls and
  progress. `index.css` deliberately re-shows caption/coordinate as static
  bars (`display:flex`/`block` override). Orbit stays hidden on phones.

## Fix attempts

- Suspected stat-value wrap at 320px from a full-page thumbnail; added
  `white-space: nowrap` to `.stat > div`, then verified `.stat > div` is
  `display:flex` (row, no wrap possible) and a 320px section screenshot shows
  correct inline baseline layout. Reverted as a no-op to keep the diff clean.
  Net change: none.

## Decisions (preservation)

- Orbit badge hidden on mobile: kept. It follows the site-wide
  "one explanation per subject on phones" rule; the CO₂ message is already
  carried by H1/description/sticker. Unhiding would add clutter to a 350px
  photo and change the committed composition. The mobile orbit sizing rules
  in `index.css` are inert but harmless; left untouched.
- Inline SVG `resource-tags` fill `#67746a` (4.90:1): kept, passes AA,
  authored palette color.

## Coordinator follow-ups (no action taken, out of scope)

1. `mobile-module-map` secondary-label contrast: verified absent from
   `index.html` and `src/page-designs/index.css` — belongs to the produkt
   page owner.
2. Static CAD hero + interactive CAD repeat on phones: index has no CAD
   sections (single hero photo + cycle scene + lens, each distinct) — belongs
   to the produkt page owner.
3. No shared CSS/JS changes and no `src/translations/en.js` changes needed
   from this review.
4. Methodology notes: without `?lang=`, the i18n script follows the browser
   locale (headless en-US → EN); `?lang=de/en` verified correct — not a bug.
   Full-page screenshots stitch the sticky scroll-scene with large gaps and
   can clip H1 lines; viewport screenshots confirm correct rendering.

## Evidence

- `/tmp/opencode/index-{de,en}-{desktop,m390,m320}.png` (full page),
  `/tmp/opencode/index-vp-{de,en}.png` (desktop hero viewports),
  `/tmp/opencode/index-fix-320-ledger.png`,
  `/tmp/opencode/index-fix-de-{lab,dir,contact}.png`.
- Scripts: `/tmp/opencode/index-review.mjs`, `/tmp/opencode/index-vp.mjs`,
  `/tmp/opencode/index-verify.mjs`.
