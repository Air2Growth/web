# Spacing review — shared + home, round 2 (2026-10-09)

Owner: shared/home worker. Mutations ONLY `src/design-system.css`,
`src/page-designs/index.css`. `index.html` untouched. No `scroll.css`,
no other page CSS/HTML, no commits, no resets, no nested agents.

Skill: `/root/.codex/skills/frontend-design/SKILL.md` read (intentional
hierarchy, no global centering, tighten dead space with evidence, keep
deliberate asymmetric ledger/collage). Context-mode: read
`/root/.config/opencode/AGENTS.md` + upstream
`/root/.config/opencode/instructions/context-mode/AGENTS.md`; sandboxed
analysis via `ctx_execute`, memory via `ctx_search`
(`spacing-shared-home-handoff`, `a2g-mobile-combined-audit` assessed,
sources authoritative). T3 preview open fails (AppArmor, root owns
browser, shared CDP untouched); supplied PNGs genuine previews:
`/tmp/a2g-spacing-after-home` (19 files, viewed 8: index 1440
section-0/1/2/3/4 + footer, index 390 section-0/1 + footer) +
`/tmp/a2g-spacing-before/audit.json` + after-home `audit.json`.
No post-fix recapture (root owns browser).

Prior round (preserved): hero unboxed to open mist canvas
(`min(1320px,100%-96px)`, transparent, 0 border/radius/shadow),
eyebrow unpilled, footer wordmark `gap:0` contiguous, original greens
restored (`--brand-ink #183c2c`, `--brand-two #7fa451`,
`--brand-dot #83aa53`), shared header/footer gutters + rows.

## 1. Footer motion-toggle overlap — FIXED (shared, ALL 7 pages)

Evidence: `index-1440-footer.png` toggle `Reduzierte Bewegung` fixed
bottom-right covers legal links (`Datensch...` truncated, toggle over
footer-bottom). `index-1440-section-1/2/4.png` same fixed pill overlaps
content corner. `index-390-footer.png` already flows (mobile.css
`position:static` ≤760px) — desktop-only defect.

Root cause: `src/scroll.css:13-26` `.motion-toggle { position:fixed;
bottom:18px; right:20px; z-index:80 }`; `scroll.js:19` appends toggle
inside `.footer` (DOM order already correct). `identity.css:961-963`
+ `mobile.css:19-26` only static ≤760px.

Fix (`src/design-system.css`, minimal layout override, no JS):
```css
body .motion-toggle {
  position: static;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: 100%;
  margin: 20px 0 4px;
  min-height: 44px;
  padding: 12px 20px;
  box-shadow: none;
}
```
Specificity `0,1,1` beats `scroll.css`/`identity.css`/`mobile.css`
`0,1,0` at all widths. DOM/keyboard order unchanged (last child of
footer), hooks (`.motion-toggle`, `.motion-off`) untouched,
reduced-motion untouched, colors inherited (no gratuitous recolor).
`margin:20px 0 4px` = medium grouping after `footer-bottom`
(`margin-top:24/padding-top:20`), distinct from small internal gaps.
`min-height:44px` + `12px 20px` keeps ≥44px target;
`width:fit-content` prevents full-width stretch/overlap.

## 2. Carbon `.scroll-scene` heading card — FIXED (home only)

Evidence: `index-1440-section-1.png` + `index-390-section-1.png` white
rounded card (`3px` forest border, `24px` radius, `10px` offset shadow)
frames H2 `Ein Kreislauf, der vor Ort beginnt.`; audit after-home:
`scroll-scene left:0 width:1425 border:3px radius:24px` (1440) and
`left:0 width:375 border:3px radius:24px` (390) — border touches
viewport edge, shadow clips. Hero already open; lab H2
`Ein Blick ins Wachstum.` is OUTSIDE `.lab-lens` (section-3/4.png) so
lens keeps its purposeful figure card per brief.

Fix (`src/page-designs/index.css` only, `scroll.css` untouched per
ownership):
```css
body[data-page="index"] .scroll-scene {
  background: var(--white);
  border: 0;
  border-radius: 0;
  box-shadow: none;
  margin-block: 56px;
  overflow: visible;
}
body[data-page="index"] .scene-sticky.wrap {
  width: min(1320px, calc(100% - 96px));
  margin-inline: auto;
}
```
Mobile `≤760px`: same `border/radius/shadow 0`, `overflow:visible`,
`margin-block:40px`, `.scene-sticky.wrap { width:calc(100% - 40px) }`.
Keeps purposeful full-bleed white band + normal inner gutters, actual
interactive diagram/controls (`carbon-figure`, `data-chapter`,
`data-chapter-go`, `.scene-progress`) untouched; pin/height logic in
`scroll.css` (`.has-scroll-scenes` 260vh/sticky) not overridden.
Headings now open on canvas; no global centering introduced
(`scene-heading` flex space-between kept).

Home insets/gutters rechecked: hero open mist (section-0 1440/390),
ledger strip open with top/bottom rules, `model-note` left as sourced
(ambiguous centering, no explicit rule), recognition quiet row,
`lab-lens` + `hero-visual` purposeful panels kept, directory ledger
rows, forest contact band. No overflow/misaligned wraps/broken links
per audit; deliberate asymmetric layouts preserved.

## Actual checks

- Viewed 8 after-home PNGs + before/after `audit.json` (fragments now
  contiguous `air 52.5-101 / 2 101-121 / growth 121-253 / dot 253-262`;
  header+footer greens `rgb(24,60,44)/rgb(127,164,81)/rgb(131,170,83)`;
  hero `border:0/radius:0`; `overflow:-15`).
- `npm run build` passes (Vite 8.3.4, 172ms; `index-*.css` 13.14 kB,
  `main-*.css` 95.14 kB).
- `npm test` 6/6 pass.
- Sandbox audits: motion `position:static` + `min-height:44px` +
  `margin:20px` present, no `fixed` in owned files; scroll `border:0 /
  radius:0 / shadow:none / bg white / overflow:visible`, scene-sticky
  `1320/96` + `100%-40px` mobile; hero still transparent/0;
  brand tokens exact, footer `gap:0`; `lab-lens` + `hero-visual` 3px
  kept; 0 gradients in owned files; hooks (`data-scene`,
  `data-chapter-go`, `data-lab-state`, `#mikroalgen`,
  `#home-after-story`, `.lab-status`) + German strings
  (`Aus der Luft/Wachstum/Kleines System/TRL/Bio-Dünger/
  Einsparpotenzial`) intact; chapter/lab controls ≥48px; focus +
  reduced-motion intact.
- `git status`: owned edits only in `src/design-system.css` +
  `src/page-designs/index.css` (untracked new files, pre-existing dirty
  tree preserved); `src/scroll.css`, other page CSS/HTML, `index.html`
  untouched; nothing committed.

## Remaining for root

- Recapture 1440/390 (no preview tool, AppArmor block, CDP untouched):
  confirm toggle now in flow below legal links (no overlap, ≥44px,
  keyboard/order intact) on all 7 pages desktop+mobile, and carbon
  section as open white band with `0px/0px` audit + inner 1320/96
  gutters. Normal-motion scroll retest after unbox (prior
  `/tmp/a2g-spacing-normal/normal-motion.json` 3-story pin verified;
  latest screenshots caught mid-fade — do not misread as unreadable).
- Outside ownership (report, not edited): `identity.css` teal accents +
  mobile-simplifier overrides still exist; peers own. `model-note`
  alignment still ambiguous — left as sourced.
