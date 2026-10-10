# Review first pass — fixes + critique (index, produkt, technologie, vorteile, shared)

Scope: review agent. Owns `index.html`, `produkt.html`, `technologie.html`,
`vorteile.html`, `src/page-designs/{index,produkt,technologie,vorteile}.css`,
`src/design-system.css`, `docs/designs/{index,produkt,technologie,vorteile,shared,review-first}.md`.
Team/investoren/kontakt untouched. No commits, no nested agents.

Skill: `/root/.codex/skills/frontend-design/SKILL.md` read. Plan below follows
its plan → critique → build → critique loop. One memorable device per page,
quiet surroundings, no generic defaults.

## Root findings fixed (all five)

### 1. index — caption column + clipped sticker
Cause (cascade read, not guessed): `identity.css` sets
`.hero .image-caption { width: 29% }` and
`.hero .image-coordinate { max-width: 29% }`; page CSS overrode position and
display but never width, so the caption stayed a 29% column (6-line break,
~400px white gap, arrow parked mid-card, coordinate a narrow dark block).
Sticker clipped because `graphics.css` sets
`.hero-visual .image-tag { left: 50%; translate: -50% 0 }`; page CSS moved it
to `left: 18px` without resetting `translate`, shifting it half its width off
the card edge. Read `/tmp/a2g-first-batch-review/index-1440.png` (caption
narrow left, sticker "From" clipped) to confirm.
Fix (`src/page-designs/index.css` only):
- `.image-tag`: `translate: none; max-width: calc(100% - 36px)`.
- `.image-caption`: `width: auto; max-width: none; padding 14px 20px`; first
  span `flex: 1 1 auto; min-width: 0` → compact full-width horizontal bar,
  text back to its authored 2 lines, arrow at right.
- `.image-coordinate`: `display: block; width: auto; max-width: none` →
  forest bar spans the card width.
No markup, string, hook, or interaction change.

### 2. produkt — CAD missing from hero
Read `/tmp/a2g-first-batch-review/produkt-1440.png` + `-390.png`: hero was a
huge title plus three text-only spec cards, no machine. Brief requires the
actual current CAD as the focal hero object.
Fix (`produkt.html` hero only, `src/page-designs/produkt.css`):
- Replaced the three-card `ul.pd-spec` stack with `div.pd-hero-media`:
  `figure.pd-specimen` (badge `Aktueller CAD-Entwurf`, static
  `/images/machine-frames/000.png`, caption `Gesamtanlage · CAD-Konzept`) +
  forest `p.pd-fieldnote` (`V3 läuft im Feldtest …`) + quiet `p.pd-modular`
  (`Modular` / `Für die Produktion auf Ihrem Hof`). All strings reused
  verbatim (i18n-safe); V3 field-test vs CAD-concept stays differentiated.
- Old `.pd-spec li` card rules replaced by specimen/fieldnote/modular rules;
  responsive breakpoints updated (`pd-hero-media` max 640px ≤1020px).
- Interactive turntable slider in `#anlage` untouched; new hero `alt` is a
  factual static description, no performance claims.

### 3. technologie — mobile duct scroll trap
Read `/tmp/a2g-first-batch-review/technologie-390.png` (and baseline
`technologie-390.png`): ≤560px the duct was `overflow-x: auto` with
`svg min-width: 520px` → tiny ~8px labels, only 01–04 visible, prominent
scrollbar. True sequence lived only in the tabs below.
Fix (`technologie.html` + `src/page-designs/technologie.css`):
- Added `ol.tech-stages` (01 Luft, 02 Filter, 03 Lösung, 04 Algen,
  05 Biomasse, 06 Dünger) inside the already `aria-hidden` duct; decorative
  only, sequence duplicated from the real tabs.
- Desktop: `.tech-stages { display: none }` (SVG duct unchanged).
- ≤560px: duct `overflow: visible`, SVG `display: none`, stages become
  wrapping pills (14px labels, 34px numerals, citron final pill). No scroll
  trap, nothing meaningful hidden (tabs + panel unchanged).

### 4. shared — Barlow wordmark
Fix (`src/design-system.css` only): `.brand` back to
`font-family: var(--body)` (bold Open Sans) with original tight tracking
(`-0.05em` ≈ −1.4px at 29px). Barlow stays for display type. One-line change,
applies consistently across all routes via the shared file.

### 5. vorteile — xp-band alignment + hero height
Cause: `section.xp-band.wrap` — `.wrap` centers via `margin-inline: auto`,
but page CSS set `margin: 0`, pinning cards to x=0 with a right gap.
Fix: `margin-block: 0; margin-inline: auto`. Tightened hero only via spacing
(`subpage-hero-inner` padding → `clamp(28px,3.5vw,48px)/clamp(20px,3vw,36px)`,
grid gap → `clamp(20px,3vw,40px)`, align center) so the citron ledger surfaces
sooner. No fact, figure, or string change; €3000 / €50 per 2 months / €800
model values and all assumption notes intact.

## Critique of the four designs vs the original brief

- Shared system: exact palette everywhere (`--forest/--leaf/--citron/--cobalt/
  --mist/--white` + remaps), Barlow 700 display + Open Sans body,
  sentence-case pills, solid fills, cobalt focus, reduced-motion guards.
  Objection resolved by the wordmark fix; nothing else in shared needed work.
- index (leaf poster): distinct typographic-poster composition, collage bars
  instead of photo overlay, ledger rows instead of cards. Keeps lens/scroll
  interactions. After this fix the collage reads as designed; mobile keeps
  caption visible via higher-specificity flex override (decorative orbit may
  still hide ≤760px per `mobile-simplify` — acceptable, it is `aria-hidden`).
- produkt (citron studio): now actually a hardware studio — real 000.png
  specimen in the hero, quiet surroundings, A/B/C/D treatments distinct.
  Dot-grid uses hard-stop `radial-gradient` dots, not a decorative wash.
- technologie (cobalt lab): coherent desktop bench + duct; tabs/panel fully
  functional; mobile now wraps readably. Genuine sequence numbering only.
- vorteile (citron ledger): one focal ledger sheet (white once vs forest
  recurring, single cobalt €800 cell), quiet mist rows, qualified figures.
  Wrap fix restores centering; hero tightening is spacing-only.
- Remaining brief debt (not mine to fix here): no post-fix screenshots exist
  in this session (see below); team/investor/contact pages were not reviewed.

## Checks run

- `npm run build` passes (7 pages; index/produkt/technologie/vorteile CSS
  bundles emitted).
- `npm test`: 6/6 pass.
- Static audits: 0 unscoped selectors in all four page files; all JS hooks,
  anchors, IDs, CAD controls, tab roles/`data-step`, FAQ disclosures present;
  figures preserved (€3000/€50/€800 + notes, TRL 4, 7 kg with note, V3 vs
  concept split); no `linear-gradient` washes in page files; no all-caps
  labels (one `uppercase` is the index poster H1 voice, CSS-only, strings
  byte-identical).
- `git status`: only owned files changed by me; sibling workers' dirty files
  untouched. Nothing committed.

## Unresolved / limitations (honest)

- No post-fix visual check: this subagent catalog has no browser/preview tool
  and root reported host AppArmor blocks `preview_open`. I read the five
  provided screenshots above (claim only those), verified the rest by cascade
  + build + static audit. Root integration to verify visually at 1440/390/320.
- context-mode: `ctx_search` retrieved prior handoffs; `ctx_index` handoff
  attempted — if the index call below errors, tooling was unavailable and the
  file above is the handoff record.
