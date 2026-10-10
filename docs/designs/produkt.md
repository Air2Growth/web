# Produkt — Citron Hardware Studio

## Brief
Air2Growth product page. Local CO₂ capture + algae cultivation + fertilizer.
Bright citron hardware studio, oversized engineering typography, actual
current-machine CAD as the hero object. No invented figures or claims.

## Token plan
- Color (exact shared palette): forest `#123D2B` (ink, frames, field-test
  card), leaf `#36CF73` (field-test marker, harvest cell), citron `#DAF52F`
  (studio background), cobalt `#284AE8` (functional annotations: angle
  readout, chapter numbers, slider, links, focus), mist `#EFF9F1` (quiet
  sections), white `#FFFFFF` (specimen + ledger cards). CSS vars `--forest`,
  `--leaf`, `--citron`, `--cobalt`, `--mist`, `--white` on
  `body[data-page="produkt"]`.
- Type: Barlow Condensed 700 for display (h1 clamp 68–152px, h2 44–76px,
  facts 40–62px, tight 0.92–1.0, sentence case, no single-word color accents),
  Open Sans for body/UI (14–16px/1.6–1.7).
- Layout: split specimen hero (type left, spec ledger right), CAD specimen
  card as the single focal object on citron, quiet mist/white surroundings.
- Principles: one memorable device (white CAD card, forest frame); drafting
  devices (dot grid, marker bars, ledger borders) carry information instead of
  decorating; Konzept vs. Feldtest always visually separated.

## ASCII wireframe
```
[header — unchanged structure]
+------------------------------------------------+
| CITRON STUDIO HERO                             |
|  left: pill label / H1 huge stacked / lead     |
|        [Zur Anlage]                            |
|  right: spec ledger                            |
|    [Aktueller CAD-Entwurf / CAD-Konzept]       |
|    [Modular / Produktion auf Ihrem Hof]        |
|    [V3 Feldtest — forest card, leaf marker]    |
+------------------------------------------------+
| CITRON BENCH (model scene, same field)         |
|  [white CAD specimen card: turntable+slider]   |
|  [chapter ledger cards A/B/C + round controls] |
+------------------------------------------------+
| WHITE BOARD (anatomy)                          |
|  [SVG schematic framed] [2x2 module map]       |
|  [D full-width forest bar]                     |
+------------------------------------------------+
| MIST LEDGER (field status)                     |
|  [TRL4 white][7kg citron][Modular forest]      |
|  [FAQ white card][cobalt CTA][photo inset]     |
+------------------------------------------------+
[page-next card][footer — unchanged structure]
```

## Critique vs. generic defaults
- Was: full-bleed cultivation photo with dark overlay hero (identical to every
  other subpage). Now: no photo hero at all; citron drafting studio with type
  + ledger. Changed because the brief demands a unique composition and the CAD
  is the authoritative product object.
- Was: three identical chapter blocks + three identical fact cells. Now: CAD
  card is the only dressed object; chapters are quiet ledger rows; fact cells
  differ by meaning (white = validated state, citron = model value, forest =
  product promise). Changed to avoid the SaaS-card kit.
- Was: gradient overlay wash on hero. Now: zero gradient washes; only
  hard-stop dot grid + marker bars as drafting devices. Changed per
  no-gradients-as-decoration rule.
- Was: all-caps eyebrows/numbering as decoration. Now: sentence case
  throughout; 01/02/03 kept only because chapters are a true sequence.
- Considered a dark forest hero (high drama, matches identity.css) and
  rejected it: the brief pins bright citron, and dark would repeat the
  near-black + acid-accent default.
- Considered moving the turntable into the hero and rejected it: `scroll.js`
  queries `.scroll-model` inside `[data-scene]`; keeping the figure in the
  scene preserves scroll/frame/slider behavior. Instead hero + bench share one
  citron field so CAD reads as the hero object.

## What changed (owned files only)
- `produkt.html`: added own stylesheet link; replaced photo-overlay hero with
  citron studio grid (same h1/label/lead strings + `id="produkt-title"`,
  `id="anlage"`, spec ledger reusing existing strings only); no hook, text,
  anchor, or behavior removals.
- `src/page-designs/produkt.css`: new scoped stylesheet (all selectors
  prefixed `body[data-page="produkt"]`).
- `docs/designs/produkt.md`: this file.

## Preservation check
- Kept verbatim: h1, page-label, page-lead, all chapter h3/p, controls
  (`data-chapter`, `data-chapter-go`, `aria-label`s), `model-label`,
  `scroll-model` img + alt, `model-angle`, `model-range` + aria-label,
  `figcaption`, assembly SVG + aria-label + mobile map, `#modul-alltag`,
  module facts + harvest SVG + detail-note, FAQ `details/summary`, CTA hrefs,
  editorial photo + caption, page-next link, header/footer structure.
- V3 vs. Konzept: caption `Gesamtanlage · CAD-Konzept` + label `Aktueller
  CAD-Entwurf` stay on the machine; `V3 läuft im Feldtest…` stays in hero
  ledger (forest card) and field section. No new facts.
- Contrast: forest text on citron/leaf/mist/white; white text on
  forest/cobalt. Cobalt used for large annotations + focus, never body text
  on white below 14px bold.
- A11y: heading order h1→h2→h3 intact; slider label + 44px targets; visible
  cobalt focus; `prefers-reduced-motion` + `.motion-off` disable animation;
  nothing hidden to simplify (all chapters render; scroll JS controls
  pinning as before).
- Responsive: 1020px stacks hero, 760px single-column maps/facts, 380px
  tightens card padding; images/SVG capped at 100% width.

## Checks run
- `git status --short` (workspace dirty as expected; only owned files added).
- `npm run build` (Vite static build incl. produkt.html + new CSS).
- Hook grep: `data-scene`, `scroll-model`, `model-range`, `data-chapter`,
  `data-chapter-go`, `#modul-alltag`, `faq-item` all present.

## Unresolved / limitations
- context-mode MCP tools (`ctx_search`/`ctx_index`/batch) are not exposed in
  this subagent session, so no indexed-findings retrieval was possible; worked
  from current repository sources (authoritative). No claims of automatic
  memory capture.
- No browser preview tool available in this session; could not screenshot.
  Root performs integration checks. `npm run build` is the verification gate.
- Shared design-system imports owned by coordinator; this page only adds its
  own stylesheet link and defines its own `--forest…--white` vars locally.
