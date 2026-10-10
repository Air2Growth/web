# Product modules background correction — mist (2026-10-09)

## Request
User: “Fix the background color to match other background color in that section.”
Refers to product page “Four modules. Working together.” (`.machine-anatomy.section.wrap`)
that the previous repair left painting white (`#fff`) against pale-green/mist page
gutters and the mist diagram. Evidence: `/tmp/a2g-product-modules-final/modules-1440-en.png`
and `modules-390-en.png` show a white center band vs pale-green surround/figure.

## Intended colors (authoritative: `src/page-designs/produkt.css` header + body rule)
- Section band `.machine-anatomy`: `var(--mist)` (`#EFF9F1`), matching `body[data-page="produkt"]`
  (`background: var(--mist)`) and `.assembly-map` (`background: var(--mist)`).
- Preserved expressive module-card colors (untouched): A white, B citron (`#DAF52F`),
  C leaf (`#36CF73`), D forest (`#123D2B`).
- Subject/palette/layout per brief: Citron Hardware Studio — forest/leaf/citron/cobalt
  on mist/white; Barlow Condensed display + Open Sans body; one focal device
  (white CAD specimen card on citron in the pinned section above). Frontend-design
  skill reviewed: this change is a palette-consistency fix, not a redesign, so no
  new aesthetic direction was introduced.

## Precise patch (one property, owned file only)
- `src/page-designs/produkt.css`, `.machine-anatomy` rule (line ~472):
  `background: var(--white);` → `background: var(--mist);`
- Nothing else touched: no changes to text/semantics, responsive single-view logic
  (960/600 tiers), geometry, padding, borders, card colors, or the adjacent pinned
  CAD section. No shared files, HTML, translations, tests, or scripts modified.

## Validation
- Verified edited rule reads `background: var(--mist);` with border-top, padding-block intact.
- Verified diff scope via `git diff --stat` / `git status --short`: only
  `src/page-designs/produkt.css` modified plus this new doc; all pre-existing dirty
  work (tracked modifications + untracked `src/page-designs/`, `docs/designs/`,
  tests, etc.) preserved — no commits, resets, or new deps.
- No new tests (one-property CSS color). Build not re-run here; coordinator can fold
  into its check.
- Limitations (honest): no browser verification from this session — T3 native browser
  blocked by host AppArmor, and per brief no server/browser/security changes. Did not
  re-capture `modules-1440-en.png` / `modules-390-en.png`. Coordinator to confirm live
  computed styles (`100.106.75.0:5173/produkt.html`): `.machine-anatomy` resolves to
  `rgb(239, 249, 241)` and fresh desktop/mobile captures show a continuous mist band.

## Context-mode handoff
- Searched indexed findings (`product modules background mist`, `machine-anatomy`,
  `Four modules Working together`): prior decisions `decision-product-modules-fix`
  (2026-10-09 14:41, 960px+600px single-view logic) and `decision-product-modules-review`
  (2026-10-09 14:45, tablet C-span fix, 12 width×lang audits) assessed — consistent
  with this change, no conflict; current source (`produkt.css`) treated as authoritative.
- Knowledge MCP retired 2026-10-09: no preflight/registration used. PCBParts N/A
  (no components/prices). No nested agents used.
- Suggested index: this doc as `product-modules-background` finding/decision/handoff
  for coordinator recall.

## Coordinator verification
- Fresh browser captures at 1440px and 390px show a continuous pale-green section.
- In both cases, body, `.machine-anatomy`, and `.assembly-map` compute to the same
  `rgb(239, 249, 241)` (`#EFF9F1`). Module card colors remain white/citron/leaf/forest.
- Exactly one module representation is visible; figure overflow is zero and no
  browser runtime errors were reported.
- Evidence: `/tmp/a2g-product-background-final/background.json` and
  `background-1440.png` / `background-390.png` in the same directory.
- `npm run build` and `git diff --check` pass. Temporary audit browser stopped;
  existing live Vite remains running. The initial navigation timeout was resolved
  by one bounded retry, which supplied the measured styles and captures above.
