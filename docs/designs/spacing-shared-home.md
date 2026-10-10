# Spacing + shared home review (2026-10-09)

Owner: shared/home worker. Owns for mutations only `src/design-system.css`,
`src/page-designs/index.css`, `docs/designs/spacing-shared-home.md` (this file).
`index.html` untouched (no wrapper change needed). No other page CSS/HTML edited.
No commits, no resets, no nested agents.

Skill: `/root/.codex/skills/frontend-design/SKILL.md` read (plan → critique →
build → critique, intentional spacing hierarchy, no global centering, tighten dead
space with evidence). Context-mode: read `/root/.config/opencode/AGENTS.md` and
upstream `/root/.config/opencode/instructions/context-mode/AGENTS.md`; sandboxed
analysis via `ctx_execute`, memory via `ctx_search`, handoff via `ctx_index`.
Repository sources authoritative. T3 preview open fails (AppArmor blocks sandbox,
root owns browser); supplied `/tmp/a2g-spacing-before` PNGs are genuine previews.
Root will recapture final screenshots; shared CDP tab not operated.

## Actual visual review (PNGs viewed, not claimed blind)

- `index-1440-section-0.png`: leaf-filled rounded hero card (3px outline, 10px
  offset shadow, 64px insets) boxes the H1; white pill eyebrow boxes the eyebrow;
  type/photo sit inside a 1700px card wider than normal 1320 gutters.
- `index-1440-footer.png` + `index-390-footer.png`: footer wordmark renders
  `air 2 growth .` with visible gaps; audit fragments confirm ~10px splits
  (air 52.5–101, 2 111–131, growth 141–273, dot 283–292 at 1440). Logo accents
  render cobalt (audit `accent rgb(40,74,232)`), not original greens.
- `index-1440-section-1/2/3/4/5/6.png`: cycle white card, ledger strip with 3px
  rules, lens panel, directory ledger rows, forest contact band — insets
  generally even; no overflow (`overflow -15`), no misaligned wraps, no missing
  images, no broken local links per `audit.json`. No global centering defect;
  asymmetric ledger + collage layouts deliberate and kept.
- `index-390-section-0/1/2/3.png` + `index-390-footer.png`: hero stacks
  headline → actions → photo; orbit/caption/coordinate/footnote hidden by
  mobile simplifier (preserved); ledger stacks with top rules; footer stacks
  brand → email → 3-col nav → legal. Motion toggle overlaps footer corner
  (pre-existing fixed control, not edited).

## Defects found → fixes (owned files only)

1. Hero boxed card (brief: unbox main heading).
   - `src/page-designs/index.css` `body[data-page="index"] .hero.wrap`: was
     `calc(100%-32px)/1700px`, leaf bg, 3px border, 26px radius, 10px shadow,
     `clamp(32,4.5vw,72) clamp(24,4vw,64)` padding, `overflow:hidden`.
   - Now open canvas: `min(1320px,100%-96px)`, transparent, border/radius/shadow 0,
     `overflow:visible`, `margin-inline:auto`,
     `margin-top clamp(24,4vw,56)`, `padding clamp(8,2vw,24) 0 clamp(32,4vw,56)`.
     Photo panel (`.hero-visual` border/shadow/caption bars) kept as purposeful
     figure; type/photo interactions untouched.
   - Mobile `≤760px`: was `100%-32`, `28px 20px` card; now `100%-40px` (normal
     gutters), `12px 0 32px`, no card. `≤360px`: `8px 0 28px`. `≤1020px` single
     column kept.
2. Hero eyebrow pill (brief: remove card/pill around heading eyebrow).
   - Was white pill (`bg white`, 2px forest border, 999px radius, `8px 18px`).
   - Now open label: transparent, border/radius 0, padding 0, sentence-case 13px
     forest + live-dot. Other sticker pills (impact intro, chapter pills, lab
     caption, contact eyebrow) kept as deliberate accents.
3. Footer wordmark split (ALL 7 pages, shared).
   - Root cause: `src/style.css` `.brand { display:inline-flex; gap:10px }`;
     footer anchor has anonymous `air`/`growth` flex items → 10px gaps.
     Header nests wordmark in one span → already contiguous.
   - Fix in `src/design-system.css`: `body .footer .brand { gap:0 }` (+ zero
     margins on nested accents). Specificity `0,2,1` wins inherited
     identity/mobile rules. Links/structure untouched.
4. Logo colors (header AND footer, ALL 7 pages, shared).
   - Was cobalt (`--cobalt`) in `design-system.css`, teal `#00816d` in
     `identity.css`. Authoritative originals from `git show HEAD:src/style.css`:
     ink/leaf `#183c2c`, two `#7fa451`, dot `#83aa53`.
   - Fix: dedicated `--brand-ink/--brand-two/--brand-dot` tokens;
     `body .brand` + `svg` → ink, `.brand-two` → `#7fa451`,
     `.brand-dot` → `#83aa53`. `body` prefix wins style/identity/mobile.
     Cobalt logo accent removed. Open Sans bold kept (`var(--body)` 700,
     locally hosted).
5. Shared header/footer gutters + footer rows (1440/390).
   - Conflict was style `100%-112` vs identity `100%-96`; audit shows 1320/52.5
     desktop + 335/20 mobile (identity wins by import order, fragile).
   - Fix: `body .header { min(1400px,100%-96px); margin-inline:auto }`,
     `body .footer.wrap { min(1320px,100%-96px); margin-inline:auto }`,
     `≤760px` both `100%-40px`. Footer rows: `footer-top gap 16/28 wrap`,
     `footer-pages gap 8/24 margin-top 24`, `footer-bottom gap 12/20 wrap
     margin-top 24 padding-top 20` (mobile 16/16); display untouched so phone
     3-col grid + column legal from simplifier still apply. ≥44px controls,
     cobalt focus, reduced-motion untouched.

No `index.html` edit: `section.hero.wrap` already centers via CSS; changing class
would risk hooks. Figure panels (`.hero-visual`, `.scroll-scene`, `.lab-lens`)
kept bordered/purposeful; headings no longer inside outer cards (hero unboxed;
cycle/lens panels contain interactions, not decorative heading cards).

## Actual checks

- `npm run build` passes (Vite 8.3.4, 167ms; `index.html` 51.49 kB,
  `index-*.css` 13.00 kB, `main-*.css` 94.94 kB).
- `npm test` 6/6 pass.
- Sandbox audits: brand tokens exact (`#183c2c/#7fa451/#83aa53`), cobalt logo
  absent, footer `gap:0`, hero border/radius/shadow 0 + transparent + 1320
  gutters, eyebrow border 0, 0 gradients, 0 unscoped rules in owned files,
  hero buttons `min-height 52px`, hooks (`data-lab-state/data-lab/data-scene/
  data-chapter/data-chapter-go/data-mobile-disclosure`, `#mikroalgen`,
  `#home-after-story`, `.lab-status`, `#year`) present, German strings
  (`Aus der Luft/Wachstum/Kleines System/TRL/Bio-Dünger/Einsparpotenzial`)
  byte-identical.
- Contrast: brand-ink/mist 11.32, forest/mist 11.28, white/forest 12.15 (AA).
- `ctx_search` found `a2g-mobile-combined-audit`, `review-first-handoff`,
  `review-final-handoff`, `index-page-handoff`; assessed, sources authoritative.
- `git status`: only owned files + pre-existing dirty work; sibling work
  preserved, nothing committed.

## Remaining / unresolved (honest, for root)

- No post-fix screenshots: T3 preview AppArmor-blocked, CDP untouched per brief.
  Viewed 11 supplied index PNGs + `audit.json` only. Root to recapture 1440/390
  (hero open on mist, eyebrow unpilled, footer `air2growth.` contiguous,
  green logo, gutters/rows) and confirm no regression on other 6 pages from
  shared footer/header rules.
- Shared defect outside ownership (report, not edited): `src/identity.css`
  teal `#00816d` brand accents + `src/mobile-simplify.css` phone rules
  (`footer-top>span display:none`, orbit/caption hiding, disclosure restyles)
  still exist; our higher-specificity shared rules win for logo/gutters but
  peers own those files — root to assign if their overrides resurface.
- `model-note` alignment: audit/screenshots ambiguous (appears centered in
  section-2 crop, no explicit `text-align` in sources); left as sourced
  (no accidental global centering introduced). Flag if root wants explicit
  left/center.
- Motion toggle overlaps footer legal at both widths (pre-existing fixed
  control); untouched as hooks/a11y behavior, flag for root UX call.
