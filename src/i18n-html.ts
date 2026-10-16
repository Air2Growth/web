import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { localizedHref, PAGE_PATHS, type Locale } from "./locale-paths.ts";
import { detectLocale } from "./locale-browser.js";

export type Catalog = Record<string, string>;
const catalogRoot = new URL("./locales/", import.meta.url);
export const LOCALES_DIR = fileURLToPath(catalogRoot);
const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<[^>]*>|[^<]+/gi;
const ATTRIBUTE = /\b(alt|aria-label|placeholder|title)="([^"]*)"/g;
const entities: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", larr: "←", rarr: "→", copy: "©", shy: "\u00ad",
  Auml: "Ä", Ouml: "Ö", Uuml: "Ü", auml: "ä", ouml: "ö", uuml: "ü", szlig: "ß", bdquo: "„", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", ndash: "–", mdash: "—", sect: "§", hellip: "…",
};

export function decodeText(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name.startsWith("#")) return String.fromCodePoint(parseInt(name.slice(name[1].toLowerCase() === "x" ? 2 : 1), name[1].toLowerCase() === "x" ? 16 : 10));
    return entities[name] ?? entity;
  });
}

export function translationKey(value: string): string {
  return decodeText(value).replace(/\s+/g, " ").trim();
}

export function escapeText(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export async function loadCatalog(locale: Locale): Promise<Catalog> {
  const files = locale === "en" ? ["en/marketing.json", "en/legal-shared.json", "en/tour.json", "en/runtime.json"] : ["de/tour.json"];
  const catalogs = await Promise.all(files.map(async (file) => JSON.parse(await readFile(new URL(file, catalogRoot), "utf8")) as Catalog));
  return Object.assign({}, ...catalogs);
}

// Only translate visible text and accessible copy. Scripts, IDs, classes,
// links, form names and animation hooks stay intact.
export function translateHtml(html: string, catalog: Catalog, collect?: Set<string>): string {
  function translate(value: string): string {
    const key = translationKey(value);
    if (!key) return value;
    collect?.add(key);
    if (!Object.hasOwn(catalog, key)) return value;
    // Translated fragments can begin with punctuation where the source had a
    // trailing word (for example, a consent label ending after a policy link).
    const leading = /^[.,;:!?]/.test(catalog[key]) ? "" : value.match(/^\s*/)?.[0];
    return leading + escapeText(catalog[key]) + value.match(/\s*$/)?.[0];
  }
  return html.replace(TOKEN, (token) => {
    if (token.startsWith("<!--") || /^<(script|style)\b/i.test(token)) return token;
    return token.startsWith("<")
      ? token.replace(ATTRIBUTE, (_match, attribute: string, value: string) => `${attribute}="${translate(value)}"`)
      : translate(token);
  });
}

export function localizeHtml(html: string, locale: Locale): string {
  return html
    .replace(/(<html\b[^>]*\blang=")[^"]*"/, `$1${locale}"`)
    .replace(/\bhref="([^"]*)"/g, (_match, href: string) => `href="${localizedHref(href, locale)}"`)
    .replace(/<form\b[^>]*>/g, (tag) => tag + `<input type="hidden" name="lang" value="${locale}">`)
    .replace(/src="\/img\/(solution-system|system-loop)\.svg"/g, (_match, name: string) => `src="/img/${name}${locale === "en" ? "-en" : ""}.svg"`);
}

export function languageSwitcher(shellFile: string, locale: Locale): string {
  const links = (["de", "en"] as const).map((language) => {
    const label = language === "de" ? "Deutsch" : "English";
    return `<a href="${PAGE_PATHS[shellFile][language]}?lang=${language}" data-locale-link="${language}" hreflang="${language}" lang="${language}" aria-label="${label}"${locale === language ? ' aria-current="true"' : ""} class="inline-flex min-h-11 min-w-10 items-center justify-center rounded-lg px-2 text-xs font-bold text-pine hover:bg-mist aria-[current]:bg-pine aria-[current]:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf">${language.toUpperCase()}</a>`;
  }).join("");
  return `<div role="group" aria-label="${locale === "de" ? "Sprache" : "Language"}" class="flex shrink-0 items-center gap-0.5">${links}</div>`;
}

export function localeScript(shellFile: string, locale: Locale): string {
  const page = JSON.stringify({ locale, paths: PAGE_PATHS[shellFile] });
  return `<script data-locale-detection>(${detectLocale.toString()})(${page});</script>`;
}
