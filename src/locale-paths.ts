export const LOCALES = ["de", "en"] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = "de";

// German URLs stay compatible with existing links. Each locale is built as HTML.
export const PAGE_PATHS: Record<string, Record<Locale, string>> = {
  "index.html": { de: "/", en: "/en" },
  "loesung.html": { de: "/loesung", en: "/en/solution" },
  "function.html": { de: "/function", en: "/en/how-it-works" },
  "meilensteine.html": { de: "/meilensteine", en: "/en/milestones" },
  "vision.html": { de: "/vision", en: "/en/vision" },
  "ueber-uns.html": { de: "/ueber-uns", en: "/en/about" },
  "impressum.html": { de: "/impressum", en: "/en/legal-notice" },
  "datenschutz.html": { de: "/datenschutz", en: "/en/privacy" },
};

export function isLocale(value: unknown): value is Locale {
  return value === "de" || value === "en";
}

export function localeFile(shellFile: string, locale: Locale): string {
  return locale === "de" ? shellFile : PAGE_PATHS[shellFile].en.slice(1) + ".html";
}

export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const url = new URL(href, "https://air2growth.com");
  const paths = Object.values(PAGE_PATHS).find((entry) => Object.values(entry).includes(url.pathname));
  return paths ? paths[locale] + url.search + url.hash : href;
}
