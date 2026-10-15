// Air2Growth local mirror (Bun + htmx, no framework, no build step).
// Serves ./public (index.html + img/fonts) and local htmx from node_modules.
// Forms POST to local /api/* endpoints (demo: validated, never sent).

const PORT = Number(process.env.PORT) || 3000;
const HOSTNAME = "0.0.0.0";
const PUBLIC_DIR = `${import.meta.dir}/public`;
const TEMPLATES_DIR = `${import.meta.dir}/templates`;
const PARTIALS_DIR = `${TEMPLATES_DIR}/partials`;
const HTMX_FILE = `${import.meta.dir}/node_modules/htmx.org/dist/htmx.min.js`;

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

// --- Server-side HTML assembly (no templating dependency) ----------------
// Small shell (templates/index.html, templates/impressum.html,
// templates/datenschutz.html) with explicit named markers:
//   <!-- @include <name> -->
// Only known local files from the fixed manifest below are resolved.
// Templates live outside public/; files are reread per request so edits
// show without a server restart (bun --hot also reloads server.ts).
const MANIFEST: Record<string, string> = {
  head: "partials/head.html",
  "head-impressum": "partials/head-impressum.html",
  "head-datenschutz": "partials/head-datenschutz.html",
  nav: "partials/nav.html",
  "nav-legal": "partials/nav-legal.html",
  hero: "partials/hero.html",
  intro: "partials/intro.html",
  problem: "partials/problem.html",
  solution: "partials/solution.html",
  benefits: "partials/benefits.html",
  process: "partials/process.html",
  economics: "partials/economics.html",
  milestones: "partials/milestones.html",
  vision: "partials/vision.html",
  team: "partials/team.html",
  contact: "partials/contact.html",
  footer: "partials/footer.html",
  "impressum-content": "partials/impressum-content.html",
  "privacy-content": "partials/privacy-content.html",
};

const INCLUDE_RE = /<!--\s*@include\s+([a-z-]+)\s*-->/g;

async function renderShell(shellFile: string): Promise<string> {
  let html = await Bun.file(`${TEMPLATES_DIR}/${shellFile}`).text();
  // Resolve recursively (footer/shells may nest markers); cap depth.
  for (let depth = 0; depth < 5; depth++) {
    if (!INCLUDE_RE.test(html)) break;
    INCLUDE_RE.lastIndex = 0;
    const matches = [...html.matchAll(INCLUDE_RE)];
    if (matches.length === 0) break;
    let out = "";
    let last = 0;
    for (const m of matches) {
      const name = m[1];
      const rel = MANIFEST[name];
      if (!rel) throw new Error(`unknown include: ${name}`);
      // Fixed manifest only: no path separators from marker input.
      const partial = await Bun.file(`${PARTIALS_DIR}/${rel.split("/").pop()}`).text();
      out += html.slice(last, m.index) + partial;
      last = (m.index ?? 0) + m[0].length;
    }
    out += html.slice(last);
    html = out;
  }
  if (INCLUDE_RE.test(html)) throw new Error("unresolved includes remain");
  return html;
}

function pageResponse(html: string, req: Request): Response {
  const headers = {
    "content-type": "text/html; charset=utf-8",
    "content-length": String(new TextEncoder().encode(html).length),
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
    return fragment(`<span class="error">Methode nicht erlaubt.</span>`, 405);
  }
  const form = new URLSearchParams(await req.text());
  const botcheck = (form.get("botcheck") ?? "").trim();
  if (botcheck) {
    return fragment(`<span class="error">Spam-Schutz ausgelöst. Bitte erneut versuchen.</span>`, 400);
  }
  const name = (form.get("name") ?? "").trim();
  const email = (form.get("email") ?? "").trim();
  const message = (form.get("message") ?? "").trim();
  const consent = form.get("datenschutz_zustimmung");
  if (!name || !email || !message) {
    return fragment(`<span class="error">Bitte Name, E-Mail und Nachricht ausfüllen.</span>`, 400);
  }
  if (name.length > 80) {
    return fragment(`<span class="error">Name ist zu lang (max. 80 Zeichen).</span>`, 422);
  }
  if (!isValidEmail(email)) {
    return fragment(`<span class="error">Bitte eine gültige E-Mail-Adresse eingeben.</span>`, 422);
  }
  if (message.length < 10) {
    return fragment(`<span class="error">Nachricht ist zu kurz (min. 10 Zeichen).</span>`, 422);
  }
  if (message.length > 2000) {
    return fragment(`<span class="error">Nachricht ist zu lang (max. 2000 Zeichen).</span>`, 422);
  }
  if (!consent) {
    return fragment(`<span class="error">Bitte der Datenverarbeitung zustimmen.</span>`, 400);
  }
  return fragment(
    `<span class="ok">Demo-Hinweis: Ihre Nachricht an ${escapeHtml(email)} wurde nicht gesendet — kein Versand konfiguriert. Ihre Eingabe (${escapeHtml(String(message.length))} Zeichen) wurde nur lokal geprüft.</span>`,
  );
}

async function handleNewsletter(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return fragment(`<span class="error">Methode nicht erlaubt.</span>`, 405);
  }
  const form = new URLSearchParams(await req.text());
  const botcheck = (form.get("botcheck") ?? "").trim();
  if (botcheck) {
    return fragment(`<span class="error">Spam-Schutz ausgelöst. Bitte erneut versuchen.</span>`, 400);
  }
  const email = (form.get("email") ?? "").trim();
  const consent = form.get("info_einwilligung");
  if (!email) {
    return fragment(`<span class="error">Bitte E-Mail-Adresse eingeben.</span>`, 400);
  }
  if (!isValidEmail(email)) {
    return fragment(`<span class="error">Bitte eine gültige E-Mail-Adresse eingeben.</span>`, 422);
  }
  if (!consent) {
    return fragment(`<span class="error">Bitte der Datenverarbeitung zustimmen.</span>`, 400);
  }
  return fragment(
    `<span class="ok">Demo-Hinweis: ${escapeHtml(email)} wurde nicht angemeldet — kein Versand konfiguriert. Ihre Adresse wurde nur lokal geprüft.</span>`,
  );
}

async function serveStatic(pathname: string, req: Request): Promise<Response | null> {
  if (req.method !== "GET" && req.method !== "HEAD") return null;
  let rel = decodeURIComponent(pathname);
  if (rel === "/") rel = "/index.html";
  if (rel.includes("\0")) return fragment("Bad request", 400);
  // Normalize, block traversal: must stay inside PUBLIC_DIR.
  const target = Bun.file(PUBLIC_DIR + rel);
  void target;
  const normalized = new URL("file://" + PUBLIC_DIR + rel).pathname;
  const base = new URL("file://" + PUBLIC_DIR + "/").pathname;
  if (!normalized.startsWith(base)) return fragment("Not found", 404);
  const file = Bun.file(PUBLIC_DIR + rel);
  if (!(await file.exists())) return null;
  // Explicit accept-ranges helps browsers use progressive/range requests for
  // large hero videos. Bun.file streams via sendfile (no full read into
  // memory) and answers Range requests with 206 automatically (verified).
  // HEAD reuses the file response so content-length stays correct.
  const headers: Record<string, string> = {
    "content-type": mimeFor(rel),
    "accept-ranges": "bytes",
  };
  return new Response(file, { headers });
}

const server = Bun.serve({
  hostname: HOSTNAME,
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/assets/htmx.min.js" && (req.method === "GET" || req.method === "HEAD")) {
      const f = Bun.file(HTMX_FILE);
      if (!(await f.exists())) return new Response("Not found", { status: 404 });
      return new Response(f, { headers: { "content-type": "text/javascript; charset=utf-8" } });
    }
    if (url.pathname === "/api/kontakt") return handleKontakt(req);
    if (url.pathname === "/api/newsletter") return handleNewsletter(req);

    if ((url.pathname === "/" || url.pathname === "/index.html") && (req.method === "GET" || req.method === "HEAD")) {
      try {
        return pageResponse(await renderShell("index.html"), req);
      } catch (err) {
        console.error("render index failed:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    if ((url.pathname === "/impressum" || url.pathname === "/impressum.html") && (req.method === "GET" || req.method === "HEAD")) {
      try {
        return pageResponse(await renderShell("impressum.html"), req);
      } catch (err) {
        console.error("render impressum failed:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
    if ((url.pathname === "/datenschutz" || url.pathname === "/datenschutz.html") && (req.method === "GET" || req.method === "HEAD")) {
      try {
        return pageResponse(await renderShell("datenschutz.html"), req);
      } catch (err) {
        console.error("render datenschutz failed:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    const staticRes = await serveStatic(url.pathname, req);
    if (staticRes) return staticRes;
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
