# Review — Kontakt (mobile form burial fix, 2026-10-09)

## Root finding
- Screenshots `/tmp/a2g-contact-review/kontakt-1440.png` (desktop good) and
  `kontakt-390.png` (mobile bad): the mobile first column stacked H1 + lead +
  second heading + copy + channel ledger before the form, burying the primary
  form ~1300px below top.
- H1 `max-width: 9ch` forced "Ein" and "Gespräch." onto separate lines,
  adding height before the form.
- Zero-width hidden `.wrap` misalignment from inherited mobile photo
  simplification is explicitly out of scope (ignored per brief).

## Fix (owned contact files only)
- `kontakt.html`: moved `div.kt-copy` + `div.kt-channels` out of `div.kt-intro`
  into a new following `div.kt-support` grid cell. DOM order is now
  intro → blotter → support, so mobile (single column) reads H1/short
  lead → form → supporting copy/channels, and DOM matches visual/keyboard
  order. All text strings, IDs, links, disclosures, and form markup verbatim;
  only wrappers moved.
- `src/page-designs/kontakt.css`:
  - Desktop keeps its two-column identity via explicit placement: intro
    col 1 row 1, support col 1 row 2, blotter col 2 row 1 / span 2. ≤980px
    resets all three cells to `auto` placement in the natural DOM order.
  - H1 measure widened `9ch` → `16ch` (desktop + mobile) so the first phrase
    fits one line; mobile display cut to `clamp(48px, 13.5vw, 64px)` ≤980px
    and `clamp(44px, 14vw, 54px)` ≤480px with tighter lead/desk spacing, so
    the form starts much sooner.
  - Support cell keeps the ruled `kt-copy` divider (margin reset only, border
    kept); citron focus ring extended to `.kt-support` links (cobalt surface).
  - Email-preparation explanation preserved in both places (blotter
    `.mobile-form-intro` callout + support copy paragraph); nothing removed.
- `docs/designs/kontakt.md`: layout plan, wireframe, and change log updated
  for the intro/blotter/support composition.

## Preservation
- Exact text/i18n strings untouched (label, H1 with `<br />`, lead, copy
  eyebrow/H2/paragraph, location, form H2, callout, pilot/FAQ/photo blocks).
- Form IDs/behavior intact: `#contact-form`, `#contact-interest`,
  `#contact-name`, `#contact-email`, `#contact-message`, `.form-status`,
  `.direct-email`, mailto action/enctype, `?thema=` preselection (3 links),
  single `id="anfrage"`. No JS touched; `main.js` hooks resolve.
- Heading order h1→h2 intact; 16px form type; ≥44px targets; focus rings;
  reduced-motion guards; no content hidden.
- Header/footer structure unchanged; no files outside
  `kontakt.html`, `src/page-designs/kontakt.css`, `docs/designs/kontakt.md`,
  `docs/designs/review-contact.md` touched.

## Checks run
- Read both PNGs with the image viewer before changing (mobile 4-line H1 +
  stacked support content confirmed; desktop blotter confirmed good).
- HTML tag-balance parse (stdlib html.parser): no mismatches, nothing
  unclosed.
- Hook grep: each form ID/status/direct-email/`#anfrage` exactly 1×,
  `?thema=` 3×; DOM order intro(100) → blotter(108) → support(183) verified.
- `npm run build`: passes (`kontakt-DDMEkN6I.css` bundled).
- No page-overflow change introduced: single-column grid, wrapping ledger
  address (`overflow-wrap: anywhere`), capped SVG/photo widths retained.
  320/390/1440 re-verification is with root (no browser in this session).

## Unresolved issues
- context-mode MCP (`ctx_search`/`ctx_index`) not exposed in this subagent
  session: no indexed retrieval/indexing; worked from current repo sources
  (authoritative). No automatic memory claimed.
- No browser preview in this session (root reported AppArmor sandbox block
  for preview_open; no alternate browser used): no new screenshots taken.
  Root rechecks visual/mobile order after this change.
