# Investoren refinement handoff (2026-10-10)

Worker owns `investoren.html`, `src/page-designs/investoren.css`,
`docs/designs/refinement-investoren.md` (this file). Design intent
(forest investment staircase, `docs/designs/investoren.md`) preserved.
No HTML edits — all fixes are CSS-only, zero copy/i18n impact.

## Fixes applied (`src/page-designs/investoren.css` only)

1. **Potential-cell qualifier contrast** — `.vp-potential > div:nth-child(2)
   strong small` (`/ Jahr`) rendered in shared muted `#67746a`
   (`src/visual-pages.css: .vp-potential strong small`) on cobalt
   `#284AE8`, contrast ~1.30 (fail). The page rule set font but no color,
   and the existing white override covered only `span`, not `small`.
   Fix: pin `strong small` to `--ink-soft` on the mist cell (consistent
   with the page's existing `.vp-cost-label small`) and to `--white` on
   the cobalt cell (explicit on both `strong` and `small` to beat the
   shared direct-color rule by specificity). Verified computed:
   cobalt cell `strong`/`small`/`span` all `rgb(255,255,255)` on
   `rgb(40,74,232)` = 6.49; mist cell `small`/`span` `#2e5541` on mist.
2. **Hero stairs legibility at desktop DE** — `.inv-stairs` columns were
   ~152px wide with 29px Open-Sans (!) titles: the Barlow `:is()` list
   omitted `.inv-step strong`, so titles never used the page display
   face, and `hyphens: auto` shredded compounds (`Kun-den-Onboar-ding`,
   `Air2Gro wth`). Fix, staircase preserved (forest/citron/cobalt fills,
   stepped heights, pills untouched):
   - `.inv-hero-grid` `1.25fr 0.75fr` → `1.05fr 0.95fr` (steps 196px);
   - `.inv-step` horizontal padding 16px → 12px;
   - `strong` `clamp(21px,2vw,30px)` → `clamp(19px,1.6vw,26px)`
     (23px at 1440; roadmap bench below keeps 26–38px, hierarchy intact);
   - `hyphens: auto` → `manual` + `word-break: normal`, so breaks happen
     only at the authored hyphen (`Kunden-/Onboarding`) or spaces;
   - added `.inv-step strong` to the Barlow `:is()` list (matches the
     documented "Barlow title" intent; condensed 138px `Markteinführung`
     now fits the 168px content box).

## Verification (fallback Playwright, Chromium `--no-sandbox`, port 5174 only)

- 1440 DE: `TRL 4 & Start der / Feldtestphase`, `Kunden-Onboarding`
  (one line), `Markteinführung / Air2Growth` — word-boundary wraps only,
  brand intact, Barlow confirmed computed.
- 1440 EN: `TRL 4 & start of field testing`, `Customer onboarding`,
  `Air2Growth market launch` — clean. 1200px: same behavior (steps
  162px, 19.2px type). 390/320 DE: stacked indented staircase, titles
  single-line; H1 `Weitergedacht` unbroken.
- Overflow: 0 elements wider than viewport at 1440 and 390 (320 inherits
  the same single-column stack; not separately probed).
- Screenshots: `/tmp/a2g-refine-20261010/inv-verify-de-desktop2.png`
  (hero), `inv-verify-de-desktop.png`, `inv-verify-en-desktop.png`,
  `inv-verify-de-mobile.png`. Baseline: `review1/investoren-de-1440.png`.
- Not run: build/test (coordinator integration gate per brief).

## Preservation / scope notes

- Palette, fonts, composition, illustrations, factual claims, section
  purpose unchanged. No new copy, no string changes, no shared CSS/JS or
  translation edits.
- Coordinator follow-up (shared-level, not applied): consider scoping or
  removing the shared `.vp-potential strong small { color: muted }` rule
  footprint — every page with a dark potential cell must override it.
- Remaining: none known on this page. Repeated-review readers: re-check
  stairs wraps if hero copy or the 1.05/0.95 split ever changes.
