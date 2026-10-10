# Shared design tokens (all seven expressive pages)

Owner: coordinator/home worker. This file is the contract; page files must
not redefine these values.

## Palette (exact)

| Token      | Value   | Use                                     |
| ---------- | ------- | --------------------------------------- |
| `--forest` | #123D2B | Ink, dark surfaces, poster borders      |
| `--leaf`   | #36CF73 | Home poster field, growth accents       |
| `--citron` | #DAF52F | Stickers, highlights, light CTA surface |
| `--cobalt` | #284AE8 | Actions, links, progress, focus on light|
| `--mist`   | #EFF9F1 | Page paper                              |
| `--white`  | #FFFFFF | Cards, caption bars                     |

Canonical remaps in `src/design-system.css` (so every legacy token resolves
here): `--paper`=`--mist`, `--green`=`--forest`, `--lime`=`--citron`,
`--algae`=`--leaf`, `--solar`=`--citron`, `--violet`=`--cobalt`,
`--muted`=#2E5541 (7.8:1 on mist), `--line`=#B9DCC3 (decorative hairlines).

Checked pairs: forest on leaf 5.98:1, forest on citron 9.89:1, white on
forest 12.15:1, white on cobalt 6.49:1, cobalt on mist 6.02:1,
cobalt on leaf 3.19:1 (focus ring only; leaf-surface focus uses forest).

## Type

- Display: locally hosted Barlow Condensed 700 (`--display`), sentence-case
  eyebrows always, poster headlines may uppercase via CSS only (DOM strings
  unchanged, i18n safe).
- Body/UI: Open Sans (`--body`). Prose max 72ch.

## Globals only in `src/design-system.css`

Tokens, base body, display/body type scale, sentence-case eyebrows, header /
nav / language-switch active states, `.button` + `.button.lime`, quiet footer,
cobalt `:focus-visible` (3px + 3px offset), selection, reduced-motion guard.
No page composition: no hero, scene, card, ledger, or section layouts.

## Page directions (one memorable device each)

- index (home): leaf poster, giant carbon-to-crop type + field-photo collage.
- produkt: citron hardware studio.
- technologie: cobalt process lab.
- vortele: financial ledger.
- team: photo studio.
- investoren: forest staircase.
- kontakt: cobalt form desk.

## Rules for every page file

- Selectors prefixed `body[data-page="<page>"]`; linked only from its own
  HTML head as `/src/page-designs/<page>.css`; never import another page CSS
  in `main.js`.
- No photo-overlay heroes, no repeated card grids, no decorative gradients,
  no all-caps labels, no gratuitous numbers, no single-word headline accents.
- Preserve heading hierarchy, i18n strings, disclosures, anchors/IDs, links,
  JS data hooks, CAD controls, tab/form behavior. Markup may be rearranged,
  never thinned to simplify.
- Responsive from 320px, visible focus, contrast-checked, reduced-motion safe.
