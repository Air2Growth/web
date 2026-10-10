# Spacing review — Produkt / Technologie / Vorteile

Owner: product-tech-benefits worker. Date: 2026-10-09.
Scope: `src/page-designs/produkt.css`, `technologie.css`, `vorteile.css` only.
No HTML edits (no wrapper correction needed — all defects fixable in owned CSS).
Shared header/footer/logo CSS untouched (peer owns `design-system.css` + home).

## Previews actually viewed (image viewer)

- produkt 1440: section-0..4 + footer. produkt 390: section-0.
- technologie 1440: section-0..3. technologie 390: section-0..1.
- vorteile 1440: section-0..4. vorteile 390: section-0.
- audit.json: geometry/padding/border/wordmark rows for all 6 page×width combos.

## Defects found and fixed (owned files only)

1. **Technologie FAQ half-width + mint dead panel (worst defect).**
   Evidence: technologie-1440-section-2 — white disclosure ~60% width, inherited
   mint `.faq-stack` box filling the right ~40%.
   Root cause: `scroll.css:.visual-details{max-width:850px}` capped the item;
   `faq.css:.faq-stack` mint bg/border/radius stayed visible around it.
   Produkt was immune (its rule already had `max-width:none`); technologie and
   vorteile were not.
   Fix: neutralize `.faq-stack` (transparent, borderless) and set
   `.faq-item{max-width:none;margin:0}` in technologie.css + vorteile.css;
   same container neutralization in produkt.css (prevents mint corner slivers).
2. **Oversized disclosure bars (all 3 pages).**
   `faq.css` summary keeps `padding:28/32px; min-height:88–100px` on desktop.
   Added scoped `summary{padding:14px …; min-height:44px}` — bars drop from
   ~110px to ~56px, controls stay ≥44px.
3. **Stacked 80px section padding → ~160px+ dead gaps (produkt).**
   `.section{padding:80px 0}` inherited twice between machine-anatomy →
   detail-section → editorial-photo. Added scoped
   `padding-block:clamp(48px,6vw,72px)` to `.machine-anatomy` and
   `#modul-alltag`. Specificity `body[data-page]+class` beats `.section`.
4. **Produkt hero bottom collision.** `pd-modular` note sat on the hero edge
   where the citron scene radius begins. Grid bottom padding raised to
   `clamp(36px,5vw,72px)`; `.scene-sticky` top `8px` → `clamp(24px,3.5vw,44px)`.
5. **Assembly-map dead space.** Padding `clamp(16,2.6vw,30)` →
   `clamp(14px,2vw,22px)`; SVG set `display:block` (kills inline gap).
6. **Technologie rhythm.** Detail-section top `8px` → `clamp(24px,3vw,40px)`;
   duct margin-top `8px` → `16px`; panel insets tightened
   (diagram `26/24→22/24/20`, min-height `230→200`; panel-bottom `22/26/26→18/26/24`).
7. **Vorteile rhythm.** Economy padding `clamp(36,5vw,72)` →
   `clamp(28px,4vw,56px)`; detail-section top `12px` → `clamp(24px,3vw,40px)`.
   Also added `margin:0` to `.faq-item` (beats inherited
   `details.vp-more{margin-top:22px}` double-spacing with stack gap).

## Deliberately kept (not defects)

- Centered editorial-photo insets (760/820px) — intentional field-note cards.
- `detail-heading` 1fr/1fr asymmetric grid + side notes — per brief, keep asymmetry.
- Footnote `detail-note` readable measure (~800px max) — intentional line length.
- Vorteile hero mist quiet space; technologie hero end-aligned lead — intentional.
- Module-card distinct radii/treatments (A white / B citron / C leaf / D forest).

## Shared/global defects (outside ownership — reported, not edited)

- **Footer wordmark:** fragments spaced (`gap:10px`), "2" and "." render cobalt
  blue, not original green; "air 2 growth" reads distanced. Peer owns
  footer/logo CSS; restoration reportedly underway.
- **Main page heading card design:** index brief item, owned by home peer.

## Checks

- `npm run build` — passes (183ms).
- `npm test` — 6/6 pass.
- Hooks intact (zero HTML edits): CAD slider (`model-range`), duct pills
  (`tech-duct`/`tech-stages`), 7 tab hooks on technologie, faq stacks,
  `data-scene`/`data-chapter`/`data-reveal`, language-switch,
  `#modul-alltag` anchor. New CSS rules confirmed present in dist bundles.
- No new dependencies (`package.json` deps unchanged), no new facts/strings.
- Focus-visible, reduced-motion, 320px+ responsive rules untouched.
- Palette/type unchanged: forest #123D2B, leaf #36CF73, citron #DAF52F,
  cobalt #284AE8, mist #EFF9F1; Barlow Condensed 700 + Open Sans.

## Remaining / for root recapture

- Final screenshots not recaptured (no browser in subagent; root owns CDP tab).
- Mobile 390 spot-checked pre-fix only; clamp minimums (44–48px) preserve
  mobile rhythm by construction — confirm on recapture.
