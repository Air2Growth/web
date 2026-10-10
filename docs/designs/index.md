# Home (`index`) — carbon-to-crop poster

## Plan

- Color: leaf #36CF73 poster field, forest #123D2B ink/borders, citron
  #DAF52F stickers (eyebrow pill, CO2 badge, chapter pills, lab caption),
  cobalt #284AE8 actions (hero CTA, pressed states, directory rings,
  progress), mist #EFF9F1 surroundings, white cards/caption bars.
- Type: Barlow Condensed 700, uppercase poster headline
  (CSS transform only; DOM/i18n strings byte-identical), monochrome forest —
  no single-word accent. Open Sans body, 13px sentence-case sticker eyebrows.
- Layout: solid leaf poster panel (3px forest border, 10px offset shadow),
  two-column type left / photo collage right; ledger strip with 3px rules;
  white bordered panels for cycle + lens; ledger rows for directory; forest
  contact band with monochrome headline.

```
+ header (mist, structurally consistent) ----------+
| LEAF POSTER (border + offset shadow)            |
| [pill eyebrow]              | photo collage     |
| AUS                         | [sticker][badge]  |
| CO2 WIRD                    | field photo       |
| NEUES WACHSTUM.             | caption bar       |
| sub + [cobalt CTA][pill]    | forest bar        |
+ ledger: intro | TRL 4 | 7 kg | 800 EUR ---------+
| white panel: cycle SVG + chapters + controls    |
| white panel: algae lens + cobalt state pills    |
| directory ledger rows (Barlow + cobalt rings)   |
| forest contact band (white headline, citron CTA)|
+ footer (mist) -----------------------------------+
```

- Principles: one device (poster type); collage layering instead of photo
  overlays (caption/coordinate become solid bars under the photo); factual
  figures stay qualified and adjacent to the model note; lens + scroll
  interactions byte-untouched, only chrome restyled.

## Critique vs generic defaults

- Rejected dark-teal rounded overlay hero (the existing look and the
  generic photo-hero default): solid leaf field, hard borders, caption below
  photo.
- Rejected SaaS card grid for directory/stats: ledger rules instead.
- Rejected gradient washes: all fills solid (`hero-visual:after` removed).
- Rejected all-caps eyebrow labels: pills are sentence case; headline
  uppercase is CSS-only poster voice, source strings preserved.
- Rejected single-word accent: `em`/`.carbon-type` forced to inherit.
- Rejected numbered chrome: chapter pills keep their factual 01–03 sequence
  only (true process order), no decorative numbering elsewhere.

## Implementation

- `index.html`: added Barlow preload + `/src/page-designs/index.css` link.
  No body markup changed (all poster work is scoped CSS).
- `src/page-designs/index.css`: everything under
  `body[data-page="index"]`; overrides sized to beat `identity.css`
  specificity; hero-visual un-absoluted into a collage column; orbit kept as
  corner badge; caption/coordinate static bars; SVG fills remapped to
  citron/leaf/white/forest; lens/scene JS hooks untouched.
- `src/design-system.css` (new): tokens, Barlow face, remaps, disciplined
  type/nav/buttons/focus (see `shared.md`).
- `src/main.js`: appended `import "./design-system.css"` after the last CSS
  import only.

## Self-critique (mirror check)

- Removed one accessory already: dropped the planned second collage photo —
  single field photo + lens is enough; page keeps one voice.
- Risk: uppercase poster headline could read as shouty at 320px — mitigated
  with 54px floor and condensed face (fits: ~8 chars x 0.5em).
- Risk: cobalt focus on leaf is 3.19:1 — mitigated: leaf-surface focus uses
  forest (5.98:1), forest-surface focus uses citron (9.89:1).
- Quiet check: cycle/lens/directory/contact sections use white/mist with
  forest rules; only hero is loud. Good.

## Checks

- `npm run build`: must pass (root runs integration checks).
- Hooks preserved: `data-lab-state`, `data-lab`, `data-scene`,
  `data-chapter`, `data-chapter-go`, `data-mobile-disclosure`, `#main`,
  `#mikroalgen`, `#kontakt`, `#home-after-story`, `#year`, `.lab-status`.
- No files touched outside ownership; nothing committed; no nested agents.
- Visual check limitation: T3 browser preview unavailable in this subagent
  toolset (no preview tool in catalog; root reported AppArmor block) — no
  screenshot taken; verification is build + selector/hook audit.
