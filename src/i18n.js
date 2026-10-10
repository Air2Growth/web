import english from "./translations/en.js";
import {
  isSupportedLanguage,
  languageStorageKey,
  resolveLanguage,
} from "./language.js";

let language = "de";
const normalize = (text) => text.replace(/\s+/g, " ").trim();

export function translate(text) {
  return language === "en" ? english[normalize(text)] ?? text : text;
}

function translateDocument() {
  if (language !== "en") return;
  const walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script, style, noscript, [translate="no"]')) {
      continue;
    }
    const original = node.textContent;
    const translated = english[normalize(original)];
    if (translated !== undefined) {
      const [, leading, , trailing] = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      node.textContent = `${leading}${translated}${trailing}`;
    }
  }
  const labeled = document.querySelectorAll(
    "[alt], [aria-label], [placeholder], [title], meta[name='description']",
  );
  for (const element of labeled) {
    if (element.closest('[translate="no"]')) continue;
    for (const attribute of ["alt", "aria-label", "placeholder", "title", "content"]) {
      if (element.hasAttribute(attribute)) {
        element.setAttribute(attribute, translate(element.getAttribute(attribute)));
      }
    }
  }
}

function rememberLanguage(value) {
  try {
    localStorage.setItem(languageStorageKey, value);
  } catch {
    // The language query parameter also carries choices when storage is blocked.
  }
}

export function initLanguage() {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get("lang");
  let saved;
  try {
    saved = localStorage.getItem(languageStorageKey);
  } catch {}
  language = resolveLanguage({
    requested,
    saved,
    languages: navigator.languages?.length
      ? navigator.languages
      : [navigator.language],
  });
  if (isSupportedLanguage(requested)) rememberLanguage(requested);
  document.documentElement.lang = language;
  translateDocument();

  // Carry manual choices when storage is disabled. Automatic visits keep following
  // browser preferences rather than silently saving a choice after navigation.
  const hasLanguageChoice = isSupportedLanguage(requested) || isSupportedLanguage(saved);
  const pages = new Set([
    "/",
    "/index.html",
    "/produkt.html",
    "/technologie.html",
    "/vorteile.html",
    "/team.html",
    "/investoren.html",
    "/kontakt.html",
  ]);
  for (const link of document.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) continue;
    const target = new URL(href, url);
    if (hasLanguageChoice && target.origin === url.origin && pages.has(target.pathname)) {
      target.searchParams.set("lang", language);
      link.setAttribute("href", `${target.pathname}${target.search}${target.hash}`);
    }
  }

  for (const link of document.querySelectorAll("[data-language]")) {
    const choice = link.dataset.language;
    const target = new URL(url);
    target.searchParams.set("lang", choice);
    link.setAttribute("href", `${target.pathname}${target.search}${target.hash}`);
    if (choice === language) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
    link.addEventListener("click", () => rememberLanguage(choice));
  }
}
