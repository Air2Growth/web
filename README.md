# Air2Growth — lokale Website-Nachbildung (Bun + htmx)

 originalgetreue lokale Nachbildung der öffentlichen Website
 <https://air2growth.com> — statisch gehostet mit `Bun.serve`, Styling per
 lokalem Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/cli`, gepinnt).
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
- Styling-Quelle in `src/styles.css` (`@import "tailwindcss"`, `@theme` grün, `@source` index/server, nur Font-Faces/Hero/htmx/Reduced-Motion als Custom-CSS), kompiliert nach `public/styles.css`, Verhalten in `public/site.js`
  (mobiles Menü, Escape für Menü/Rechtstexte, htmx-Fehleranzeige).
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
bun install
bun run build   # Tailwind kompilieren: src/styles.css -> public/styles.css
```

## Run

```sh
bun run dev       # koordiniert: bun --hot server.ts + Tailwind --watch (scripts/dev.ts, sauberes SIGINT/SIGTERM-Shutdown)
bun run dev:server  # nur Server ohne Watcher
bun run dev:css     # nur Tailwind-Watcher
bun run start     # baut CSS (prestart/build) und startet bun server.ts
```

Server bindet `0.0.0.0:3000` (Override via `PORT`):

```sh
PORT=4000 bun run start
```

Dann öffnen: <http://localhost:3000>.

Der bereits laufende `bun --hot`-Dev-Server lädt `server.ts`-Änderungen
automatisch nach (kein Neustart, kein `pkill` nötig). `public/styles.css`
ist generiert und wird per `prestart`/`start` auf Clean-Checkouts neu gebaut
(`bun run build:css`); Quelle bleibt `src/styles.css`.

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
server.ts            # Bun.serve: HTML-Assemblierung (/, /impressum, /datenschutz) + statische Dateien + /api/kontakt + /api/newsletter (Fragmente mit Tailwind-Utilities, von Tailwind gescannt)
templates/index.html      # Home-Shell (klein): DOCTYPE/html/body/main + <!-- @include ... -->-Marker
templates/impressum.html  # Impressum-Shell: head-impressum/nav-legal/impressum-content/footer
templates/datenschutz.html # Datenschutz-Shell: head-datenschutz/nav-legal/privacy-content/footer
templates/partials/  # head{,-impressum,-datenschutz}, nav{,-legal}, hero, intro, problem, solution (loesung), benefits (vorteile), process (funktionsweise), economics (rechenmodell), milestones, vision, team, contact, footer, impressum-content, privacy-content — Styling ausschließlich via inline Tailwind-Utilities (keine semantischen Komponentenklassen, kein @apply)
src/styles.css       # Tailwind-Quelle: @import tailwindcss, @theme grün (#287a3b/#1f6030/#9fcea8/#edf6ee), @source templates/server, nur @font-face/.htmx-indicator/Reduced-Motion custom
public/styles.css    # GENERIERT via bun run build:css (Tailwind v4.1.14), wird per prestart/start neu gebaut
public/site.js       # Menü-/htmx-Verhalten via data-Attribute ([data-nav-links], [data-status]), kein Tracking (kein Legal-Escape mehr); Hero-Double-Buffer: 2×[data-hero-video] (aktiv sichtbar/Standby preloadet NUR nächsten Clip 1→2→3→4→1, Übergang ~1 s vor Ende nach echtem Frame (rVFC+Fallback), Standby oben 0→1/~800 ms über opakem Alt, dann Alt-Reset als nächster Preload; Bild nur Initial/Totalausfall/Reduced-Motion; Fehler begrenzt skippen ohne Aufdecken, Pause/Tab global ohne Auto-Resume)
scripts/dev.ts       # koordinierter Dev-Watcher (Server + Tailwind --watch, clean Shutdown)
scripts/migrate-html.mjs # einmalige Klassen-Migration (Alt -> Utilities), nicht im Build nötig
public/img/          # hero.webp, a2g-logo-green.jpg, icon_1a–2c, Team, og-image, icons
public/fonts/        # Open Sans woff2 (latin/ext/italic/sub), lokal
package.json         # bun dev/build/start + gepinnt: tailwindcss, @tailwindcss/cli, htmx.org
bun.lock             # lockfile
```

## Templates bearbeiten

- Seiteninhalt liegt in `templates/partials/*.html`, Shells in
  `templates/*.html` (`<!-- @include <name> -->`, nur im
  `MANIFEST` in `server.ts` bekannte lokale Dateien). `templates/`
  liegt außerhalb von `public/` und wird nie direkt ausgeliefert.
- `server.ts` assembliert `/`, `/impressum`, `/datenschutz`
  (inkl. `.html`-Varianten, `GET`+`HEAD`) serverseitig pro Request
  neu aus den Dateien — kein Client-Fetch, keine
  Templating-Abhängigkeit. Partial-Änderungen sind ohne Server-Neustart
  sichtbar (zusätzlich lädt `bun --hot` `server.ts`-Änderungen nach).
- Legal-Seiten teilen `nav-legal` (Root-Anker `/#problem` …,
  Wortmarke `/`), `footer` und eigene `head-*` (Titel/Canonical/OG je
  Route) plus `impressum-content`/`privacy-content` (eigene `h1`,
  „Zur Startseite“-Link, keine `:target`-Overlays/Modal-Close-Links).
  Footer- und Einwilligungs-Links zeigen auf `/impressum` bzw.
  `/datenschutz`.
- Tailwind scannt `templates/**/*.html` rekursiv plus `server.ts`
  (`@source` in `src/styles.css`); der `--watch`-Watcher aus
  `scripts/dev.ts` erfasst Partial-Änderungen. Nach Template-Änderung
  mit neuem Utility ggf. `bun run build` prüfen.

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
  Quellen, Vorteile als Serif-Kennzahlen auf Blassgrün (#edf6ee), Funktion als
  01–03-Sequenz, Rechenmodell-Kacheln, Meilensteine-Timeline,
  Vision, Team mit gerundetem Bildmodul, Kontakt + Newsletter-Card,
  dunkler Footer). Keine Konsoleneinträge.
- `/impressum`/`/datenschutz` sind eigene Dokumente (geteilte
  Nav mit Root-Ankern `/#…`/Wortmarke `/`, `h1`, „Zur Startseite“-Link,
  keine `:target`-Overlays/Modal-Close-Links/Escape-Handler mehr).
  Kontakt- und
  Newsletter-Formulare per htmx mit ehrlichem Demo-Status;
  Validierungs- (422) und Honeypot-Fälle geprüft.
- Mobil 390 px: Burger sichtbar, Nav per Toggle öffenbar (Menü
  schließt per Link/Escape), Hero-Typo skaliert (44 px),
  einspaltige Layouts, kein horizontaler Overflow
  (`scrollWidth == innerWidth` bei 390 und 1280).
