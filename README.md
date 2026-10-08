# Air2Growth website redesign

A responsive German website with seven static pages, implemented with plain HTML, CSS, and JavaScript. Vite is used only for local development and production asset bundling; there is no UI framework or runtime dependency.

## Run on the cloud machine over Tailscale

```sh
npm install
npm run dev
```

The scripts detect the machine’s current Tailscale IPv4 address and bind to that interface. Open the printed URL from a device on the same tailnet. Development uses port 5173; preview uses port 4173. They exit if the port is already occupied.

For loopback-only use, run `npm run dev:local` or `npm run preview:local`.

## Production build

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. The site expects deployment at the domain root.

## Files

- `index.html`: concise home page and links to the dedicated pages.
- `produkt.html`: product, prototype, operating context, and pilot preparation.
- `technologie.html`: six-step process, inputs, and development details.
- `vorteile.html`: pricing, running-cost assumptions, and use cases.
- `team.html`: founders, responsibilities, awards, and working context.
- `investoren.html`: roadmap, business model, and pitch-deck inquiry.
- `kontakt.html`: visible inquiry form and expanded questions and answers.
- `vite.config.js`: all seven HTML entry points for the production build.
- `content/`: editorial source fragments for the added details; the live copy is in the page HTML files.
- `src/style.css`: responsive layouts, design tokens, local fonts, reduced-motion support.
- `src/main.js`: mobile navigation, keyboard-accessible process tabs, contact handling, and shared interaction setup.
- `src/scroll.js` / `src/scroll.css`: native scroll progress, pinned visual stories, CAD rotation, animation controls, and reduced-motion fallbacks.
- `src/visual-pages.css`: cost figures, timelines, and concise summaries on the secondary pages.
- `src/graphics.css` and `src/graphics.js`: field contours, the interactive algae lens, and module architecture.
- `src/expressive-pages.css`: cultivation, team, roadmap and contact illustrations.
- `src/mobile.css`: readable phone diagrams, compact graphics, form sizing and short-viewport navigation.
- `public/`: locally served images, favicon, and licensed fonts.
- `scripts/serve.mjs`: Tailscale address discovery and server launcher.
- `DESIGN.md`: source analysis and design decisions.
- `src/index.ts`: preserved Bun starter entry (`bun run src/index.ts`).
- `docs/reference/studio-north.html`: preserved previous sample page, moved out of the active entry points.

## Interactions and content

- Desktop scrolling advances the homepage carbon cycle, rotates the current full-machine CAD concept, and selects the six technology stages. Chapter controls and the model slider also work directly.
- Small/short screens and reduced-motion preferences use ordinary document flow with all story chapters visible. An animation switch remembers an explicit choice locally. Native wheel, touch, and keyboard scrolling remain available.
- Technology tabs support arrows, Home, and End.
- Product information follows the newer user-supplied `sample.html`: V3 in field testing, TRL 4, 7 kg fertilizer per week per module, and planned onboarding/launch dates.
- Pricing is summarized as €3,000 hardware and €50 consumables every two months per module. The calculator was removed in line with the sample’s feedback. Figures remain model values, not performance guarantees or quotes.
- Pilot and pitch-deck links navigate to the contact page and preselect the inquiry topic from the URL. Team names link to the current LinkedIn profiles.
- FAQ uses native HTML disclosure elements.
- The contact form validates required fields and prepares an email in the visitor's mail client. It does not send messages itself and has no backend. A direct email link is provided.
- The imprint and privacy links open the original live website. They must be replaced with deployment-specific documents before this version is published as the production site.
- No tracking scripts or third-party font requests are included.

## Source and asset credits

Source website: https://air2growth.de (fetched 8 October 2026; redirects to air2growth.com). The original redesign was based on that page. The user-supplied `sample.html` is the newer authority for product progress, process, roles, awards, roadmap, and pricing.

Original plant image (`public/images/field.webp`) and team photograph (`public/images/team.webp`) were downloaded from the source website. The plant image is retained as an available brand asset. Open Sans fonts were downloaded from the source website; their license is included in `public/fonts/LICENSE-OpenSans.txt`.

The hero landscape is an Unsplash photograph downloaded from https://images.unsplash.com/photo-1500382017468-9049fed747ef and served locally.

The leaf mark, carbon illustration, and process diagram use inline SVG and CSS authored for this redesign.

The V3 prototype CAD view (`public/images/prototype-v3.webp`) was extracted from the embedded image in `sample.html` without altering the supplied file. It is labeled as a CAD view, not a photograph of the field trial.

The original sample rotation frames in `public/images/prototype-frames/` are retained as reference assets. The product page now uses 36 views rendered from `../air2growth/cad/machine/Air2Growth-machine.FCStd`, served from `public/images/machine-frames/` and loaded near the product scene. This newer assembly is labeled as a CAD concept; the separate V3 field-test claim remains sourced from the sample. Rendering reads the native CAD sources without changing or saving them.

Render provenance, source hashes, and frame hashes are recorded in `docs/reference/current-machine-render.json`.
