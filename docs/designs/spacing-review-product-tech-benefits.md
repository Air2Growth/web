# Spacing review round 2 — Produkt / Technologie / Vorteile

Owner: product-tech-benefits worker. Date: 2026-10-09.
Scope: `src/page-designs/produkt.css`, `technologie.css`, `vorteile.css` (+ `src/scroll.css` reactor rules if needed — not needed, local override sufficed). Zero HTML edits this round. Shared header/footer/logo/home untouched (peer-owned).

Prior round doc: `docs/designs/spacing-product-tech-benefits.md` (left intact).

## Previews actually viewed (image viewer, /tmp/a2g-spacing-after-group)

19 PNGs, all after-group (post round-1) state:

- technologie 1440: section-0 (hero + duct rail), section-1 (step rail + reactor panel — defect), section-2 (equation + disclosure), section-3/4 (photo + onward + footer top).
- produkt 1440: section-0 (studio hero + CAD specimen), section-1 (CAD hero alignment), section-2 (module board), section-3 (facts + FAQ + CTA), section-4 (photo + onward), footer.
- vorteile 1440: section-0 (hero + leaf inset), section-1 (use-case illustrations + economy ledger), section-2 (ledger detail), section-3 (cost bars + amounts), section-4 (photo + onward), footer.
- Mobile 390: technologie section-1 (stacked rail), produkt section-0, vorteile section-0.
- audit.json (after-group): no overflow/misalignment/missing images/errors on owned pages (overflow -15 = scrollbar artifact only).

## Defects found and fixed

1. **Technology reactor sublabel colliding with fill top border (root finding, confirmed).**
   Evidence: technologie-1440-section-1 — "Luftansaugung" green sublabel sits exactly on the fill's leaf top border inside the vessel.
   Root cause: `style.css:.reactor-label{top:25px}` + 22px "a2g" + 9px sublabel ends ~67px, while `.reactor-liquid{inset:60px…}` by default — and `data-active=1..5` rules raise the fill to 35/23px to show progress, driving it straight through the label. Affects all 6 stages; worst on steps 02/04/06 (top 23px).
   Fix (technologie.css only, scoped `body[data-page="technologie"]`, wins on specificity 0,4,1 > 0,3,0):
   - Label: `top:12px` (>760px only), 20px/1.0, `z-index:2`; sublabel 9px/700/1.3, margin-top 3px → label bottom ≈47px in the 160px vessel.
   - Fill (>760px only): default `inset:68px 7px 7px`; active 1/3 `top:60px`; active 2/4/5 `top:56px`. Gaps above fill: 21/13/9px. Fill still rises with stage + existing background darkening carries the progression; harvest (5) keeps its `scroll.css` drain `translateY(25px)` on top.
   - Mobile ≤760px deliberately untouched: sublabel is `display:none` there and the vessel is 64px tall, so inherited compact values stay.
2. **No other owned spacing/border/centering defects visible.** Produkt hero/CAD gutters, module grid, facts ledger, FAQ bars (~56px), technologie duct/panel insets, vorteile ledger/amount labels/cost bars/use-case illustrations all show sensible gutters and rhythm post round-1. No new overrides added for them.

## Deliberately kept

- Centered editorial-photo insets, asymmetric `detail-heading` grids, footnote measures, vorteile hero quiet space, module-card distinct treatments (per brief + round-1).
- Fill-rise compression (68→56px instead of 60→23px): legibility over dramatic rise; noted trade-off.

## Shared/global defects (outside ownership — reported, not edited)

- Footer wordmark still distanced (`gap:10px` fragments) with cobalt-blue "2"/"." instead of original green — visible in all three 1440 footers. Peer owns footer/logo CSS.
- Index heading card design — home peer owns.

## Checks (actually run, not invented)

- `npm run build` — passes (169ms). `npm test` — 6/6 pass.
- New rules confirmed in built bundle `dist/assets/technologie-CoyW3wd5.css`: `reactor-label{top:12px}`, `reactor-liquid span` 9px/700, `inset:68px 7px 7px`, `top:60px`, `top:56px`.
- Hooks intact, zero HTML edits by this worker: produkt `model-range` slider + `#modul-alltag` anchor; technologie `tech-duct` + 6×`data-step` tabs + `#process-panel`/`#process-kicker/title/description` + `.reactor-label span` (dynamic i18n target); all 3 pages `faq-stack`, language hooks. No new dependencies (`dependencies:{}`), no new facts/strings (CSS only).
- Controls ≥44px, `:focus-visible`, `prefers-reduced-motion` rules present in all 3 owned files, untouched.
- i18n/320: all 6 DE + 6 EN reactor strings estimated ≤74px at 9px vs ~89px vessel inner width (single line); ≤760px sublabel hidden and `min-width:761px` scoping keeps the 64px mobile vessel intact; responsive breakpoints (960/760/620/560/380) untouched.
- No browser automation (root owns CDP tab, untouched); no screenshot recapture from subagent — final visual confirmation left to root.

## Remaining / for root recapture

- Recapture technologie-1440-section-1 (all 6 steps, DE + EN) to confirm 9px+ gaps at every fill level.
- Confirm 390/320 with subagent scoping (span hidden, a2g-only vessel).
