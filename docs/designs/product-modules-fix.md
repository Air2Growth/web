# Product modules fix — “Four modules. Working together.” (scoped responsive repair)

Owner: implementation sub-agent. Date: 2026-10-09.
Scope: `src/page-designs/produkt.css` only (+ this doc). No HTML edits, no shared-CSS edits
(`src/mobile.css`, `src/mobile-simplify.css`, `src/graphics.css` reviewed, untouched), no translation
changes, no scripts, no other pages/docs. No commits/resets; all pre-existing uncommitted changes preserved
(`produkt.html` M status is prior work — not touched this round; `src/page-designs/` is untracked prior work).

## Before (viewed in image viewer, /tmp/a2g-product-modules-before/)

- `modules-1440-en.png` / `modules-1440-de.png`: section 1256px tall — coherent SVG schematic AND
  full A/B/C/D card list both visible (duplicate representation).
- `modules-768-en.png`: SVG + 2-col cards both visible; SVG labels ~9–10px effective (1080-unit viewBox
  scaled to ~662px inner) — below the 12px phone minimum.
- `modules-390-en.png`: SVG cropped/horizontally scrollable (min-width 560/640px vs ~303px inner) with
  D bar cut off, plus 1-col cards below. `audit.json`: `figureOverflow` 257.
- `modules-320-en.png`: same, `figureOverflow` 327. D subtitle “Connection & energy” low contrast
  (grey `#4f5b52` on forest). DE companions show the same defects with longer strings.

## Root cause (scoped CSS specificity, not shared CSS)

- `body[data-page="produkt"] .mobile-module-map{display:grid}` (0,2,1) outranks base
  `mobile.css:.mobile-module-map{display:none}` (0,1,0) → cards visible at EVERY size (desktop duplicate).
- `body[data-page="produkt"] .assembly-map svg{display:block; min-width:640px}` (0,2,2) outranks
  `mobile.css:.assembly-map>svg{display:none}` (0,1,1) and forces 560–640px scroll widths on phones
  (beats `graphics.css` min-width:520 too) → cropped SVG + internal figure overflow at 320/390.
- D subtitle: `mobile.css:.mobile-module-map span{color:#4f5b52}` is a direct rule, so it beats the
  forest card’s inherited white → low contrast on dark D. Scoped fix must set the color explicitly.
- `overflow-x:auto` (scoped) + `overflow-x:auto` (graphics ≤760) + `overflow:visible` (mobile ≤760):
  scoped wins, keeping the oversized SVG scrollable instead of fitting.

## Design plan → review (frontend-design skill, brief wins)

- Tokens kept exact: forest `#123D2B`, leaf `#36CF73`, citron `#DAF52F`, cobalt `#284AE8`,
  mist `#EFF9F1`, white; Barlow Condensed 700 display, Open Sans body. Expressive card geometry kept
  (white / citron pill-top / leaf pill-bottom / forest full-width D, cobalt badges) — not normalized
  into identical SaaS cards; the module board stays the one memorable object, everything else quiet.
- Plan: desktop = schematic only; tablet/phones = card map only. Reviewed against the brief’s
  “tablet text too small” warning: the shared 760px breakpoint would leave 768px on the SVG at
  ~9–10px labels, so the scoped breakpoint is deliberately **960px** (an existing system tier in
  mobile.css/graphics.css): ≤960 cards at 14/13px, ≥961 schematic at ~12–14px+ effective (1024px inner
  ~908 → scale 0.84). Second deliberate breakpoint **600px**: 2-col cards above (601–960), 1-col below
  so DE strings (“Wasser & Nährstoffe”) get full width on narrow phones.
- No SVG geometry change needed: D bar (rect 395/383 290×63, bottom 446 < 480) and DE/EN labels were
  measured against the 1080×480 viewBox and fit with spare — the “D comfortably inside” defect was
  purely the mobile cropping, fixed by hiding the SVG there.

## Fix (owned CSS only, all selectors scoped `body[data-page="produkt"]`)

- `.assembly-map`: `box-sizing:border-box; width/max-width:100%; margin:0; overflow:hidden`
  (was `overflow-x:auto`) — no internal scroll at any width; mist/border/radius/padding kept.
- `.assembly-map svg`: `width:100%; max-width:100%; min-width:0; margin-inline:auto`
  (was `min-width:640px`) — scales instead of scrolling. `@media(max-width:1020px)` tier updated
  560px → 0 for the same reason.
- `.mobile-module-map`: base `display:none` restored (beats nothing else above 960 → desktop
  schematic-only); `margin:0` (was `margin-top:16px`, which would leave a phantom gap above the cards
  once the SVG is hidden); `min-width:0 + overflow-wrap:break-word` on cards; `line-height` on
  strong/span (1.35/1.5).
- D contrast: `div:nth-child(4) strong/span{color:var(--white)}` (span `opacity:.82`) — explicit color
  beats mobile.css `#4f5b52` (0,3,1 vs 0,1,1).
- `@media(max-width:960px)`: figure `padding:16px 14px; overflow:hidden`; svg `display:none`;
  map `display:grid; repeat(2,minmax(0,1fr))`; D `grid-column:1/-1`. Scoped (0,2,1+) outranks shared
  hide/show rules without editing them.
- `@media(max-width:600px)` (new): map collapses to `1fr`, D `grid-column:auto`.
- `@media(max-width:760px)`: removed the old 1-col map override (superseded by 960/600 tiers);
  hero/facts/photo rules kept.
- Untouched: pinned-fit block (`html.has-scroll-scenes`, 761px+/short-height tiers), focus-visible,
  `prefers-reduced-motion` + `.motion-off`, header/hero/CAD/ledger/footer rules, homepage.

## Checks (actually run, not invented)

- `npm run build` — passes (155ms, `dist/assets/produkt-grGkkheZ.css` 15.28kB). New rules confirmed in
  bundle (lightningcss modern syntax): `@media (width<=960px)`, `@media (width<=600px)`,
  `svg{display:none}`, D `span{color:var(--white)}`, `min-width:0`, `overflow:hidden`.
- `npm test` — 6/6 pass.
- Static cascade simulation: 1440/1024 → SVG only; 768/760 → 2-col cards only; 600/599/390/320 → 1-col
  cards only. Exactly one representation per breakpoint; SVG scales (min-width 0) and cards use
  `minmax(0,1fr)+min-width:0` → expected internal figure overflow 0 at 320/390/760/768/1024/1440
  (before: 257 @390, 327 @320).
- Hooks intact, zero HTML edits: `h2#anatomy-title`, `figure.assembly-map[role=img]`, SVG
  `viewBox 0 0 1080 480` + `aria-hidden`, `.assembly-flow`, `aria-label` semantics, both language
  sources unchanged.
- No new dependencies/facts/strings (CSS only). Diff surface: module-board block + responsive tiers;
  pinned-fit block byte-identical.

## Remaining / for coordinator verification (root recaptures; no subagent browser used)

- Recapture 1440/1024/768/760/390/320 × DE/EN: exactly one representation visible, zero internal
  figure overflow, D subtitle white-on-forest, heading/badge and figure gutters aligned, section height
  reduced vs 1256px desktop baseline.
- Confirm 390/320 single-column cards fit DE strings without overflow; confirm badge
  (“Schematische Architektur”) fits at 320 (reasoned fits ~150px < 233px inner, not live-verified —
  no localhost:5173 server exists and host AppArmor blocks native preview from this session).
- Confirm pinned CAD section still fits viewport (untouched this round) and no other page regressed.
- Limitation: no live screenshots from this session (no server, no browser automation used per brief);
  evidence is source/diff + build/tests + bundle-rule confirmation + before-image inspection.
