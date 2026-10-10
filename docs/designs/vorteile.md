# Vorteile — citron financial ledger

Subject: Air2Growth benefits page. Local CO2 capture + algae cultivation +
fertilizer for farmers and partners. Audience: greenhouse, vertical farming
and organic farms. Job: make one-off vs recurring economics legible without
promising unqualified savings, and keep every qualified figure with its
assumption note.

## Compact plan

- Color (shared palette, exact): forest `#123D2B` ink and text; citron
  `#DAF52F` ledger focal; white `#FFFFFF` cards; mist `#EFF9F1` quiet
  surroundings; leaf `#36CF73` growth signal (hero rule, chips dots,
  cost bars, qual borders); cobalt `#284AE8` single deliberate accent
  (800 Euro potential cell, links, focus). Flat fills only, no gradients.
  Vars `--forest, --leaf, --citron, --cobalt, --mist, --white`.
- Type: locally hosted Barlow Condensed 700 for bold display (h1/h2,
  price amounts, cost/potential figures, flow numerals, next-step
  headline); Open Sans for body and UI. Display type is the visual voice:
  oversized forest condensed headings, sentence-case kickers,
  left aligned, line lengths under ~60ch.
- Layout (ledger sheet): quiet mist hero type + small leaf photo card;
  three quiet use-case rows; citron ledger sheet holds the business model;
  mist detail rows hold cost bars, cobalt potential, flow steps, two
  disclosures; small field-note photo; quiet white next card.
  Left aligned throughout, open rows, generous spacing.

```text
+-- mist hero (quiet) ---------------------+
| label(citron pill)  | [leaves 4:3 card] |
| H1 forest 60-120px left                 |
| lead + leaf left-rule                   |
+-- mist use-cases (quiet rows) -----------+
| [GH svg] [VF svg] [Bio svg] white cards |
+-- economy: copy + CITRON LEDGER (focal) -+
| H2 forest | Hardware white | 3.000 Euro  |
| lead      | Material forest| 50 Euro   |
| link cobalt | note + border-top         |
+-- mist detail (quiet) -------------------+
| H2 + leaf-rule | chips white pills      |
| cost card: 3000 forest bar / 300+50 leaf |
| potential: mist cell + COBALT 800 cell   |
| flow 1-2-3 citron numerals | 2 FAQs     |
+-- small field photo card (820px) --------+
+-- white next card (hover citron) --------+
```

- Principles: one focal device (citron ledger + cobalt 800 cell);
  quiet surroundings (single cost card, single potential strip, one
  photo, one next card). Numbering only where the content is a true
  sequence (Entnahme-Nachversorgung-Betreuung, justified). No
  photo-overlay hero, no identical cards, no decorative gradients,
  no all-caps labels, no gratuitous numbers, no single-word colored
  headline accents.

## Critique against generic defaults

- First draft risked another full-bleed farm-photo hero (same as every
  subpage) — revised: removed `subpage-hero-image`, reused `leaves.webp`
  as a 400px field-note card beside left-aligned type; `agriculture.webp`
  stays but shrinks to an 820px bordered note with Barlow caption.
- Risked SaaS identical cards for every figure — revised: ledger uses
  deliberately different grounds (white once vs forest recurring;
  mist vs cobalt potential) with ruled open rows, not four same cards.
- Risked gradient bars and blob radii from `visual-pages`/`expressive-pages`
  — revised: flat forest/leaf bars, uniform 16-20px radii, zero
  `linear-gradient`/`radial-gradient` in page CSS.
- Risked tracked all-caps eyebrows — revised: sentence-case 13px
  kickers in cobalt/forest, `text-transform: none` everywhere.
- Risked one-word headline accent color — revised: h1/h2 stay fully
  forest; citron and cobalt appear only as grounds, never as one
  colored word.
- Kept 1-2-3 numerals because Entnahme-Nachversorgung-Betreuung really
  is a recurring sequence; no other decorative numbering added.
- Kept all quantified economics with qualifiers: 3.000 Euro hardware
  einmalig, 50 Euro alle zwei Monate (300 Euro/Jahr), 7 kg/Woche Modell,
  800 Euro/Jahr Modellpotenzial plus Energie/Wasser/Betreuung note and
  "Modellwerte, kein Versprechen" — no invented payback or savings claim.

## What changed (owned files only)

- `vorteile.html`: swapped `/src/expressive-pages.css` for
  `/src/page-designs/vorteile.css`; recomposed hero (removed
  full-bleed `subpage-hero-image`, added `vt-hero-grid` +
  `vt-hero-type` + `vt-hero-photo` figure reusing `leaves.webp`
  small placement, same German strings); tagged ledger rows
  `price-once`/`price-repeat` and sheet `vt-ledger` for one-off vs
  recurring separation. All visible German strings, heading hierarchy,
  `#main`, `#wirkung`, `#xp-v-gh/vf/fc`, `xp-uses`, `vp-cost`
  (`--w` 100%/10%/1.6667%), `vp-potential`, `vp-flow`, both FAQ
  `details.faq-item`, anchors, links, `#year`, language hooks and
  editorial `agriculture.webp` alt/caption unchanged. Header/footer
  structure untouched.
- `src/page-designs/vorteile.css` (new): all selectors scoped under
  `body[data-page="vorteile"]`; flat palette; 320px→desktop responsive
  (grids stack, ledger wraps, bars stack, photo full-width, no page
  overflow); visible cobalt focus (forest + white halo on dark/citron
  grounds); `prefers-reduced-motion` disables all motion.
- `docs/designs/vorteile.md` (this file).

## Checks run

- `npm run build` passes; page CSS bundled as `assets/vorteile-*.css`
  (14.44 kB).
- `npm test` passes (6/6 language tests).
- HTML/CSS validator: 29/29 i18n strings present; `#wirkung`, `#main`,
  `price-once/repeat`, `vt-hero-photo`, 3 use-case SVGs, 2 disclosures,
  agriculture photo, next card, nav `aria-current` all present; no
  `subpage-hero-image`; no `expressive-pages.css` link.
- Contrast (computed): forest/citron 9.89, forest/mist 11.28,
  forest/white 12.15, white/cobalt 6.49, forest/leaf 5.98 — all ≥ 4.5.
- No `linear-gradient`/`radial-gradient` in page CSS; no `uppercase`.

## Unresolved

- No visual screenshot check: no desktop browser connected to this session
  (`browser.tabs.list` returns `browser.disconnected`), and the root
  coordinator reported an AppArmor sandbox block for `preview_open`.
  Host browser security settings were not altered. Root will perform
  integration checks.
