// Shared by the HTML renderer and HTTP routing so canonical URLs agree.
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
    title: "From carbon to crop: how it works | Air2Growth",
    description: "Follow the Air2Growth journey: delivery, installation, CO₂ capture, algae cultivation, liquid fertiliser and machine support in a 60-second illustrated tour.",
    language: "en-GB",
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

export function canonicalRedirect(pathname: string): string | null {
  const page = Object.values(SEO_PAGES).find((entry) => entry.aliases.includes(pathname));
  return page?.path ?? null;
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function renderSeoTags(shellFile: string): string {
  if (!Object.hasOwn(SEO_PAGES, shellFile)) throw new Error(`Missing SEO metadata for ${shellFile}`);
  const page = SEO_PAGES[shellFile];
  const url = SITE_URL + page.path;
  const image = SITE_URL + "/img/og-image.jpg";
  const imageAlt = "Air2Growth – Bio-Flüssigdünger aus CO₂ für die Landwirtschaft";
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
        description: "Air2Growth entwickelt ein modulares System für Bio-Flüssigdünger aus CO₂. Luftfilterung und Mikroalgen ermöglichen eine lokale Düngerproduktion in landwirtschaftlichen Betrieben.",
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
          contactType: "Vertrieb",
          email: "info@air2growth.com",
          availableLanguage: ["de"],
        },
      },
      { "@type": "WebSite", "@id": websiteId, url: SITE_URL + "/", name: "Air2Growth", inLanguage: "de-DE", publisher: { "@id": organizationId } },
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
<meta property="og:type" content="website">
<meta property="og:locale" content="${(page.language ?? "de-DE").replace("-", "_")}">
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
