# Template Partials

## Overview

This directory contains the reusable HTML fragments composed into the route shells in `../`. Fragments are expanded through the explicit `@include` markers in the route files and in the head/legal fragments. The markup is the contract consumed by the browser modules: stable IDs, `aria-*` relationships, and `data-*` hooks identify navigation, media, disclosures, supporter controls, and the function tour.

## Interface

- **Shared document head:** [head.html](./head.html):1-7, [head-about.html](./head-about.html):1-7, [head-solution.html](./head-solution.html):1-7, [head-datenschutz.html](./head-datenschutz.html):1-6, [head-function.html](./head-function.html):1-6, [head-impressum.html](./head-impressum.html):1-6, [head-milestones.html](./head-milestones.html):1-6, and [head-vision.html](./head-vision.html):1-6 emit the charset, viewport, `@seo` placeholder, optional image preload, and the shared [head-assets.html](./head-assets.html):1-6 include.
- **Global chrome:** [nav.html](./nav.html):1-46 provides the `#inhalt` skip link, desktop/mobile route links, `#nav-toggle[data-nav-toggle]`, `#mobile-menu[data-mobile-menu]`, language placeholders, and the no-script navigation fallback. [footer.html](./footer.html):1-12 provides the site footer, contact links, legal links, and `#top` link.
- **Homepage sections:** [hero.html](./hero.html):1-19 (`#top[data-hero]` and hero-video hooks), [problem.html](./problem.html):1-16 (`#problem`), [solution.html](./solution.html):1-39 (`#loesung`), [benefits.html](./benefits.html):1-16 (`#vorteile`), [vision.html](./vision.html):1-10 (`#vision`), [milestones.html](./milestones.html):1-19 (`#meilensteine`), [supporters.html](./supporters.html):1-25 (`data-supporters` and `#supporter-logos`), [team.html](./team.html):1-12 (`#team`), and [contact.html](./contact.html):1-16 (`#kontakt` and `#newsletter`).
- **Solution route:** [solution-overview.html](./solution-overview.html):1-56 exposes `#loesung`/`#vorteile` and the labelled system diagram; [process.html](./process.html):1-12 exposes `#funktionsweise`; [faq.html](./faq.html):1-13 exposes `#fragen`; [solution-contact.html](./solution-contact.html):1-6 exposes the contact boundary at `#kontakt`.
- **Function route:** [function-tour.html](./function-tour.html):1-154 exposes `data-function-tour`, `#function-animation`, `#function-process`, `#journey-explained`, tour controls, progress/live-status hooks, and the [function-illustration.html](./function-illustration.html):1-771 SVG include. The illustration exposes `.tour-world[data-tour-svg]`, stable `a2gf-*` definitions, and `data-art` groups.
- **Editorial pages:** [about-page.html](./about-page.html):1-109 exposes the team and collaboration sections (`#about-title`, `#gruendungsteam`, `#zusammenarbeit`) and the four portrait assets under `/img/headshot/`; [milestones-page.html](./milestones-page.html):1-174 exposes `#milestones-title`, `#auszeichnungen`, and `#begleitung`; [vision-page.html](./vision-page.html):1-54 exposes `#vision-title`, `#perspektive`, `#grundsaetze`, `#entwicklung`, and `#mitgestalten`.
- **Legal and utility fragments:** [legal-header.html](./legal-header.html):1-3 supplies breadcrumb markup; [privacy-content.html](./privacy-content.html):1-384 supplies the privacy table of contents and section IDs; [impressum-content.html](./impressum-content.html):1-25 supplies the legal notice; [intro.html](./intro.html):1-9 supplies the labelled `#intro-heading` intro section.

## Invariants

- Every labelled section pairs an `aria-labelledby` value with a matching heading ID in the same fragment (for example [hero.html](./hero.html):9, [solution-overview.html](./solution-overview.html):1-6, and [function-tour.html](./function-tour.html):1,7).
- The hero starts in the declared idle state: `#top[data-hero]` has `data-video-state="idle"`, a four-item `data-playlist`, and two muted, inline, non-preloaded video slots initialized with `data-visible="false"`, `data-layer="bottom"`, and `data-video-state="idle"` ([hero.html](./hero.html):1-5).
- Mobile navigation starts closed and inert: `#nav-toggle` has `aria-expanded="false"`, while `#mobile-menu` has `aria-hidden="true"` and `inert`; the close action remains `data-nav-close` ([nav.html](./nav.html):18,29-32).
- The six FAQ disclosures share `name="air2growth-faq"`, so their native disclosure grouping remains intact ([faq.html](./faq.html):5-10).
- Supporter controls are hidden until the runtime enables them; the previous button starts disabled, and the viewport is labelled and described by the supplied heading and hint ([supporters.html](./supporters.html):5-16).
- The function tour starts at `data-tour-state="poster"`; its start button is disabled, its dynamic controls/caption are hidden, and its progress bar starts at `0` of `1` ([function-tour.html](./function-tour.html):1,47-75).
- Privacy table-of-contents links continue to target the five matching section IDs (`datenschutz-ueberblick`, `hosting`, `pflichtinformationen`, `datenerfassung`, and `web-analyse`) ([privacy-content.html](./privacy-content.html):10-22,64-65,104-105,243-244,346-347).
- The two explanatory diagrams remain accessible SVGs with `role="img"` and matching title/description IDs ([solution-overview.html](./solution-overview.html):11-13; [solution.html](./solution.html):11-13).

## Side Effects

- [head-assets.html](./head-assets.html):2-6 causes each rendered route to request icon assets, execute `/src/main.ts` as a module, and load `/assets/htmx.min.js` deferred.
- Head variants preload page-specific assets (`hero.webp`, `teamphoto.jpg`, or `solution-system.svg`) ([head.html](./head.html):5; [head-about.html](./head-about.html):5; [head-solution.html](./head-solution.html):5).
- [hero.html](./hero.html):3-5 references hero image/video resources and exposes the playback/state targets consumed by runtime code; authored videos are muted, inline, and `preload="none"`.
- Navigation and contact fragments emit route/hash anchors, `mailto:` links, and external LinkedIn/source links ([nav.html](./nav.html):7-11,17,25,35-40; [contact.html](./contact.html):6,11; [solution-contact.html](./solution-contact.html):4; [footer.html](./footer.html):4,9).
- [about-page.html](./about-page.html):27-68 loads the four named team portraits with intrinsic dimensions and lazy decoding, while retaining direct email and LinkedIn links for each person.
- Native `<details>` elements expose browser-managed disclosure state in the FAQ, supporter sources, milestones, and function-tour privacy disclosure ([faq.html](./faq.html):5-10; [supporters.html](./supporters.html):19-23; [milestones-page.html](./milestones-page.html):32-125; [function-tour.html](./function-tour.html):137-141).
- The function tour and illustration expose DOM state targets for animation, progress, announcements, and SVG scene changes (`data-tour-*`, `data-art`, and `tour-initial-hidden`) ([function-tour.html](./function-tour.html):47-75; [function-illustration.html](./function-illustration.html):1,201-771).
- The legal copy links to external hosting, policy, form-processing, and analytics disclosures; these links use `target="_blank"` with `rel="noopener noreferrer"` where specified ([privacy-content.html](./privacy-content.html):70-71,98-99,305-318,363-364).

## Verification

- Run: `bun run test:seo`
