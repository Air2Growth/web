# Website refinement validation — 2026-10-10

## Production-build browser gate

The built site at `http://127.0.0.1:4174` contains all seven page refinements
and the shared technology-selection correction.

- 70 layouts: seven pages × German/English × 320, 390, 768, 1024, 1440px.
  No horizontal overflow, runtime/request errors, unloaded visible images,
  duplicate IDs or unresolved local hash targets. Images were scrolled into
  view and decoded before inspection.
- 14 axe WCAG A/AA checks: German desktop and English phone for each page.
  No violations, including the corrected Product and Investors contrast.
- All seven mobile menus pass open state, initial focus, Escape focus return
  and language-carrying links. Technology tabs support Home/End/arrows;
  the CAD range selects frame 035.
- Contact topic selection, empty/valid form validation, localized email
  preparation status and language-switch topic/anchor preservation pass.
- Eight desktop Technology combinations: 1024/1440px × 700/900px × DE/EN.
  Each passes six immediate and settled click choices, keyboard choices,
  and subsequent advancement by native scrolling.
- Algae controls and stored motion preference pass browser checks.
- `bun run build`, `bun run test` (6/6), and `git diff --check` pass.

Artifacts: `/tmp/a2g-refine-20261010/production-review/audit.json` and PNGs,
`step-selection.log`, and the corresponding temporary browser scripts.
T3 preview is explicitly unavailable due to AppArmor; validation used the
allowed Chromium fallback. No host settings or repository dependencies changed.

## User-edit preservation

The Team-page backup comparison confirms all four user role titles/links and
removal of the duplicate roles/cycle/detail block remain. Subsequent HTML
changes are the milestone heading level and removal of a stale label reference.
The role rows adapt only on phones at 380px or narrower.

## Overall reviews

Overall review round 1 completed with two small fixes: the stale Team
`aria-labelledby="vp-weg"` was removed, and the English contact postal address
retains the source spelling "81247 München". It independently checked desktop
and mobile layouts across all pages and the earlier refinements, with no
remaining blocking objections. See `refinement-review1.md`.

The complete result was rebuilt and the six tests passed again. A fresh final
review accepted the production build with no remaining actionable issues.
It independently rechecked all seven desktop pages, focused mobile and English
layouts, the user-edit comparison, image loading, ID references, and technology
selection. See `refinement-review2.md` for the final verdict and scope.
The rebuilt production site also passes the ID-reference scan on all seven
pages, with no missing label/control/description/label-for targets.
