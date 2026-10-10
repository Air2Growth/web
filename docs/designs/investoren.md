# Investoren — forest investment staircase

## Brief
Air2Growth investors page. Local CO2 capture + algae cultivation + fertilizer.
Forest-green investment roadmap, monumental white type, one visually stepped
milestone staircase in citron and cobalt. Current evidence versus planned
growth instantly distinct. No invented market, return, or engineering facts.

## Token plan
- Color (exact shared palette): forest `#123D2B` (hero + roadmap field, ink,
  achieved-step cap, forest tags), citron `#DAF52F` (achieved ground, label
  pill, hero rule, focus on dark), white `#FFFFFF` (monumental type ground
  is forest; planned-step grounds, ledger cards), cobalt `#284AE8` (planned
  caps/edges, 800 Euro cell, links, focus on light), leaf `#36CF73`
  (growth signal: hero-adjacent? no — detail-note edge, qual edge,
  consumables bar, SVG leaves), mist `#EFF9F1` (quiet middle ground).
  Flat fills only, zero gradients. Vars `--forest, --leaf, --citron,
  --cobalt, --mist, --white` on `body[data-page="investoren"]`.
- Type: locally hosted Barlow Condensed 700 for bold display (h1 clamp
  64–144px, roadmap h2 48–84px, step strongs 26–38px, ledger figures
  24–46px; tight 0.92–1.05, sentence case, whole headlines monochrome),
  Open Sans for body/UI (13–16px/1.6–1.75).
- Layout: full-bleed forest hero (type left, aria-hidden bar staircase
  right) bleeding into a forest roadmap bench where the real
  `roadmap-list` is the staircase; quiet mist middle (`xp-growth` diagram
  + short list as open ledger rows); quiet mist/white detail ledger
  (`vp-lane` solid-vs-outline tags, flat cost bars, mist + cobalt
  potential cells, white FAQ cards, small laboratory inset); quiet white
  next card. Left aligned throughout.
- Principles: one memorable device (the staircase — hero bars echo it,
  roadmap steps are it); drafting devices (step caps, tag grounds,
  left-edge bars) carry achieved-vs-planned meaning instead of
  decorating; Konzept-vs-Feldtest discipline preserved (TRL 4 achieved
  always citron/forest-solid, Dec 2026 / Mar 2027 always white/cobalt
  planned, both qualified with plan wording from source).

```text
+-- FOREST HERO (monumental, no photo) ------+
| label(citron pill) | [bars: citron/white/  |
| H1 white 64-144px  |  cobalt ascending]   |
| lead white + citron left-rule              |
+-- FOREST BENCH (focal staircase) ----------+
| eyebrow citron-outline / H2 white          |
| lead white + [Pitch Deck citron pill]      |
| [STEP1 citron: Sep 2026 / TRL4+Test]       |
|      [STEP2 white/cobalt: Dez 2026 plan]   |
|           [STEP3 white/cobalt: Mär 2027]   |
+-- MIST GROWTH (quiet) ---------------------+
| [white SVG card, recolored] [3 open rows]  |
+-- MIST/WHITE DETAIL (quiet ledger) --------+
| H2 forest + leaf-rule | vp-lede soft       |
| vp-lane: forest-cap achieved + 2 cobalt    |
| vp-cost flat bars | mist + COBALT 800 cell |
| qual leaf-rule + FAQ white + note + inset  |
+-- white next card (hover citron) ----------+
```

## Critique vs. generic defaults
- Was: full-bleed `agriculture.webp` leaves photo with overlay hero,
  identical to every other subpage. Now: photo `<img>` removed from the
  hero (guard `display:none` kept in CSS); forest field with monumental
  white Barlow + citron pill + citron rule + aria-hidden bar staircase.
  Changed because the direction demands replacing the generic photo hero
  and the staircase is this page's unique composition.
- Was: roadmap as three flat identical rows/bullets plus a second
  competing `vp-lane` timeline and a decorative seedling SVG band.
  Now: `roadmap-list` is the single focal staircase (ascending offsets
  on desktop, indented stack on mobile; citron solid achieved vs white
  planned with cobalt caps); `vp-lane` is deliberately quiet (same
  achieved/planned language, smaller, mist/white); `xp-growth` SVG kept
  but recolored into the exact palette and framed as one white card.
  Changed to spend boldness in one place and avoid the SaaS-card kit.
- Was: gradient washes and blob radii in `expressive-pages.css`
  (`radial-gradient` dots, `linear-gradient` bands, 38–120px blob
  radii). Now: zero `linear-gradient`/`radial-gradient` in page CSS;
  uniform 12–20px radii; step caps and tag grounds are flat fills.
  Changed per no-gradients-as-decoration rule.
- Was: all-caps eyebrows and italic single-accent `<em>Für morgen
  planen.</em>`. Now: sentence case everywhere (`text-transform: none`),
  `em` neutralized to inherit (DOM string unchanged, i18n safe).
  Changed per no-all-caps / no-single-word-accent rules.
- Was: risk of inventing market size, returns, or launch guarantees.
  Now: kept source facts only — September 2026 TRL 4 + Feldteststart,
  December 2026 onboarding planned, March 2027 launch planned, hardware
  3.000 Euro once, consumables 50 Euro / 2 months (300 Euro/year note),
  7 kg/week model, 800 Euro/year model potential, both qualified, pitch
  deck via `kontakt.html?thema=Pitch%20Deck#anfrage`. No new figures.
- Considered a dark near-black hero with acid-green accent and rejected
  it: near-black + acid accent is the generic default; the brief pins
  forest `#123D2B` and the shared palette forbids near-black.
- Considered numbering the steps 01/02/03 and rejected it: dates are
  already the sequence markers; extra numerals would be gratuitous
  (content is a sequence, but numbering would duplicate the dates).

## What changed (owned files only)
- `investoren.html`: swapped `/src/expressive-pages.css` for
  `/src/page-designs/investoren.css`; removed generic `agriculture.webp`
  photo-overlay hero; wrapped hero in `inv-hero-grid` + `inv-hero-type`
  and added aria-hidden `inv-stairs` bar device (no new copy, no string
  changes). All German strings, heading order, `#main`, `#roadmap`,
  `#xp-i-stages`, `#vp-fahrplan`, `#vp-modell`, `data-reveal`,
  `vp-lane`/`vp-cost` (`--w` untouched)/`vp-potential`, FAQ
  `details.faq-item`, anchors, pitch-deck/tech links, `laboratory.webp`
  alt/caption, page-next link, `#year`, language hooks, header/footer
  structure unchanged.
- `src/page-designs/investoren.css` (new): all selectors scoped under
  `body[data-page="investoren"]`; flat palette; 320px→desktop
  responsive (grids stack, staircase indents, bars stack, photo
  full-width, no page overflow); visible focus (cobalt on light, citron
  on forest); `prefers-reduced-motion` + `.motion-off` disable motion.
- `docs/designs/investoren.md` (this file).

## Preservation check
- Kept verbatim: page-label, h1 lines, page-lead, roadmap eyebrow/h2/p,
  pitch-deck hrefs (both), all three roadmap dates + titles, growth SVG
  + title + caption + short-list items, detail h2/p, `vp-lede`,
  `vp-kicker`s, `vp-when`/strong/p/`vp-tag` per lane item (Erreicht vs
  Geplant kept), cost labels/bars/amounts, potential cells, qual +
  figcaption notes, FAQ summary/answer, detail-note + tech link,
  laboratory photo + caption, page-next spans/link, header/footer.
- Heritage vs plan: September 2026 + TRL 4 + Feldteststart read as
  achieved (citron solid, forest tag); December 2026 + March 2027 read
  as planned (white, cobalt caps/tags, source "geplant" wording kept).
- Contrast (pairs used): white/forest 12.15, forest/citron 9.89,
  forest/white 12.15, forest/mist 11.28, forest/leaf 5.98, white/cobalt
  6.49, cobalt/mist 6.02, soft `#2E5541`/mist 7.8 — all ≥ 4.5 for text.
  Cobalt never body text on citron/leaf; leaf never carries white text.
- A11y: heading order h1→h2→h3 intact; stairs device `aria-hidden`;
  native `details/summary` FAQ kept; 44px+ targets (hero/next links,
  text-link pill); visible focus; reduced-motion guard; nothing hidden
  to simplify (all lanes, costs, FAQs, photo render at every width).
- Responsive: 1020px hero stacks + lists to 2-col; 760px single column
  with indented staircase (0/20/40px), stacked bars/potential, full
  CTA; 380px tightens indents + card padding; SVG/img capped at 100%.

## Checks run
- `git status --short` (workspace dirty as expected; only owned files).
- `npm run build` (Vite static build incl. investoren.html + new CSS).
- Hook grep: `#main`, `#roadmap`, `roadmap-list`, `#xp-i-stages`,
  `xp-growth`, `vp-lane`, `vp-cost`, `vp-potential`, `vp-tag`,
  `faq-item`, `laboratory.webp`, `thema=Pitch`, `#year` present;
  `expressive-pages.css` absent; `page-designs/investoren.css` present;
  no `subpage-hero-image`; no `linear-gradient`/`uppercase` in page CSS.

## Unresolved / limitations
- context-mode MCP: `ctx_search` returned prior handoffs (index,
  technologie) and shared-palette constraints — assessed; current
  repository sources treated as authoritative. New findings indexed via
  `ctx_index` at handoff. No claims of automatic memory capture.
- No browser preview tool in this subagent session catalog; root
  reported AppArmor sandbox block for `preview_open`. Host browser
  security settings not altered; no screenshots taken. Root performs
  integration checks; `npm run build` is the verification gate.
- Shared design-system imports owned by coordinator/home worker; this
  page only links its own stylesheet and defines its own
  `--forest…--white` locally (same values).

## Final review revision (2026-10-09, review-final)

Root findings (read `/tmp/a2g-later-pages-review/investoren-1440.png`
and `-390.png` to confirm): (1) mobile H1 breaks `Weitergedacht` into
`Weitergedach` + `t im Feld.` at 390px; (2) hero `.inv-stairs` is three
empty blocks repeating the real milestone staircase below without
communicating anything.

Fix (owned files only, no invented labels/figures):

- `investoren.html`: replaced the `aria-hidden` empty-block
  `.inv-stairs` div with an ordered `ol.inv-stairs`
  (`aria-label="Meilensteine kurz"`) of three labelled `li.inv-step`
  reusing sourced strings verbatim: `September 2026` /
  `TRL 4 & Start der Feldtestphase` / `Erreicht`; `Dezember 2026 ·
  geplant` / `Kunden-Onboarding` / `Geplant`; `März 2027 · geplant` /
  `Markteinführung Air2Growth` / `Geplant`. Chronology and planned
  qualification preserved; `roadmap-list`, `vp-lane`, cost bars,
  pitch-deck links, anchors/IDs/hooks unchanged. All six strings already
  exist in `src/translations/en.js`, so DE/EN switching keeps working.
- `src/page-designs/investoren.css`: H1 gets `hyphens:none;
  overflow-wrap:normal; word-break:normal` globally; mobile (≤760px)
  drops from `clamp(58px,17vw,96px)` to `clamp(42px,12vw,64px)` with
  `max-width:100%` + `text-wrap:pretty` (≤380px:
  `clamp(40px,12vw,48px)`), so the 13-character condensed word fits:
  estimated 246px at 320px (wrap 280), 253px at 360px (wrap 320), 274px
  at 390px (wrap 350); previous 66px at 390px estimated ~386px and
  forced the mid-word split. Stairs steps become labelled flex columns
  (date 12.5px bold, Barlow title 21–30px, status pill `em` 12px,
  sentence case) keeping flat fills and stepped heights
  (128/176/224 desktop, 140/176/212 ≤1020px); ≤760px they stack to one
  column with 0/16/32px indents (12/24px ≤380px) so text never squeezes
  into ~100px columns. Achieved stays citron/forest, middle stays
  transparent/white-outline on forest, final stays cobalt/white —
  evidence vs plan instantly distinct, contrast AA (white/forest 12.15,
  forest/citron 9.89, white/cobalt 6.49).

Critique: empty hero bars were decoration, not information — the one
generic-default tell the skill warns against (a big number/bars with a
small label). Revised by spending the staircase device on real
dates/status instead of shapes, and by quieting nothing else; the
roadmap bench below remains the detailed staircase, the hero is now its
labelled miniature. Rejected numbering 01/02/03 (dates already sequence
the content) and rejected inventing market/return copy.

Checks re-run: `npm run build` passes (`assets/investoren-*.css`
16.81 kB); `npm test` 6/6; `inv-step li` 3, empty spans 0; milestones,
pitch-deck hrefs ×2, `#roadmap/#xp-i-stages/vp-lane/vp-cost` intact; 0
gradients; 0 `uppercase`; 0 unscoped rule opens.
