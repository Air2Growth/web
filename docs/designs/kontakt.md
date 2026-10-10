# Kontakt — Cobalt Conversation Desk

## Brief
Air2Growth contact page. Local CO₂ capture + algae cultivation + fertilizer
for farmers and partners. The page's one job is starting a conversation: the
inquiry action (email-preparation form) must be prominent, not a generic
photo hero. No invented figures or claims; the form prepares an email in the
visitor's own mail app and never pretends to send via backend.

## Token plan
- Color (exact shared palette): cobalt `#284AE8` (desk field), white
  `#FFFFFF` (blotter panel, intro type), citron `#DAF52F` (label sticker,
  blotter hard shadow, button hover, channel hover), leaf `#36CF73` (submit
  surface, pilot-card shadow), forest `#123D2B` (ink, frames, body text),
  mist `#EFF9F1` (page paper, status/callout fills). CSS vars `--forest`,
  `--leaf`, `--citron`, `--cobalt`, `--mist`, `--white` on
  `body[data-page="kontakt"]`.
- Type: Barlow Condensed 700 for display (h1 clamp 64–128px, copy h2 36–58px,
  blotter h2 38–60px, address 26–38px; tight 0.94–1.1, sentence case, no
  single-word color accents), Open Sans for body/UI (13–16px/1.5–1.65, form
  fields 16px).
- Layout: full-bleed cobalt desk with an asymmetric two-column grid (intro
  0.92fr / blotter 1.08fr; blotter spans both rows on desktop, intro row 1
  + support cell row 2 in the left column). DOM order is intro → blotter
  → support, so mobile (single column) reads H1 + short lead → form →
  supporting copy/channels with matching visual, DOM, and keyboard order.
  Quiet mist surroundings below (constellation divider, FAQ ledger, photo
  inset, pilot note card).
- Principles: one memorable device (white blotter with hard citron shadow);
  ruled rows carry the channel/contact information instead of cards; Konzept
  vs. Feldtest separation N/A here — instead the email-app explanation stays
  next to the action in two places (blotter callout + intro copy).

## ASCII wireframe
```
[header — unchanged structure]
+================================================+
| COBALT DESK (#anfrage)                         |
|  left col:  intro (citron pill / H1 / lead)    |
|             support (copy h2 + paragraph,      |
|              channel ledger rows)              |
|  right col: WHITE BLOTTER (citron hard shadow, |
|             spans both rows)                   |
|    [Schreiben Sie uns. / email-app callout]    |
|    [topic / name / email / message]            |
|    [LEAF submit: E-Mail vorbereiten]           |
|    [status / Oder direkt …]                    |
|  mobile order: intro → blotter → support       |
+================================================+
| MIST: small constellation divider             |
| MIST: FAQ ledger (framed white rows)           |
| MIST: photo inset card (720px max)             |
| MIST: pilot note card (white, leaf shadow)     |
[footer — unchanged structure]
```

## Critique vs. generic defaults
- Was: full-bleed cultivation photo with overlay hero (identical treatment on
  every subpage). Now: photo hero removed entirely; the cobalt desk with
  oversized white type + white blotter is the opener. Changed because the
  brief demands the inquiry action be prominent, not a stock photo.
- Was: form and copy in a generic two-column `.contact-page` with photo hero
  above. Now: single continuous cobalt field fuses intro + channels + form
  into one desk; channels are ruled ledger rows, not cards. Changed to avoid
  the SaaS-card kit and repeated photo heroes.
- Was: gradient/overlay wash over hero photo. Now: zero gradient washes;
  flat cobalt field, hard citron offset shadow as the only depth cue.
  Changed per no-gradients-as-decoration rule.
- Was: all-caps eyebrows/numbered markers as decoration elsewhere. Now:
  sentence case throughout; no numbering (nothing here is a sequence except
  the pilot steps, which keep their existing `vp-path` list untouched).
- Considered a forest desk (matches identity.css) and rejected it: the brief
  pins vivid cobalt, and forest would repeat the dark-surface default and
  collide with the forest investor staircase.
- Considered moving the form first in DOM for prominence and rejected it:
  intro-first keeps logical reading/keyboard order and matches visual order.
- Self-critique after build: blotter shadow 12px + leaf pilot shadow could
  read as two devices — kept because they are separated by mist sections and
  the pilot card reuses the desk's shadow language at a smaller scale;
  removed one planned citron underline bar under the h1 as the cut accessory.

## What changed (owned files only)
- `kontakt.html`: added own stylesheet link; replaced photo-overlay hero +
  separate contact section with one `section.kt-desk#anfrage` (intro column +
  `div.kt-blotter` wrapping the verbatim form panel); copy/channels live in a
  following `div.kt-support` cell so mobile reads intro → form → support.
  `xp-constellation` relocated after the desk. No hook, text, anchor, link,
  or behavior removals.
- `src/page-designs/kontakt.css`: new scoped stylesheet (all selectors
  prefixed `body[data-page="kontakt"]`).
- `docs/designs/kontakt.md`: this file.

## Review round 2 (2026-10-09, mobile form burial)
- Finding (root screenshots 1440/390): mobile stacked H1 + lead + copy h2 +
  copy + channel ledger before the form, burying the primary action ~1300px
  below top; H1 `max-width: 9ch` forced "Ein"/"Gespräch." onto separate lines.
- Fix: `kt-copy`/`kt-channels` moved out of `kt-intro` into a following
  `div.kt-support` cell; DOM is now intro → blotter → support, so mobile
  reads H1/lead → form → supporting copy/channels with matching visual, DOM,
  and keyboard order. Desktop keeps its two-column identity (intro col 1
  row 1, support col 1 row 2, blotter col 2 row 1 / span 2). H1 measure
  widened to `16ch`; mobile display cut to ~54px max so "Ein Gespräch." fits
  one line and the form starts sooner. No text, ID, link, or behavior change;
  the email-app explanation stays in both the blotter callout and the
  support copy.

## Preservation check
- Kept verbatim: page-label, h1 (with `<br />` so i18n text nodes match),
  page-lead, copy eyebrow/h2/paragraph, contact-address + LinkedIn links,
  contact-location, form panel h2, mobile-form-intro (email-app explanation),
  all form IDs/labels/options/required/maxlength (`#contact-form`,
  `#contact-interest`, `#contact-name`, `#contact-email`,
  `#contact-message`, `.form-status`, `.direct-email`), mailto
  action/enctype, `?thema=` preselection + `#anfrage` anchor (now on the
  desk section), `xp-constellation` SVG + caption, FAQ `details/summary`
  content, editorial photo + caption, pilot checklist + disclosures +
  detail-note links, header/footer structure.
- No form JS touched: `main.js` queries `#contact-form`, `#contact-interest`,
  `.form-status` — all present; submit still builds the mailto URL and sets
  the status text. No new facts, figures, dates, or promises added.
- Contrast: white on cobalt 6.49:1, citron on cobalt ~6:1, forest on
  citron 9.89:1, forest on leaf 5.98:1, forest on mist/white ≥12:1, cobalt
  on white ~7:1. No body text in low-contrast pairs.
- A11y: heading order h1→h2 intact; 16px form type; ≥44px targets (52px
  fields, 56px submit, ledger rows); citron focus ring on cobalt, cobalt
  ring elsewhere; `prefers-reduced-motion` + `.motion-off` disable
  animation; nothing hidden to simplify (constellation relocated, hero photo
  `growing.webp` removed as decorative empty-alt, editorial photo retained).
- Responsive: 980px single column, 480px tightened type/padding/shadows;
  ledger address wraps (`overflow-wrap: anywhere`); SVG/photo capped width.

## Checks run
- HTML tag-balance parse (stdlib html.parser): no mismatches, nothing
  unclosed.
- Hook grep: `#contact-form`, `#contact-interest`, `#contact-name`,
  `#contact-email`, `#contact-message`, `.form-status`, `.direct-email`,
  `#anfrage`, `?thema=` links all present; single `id="anfrage"`.
- `npm run build` (Vite static build incl. kontakt.html + new CSS).

## Unresolved / limitations
- context-mode MCP tools (`ctx_search`/`ctx_index`/batch) are not exposed in
  this subagent session, so no indexed-findings retrieval/indexing was
  possible; worked from current repository sources (authoritative). No claims
  of automatic memory capture.
- T3 browser preview unavailable in this session (root reported AppArmor
  sandbox-blocking for preview_open); could not screenshot. Root performs
  integration checks. `npm run build` is the verification gate.
- Shared design-system imports owned by coordinator/home worker; this page
  only adds its own stylesheet link and defines its own `--forest…--white`
  vars locally per the shared contract.
