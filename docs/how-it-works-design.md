# How it works: grown here, used here

## Brief and audience

Redesign `/en/how-it-works` and its German counterpart `/function` for growers
and potential partners. Put the intended farm benefits ahead of the science:
local fertiliser production, more control over supply, and potentially fewer
purchased inputs. Keep development status explicit and retain the guided tour.

The user clarified that the animation itself needs redesign and greater depth.
The illustrated sequence is therefore the main delivery, with the surrounding
page supporting it. Inspect the earlier Git versions of the SVG and timeline
before reworking their visual layers.

Cultivation uses integrated UV lights, as clarified by the user. The reactor,
biological close-up, process icon, and written explanation must show that
integrated light source rather than sunlight entering the culture.

## Design tokens

- Forest `#263E2D`: text, controls, and the tour theatre.
- Leaf `#45714C`: biological material and primary actions.
- Sage `#A7B89C`: greenhouse structure and secondary illustration details.
- Dew `#EEF3EC`: the living-machine illustration ground.
- Chalk `#FCFDFC`: the reading surface.
- UV `#8B81D4`: the integrated cultivation lights, used sparingly.

Use a locally hosted Bricolage Grotesque display face for the short, large hero
headline and section headings. Keep the site's local Open Sans for readable
body copy, navigation, and controls. Prefer sentence case and left alignment.

## Layout options and review

The first option was a large film player with explanatory cards underneath.
That repeats the current page's structure and makes watching the animation a
prerequisite for understanding the grower benefit. Reject it.

Choose a living-machine field guide: one oversized, custom vector greenhouse
scene pairs with a compact, grower-focused headline. A continuous curved pipe
connects captured CO₂, microalgae, and a plant. The greenhouse and culture are
the memorable visual; the surrounding content remains quiet.

```text
┌──────────────── shared navigation ────────────────┐
│ Breadcrumb                                       │
│ Grown here.       ╭── greenhouse / air ───╮        │
│ Used here.        │ algae → culture → plant│        │
│ Benefit + CTA    ╰──── connected loop ────╯        │
├──── on-site production / supply / purchased inputs┤
├──────────── illustrated tour theatre ─────────────┤
│ Start the animation / dimensional SVG world       │
├──────────────────────────────────────────────────┤
│ From air to fertiliser     01 capture CO₂          │
│                           02 grow microalgae      │
│                           03 prepare fertiliser   │
├──────────── principle + operation details ────────┤
│ Could this fit your greenhouse?    Contact        │
└──────────────── shared footer ────────────────────┘
```

On mobile, stack copy before the illustration, then benefits and process
steps. Preserve comfortable text sizes and keep the machine illustration
legible. Avoid decorative cards, all-caps labels, artificial metrics, and
unprompted animation. The optional guided tour remains the motion centerpiece.

## Animation depth

Read-only history inspection covered `34a9900`, `ecc6bcc`, and `8c33b82`.
The first two contain the earlier 60-second storyboard; the current version
uses the shorter biological sequence. Use that history to understand the SVG
groups and reversible camera setup while retaining the current biological
wording and timing.

Use a dimensional greenhouse scene with foreground, growing area, structure,
and distant landscape. Give machinery visible side faces, glass reflections,
contact shadows, and connected pipework. Show CO₂ capture and release clearly;
use a biological close-up during growth so the change is more than a tank
changing colour. Show UV fixtures integrated into the cultivation system.
Tie every new motion to the reversible master timeline, with
meaningful still frames for reduced motion. Keep the final fertiliser-to-plant
connection legible and retain the 38-second timing and eight-scene sequence.

## Implementation boundaries

Keep the shared navigation, footer, homepage video system, routes, metadata,
existing tour timing, keyboard controls, and reduced-motion still scenes.
Translate new source copy through the existing German/English catalogs.
Preserve the honest distinction between a proposed fertiliser system and a
commercially available product. Use native vector artwork for the diagram.

## Verification

Build with `bun run build`, run the existing Bun test suites, inspect desktop
and mobile in T3 preview, and run `runFunctionTourChecks()` in the browser.
Create a scoped EGM component contract grounded in a fresh read-only scout.
