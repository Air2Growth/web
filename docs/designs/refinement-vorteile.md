# Refinement — vorteile.html

Scope: `vorteile.html`, `src/page-designs/vorteile.css` (both left untouched).
Baseline: branch `refine/website-20261010`, shared behaviour from `src/mobile-simplify.css` +
`src/main.js` (root-owned, not edited). Page design intent: `docs/designs/vorteile.md`.

## Verdict

No evidence-based refinements warranted. Page HTML and page CSS intentionally
left unchanged. Baseline audit (`/tmp/a2g-refine-20261010/review1/audit.json`,
all 10 vorteile entries DE/EN × 320/390/768/1024/1440) reports `errors: []`,
`overflow: []`, `dup: []`, `brokenAnchors: []`, `images: []`, `axe: []` on every
entry — no baseline violations for this page.

## Validation performed (live, dev server http://127.0.0.1:5174)

- Playwright (fallback Chromium `--no-sandbox`): 1440/390/320 viewports.
  `document.documentElement.scrollWidth - innerWidth = 0` at all widths;
  `bodyWidth == viewport` (matches audit).
- Links: 28 anchors DE and EN, zero broken hash targets (`#main`, `#wirkung`,
  `#anfrage` targets resolve).
- Images: `leaves-small.webp` loads in hero card; `agriculture.webp` is
  `loading="lazy"` (naturalWidth 0 above the fold, 1320×880 after scrolling
  into view) — working as designed, not broken.
- i18n: DE H1 "Unabhängiger werden. Bedarfsgerecht planen.", EN H1 "Become
  more independent. Plan around your needs."; title DE "Vorteile & Modell",
  EN "Benefits & model". The unrelated `src/translations/en.js` diff on this
  branch touches only Produkt strings — no vorteile impact.
- Keyboard: native `details/summary` disclosures focusable; page CSS defines
  `:focus-visible` cobalt outline with forest+white halo on dark/citron
  grounds. No JS click/scroll override on this page's disclosures (the shared
  tech override under root investigation does not affect vorteile controls).
- Screenshots reviewed: `review1/vorteile-de-1440.png` (desktop ledger,
  use-case cards, cost bars, cobalt 800 € cell, flow, FAQs all render cleanly)
  and `review1/vorteile-en-390.png` (stacked layout, no clipping/overlap).

## Observation for coordinator (shared file, NOT edited — decision needed)

Committed baseline `src/mobile-simplify.css` (`@media max-width: 760px`,
from `c940679`, loaded globally via `src/main.js`) sets `display: none` on
`[data-page="vorteile"]` `.detail-heading`, `.vp-lede`,
`.vp-figure:has(.vp-cost)`, `.vp-flow`, `.xp-sproutline`,
`.economy-copy > .text-link`, plus `.xp-band` and `.editorial-photo` globally.
Live probe confirms: at 390/320 the detail H2 exists in DOM but computes to
`display: none`, `0×0` rect; audit heading lists show 2 headings on phones vs 3
on desktop.

Effect: on phones the cost bars, the 1-2-3 flow, the use-case illustrations
and the section H2 are absent, while `docs/designs/vorteile.md` and
`src/page-designs/vorteile.css` (§ responsive: "nothing hidden, rows stack
openly") assume they stack visibly. This is a desktop/mobile composition and
factual-claim gap (core economics legibility is the page's stated job), but it
is committed shared behaviour, not a regression, and outside this worker's
edit scope. Recommend coordinator/root rule once globally: either keep the
phone simplification (then page doc/CSS stacking rules for those elements are
dead code on phones) or restore them (shared-CSS change +640px testing).
No page-level edit made either way pending that decision.

## Remaining issues

None within this worker's scope. No page HTML/CSS changes, no translation
changes needed from this page.
