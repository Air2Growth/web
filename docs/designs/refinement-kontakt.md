# Kontakt refinement — handoff (2026-10-10)

Assigned scope: `kontakt.html`, `src/page-designs/kontakt.css`, this doc.
No edits made — page verified clean, no-change verdict.

## Baseline
- Working tree: `kontakt.html` and `src/page-designs/kontakt.css` unmodified
  (not in `git status`; other pages' changes are out of scope).
- Review1 (`/tmp/a2g-refine-20261010/review1/audit.json`): all 10 kontakt runs
  (de/en × 320/390/768/1024/1440) clean — no errors, no overflow
  (`bodyWidth == width`), no duplicate IDs, no broken anchors, no image
  issues, axe empty.
- Design intent from `docs/designs/kontakt.md` (Cobalt Conversation Desk):
  asymmetric cobalt desk (intro + support left, white blotter with citron
  hard shadow right, spans both rows); DOM intro → blotter → support so
  mobile reads H1/lead → form → support; email-app explanation in blotter
  callout + support copy; pilot detail collapsed on mobile via shared
  `data-mobile-disclosure` (authoritative simplification — 320/390 headings
  omit the pilot h2, 768+ include it; not a bug).
- Screenshots reviewed: `kontakt-de-1440.png`, `kontakt-en-390.png`
  (review1) + live `/tmp/opencode/kontakt-live-390.png`,
  `/tmp/opencode/kontakt-live-de-1440.png`. Desk two-column, form prominent,
  mobile order intro → form → support, no clipping/overlap.

## Close review (additional pass, no changes)
1. Heading order h1→h2 ×5, no skips — ok.
2. All 4 `label[for]` resolve to existing inputs; `select`/`input type=email`/
   `textarea` carry `required`/`maxlength`/`autocomplete` — ok.
3. `?thema=Pilotprojekt` preselects the topic option live; `?thema=Pitch%20Deck`
   decodes to the `Pitch Deck` option value — ok. Single `id="anfrage"` on the
   desk section; `#main` skip target present — ok.
4. Native validation live: empty submit invalid, `not-an-email` invalid,
   valid fill valid — ok. Submit sets `.form-status[role=status]` text in the
   active language and does not navigate to a backend (URL unchanged; headless
   has no mail client — expected email-preparation behavior preserved) — ok.
5. DE (`?lang=de`) and EN (auto/`?lang=en`) strings correct incl. H1, button
   (`E-Mail vorbereiten` / `Prepare email`), status text; option *values* stay
   German keys while labels translate — ok, no `en.js` change needed.
6. Contrast (computed live): white/cobalt 6.49, forest/citron pill 9.89,
   forest/leaf submit 5.98 — all AA, match `kontakt.md` claims — ok.
7. Keyboard: FAQ `summary` focusable, toggles on activation; `:focus-visible`
   citron ring on cobalt / cobalt ring elsewhere in CSS; `prefers-reduced-motion`
   + `.motion-off` present — ok.
8. Considered but deliberately left alone: footer `Nach oben href="#"` (shared
   footer pattern, all pages, baseline anchor check passes — coordinator scope);
   `.mobile-form-intro` class name (always-visible callout; rename is churn with
   zero user benefit); `mailto:` form `action` fallback (harmless, submit is
   `preventDefault`ed); pilot `01/02/03` markers (pre-existing `vp-path`,
   explicitly kept per design doc).

## Validation run
- Playwright (fallback install, Chromium `--no-sandbox`, port 5174):
  DE-1440 / DE-390 / DE-320 (`?lang=de`) + EN-390 + `?thema=` preselect —
  zero console/page errors, zero overflow, labels/anchor/status-role ok.
  Scripts: `/tmp/opencode/kontakt-check.js`, `/tmp/opencode/kontakt-check2.js`
  (throwaway, outside repo).
- `npm run build` / integration tests: coordinator performs integration checks
  (per brief, no concurrent build/test from this worker).

## Remaining issues / coordinator follow-up
- None. No shared CSS/JS or `src/translations/en.js` changes needed.
- Changed paths: `docs/designs/refinement-kontakt.md` only (this file).
