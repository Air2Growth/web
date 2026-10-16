// Air2Growth: Bun HTTP server (APIs always; pages + static only in prod).
// Dev (`bun run dev`, scripts/dev.ts): API-only on 127.0.0.1:3001 — the
// visible frontend is Vite on :3000 (single pipeline: templates/ ->
// transformIndexHtml -> Tailwind via @tailwindcss/vite). Page/static paths
// on this port answer 404 by design so no stale server-rendered markup can
// shadow Vite. Prod (`bun run start`, NODE_ENV=production): pre-rendered
// dist/*.html (built once via `bun run build`) + static from dist/ + APIs,
// on 0.0.0.0:3000. No template reads in prod.

import { canonicalRedirect, SITE_PAGES } from "./src/seo.ts";
import { message as translateMessage } from "./src/messages.ts";

const PROD = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT ?? process.env.BACKEND_PORT ?? (PROD ? 3000 : 3001));
const HOSTNAME = process.env.HOST ?? (PROD ? "0.0.0.0" : "127.0.0.1");
const DIST_DIR = `${import.meta.dir}/dist`;
const STATIC_DIR = DIST_DIR;

// Prod pages are read ONCE at startup (build once, not per request).
const prodPages = new Map<string, string>();
if (PROD) {
  for (const f of Object.keys(SITE_PAGES)) {
    const file = Bun.file(`${DIST_DIR}/${f}`);
    if (!(await file.exists())) {
      console.error(
        `prod: missing ${DIST_DIR}/${f} — run "bun run build" first, then "bun run start".`,
      );
      process.exit(1);
    }
    prodPages.set(f, await file.text());
  }
}

async function pageHtml(distFile: string): Promise<string> {
  return prodPages.get(distFile) as string;
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".m4v": "video/x-m4v",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function mimeFor(path: string): string {
  const dot = path.lastIndexOf(".");
  const ext = dot >= 0 ? path.slice(dot).toLowerCase() : "";
  return MIME[ext] ?? "application/octet-stream";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fragment(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function methodNotAllowed(req: Request): Response {
  const locale = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "de";
  return fragment(`<span class="error">${escapeHtml(translateMessage("Methode nicht erlaubt.", {}, locale))}</span>`, 405);
}

// --- Pages: prod serves dist/*.html (read once at startup) ---
// (templates/ is never served; dev pages come from Vite, see vite.config.ts).

function pageResponse(html: string, req: Request): Response {
  const headers = {
    "content-type": "text/html; charset=utf-8",
    "content-length": String(new TextEncoder().encode(html).length),
    "cache-control": "no-cache",
  };
  if (req.method === "HEAD") return new Response(null, { headers });
  return new Response(html, { headers });
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function handleKontakt(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return methodNotAllowed(req);
  }
  const form = new URLSearchParams(await req.text());
  const t = (source: string, values: Record<string, string | number> = {}) => escapeHtml(translateMessage(source, values, form.get("lang") === "en" ? "en" : "de"));
  const botcheck = (form.get("botcheck") ?? "").trim();
  if (botcheck) {
    return fragment(`<span class="error">${t("Spam-Schutz ausgelöst. Bitte erneut versuchen.")}</span>`, 400);
  }
  const name = (form.get("name") ?? "").trim();
  const email = (form.get("email") ?? "").trim();
  const message = (form.get("message") ?? "").trim();
  const consent = form.get("datenschutz_zustimmung");
  if (!name || !email || !message) {
    return fragment(`<span class="error">${t("Bitte Name, E-Mail und Nachricht ausfüllen.")}</span>`, 400);
  }
  if (name.length > 80) {
    return fragment(`<span class="error">${t("Name ist zu lang (max. 80 Zeichen).")}</span>`, 422);
  }
  if (!isValidEmail(email)) {
    return fragment(`<span class="error">${t("Bitte eine gültige E-Mail-Adresse eingeben.")}</span>`, 422);
  }
  if (message.length < 10) {
    return fragment(`<span class="error">${t("Nachricht ist zu kurz (min. 10 Zeichen).")}</span>`, 422);
  }
  if (message.length > 2000) {
    return fragment(`<span class="error">${t("Nachricht ist zu lang (max. 2000 Zeichen).")}</span>`, 422);
  }
  if (!consent) {
    return fragment(`<span class="error">${t("Bitte der Datenverarbeitung zustimmen.")}</span>`, 400);
  }
  return fragment(
    `<span class="ok">${t("Demo-Hinweis: Ihre Nachricht an {email} wurde nicht gesendet — kein Versand konfiguriert. Ihre Eingabe ({count} Zeichen) wurde nur lokal geprüft.", { email, count: message.length })}</span>`,
  );
}

async function handleNewsletter(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return methodNotAllowed(req);
  }
  const form = new URLSearchParams(await req.text());
  const t = (source: string, values: Record<string, string | number> = {}) => escapeHtml(translateMessage(source, values, form.get("lang") === "en" ? "en" : "de"));
  const botcheck = (form.get("botcheck") ?? "").trim();
  if (botcheck) {
    return fragment(`<span class="error">${t("Spam-Schutz ausgelöst. Bitte erneut versuchen.")}</span>`, 400);
  }
  const email = (form.get("email") ?? "").trim();
  const consent = form.get("info_einwilligung");
  if (!email) {
    return fragment(`<span class="error">${t("Bitte E-Mail-Adresse eingeben.")}</span>`, 400);
  }
  if (!isValidEmail(email)) {
    return fragment(`<span class="error">${t("Bitte eine gültige E-Mail-Adresse eingeben.")}</span>`, 422);
  }
  if (!consent) {
    return fragment(`<span class="error">${t("Bitte der Datenverarbeitung zustimmen.")}</span>`, 400);
  }
  return fragment(
    `<span class="ok">${t("Demo-Hinweis: {email} wurde nicht angemeldet — kein Versand konfiguriert. Ihre Adresse wurde nur lokal geprüft.", { email })}</span>`,
  );
}

async function serveStatic(pathname: string, req: Request): Promise<Response | null> {
  if (req.method !== "GET" && req.method !== "HEAD") return null;
  let rel = decodeURIComponent(pathname);
  if (rel === "/") rel = "/index.html";
  if (rel.includes("\0")) return fragment("Bad request", 400);
  // Normalize, block traversal: must stay inside STATIC_DIR.
  const target = Bun.file(STATIC_DIR + rel);
  void target;
  const normalized = new URL("file://" + STATIC_DIR + rel).pathname;
  const base = new URL("file://" + STATIC_DIR + "/").pathname;
  if (!normalized.startsWith(base)) return fragment("Not found", 404);
  const file = Bun.file(STATIC_DIR + rel);
  if (!(await file.exists())) return null;
  // Explicit accept-ranges helps browsers use progressive/range requests for
  // large hero videos. Bun.file streams via sendfile (no full read into
  // memory) and answers Range requests with 206 automatically (verified).
  // HEAD reuses the file response so content-length stays correct.
  const headers: Record<string, string> = {
    "content-type": mimeFor(rel),
    "accept-ranges": "bytes",
    "cache-control": /^\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(css|js)$/.test(rel)
      ? "public, max-age=31536000, immutable"
      : "public, max-age=3600",
  };
  return new Response(file, { headers });
}

const server = Bun.serve({
  hostname: HOSTNAME,
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/kontakt") return handleKontakt(req);
    if (url.pathname === "/api/newsletter") return handleNewsletter(req);

    // Dev is API-only: pages + static come from Vite (:3000). A 404 here
    // (instead of a server-rendered page) keeps exactly one markup source
    // and avoids stale-style confusion from two competing pipelines.
    if (!PROD) {
      return new Response("dev: use the Vite frontend on :3000 (this port serves /api/* only)", {
        status: 404,
      });
    }

    if (req.method === "GET" || req.method === "HEAD") {
      const canonical = canonicalRedirect(url.pathname);
      if (canonical) {
        return new Response(null, { status: 301, headers: { location: canonical + url.search } });
      }
      const entry = Object.entries(SITE_PAGES).find(([, page]) => page.path === url.pathname);
      if (entry) return pageResponse(await pageHtml(entry[0]), req);
    }

    const staticRes = await serveStatic(url.pathname, req);
    if (staticRes) return staticRes;
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
