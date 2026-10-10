# Team — bright leaf-green founder photo studio

Subject: Air2Growth team page. Local CO₂ capture + algae cultivation +
fertilizer for farmers and partners. Audience: farmers, partners, early
hires. Job: present the real four-person team and its work cycle without
invented figures, performance claims, or launch guarantees.

Authoritative sources kept verbatim: German/English i18n strings, four
roles (Navika Bhardwaj Head of Sales, Tim Kothe Head of Science, Felicia
Kloss Head of Finance, Thinh Nguyen Hardware & Software · Head of
Engineering), LinkedIn URLs, factual founder-photo caption
(Navika/Tim/Felicia Gründungsteam — photo shows three founders, roster
lists four), awards, timeline, disclosures, anchors/IDs, JS data hooks.

## Compact plan

- Color (shared palette, exact): forest `#123D2B` ink, text, borders;
  leaf `#36CF73` studio field; citron `#DAF52F` active pill and timeline
  markers; cobalt `#284AE8` hard offset shadow, hero rule, links and focus
  on light; mist `#EFF9F1` page paper and quiet surroundings; white
  `#FFFFFF` print mat, caption, ledger cards. Flat fills only, no
  gradients. Vars `--forest, --leaf, --citron, --cobalt, --mist, --white`
  on `body[data-page="team"]`.
- Type: locally hosted Barlow Condensed 700 for bold display (h1
  clamp 56–108, h2 44–72, role names 24–30, next headline 28–40, tight
  0.95–1.05, sentence case); Open Sans for body and UI (13.5–17px,
  1.6–1.7, max ~60ch). Display type is the visual voice: oversized forest
  headlines on mist and on leaf. Left aligned throughout.
- Layout (photo studio): quiet mist masthead holds type only; leaf studio
  card holds the composed print + roster; mist holds the quiet ledgers.
  Asymmetry comes from a 1.05/0.95 print/copy split and a 1.2/0.8 hero
  type/lead split — not from centered cards.

```text
[header — structure untouched]
+-- mist masthead (flat, no photo) -------------+
| pill kicker | H1 forest huge                  |
| lead (42ch) + 72x10 cobalt rule               |
+-- leaf studio card (forest border, ----------+
|     12px hard cobalt offset)                  |
| print: white mat, forest border, 4:3 photo  | |
| factual caption bar (white, forest, left)   | |
| || copy: eyebrow + H2 forest + 2 paras      | |
| || 4 ledger rows (dividers, arrows kept)    | |
+-----------------------------------------------+
+-- mist quiet ----------------------------------+
| milestones ledger (heading + 3 awards,        |
|   forest left rules, no cards)                |
| white partner strip (grayscale off)           |
| white lede (citron left bar)                  |
| white roles ledger (dots match cycle)         |
| white cycle bench (flat, exact-palette SVG)   |
| timeline (true sequence keeps markers)        |
| 1 native FAQ + leaf-bordered note + 1 photo   |
+-----------------------------------------------+
| citron next-step card (forest border)          |
[footer — structure untouched]
```

- Principles: one focal device (leaf studio + composed print + cobalt
  offset); quiet surroundings (one lede card, one roles ledger, one cycle
  bench, one timeline, one disclosure, one photo, one next card).
  Numbering only where the content is a true sequence (field-test
  timeline); people are not numbered. Dividers and dots carry information
  (row separation; role-to-cycle mapping) instead of decorating.

## Critique against generic defaults

- First draft risked the same dark photo-overlay hero as every subpage
  (subpage-headers.css gradient over `/images/team.webp`, duplicated by
  `.team-image`) — revised: hero image hidden via scoped CSS, hero is flat
  mist type with a small cobalt rule; the founder photo lives exactly once
  as a composed white-mat print with a factual caption bar.
- Risked SaaS identical cards for four people (and a second cloned set in
  `.vp-roles`) — revised: both rosters are ledger rows with dividers.
  Team rows keep LinkedIn anchors and direction arrows; Thinh row stays
  unlinked as sourced. Role-ledger dots reuse the cycle pill colors so the
  two lists read as one system, not two card grids.
- Risked gradient washes and blobby radii from expressive-pages.css
  (radial + linear washes, 70px organic corners, stripe ::after) —
  revised: all flat fills, 16–22px purposeful radii, hard 12px cobalt
  offset (box-shadow, not blur), decorative ::before/::after removed.
- Risked tracked all-caps micro-labels (8px photo label, 7px award
  labels) — revised: 13–14px sentence-case labels in forest/cobalt.
- Risked a single-word colored headline accent (`<em>` in h2) — revised:
  `em` inherits forest, italic only.
- Kept timeline dots because the field-test path really is sequential;
  no other decorative numbering added.
- Considered a dark forest studio (high drama) and rejected it: the brief
  pins a bright leaf-green studio, and forest-on-leaf (5.98:1) keeps bold
  forest type readable where white-on-forest would demand a dark card.

## What changed (owned files only)

- `team.html`: added `/src/page-designs/team.css` link after the two
  existing stylesheets; wrapped hero inner in `tm-hero-grid` /
  `tm-hero-type` / `tm-hero-side` + aria-hidden `tm-hero-rule` (all
  visible German strings, h1, lead, anchors unchanged); recolored the
  inline `xp-ring` SVG attributes to the exact palette (forest `#123D2B`,
  leaf `#36CF73`, citron `#DAF52F`, cobalt `#284AE8`, mist/white —
  orbit forest, Navika/Felicia forest pills + citron dots/text, Tim white
  pill + cobalt dot, Thinh citron pill + forest dot, sprout leaf).
  Heading order, `#main`, `#team`, `#xp-t-ring/t/orbit`, `data-reveal`,
  `data-mobile-disclosure`, `vp-timeline`, `faq-stack`, photo alt/caption,
  Thinh role text, all links and disclosures preserved.
- `src/page-designs/team.css` (new): all selectors scoped under
  `body[data-page="team"]`; flat palette; 320px→desktop responsive
  (studio stacks, ledgers go single-column, print keeps 4:3, cycle SVG
  yields to the existing `mobile-team-cycle` list on small screens without
  page overflow); scoped override restores team sections hidden by the
  shared phone simplifier (image, copy, milestones, recognition, heading,
  lede, roles, cycle, editorial photo) so no content is hidden to
  simplify; cobalt focus on mist/white, forest focus on the leaf studio;
  `prefers-reduced-motion` disables all motion.
- `docs/designs/team.md` (this file).

## Checks run

- `npm run build` passes; page CSS bundled as `assets/team-*.css`.
- `npm test` passes (6/6 language tests).
- Scoped-CSS audit via sandbox: 0 `linear-gradient`/`radial-gradient`,
  0 `uppercase`, 0 unscoped rule opens.
- HTML audit via sandbox: `team.css` linked; headings h1,h2,h3,h2
  (pre-existing order preserved); `#main/#team/#xp-t-ring/#xp-t-orbit/
  #xp-t-ring-t` present; 3 `data-reveal`, `data-mobile-disclosure`,
  `vp-timeline`, `faq-stack` present; founder alt + caption + Thinh role
  + 3 LinkedIn URLs intact; loose `</svg\s*>` count balanced 11/11
  (strict `</svg>` undercounts pre-existing `</svg >` formatting).
- Contrast (computed): forest/leaf 5.98, forest/citron 9.89,
  white/forest 12.15, white/cobalt 6.49, cobalt/mist 6.02, forest/mist
  11.28, forest/white 12.15 — all ≥ 4.5. Cobalt-on-leaf avoided for text
  (3.19); leaf-surface text and focus use forest.

## Unresolved

- No visual screenshot check: no desktop browser connected to this
  session and the root coordinator reported an AppArmor sandbox block for
  `preview_open`. Host browser security settings were not altered. Root
  will perform integration checks.
- Pre-existing heading order (milestones h3 before detail h2) and the
  shared phone simplifier hiding non-team content (e.g. page-next label)
  were left as sourced; only team-owned sections are restored in the
  scoped file. Flagging for root integration, not fixing here to avoid
  touching shared files.

## Final review revision (2026-10-09, review-final)

Root finding: hero was a giant mist text masthead with a tiny cobalt
rule; the photo began only at y~735 mobile / 730 desktop. Brief
requires a bright leaf-green founder photo studio that opens with a
composed print and bold type. Read
`/tmp/a2g-later-pages-review/team-1440.png` and `-390.png` to confirm
(mist masthead, lead right of H1 on desktop / below H1 on mobile,
green card starts far down).

Fix (owned files only, existing image moved not duplicated):

- `team.html`: removed the hidden `subpage-hero-image` (`/images/team.webp`
  `alt=""`) so the photo lives exactly once. Moved the existing
  `.team-image` figure (same `src`, same factual alt
  `Navika Bhardwaj, Tim Kothe und Felicia Kloss, das Gründungsteam von
  Air2Growth`, same caption `Navika, Tim und Felicia · Das
  Gründungsteam`) into `tm-hero-grid` as `.team-image.tm-hero-photo`
  right of the type column. Moved the existing `page-lead` beneath H1
  left (`tm-hero-type` now holds label + H1 + lead + cobalt rule);
  deleted the now-empty `tm-hero-side`. No string, link, LinkedIn URL,
  role, heading-order, anchor, ID, or disclosure change. `loading="lazy"`
  became `fetchpriority="high"` + `decoding="async"` because the print
  is now the LCP; `width/height` kept.
- `src/page-designs/team.css`: focal device moved from `#team` to the
  hero. `tm-hero-grid` is now the leaf studio card (leaf fill, forest
  3px border, 22px radius, 12px hard cobalt offset, 0.92/1.08
  type/photo split). `#team` is quieted to a white ledger (2px forest
  border, 18px radius, no offset, single column) so the page no longer
  opens with text and repeats a second giant colored card. Hero photo
  keeps the white-mat 4:3 print + factual caption bar. Focus swapped
  accordingly (forest on leaf hero, cobalt on white `#team`). Phone
  restore for `.team-image` now unhides the hero print; responsive
  stacks to 1fr at ≤960px with a smaller 8px offset at ≤560px.
- Plan update: wireframe is now `[leaf hero: type left + print right]`
  then `[quiet white #team ledger]` then mist surroundings. One focal
  device preserved, surroundings quieter.

Critique: first revision spent the leaf/cobalt identity below the fold
and left the first screen as generic mist type — the same templated
masthead any subpage could use. Revised because the brief pins the
photo studio as the opener and root measured the photo starting ~730px
down. Rejected duplicating the photo (would fork alt/caption and double
LCP weight); moved the node instead. Rejected a dark forest studio;
forest-on-leaf keeps 5.98:1 bold type readable.

Checks re-run: `npm run build` passes (`assets/team-*.css` 13.65 kB);
`npm test` 6/6; `team.webp` appears exactly once; `subpage-hero-image`
0; `tm-hero-side` 0; `tm-hero-photo` 1; caption/alt/3 LinkedIns/Thinh
role/`#main/#team/#xp-t-ring` intact; 0 gradients; 0 `uppercase`; 0
unscoped rule opens (comma fragments inside `:is()` are still scoped);
contrast pairs unchanged (forest/leaf 5.98, forest/citron 9.89,
white/forest 12.15, white/cobalt 6.49, cobalt/mist 6.02).
