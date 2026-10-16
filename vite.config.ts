// Air2Growth — Vite config (single frontend pipeline).
// Dev: `bun run dev` starts Vite here (0.0.0.0:3000, visible frontend) plus
// the Bun API backend on 127.0.0.1:3001 (see scripts/dev.ts). /api proxied.
// Prod: `bun run build` writes dist/ (5 HTML + hashed CSS/JS); `bun run start`
// serves dist/ + APIs via Bun on 0.0.0.0:3000 (see server.ts).
// Verified against installed vite@7 (Rollup-based): multi-page entries via
// `build.rollupOptions.input` (NOT rolldownOptions — that is Vite 8+).
import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { basename, resolve } from "node:path";
import { renderShell, TEMPLATES_DIR } from "./src/render.ts";
import { canonicalRedirect, SEO_PAGES } from "./src/seo.ts";

// Root proxy entries (./index.html etc.) -> canonical template shells.
// Plugin output lands as dist/index.html, dist/impressum.html,
// dist/datenschutz.html (full HTML, includes expanded).
const SHELLS: Record<string, string> = {
  "index.html": "index.html",
  "impressum.html": "impressum.html",
  "datenschutz.html": "datenschutz.html",
  "function.html": "function.html",
  "loesung.html": "loesung.html",
};

// Canonical template heads already reference the Vite module entry
// (`<script type="module" src="/src/main.ts">`, Tailwind + site.js bundled,
// hashed CSS/JS in dist). This rewrite only fixes asset paths that are
// invisible to Vite outside root or break on sub-routes, so dev and build
// serve byte-identical markup by construction (single source: templates/).
function forVite(html: string): string {
  return (
    html
      // Relative refs break on nested routes (/impressum.html) and are
      // invisible to Vite outside root: make them root-absolute public refs.
      .replaceAll('href="img/', 'href="/img/')
      .replaceAll('src="img/', 'src="/img/')
      .replaceAll('href="favicon.ico"', 'href="/favicon.ico"')
      .replaceAll('href="fonts/', 'href="/fonts/')
      // data-playlist is a custom attribute (Vite leaves it alone): make
      // every clip root-absolute by hand.
      .replace(/data-playlist="([^"]*)"/, (_m, v: string) =>
        `data-playlist="${v
          .split(/\s+/)
          .filter(Boolean)
          .map((s) => (s.startsWith("/") ? s : `/${s}`))
          .join(" ")}"`,
      )
  );
}

function a2gIncludes(): Plugin {
  return {
    name: "a2g-includes",
    transformIndexHtml: {
      order: "pre",
      async handler(_html, ctx) {
        const shell = SHELLS[basename(ctx.filename)];
        if (!shell) return undefined;
        return forVite(await renderShell(shell));
      },
    },
    configureServer(server) {
      // Match production canonical redirects, then resolve clean legal URLs.
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (req.method === "GET" || req.method === "HEAD") {
          const canonical = canonicalRedirect(url.pathname);
          if (canonical) {
            _res.writeHead(301, { location: canonical + url.search });
            _res.end();
            return;
          }
        }
        const entry = Object.entries(SEO_PAGES).find(([, page]) => page.path === url.pathname);
        if (entry && entry[0] !== "index.html") req.url = "/" + entry[0] + url.search;
        next();
      });
      // Entries are proxies: partial edits are invisible to Vite's module
      // graph, so trigger a full reload instead of serving stale HTML.
      // Tailwind v4 (@tailwindcss/vite) rescans templates/ on its own
      // (automatic source detection); no @source entry needed.
      server.watcher.add(TEMPLATES_DIR);
      server.watcher.on("change", (file: string) => {
        if (file.startsWith(TEMPLATES_DIR)) server.ws.send({ type: "full-reload" });
      });
    },
  };
}

// Bun API backend for the /api proxy. Dev default :3001 (scripts/dev.ts
// starts it there); override with BUN_TARGET for exotic setups. Preview
// default :3000 (alongside `bun run start`, which serves prod on :3000).
const DEV_API_TARGET =
  process.env.BUN_TARGET ?? `http://127.0.0.1:${process.env.BACKEND_PORT ?? "3001"}`;
const PREVIEW_API_TARGET = process.env.BUN_TARGET ?? "http://127.0.0.1:3000";

export default defineConfig({
  plugins: [tailwindcss(), a2gIncludes()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        impressum: resolve(import.meta.dirname, "impressum.html"),
        datenschutz: resolve(import.meta.dirname, "datenschutz.html"),
        function: resolve(import.meta.dirname, "function.html"),
        loesung: resolve(import.meta.dirname, "loesung.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.FRONTEND_PORT ?? "3000"),
    strictPort: true,
    proxy: {
      "/api": { target: DEV_API_TARGET, changeOrigin: true },
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
    proxy: {
      // Static dist + live APIs when the Bun production server runs
      // alongside (`bun run start`). Without Bun, /api/* has no backend.
      "/api": { target: PREVIEW_API_TARGET, changeOrigin: true },
    },
  },
});
