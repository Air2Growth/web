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
  "loesung.html": {
    path: "/loesung",
    aliases: ["/loesung.html", "/loesung/"],
    title: "Unsere Lösung: Bio-Flüssigdünger auf Ihrem Hof | Air2Growth",
    description: "Vom CO₂ aus der Luft zum Bio-Flüssigdünger: Entdecken Sie das modulare Air2Growth-System, den Mikroalgen-Prozess und unsere Entwicklungsziele für Ihren Hof.",
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
    title: "Bio-Flüssigdünger aus CO₂ für Ihren Hof | Air2Growth",
    description: "Air2Growth entwickelt modulare Systeme für Bio-Flüssigdünger aus CO₂. So verbinden Luftfilterung und Mikroalgen lokale Düngerproduktion mit CO₂-Nutzung.",
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
