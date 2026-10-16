import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { readFile } from "node:fs/promises";
import { renderShell, renderTemplate } from "../src/render.ts";
import { loadCatalog, translateHtml, translationKey } from "../src/i18n-html.ts";
import { detectLocale, initLanguageLinks } from "../src/locale-browser.js";
import { localizedHref, PAGE_PATHS } from "../src/locale-paths.ts";
import { SEO_PAGES, SITE_PAGES, SITE_URL } from "../src/seo.ts";
import { message } from "../src/messages.ts";

function detect({ path = "/loesung", locale = "de", languages = ["en-US"], saved = null, blocked = false }: { path?: string; locale?: string; languages?: string[]; saved?: string | null; blocked?: boolean } = {}) {
  let url = new URL(path, SITE_URL);
  let redirected: string | null = null;
  const window = {
    location: { get href() { return url.href; }, replace(value: string) { redirected = value; } },
    localStorage: { getItem() { if (blocked) throw new Error("blocked"); return saved; }, setItem(_key: string, value: string) { if (blocked) throw new Error("blocked"); saved = value; } },
    history: { state: null, replaceState(_state: unknown, _unused: string, value: string) { url = new URL(value, SITE_URL); } },
  };
  runInNewContext(`(${detectLocale.toString()})(${JSON.stringify({ locale, paths: PAGE_PATHS["loesung.html"] })})`, { window, navigator: { languages }, URL });
  return { redirected, saved, path: url.pathname + url.search + url.hash };
}

describe("browser language selection", () => {
  test("matches regional languages in preference order and preserves query and hash", () => {
    expect(detect({ path: "/loesung?ref=a%20b#fragen", languages: ["fr-FR", "en-GB", "de-DE"] }).redirected).toBe("/en/solution?ref=a%20b#fragen");
    expect(detect({ languages: ["de-CH", "en-US"] }).redirected).toBeNull();
    expect(detect({ languages: ["fr-FR"] }).redirected).toBeNull();
    expect(detect({ languages: [] }).redirected).toBeNull();
  });
  test("remembers an explicit choice over the browser preference", () => {
    expect(detect({ saved: "de" }).redirected).toBeNull();
    expect(detect({ saved: "en", languages: ["de-DE"] }).redirected).toBe("/en/solution");
    expect(detect({ path: "/loesung?lang=de&ref=test#fragen" })).toEqual({ redirected: null, saved: "de", path: "/loesung?ref=test#fragen" });
    expect(detect({ path: "/en/solution?lang=de#fragen", locale: "en" }).redirected).toBe("/loesung?lang=de#fragen");
  });
  test("honours direct English URLs and explicit choices with storage blocked", () => {
    expect(detect({ path: "/en/solution", locale: "en", saved: "de", languages: ["de-DE"] }).redirected).toBeNull();
    expect(detect({ path: "/loesung?lang=de#fragen", blocked: true })).toEqual({ redirected: null, saved: null, path: "/loesung?lang=de#fragen" });
    expect(detect({ blocked: true }).redirected).toBe("/en/solution");
    expect(detect({ path: "/loesung?lang=fr", saved: "invalid" }).redirected).toBe("/en/solution?lang=fr");
  });

  test("language links follow later section changes and retain a blocked-storage choice", () => {
    const location = { href: SITE_URL + "/en/solution?ref=test&lang=en#funktionsweise" };
    const callbacks: Record<string, () => void> = {};
    function link(href: string, locale?: string) {
      return { href: new URL(href, location.href).href, dataset: { localeLink: locale }, hasAttribute: () => Boolean(locale) };
    }
    const switches = [link("/loesung?lang=de", "de"), link("/en/solution?lang=en", "en")];
    const navigation = [link("/en/about"), link("#fragen"), link("https://other.test/")];
    const document = {
      querySelectorAll: (selector: string) => selector.includes("data-locale-link") ? switches : [...switches, ...navigation],
      addEventListener() {},
    };
    const window = { location, addEventListener: (event: string, callback: () => void) => { callbacks[event] = callback; } };
    runInNewContext(`(${initLanguageLinks.toString()})()`, { window, document, URL, AbortController });
    expect(new URL(switches[0].href, SITE_URL).searchParams.get("lang")).toBe("de");
    expect(new URL(navigation[0].href, SITE_URL).searchParams.get("lang")).toBe("en");
    expect(navigation[2].href).toBe("https://other.test/");
    location.href = SITE_URL + "/en/solution?ref=test&lang=en#fragen";
    callbacks.hashchange();
    expect(switches[0].href).toBe("/loesung?ref=test&lang=de#fragen");
  });
});

describe("complete static translations", () => {
  test("active template copy has catalog coverage, with scripts and hooks untouched", async () => {
    const english = await loadCatalog("en");
    const german = await loadCatalog("de");
    const missing: string[] = [];
    for (const file of Object.keys(SEO_PAGES)) {
      const keys = new Set<string>();
      translateHtml(await renderTemplate(file), {}, keys);
      for (const key of keys) if (!Object.hasOwn(english, key) && !Object.hasOwn(german, key)) missing.push(`${file}: ${key}`);
    }
    expect(missing).toEqual([]);
    const source = '<p class="keep" data-scene="keep">Hallo &amp; Welt</p><script>const label = "Hallo &amp; Welt";</script><img alt="Hallo &amp; Welt" src="/img/keep.svg">';
    expect(translateHtml(source, { "Hallo & Welt": 'Hello & "world"' })).toBe('<p class="keep" data-scene="keep">Hello &amp; &quot;world&quot;</p><script>const label = "Hallo &amp; Welt";</script><img alt="Hello &amp; &quot;world&quot;" src="/img/keep.svg">');
    expect(translationKey(" A&nbsp;B &#8212; C ")).toBe("A B — C");
    expect(translateHtml('<a>Datenschutz</a> zu.', { Datenschutz: "Privacy policy", "zu.": "." })).toBe('<a>Privacy policy</a>.');
  });

  test("every built locale page has reciprocal language links and valid internal destinations", async () => {
    const pages = new Map<string, { ids: Set<string>; links: { href: string; switcher: boolean }[] }>();
    for (const [file, page] of Object.entries(SITE_PAGES)) {
      const html = await readFile(new URL(`../dist/${file}`, import.meta.url), "utf8");
      const ids = new Set<string>();
      const links: { href: string; switcher: boolean }[] = [];
      const alternates: Record<string, string> = {};
      let formCount = 0, localeFields = 0;
      await new HTMLRewriter()
        .on("[id]", { element(el) { ids.add(el.getAttribute("id")!); } })
        .on("a[href]", { element(el) { links.push({ href: el.getAttribute("href")!, switcher: el.hasAttribute("data-locale-link") }); } })
        .on('link[rel="alternate"]', { element(el) { alternates[el.getAttribute("hreflang")!] = el.getAttribute("href")!; } })
        .on("form", { element() { formCount++; } })
        .on('input[name="lang"]', { element(el) { localeFields++; expect(el.getAttribute("value")).toBe(page.locale); } })
        .transform(new Response(html)).text();
      expect(alternates).toEqual({ de: SITE_URL + PAGE_PATHS[page.shellFile].de, en: SITE_URL + PAGE_PATHS[page.shellFile].en, "x-default": SITE_URL + PAGE_PATHS[page.shellFile].de });
      expect(localeFields).toBe(formCount);
      for (const link of links) {
        const url = new URL(link.href, SITE_URL + page.path);
        if (url.origin === SITE_URL && !link.switcher && !/\.[a-z]+$/i.test(url.pathname)) {
          const target = Object.values(SITE_PAGES).find((target) => target.path === url.pathname);
          expect(target, `missing target ${link.href} on ${page.path}`).toBeDefined();
          expect(target?.locale, `wrong language for ${link.href} on ${page.path}`).toBe(page.locale);
        }
      }
      pages.set(page.path, { ids, links });
    }
    for (const [path, page] of pages) for (const link of page.links) {
      const url = new URL(link.href, SITE_URL + path);
      if (url.origin === SITE_URL && url.hash) expect(pages.get(url.pathname)?.ids.has(decodeURIComponent(url.hash.slice(1))), `${path}: ${link.href}`).toBe(true);
    }
  });

  test("both tours and diagram labels are translated before scripts run", async () => {
    const german = await renderShell("function.html", "de");
    const english = await renderShell("function.html", "en");
    expect(german).toContain("Animation starten");
    expect(german).toContain("Maschinenüberwachung");
    expect(german).not.toContain(">Animation Begin<");
    expect(english).toContain("Start the tour");
    const svg = await readFile(new URL("../dist/img/solution-system-en.svg", import.meta.url), "utf8");
    expect(svg).toContain("Microalgae");
    expect(svg).not.toContain("Umgebungsluft");
    expect(localizedHref("/#kontakt", "en")).toBe("/en#kontakt");
    expect(localizedHref("/loesung?ref=x#fragen", "en")).toBe("/en/solution?ref=x#fragen");
    expect(localizedHref("https://other.test/loesung", "en")).toBe("https://other.test/loesung");
    expect(message("{elapsed} of {duration} seconds. {scene}", { elapsed: 3, duration: 60, scene: "Test" }, "de")).toBe("3 von 60 Sekunden. Test");
  });
});
