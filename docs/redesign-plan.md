# Air2Growth review implementation plan

Based on Tim and Felicia's reviews, 22 October 2026.

## Protected scope and review priorities

**The homepage video feed is frozen.** Keep its four video files, playlist, two-player markup, crossfades, playback controls, loading policy, visibility handling and reduced-motion behaviour unchanged. Do not remove, replace, shorten or reimplement it. The shorter animation described below refers only to the illustrated tour on `/function` and `/en/how-it-works`.

The live development server is available at `http://localhost:3000/` and is open in the shared T3 preview. Use this server for visual review throughout implementation.

- **Priority 1 — understanding and trust:** problem/relevance, clear product benefit, correct biological wording and greenhouse setting, honest contact flow, fewer repetitions.
- **Priority 2 — coherent presentation:** restrained logo-related palette, recurring cell motif, quieter navigation, concise introductions, visual vision/team/milestones pages.
- **Priority 3 — richer evidence:** verified programme logos and event photography, individual headshots and personal social profiles when genuine assets are available.

Keep the existing six marketing routes and their English equivalents. Put the problem on the homepage and link to it where helpful; a separate regularly maintained problem/news section can follow when there is enough sourced content.

## Design direction

Air2Growth develops a greenhouse system that captures CO₂ from ambient air and supplies it to microalgae cultivation. The resulting biomass is the basis for liquid fertiliser. The website should help agricultural partners quickly understand the problem, intended farm benefit, development status, and people behind it.

### Compact design system

- **Forest `#263E2D`**: primary text, strong statements.
- **Leaf `#45714C`**: buttons and essential accents.
- **Sage `#A7B89C`**: secondary illustration tones.
- **Dew `#EEF3EC`**: quiet section backgrounds.
- **White `#FCFDFC`**: main canvas.
- **Water `#DCEAEC`**: CO₂/water stages and supporting diagrams.
- Preserve the supplied logo in its original colours; avoid fluorescent green surfaces and recolouring/filtering the footer logo.
- **Type**: locally hosted Open Sans, deliberate bold display headings and regular body copy outside the protected video presentation. Short readable lines, sentence case, no decorative labels. Keep headline changes scoped so they do not modify video behaviour.
- **Layout**: left-aligned headlines and copy; generous asymmetrical text/image pairings; concise benefits; one clear opening per route. Avoid replacing prose with a uniform grid of cards.
- **Recognisable element**: connected algae cells and greenhouse arches. Use cells to connect meaningful ideas, phases, or milestones; keep surrounding sections quiet.

```text
Home:       quiet navigation over the unchanged video feed
            headline + specific promise + solution CTA
            problem → intended farm benefits
            concise solution + prominent animation link
            vision / milestones / supporters / team / direct contact

Solution:   strong opening | one abstract process illustration
            intended farm benefits
            one compact explanation + animation CTA + FAQ

Milestones: strong opening | authentic team/event image
            compact chronological/grouped milestones with expandable detail
            programme logos + current Samsung participation

Vision:     strong statement | photographic / connected-cell composition
            three concise commitments + invitation to participate

Team:       strong opening + authentic team photo
            people, responsibilities, verified contact links
            short shared working principles

Tour:       clear introduction + prominent start
            greenhouse setup → core biological process → fertilising plants
            accessible playback and compact explanation
```

### Review before implementation

A pastel text page, decorative bubble wallpaper, and repeated identical cards would reproduce the issues in the reviews. Instead, the visual motif represents the actual biological loop; photographs carry the human/vision sections; milestones use compact disclosures. Keep the video as the homepage's most memorable element. Use diagrams to explain the principle without presenting unverified hardware as a real product.

## Work packages

1. **Evidence and existing assets**: inspect source templates, localisation, actual photos, original logos, social profiles and programme details. Do not fabricate headshots, event images, dates, profile handles, product specifications, or savings figures.
2. **Shared design and homepage**: quieter navigation, muted colours, consistent typography/motif, stronger hero copy; restore visible problem/relevance and intended cost/local-production benefits; adopt “Auf diese Frage entwickeln wir die Antwort”; remove misleading demo contact/newsletter forms in favour of direct email and verified company channels; correct footer logo; make supporters manually browsable with accessible controls.
3. **Solution and tour**: one schematic system, no implication of multiple hardware products; eliminate redundant process lists; say microalgae use CO₂ for growth; greenhouse setting, prefilled water/nutrients, shorter setup/service scenes, retain core device animation and show fertiliser application; improve start CTA, performance and reduced-motion behaviour; preserve FAQ.
4. **Milestones, vision and team**: concise page openings, authentic imagery, compact expandable competition/programme details and original logos; Samsung current participation; visual vision with few strong statements; concise person responsibilities including Felicia's marketing work; icon email/verified LinkedIn links and short working principles.
5. **Localisation and integration**: translate all changed visible and accessible strings into English; preserve routes, metadata, language switcher, hero loading, navigation and existing API behaviour. Update obsolete in-page redirects where the problem section returns.
6. **Verification and critique**: build, existing SEO/i18n/hero checks, focused tour interaction checks, desktop/mobile browser review of every marketing route in both languages, keyboard navigation, reduced motion and no-JS content; fix visual and integration regressions. Document asset/profile gaps rather than inventing content.

## Page-by-page specification

### Homepage

1. Preserve the video feed. Make the surrounding navigation less visually dominant through a quieter surface and tighter proportions; retain readable logo colours and clear active/focus states.
2. Tighten the supporting promise to: **“Wir entwickeln ein System, mit dem landwirtschaftliche Betriebe Bio-Flüssigdünger direkt vor Ort erzeugen können.”** This describes the project and its development status without implying a commercially available device.
3. Restore a short problem section: dependence on purchased fertiliser, price/supply uncertainty, and the energy needed for conventional fertiliser production. Link supporting environmental claims to primary sources; avoid unsupported numerical comparisons.
4. Follow with a short answer: **“Was wäre, wenn Ihr Hof einen Teil seines Düngers selbst erzeugt? Auf diese Frage entwickeln wir die Antwort.”** Link to the solution page for detail.
5. Show local fertiliser production and potential lower purchase costs together. Explain that operating costs, yield and economic viability still need validation. Do not reinstate prominent `800 €`, `6 kg` or `1 t` model figures without evidence and clearly documented assumptions.
6. Use a prominent play control and descriptive label for the illustrated tour. Avoid a duration label until the final tour timing is verified.
7. Keep vision, milestones and team as short, distinct previews. Use the genuine team photograph where it adds value; do not repeat full-page copy.
8. Make supporters immediately browsable with native horizontal scrolling, keyboard access and previous/next controls. User interaction pauses automatic motion. Reduced motion and missing JavaScript leave the genuine logo list usable.
9. Replace contact/newsletter demo validation forms with direct email and verified social destinations. The action must do what its label says. Keep any existing API endpoints working independently of removing their obsolete UI.
10. Display the original footer logo on a suitable quiet surface, with no `brightness`/`invert` recolouring.

### Lösung

- Opening: **“Ihr Dünger. Direkt vor Ort.”** One short paragraph, one principle illustration, one primary action.
- The illustration describes one integrated system. Use abstract air/CO₂, microalgae and crop forms rather than two invented pieces of hardware. Clearly label it as a schematic principle.
- Present the benefits together: local production, the potential to replace some purchased fertiliser, and better control of supply. Keep these as intended benefits while the system is in development.
- Explain the process once. Remove the duplicate step strip, second hardware-like drawing, and overlapping accordion explanations where they repeat the same idea.
- Preferred biological wording: **“Mikroalgen nutzen das gewonnene CO₂ für ihr Wachstum. Aus der geernteten Biomasse soll Bio-Flüssigdünger entstehen.”**
- Keep a compact FAQ for genuine questions: location in the greenhouse, inputs, development status, suitability for farms, economics, and CO₂ use. Keep the distinction between CO₂ use and permanent storage here, where it answers a real question.

### So funktioniert’s

- Give the route a visible concise opening before playback, with a prominent **“Animation starten”** control. Written information stays readable without playing anything.
- Aim for roughly **35–40 seconds**, subject to a browser playback check. Use one manifest as the source of duration/progress/still-scene timing.
- Brief context: delivery/setup in a greenhouse. Keep most screen time for the existing device cutaway and biological process. Compress ordering, logistics, dashboard and maintenance sequences.
- Water and nutrients are already present before cultivation. CO₂ capture/supply, microalgae growth and biomass preparation occur in the right order.
- End with the resulting fertiliser being applied to plants. Avoid a final image that suggests the device operates in an open field.
- Optimise measured causes of lag: reduce expensive SVG effects, unnecessary per-frame DOM/layout work and excessive scroll travel. Keep animations reversible and synchronised if scroll scrubbing remains.
- Retain pause, resume, replay, exit, keyboard support and reduced-motion still scenes. Do not remove these controls to achieve a shorter tour.
- Keep the following explanation to a few sentences, with optional service details disclosed only on request.

### Meilensteine

- Opening: **“Aus einer Idee wird ein gemeinsamer Weg.”** Pair it with genuine available imagery.
- Use a compact connected vertical sequence of expandable milestones. Only use dates where the source confirms them; otherwise group achievements rather than fabricating a chronology.
- Each collapsed item shows the organisation logo/name, competition and outcome. Expansion adds two or three sentences about the programme and why it mattered to the team, plus an official source link and an authentic event photograph when available.
- Preserve the four listed competition outcomes: Jugend gründet Munich pitch, STARTUP TEENS Bayern Challenge, Jugend gründet national final/Golden Spotlight Award, and Samsung Solve for Tomorrow.
- Separate awards from current support. Include the Young Founders Network, UnternehmerTUM and **Samsung Solve for Tomorrow's current support programme**. Verify the exact stage before labelling it; public team posts describe a six-month Impact Phase after the 2026 final. [Team member's account](https://de.linkedin.com/posts/timkothe_solvefortomorrow-activity-7502746535722643456-6W-T).
- Remove the permanent-carbon-storage statement from the milestone/status narrative; keep necessary technical context in the FAQ.

### Vision

- Opening: **“Mehr Eigenständigkeit für die Landwirtschaft.”** Follow with one short mission statement.
- Use a photographic composition grounded in agriculture, with the cell motif connecting three commitments: **Vor Ort produzieren. Ressourcen sinnvoll nutzen. Mit der Praxis entwickeln.**
- Give each commitment one short supporting sentence. Replace the long principles table and the “Eine Vision muss sich im Alltag bewähren” section.
- Close with a direct invitation to farmers/research partners to help shape development. Keep aspiration and achieved results visibly distinct.

### Über uns

- Opening: **“Vier Perspektiven. Ein gemeinsamer Antrieb.”** Use the existing genuine group image until individual portraits are supplied.
- Show names and concrete responsibilities: Navika — Vertrieb; Tim — Forschung; Felicia — Finanzen und Marketing; Thinh — Entwicklung. Preserve current scope unless the team supplies more precise role definitions.
- Replace each generic biography with the role alone or at most one specific sentence.
- Provide accessible icon buttons for each person's existing email address and personal LinkedIn profile verified or explicitly supplied by the site owner. Never send different people to guessed handles. Company LinkedIn is a separately labelled fallback.
- Replace the long shared-approach block with three working principles: **Gemeinsam forschen. Verständlich entwickeln. Mit Betrieben testen.**

## Evidence, assets and decisions

- Available locally: original `public/img/logo.svg`, agricultural hero image, genuine `public/img/Air2Growth-Team.webp`, five organisation logos with a provenance manifest, four protected homepage clips.
- Verified company LinkedIn: [Air2Growth](https://linkedin.com/company/air2growth). This profile links to the company domain and describes the same team/product.
- Verified during implementation: the official Samsung logo and programme source, and personal LinkedIn profiles for Tim, Felicia and Navika. Provenance is recorded in `docs/redesign-evidence.json`.
- Explicitly supplied by the user/site owner on 2026-10-22: [Thinh Nguyen's personal LinkedIn profile](https://www.linkedin.com/in/thinisde/). The exact supplied URL is used; no independent identity verification is claimed.
- Supplied through public posts at the user's request on 2026-10-23: five original event and demonstration photos from Air2Growth, Tim Kothe and Felicia Kloss. `docs/linkedin-image-sources.json` records the downloads, original posts and visible credits, including JUGEND GRÜNDET's image credit. Historical exhibition groups are not presented as the current four-person team.
- Still to verify or obtain: company Instagram destination, individual headshots, a current photograph of all four team members and exact event dates. These affect enrichment, not the ability to implement the layout and concise content; published milestones use confirmed years. Supplied landscape stock photos can support the vision and solution context when displayed in landscape frames.
- Do not crop the group photograph into supposed individual headshots without a reliable person-to-position mapping.
- Any externally obtained logo/photo must have its source and usage/attribution requirements recorded. Do not label stock photography as a team event.
- The intended financial advantage should be stated qualitatively until validated operating assumptions and field results support figures.

## Implementation order and delegation

| Order | Deliverable | Dependency / review gate |
| --- | --- | --- |
| 1 | Final plan, content inventory, protected video scope | This document; existing working tree inspected |
| 2 | Shared tokens/navigation/footer and homepage | Preserve video source and behaviour; check locally |
| 3 | Solution copy/diagram and shorter illustrated tour | Correct sequence and single-system principle agreed in this brief |
| 4 | Milestones, vision and team | Genuine existing assets; enrich as verified assets become available |
| 5 | English translations, metadata and integration | Final German copy; catalog coverage complete |
| 6 | Browser critique, regression checks, review coverage | Build and relevant checks pass; gaps documented |

Use separate Codex tasks for shared/homepage, solution/tour, and editorial pages, with disjoint file ownership. Review the integrated result in a separate delegated round when available. **Execution update, 22 October 2026:** delegation became available after the initial rate-limit failures. All three implementation packages and an independent integrated review completed through T3-owned tasks. Final checks and review findings are recorded in `docs/redesign-validation.json`.

## Acceptance checks

- The protected video markup, playlist, clips and playback/loading code have no implementation diff. Its existing pause/visibility/reduced-motion behaviour still works.
- A visitor can identify the problem, proposed farm value, development status and contact action without playing an animation or opening an accordion.
- Every marketing route has one visible meaningful main heading and a brief introduction. Both languages render complete copy and accessible labels.
- One concise explanation owns the process; the solution page has no duplicate standalone three-step summary or inconsistent second device.
- The illustrated tour shows a greenhouse, prefilled water/nutrients, biological growth before harvesting, and plant fertilisation at the end; actual elapsed duration matches displayed timing.
- Logos are manually browsable using touch, trackpad and keyboard; reduced motion stops unsolicited movement.
- Contact actions open real email/social destinations. No interface claims to send or subscribe when it merely validates.
- Milestone details open with keyboard and pointer, show the correct result and have genuine source/asset evidence.
- Felicia's responsibilities include marketing; person contacts have clear accessible names.
- Desktop and mobile at 1440/1280, 768 and 390/320 px remain readable, without clipped controls or horizontal page overflow. Test enlarged text and long English/German labels.
- Visible keyboard focus, meaningful alt text, usable contrast, no-JS content and reduced motion survive the redesign.
- Run one production build, existing `tests/i18n.test.ts`, `tests/seo.test.ts`, `tests/hero-loading.test.ts`, and focused updated tour browser checks. Update assertions only where the intended tour behaviour changes.
- Record actual validation results and unresolved real-asset gaps; do not mark a planned change as delivered.

## Review coverage

| Feedback | Planned resolution |
| --- | --- |
| Intrusive white banner | Smaller, quieter navigation that remains readable over video |
| Generic homepage wording | Specific on-site fertiliser promise and development statement |
| Patiently waiting for logos | Native/manual browsing plus direct previous/next controls |
| Confusing form and newsletter | Direct email and social destinations; no pretend submission |
| Wrong footer logo colours | Supplied original asset, without colour filters |
| Bright or inconsistent greens | Shared muted tokens, original logo preserved |
| Weak recognition / inconsistent page openings | Connected-cell motif, coherent typography, strong route introductions |
| Missing problem / relevance / benefits | Visible problem and intended farm-value sections |
| Repeated or misleading hardware/process | One principle diagram, one concise explanation, one focused tour |
| Laggy / long tour | Shorten peripheral scenes, reduce expensive work, preserve main device sequence |
| Greenhouse / water order / final application | Correct illustrated setting and sequence, fertilise plants at the end |
| Incorrect CO₂ wording | Microalgae use captured CO₂ to grow; biomass becomes fertiliser |
| Milestones too large / little context | Compact disclosures, authentic imagery and programme logos |
| Current Samsung programme missing | Add explicit participation using verified programme naming |
| Vision too plain and wordy | Photography, connected visual composition, three concise commitments |
| Team generalities / long prose | Responsibilities, short principles, direct contact icons |
| Felicia role | Finances and marketing |
| LinkedIn / Instagram / headshots | Verified channels; use real available imagery; record missing portraits/URLs |
| Cost savings unclear | State intended savings alongside local fertiliser, without unsupported guarantees |

## Delivery constraints

Implement in this repository and verify locally. Publishing is a separate action. Use the supplied group photograph and the company/team post photos requested by the user, retaining visible original credits and source links. Individual headshots and a current four-member group photo remain genuine-asset gaps.
