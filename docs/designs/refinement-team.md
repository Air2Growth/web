# Refinement — team.html (2026-10-10)

Scope: `team.html`, `src/page-designs/team.css`. Shared CSS/JS and
`src/translations/en.js` untouched. User's compact direction preserved:
Thinh LinkedIn + "Head of Engineering" kept, deleted duplicate
roles/cycle/detail block stays deleted, palette/fonts/composition/claims
unchanged.

## Baseline

- Corrected audit `/tmp/a2g-refine-20261010/review1/audit.json`: team DE/EN
  at 320/390/768/1024/1440 — 0 errors, 0 overflow, 0 duplicates,
  0 broken anchors, 0 image issues. No baseline violations.
- Review1 screenshots (`team-de-1440.png`, `team-en-390.png`): leaf-studio
  hero (type left + composed print right), quiet white `#team` ledger,
  milestones ledger, partner strip, timeline, FAQ, note, cultivation photo,
  citron next card — no clipping or overlap.

## Findings (evidence-based, Playwright + Chromium --no-sandbox, port 5174)

1. Milestone heading was `h3` while it heads a sibling top-level section
   (after the `#team` `h2`). Hierarchy H1 > H2 > H3 is valid but sibling
   sections should share level. Fixed to `h2`, displayed type preserved.
2. At 320px the `.team-names` side-by-side grid (name + role columns in
   236px) wrapped 3 of 4 names to two lines and orphaned the inline arrow
   onto its own line (Felicia, Thinh). No overflow, but cramped. Fixed by
   stacking role below name at <=380px only; 390px+ side-by-side untouched.
3. Non-issues verified: `team.webp` exactly once (hero LCP,
   `fetchpriority="high"`); caption/alt, 4 LinkedIn URLs, `#main`/`#team`,
   `data-mobile-disclosure`, `vp-timeline`, `faq-stack` intact; EN
   translations keep the `<br>` (`From an idea<br>to a movement.`);
   "Ideezur"-style concatenations are textContent artifacts of `<br />`,
   not visual bugs. Editorial photo blank in full-page captures is
   lazy-load timing — after scrollIntoView it reports natural 279x186
   (320px) / 350x233 (390px). Keyboard focus stays native links/summaries
   with scoped cobalt/forest `:focus-visible`.

## Fixes

- `team.html`: milestones `<h3>Von der Idee<br />zur Bewegung.</h3>` →
  `<h2>` (text, `<br />`, indentation otherwise untouched; full-file
  reformatting deliberately skipped to keep the diff minimal).
- `src/page-designs/team.css`:
  - `.milestones h3` rule renamed to `.milestones h2` (identical
    declarations: clamp(34px, 3.4vw, 48px), tight leading).
  - Added `@media (max-width: 760px)` page-scoped
    `.milestones h2 br { display: none; }` mirroring the shared
    `style.css` (max-width:760px) `.milestones h3 br` rule that no longer
    matches — mobile heading wraps naturally exactly as before.
  - Added `@media (max-width: 380px)` stacking: `.team-names a` keeps
    grid, `span` spans `1 / -1` below the name, `strong` 23px. Content,
    order, links unchanged.

## Validation (post-fix, same harness)

- 1440/390/320 DE + 1440/390 EN: 0 console/page errors, body width ==
  viewport (no overflow), headings H1/H2/H2, team.webp x1.
- 320px detail probe: all four `strong` single-line (h=24), arrows inline
  after names, roles left-aligned below; crop `a2g-team-rows-320.png`.
- 390px unchanged: single-line side-by-side rows; milestone heading wraps
  naturally ("Von der / Idee zur Bewegung.").
- Screenshots: `/tmp/a2g-team-{de-1440,de-390,de-320,en-1440,en-390}.png`.

## Intentionally not changed

- Dead page-CSS rules for user-deleted blocks (`.detail-heading`,
  `.vp-lede`, `.vp-roles`, `.xp-cycle`, `.mobile-team-cycle`,
  `.vp-kicker`) left in place: harmless, keeps diff minimal, survive if
  blocks ever return.
- Shared files untouched. No shared/translation follow-up needed for this
  page. Known root-owned item (shared tech click/scroll override) does not
  affect team.html.

## Remaining

- None for this page. Ready for coordinator integration review.
