# Spacing review — Team / Investoren / Kontakt, round 2 (2026-10-09)

Scope: `src/page-designs/team.css`, `src/page-designs/investoren.css`,
`src/page-designs/kontakt.css` only. No HTML edits (none needed), no
shared-CSS/home edits, no new facts/strings/links/anchors/hooks.

Prior round is recorded in `docs/designs/spacing-team-investor-contact.md`
(hero centering, ledger tightening, wash neutralization, lane dot removal,
desk rebalance, constellation/FAQ fixes). This round answers root's
unresolved objection plus a re-sweep of all three owned pages against the
new screenshots in `/tmp/a2g-spacing-after-team-group` (1440 + 390 sections,
`audit.json`, `interactions.json`).

## Images actually viewed (image viewer, not claimed blind)

- investoren-1440-section-1 (the objection), investoren-1440-section-0,
  investoren-1440-section-2, investoren-1440-section-3,
  investoren-1440-footer, investoren-390-section-0,
  investoren-390-section-1
- team-1440-section-0, team-1440-section-1, team-1440-section-3,
  team-1440-footer
- kontakt-1440-section-0, kontakt-1440-section-1,
  kontakt-1440-section-2
- `audit.json` (all 6 layouts: overflow -15 = scrollbar only, no
  misaligned wraps, no missing images, no console errors) and
  `interactions.json` (menu/language/form hooks intact) read as text.

## Root objection — confirmed and fixed

`investoren-1440-section-1.png` (roadmap bench) shows two real defects:

1. **Content clipping in the three roadmap mini cards.** Left card cuts
   `Feldtestphase` to `Feldtestpha`; right card cuts `Markteinführung` to
   `Markteinfüh`. Words/dates/qualifiers are untouched in HTML — this is
   pure layout clipping, even though page-level overflow metrics pass.
2. **Three timeline dots floating over card corners + a thin vertical rail**
   left of the green card. These are leftover inherited decoration, not
   part of the scoped card design.

Root cause (owned-file-fixable, shared files untouched):

- `src/style.css` `.roadmap-section` is `display:grid; 1fr 1fr; gap:80px`,
  and `.roadmap-list` carries `padding-left:25px; border-left:1px` plus
  `li:before` dots. The scoped `investoren.css` never reset
  `display`/`border-left`/dots, so the roadmap bench inherited a
  side-by-side 2-column grid. Inside that narrow track each
  `roadmap-list` child resolves `%` widths against the grid area (~560px),
  leaving ~178px per card — long German compounds cannot fit and clip at
  the card edge. The rail + dots paint over the card corners.
- Evidence: the hero `inv-stairs` (own grid, wider tracks) renders both
  words whole at the same viewport, and the 390 stacked roadmap renders
  both words whole. Narrow track, not font choice, is the cause.

Fix (all in `src/page-designs/investoren.css`, specificity wins over
`style.css` without touching it):

- `.roadmap-section { display:block; }` — copy stacks above a full-width
  list; each `> *` now resolves to the 1280px bench instead of a 560px
  grid area. The staircase (`margin-top 48/24/0`) reads left-to-right
  again; `border-top` + paddings unchanged.
- `.roadmap-list { border:0; border-left:0; background:transparent; }`,
  `li { position:static; min-width:0; overflow-wrap:break-word; }`,
  `li::before/::after { content:none; display:none; }` — kills the
  inherited rail and the three floating dots. The 10px top caps remain
  the single achieved/planned signal (unchanged).
- `li strong { text-wrap:pretty; overflow-wrap:break-word; hyphens:auto;
  line-height:1.05; min-width:0; }`, `span` gets `overflow-wrap` — words
  wrap (with German hyphenation) instead of clipping; no word shortened
  or hidden, dates/qualifiers unchanged.
- Same guards on `.inv-step`/`strong`/`span` (min-width, break-word,
  hyphens, pretty wrap) so the hero staircase stays safe at 768–1024.
  No visual change at 1440/390 where it already renders whole.

Width verification (static computation + guards, no recapture from here):

- 1440: bench 1280, cards ~419px; `Markteinführung` @38px ≈ 304px — fits.
- 1024 (still 3-col, above the 1020 breakpoint): bench ~897, cards
  ~291px @~27px font ≈ 216px — fits.
- 768 (2-col + spanning third): cards ~315px @26px floor — fits.
- 390 (single column, indents 0/20/40): narrowest ~295–310px @26px
  ≈ 187px — fits; `hyphens:auto` covers compounds if the user picks EN
  or zooms.

## Rest of the three pages — re-swept, no further edits needed

- Team §0: leaf studio hero type/photo vertically centered, mat
  `12/12/10` + caption even, cobalt offset quiet. §1 ledger rows even
  dividers, §3 role ledger dots + cycle bench rhythm even, milestones
  without lavender wash, footer wordmark contiguous on the left with
  mail right (shared-owned layout, reporting only). No new defect.
- Investoren §0 hero stairs whole words, §2 growth figure + short-list
  even (`Markteinführung` whole), §3 lane cards with caps only (no
  corner-dot bleed — prior `vp-lane` kill holds), cost bars aligned,
  footer contiguous. No new defect besides the fixed §1.
- Kontakt §0 desk: intro → blotter → support order preserved, blotter
  citron shadow even, direct-email pinned left; §1 constellation
  borderless/left-aligned with single 2px FAQ frames and 10px gaps;
  §2 photo inset + pilot card rhythm even. No new defect.
- No accidental global centering: deliberate left-aligned asymmetric
  layouts kept everywhere; the only centering correction remains the
  prior constellation one.

## Preservation

- No HTML changes: German/English strings, four-member roster + correct
  roles, photo-of-three, LinkedIn URLs, milestone dates +
  Erreicht/Geplant qualifiers, cost/potential figures + qual notes, form
  IDs/labels/options/required/maxlength/mailto/`?thema=` preselection,
  FAQ content, anchors/IDs, menu/tabs/CAD/algae hooks all untouched.
- Distinct identities kept (leaf studio + cobalt offset / forest
  staircase / cobalt desk + citron-shadow blotter); shared
  forest/leaf/citron/cobalt/mist palette exact; Barlow Condensed 700 +
  Open Sans; flat fills; sentence case; left aligned.
- No shared files, no other pages, no new dependencies, no new facts.

## Checks run

- Viewed the 13 images listed above via image viewer before/after
  editing (this round's edits came after viewing).
- `npm run build` passes (investoren 17.97 kB CSS bundle).
- `npm test` 6/6 passes.
- Static: 0 `linear-gradient`/`radial-gradient`, 0 `uppercase` across
  all three owned files; focus-visible rings, 16px form type, ≥44px
  targets (52px fields, 56px submit), labels/required/topic
  preselection/mailto, reduced-motion guards intact.
- `audit.json`: all 6 layouts no overflow (beyond scrollbar), no
  misaligned wrappers, no missing images, no console errors.
- `interactions.json`: menu open/close focus, DE/EN switch with link
  carry, contact topic preselection + labeled required fields intact.

## Shared/global defects observed — NOT edited (peer ownership)

- `style.css` `.roadmap-section` 2-col grid + `.roadmap-list`
  rail/dots leak into any carded roadmap (source of this round's bug;
  neutralized locally only).
- `identity.css` lavender/mint washes + large radii (neutralized locally
  where in scope).
- `visual-pages.css` lane rail/dot assumption (prior `vp-lane` kill
  holds locally).
- Footer `brand-dot`/wordmark color + homepage hero (peer-owned);
  footers in these screenshots render contiguous left wordmarks.

## Unresolved / for root recapture

- No post-fix screenshots from here: T3 `preview_open` blocked by host
  AppArmor and root owns the shared CDP tab — root recaptures final
  (please include investoren §1 at 1440/1024/768 verifying `Feldtestphase`
  + `Markteinführung` whole with no dots/rail).
- 320px + full-390 verification pending with root.
- context-mode MCP (`ctx_search`/`ctx_index`/`ctx_execute`) is not
  exposed in this subagent session's tool catalog, so no indexed
  search/indexing was possible; worked from current repo sources
  (authoritative) and made no memory claims.
- Workspace left dirty per brief; no resets/commits.
