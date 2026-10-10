# Overall website review — ROUND 1 (2026-10-10)

Review agent scope: all seven pages on branch `refine/website-20261010`.
Read: `docs/designs/refinement-{index,produkt,technologie,vorteile,team,investoren,kontakt}.md`,
`refinement-integration.md`, `refinement-validation.md`, `git diff`, live dev server `:5174`
(fallback Playwright, Chromium `--no-sandbox`). No nested agents, commits,
branches, merges, pushes, deploys, builds, or dependency/policy changes.
User preservation takes precedence over the frontend-design skill throughout.

## Fixes applied by this review (2 small, concrete)

1. **`team.html` — stale `aria-labelledby="vp-weg"` removed from `.vp-figure`.**
   The user deleted the `.vp-kicker#vp-weg` span (confirmed in
   `/tmp/a2g-refine-20261010/user-changes.patch`: `-<span class="vp-kicker"
   id="vp-weg"`); `HEAD` had it, the working tree does not. The figure has no
   `figcaption`, and the parent `details > summary` ("Unser Weg in den
   Feldtest") already names the section. Removing the dangling reference —
   rather than restoring user-deleted content or changing visible design —
   clears the single broken IDREF the `references.cjs` audit reported.
   Dead `.vp-kicker` CSS left in place per the team worker's minimal-diff rule.
2. **`src/translations/en.js` — postal address keeps source spelling.**
   `"81247 München": "81247 Munich"` → `"81247 München": "81247 München"`.
   Live EN kontakt now renders postal `Air2Growth / Sedelhofstraße 13 /
   81247 München` (source spelling) while prose correctly translates
   ("Developed in Munich"). `Sedelhofstraße` has no EN key and was already
   untouched. All other `Munich` renderings are prose sentences, not postal
   addresses, and are kept.

Shared JS (`src/scroll.js` instant `process-select`, `src/main.js` keyboard
dispatch of the same event) verified present and **untouched**. The one
remaining `behavior: "smooth"` in `scroll.js` belongs to generic
`[data-chapter-go]` buttons, not the technologie selector — preserved.

## Rechecks (all passing)

- **IDREFs:** static scan + live-DOM recheck of all 7 pages DE: 0 broken
  references, 0 duplicate IDs (was exactly 1: team `vp-weg`).
- **Responsive:** 14 mobile runs (7 pages × 390/320 DE) clean — body width ==
  viewport, no overflow, no page errors. Desktop 14 runs (7 × DE/EN 1440)
  clean, H1s correct both languages, no image failures after scroll-decode.
- **Prior worker fixes confirmed live:** produkt mobile-map subtitles forest
  (A/B 0.85, C full opacity, D white); technologie `.flow-arrow--trail`
  `display:none` at 320px; team rows stacked below names at 320px, all four
  `strong` single-line 24px; investoren steps Barlow 23px with word-boundary
  wraps only, cobalt qualifier `rgb(255,255,255)`; produkt EN CTA "Explore the
  system" + CAD alts present.
- **Keyboard/scroll:** technologie ArrowRight 0→1 with roving tabindex,
  tab-5 click `data-active="5"` within 250ms (instant, no intermediate
  cycling). Back-to-top `href="#"` and tabpanel `tabindex` non-issues
  re-confirmed by design (native scroll / keyboard reading).
- **Sticky scenes:** viewport (not full-page) shots
  `/tmp/a2g-review1-{index-scene,tech-stage,produkt-cad}.png` render correctly:
  index 02 algae stage, technologie 01 bench, produkt 01 CAD with slider.
- **Copy preservation:** `Jugend Gründet` source spelling in EN, `UnternehmerTUM`,
  Thinh LinkedIn + "Head of Engineering", deleted duplicate roles/cycle/detail
  block still absent, team photo caption still absent per user, static vs
  interactive CAD both retained, mobile-simplify hidden content left as the
  authoritative shared behavior.

## Changed files (this review)

- `team.html` (1 attribute removed)
- `src/translations/en.js` (1 translation value)
- `docs/designs/refinement-review1.md` (this file)

All other modified files (`src/main.js`, `src/scroll.js`,
`src/page-designs/{produkt,technologie,team,investoren}.css`,
`technologie.html`, remainder of `en.js`) are prior worker/coordinator changes,
reviewed but not touched. `index.html`, `vorteile.html`, `kontakt.html`,
`kontakt.css`, `vorteile.css`, `index.css` remain clean per worker verdicts.

## Remaining objections

None blocking. Non-actionable notes for the coordinator: the vorteile worker's
shared-simplification observation (hidden cost/flow art on phones) is
committed global behavior, out of review scope — no change made; investoren
`.vp-potential strong small` shared-rule footprint suggestion stands as
follow-up, already mitigated per-page.
