import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";
import { readFile } from "node:fs/promises";
import { renderShell, renderTemplate } from "../src/render.ts";
import { languageSwitcher, loadCatalog, translateHtml, translationKey } from "../src/i18n-html.ts";
import * as localeBrowser from "../src/locale-browser.js";
import { initLanguageLinks } from "../src/locale-browser.js";
import { localizedHref, PAGE_PATHS } from "../src/locale-paths.ts";
import { SEO_PAGES, SITE_PAGES, SITE_URL } from "../src/seo.ts";
import { message } from "../src/messages.ts";

function runLinks({ url = "/loesung", languages = ["en-US"], saved = null, blocked = false }: { url?: string; languages?: string[]; saved?: string | null; blocked?: boolean } = {}) {
  let href = new URL(url, SITE_URL).href;
  let cleaned: string | null = null;
  let storageReads = 0;
  let storageWrites = 0;
  const callbacks: Record<string, () => void> = {};
  function link(hrefValue: string, locale?: string) {
    let attribute = hrefValue;
    return {
      get href() { return new URL(attribute, href).href; },
      set href(value: string) { attribute = value; },
      dataset: { localeLink: locale },
      hasAttribute: () => Boolean(locale),
    };
  }
  const switches = [link("/loesung", "de"), link("/en/solution", "en")];
  const navigation = [link("/ueber-uns"), link("#fragen"), link("https://other.test/")];
  const all = [...switches, ...navigation];
  const document = {
    querySelectorAll: (selector: string) => (selector.includes("data-locale-link") ? switches : all),
    addEventListener() {},
  };
  const window = {
    location: {
      get href() { return href; },
      replace() { throw new Error("stable URLs never redirect"); },
    },
    history: {
      state: null,
      replaceState(_state: unknown, _unused: string, value: string) {
        cleaned = value;
        href = new URL(value, SITE_URL).href;
      },
    },
    localStorage: {
      getItem() { storageReads++; if (blocked) throw new Error("blocked"); return saved; },
      setItem() { storageWrites++; if (blocked) throw new Error("blocked"); },
    },
    addEventListener: (event: string, callback: () => void) => { callbacks[event] = callback; },
  };
  runInNewContext(`(${initLanguageLinks.toString()})()`, {
    window,
    document,
    navigator: { languages, language: languages[0] },
    URL,
    URLSearchParams,
    AbortController,
  });
  return {
    href, cleaned, switches, navigation, callbacks, storageReads, storageWrites,
    setLocation(value: string) { href = new URL(value, SITE_URL).href; },
  };
}

describe("stable canonical language paths", () => {
  test("serves clean language URLs without automatic switching or stored preferences", async () => {
    expect("detectLocale" in localeBrowser).toBe(false);
    expect(localeBrowser.initLanguageLinks.toString()).not.toContain("localStorage");
    expect(localeBrowser.initLanguageLinks.toString()).not.toContain("navigator");
    expect(localeBrowser.initLanguageLinks.toString()).not.toContain("location.replace");
    expect(languageSwitcher("loesung.html", "de")).toContain('href="/loesung"');
    expect(languageSwitcher("loesung.html", "en")).toContain('href="/en/solution"');
    expect(languageSwitcher("loesung.html", "de")).not.toContain("?lang=");
    expect(languageSwitcher("loesung.html", "de")).not.toContain("air2growth-language");
    for (const locale of ["de", "en"] as const) {
      const html = await renderShell("loesung.html", locale);
      expect(html).not.toContain("data-locale-detection");
      expect(html).not.toContain("air2growth-language");
      expect(html).not.toContain("navigator.languages");
    }
  });
  test("keeps each URL in its own language despite opposite browsers, saved choices and legacy lang params", () => {
    // German URL stays German even with an English browser and saved English choice.
    let result = runLinks({ url: "/loesung?ref=test#fragen", languages: ["en-US", "en"], saved: "en" });
    expect(new URL(result.href, SITE_URL).pathname).toBe("/loesung");
    expect(result.switches[1].href).toBe(SITE_URL + "/en/solution?ref=test#fragen");
    expect(result.storageReads).toBe(0);
    expect(result.storageWrites).toBe(0);

    // English URL stays English even with a German browser and saved German choice.
    result = runLinks({ url: "/en/solution?ref=test#fragen", languages: ["de-DE", "de"], saved: "de" });
    expect(new URL(result.href, SITE_URL).pathname).toBe("/en/solution");
    expect(result.switches[0].href).toBe(SITE_URL + "/loesung?ref=test#fragen");

    // Conflicting legacy ?lang params never change the served language; only cleaned.
    result = runLinks({ url: "/loesung?lang=en&ref=test#fragen", languages: ["en-US"], saved: "en" });
    expect(new URL(result.href, SITE_URL).pathname).toBe("/loesung");
    expect(new URL(result.href, SITE_URL).searchParams.get("lang")).toBeNull();
    expect(new URL(result.href, SITE_URL).searchParams.get("ref")).toBe("test");
    result = runLinks({ url: "/en/solution?lang=de#fragen", languages: ["de-DE"], saved: "de" });
    expect(new URL(result.href, SITE_URL).pathname).toBe("/en/solution");
    expect(new URL(result.href, SITE_URL).searchParams.get("lang")).toBeNull();

    // Invalid legacy values are dropped without affecting the path.
    result = runLinks({ url: "/loesung?lang=fr&ref=test", languages: ["en-US"], saved: "invalid" });
    expect(new URL(result.href, SITE_URL).pathname).toBe("/loesung");
    expect(new URL(result.href, SITE_URL).searchParams.get("lang")).toBeNull();
  });
  test("tolerates old saved preferences and blocked storage without redirects", () => {
    expect(() => runLinks({ url: "/loesung", saved: "en", languages: ["en-US"] })).not.toThrow();
    expect(() => runLinks({ url: "/en/solution", saved: "de", languages: ["de-DE"] })).not.toThrow();
    const blockedDe = runLinks({ url: "/loesung?ref=test#fragen", blocked: true, languages: ["en-US"] });
    expect(new URL(blockedDe.href, SITE_URL).pathname).toBe("/loesung");
    expect(blockedDe.switches[1].href).toBe(SITE_URL + "/en/solution?ref=test#fragen");
    const blockedEn = runLinks({ url: "/en/solution?lang=en&ref=test#fragen", blocked: true, languages: ["de-DE"] });
    expect(new URL(blockedEn.href, SITE_URL).pathname).toBe("/en/solution");
    expect(new URL(blockedEn.href, SITE_URL).searchParams.get("lang")).toBeNull();
  });

  test("switcher preserves query and hash, strips legacy lang, ordinary links stay clean", () => {
    const started = runLinks({ url: "/en/solution?ref=test&lang=en#funktionsweise", languages: ["de-DE"], saved: "de" });
    expect(started.switches[0].href).toBe(SITE_URL + "/loesung?ref=test#funktionsweise");
    expect(started.switches[1].href).toBe(SITE_URL + "/en/solution?ref=test#funktionsweise");
    // Absolute-path links never inherit the page query, so they stay clean;
    // the implementation adds no lang fallback to ordinary links.
    expect(new URL(started.navigation[0].href, SITE_URL).searchParams.get("lang")).toBeNull();
    expect(started.navigation[0].href).toBe(new URL("/ueber-uns", SITE_URL).href);
    expect(started.navigation[2].href).toBe("https://other.test/");
    // Later section changes refresh the switcher without re-adding lang.
    started.setLocation("/en/solution?ref=test&utm=x#fragen");
    started.callbacks.hashchange();
    expect(started.switches[0].href).toBe(SITE_URL + "/loesung?ref=test&utm=x#fragen");
    expect(started.switches[1].href).toBe(SITE_URL + "/en/solution?ref=test&utm=x#fragen");
    expect(started.navigation[0].href).toBe(new URL("/ueber-uns", SITE_URL).href);
    expect(new URL(started.navigation[1].href, SITE_URL).searchParams.get("lang")).toBeNull();
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
