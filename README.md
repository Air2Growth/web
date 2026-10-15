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

## Gestaltung (Redesign 15.10.2026)

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
  `./index.html`, `./impressum.html`, `./datenschutz.html`
  (Root-Proxies) aus `templates/` (Renderer: `src/render.ts`) und macht
  relative `img/`-/`fonts/`-/`favicon`-/`data-playlist`-Pfade
  root-absolut. Die Template-Heads referenzieren kanonisch
  `<script type="module" src="/src/main.ts">` (Tailwind-Paket-Stylesheet
  + `src/site.js`, gebündelt und gehasht) — Dev und Build nutzen
  dieselbe Quelle, kein Rewrite, kein Duplikat. Ergebnis `dist/`: 3 volle
  HTML + `assets/main-[hash].{css,js}`, `assets/htmx.min.js`, `fonts/`,
  `img/` (inkl. `logo.svg`), `video/`, `favicon.ico`.
- **Produktion:** `bun run start` (`NODE_ENV=production`, `0.0.0.0:3000`,
  `PORT`-Override) serviert `dist/` (Seiten beim Start einmal gelesen,
  kein Template-Zugriff zur Laufzeit; Aliase `/impressum`, `/datenschutz`,
  `.html`-Varianten; Videos mit Range/`206`; APIs `/api/kontakt`,
  `/api/newsletter` unverändert). Fehlt `dist/`, bricht `start` mit
  „run `bun run build` first“ ab (Exit 1).
- **Statisches Hosting (Anbieter-neutral):** `dist/` enthält
  `impressum.html`/`datenschutz.html` im Root — Clean-URLs (`/impressum`)
  funktionieren auf Hosts mit Clean-URL-Support, sonst die `.html`-Pfade.
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
templates/partials/  # head{,-impressum,-datenschutz} (mit `<script type="module" src="/src/main.ts">`), nav, hero, intro, supporters, problem, solution (loesung), benefits (vorteile), process (funktionsweise), economics (rechenmodell), milestones, vision, team, contact, footer, impressum-content, privacy-content — Styling ausschließlich via inline Tailwind-Utilities (keine semantischen Komponentenklassen, kein @apply, kein Custom-CSS)
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
