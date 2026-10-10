# Spacing review — Investor roadmap gutters (2026-10-09)

Scope: `src/page-designs/investoren.css` ONLY. No HTML edits, no shared-CSS
edits, no other pages, no new facts/strings/links/anchors/hooks.

Prior rounds: `docs/designs/spacing-team-investor-contact.md` (hero/ledger/
wash/lane/desk/constellation/FAQ pass) and
`docs/designs/spacing-review-team-investor-contact.md` (roadmap `display:block`
+ rail/dot kill + wrap guards). This round answers root's remaining objection
on the FINAL recapture in `/tmp/a2g-spacing-final`.

## Images actually viewed (image viewer, not claimed blind)

- `investoren-1440-section-1.png` — the objection: roadmap copy block centered
  narrow while the three cards start at viewport-left (first lime card touches/
  clips the left edge) and the row ends ~1280 instead of the normal 1320 wrap
  at 52.5 gutters. Cards themselves now fit their labels (no word clipping).
- `investoren-1440.png` (hero + roadmap junction): hero stairs whole words,
  roadmap copy narrow-centred vs full-width cards confirmed.
- `investoren-1440-section-2.png` — growth figure + short-list even, labels
  whole; used as the "same gutter" reference.
- `investoren-390-section-1.png` — stacked roadmap whole words
  (`Feldtestphase`, `Markteinführung Air2Growth` wrap, no clip) with stepped
  indents; must be preserved.
- `/tmp/a2g-spacing-final/audit.json` read as text (investoren 1440/390: no
  overflow beyond scrollbar, no misaligned wraps, no missing images, no
  console errors).

## Root objection — confirmed, root cause in owned file

1. `.roadmap-copy { max-width: 720px; }` capped the copy box while
   `.roadmap-section > *` gives it `width: min(1280px, 100%-112px)` +
   `margin-inline: auto`. Effective copy width = 720, centred → left ≈ 353
   at 1440. Narrow centred copy over full-width cards.
2. `.roadmap-list { margin: 28px 0 0; }` — equal specificity to
   `.roadmap-section > *` ((0,2,1) each) but later in source, so the `0`
   inline margins overrode `margin-inline: auto`. Row pulled to viewport-left
   (left 0, row 0–1280) instead of centred 52.5–1372.5.
3. Inner width `min(1280px, 100%-112px)` is narrower than the normal wrap
   (`min(1320px, 100%-96px)` per `identity.css`/audit: outer wraps render
   1320 at 52.5 gutters, e.g. `xp-growth wrap` left 53 width 1320).

## Fix (all in `src/page-designs/investoren.css`, 2 rules)

- `.roadmap-section > *`: `width: min(1320px, calc(100% - 96px))` —
  same centred content width/gutters as the normal wrap. Outer
  `.roadmap-section.wrap { width:100%; max-width:none; }` untouched, so the
  forest section stays full-bleed; only copy + list centre inside it.
- `.roadmap-copy { max-width: none; }` (was `720px`) — copy runs full
  normal-wrap width so the H2 left edge sits on the SAME gutter as the cards
  and the next growth figure's wrap. Line length stays on the text itself
  (`p: max-width 58ch`, unchanged); H2 needs no cap at this size.
- `.roadmap-list { margin: 28px auto 0; }` (was `28px 0 0`) — the late
  equal-specificity rule now keeps `margin-inline: auto`, so it actually wins
  instead of dragging the row to the viewport edge.
- Mobile untouched and correct: `@media 760px` already sets
  `.roadmap-section > * { width: calc(100% - 40px); }` (= spec 100%-40) with
  auto margins preserved (no later list-margin override at 760; the 0/20/40
  `li` indents are on items, not the list).

## Width / breakpoint review (static math + guards)

- 1440: inner `min(1320, 1425-96=1329)` = 1320, gutters 52.5 = normal wrap.
  Cards `(1320-24)/3` = 432px; `Markteinführung Air2Growth` @38px fits on
  one line (~375px < ~388 content); `TRL 4 & Start der Feldtestphase` wraps
  2 lines (as screenshotted). `break-word` + `hyphens:auto` + `pretty` +
  `minmax(0,1fr)`/`min-width:0` retained — no words shortened, dates and
  Erreicht/Geplant qualifiers untouched.
- 1024 (above the 1020 breakpoint, still 3-col): inner 928, cards ~301px
  @~27px — long compounds wrap, no clip.
- 768 (1020 breakpoint, 2-col + third `1/-1` span): inner 672, cards ~330px
  @26px floor — fits. Flat tops in 2-col (no stagger across rows) are
  intentional; the desktop `margin-top 48/24/0` ascending stagger (left→right)
  is preserved.
- 390 (single col, indents 0/20/40): inner 350, narrowest ~310 − padding =
  ~266 content @26px — fits; screenshot confirms whole words.
- 320 (380 breakpoint, indents 12/24): inner 280, narrowest 256 − 44 =
  ~212 content; `Markteinführung` (~192px @26px Condensed) fits,
  `hyphens:auto` covers EN/zoom. No overflow (items shrink inside the track;
  right edge stays on-gutter).
- No inherited rails/dots: prior `border:0`, `position:static`,
  `::before/::after none` on list + items retained; 10px top caps remain the
  single achieved/planned signal. `style.css` 760px rail/margin/grid rules
  lose on specificity (`body[data-page]` (0,2,1) > bare (0,1,0)); not edited.

## Preservation

- No HTML changes: German strings, milestone dates + qualifier pills,
  `?thema=Pitch%20Deck#anfrage` CTA, anchors (`#roadmap`), menu/language
  hooks untouched.
- Distinct forest-staircase identity kept: citron achieved / white + cobalt
  planned cards, ascending offsets, monumental white H2, forest field +
  hairline, quiet mist growth middle. Flat fills, sentence case,
  left-aligned; no global centring.
- Only `investoren.css` touched; `team.css`, `kontakt.css`, shared CSS, home,
  and all other pages untouched. No new dependencies, no new facts.

## Checks run

- Viewed the 4 PNGs + audit.json listed above via image viewer before/after
  editing (edits made after viewing).
- `npm run build` passes (investoren 17.97 kB CSS bundle).
- `npm test` 6/6 passes.
- Static: 0 `linear-gradient`/`radial-gradient`, 0 `uppercase` in
  `investoren.css`; `max-width:720px` gone; `margin:28px auto 0` present.
  Focus-visible rings, ≥44px targets, reduced-motion guards intact
  (untouched this round).
- `git status`: owned edit lives in untracked `src/page-designs/`
  (preserved, uncommitted); tracked `investoren.html` modification is prior
  work, not mine — no HTML edits this round. Workspace left dirty per brief;
  no resets/commits.

## Shared/global defects observed — NOT edited (peer ownership)

- `style.css` `.roadmap-section` 2-col grid + `.roadmap-list` rail/dots/margin
  remain the upstream source (neutralised locally only).
- Footer wordmark distance, logo colour, homepage hero, washes/large radii:
  peer-owned; untouched.

## Unresolved / for root recapture

- No post-fix screenshots from here: T3 `preview_open` blocked by host
  AppArmor and root owns the shared CDP tab — root recaptures investor at
  1440/1024/768/390/320 and checks rects (copy left ≈ cards left ≈ 52.5 at
  1440; labels whole; no rails/dots; stagger ascends).
- context-mode MCP (`ctx_search`/`ctx_index`/`ctx_execute`) is not exposed in
  this subagent session's tool catalog — worked from current repo sources
  (authoritative) and the supplied PNGs/audit; indexed nothing and made no
  memory claims. Frontend-design skill read (`/root/.codex/skills/
  frontend-design/SKILL.md`); its intentional-hierarchy/left-alignment
  guidance followed (gutter alignment, no global centring).
