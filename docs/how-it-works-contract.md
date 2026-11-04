# How it works page contract

## Overview

The German `/function` and English `/en/how-it-works` pages explain the intended
grower benefits and biological process of Air2Growth. Static content remains
readable before the optional illustrated tour is activated. The tour uses the
same SVG world for guided playback, manual scroll exploration, and
reduced-motion still scenes.

This contract covers the page component, rather than the whole repository.
The visual direction is recorded in [the design plan](./how-it-works-design.md).

## Interface

- [`src/function-tour.js:TOUR_SCENES`](../src/function-tour.js) exports eight
  frozen scene records with `id`, `start`, `end`, `still`, `title`, and
  `description`. `TOUR_DURATION` is derived from the final scene's end.
- [`src/function-tour.js:formatTourTime`](../src/function-tour.js) formats
  seconds as a minute/second label; `sceneAt(time)` selects a scene index.
- [`src/function-tour.js:initFunctionTour`](../src/function-tour.js) enhances
  a `data-function-tour` root and returns a cleanup function. A root already
  marked `data-tour-ready` is not initialized twice.
- [`templates/partials/function-tour.html:data-function-tour`](../templates/partials/function-tour.html)
  provides the page, launch controls, scene caption, progress region, and
  explanation. `journey-explained` and `journey-heading` are the destination
  and focus target for Skip/Continue.
- [`templates/partials/function-tour.html:function-animation`](../templates/partials/function-tour.html)
  is the main hero link's destination, keeping the optional tour reachable
  before the detailed written process. The static greenhouse artwork is
  [`public/img/function-ecosystem.svg`](../public/img/function-ecosystem.svg).
- [`templates/partials/function-illustration.html:data-art`](../templates/partials/function-illustration.html)
  provides the SVG world and named animation targets consumed by
  `buildTimeline(root, isMobile)`. Dimensional layers include `greenhouse-rear`,
  `crop-rows`, `greenhouse-front`, and `depth-foreground`. The biological
  close-up uses `microscope`, `cell-mother`, `cell-daughter`, and `cell-colony`.
- [`src/main.ts:tour`](../src/main.ts) loads the tour module only when its
  root exists and registers its cleanup for Vite hot disposal.
- [`src/messages.ts:message`](../src/messages.ts) resolves runtime text from
  the German and English tour catalogs. Static page text is translated by
  [`src/i18n-html.ts:translateHtml`](../src/i18n-html.ts).

## Invariants

- [`src/function-tour.js:TOUR_SCENES`](../src/function-tour.js): scene order
  is delivery, installation, capture, supply, growth, harvest, service, and
  closing. The current total is 38 seconds. Scene timings and still positions
  are shared by playback, progress labels, and reduced-motion navigation.
- [`src/function-tour.js:buildTimeline`](../src/function-tour.js): water and
  nutrients are present at setup; growth changes the culture's density and
  colour. Cultivation uses integrated UV lights, represented by the
  `culture-light` artwork and described in the growth scene. CO₂ capture,
  supply, growth, and harvest are separate phases.
- [`src/function-tour.js:buildTimeline`](../src/function-tour.js): depth-layer
  parallax, captured/released carbon, cell division, collection flow, and
  root-zone application all belong to the same finite timeline. The
  microscope is visible during growth and hidden by harvest. Closing returns
  the world camera and depth-layer translations to their initial framing.
- [`src/function-tour.js:start`](../src/function-tour.js): the bounded
  animation begins only after activation. It stays in normal document flow.
  Reduced motion calls `showStill(0)` instead of starting autoplay.
- [`src/function-tour.js:resume`](../src/function-tour.js): playback resumes
  from the current GSAP timeline time and leaves native scrolling untouched.
- [`src/function-tour.js:finish`](../src/function-tour.js): completion preserves
  the final greenhouse and plant-application view in normal flow.
- [`src/function-tour.js:exit`](../src/function-tour.js): exit restores the
  poster and focuses the start button. `continueWebsite()` focuses
  `journey-heading` and scrolls to the written explanation.
- [`src/function-tour.js:mm.add`](../src/function-tour.js): motion preference
  or layout changes rebuild the timeline in a GSAP media context; resumed
  animation requires explicit user action. `visibilitychange` pauses a
  playing tour without automatically resuming it.

## Side Effects

- [`src/function-tour.js:setState`](../src/function-tour.js) and
  `renderFrame()` update root data attributes, control visibility, text,
  SVG styles, progress accessibility attributes, and the live status region.
- [`src/function-tour.js:resume`](../src/function-tour.js) plays the GSAP
  timeline from its current time and leaves document scrolling untouched.
- [`src/function-tour.js:on`](../src/function-tour.js) registers input,
  visibility, and resize listeners using one `AbortController`. The returned
  cleanup aborts listeners, stops playback, and reverts the timeline and media
  context.
- [`src/function-tour.js:initFunctionTour`](../src/function-tour.js) performs
  browser presentation work; it contains no order, telemetry, or notification
  request. [`src/main.ts:tour`](../src/main.ts) dynamically loads its module.

## Verification

From the repository root:

```sh
bun run build
bun test tests/i18n.test.ts tests/seo.test.ts tests/hero-loading.test.ts
```

Open `/function` or `/en/how-it-works` on the Vite development server and run:

```js
await (await import('/tests/function-tour.browser.js')).runFunctionTourChecks()
```

[`tests/function-tour.browser.js:runFunctionTourChecks`](../tests/function-tour.browser.js)
checks actual scroll playback, touch interruption, all eight scenes, timing,
reverse exploration, replay cleanup, focus, and reduced-motion navigation.
It also checks cell-division visibility and reversal, collection flow, and the
final root-zone view.
Also inspect the layout at desktop and narrow mobile widths in both languages.
