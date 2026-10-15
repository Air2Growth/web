// Vite frontend entry (single styling pipeline): Tailwind library from
// node_modules plus behavior JS. Bundled into hashed dist/assets/* files.
// Referenced canonically from templates/partials/head*.html; no generated
// CSS file, no CLI watcher. Tailwind v4 scans templates/ automatically
// (no @source entry needed) — editing templates/partials/*.html applies
// instantly in `bun run dev` via Vite HMR/full-reload.
import "tailwindcss/index.css";
import "./site.js";
