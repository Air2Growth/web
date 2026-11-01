# docs Blueprint

## Overview

The `docs/` directory is the project’s documentation record for the Air2Growth
site redesign. It contains the illustrated-tour contract and design brief,
redesign planning and evidence, image provenance, validation results, and the
latest drift report. The directory contains documentation and data artifacts;
it has no executable source or child packages.

## Interface

- No executable symbols are exported from this directory (read-only scout
  result: `None`).
- [`how-it-works-contract.md`](./how-it-works-contract.md) defines the
  `/function` and `/en/how-it-works` page contract, including its source
  boundaries and verification commands.
- [`how-it-works-design.md`](./how-it-works-design.md) records the illustrated
  tour’s audience, design tokens, layout, animation depth, and implementation
  boundaries.
- [`redesign-plan.md`](./redesign-plan.md) records redesign scope, route-level
  requirements, work packages, acceptance checks, and review coverage.
- [`redesign-evidence.json`](./redesign-evidence.json) records source and asset
  evidence for the milestones, vision, and team work package.
- [`linkedin-image-sources.json`](./linkedin-image-sources.json) records the
  provenance and display rules for the five selected LinkedIn image assets,
  excluded candidates, and remaining asset gaps.
- [`redesign-validation.json`](./redesign-validation.json) records production,
  route, responsive, no-JavaScript, interaction, and illustrated-tour checks.
- [`2026-10-28_DRIFT_REPORT.md`](./2026-10-28_DRIFT_REPORT.md) records the
  drift checks for the tour contract, design brief, and root illustrated-tour
  documentation.

## Invariants

- No executable source, runtime route, or exported API is defined in this
  directory (scout result: `None`).
- Documentation claims and asset provenance remain tied to the source links,
  local paths, and validation records named by the linked artifacts.

## Side Effects

- None. Reading these Markdown and JSON artifacts does not execute application
  code or mutate runtime state.

## Verification

From the repository root, run:

```sh
bun run test:i18n
git diff --check
```
