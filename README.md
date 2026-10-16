# Air2Growth — lokale Website-Nachbildung (Bun + htmx)

 originalgetreue lokale Nachbildung der öffentlichen Website
 <https://air2growth.com> — `bun run dev` startet den Vite-Frontend-Server
 (`0.0.0.0:3000`, Templates + Styling) plus das Bun-API-Backend
 (`127.0.0.1:3001`, nur `/api/*`); Styling per Tailwind CSS v4
 (`tailwindcss` + `@tailwindcss/vite`, gepinnt; Bibliothek aus
 `node_modules`, kein CDN, kein Browser-Compiler, keine generierte
 CSS-Datei).
 htmx ist eine gepinnte lokale
 npm-Abhängigkeit (`htmx.org@2.0.11`) und wird unter
 `/assets/htmx.min.js` ausgeliefert — kein CDN, kein Browser-Compiler.

## Sprachen (16.10.2026)

Die Website ist auf Deutsch und Englisch verfügbar. Die bisherigen deutschen
URLs bleiben erhalten; Englisch verwendet `/en` und übersetzte Pfade:

| Deutsch | Englisch |
| --- | --- |
| `/` | `/en` |
| `/loesung` | `/en/solution` |
| `/function` | `/en/how-it-works` |
| `/meilensteine` | `/en/milestones` |
| `/vision` | `/en/vision` |
| `/ueber-uns` | `/en/about` |
| `/impressum` | `/en/legal-notice` |
| `/datenschutz` | `/en/privacy` |

Ein frühes Skript im HTML-Head wählt beim Besuch einer deutschen URL die erste
unterstützte Sprache aus `navigator.languages`; ohne Treffer bleibt Deutsch.
Regionale Varianten wie `en-US` und `de-CH` werden erkannt. Ein direkter
englischer Link öffnet immer die englische Seite. Die DE-/EN-Links wechseln
zur entsprechenden Seite und erhalten Query-Parameter sowie Abschnittsanker.
Eine manuelle Auswahl hat Vorrang vor der Browsersprache und wird als
`air2growth-language` lokal gespeichert. Bei gesperrtem Speicher bleiben
Sprachlinks mit `?lang=de` bzw. `?lang=en` funktionsfähig. Ohne JavaScript sind
beide Sprachversionen über normale Links vollständig lesbar.

`src/locale-paths.ts` ordnet die Seiten einander zu. Vite und Bun verwenden
`SITE_PAGES` aus `src/seo.ts` für alle 16 vorgerenderten HTML-Seiten. Die
Kataloge unter `src/locales/` übersetzen Text und zugängliche Beschriftungen
beim Rendern; JavaScript, IDs und Animations-Hooks bleiben erhalten. Die
englische Tour-Vorlage wird für Deutsch mit `de/tour.json` übersetzt.
`en/tour.json` enthält die redigierte englische Fassung der Tour, einschließlich
der Bedienelemente. Englische Texte beschreiben den geplanten Einsatz und
kennzeichnen Air2Growth als System in Entwicklung.
`src/messages.ts` liefert lokalisierte Interaktionstexte und API-Rückmeldungen.
Formulare geben die aktuelle Sprache als verborgenes Feld an die API weiter.
Die englischen Systemgrafiken und die zweisprachige Sitemap werden aus den
gemeinsamen Quellen gebaut. Canonical-, hreflang-, Open-Graph- und JSON-LD-
Metadaten sind sprachspezifisch. Vercels Clean-URLs gelten auch unter `/en`.

Prüfung: `bun run test:i18n` baut die Website und prüft Browserauswahl,
gespeicherte/gesperrte Präferenzen, Katalogabdeckung, alle 16 Seiten,
Sprachverweise, lokale Anker und Formulartexte. Die Tests laufen lokal,
ohne Deployment oder externe Übersetzungsdienste.

## Lösungsseite (16.10.2026)

`/loesung` ist eine eigenständige deutsche Produktseite mit eigener
Prinzipgrafik (`public/img/solution-system.svg`), Nutzen für den Betrieb,
interaktiver Prozesserklärung, FAQ und direktem E-Mail-Kontakt.
Prozesserklärung und Produkt-FAQ stehen ausschließlich auf dieser Seite.
Der Kostenrechner und seine Verweise wurden entfernt.
Desktop- und Mobilnavigation sowie der Lösungs-Teaser führen zur neuen Seite;
der Startseitenanker `/#loesung` bleibt erreichbar. Die aktive Navigation
unterscheidet Seiten von Startseitenabschnitten. Entwicklungsstand und
Modellannahmen sind ausdrücklich gekennzeichnet.

Vite und Bun liefern `/loesung`; `/loesung.html` und `/loesung/` werden
mit 301 auf die kanonische URL umgeleitet. Metadaten und JSON-LD liegen in
`src/seo.ts`, die Route ist in der Sitemap enthalten. Die Seitenshell liegt
in `templates/loesung.html`; Gestaltung über die bestehende Tailwind-Pipeline.

Die Startseite ist als Einstieg in Air2Growth gestaltet: ein Landschaftshero
mit direktem Lösungslink, eine kurze Orientierung zu `/loesung` und `/function`,
Vision, Meilensteine, Unterstützer, Team und Kontakt. Sie wiederholt keine
Produktgrafiken, Leistungszahlen, Prozessschritte oder Produkt-FAQ.
Der Kontakttext richtet sich auch an Forschung und mögliche Partner.
Alte Startseiten-Bookmarks zu `#funktionsweise`, `#fragen`
und `#vorteile` werden mit JavaScript an den passenden Abschnitt auf
`/loesung` weitergeleitet; Query-Parameter bleiben erhalten. Der entfernte
Abschnitt `#rechenmodell` führt zur Lösungsseite. `#problem`
führt zur kurzen Einführung unter `/#loesung`. Ohne JavaScript führen die
sichtbaren Navigationslinks direkt zu den jeweiligen Seiten.

## Meilensteine (16.10.2026)

`/meilensteine` enthält die sechs bisherigen Einträge, gegliedert in
Auszeichnungen sowie Förderung und Begleitung. Die Seitenshell liegt in
`templates/meilensteine.html`, der Inhalt in `partials/milestones-page.html`.
Die Startseite zeigt unter `#meilensteine` nur noch einen kurzen Einstieg
mit Link zur vollständigen Seite. Die übrigen Startseitenabschnitte bleiben
unverändert. Desktop-/Mobilnavigation und der Verweis auf der Lösungsseite
führen direkt zu `/meilensteine`. `.html`- und Slash-Varianten werden mit 301
umgeleitet; SEO-Metadaten und Sitemap enthalten die neue kanonische Route.

## Vision (16.10.2026)

`/vision` erläutert die langfristige Ausrichtung von Air2Growth: mehr
Entscheidungsfreiheit für Betriebe, Grundsätze zu Praxisnähe und Ressourcen,
den geplanten Weg zur Erprobung sowie Möglichkeiten zum Mitgestalten.
Die erweiterten deutschen Texte beschreiben Ziele und Entwicklungsansprüche.
Die Systemtechnik bleibt auf `/loesung`.

Die Seitenshell liegt in `templates/vision.html`, der Inhalt in
`templates/partials/vision-page.html`. Nur der Vision-Abschnitt der Startseite
wurde zu einem kurzen Einstieg mit Link umgestaltet; `/#vision` bleibt
erreichbar. Desktop- und Mobilnavigation führen zu `/vision`. SEO, Sitemap
und die 301-Weiterleitungen für `/vision.html` sowie `/vision/` sind integriert.

## Über uns (16.10.2026)

`/ueber-uns` stellt das Gründerteam aus München mit dem vorhandenen Teamfoto,
den vier Aufgabenbereichen und direkten E-Mail-Kontakten vor. Ergänzende
Texte erläutern den gemeinsamen Ansatz und Möglichkeiten zur Kontaktaufnahme.
Die Seitenshell liegt in `templates/ueber-uns.html`, der Inhalt in
`templates/partials/about-page.html`.

Nur der Team-Abschnitt der Startseite wurde zu einer kurzen Vorschau mit
Link umgestaltet; `/#team` bleibt erreichbar. Navigation und Team-Verweise
auf Vision- und Meilensteinseite führen direkt zu `/ueber-uns`. SEO, Sitemap
und 301-Weiterleitungen für `/ueber-uns.html` sowie `/ueber-uns/` sind integriert.

## Unterstützer-Logos (16.10.2026)

Der Unterstützerstreifen nutzt die Logos der fünf bereits genannten
Organisationen in ihren Originalfarben. Die lokalen Dateien liegen unter
`public/img/supporters/`; `sources.json` dokumentiert die offiziellen
Fundstellen und den Abruf. Auf der Seite sind Quellen und der Bildnachweis
für JUGEND GRÜNDET unter „Logoquellen“ zugänglich.

`src/supporters.js` wird nur auf Seiten mit dem Unterstützerstreifen geladen.
GSAP bewegt zwei identische Logogruppen mit 32 px/s in einer nahtlosen
Endlosschleife. Die Kopie bleibt für Hilfstechnologien verborgen. Pause/
Fortsetzen funktioniert per Button und Tastatur; Hover, ein unsichtbarer
Streifen oder ein inaktiver Tab pausieren die Bewegung ebenfalls.
Bei reduzierter Bewegung oder ohne Animationsskript bleibt die vollständige
Liste statisch sichtbar. Änderungen der Bewegungseinstellung und Vite-HMR
räumen Animation, Beobachter und Ereignisbehandlung auf.

Die gekapselten Layoutregeln liegen in `src/supporters.css`. Die übrigen
Startseitenabschnitte werden dadurch nicht verändert.

## Technisches SEO (15.10.2026)

- `src/seo.ts` ist die gemeinsame Quelle für Seitentitel, individuelle
  Beschreibungen, kanonische URLs, Open-Graph-/Twitter-Metadaten und
  JSON-LD. Die Daten werden beim Rendern/Build direkt ins HTML geschrieben.
  `Organization`, `WebSite`, `ImageObject` und die jeweilige `WebPage`
  sind über absolute IDs miteinander verbunden. Die Bild- und Logo-URLs
  verwenden die Produktionsdomain `https://air2growth.com`.
- `public/robots.txt` verweist auf `public/sitemap.xml`. Die Sitemap listet
  die deutschen URLs `/`, `/loesung`, `/meilensteine`, `/vision`, `/ueber-uns`, `/function`,
  `/impressum` und `/datenschutz` sowie ihre acht englischen Gegenstücke
  als kanonische URLs mit Sprachverweisen. Der Build erzeugt die Sitemap aus
  `SITE_PAGES`. Beim Hinzufügen weiterer Seiten `SEO_PAGES`, `PAGE_PATHS`,
  die englischen Metadaten und HTML-Proxies ergänzen; die Tests prüfen die Links.
- Bun-Produktion und Vite-Dev leiten `/index.html` dauerhaft auf `/` und
  die `.html`-/Slash-Varianten der Rechtstexte auf ihre sauberen URLs um
  (301 für GET/HEAD, Query-Parameter bleiben erhalten). Auf Vercel regelt
  `vercel.json` die Clean-URLs und Weiterleitungen (308). Bei anderem statischem
  Hosting diese Weiterleitungen im jeweiligen Host konfigurieren;
  die gebauten `.html`-Dateien enthalten weiterhin die Canonical-Tags.
- Die FAQ unter `/loesung#fragen` beantwortet Fragen zu Funktionsweise,
  Zielbetrieben, Modellkosten und Testmöglichkeiten. Alle Antworten sind
  im initialen HTML enthalten und über native Details-Elemente bedienbar.
- Der Hero behält sein Layout; sein Hintergrundbild wird mit hoher
  Priorität vorgeladen und hat explizite Abmessungen. Gehashte CSS-/JS-
  Assets werden in Bun-Produktion ein Jahr unveränderlich gecacht;
  weitere statische Dateien eine Stunde, HTML mit Revalidierung.
- `bun run test:seo` baut die Seite und startet einen isolierten
  Produktionsserver auf einem freien lokalen Port. 15 Tests prüfen
  Seitendaten, JSON-LD-Verknüpfungen, initiale Inhalte, Sitemap/Robots,
  Weiterleitungen, HEAD-Antworten, Asset-Caching und das lokale Kontakt-API.

Nach dem Deployment kann `https://air2growth.com/sitemap.xml` in der
Google Search Console eingereicht werden. Indexierung und tatsächliche
Suchdarstellung lassen sich dort prüfen.

Grundlage: Google Search Central zu
[kanonischen URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
und [Organisationsdaten](https://developers.google.com/search/docs/appearance/structured-data/organization).

Die früheren QA-Notizen mit 200-Antworten für HTML-Aliase sind historisch;
die oben beschriebenen Canonical-Weiterleitungen gelten für den aktuellen Stand.

## Gestaltung (Redesign 15.10.2026)

### Aktuelle Verfeinerung: minimalistische Sektionen

Der Hero behält sein bisheriges Layout mit Landschaftsvideo, Overlay,
Serifentitel und zwei CTAs; nur die Texte und eine dezente Eintrittsanimation
wurden angepasst. Die übrigen Sektionen nutzen ruhigere Spalten, weniger
Kacheln und präzisere deutsche Erklärungen. Die neue, selbst erstellte
`public/img/system-loop.svg` zeigt das Systemprinzip; eine zweite, inline
eingebundene SVG erklärt die drei Prozessschritte.

Die einzige Styling-Pipeline bleibt Vite/Tailwind. Ihr Einstieg ist jetzt
`src/styles.css`: Tailwind-Import, lokal gehostete Open-Sans-Schriftschnitte
und zentrale Farb-/Schrifttokens. Die Layouts und Zustände bleiben
Tailwind-Utilities in den Templates; es gibt keine Komponenten-CSS-Dateien.
Dieser Absatz ersetzt die älteren Hinweise zu direktem CSS-Paketimport
und dem Verzicht auf `@theme` weiter unten.

`src/experience.js` ergänzt native Details-Elemente um unterbrechbare
Höhenübergänge und aktualisiert die Prozessgrafik. Ohne JavaScript bleiben
die Erklärungen sichtbar. `prefers-reduced-motion` verhindert die neuen
Animationen; es gibt keine laufenden Effekte in den Inhaltssektionen.

Das mobile Menü animiert Öffnen/Schließen, sperrt den Hintergrund per
`inert`, hält den Tastaturfokus und gibt ihn bei Navigation an den
Zielabschnitt zurück. Formulare zeigen konkrete Servervalidierungen sowie
Verbindungsfehler und sperren den Button während einer Anfrage. Kontakt
und Newsletter bleiben lokale Demos ohne Versand oder Speicherung;
die Oberfläche macht das vor der Eingabe deutlich.

Die folgenden Gestaltungs- und QA-Notizen beschreiben frühere Stände.

Validierung der Verfeinerung: Produktionsbuild erfolgreich; Browserbreiten
320/390/768/1024/1440 px ohne horizontalen Überlauf oder defekte Bilder.
Menü mit Escape/Fokusrückgabe, Prozess mit Tastatur und schnellen
Mehrfachklicks, Modulrechnung für 1/3/8 Module sowie beide Demoformulare
und konkrete Servervalidierung (422) geprüft. Der per `matchMedia`
simulierte Reduced-Motion-Pfad startet keine neuen Animationen und lädt
keine Hero-Videos. Ohne Skripte bleiben die nativen Prozess-Details
bedienbar. Alle sechs Produktionsrouten antworten auf GET/HEAD mit 200;
lokale Assets, SVG, eindeutige IDs und strukturierte JSON-Daten geprüft.

- Visuelle Richtung angelehnt an `https://climeworks.com/` (betrachtet am
  15.10.2026; Live-Seite teils per Bot-Schutz blockiert, daher zusätzlich
  Textfassung per Fetch gegengeprüft): schwebende weiße Pill-Navigation,
  Hero im vollen Viewport mit Foto und dunklem Overlay, ruhige
  Editorial-Serifen (Georgia, Systemschrift), großzügige Weißräume,
  schmale Textspalten (~800 px), blasse Grau-/Grünpanels, grüne CTAs,
  dunkler Footer.
- **Abgrenzung:** Keine Climeworks-Assets, -Texte, -Claims, kein Logo und
  keine proprietären Fonts übernommen. Serif = Georgia
  (Systemschrift), Sans = lokal gehostetes Open Sans wie bisher.
- Header nutzt eine schlichte Text-Wortmarke „Air2Growth“ (das bisherige
  `img/a2g-logo-green.jpg` liegt weiter lokal vor, sitzt aber als
  JPEG-Kachel nicht sauber in der Pill-Nav). Marke, Inhalte, deutsche
  Texte, Hero- und Team-Bilder sowie alle Sektions-Anker
  (`#problem`, `#loesung`, `#vorteile`, `#funktionsweise`,
  `#rechenmodell`, `#meilensteine`, `#vision`, `#team`, `#kontakt`,
  `#newsletter`) und Rechtstexte bleiben erhalten.
- **Breite Nav/Hero (15.10.2026, Vorgabe):** Navbar (`nav.html`) und Hero-Textcontainer (`hero.html`) sind auf Desktop
  (`lg:`, ≥ 1024 px) exakt `50vw` breit und per `left-1/2 -translate-x-1/2`
  (Nav) bzw. `mx-auto` (Hero) horizontal zentriert, Text linksbündig;
  Hero-Hintergrund (Foto/Videos/Gradient) bleibt Full-Viewport. Mobil/Tablet
  darunter: fast volle Breite (`calc(100% − 24/40px`). Da ~640–960 px
  Navbreite nicht für Logo + 6 Links + CTA reicht, zeigt erst `lg:` (`≥ 1024 px`)
  die Inline-Links; darunter greift das bestehende Hamburger-Menü
  (Checkbox/`peer-checked`, schließt per Link/Escape).
- Styling: Tailwind-Bibliothek aus `node_modules` (kein CDN/Compiler),
  geladen über den Frontend-Einstieg `src/main.ts`
  (`tailwindcss/index.css`-Paketexport + `src/site.js`); Verhalten in
  `src/site.js` (mobiles Menü, Escape für Menü, htmx-Fehleranzeige,
  Hero-Video-Double-Buffer). Es gibt genau eine Styling-Pipeline (Vite):
  keine generierte CSS-Datei, kein CLI-Watcher. Template-Änderungen
  (inkl. neuer Utilities) wirken in `bun run dev` sofort ohne Build/Neustart.
  Kein Cookie-Banner (kein Tracking).
- Einschränkungen: Hero-Foto (`hero.webp`) und Team-Foto sind die
  einzigen lokalen Bilder und werden bewusst beschnitten eingesetzt;
  es wurden keine Auszeichnungen/Partner/Bilder erfunden.

## Herkunft

- Quelle: öffentlich abgerufenes HTML/CSS/Fonts/Bilder von
  `https://air2growth.com/` (Stand: 15.10.2026, single-page, ca. 7.109 px
  hoch @1280).
- Alle relativen Abhängigkeiten (`img/*`, `fonts/*.woff2`,
  `favicon.ico`) liegen lokal unter `public/`; verschachtelte
  `url()`-/`img`-Referenzen wurden geprüft — kein lokales Asset fehlt.
- Entfernt: Umami-Analyse-Skript, Cloudflare-E-Mail-Decode-Skript,
  eigener Zähler (`/_z`, Scrolltiefe), Web3Forms-Handler inkl.
  `access_key`, `data-umami-event`-Attribute. Cloudflare-geschützte
  E-Mails wurden zu denselben `mailto:`-Adressen dekodiert. Die
  Datenschutz-Texte (u. a. Erwähnung von Umami/Web3Forms) bleiben als
  Inhalt erhalten.
- Design, Texte, Logo, Hero-Foto, Icons, Team-Bild, Meilensteine,
  Navigation (inkl. mobiles Burger-Menü per Checkbox), Impressum/
  Datenschutz-Overlays (`:target`) und das mobile Menü-Auto-Schließen
  (Escape/Link-Klick) entsprechen der Quelle.

## Voraussetzungen

- [Bun](https://bun.sh) >= 1.2 (verifiziert mit 1.4.2)

## Setup

```sh
bun install   # Abhängigkeiten aus package.json + bun.lock
bun run dev   # Frontend Vite 0.0.0.0:3000 + API-Backend 127.0.0.1:3001 (ein Befehl, sauberes Shutdown)
bun run build # Produktion: htmx kopieren + Vite-Build (Tailwind via @tailwindcss/vite, gehashte CSS/JS, 3 HTML) -> dist/
bun run start # Produktion: NODE_ENV=production bun server.ts (serviert dist/ + APIs auf 0.0.0.0:3000)
```

## Run

```sh
bun run dev     # Frontend (Vite, 0.0.0.0:3000) + API-Backend (Bun, 127.0.0.1:3001); ein Befehl, sauberes SIGINT/SIGTERM-Shutdown
bun run dev:api  # nur API-Backend (Bun, Dev: 127.0.0.1:3001 via BACKEND_PORT/PORT)
bun run dev:vite # nur Frontend (Vite, 0.0.0.0:3000; braucht das Backend auf :3001 für den /api-Proxy)
bun run start   # Produktion: NODE_ENV=production bun server.ts (serviert dist/ + APIs auf 0.0.0.0:3000; bricht lesbar ab, wenn dist/ fehlt)
bun run preview # nur statisches dist/ via Vite :4173 (+ /api-Proxy auf Bun, falls Bun läuft); kein Ersatz für start
```

Dev öffnen: <http://localhost:3000> (Vite). Env-Overrides:
`FRONTEND_PORT` (Vite), `BACKEND_PORT`/`PORT` (Bun-APIs, Dev-Default 3001),
`BUN_TARGET` (Proxy-Ziel, Dev-Default `http://127.0.0.1:3001`).
Produktion bindet `0.0.0.0:3000` (Override via `PORT`):

```sh
PORT=4000 bun run start
```

Template- und Klassen-Änderungen in `templates/partials/*.html` wirken im
Dev-Frontend sofort (Vite-Reload + Tailwind-Rescan, inkl. zuvor ungenutzter
Klassen) — kein Build, kein Neustart, keine generierte CSS-Datei.

## Build & Deployment (Vite)

- **Versionen (gepinnt, Bun 1.4.2-verifiziert):** `vite@7.3.7`,
  `@tailwindcss/vite@4.1.14` (Peer `vite ^5.2 || ^6 || ^7` — daher kein
  Vite 8), `tailwindcss@4.1.14`. Vite-7-Doku per Context7 geprüft
  (`build.rollupOptions.input`, `server/proxy`, `public`-Verzeichnis).
- **Ablauf:** `bun run build` = `build:htmx` (`node_modules/htmx…` →
  `public/assets/htmx.min.js`, git-ignoriert; denselben Copy-Schritt legt
  `bun run dev` beim Start an, falls die Datei fehlt) + `vite build`.
  Das Plugin `a2g-includes` (`vite.config.ts`) assembliert
  acht gemeinsame Seitentypen (`index`, `loesung`, `function`, `meilensteine`,
  `vision`, `ueber-uns`, `impressum`, `datenschutz`)
  in zwei Sprachen aus `templates/` (Renderer: `src/render.ts`) und macht
  relative `img/`-/`fonts/`-/`favicon`-/`data-playlist`-Pfade
  root-absolut. Die Template-Heads referenzieren kanonisch
  `<script type="module" src="/src/main.ts">` (Tailwind-Paket-Stylesheet
  + `src/site.js`, gebündelt und gehasht) — Dev und Build nutzen
  dieselbe Quelle, kein Rewrite, kein Duplikat. Ergebnis `dist/`: 16 volle
  HTML + `assets/main-[hash].{css,js}`, `assets/htmx.min.js`, `fonts/`,
  `img/` (inkl. `logo.svg`), `video/`, `favicon.ico`.
- **Produktion:** `bun run start` (`NODE_ENV=production`, `0.0.0.0:3000`,
  `PORT`-Override) serviert `dist/` (Seiten beim Start einmal gelesen,
  kein Template-Zugriff zur Laufzeit; Aliase `/impressum`, `/datenschutz`,
  `.html`-Varianten; Videos mit Range/`206`; APIs `/api/kontakt`,
  `/api/newsletter` unverändert). Fehlt `dist/`, bricht `start` mit
  „run `bun run build` first“ ab (Exit 1).
- **Vercel:** Projektwurzel ist dieses `web/`-Verzeichnis (bei einem Repository
  mit mehreren Projekten die Root Directory entsprechend setzen).
  `vercel.json` legt den Vite-Preset, `bun run build` und das Ausgabeverzeichnis
  `dist` fest. `cleanUrls: true` liefert beispielsweise `/loesung` aus
  `dist/loesung.html`; das gilt für alle 16 Sprachseiten, auch bei direktem Aufruf
  und Neuladen. `.html`-URLs und abschließende Slashes werden mit 308 auf die
  kanonischen Pfade umgeleitet. Die Vite-Dev-Middleware wird beim statischen
  Deployment nicht ausgeführt. Nach Übernahme der Konfiguration neu deployen.
  Grundlage: [Vercel-Konfiguration für Clean-URLs](https://vercel.com/docs/project-configuration/vercel-json#cleanurls).
- **Statisches Hosting (Anbieter-neutral):** `dist/` enthält alle 16
  HTML-Seiten im Root bzw. unter `en/`. Clean-URLs funktionieren auf Hosts mit
  Clean-URL-Support, sonst die `.html`-Pfade.
  **Einschränkung:** Kontakt-/Newsletter-Formulare (`hx-post /api/*`)
  brauchen den Bun-Server; rein statisch gehostet schlagen sie fehl.
  `bun run preview` ist statisch-only (optional `/api`-Proxy auf Bun) und
  kein vollwertiges Deployment.
- **Dev:** `bun run dev` (Vite `:3000` + Bun-APIs `:3001`, ein Befehl).
  Einzeln: `bun run dev:api` (nur APIs, `127.0.0.1:3001`) bzw.
  `bun run dev:vite` (`0.0.0.0:3000`, `/api` → `127.0.0.1:3001`,
  Override `BUN_TARGET`). Clean-URLs (`/impressum`, `/datenschutz`)
  funktionieren im Vite-Dev per Middleware-Rewrite.

## Endpoints

| Methode | Pfad                  | Antwort                                    |
| ------- | --------------------- | ------------------------------------------ |
| GET/HEAD | `/` / `/index.html`  | Startseite (alle Sektionen, ohne Legal-Overlays; serverseitig aus `templates/` assembliert) |
| GET/HEAD | `/loesung`           | Eigenständige Lösungsseite mit Prozess und FAQ |
| GET/HEAD | `/meilensteine`      | Auszeichnungen, Förderung und Begleitung von Air2Growth |
| GET/HEAD | `/vision`           | Vision, Entwicklungsgrundsätze und Einladung zum Mitgestalten |
| GET/HEAD | `/ueber-uns`        | Gründerteam, Aufgabenbereiche und direkte Kontakte |
| GET/HEAD | `/impressum`         | Impressum (eigenes Dokument, gleiche Nav/Footer, `h1`, „Zur Startseite“) |
| GET/HEAD | `/datenschutz`       | Datenschutz (eigenes Dokument, gleiche Nav/Footer, `h1`, „Zur Startseite“) |
| GET     | `/img/*`, `/fonts/*`, `/favicon.ico` | Lokale Bilder/Fonts, korrekte MIME |
| GET     | `/assets/htmx.min.js` | Lokal gepinntes htmx 2.0.11                |
| POST    | `/api/kontakt`        | HTML-Fragment (Demo-Status, s. u.)         |
| POST    | `/api/newsletter`     | HTML-Fragment (Demo-Status, s. u.)         |

Statisches Serving: nur `GET`/`HEAD`, Pfad-normalisiert unter
`./public` (Traversal-Schutz via Verzeichnis-Prefixprüfung),
MIME-Typen für html/css/js/png/jpg/webp/ico/woff2 u. a.
Unbekannte Pfade → `404`, falsche Methoden auf `/api/*` → `405`.
Die alten Starter-Endpunkte (`/api/time`, `/api/greet`,
`/styles.css`) sind entfernt.

## Formulare (lokale htmx-Adaption)

- `POST /api/kontakt` erwartet `name` (max. 80), `email` (gültig),
  `message` (10–2000 Zeichen), `datenschutz_zustimmung` gesetzt und
  leeres Honeypot-Feld `botcheck`. Antwort ist ein HTML-Fragment für
  `#kontakt-status`.
- `POST /api/newsletter` erwartet `email` (gültig),
  `info_einwilligung` gesetzt und leeres `botcheck`. Antwort ist ein
  HTML-Fragment für `#info-status`.
- Fehler → `400`/`422`-Fragment; die Seite zeigt es in der
  zugehörigen Statusregion (`htmx:responseError`-Handler).
- **Einschränkung (Demo): Es findet kein echter Versand / keine echte
  Anmeldung statt.** Erfolgsantworten sagen ehrlich
  „nicht gesendet — kein Versand konfiguriert“ bzw.
  „nicht angemeldet — kein Versand konfiguriert“ und behaupten niemals
  „gesendet“/„angemeldet“. Kein API-Key, keine Credentials, keine
  Weiterleitung an Dritte (kein `danke.html`-Redirect).

## Projektstruktur

```text
server.ts            # Bun.serve: dev NUR /api/kontakt + /api/newsletter (127.0.0.1:3001; Rest 404 mit Vite-Hinweis) + prod dist/ + statische Dateien + APIs (0.0.0.0:3000)
vite.config.ts       # Vite 7: @tailwindcss/vite + a2g-includes-Plugin (transformIndexHtml pre: includes + Asset-Rewrites), rollupOptions-Inputs (index/impressum/datenschutz), /api-Proxy (-> 127.0.0.1:3001), Clean-URL-Rewrites, Template-Watcher, preview-Proxy
index.html / impressum.html / datenschutz.html  # Root-Vite-Einstiege (Proxies -> templates/*.html, nicht direkt bearbeiten)
src/render.ts        # Template-Renderer (MANIFEST/renderShell; genutzt vom Vite-Plugin; templates/ ist einzige Markup-Quelle)
src/main.ts          # Vite-Einstieg: import tailwindcss/index.css (Paket-Stylesheet aus node_modules) + site.js (gehasht nach dist/assets); keine generierte CSS-Datei
src/site.js          # Verhaltensschicht (Menü/htmx-Errors/Hero-Double-Buffer); via main.ts gebündelt (dev + prod)
templates/index.html      # Home-Shell (klein): DOCTYPE/html/body/main + <!-- @include ... -->-Marker
templates/impressum.html  # Impressum-Shell: head-impressum/nav/impressum-content/footer
templates/datenschutz.html # Datenschutz-Shell: head-datenschutz/nav/privacy-content/footer
templates/partials/  # head{,-impressum,-datenschutz} (mit `<script type="module" src="/src/main.ts">`), nav, hero, intro, supporters, problem, solution (loesung), benefits (vorteile), process (funktionsweise), milestones, vision, team, contact, footer, impressum-content, privacy-content — Styling ausschließlich via inline Tailwind-Utilities (keine semantischen Komponentenklassen, kein @apply, kein Custom-CSS)
src/site.js          # Menü-/htmx-Verhalten via data-Attribute ([data-nav-links], [data-status]), kein Tracking (kein Legal-Escape mehr); Hero-Double-Buffer: 2×[data-hero-video] (aktiv sichtbar/Standby preloadet NUR nächsten Clip 1→2→3→4→1, Übergang ~1 s vor Ende nach echtem Frame (rVFC+Fallback), Standby oben 0→1/~800 ms über opakem Alt, dann Alt-Reset als nächster Preload; Bild nur Initial/Totalausfall/Reduced-Motion; Fehler begrenzt skippen ohne Aufdecken, Pause/Tab global ohne Auto-Resume)
scripts/dev.ts       # koordinierter Dev-Start (Bun-APIs :3001 + Vite :3000, htmx-Copy falls nötig, clean Shutdown)
scripts/migrate-html.mjs # einmalige Klassen-Migration (Alt -> Utilities), nicht im Build nötig
public/img/          # hero.webp, a2g-logo-green.jpg, icon_1a–2c, Team, og-image, icons
public/fonts/        # Open Sans woff2 (latin/ext/italic/sub), lokal
package.json         # bun dev/build/start/preview (+ dev:api/dev:vite) + gepinnt: tailwindcss, @tailwindcss/vite, vite, htmx.org
bun.lock             # lockfile
```

## Templates bearbeiten

- Seiteninhalt liegt in `templates/partials/*.html`, Shells in
  `templates/*.html` (`<!-- @include <name> -->`, nur im
  `MANIFEST` in `src/render.ts` bekannte lokale Dateien). `templates/`
  liegt außerhalb von `public/` und wird nie direkt ausgeliefert.
- In `bun run dev` assembliert das Vite-Plugin (`vite.config.ts`,
  gleiche `renderShell`-Funktion) `/`, `/impressum`, `/datenschutz`
  (inkl. `.html`-Varianten und Clean-URLs) pro Request neu aus den
  Dateien; Styling kompiliert `@tailwindcss/vite` dabei automatisch
  (templates/ werden automatisch gescannt, kein `@source`-Eintrag nötig).
  Partial-Änderungen — auch neue, zuvor ungenutzte Utilities — sind ohne
  Build/Neustart sichtbar (Vite-Reload + Tailwind-Rescan).
- Legal-Seiten teilen `nav` (Root-Anker `/#loesung` …,
  Wortmarke `/#top`), `footer` und eigene `head-*` (Titel/Canonical/OG je
  Route) plus `impressum-content`/`privacy-content` (eigene `h1`,
  „Zur Startseite“-Link, keine `:target`-Overlays/Modal-Close-Links).
  Footer- und Einwilligungs-Links zeigen auf `/impressum` bzw.
  `/datenschutz`.
- Utilities: ausschließlich eingebaute Tailwind-Utilities (Grün =
  `green-700`/`green-800`/`green-300`/`green-50`, Neutral =
  `neutral-950`/`neutral-800`/`neutral-100`/`neutral-200`, Fehler =
  `red-700`, Serifen = builtin `font-serif`, Sans = builtin `font-sans`
  + Inline-Arbitrary-Utility); keine `@theme`-Tokens, keine
  semantischen Komponentenklassen, kein `@apply`. Layout-Arbitrary-Werte
  (u. a. `lg:w-[50vw]`) bleiben erhalten.
- Tailwind-Quellen: `@tailwindcss/vite` erkennt `templates/`
  automatisch (automatische Source-Erkennung, per Dev-Edit-Test und
  Build-Output verifiziert: neue Klasse in Partial → erscheint im
  Vite-CSS ohne Build). Kein `@source`-Eintrag, kein Custom-CSS.

## QA (15.10.2026, lokal Port 3000, Redesign)

- HTTP: `/`, `/index.html`, `/impressum`, `/datenschutz`
  (`GET`+`HEAD` → `200` text/html; Home ohne Legal-Langtexte,
  Legal-Texte nur auf eigenen Routen mit eigener `h1`/Meta),
  `/styles.css` (text/css), `/site.js`
  (text/javascript), `/assets/htmx.min.js`, `favicon.ico`,
  `hero.webp`, Team-Bild, Fonts → `200` mit korrekter MIME;
  `/nonexistent`, `/../server.ts` → `404`. Keine Inline-`style=`-Attribute
  mehr im HTML; keine Remote-Requests (nur localhost).
- Browser (T3-Preview, eigener Tab): Desktop 1280 — schwebende Nav
  (48/24/68 px, Radius 18), Logo-Wortmarke links, Title-Case-Nav,
  grüne CTA mit Pfeil; Hero volles Viewport-Foto mit Overlay,
  H1 x48/776 px Georgia, Sub + zwei Pill-CTAs; Sektionen als
  800-px-Editorialspalten (Problem/Lösung als Zeilen mit Icons +
  Quellen, Vorteile als Serif-Kennzahlen auf Blassgrün (`bg-green-50`), Funktion als
  01–03-Sequenz, Rechenmodell-Kacheln, Meilensteine-Timeline,
  Vision, Team mit gerundetem Bildmodul, Kontakt + Newsletter-Card,
  dunkler Footer). Keine Konsoleneinträge.
- `/impressum`/`/datenschutz` sind eigene Dokumente (geteilte
  Nav mit Root-Ankern `/#…`/Wortmarke `/#top`, `h1`, „Zur Startseite“-Link,
  keine `:target`-Overlays/Modal-Close-Links/Escape-Handler mehr).
  Kontakt- und
  Newsletter-Formulare per htmx mit ehrlichem Demo-Status;
  Validierungs- (422) und Honeypot-Fälle geprüft.
- Mobil 390 px: Burger sichtbar, Nav per Toggle öffenbar (Menü
  schließt per Link/Escape), Hero-Typo skaliert (44 px),
  einspaltige Layouts, kein horizontaler Overflow
  (`scrollWidth == innerWidth` bei 390 und 1280).

## QA (15.10.2026, Vite-Build + 50vw-Layout, Ports 3457/3459)

- `bun install --frozen-lockfile` ok; `bun run build` warnungsfrei:
  `dist/index.html` (50,5 kB), `dist/impressum.html`, `dist/datenschutz.html`,
  `assets/main-[hash].css` (34,9 kB), `assets/main-[hash].js` (10,3 kB),
  `assets/htmx.min.js` (lokal, kein node_modules-Pfad), `fonts/` (16),
  `img/` (inkl. `logo.svg`), `video/` (4 Clips), `favicon.ico`. Kein
  `/styles.css`-, kein unversioniertes `/site.js`-, kein
  `node_modules`-Verweis in `dist/*.html`.
- Prod (`NODE_ENV=production`, Temp-Port): `/`, `/index.html`, `/impressum`,
  `/impressum.html`, `/datenschutz`, `/datenschutz.html` (GET+HEAD → 200);
  gehashte CSS/JS, htmx, Fonts, Bilder, Favicon → 200 mit korrekter MIME;
  Video-Range → 206; `/nonexistent`, `/../server.ts`, `/site.js` → 404;
  `POST /api/kontakt` (200/422/400-Honeypot) und `/api/newsletter`
  (200/422) sowie `GET /api/*` (405) unverändert. `start` ohne `dist/`
  bricht lesbar ab (Exit 1). Dev (Temp-Port): `/`, `/site.js` (aus `src/`),
  `/styles.css`, `/assets/htmx.min.js` → 200; sichtbarer Text dev≡prod
  (nur beabsichtigte Asset-Rewrites differieren).
- Layout (Klassen-Audit; kein Headless-Browser in dieser Umgebung):
  Nav außen `lg:w-[50vw] + lg:left-1/2 + lg:-translate-x-1/2` (nav),
  mobil `left/right-3` (= 100 % − 24 px), Tablet `md:left/right-5`;
  Inline-Links erst `lg:` (darunter reicht die Navbreite nur für
  Logo + Hamburger), Menü darunter per Checkbox/Escape wie bisher.
  Hero-Text `mx-auto w-[calc(100%-1.5rem)] md:w-[calc(100%-2.5rem)]
  lg:w-[50vw] text-left` ohne `max-w`/Außen-Padding; Video/Gradient/z-Order/
  Toggle unverändert (2× `data-hero-video`, Gradient `z-[3]`, Content `z-10`).
  Rechenmaß: 1280 → Nav/Hero 640 px ab x=320; 1440 → 720 ab x=360.
- Nebenbei gefixt (Build-Warnungen, Verhalten): Burger-Icon
  `before/after:content-[""]` → `['']` (doppeltes `"` schloss das
  `class`-Attribut — Balken waren nie sichtbar), Footer `…"underline"href=…`
  → Leerzeichen ergänzt.

## QA (15.10.2026, Single-Pipeline: Vite :3000 + Bun-APIs :3001)

- `bun remove @tailwindcss/cli` + `bun install` ok; `src/tailwind.css` und
  `public/styles.css` gelöscht; kein `build:css`/`dev:css`/`dev:server`-Skript
  mehr, kein `/styles.css`- oder `/site.js`-Verweis in `templates/`,
  `src/`, `server.ts`, `vite.config.ts`.
- `bun run build` warnungsfrei: `dist/index.html`, `dist/impressum.html`,
  `dist/datenschutz.html`, `assets/main-[hash].{css,js}`,
  `assets/htmx.min.js`, `fonts/`, `img/`, `video/`, `favicon.ico`. Kein
  `/styles.css`-Verweis in `dist/*.html`.
- Prod (`NODE_ENV=production`, Temp-Port 3457): `/`, `/index.html`,
  `/impressum`, `/impressum.html`, `/datenschutz`, `/datenschutz.html`
  (GET+HEAD → 200); gehashte CSS/JS, htmx → 200; Video-Range → 206;
  `/nonexistent`, `/../server.ts`, `/site.js` → 404;
  `POST /api/kontakt` (200) und `GET /api/*` (405) unverändert.
- Dev (`bun run dev` = ein Befehl: Vite `0.0.0.0:3000` + Bun-APIs
  `127.0.0.1:3001`): `/`, `/index.html`, `/impressum` (Clean-URL),
  `/impressum.html`, `/datenschutz` (Clean-URL), `/datenschutz.html`
  → 200 mit `<script type="module" src="/src/main.ts">` (kein
  `/styles.css`, kein `/site.js`); `/api/*` via Vite-Proxy ans Backend
  (200); Backend direkt `/` → 404 mit Vite-Hinweis (API-only per Design).
- Live-Edit-Test ohne Build/Neustart (gleiche PIDs, danach Partial
  restauriert, keine Marker-Reste): Hidden-Marker mit einer zuvor
  ungenutzten Test-Utility (fuchsia-Farbklasse) in
  `templates/partials/intro.html` → sofort im Vite-HTML UND als Regel im
  Vite-Dev-CSS; Wechsel auf eine zweite ungenutzte Test-Utility
  (amber-Farbklasse) → deren Regel erscheint automatisch. Hinweis: Die
  Klassennamen stehen hier absichtlich nicht wörtlich — Tailwind v4
  scannt automatisch alle Projektdateien (auch diese README), sodass
  wörtlich genannte Utilities ins CSS kompiliert würden. `bun run build`
  purgt ungenutzte Klassen exakt (0 Treffer im `dist`-CSS verifiziert).
- Einschränkung: Im Vite-Dev bleibt eine entfernte Test-Klasse als
  inaktive Regel im speicher-Rescan-CSS sichtbar (Upstream-Verhalten von
  `@tailwindcss/vite`, kein ausgeliefertes Markup betroffen); der
  Produktions-Build purgt exakt auf genutzte Klassen.
- Nach den Tests: alle eigenen PIDs gekillt, `:3000`/`:3001` gestoppt;
  fremder Node-Prozess auf `:4173` unangetastet.

## Illustrated tour (`/function`)

The German `/function` and English `/en/how-it-works` routes follow the shared storyboard and
uses the original `public/img/logo.svg`. It is part of both Vite development
and the Bun production server; `/function.html` and `/function/` redirect to
its canonical URL. The shared navigation and home process section link to it.

- Player markup: `templates/partials/function-tour.html`; the detailed SVG
  world and shared character symbols: `templates/partials/function-illustration.html`.
- Scoped layout: `src/function-tour.css` (included in the shared stylesheet
  so the production poster and explanation also work without JavaScript).
- Progressive enhancement: `src/function-tour.js`, exported
  `initFunctionTour(root)` with a cleanup function, and the single
  `TOUR_SCENES` manifest. `src/main.ts` loads the GSAP chunk only for the tour.
- Exact dependency: GSAP `3.14.2`, with its bundled ScrollTrigger plugin.

The source storyboard is expanded to 60 seconds: order 0–6, delivery 6–14,
installation 14–22, the biological process 22–39, touchscreen 39–46,
fault detection 46–51, maintenance 51–57 and the closing view 57–60.
Capture, regeneration, water/nutrient inputs, culture growth and harvesting
are separate phases. Finite cloud, bubble, wheel, hand and liquid animations
belong to the same reversible timeline. The supplied logo remains intact.

“Animation Begin” deliberately creates a four-viewport scroll runway.
A linear scroll driver maps real document scrolling to one 60-second GSAP
master timeline. Pause, wheel/touch/scrollbar intervention and navigation keys
allow manual forward or reverse scrubbing. Resume uses the remaining logical
duration. Escape/Exit restores the poster; Skip/Continue focuses the following
explanation. Completion preserves the closing farm view in normal flow.
Replay rebuilds the tour. A hidden tab or viewport change pauses playback.
Reduced motion replaces automatic scrolling with Previous/Next still scenes.
The illustrated workflow makes no order, telemetry or notification requests.
During playback, the illustration spans the full viewport width. Supporting
copy and the machine-monitoring notice sit in the explanation below the
canvas; the player contains the artwork, progress indicator and controls.

Run `bun run build` and `bun test tests/seo.test.ts` to check production routes,
redirects, language/metadata, the static explanation and existing pages/APIs.
For the playback regression checks, open `/function` or `/en/how-it-works` on the Vite dev server
and run `await (await import('/tests/function-tour.browser.js')).runFunctionTourChecks()`
in its browser context. The checks cover real-time duration, all eight scenes,
manual reverse scrolling, replay cleanup, pause/resume, hidden-tab behaviour,
Escape/Skip focus and an isolated reduced-motion instance. They take about
63 seconds; browser automation callers with shorter timeouts can store the
promise result and read it after completion.
