# Product modules review — “Four modules. Working together.” (review round)

Reviewer: review sub-agent. Date: 2026-10-09.
Scope ownership this round: `src/page-designs/produkt.css` (one small tablet fix) + this doc.
Not touched: `docs/designs/product-modules-fix.md` (implementation record left as-is),
shared CSS/HTML/translations/scripts/other pages. All pre-existing uncommitted changes preserved
(`produkt.html` M status and other dirty files are prior work, not this review).

## Verdict

PASS with one small fix applied (tablet blank cell). Everything else meets the brief;
two observations are reported as recommendations, not fixes.

## Fix applied (owned scoped CSS only)

Patch in `src/page-designs/produkt.css`, `@media (max-width: 960px)` tier only:

```diff
-  body[data-page="produkt"] .mobile-module-map div:nth-child(4) {
+  body[data-page="produkt"] .mobile-module-map div:nth-child(3),
+  body[data-page="produkt"] .mobile-module-map div:nth-child(4) {
     grid-column: 1 / -1;
   }
```

Rationale: at 601–960px the grid was `repeat(2, minmax(0, 1fr))` with only D spanning,
so A/B shared row 1, C sat alone in row 2 with a ~340px blank mist cell to its right
(audit: 768-en C right edge 370.5 vs figure inner right ~711; confirmed visually in
`modules-768-en.png` / `modules-768-de.png`). Now 601–960 renders A|B, then C full-width,
then D full-width: no blank cell, clear A/B/C flow with D as the support bar.
Roles, labels, colors, pill geometry, type sizes unchanged; ≤600 single-column unaffected
(C `1/-1` ≡ full width in a 1-col grid; D `auto` rule kept). Root to recapture 768
(EN+DE) to confirm.

Validation of the fix: `npm run build` passes (162ms, `dist/assets/produkt-Whgw_CG_.css`
15.34kB, new combined `nth-child(3),…nth-child(4){grid-column:1/-1}` rule confirmed in
bundle); `npm test` 6/6 pass. Base C/D rules intact in bundle (C leaf pill-bottom,
D forest + white text).

## Findings and dispositions

1. One representation per breakpoint — PASS. Source cascade verified in sandbox:
   base `.mobile-module-map{display:none}` + `svg{min-width:0}`; ≤960 SVG hidden/cards grid;
   ≤600 single column; source order 960-before-600 so 600 wins at ≤600. Simulated:
   1440/1024/961 SVG-only; 960–601 2-col cards (now with C full-width); ≤600 1-col.
   Audit (`/tmp/a2g-product-modules-after/audit.json`, all 12 width×lang combos):
   `visibleRepresentations=1`, `figureOverflow=0`, `pageOverflow=-15`, `clippedText=[]`,
   `svg display`/`map display` match the expected rep at every width.
2. Breakpoint choice 960/600 — PASS, deliberate. 960 keeps 768-tablet on readable
   14/13px cards instead of ~9–10px SVG labels; 600 gives DE strings full width on phones.
   Boundary behavior: exactly 960 → cards; 961 → schematic; exactly 600 → single col.
3. Tablet blank cell — FIXED (see patch above). Was the only visual-balance defect found.
4. B/C pill-corner clearance at 320/390 — OBSERVATION, no fix. B (pill-top 60px) and C
   (pill-bottom 60px) keep `padding:14px 16px`; subtitles sit close to the 60px curve
   (tightest: 320-de “Biomasse & Kreislauf”, 320-en “Biomass & cycle”) but nothing is
   clipped or overlapping in the provided PNGs, and geometry/colors are the deliberate
   expressive treatment — normalizing it would violate the brief. `figureOverflow=0` /
   `clippedText=[]` do NOT prove intra-card clearance (they measure figure/page boxes,
   and hidden-rep rects are vacuous zeros), so this is stated as inspected-visual only.
   Optional follow-up if root wants more air (not applied): in the ≤600 tier add
   `padding:18px 20px` for `div:nth-child(2)/(3)` or reduce their large radius to ~32px.
5. Desktop D bar with DE — PASS. D rect is 290×63 at (395,383), bottom 446 < 480 viewBox;
   audit text widths 139px (EN) / 194px (DE) sit comfortably inside; PNGs show generous
   side spacing; `clippedText=[]` at 1440/1024 DE+EN.
6. D subtitle contrast — PASS. Audit D `bodyColor rgb(255,255,255)` on forest at all 12
   combos; EN “Connection & energy” and DE “Verbindung & Energie” read white in all
   mobile PNGs. Explicit scoped color beats `mobile.css #4f5b52` as designed.
7. Heading/badge/figure gutters, centering, borders — PASS (visual). 1440 heading left
   and badge right align with the figure edges; figure has even mist inset; 390/320 stack
   heading → badge → cards with consistent gutters. 320 badge (“Schematische Architektur”
   186px in ≤233px inner) fits per audit coords, visually confirmed in `modules-320-de.png`.
8. DE/EN parity + semantics — PASS. Headings and `aria-label`s correct per language in
   audit; `h2#anatomy-title`, `figure.assembly-map[role=img][aria-label]`,
   `svg viewBox 0 0 1080 480 aria-hidden + .assembly-flow` hook, card roles/labels all
   intact in `produkt.html:233-385`. Zero HTML edits this round (anatomy markup identical
   to HEAD; the `produkt.html` diff is prior hero/header work).
9. Specificity vs shared CSS — PASS. Scoped `(0,2,1+)` wins confirmed live: expressive
   card backgrounds (white/citron/leaf/forest) render at ≤760 despite `mobile.css`
   minimal `border-left` style; audit `display` values follow the scoped tiers, not the
   shared ≤760 `overflow-x:auto`/`min-width:520` SVG scroll path.
10. Reduced-motion, pinned CAD, logos/footer/homepage — PASS / untouched. Reduced-motion
    and `.motion-off` blocks unchanged; pinned-fit block (`html.has-scroll-scenes`,
    761px+/short-height tiers) unchanged this review except the 960-tier C selector;
    no other files edited.
11. Context-mode — `ctx_search` retrieved the 960/600 breakpoint decision and pinned-fit
    handoff; assessed against current source (authoritative) and found consistent. No
    Knowledge MCP use (retired). PCBParts irrelevant to this CSS repair.

## Limitations (not browser-verified from this session)

- No live screenshots from this session: no localhost:5173 server exists and native
  preview is host-blocked per brief; all visual evidence is the root-provided after PNGs
  + `audit.json` inspected via image viewer and sandbox. The tablet C-span fix above is
  source/build-verified only — root recapture at 768 (EN+DE) still required.
- 320px badge fit and gutter alignment are reasoned from audit coords + PNGs, not
  measured live. Pre-fix before-PNGs cited via the implementation doc
  (`/tmp/a2g-product-modules-before/`, figureOverflow 257@390 / 327@320 baseline).

## Evidence paths

- After PNGs: `/tmp/a2g-product-modules-after/modules-1440-en.png`,
  `modules-1440-de.png`, `modules-768-en.png`, `modules-768-de.png`,
  `modules-390-en.png`, `modules-390-de.png`, `modules-320-en.png`, `modules-320-de.png`.
- Audit: `/tmp/a2g-product-modules-after/audit.json` (12 combos, §findings).
- Source: `src/page-designs/produkt.css` (module-board block + ≤960/≤600 tiers),
  `produkt.html:233-385`, `src/mobile.css:1-6,92-118`, `src/graphics.css:264-434`.
- Prior record (untouched): `docs/designs/product-modules-fix.md`.
