# Refinement — produkt.html (2026-10-10)

Subagent handoff for the produkt page. Design intent from `docs/designs/produkt.md`
(Citron Hardware Studio) preserved; no copy, palette, composition, or hook changes.

## Baseline (from `/tmp/a2g-refine-20261010/baseline/audit.json`)

- No overflow, no duplicate IDs, no broken anchors, no JS errors at any width/lang.
- Single axe flag: EN 390px `color-contrast` on `.mobile-module-map` secondary
  labels — B 4.21 (`#64724d` on citron `#DAF52F`), C 2.88 (`#4b6c57` on leaf).
- `images: [growing.webp]` entries are **inconclusive**, not missing files:
  verified below that the photo loads on desktop and is intentionally hidden on
  phones by shared CSS.

## Fix applied (owned CSS only: `src/page-designs/produkt.css`)

Root cause: the scoped base rule `.mobile-module-map span` sets size/opacity
but no `color`, so on phones the shared `mobile.css`
`.mobile-module-map span{color:#4f5b52}` wins by direct rule over inheritance,
and ×0.85 opacity over citron/leaf drops below 4.5:1. (On desktop the media
rule does not apply, so spans inherit forest — which is why only mobile failed.)

- A/B/C subtitle spans pinned to `var(--forest)` (specificity 0,3,2 beats the
  shared 0,1,1 rule without touching shared files).
- C (leaf) subtitle additionally `opacity: 1`: forest at 0.85 over saturated
  leaf computes to ~4.44:1, still under the bar; full-opacity forest on leaf
  is ~5.3:1. A (white, ~7.7:1) and B (citron, ~6.6:1) keep the 0.85 secondary
  treatment. D card already had its explicit white fix; untouched.
- No HTML changes; `produkt.html` unmodified.

## Verification (fallback Playwright, Chromium `--no-sandbox`, port 5174)

- axe `color-contrast` re-run at EN 390px after fix: **0 violations**.
- Computed subtitle colors now forest on A/B/C, white on D.
- Desktop 1440: no overflow, CAD hero + turntable both 800×800 loaded,
  editorial `growing.webp` loads (1320×880) after scroll; schematic SVG
  visible; EN strings correct ("Explore the system", "How the cycle works").
- Mobile 390 DE+EN: no overflow, no console/page errors; card map `display:grid`,
  SVG hidden (intended ≤960 single-view); screenshots reviewed.
- Anchors `#anlage`, `#modul-alltag` resolve; slider keeps its aria-label and
  44px targets; heading order h1→h2→h3 intact; cobalt focus-visible untouched.

## Assessed, deliberately NOT changed

- **Static CAD hero + interactive CAD scene repeat on phones** (both `000.png`,
  ~396px + ~460px stacked): kept. Both are content, not decoration — the hero
  specimen carries badges/ledger context, the scene carries the slider + caption.
  Hiding either on a guess would remove content/function and contradict the
  approved "hero + bench share one citron field" concept. No small refinement
  was justified within the preserve-design mandate.
- **Shared `mobile-simplify.css` hides `.editorial-photo`, `.model-scene
  .scene-copy`, `.chapter-controls`, `.scene-progress`, `.harvest-dots` ≤760px.**
  This is global simplification strategy owned by the coordinator — out of scope
  for this page. Follow-up suggestion (coordinator): the hidden `scene-copy`
  makes the phone CAD repeat read more bare; unhiding or condensing it is a
  shared-level decision, not a produkt-level one.
- **Translations**: coordinator-owned EN keys for "Zur Anlage" and CAD alt text
  confirmed present in `src/translations/en.js`; no translation edit made.
- No shared CSS/JS edits needed from this page.

## Changed paths

- `src/page-designs/produkt.css` (contrast rules appended near the D-card fix).
- `docs/designs/refinement-produkt.md` (this file).

## Remaining / coordinator follow-up

- None blocking. Optional shared-level consideration: phone treatment of the
  repeated CAD figure + hidden scene-copy (see above).
