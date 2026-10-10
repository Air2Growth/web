# Technologie — cobalt process lab

Subject: Air2Growth technology page. Local CO₂ capture + algae cultivation +
fertilizer. Audience: farmers and partners. Job: make the six real sequential
stages memorable while keeping every tab/data hook, disclosure, anchor and
i18n string functional.

## Compact plan

- Color (shared palette, exact): forest `#123D2B` ink and text; cobalt
  `#284AE8` lab bench field; white `#FFFFFF` headings on cobalt; citron
  `#DAF52F` active-step and flow signal; leaf `#36CF73` growth signal;
  mist `#EFF9F1` quiet surroundings. Flat fills only, no gradients.
  Vars `--forest, --leaf, --citron, --cobalt, --mist, --white`.
- Type: locally hosted Barlow Condensed 700 for bold display (h1/h2/h3,
  step numerals, next-step headline); Open Sans for body and UI. Display
  type is the visual voice: oversized white condensed headings on cobalt,
  sentence-case kickers, left aligned, line lengths under ~60ch.
- Layout (lab board): cobalt bench holds the whole process; white specimen
  card holds the live panel; mist holds the quiet chapters. Left aligned
  throughout.

```text
+-- cobalt bench (flat, full-bleed) -------------+
| H1 white bold      | lead + citron rule       |
| duct: 01 Luft - 02 Filter - 03 Lösung -       |
|       04 Algen - 05 Biomasse - [06 Dünger]    |
+-- step rail (white) | specimen card (white) ---+
| 01 active, citron   | flow pills + reactor     |
| 02..06 quiet white  | kicker / title / desc    |
+-- mist quiet ----------------------------------+
| equation strip | TRL note | 1 FAQ | photo    |
+-----------------------------------------------+
| citron next-step card                         |
+-----------------------------------------------+
```

- Principles: one focal device (cobalt bench + citron duct); quiet
  surroundings (single equation strip, single disclosure, one photo, one
  next card). Numbering only where the content is a true sequence (01–06
  steps, justified). No photo-overlay hero, no identical cards, no
  decorative gradients, no all-caps labels, no gratuitous numbers, no
  single-word colored headline accents.

## Critique against generic defaults

- First draft risked another photo-overlay hero (same as every subpage) —
  revised: removed the generic laboratory stock photo, replaced with an
  authored flat bench duct (aria-hidden schematic, factual nouns only).
- Risked SaaS identical cards for the equation — revised: single bordered
  bench strip with a forest result cell, not four cards.
- Risked tracked all-caps eyebrows — revised: sentence-case 13–15px
  kickers in cobalt/forest.
- Risked one-word headline accent color — revised: headings stay fully
  white on cobalt / fully forest on mist.
- Kept 01–06 numerals because the process really is sequential; no other
  decorative numbering added.

## What changed (owned files only)

- `technologie.html`: added `/src/page-designs/technologie.css` link;
  recomposed hero (removed stock laboratory photo, added `tech-lab-copy`
  grid + aria-hidden `tech-duct` SVG using only factual nouns
  Luft/Filter/Lösung/Algen/Biomasse/Dünger already present in i18n keys);
  wrapped `process-layout` in `tech-board`. All visible German strings,
  heading hierarchy, `#technologie`, tab roles/`data-step`/`aria-*`,
  `#process-panel`, `#process-kicker/title/description`, flow/reactor
  hooks, FAQ disclosure, anchors, links and editorial photo unchanged.
- `src/page-designs/technologie.css` (new): all selectors scoped under
  `body[data-page="technologie"]`; flat palette; 320px→desktop responsive
  (rail stacks, tabs ≥64px targets, duct scrolls internally at 320–560px
  without page overflow); visible citron/cobalt focus rings;
  `prefers-reduced-motion` disables all motion.
- `docs/designs/technologie.md` (this file).

## Checks run

- `npm run build` passes; page CSS bundled as `assets/technologie-*.css`.
- `npm test` passes (6/6 language tests).
- HTML parser check: balanced tags, 6/6 `data-step` tabs, tablist/tabpanel
  roles, all JS hooks present.
- Contrast (computed): white/cobalt 6.49, forest/citron 9.89,
  forest/white 12.15, forest/mist 11.28, small text `#2c4a3c`/white 9.76 —
  all ≥ 4.5.
- No `linear-gradient`/`radial-gradient` in page CSS; no `uppercase`.

## Unresolved

- No visual screenshot check: no desktop browser connected to this session
  (`browser.tabs.list` / `preview` return `browser.disconnected`), and the
  root coordinator reported an AppArmor sandbox block for `preview_open`.
  Host browser security settings were not altered. Root will perform
  integration checks.
