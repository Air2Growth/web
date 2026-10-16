import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { renderShell } from "../src/render.ts";
import { SITE_PAGES, SITE_URL } from "../src/seo.ts";

const root = resolve(import.meta.dir, "..");
let baseUrl: string;
let stopServer: (() => Promise<void>) | undefined;

async function inspectHtml(html: string) {
  const metadata = new Map<string, string[]>();
  const canonicals: string[] = [];
  const ids: string[] = [];
  const links: string[] = [];
  const scripts: string[] = [];
  const images: string[] = [];
  let title = "";
  let headings = 0;
  let language = "";
  let schemaText = "";
  let schemaCount = 0;
  let breadcrumbCount = 0;
  let breadcrumbHome = "";
  let breadcrumbCurrent = "";
  const breadcrumbLinks: string[] = [];

  await new HTMLRewriter()
    .on("html", { element: (element) => { language = element.getAttribute("lang") ?? ""; } })
    .on("head > title", { text: (chunk) => { title += chunk.text; } })
    .on("meta", { element(element) {
      const key = element.getAttribute("name") ?? element.getAttribute("property");
      if (key) metadata.set(key, [...(metadata.get(key) ?? []), element.getAttribute("content") ?? ""]);
    } })
    .on('link[rel="canonical"]', { element: (element) => { canonicals.push(element.getAttribute("href") ?? ""); } })
    .on("[id]", { element: (element) => { ids.push(element.getAttribute("id") ?? ""); } })
    .on("a[href]", { element: (element) => { links.push(element.getAttribute("href") ?? ""); } })
    .on("h1", { element: () => { headings += 1; } })
    .on("nav[data-breadcrumbs]", { element: () => { breadcrumbCount += 1; } })
    .on("nav[data-breadcrumbs] a", {
      element: (element) => { breadcrumbLinks.push(element.getAttribute("href") ?? ""); },
      text: (chunk) => { breadcrumbHome += chunk.text; },
    })
    .on('nav[data-breadcrumbs] [aria-current="page"]', { text: (chunk) => { breadcrumbCurrent += chunk.text; } })
    .on("script[src]", { element: (element) => { scripts.push(element.getAttribute("src") ?? ""); } })
    .on("img[src]", { element: (element) => { images.push(element.getAttribute("src") ?? ""); } })
    .on('script[type="application/ld+json"]', {
      element: () => { schemaCount += 1; },
      text: (chunk) => { schemaText += chunk.text; },
    })
    .transform(new Response(html)).text();

  return { title, metadata, canonicals, ids, links, headings, language, scripts, images, schemaCount, breadcrumbCount, breadcrumbHome, breadcrumbCurrent, breadcrumbLinks, schema: JSON.parse(schemaText) };
}

function decodeText(text: string) {
  return text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

beforeAll(async () => {
  const child = Bun.spawn({
    cmd: [process.execPath, "server.ts"],
    cwd: root,
    env: { ...process.env, NODE_ENV: "production", HOST: "127.0.0.1", PORT: "0" },
    stdout: "pipe",
    stderr: "inherit",
  });
  stopServer = async () => {
    if (child.exitCode === null) child.kill();
    await child.exited;
  };
  const reader = child.stdout.getReader();
  const decoder = new TextDecoder();
  let timer: ReturnType<typeof setTimeout>;
  try {
    baseUrl = await Promise.race([
      (async () => {
        let output = "";
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) throw new Error("Production server exited before it became ready; run the build first.");
          output += decoder.decode(chunk.value, { stream: true });
          const match = output.match(/Listening on (http:\/\/127\.0\.0\.1:\d+)/);
          if (match) return match[1];
        }
      })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Production server startup timed out")), 4000); }),
    ]);
  } catch (error) {
    await stopServer();
    throw error;
  } finally {
    clearTimeout(timer!);
    reader.releaseLock();
  }
});

afterAll(async () => { await stopServer?.(); });

describe("crawlable production pages", () => {
  test("page titles and descriptions are distinct across all languages", () => {
    const pages = Object.values(SITE_PAGES);
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length);
    expect(new Set(pages.map((page) => page.description)).size).toBe(pages.length);
  });

  test("Vercel explicitly redirects homepage index aliases to the same canonical destinations", async () => {
    const config = await Bun.file(resolve(root, "vercel.json")).json();
    expect(config.cleanUrls).toBe(true);
    expect(config.trailingSlash).toBe(false);
    for (const page of Object.values(SITE_PAGES).filter((page) => page.shellFile === "index.html")) {
      for (const source of page.aliases.filter((alias) => alias.includes("index"))) {
        expect(config.redirects).toContainEqual({ source, destination: page.path, permanent: true });
      }
    }
  });

  for (const [file, page] of Object.entries(SITE_PAGES)) {
    test(`${page.path} has unique, consistent metadata before JavaScript`, async () => {
      const response = await fetch(baseUrl + page.path);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");
      const html = await response.text();
      const parsed = await inspectHtml(html);
      const source = await inspectHtml(await renderShell(page.shellFile, page.locale));
      expect(decodeText(parsed.title)).toBe(page.title);
      expect(parsed.title).toBe(source.title);
      expect(parsed.metadata.get("description")).toEqual([page.description]);
      expect(parsed.canonicals).toEqual([SITE_URL + page.path]);
      expect(parsed.metadata.get("og:url")).toEqual(parsed.canonicals);
      expect(parsed.metadata.get("og:image")).toEqual([SITE_URL + "/img/og-image.jpg"]);
      expect(parsed.metadata.get("twitter:image")).toEqual(parsed.metadata.get("og:image"));
      expect(parsed.metadata.get("robots")?.join(",")).not.toContain("noindex");
      expect(parsed.language).toBe(page.language?.split("-")[0] ?? "de");
      expect(parsed.metadata.get("og:locale")).toEqual([(page.language ?? "de-DE").replace("-", "_")]);
      expect(parsed.headings).toBe(1);
      expect(new Set(parsed.ids).size).toBe(parsed.ids.length);
      expect(html).not.toContain("<!-- @seo -->");
      expect(html).not.toContain("<!-- @include");
      expect(html).not.toContain("<!-- @breadcrumbs");

      const nodes = parsed.schema["@graph"];
      const graphIds = new Set(nodes.map((node: { "@id": string }) => node["@id"]));
      expect(parsed.schemaCount).toBe(1);
      expect(parsed.schema["@context"]).toBe("https://schema.org");
      expect(graphIds.size).toBe(nodes.length);
      const webpage = nodes.find((node: { "@type": string }) => node["@type"] === "WebPage");
      expect(webpage.url).toBe(parsed.canonicals[0]);
      expect(webpage.name).toBe(page.title);
      expect(webpage.inLanguage).toBe(page.language ?? "de-DE");
      expect(graphIds.has(webpage.isPartOf["@id"])).toBe(true);
      expect(graphIds.has(webpage.about["@id"])).toBe(true);
      expect(graphIds.has(webpage.primaryImageOfPage["@id"])).toBe(true);
      const breadcrumb = nodes.find((node: { "@type": string }) => node["@type"] === "BreadcrumbList");
      if (page.shellFile === "index.html") {
        expect(breadcrumb).toBeUndefined();
        expect(webpage.breadcrumb).toBeUndefined();
        expect(parsed.breadcrumbCount).toBe(0);
      } else {
        expect(parsed.breadcrumbCount).toBe(1);
        expect(webpage.breadcrumb["@id"]).toBe(breadcrumb["@id"]);
        expect(breadcrumb.itemListElement).toEqual([
          { "@type": "ListItem", position: 1, name: parsed.breadcrumbHome, item: SITE_URL + parsed.breadcrumbLinks[0] },
          { "@type": "ListItem", position: 2, name: parsed.breadcrumbCurrent, item: SITE_URL + page.path },
        ]);
        expect(parsed.breadcrumbHome).toBe(page.locale === "de" ? "Startseite" : "Home");
        expect(parsed.breadcrumbLinks).toEqual([page.locale === "de" ? "/" : "/en"]);
        expect(parsed.breadcrumbCurrent).toBe(page.breadcrumbLabel);
      }
      const organization = nodes.find((node: { "@type": string }) => node["@type"] === "Organization");
      expect(organization.logo.contentUrl).toBe(SITE_URL + "/img/logo.svg");
    });

    test(`${page.path} serves a body-free HEAD response with the same metadata`, async () => {
      const get = await fetch(baseUrl + page.path);
      const head = await fetch(baseUrl + page.path, { method: "HEAD" });
      expect(head.status).toBe(200);
      expect(head.headers.get("content-type")).toBe(get.headers.get("content-type"));
      expect(head.headers.get("content-length")).toBe(get.headers.get("content-length"));
      expect(await head.text()).toBe("");
      await get.body?.cancel();
    });

    for (const alias of page.aliases) {
      test(`${alias} redirects once to its canonical URL and retains the query`, async () => {
        for (const method of ["GET", "HEAD"]) {
          const response = await fetch(baseUrl + alias + "?ref=seo%20check", { method, redirect: "manual" });
          expect(response.status).toBe(301);
          expect(response.headers.get("location")).toBe(page.path + "?ref=seo%20check");
          const target = await fetch(baseUrl + response.headers.get("location"), { redirect: "manual" });
          expect(target.status).toBe(200);
          const parsed = await inspectHtml(await target.text());
          expect(parsed.canonicals).toEqual([SITE_URL + page.path]);
        }
      });
    }
  }

  test("robots.txt advertises a sitemap containing only the canonical pages", async () => {
    const robots = await fetch(baseUrl + "/robots.txt");
    expect(robots.status).toBe(200);
    expect(robots.headers.get("content-type")).toContain("text/plain");
    const robotsText = await robots.text();
    expect(robotsText).toContain("Allow: /");
    expect(robotsText).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
    const sitemap = await fetch(baseUrl + "/sitemap.xml");
    expect(sitemap.status).toBe(200);
    expect(sitemap.headers.get("content-type")).toContain("application/xml");
    const xml = await sitemap.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations.sort()).toEqual(Object.values(SITE_PAGES).map((page) => SITE_URL + page.path).sort());
  });

  test("all page images and social previews resolve, including generated English diagrams", async () => {
    const images = new Set<string>();
    for (const page of Object.values(SITE_PAGES)) {
      const parsed = await inspectHtml(await (await fetch(baseUrl + page.path)).text());
      for (const image of [...parsed.images, ...(parsed.metadata.get("og:image") ?? [])]) {
        const url = new URL(image, SITE_URL + page.path);
        expect(url.origin).toBe(SITE_URL);
        images.add(url.pathname);
      }
    }
    expect(images.has("/img/solution-system-en.svg")).toBe(true);
    for (const image of images) {
      const response = await fetch(baseUrl + image);
      expect(response.status, image).toBe(200);
      expect(response.headers.get("content-type"), image).toStartWith("image/");
      await response.body?.cancel();
    }
  });

  test("the home links to product details on the solution page and both pages have valid anchors", async () => {
    const homeHtml = await (await fetch(baseUrl + "/")).text();
    const solutionHtml = await (await fetch(baseUrl + "/loesung")).text();
    const home = await inspectHtml(homeHtml);
    const solution = await inspectHtml(solutionHtml);
    expect(home.links).toContain("/loesung");
    expect(home.links).toContain("/loesung#fragen");
    expect(homeHtml).not.toContain("data-calculator");
    expect(homeHtml).not.toContain("data-process-step");
    expect(homeHtml).not.toContain('name="air2growth-faq"');
    expect(solutionHtml).not.toContain("data-calculator");
    expect(solution.ids).not.toContain("rechenmodell");
    expect(solutionHtml).toContain("data-process-step");
    expect(solutionHtml).toContain("Wie wird aus CO₂ Bio-Flüssigdünger?");
    expect(solutionHtml).toContain("Welche Kosten sind für das System vorgesehen?");
    const pages = new Map([["/", home], ["/loesung", solution]]);
    for (const [path, parsed] of pages) {
      for (const href of parsed.links) {
        const target = new URL(href, SITE_URL + path);
        if (target.origin === SITE_URL && target.hash) {
          expect(pages.get(target.pathname)?.ids).toContain(decodeURIComponent(target.hash.slice(1)));
        }
      }
    }
  });

  test("the function tour has a poster, full explanation and deliberate activation before JavaScript", async () => {
    const html = await (await fetch(baseUrl + "/en/how-it-works")).text();
    expect(html).toContain("data-function-tour");
    expect(html).toContain('data-tour-state="poster"');
    expect(html).toContain("Start the tour");
    expect(html).toContain("A 60-second tour of the proposed system. Pause or exit at any time.");
    expect(html).toContain("With water, nutrients and light, the algae grow.");
    expect(html).toContain("The algae are then harvested and processed into liquid fertiliser.");
    expect(html).toContain("Operating data only. No other private information.");
    expect(html).not.toContain('class="pin-spacer');
    const home = await inspectHtml(await (await fetch(baseUrl + "/")).text());
    expect(home.links).toContain("/function");
  });

  test("built scripts are served with immutable caching; missing pages return 404", async () => {
    const parsed = await inspectHtml(await (await fetch(baseUrl + "/")).text());
    const script = parsed.scripts.find((src) => /\/assets\/main-/.test(src));
    expect(script).toBeDefined();
    const asset = await fetch(baseUrl + script);
    expect(asset.status).toBe(200);
    expect(asset.headers.get("cache-control")).toContain("immutable");
    await asset.body?.cancel();
    const missing = await fetch(baseUrl + "/not-a-real-page");
    expect(missing.status).toBe(404);
    await missing.body?.cancel();
  });

  test("the existing local contact API still handles form submissions", async () => {
    const response = await fetch(baseUrl + "/api/kontakt", {
      method: "POST",
      body: new URLSearchParams({ name: "SEO-Prüfung", email: "qa@example.com", message: "Lokale Prüfung nach den SEO-Anpassungen.", datenschutz_zustimmung: "Ja" }),
    });
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("wurde nicht gesendet");
  });

  test("English forms receive English validation and demo feedback", async () => {
    const wrongMethod = await fetch(baseUrl + "/api/kontakt?lang=en");
    expect(wrongMethod.status).toBe(405);
    expect(await wrongMethod.text()).toContain("Method not allowed.");
    const invalid = await fetch(baseUrl + "/api/kontakt", {
      method: "POST", body: new URLSearchParams({ lang: "en", name: "Test", email: "invalid", message: "A message for validation.", datenschutz_zustimmung: "Ja" }),
    });
    expect(invalid.status).toBe(422);
    expect(await invalid.text()).toContain("Please enter a valid email address.");
    const valid = await fetch(baseUrl + "/api/kontakt", {
      method: "POST", body: new URLSearchParams({ lang: "en", name: "Test", email: "qa@example.com", message: "A message for validation.", datenschutz_zustimmung: "Ja" }),
    });
    expect(valid.status).toBe(200);
    expect(await valid.text()).toContain("was not sent");
    const newsletter = await fetch(baseUrl + "/api/newsletter", {
      method: "POST", body: new URLSearchParams({ lang: "en", email: "qa@example.com", info_einwilligung: "Ja" }),
    });
    expect(newsletter.status).toBe(200);
    expect(await newsletter.text()).toContain("no subscription was created");
  });
});
