import english from "./locales/en/runtime.json";
import englishTour from "./locales/en/tour.json";
import german from "./locales/de/tour.json";
import type { Locale } from "./locale-paths.ts";

const catalogs: Record<Locale, Record<string, string>> = { de: german, en: { ...englishTour, ...english } };

export function message(source: string, values: Record<string, string | number> = {}, locale: Locale = typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "de"): string {
  const text = catalogs[locale][source] ?? source;
  return text.replace(/\{(\w+)\}/g, (placeholder, key: string) => Object.hasOwn(values, key) ? String(values[key]) : placeholder);
}
