# Templates

## Overview

This directory is the HTML route layer for the Air2Growth site. Each route is a complete German document shell that composes a route-specific head fragment, shared navigation and footer, and one or more content fragments from [partials/README.md](./partials/README.md). The build renderer expands the explicit `@include` markers before Vite serves the pages.

## Interface

- **Route shells:** [index.html](./index.html):3-17 composes the homepage sections; [loesung.html](./loesung.html):3-12 composes the solution page; [function.html](./function.html):3-9 composes the function tour; [meilensteine.html](./meilensteine.html):3-9 composes milestones; [ueber-uns.html](./ueber-uns.html):3-9 composes the team page; [vision.html](./vision.html):3-9 composes the vision page; [datenschutz.html](./datenschutz.html):3-9 composes privacy content; and [impressum.html](./impressum.html):3-9 composes the legal notice.
- **Child contract:** [partials/README.md](./partials/README.md) documents the 33 reusable fragments and their browser-facing markup hooks.
- Every shell includes a route head, [partials/nav.html](./partials/nav.html), a single `main#inhalt`, and [partials/footer.html](./partials/footer.html). The route-specific composition is the sequence of `@include` comments in each file.

## Invariants

- All route roots declare `lang="de"`, `class="scroll-smooth motion-reduce:scroll-auto"`, and the same document shell shape ([index.html](./index.html):1-6; [loesung.html](./loesung.html):1-6; [function.html](./function.html):1-6).
- Each route exposes exactly one `main#inhalt`, which is the target of the shared skip link ([index.html](./index.html):5-6; [partials/nav.html](./partials/nav.html):1).
- Shared navigation and footer remain present around route content in every shell ([index.html](./index.html):5-17; [loesung.html](./loesung.html):5-12; [datenschutz.html](./datenschutz.html):5-9).
- Include names must resolve to files under `templates/partials`; the route files use explicit `@include` markers rather than embedding fragment source ([index.html](./index.html):3,5,7-15; [function.html](./function.html):3,5,7; [partials/function-tour.html](./partials/function-tour.html):56).
- The route shells preserve the `@seo`, `@breadcrumbs`, and `@languages` placeholders owned by the head, editorial/legal fragments, and navigation ([partials/head.html](./partials/head.html):4; [partials/about-page.html](./partials/about-page.html):3; [partials/nav.html](./partials/nav.html):15,26,44).

## Side Effects

- Rendering any shell includes [partials/head-assets.html](./partials/head-assets.html):1-6, which requests site icons and starts `/src/main.ts` plus deferred HTMX.
- Route-specific heads preload hero, team, or solution imagery ([partials/head.html](./partials/head.html):5; [partials/head-about.html](./partials/head-about.html):5; [partials/head-solution.html](./partials/head-solution.html):5).
- Shell composition exposes the route and hash anchors, media resources, native disclosure controls, and contact/external links documented in [partials/README.md](./partials/README.md).

## Verification

- Run: `bun run test:seo`
