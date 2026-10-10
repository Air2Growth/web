# Spacing review round 3 — Produkt pinned-fit (CAD viewport)

Owner: product-tech-benefits worker. Date: 2026-10-09.
Scope this round: `src/page-designs/produkt.css` ONLY. No HTML edits, no `src/scroll.css` edits, no other CSS/files. Shared header/footer/logo/home untouched (peer-owned). Prior docs left intact (`spacing-product-tech-benefits.md`, `spacing-review-product-tech-benefits.md`).

## Previews actually viewed (image viewer, /tmp/a2g-spacing-normal-final)

- `produkt-normal-0.06.png` (1440x900, progress 0.06): H2 + CAD figure fill viewport; caption `Gesamtanlage · CAD-Konzept` visible at bottom edge; range slider not visible (below fold).
- `produkt-normal-0.45.png` (1440x900, progress 0.45): defect confirmed — CAD figure extends beyond pinned viewport bottom; caption barely fits; native rotation slider below viewport unreachable during pinned scene. Chapter `02` + controls/progress visible on right, so copy side fits; figure side does not.
- `produkt-normal-0.97.png` (1440x900, progress 0.97): caption visible; `Modell` label + slider cut at very bottom edge (partially reachable only at scene end).
- Metrics `normal-motion.json`: produkt scene `top 947`, `height 2340`, `stickyHeight 900`, `viewport 900`, `overflow -15` (scrollbar artifact only), no errors. Rects alone do not flag the overflow — visual evidence is the finding.
- `/tmp/a2g-spacing-pinned-fit-before/` does not exist (root noted "if ready" — not provided this round). No other before/after pinned outputs to compare.
- No browser automation (root owns CDP tab, untouched). No recapture from subagent.

## Root cause

- `src/page-designs/produkt.css`: `body[data-page="produkt"] .model-stage{max-width:560px}` — specificity 0,2,1.
- `src/scroll.css`: `.has-scroll-scenes .model-stage{max-width:min(540px,calc(100svh-260px))}` — specificity 0,2,0 — loses, so viewport-aware cap never applies on produkt.
- Combined with taller produkt H2 (`clamp(44px,5vw,76px)` vs base `28-46px`), figure padding (`clamp 18-30/16-28/16-24`), caption + range blocks, chapter padding (`20px 22px`), controls `margin-top:35px`, and inherited `.scene-layout{max-height:600px}`, the square stage (560px tall + ~150px chrome) plus ~150-170px heading block overflows the 900px sticky viewport by ~20-60px. Matches screenshots.

## Fix (owned CSS only)

File: `src/page-designs/produkt.css` — appended pinned-fit block after `.scene-progress span` (before module board). `src/scroll.css` not edited; local override wins.

- Selector prefix `html.has-scroll-scenes body[data-page="produkt"]` (0,3,2) beats both produkt base (0,2,1) and scroll responsive (0,2,0).
- `@media (min-width:761px)` (pinned only; `has-scroll-scenes` itself requires `min-width:761px + min-height:650px`, so reduced-motion/full-content and phones ≤760px unaffected):
  - `.scene-sticky`: `padding-block:clamp(16px,2.5vw,32px) 0` (was `clamp(24px,3.5vw,44px) 0`).
  - `.scene-heading`: `gap:16px; margin-bottom:12px` (was 30/20).
  - `h2`: `clamp(36px,3.4vw,56px), line-height:1` (was `44px,5vw,76px, 0.98`).
  - `.scene-layout`: `gap:clamp(24px,3vw,48px)` (was 70), `align-items:center`, `flex:1 1 auto; min-height:0; max-height:none` (lifts inherited 600px cap, lets flex fit).
  - `.scene-figure`: `16px 16px 12px` (was clamp 18-30/16-28/16-24).
  - `.model-stage`: `width:100%; max-width:min(440px,calc(100svh-400px)); margin-inline:auto` (was 560px; viewport-aware, wins).
  - `figcaption`: `margin-top:8px; padding-top:8px` (was 12/10).
  - `.model-range-label`: `margin:10px 0 0` (was 14px; slider `min-height:44px` untouched).
  - `.scene-chapter`: `16px 18px; margin-bottom:10px` (was 20/22/14).
  - `h3`: `clamp(26px,2.4vw,34px)` (was 30,3vw,42).
  - `.chapter-controls`: `margin-top:14px` (was 35px; buttons `height:44px` untouched).
  - `.scene-progress`: `margin-top:12px` (was 24px).
- `@media (min-width:761px) and (max-height:800px)` (768/700 heights): sticky `12px 0`, heading `8px`, h2 `clamp(30px,3vw,40px)`, stage `min(400px,calc(100svh-360px))`, figure `12px 12px 10px`, chapter `12px 16px/8px`, h3 `28px/6px`, controls `10px`, progress `10px`. Keeps 44px controls + readable image.
- Static budget check (stage + ~122px figure chrome + heading + sticky pad): vh900 → stage 440, total ~702 (spare 198); vh768 → 400/~582 (spare 186); vh700 → 340/~522 (spare 178). All fit. 1024px width: left column ~506px, figure 440+32+border=476 fits with gutter.
- Deliberate trade-off: cap 440px (vs original 560) is smaller but still dominant/readable; chosen over 460-480 to keep a gutter at 1024px width. Animation/CAD hooks, colors, type, borders, asymmetric layout unchanged; controls not hidden.

## Checks (actually run, not invented)

- `npm run build` — passes (166ms, `dist/produkt-D26WyNFo.css` 14.56kB).
- `npm test` — 6/6 pass.
- New rules confirmed in `dist/assets/produkt-D26WyNFo.css`: `has-scroll-scenes`, `100svh - 400px`, `100svh - 360px`, `max-height:none`, `model-stage`, `scene-heading`, `chapter-controls` all FOUND.
- Hooks intact, zero HTML edits this round: `model-stage`, `scroll-model`, `model-range`, `data-chapter-go`, `scene-progress`, `faq-stack`, `#modul-alltag` (`scene-skip`/`Weiter`), `data-language` all present in `produkt.html`. CAD slider, 3 chapters, chapter buttons, progress, anchors, language hooks preserved.
- Controls/a11y untouched: `.model-range{min-height:44px}`, `.chapter-controls button{height:44px}`, `:focus-visible`, `prefers-reduced-motion` + `.motion-off`, `max-width:760px/380px` phone rules all still present.
- No new dependencies (`dependencies:{}`), no new facts/strings (CSS only). `src/scroll.css` unmodified. Other owned files (`technologie.css`, `vorteile.css`) inspected, not edited this round.
- Workspace dirty as instructed — preserved, no resets/commits. `src/page-designs/` remains untracked (prior work); only file content-edited this round is `src/page-designs/produkt.css`.

## Remaining / for root verification

- Recapture produkt pinned scene at 1440x900 (progress 0.06/0.45/0.97, DE+EN) to confirm heading + CAD figure + caption + range + chapter controls all visible without scroll during pin. EN heading (`One system. Your own cycle.`) is shorter than DE, so DE is worst case.
- Capture shorter heights (768, 700) at 1440 + 1024 widths, and 390/320 (must remain full-content static, no pinned fit) to confirm no regression.
- Verify rects: sticky bottom ≤ viewport, slider rect fully inside viewport during pin, no overflow/errors.
- Shared defects still peer-owned, not edited: footer wordmark spacing/color, index heading card.
