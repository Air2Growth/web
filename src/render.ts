// Air2Growth — shared template renderer (no server side-effects).
// Used by Bun server.ts (dev: render per request, prod: not needed —
// dist/*.html is pre-rendered) and by vite.config.ts (plugin expands the
// same includes at build/dev time). Node:fs based so it runs under Bun,
// Node and inside the Vite config.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderSeoTags } from "./seo.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const TEMPLATES_DIR = path.join(HERE, "..", "templates");
export const PARTIALS_DIR = path.join(TEMPLATES_DIR, "partials");

// Small shell (templates/index.html, templates/impressum.html,
// templates/datenschutz.html) with explicit named markers:
//   <!-- @include <name> -->
// Only known local files from the fixed manifest below are resolved.
export const MANIFEST: Record<string, string> = {
  head: "partials/head.html",
  "head-impressum": "partials/head-impressum.html",
  "head-datenschutz": "partials/head-datenschutz.html",
  "head-assets": "partials/head-assets.html",
  "head-function": "partials/head-function.html",
  "head-solution": "partials/head-solution.html",
  "head-milestones": "partials/head-milestones.html",
  "milestones-page": "partials/milestones-page.html",
  "head-vision": "partials/head-vision.html",
  "vision-page": "partials/vision-page.html",
  "head-about": "partials/head-about.html",
  "about-page": "partials/about-page.html",
  "solution-overview": "partials/solution-overview.html",
  "solution-contact": "partials/solution-contact.html",
  "function-tour": "partials/function-tour.html",
  "function-illustration": "partials/function-illustration.html",
  nav: "partials/nav.html",
  hero: "partials/hero.html",
  intro: "partials/intro.html",
  supporters: "partials/supporters.html",
  problem: "partials/problem.html",
  solution: "partials/solution.html",
  benefits: "partials/benefits.html",
  process: "partials/process.html",
  faq: "partials/faq.html",
  milestones: "partials/milestones.html",
  vision: "partials/vision.html",
  team: "partials/team.html",
  contact: "partials/contact.html",
  footer: "partials/footer.html",
  "legal-header": "partials/legal-header.html",
  "impressum-content": "partials/impressum-content.html",
  "privacy-content": "partials/privacy-content.html",
};

const INCLUDE_RE = /<!--\s*@include\s+([a-z-]+)\s*-->/g;

export async function renderShell(shellFile: string): Promise<string> {
  let html = await readFile(path.join(TEMPLATES_DIR, shellFile), "utf8");
  // Resolve recursively (footer/shells may nest markers); cap depth.
  for (let depth = 0; depth < 5; depth++) {
    INCLUDE_RE.lastIndex = 0;
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
      const partial = await readFile(
        path.join(PARTIALS_DIR, rel.split("/").pop() as string),
        "utf8",
      );
      out += html.slice(last, m.index) + partial;
      last = (m.index ?? 0) + m[0].length;
    }
    out += html.slice(last);
    html = out;
  }
  INCLUDE_RE.lastIndex = 0;
  if (INCLUDE_RE.test(html)) throw new Error("unresolved includes remain");
  const seoParts = html.split("<!-- @seo -->");
  if (seoParts.length !== 2) throw new Error(`expected one SEO marker in ${shellFile}`);
  return seoParts[0] + renderSeoTags(shellFile) + seoParts[1];
}
