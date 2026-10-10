# Product module section: final validation

Date: 2026-10-09. Request: fix “Four modules. Working together.” on the product page.

The scoped repair in `src/page-designs/produkt.css` shows the schematic above 960px and the readable module map at or below 960px. The module map uses a single column at or below 600px. At tablet sizes, C spans the row below A/B and D spans the final row, eliminating the unused cell. Module D's subtitle has explicit white text against forest. Source content, translations, semantic figure label, SVG hooks, adjacent CAD scene, and shared styling are unchanged.

Implementation task: `node:delegated-task:command%3Amcp%3A7c224161-c9d3-4098-918f-3cb13a6a79f0%3Adelegate-task%3Aproduct-modules-20261009-fix-r1`.
Independent review task: `node:delegated-task:command%3Amcp%3A7c224161-c9d3-4098-918f-3cb13a6a79f0%3Adelegate-task%3Aproduct-modules-20261009-review-r1`.
Both completed on the discovered `opencode_google` instance, model `opencode-go-3/muse-spark-1.3-contributor`, explicit `variant=xhigh`.

## Actual coordinator checks

- Final browser matrix: 1440, 1024, 961, 960, 768, 760, 601, 600, 390, and 320px × English/German, normal motion (20 cases). Exactly one visual module representation in every case. Figure internal overflow is zero; no page overflow, clipped module text, or runtime errors.
- Earlier reduced-motion matrix: six widths × both languages (12 cases) confirmed the visibility repair and module D contrast. The final review patch only changes C's grid span.
- Viewed final desktop, tablet, and narrow-phone captures. The tablet C row spans its container (665px at 768px) and mobile C occupies its sole column. Heading/badge, borders, gutters, and text remain contained.
- Desktop D bar text stays inside its rectangle in both languages; measured right clearance is approximately 95 SVG units in English and 41 in German.
- Adjacent CAD scene: 1440/1024 × English/German at 768px viewport height, normal motion, middle scroll progress. Heading, figure, slider, and chapter controls fit the viewport. At 390/320 the slider still changes frame 000 to 035.
- `npm run build`, `npm test` (6/6), and `git diff --check` pass after the review patch.

Evidence: `/tmp/a2g-product-modules-before/`, `/tmp/a2g-product-modules-after/`, `/tmp/a2g-product-modules-final/audit.json`, final section PNGs in the same directory, and `/tmp/a2g-product-modules-validation/adjacent-cad.json`.

T3 native browser status/open returned an explicit host AppArmor sandbox restriction. Its HTML preview also exited unexpectedly. Coordinator verification used an isolated temporary Chromium profile without modifying host security. The existing live Vite preview remains available.
