// Air2Growth — Vite config (single frontend pipeline).
// Dev: `bun run dev` starts Vite here (0.0.0.0:3000, visible frontend) plus
// the Bun API backend on 127.0.0.1:3001 (see scripts/dev.ts). /api proxied.
// Prod: `bun run build` writes dist/ (all page HTML + hashed CSS/JS).
// Vercel serves it with clean URLs via vercel.json; `bun run start` serves
// dist/ + APIs via Bun on 0.0.0.0:3000 (see server.ts).
// Verified against installed vite@7 (Rollup-based): multi-page entries via
// `build.rollupOptions.input` (NOT rolldownOptions — that is Vite 8+).
import { defineConfig, type Connect, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { relative, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { renderShell, TEMPLATES_DIR } from "./src/render.ts";
import { canonicalRedirect, renderSitemap, SITE_PAGES } from "./src/seo.ts";
import { loadCatalog, LOCALES_DIR, translateHtml } from "./src/i18n-html.ts";

// Root proxy entries (./index.html etc.) -> canonical template shells.
// Plugin output lands as dist/<page>.html (full HTML, includes expanded).
const ROOT = import.meta.dirname;

function pageMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    const url = new URL(req.url ?? "/", "http://localhost");
    const canonical = canonicalRedirect(url.pathname);
    if (canonical) {
      res.writeHead(301, { location: canonical + url.search });
      res.end();
      return;
    }
    const entry = Object.entries(SITE_PAGES).find(([, page]) => page.path === url.pathname);
    if (entry && entry[0] !== "index.html") req.url = "/" + entry[0] + url.search;
    next();
  };
}

async function englishDiagram(name: string): Promise<string> {
  const svg = await readFile(resolve(ROOT, "public/img", `${name}.svg`), "utf8");
  return translateHtml(svg, await loadCatalog("en"));
}

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
        const file = relative(ROOT, ctx.filename).replaceAll("\\", "/");
        const page = SITE_PAGES[file];
        if (!page) return undefined;
        return forVite(await renderShell(page.shellFile, page.locale));
      },
    },
    configureServer(server) {
      // Match production canonical redirects, then resolve clean page URLs.
      server.middlewares.use(async (req, _res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const diagram = url.pathname.match(/^\/img\/(solution-system|system-loop)-en\.svg$/);
        if (diagram) {
          try {
            _res.setHeader("content-type", "image/svg+xml; charset=utf-8");
            _res.end(await englishDiagram(diagram[1]));
          } catch (error) { next(error); }
          return;
        }
        if (url.pathname === "/sitemap.xml") {
          _res.setHeader("content-type", "application/xml; charset=utf-8");
          _res.end(renderSitemap());
          return;
        }
        next();
      });
      server.middlewares.use(pageMiddleware());
      // Entries are proxies: partial edits are invisible to Vite's module
      // graph, so trigger a full reload instead of serving stale HTML.
      // Tailwind v4 (@tailwindcss/vite) rescans templates/ on its own
      // (automatic source detection); no @source entry needed.
      server.watcher.add([TEMPLATES_DIR, LOCALES_DIR]);
      server.watcher.on("change", (file: string) => {
        if (file.startsWith(TEMPLATES_DIR) || file.startsWith(LOCALES_DIR)) server.ws.send({ type: "full-reload" });
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(pageMiddleware());
    },
    async generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: renderSitemap() });
      for (const name of ["solution-system", "system-loop"]) {
        this.emitFile({ type: "asset", fileName: `img/${name}-en.svg`, source: await englishDiagram(name) });
      }
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
  appType: "mpa",
  plugins: [tailwindcss(), a2gIncludes()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: Object.keys(SITE_PAGES).map((file) => resolve(ROOT, file)),
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
