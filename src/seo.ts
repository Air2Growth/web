// Shared by the HTML renderer and HTTP routing so canonical URLs agree.
import { LOCALES, PAGE_PATHS, localeFile, type Locale } from "./locale-paths.ts";
export const SITE_URL = "https://air2growth.com";

interface PageSeo {
  path: string;
  aliases: string[];
  title: string;
  description: string;
  language?: string;
}

export const SEO_PAGES: Record<string, PageSeo> = {
  "ueber-uns.html": {
    path: "/ueber-uns",
    aliases: ["/ueber-uns.html", "/ueber-uns/"],
    title: "Über uns: das Team hinter Air2Growth",
    description: "Lernen Sie das Air2Growth-Gründerteam aus München kennen: die Menschen, ihre Aufgaben in Forschung, Entwicklung, Finanzen und Vertrieb sowie direkte Kontaktmöglichkeiten.",
  },
  "vision.html": {
    path: "/vision",
    aliases: ["/vision.html", "/vision/"],
    title: "Unsere Vision für die Landwirtschaft | Air2Growth",
    description: "Mehr Entscheidungsfreiheit auf dem Hof: Entdecken Sie die Vision von Air2Growth, unsere Grundsätze und wie wir gemeinsam mit der Praxis entwickeln wollen.",
  },
  "meilensteine.html": {
    path: "/meilensteine",
    aliases: ["/meilensteine.html", "/meilensteine/"],
    title: "Meilensteine: Auszeichnungen und Förderung | Air2Growth",
    description: "Die Meilensteine von Air2Growth: Ergebnisse bei Jugend gründet, STARTUP TEENS und Samsung sowie Förderung und Begleitung durch Gründungsprogramme.",
  },
  "loesung.html": {
    path: "/loesung",
    aliases: ["/loesung.html", "/loesung/"],
    title: "Unsere Lösung: Bio-Flüssigdünger vor Ort | Air2Growth",
    description: "CO₂ aus der Luft, Mikroalgen und ein modulares System auf Ihrem Hof: Entdecken Sie die Air2Growth-Lösung, ihre Funktionsweise und den geplanten Einsatz im Betrieb.",
  },
  "function.html": {
    path: "/function",
    aliases: ["/function.html", "/function/"],
    title: "Von CO₂ zum Dünger: So funktioniert’s | Air2Growth",
    description: "Erleben Sie Air2Growth in einer illustrierten Tour: Lieferung, Installation, CO₂-Filterung, Algenkultivierung, Flüssigdünger und Betreuung in 60 Sekunden.",
  },
  "index.html": {
    path: "/",
    aliases: ["/index.html"],
    title: "Air2Growth | Von der Luft auf Ihr Feld",
    description: "Wir denken Landwirtschaft weiter: Lernen Sie die Idee hinter Air2Growth, unsere Vision, das Gründerteam und unseren Weg zum Bio-Flüssigdünger aus CO₂ kennen.",
  },
  "impressum.html": {
    path: "/impressum",
    aliases: ["/impressum.html", "/impressum/"],
    title: "Impressum & Kontakt | Air2Growth",
    description: "Anbieterkennzeichnung von Air2Growth aus München: Verantwortliche, Anschrift und Kontakt für Fragen zu unserem CO₂-zu-Dünger-System.",
  },
  "datenschutz.html": {
    path: "/datenschutz",
    aliases: ["/datenschutz.html", "/datenschutz/"],
    title: "Datenschutzerklärung | Air2Growth",
    description: "Informationen zum Datenschutz bei Air2Growth: Verarbeitung personenbezogener Daten, Kontaktformulare und Ihre Rechte als betroffene Person.",
  },
};

const ENGLISH_SEO: Record<string, Pick<PageSeo, "title" | "description">> = {
  "index.html": { title: "Air2Growth | From air to your field", description: "We’re developing a system to produce organic liquid fertiliser from CO₂ on farms. Explore the idea, meet our team and see what we’re working towards." },
  "loesung.html": { title: "Fertiliser from CO₂, made on your farm | Air2Growth", description: "See how Air2Growth combines CO₂ capture and microalgae in a modular system, and explore how it could help your farm produce part of its own fertiliser supply." },
  "function.html": { title: "How Air2Growth would work | A 60-second tour", description: "Explore the proposed Air2Growth system in a 60-second illustrated tour, from delivery and installation to CO₂ capture, microalgae cultivation and support." },
  "meilensteine.html": { title: "Milestones, awards and support | Air2Growth", description: "Explore the awards, funding and programmes helping us develop Air2Growth, including Jugend gründet, STARTUP TEENS and Samsung." },
  "vision.html": { title: "Our vision for farming | Air2Growth", description: "More choice for farmers and careful use of resources. Discover the principles guiding Air2Growth and how practical farming experience shapes our approach." },
  "ueber-uns.html": { title: "Meet the team | Air2Growth", description: "Meet our founding team in Munich and find your contact for research, development, finance or sales. Learn how we’re working together on Air2Growth." },
  "impressum.html": { title: "Legal notice and contact | Air2Growth", description: "Provider information for Air2Growth in Munich, including the responsible parties, postal address and email contact." },
  "datenschutz.html": { title: "Privacy policy | Air2Growth", description: "Learn how Air2Growth handles personal data, contact enquiries and website analytics, and how to exercise your data protection rights." },
};

export interface LocalizedPage extends PageSeo {
  shellFile: string;
  locale: Locale;
}

export const SITE_PAGES: Record<string, LocalizedPage> = Object.fromEntries(
  LOCALES.flatMap((locale) => Object.entries(SEO_PAGES).map(([shellFile, page]) => {
    const path = PAGE_PATHS[shellFile][locale];
    return [localeFile(shellFile, locale), {
      ...page,
      ...(locale === "en" ? ENGLISH_SEO[shellFile] : {}),
      path,
      aliases: locale === "de" ? page.aliases : [path + ".html", path + "/", ...(shellFile === "index.html" ? ["/en/index.html"] : [])],
      language: locale === "en" ? "en-GB" : "de-DE",
      shellFile,
      locale,
    }];
  })),
);

export function renderSitemap(): string {
  const entries = Object.values(SITE_PAGES).map((page) => {
    const paths = PAGE_PATHS[page.shellFile];
    const alternates = LOCALES.map((locale) => `<xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL + paths[locale]}"/>`).join("");
    return `  <url><loc>${SITE_URL + page.path}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL + paths.de}"/></url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
}

export function canonicalRedirect(pathname: string): string | null {
  const page = Object.values(SITE_PAGES).find((entry) => entry.aliases.includes(pathname));
  return page?.path ?? null;
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderSeoTags(shellFile: string, locale: Locale = "de"): string {
  if (!Object.hasOwn(SEO_PAGES, shellFile)) throw new Error(`Missing SEO metadata for ${shellFile}`);
  const page = SITE_PAGES[localeFile(shellFile, locale)];
  const url = SITE_URL + page.path;
  const image = SITE_URL + "/img/og-image.jpg";
  const imageAlt = locale === "en" ? "Air2Growth – organic liquid fertiliser from CO₂ for farming" : "Air2Growth – Bio-Flüssigdünger aus CO₂ für die Landwirtschaft";
  const organizationId = SITE_URL + "/#organization";
  const websiteId = SITE_URL + "/#website";
  const imageId = SITE_URL + "/#social-image";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "Air2Growth",
        url: SITE_URL + "/",
        logo: { "@type": "ImageObject", url: SITE_URL + "/img/logo.svg", contentUrl: SITE_URL + "/img/logo.svg" },
        image: { "@id": imageId },
        slogan: "From Carbon to Crop",
        description: locale === "en" ? "Air2Growth is developing a modular system that uses captured CO₂ and microalgae to produce organic liquid fertiliser on farms." : "Air2Growth entwickelt ein modulares System für Bio-Flüssigdünger aus CO₂. Luftfilterung und Mikroalgen ermöglichen eine lokale Düngerproduktion in landwirtschaftlichen Betrieben.",
        email: "info@air2growth.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sedelhofstraße 13",
          postalCode: "81247",
          addressLocality: "München",
          addressCountry: "DE",
        },
        founder: ["Navika Bhardwaj", "Tim Kothe", "Felicia Kloss", "Thinh Nguyen"].map((name) => ({ "@type": "Person", name })),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: locale === "en" ? "Sales" : "Vertrieb",
          email: "info@air2growth.com",
          availableLanguage: ["de", "en"],
        },
      },
      { "@type": "WebSite", "@id": websiteId, url: SITE_URL + "/", name: "Air2Growth", inLanguage: ["de-DE", "en-GB"], publisher: { "@id": organizationId } },
      { "@type": "ImageObject", "@id": imageId, url: image, contentUrl: image, width: 1200, height: 630, caption: imageAlt },
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: page.title,
        description: page.description,
        inLanguage: page.language ?? "de-DE",
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
      },
    ],
  };
  const title = escapeAttribute(page.title);
  const description = escapeAttribute(page.description);
  const safeJson = JSON.stringify(graph, null, 2).replaceAll("<", "\\u003c");

  return `<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
${LOCALES.map((language) => `<link rel="alternate" hreflang="${language}" href="${SITE_URL + PAGE_PATHS[shellFile][language]}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${SITE_URL + PAGE_PATHS[shellFile].de}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${(page.language ?? "de-DE").replace("-", "_")}">
<meta property="og:locale:alternate" content="${locale === "de" ? "en_GB" : "de_DE"}">
<meta property="og:site_name" content="Air2Growth">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${imageAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${image}">
<meta name="twitter:image:alt" content="${imageAlt}">
<script type="application/ld+json">${safeJson}</script>`;
}
