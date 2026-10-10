# Spacing pass — Team / Investoren / Kontakt (2026-10-09)

Scope: `src/page-designs/team.css`, `src/page-designs/investoren.css`,
`src/page-designs/kontakt.css` only. No HTML wrapper changes (DOM/order
already correct); no shared-CSS/home edits; no new facts, strings, links,
anchors, or hooks.

## Visual evidence actually viewed

Read via image viewer before editing (all 1440 + 390):

- team: section-0 (leaf hero: 4-line H1 left, photo right, dead green space
  under lead), section-1 (white ledger, copy narrow left / wide empty right),
  section-2 (lavender milestones wash + white partner strip),
  section-3 (detail heading 2-col, citron-lede, lavender role rows),
  section-4/5 (cycle bench, seedlings photo, citron next card), footer.
- investoren: section-0 (forest hero, bottom-aligned stairs, top whitespace),
  section-1 (roadmap bench + growth SVG white card), section-2/3 (lane cards
  with corner-dot bleed, cost bars, potential cells), section-4 (lab inset,
  white next card), footer.
- kontakt: section-0 (cobalt desk, left intro+support taller than blotter,
  empty cobalt under blotter), section-1 (dotted constellation + FAQ double
  borders), section-2/3 (photo inset, pilot 01/02/03, checks card), 390
  section-0/1/2 (intro → blotter → support order correct), footers.

## Defects found and fixed (owned files only)

Team (`team.css`):

- Hero dead space: grid `align-items:start` locked the photo to the top
  while the 56–108px 4-line H1 + lead ran tall, leaving empty leaf below
  the cobalt rule. Fixed: `align-items:center`, photo `align-self:center`,
  grid gap 3.5vw→3vw, padding 3vw/44px→2.6vw/36px, lead margin 18→14px
  and 42ch→44ch. Deliberate left-aligned asymmetry kept; no centering
  of text.
- Photo mat/caption inset uneven: mat 12px all sides + caption 12/4/4.
  Fixed: mat `12px 12px 10px`, caption `margin-top:10px; padding:10px 4px 2px`.
- Ledger dead space: `#team` padding 3vw/40px + margin-bottom 48px with
  56ch copy in a 1320px card. Fixed: padding 2.6vw/32px, margin-bottom
  32px, copy 64ch/14px rhythm, ledger rows 15→13px + explicit white
  background (kills inherited lavender from `identity.css .vp-roles > div`).
- Lavender milestones wash: inherited `identity.css .milestones`
  (`#dcd5f5`, 28px radius, 40px padding) showed through because the scoped
  rule set no background. Fixed: explicit `background:transparent;
  background-image:none; border:0; border-radius:0; box-shadow:none`,
  padding 20/28px, gap 2.5vw→2vw, award inset 18→16px, h3 margin 12→8px.
- Recognition looseness: gap 18/30 + padding 20/26. Fixed: 12/24 + 16/22px.
- Detail gutter: shared `.detail-heading` gap is 70px; scoped 3vw/56px
  still wide at 1440. Fixed: 2.4vw/40px, margin-bottom 26→20px.
- Role rows: explicit white + no-image backgrounds; first/last radius
  preserved via container overflow hidden.
- Cycle bench air: padding 3vw/32px→2.4vw/24px, caption 14→12px.
- Timeline/photo/next: `vp-figure` neutralized to transparent/no-border
  (was inheriting `identity.css .vp-figure #e0eee8` + 30px radius on the
  team timeline), margin 30→24px; editorial margin-bottom 44→32px,
  caption 16→12px; next-card padding 22→20px + no-image guard.
- FAQ hairlines: stack now `display:grid; gap:10px` with `[open]` pinned
  to white (kills `identity.css .faq details[open]` mint wash on ties).
- Mobile (≤560px) paddings unchanged except inherited tightening; 390
  hero stacks type → photo correctly.

Investoren (`investoren.css`):

- Hero stairs alignment/text insets: `align-items:end` bottom-locked short
  stairs under a very tall 64–144px H1, leaving top whitespace; step
  padding 14/14/16 with 6px internal gap felt cramped at the top.
  Fixed: `align-items:center`, gap 4vw→3vw, H1 8.6vw/144px→7.6vw/120px,
  lead 24→20px + 44→46ch, steps `16px 16px 14px` + 8px gap, pill
  margin-top 2→4px. Staircase heights/indents and citron/white/cobalt
  achieved-vs-planned language untouched.
- Roadmap duplication spacing: bench padding 4vw/56px + 5vw/72px with
  list margin 34px made the fourth restatement (hero stairs → roadmap
  → growth-ol → vp-lane) heavy. Fixed: bench `3vw/40px + 4vw/56px`,
  copy margin 18→16px, CTA 22→18px, list margin 34→28px, gap 14→12px,
  card padding 20/22/22→18/20/20.
- Growth middle: figure padding 2.6vw/28→2vw/22px, caption 12→8px,
  short-list margin 14→10px, gap 12→10px, rows 14/18→12/16px.
- Lane corner-dot bleed (the clearest shared defect in scope): shared
  `visual-pages.css .vp-lane::before` rail + `li::before` dots rendered
  on top of the scoped cards' 8px top caps (dots visibly overlapping
  card corners in section-3). Fixed: `position:static` +
  `content:none; display:none` on `::before/::after` for lane and items;
  caps remain the single achieved/planned signal. Lane gap 12→10px,
  padding 18/20→16/18px, tag margin 14→10px.
- Cost/potential: rows 16/20→14/18px, gap 16→12px; potential 12→10px
  gaps, padding 18/20→16/18px; figcaption 16→14px.
- Lab inset: padding 14/14/18→12/12/14px + explicit `margin-bottom:40px`
  (was 56px inherited rhythm); caption 12→10px.
- Detail top: `padding-block:8px …` cramped the H2 against the growth
  section hairline. Fixed: 16px top, bottom 5vw/72→4vw/56px.
- Mobile indents (0/16/32, 12/24 ≤380px) and 390 stacking verified in
  screenshots; left as designed.

Kontakt (`kontakt.css`):

- Desk imbalance (the brief's tall-left/empty-right): left column
  (intro + support copy + 16px channel rows + 3vw/36px dividers) ran
  ~1433px tall vs a shorter blotter, leaving empty cobalt under the
  form. Fixed while preserving intro → blotter → support DOM/keyboard
  order: desk padding 5.5vw/84 + 6vw/92 → 4.5vw/68 + 4vw/64px, grid gap
  4.5vw/72→3.5vw/56px, lead 24→16px (36→38ch for calmer rag),
  `kt-copy` margin 3vw/36→2vw/24px + padding 2.5vw/28→16px, channels
  margin 3vw/36→2vw/24px, rows 16→12px + transparent background,
  location 16/6→12/4px.
- Blotter air: padding 3vw/40→2.4vw/32px, callout margin 22→18px,
  labels 16/8→14/6px, textarea 132→120px, submit 22→18px, status
  16→12px, direct-email 14→10px + pinned left/start (was rendering
  centered from inheritance). All controls keep ≥44px targets (52px
  fields, 56px submit), labels/required/topic-preselection/mailto
  untouched.
- Constellation duplicate border: inherited 1px border + `40px 28px`
  radius framed the dotted panel (audit: border 1px, radius 40/28).
  Fixed: `border:0; border-radius:0; box-shadow:none;
  background:transparent; ::before/::after none`, padding 4vw/48→3vw/32px
  top only. SVG + caption left-aligned to the page's left-aligned
  identity (was `text-align:center` + auto margins — the one accidental
  centering corrected; nothing else centered).
- FAQ double borders: stacked 2px-bordered items with 0 gap rendered
  4px seams. Fixed: stack `display:grid; gap:10px` + zeroed
  margin/border/padding on the stack, items keep single 2px frames.
- Photo inset: padding 14/14/18→12/12/14px + `margin-bottom:40px`,
  caption left-aligned.
- Checks card: rows had no scoped padding (inherited roomy). Fixed:
  stack `display:grid; gap:10px`, rows `12px 16px; margin:0` +
  no-image guards. `inquiry-form` explicitly reset to
  transparent/borderless/paddingless (kills `identity.css .inquiry-form`
  mint `#d6f0e7` + 30px radius + 35px padding that otherwise doubles the
  blotter frame).
- 390 order intro → blotter → support confirmed in screenshots; no DOM
  moves.

## Shared/global defects observed — NOT edited (peer ownership)

- Footer wordmark distance: `air 2 growth .` sits far from
  `From Carbon to Crop.` at 1440 on all pages (flex `footer-top` with
  wide `space-between`-style separation; e.g. team-1440-footer). Owned
  by the shared peer (style.css `.footer-top`); reporting only.
- `identity.css` unscoped lavender (`#dcd5f5` on `.milestones` and
  `.vp-roles > div`), mint washes (`.vp-figure #e0eee8`,
  `.faq details[open] #d6f0e7`, `.inquiry-form #d6f0e7`), and 28–30px
  radii leak into every scoped page; neutralized locally where in
  scope, but the source remains for other pages.
- `visual-pages.css` lane rail/dots assume an uncarded lane; any other
  page that cards `.vp-lane` inherits the same corner-dot bleed.
- Footer `brand-dot` color and homepage hero card design are peer-owned;
  untouched.

## Preservation

- No HTML edits: all German/English strings, four-member roster + roles,
  photo-of-three alt/caption (`team.webp` once), LinkedIn URLs, Thinh
  unlinked row, milestone dates + Erreicht/Geplant qualifiers, cost/potential
  figures + qual notes, form IDs/labels/options/required/maxlength/mailto/
  `?thema=` preselection/`#anfrage`, FAQ content, anchors/IDs
  (`#main/#team/#roadmap/#anfrage`, `data-reveal`, disclosures), menu/tabs/
  CAD/algae hooks, header/footer structure unchanged.
- Distinct identities kept: leaf studio + cobalt offset (team), forest
  staircase (investoren), cobalt desk + citron-shadow blotter (kontakt);
  shared forest/leaf/citron/cobalt/mist palette exact; Barlow Condensed
  700 display + Open Sans body; flat fills, sentence case, left aligned
  (single constellation exception corrected to left).
- Asymmetric layouts preserved (hero type/photo split, detail H2/para
  split, desk 0.92/1.08 columns); only accidental centering removed.

## Checks run

- Viewed: team 1440 §0–5 + footer; investoren 1440 §0–4 + footer;
  kontakt 1440 §0–4; team/investoren/kontakt 390 §0 (+kontakt §1–2).
- `npm run build` passes (team 14.13 kB, investoren 17.50 kB,
  kontakt 9.65 kB CSS bundles).
- `npm test` 6/6 passes.
- Static: 0 `linear-gradient`/`radial-gradient`, 0 `uppercase` in all
  three owned files; focus-visible (cobalt light / citron + forest on
  dark), 16px form type, ≥44px targets, reduced-motion guards intact.
- HTML wrappers intentionally unwound: no wrapper correction was
  meaningful (grid parents already correct; all defects were rule-level).

## Unresolved / for root recapture

- No post-fix screenshots: T3 `preview_open` blocked by host AppArmor
  (as briefed); root owns the browser and recaptures. 320px and full-390
  verification pending with root.
- context-mode MCP (`ctx_search`/`ctx_index`/`ctx_execute`) not exposed
  in this subagent session catalog — worked from current repo sources
  (authoritative) and indexed nothing; no memory claims made.
- `src/page-designs/` + `docs/designs/` remain untracked working-tree
  files (prior pass created, never committed); workspace left dirty per
  brief, no resets/commits.
