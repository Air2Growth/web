# Air2Growth: analysis and redesign

## Source assessment

The live German website presents Air2Growth as a young Munich team developing local CO₂ capture and microalgae-based liquid fertilizer. Its most distinctive content is the carbon-to-crop concept, three founders, recognition from startup competitions, and a modular economic model.

The original uses bright green (#79ac2b), white and gray surfaces, Open Sans, a plant photograph under a white overlay, uppercase navigation, centered section headings, repeated three-column cards, and a long page with substantial vertical spacing. The text explains the concept thoroughly, but repeated section treatments flatten the hierarchy. Technology, economic projections, team evidence, and inquiry opportunities compete for attention. Its economics are presented as benefits without prominent qualification alongside every figure.

## Redesign direction

The audience is farmers and potential partners. The page's primary job is to explain local fertilizer production and invite a conversation.

Color tokens: field paper #f8f9f3, forest #183c2c, leaf #6d8f4e, young growth #d6eda7, secondary text #67746a, divider #dfe4d8. The green palette connects to crops and retains the source's brand association.

Typography: locally hosted Open Sans for interface and content; a serif CO₂ treatment only in the hero to emphasize the raw material. Larger left-aligned headings and quieter supporting text replace repeated centered treatments.

Layout: split hero with agricultural landscape and a carbon orbit, followed by model figures and source-grounded recognition. The home page introduces the concept, key figures, recognitions, and links to six dedicated detail pages. Product, technology, benefits, team, investors, and contact each have their own URL, focused introduction, expanded explanations, and onward navigation. The process diagram is illustrative, not an engineering drawing or a product photograph.

After loading the repository's frontend-design skill, the first pass was refined: decorative section/card numbering was removed, labels changed to sentence case, and repeated italic headline accents were reduced. Numbering remains only for the sequential production stages. The later animation request adds motion tied to scroll progress and visual feedback.

## Content and interaction decisions

The newer user-supplied `sample.html` supersedes the original site for product information: V3 in field testing with the first partner, a validated laboratory prototype (TRL 4), 7 kg fertilizer per module per week, and €800 annual savings potential. The earlier 1-tonne capture figure is no longer promoted because the newer sample omits it.

The process now describes air intake, chemical CO₂ binding in a sorbent, regeneration with nutrient solution, algae supply, photosynthetic growth, and biomass harvest. Water, light and N/P/K nutrients are explicitly named as inputs.

The sample explicitly removed the savings calculator after feedback. It is replaced with model pricing of €3,000 hardware and €50 consumables every two months. No unverified farm payback, investor margin, or emissions statistics are added. The sample's quoted 2.5-year payback cannot be reconciled with €3,000 / €800 without further assumptions.

A compact prototype section uses the supplied CAD view. The team roles and LinkedIn links match the sample. The proof strip highlights StartUp Teens in place of Samsung to reflect the newer selection of recognitions; this does not assert that the earlier Samsung award was rescinded. The award name is corrected to Golden Pitch Spotlight. Planned onboarding (December 2026) and launch (March 2027) are displayed as plans. A pitch-deck inquiry preselects the appropriate contact topic. The later multi-page request adds a dedicated investor page while retaining plain HTML/CSS/JavaScript.

The visible form on the contact page prepares email rather than pretending to submit to a backend. Team photography and fonts are hosted locally. Legal documents stay linked to the source website until deployment-specific documents are supplied.

Accessibility includes visible focus, a skip link, native disclosures, keyboard-operated tabs, explicit navigation state, form labels, mobile layouts, and reduced-motion support.

## Multi-page implementation

The existing sections are distributed into six dedicated detail pages with a shorter home page. Every page has one main heading, a unique title and description, shared navigation with an active-page indicator, breadcrumbs on interior pages, and cross-page contact links. Product and technology content separates the supplied CAD view from the schematic process illustration. Expanded content explains resource inputs, integration questions, model pricing, team roles, achievements, and pilot preparation. Requirements not specified in the source remain discussion topics.

The shared JavaScript initializes process tabs only where present and contact handling only on the contact page. A query parameter carries the pilot or pitch-deck topic. Vite builds all seven standalone HTML documents so direct navigation and refresh work on a static host. Tailscale address discovery and ports are preserved.

## Visual storytelling revision

The new brief asks for controlled scrolling, animation, less text, and more figures. Retain the field-paper/forest/leaf palette and Open Sans hierarchy. The central layout is a left-hand visual and a short right-hand chapter: `[carbon/model figure] [one stage + chapter controls]`. Scrolling pins this scene while its state advances; it never intercepts wheel or touch events. The initial sample turntable was subsequently replaced with 36 native renders of the current full-machine CAD assembly. Generic section-by-section fade effects are limited to the figures themselves.

The homepage shows air → algae → harvest as an authored SVG. Technology advances six existing keyboard-accessible stages. Benefits compare the model's hardware and consumable amounts with proportionate bars; recurring and one-off amounts remain labeled. Investor and team information becomes milestone diagrams. Longer explanations sit inside native disclosures. All model figures remain qualified and planned dates remain identified as plans.

Scenes use sticky positioning only on sufficiently wide/tall viewports. Mobile, short viewports, reduced-motion users, and visitors who turn animations off see all chapters in normal flow. The product slider remains available. A small reading-progress line indicates position across each page. No animation library or new runtime dependency is used.

## Current native machine visual

The user requested the newer assembly from `../air2growth/cad`. The product turntable therefore reads the canonical `cad/machine/Air2Growth-machine.FCStd` with its installed module links and preserves its component colors. Rendered views are website assets only; no CAD source or qualification state is changed. The visual label is “Aktueller CAD-Entwurf” and the caption identifies the overall machine concept. V3 field-test information stays in the separate development-status section, so the newer concept drawing is not represented as a photograph or exact model of that trial.

The later team update adds Thinh Nguyen as Head of Product Development for Hardware & Software. Navika is listed as Head of Sales. The existing photograph remains labeled with the three original founders shown in it.

## Expanded graphics

The new direction treats the website as a cultivation atlas: field contours in the background, an arched landscape in the hero, and a large interactive algae lens in the foreground. Forest green, leaf green, pale lime and paper remain the core palette; water and sunlight accents belong to the diagrams. Open Sans remains the shared typeface. The principal layout is `[algae lens] [plant + three short controls]`, with left-aligned explanatory text. Secondary pages use wide subject-specific illustrations rather than another repeated card grid.

The lens responds to CO₂, growth and harvest selections with schematic cell and plant states. It is explicitly illustrative, not microscopy or measured performance. The product architecture follows the canonical A/B/C/D responsibilities: capture, cultivation, harvest/cleaning, and control/supply. Cultivation-space illustrations, a team work cycle, planned growth milestones and a contact constellation extend the visual language with very little new copy.

## Refinement pass (styling fixes, October 2026)

Screenshot audit (1440px + 390px, all seven pages) confirmed four defect
clusters; fixed without palette, typeface, copy, facts, roles, CAD, motion or
sticky-scroll changes:

- Graphic-section alignment: `.xp-band`, `.xp-cycle`, `.xp-growth` and
  `.xp-constellation` used `margin: … 0 …`, overriding `.wrap`'s
  `margin-inline: auto`, so benefits/investor/contact figures started at
  viewport x=0. Changed to `margin-block` only, preserving shared wrap
  alignment (x=80 desktop / x=20 mobile).
- Background interference: the field-contour body background repeated on both
  axes through every text section. It is now single-anchored
  (`no-repeat, center top`); sticky-scene, page-intro and footer decorative
  layers reduced in size/opacity. Subject diagrams untouched.
- Team cycle scale and repetition: the ring SVG is capped at 720px wide /
  340px tall and centered; the `xp-legend` list duplicated the same four
  people already shown as SVG pills, `vp-roles` and canonical `team-names`,
  so it was removed. Roles, titles and the 3-person photo caption unchanged.
- Legibility and touch targets (controls only, not prose links): lab buttons
  10px/35px → 12px/44px; chapter buttons 42px → 44px/13px; menu toggle
  33px → 44px minimum with centered bars (duplicated toggle media rules
  consolidated into one ≤960px block); motion toggle 10px/37px → 12px/44px;
  reactor eyebrow 5px → 9px; flow labels 10px → 12px; SVG diagram text floors
  at 15px; captions/kickers 11–12px → 12.5–13px with stronger contrast
  (#4f5b52) and a pill behind the lens caption. Hero molecule pulled inside
  the copy column with clamped width; hero tag guarded against overflow.
- Repeated labels: removed eyebrows that restated the page label or heading
  (directory, technology, benefits-economy); kontakt caption middle-dot
  chrome rewritten as a sentence. Numbering kept only for true sequences.
- Section rhythm: `.section` 95px → 80px desktop / 60px → 52px mobile;
  micro-lab and machine-anatomy spacing aligned to the same scale.

Verification: `npm run build` passes; Playwright re-audit checks wrap
alignment, ≥44px control heights, and zero horizontal overflow.

The graphics critique removed rotated shapes that escaped narrow viewports and repositioned the hero label inside its arch. Motion follows the existing animation preference and reduced-motion setting. Decorative SVGs are hidden from assistive technology; controls and captions remain readable. The horizontally scrollable architecture is keyboard-focusable on narrow screens. Native CAD frames and source-qualified figures remain unchanged.

## Mobile audit and optimization

The phone audit covered all seven pages at 320–430px portrait widths and short landscape viewports. Diagram text previously scaled down to 5–9px; mobile now uses native-size labels for the carbon cycle, a compact four-module architecture, and a four-person work cycle. Desktop diagrams retain their original layout. Cultivation illustrations become compact image-and-caption rows, while narrow-screen algae controls use the full available width. Source-qualified model notes remain readable.

Navigation scrolls within a short viewport, moves focus to the first link when opened, restores focus on Escape, and closes on outside taps or focus. The animation switch lives in the footer on phones and short screens so it cannot cover content. Contact fields use 16px type, controls retain generous touch targets, and partner logos occupy separate grid cells. Normal document scrolling, reduced motion, all story chapters, and the native CAD slider remain available.

Verification covered 42 phone layouts (all seven pages at 320×740, 360×800, 390×844, 430×932, 667×375 and 844×390), all six technology stages at three phone widths, native CAD/lens touch controls, navigation focus and dismissal, and reduced motion. Shared route, form, image, link and desktop scroll checks also passed.
