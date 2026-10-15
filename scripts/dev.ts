// Coordinated dev: Bun API backend + Vite frontend (single styling pipeline).
// Run: bun run dev
// - Backend: `bun --hot server.ts` on 127.0.0.1:3001 (API-only in dev;
//   override via BACKEND_PORT or PORT). Serves /api/*, nothing else.
// - Frontend: `bunx vite` on 0.0.0.0:3000 (override via FRONTEND_PORT),
//   /api proxied to the backend (override via BUN_TARGET). Pages are
//   assembled from templates/ per request; Tailwind compiles in Vite
//   (@tailwindcss/vite) — no CSS file is generated, no watcher besides Vite.
// - htmx (`/assets/htmx.min.js`) is served by Vite from public/: ensure the
//   git-ignored copy exists before starting (same copy `bun run build` uses).
// - Either child exiting kills the sibling (no linger on port conflict);
//   SIGINT/SIGTERM stop both.
import { existsSync } from "node:fs";
import { cpSync, mkdirSync } from "node:fs";

const BACKEND_PORT = process.env.BACKEND_PORT ?? process.env.PORT ?? "3001";
const FRONTEND_PORT = process.env.FRONTEND_PORT ?? "3000";
const BUN_TARGET =
  process.env.BUN_TARGET ?? `http://127.0.0.1:${BACKEND_PORT}`;

// htmx is a pinned npm dep, served as a static file (no CDN). Vite serves
// public/ in dev and copies it to dist/ in build; the copy itself is
// git-ignored, so materialize it here (idempotent) instead of checking it in.
const htmxSrc = `${import.meta.dir}/../node_modules/htmx.org/dist/htmx.min.js`;
const htmxDst = `${import.meta.dir}/../public/assets/htmx.min.js`;
if (!existsSync(htmxDst)) {
  mkdirSync(`${import.meta.dir}/../public/assets`, { recursive: true });
  try {
    cpSync(htmxSrc, htmxDst);
    console.log("dev: copied htmx to public/assets/htmx.min.js");
  } catch (err) {
    console.error(`dev: htmx copy failed (${htmxSrc} -> ${htmxDst}):`, err);
    process.exit(1);
  }
}

const api = Bun.spawn(["bun", "--hot", "server.ts"], {
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
  env: { ...process.env, PORT: BACKEND_PORT },
});

const vite = Bun.spawn(
  ["bunx", "vite", "--host", "0.0.0.0", "--port", FRONTEND_PORT, "--strictPort"],
  {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
    env: { ...process.env, BUN_TARGET },
  },
);

console.log(`dev: api http://127.0.0.1:${BACKEND_PORT} + frontend http://localhost:${FRONTEND_PORT}`);

let stopping = false;
function shutdown(signal: string, code = 0) {
  if (stopping) return;
  stopping = true;
  console.log(`\ndev: ${signal}, stopping children…`);
  try {
    api.kill();
  } catch {}
  try {
    vite.kill();
  } catch {}
  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown("SIGINT", 0));
process.on("SIGTERM", () => shutdown("SIGTERM", 0));

// Race: whichever child exits first decides. Kill the survivor so a
// port-conflict cannot leave the other process alive forever.
const first: { name: string; code: number | null } = await Promise.race([
  api.exited.then((code) => ({ name: "api", code })),
  vite.exited.then((code) => ({ name: "vite", code })),
]);
if (!stopping) {
  stopping = true;
  const other = first.name === "api" ? vite : api;
  try {
    other.kill();
  } catch {}
  // Let the survivor terminate, but do not wait forever.
  await Promise.race([
    Promise.all([api.exited, vite.exited]),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
  const code = typeof first.code === "number" ? first.code : 1;
  console.log(
    `dev: ${first.name} exited (exit=${String(first.code)}), stopped sibling`,
  );
  process.exit(code);
}
