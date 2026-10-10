# Review final — team + investoren refinement (2026-10-09)

Scope: final T3-owned design review/refinement agent. Owns for mutations
only `team.html`, `investoren.html`, `src/page-designs/team.css`,
`src/page-designs/investoren.css`, `docs/designs/team.md`,
`docs/designs/investoren.md`, `docs/designs/review-final.md` (this file),
`DESIGN.md`, `README.md`. Both page workers confirmed completed with no
pending child runs. Contact reviewer owns `kontakt.html`/CSS; untouched.
No nested agents, no commits, no files outside ownership edited.

Skill: `/root/.codex/skills/frontend-design/SKILL.md` read (plan →
critique → build → critique, one memorable device per page, quiet
surroundings, no generic defaults). Context-mode: read
`/root/.config/opencode/AGENTS.md` and exact upstream
`/root/.config/opencode/instructions/context-mode/AGENTS.md`; followed
stdio MCP routing (sandboxed analysis via `ctx_execute`, memory via
`ctx_search`, handoff via `ctx_index`). Current repository sources treated
as authoritative. T3 preview unavailable (AppArmor sandbox block reported
by root); host browser security untouched; Chrome CDP on localhost:9223
not operated (root owns browser).

## Evidence read (no screenshots taken)

- `/tmp/a2g-later-pages-review/team-1440.png`: mist masthead (pill + huge
  forest H1 left, lead + tiny cobalt rule right), green studio card starts
  far below with founder print left. First screen is text, not a photo
  studio.
- `/tmp/a2g-later-pages-review/team-390.png`: same — H1 + lead + rule fill
  the first screen, photo begins below the fold.
- `/tmp/a2g-later-pages-review/investoren-1440.png`: forest hero, monumental
  white H1, lead with citron rule, three empty blocks (citron / outline /
  cobalt) right — no dates, no status.
- `/tmp/a2g-later-pages-review/investoren-390.png`: H1 breaks
  `Weitergedacht` into `Weitergedach` + `t im Feld.`; empty blocks stack
  below the lead. Clear typographic defect + empty-device defect.
- Root runtime evidence trusted (not re-run here): first four pages passed
  320/390/1440 + 768/1024 layouts, six process tabs, keyboard Home, native
  CAD 000→035, algae controls, menu focus/Escape, DE/EN preservation,
  reduced-motion; team/investor 320/390/1440 layout metrics + menu/language
  pass; contact native validation/labels/Pitch Deck query pass. I claim
  only the four PNG reads above plus build/test/static audits below.

## Findings → resolutions

### Team: photo opens the page now

Finding: hero a giant mist text masthead with tiny cobalt rule; photo at
y~735 mobile / 730 desktop. Brief demands a bright leaf-green founder
photo studio opening with a composed print and bold type.

Resolution:

- Moved the existing `.team-image` (same src/alt/caption) into the hero
  as `.team-image.tm-hero-photo`; removed the hidden `subpage-hero-image`
  so the photo lives exactly once. Moved `page-lead` beneath H1 left.
- `tm-hero-grid` is now the leaf studio card (leaf, forest border, hard
  cobalt offset); `#team` quieted to a white ledger (no second giant
  card). Focus swapped (forest on leaf, cobalt on white). Responsive
  stacks at ≤960px; phone restore unhides the hero print.
- Preserved: four-person roster/roles, 3 LinkedIn URLs, Thinh unlinked row
  as sourced, caption/alt, heading order (h1,h2,h3,h2 as sourced),
  `#main/#team/#xp-t-ring/#xp-t-orbit`, `data-reveal`,
  `data-mobile-disclosure`, timeline, FAQ, all i18n strings.

### Investoren: word fits + stairs communicates

Finding 1: `Weitergedach` + `t im Feld.` split at 390px.
Resolution: H1 `hyphens:none; overflow-wrap:normal; word-break:normal`;
≤760px `clamp(42px,12vw,64px)` + `max-width:100%` + `text-wrap:pretty`;
≤380px `clamp(40px,12vw,48px)`. Estimates: 246px/280 at 320, 253px/320
at 360, 274px/350 at 390 — whole word fits 320+. Previous 66px at 390px
(~386px) forced the split.

Finding 2: `.inv-stairs` three empty blocks repeating the staircase below.
Resolution: replaced with `ol.inv-stairs` (`aria-label="Meilensteine
kurz"`) of three labelled steps reusing sourced strings only —
September 2026 / TRL 4 & Start der Feldtestphase / Erreicht; Dezember
2026 · geplant / Kunden-Onboarding / Geplant; März 2027 · geplant /
Markteinführung Air2Growth / Geplant. Chronology + planned qualification
kept; `roadmap-list`/`vp-lane`/costs/pitch-deck links/hooks unchanged.
Steps keep flat fills + stepped heights on desktop, indent-stacked single
column on mobile. All strings exist in `src/translations/en.js`.

## Actual checks run

- `npm run build` passes (Vite 8.3.4, 171ms): `dist/team.html` 24.12 kB,
  `dist/investoren.html` 19.88 kB, `assets/team-*.css` 13.65 kB,
  `assets/investoren-*.css` 16.81 kB, plus 5 other pages.
- `npm test` 6/6 pass.
- Sandbox audits: `team.webp` exactly once (team), 0 `subpage-hero-image`
  (both), 1 `tm-hero-photo` / 0 `tm-hero-side`, `inv-step li` 3 / empty
  spans 0, caption/alt/3 LinkedIns/Thinh role intact, milestones + 2
  pitch-deck hrefs intact, `#main/#team/#xp-t-ring` + `#roadmap/
  #xp-i-stages/vp-lane/vp-cost/faq-item/laboratory.webp/#year` intact,
  heading orders preserved, no duplicate IDs, 0 `linear-gradient`/
  `radial-gradient`, 0 `text-transform: uppercase`, 0 unscoped rule opens
  in both page CSS files (comma fragments inside `:is()` are scoped).
- Contrast (computed): forest/leaf 5.98, forest/citron 9.89, white/forest
  12.15, white/cobalt 6.49, cobalt/mist 6.02, forest/mist 11.28,
  forest/white 12.15 — text pairs ≥ 4.5; cobalt-on-leaf avoided.
- `ctx_search` retrieved `team-design-handoff`, `investoren-design-handoff`,
  `index-page-handoff`, `a2g-r4-review-decision` — assessed; sources
  authoritative. Handoff indexed as `review-final-handoff` (if the index
  call errors, this file is the handoff record).
- `git status`: only owned files changed by me; sibling dirty work
  preserved (large `team.html`/`investoren.html` diffs pre-date this pass;
  my regions are hero + stairs + moved image only).

## Unresolved / limitations (honest)

- No post-fix screenshots: no preview/browser tool in this catalog; T3
  preview AppArmor-blocked; CDP not operated. I read the four provided
  PNGs only. Root to capture new 320/390/1440 screenshots and verify the
  hero print opens on team + the whole `Weitergedacht` fits + hero stairs
  labels read at all widths.
- Pre-existing team heading order (milestones h3 before detail h2) left as
  sourced to avoid touching shared structure.
- `DESIGN.md`/`README.md` updates are docs-only (below); no visual change.
