# scripts

## Overview

The `scripts/` package contains the local development coordinator for the
Air2Growth site. `dev.ts` keeps the Bun API process and the Vite frontend
running together, supplies the frontend with the backend target, and refreshes
the locally served HTMX asset when it is missing.

## Interface

- [`dev.ts:BACKEND_PORT`](./dev.ts) and [`dev.ts:FRONTEND_PORT`](./dev.ts)
  read the `BACKEND_PORT`, `FRONTEND_PORT`, and `PORT` environment contract.
- [`dev.ts:api`](./dev.ts) starts `bun --hot server.ts`;
  [`dev.ts:vite`](./dev.ts) starts Vite with the selected frontend port and
  API target.
- [`dev.ts:shutdown`](./dev.ts) handles process signals; the first child to
  exit determines the coordinator's exit status after its sibling is stopped.

## Invariants

- [`dev.ts:htmxSrc`](./dev.ts) is the local `node_modules/htmx.org`
  distribution and [`dev.ts:htmxDst`](./dev.ts) is
  `public/assets/htmx.min.js`; a missing source or failed copy exits with
  status `1`.
- [`dev.ts:shutdown`](./dev.ts) is guarded so SIGINT/SIGTERM cleanup runs
  once.
- [`dev.ts:first`](./dev.ts) stops the sibling process and returns the first
  child's numeric exit code, or `1` when no numeric code is available.

## Side Effects

- [`dev.ts:htmxDst`](./dev.ts) may create `public/assets/` and copy the
  local HTMX distribution into it.
- [`dev.ts:api`](./dev.ts) and [`dev.ts:vite`](./dev.ts) spawn child
  processes; [`dev.ts:shutdown`](./dev.ts) terminates both children and exits
  after the short cleanup window.

## Verification

- Run: `bun run test:i18n`
