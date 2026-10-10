# Visual spacing validation — 2026-10-09

User requested a visual cleanup of padding, margins, borders and centering across all seven pages, a contiguous footer wordmark, original logo colors, and open homepage headings. The expressive page identities and shared vibrant palette remain.

## Completed changes

- Shared header/footer gutters and row gaps are explicit. Footer lettering has zero flex gaps; original repository logo colors are restored: ink/leaf `#183c2c`, “2” `#7fa451`, dot `#83aa53`.
- Homepage hero and carbon story heading have no outer decorative border, rounded frame or shadow. Interactive figure panels remain.
- The animation toggle sits in footer flow and no longer covers legal links.
- Page-specific spacing fixes remove inherited empty panels, duplicate FAQ borders, excessive section gaps and mismatched insets; team photo and investor milestones align deliberately.
- Technology reactor labels are separated from the liquid fill in all six stages.
- Investor roadmap cards wrap their full labels, remove leftover rail/dots, and align with the heading at normal gutters.
- Product CAD size responds to pinned viewport height so its caption, native slider and chapter controls fit.

Implementation and review details are in the `spacing-*.md` files beside this document. Changes were limited to shared/page CSS and review notes; existing HTML hooks, strings and factual qualifications were preserved.

## Actual verification

T3 `preview_open` explicitly reported the host AppArmor sandbox block. A dedicated alternate Chromium browser produced the real previews; host security was not modified.

- All seven pages at 320, 390, 768, 1024 and 1440 pixels: 35 responsive layouts, no horizontal overflow, clipped text, broken local anchors, missing images or console errors. Changed investor gutters were recaptured at all five widths; visible copy/card rows share centered gutters and labels fit.
- Final section/footer screenshots at 1440/390: all 14 logo/color/wordmark checks passed; footer toggle is static, at least 44 pixels tall, and overlaps no footer links.
- Fourteen interaction groups passed: mobile menu focus/Escape, language links, six keyboard tabs, CAD range, algae controls, form labels/topic preselection/native validation and reduced motion.
- Technology diagram: 36 stage/language/width samples; visible label clearance is at least 9 pixels and labels remain inside the vessel.
- Scroll stories advance correctly. Homepage/technology panels fit at 1440/1024 widths and 900/768/700 heights.
- Product production build: 36 DE/EN samples across those widths/heights and three scroll positions. Slider and chapter controls remain visible; headings naturally leave the viewport when the sticky scene exits.
- `npm run build`, `npm test` (6/6) and `git diff --check` passed. Development-browser timing failures were retried and final product checks used the built static site with explicit application readiness.

Visual evidence: `/tmp/a2g-spacing-final`, `/tmp/a2g-spacing-investor-final`, `/tmp/a2g-spacing-product-pinned-production`. These are audit files, not site assets. The inline homepage/footer preview was checked in the alternate browser after native `html_preview` failed.

Live preview remains at http://100.106.75.0:5173/. Temporary audit servers/browser are stopped after validation. No commits or deployment were requested.

