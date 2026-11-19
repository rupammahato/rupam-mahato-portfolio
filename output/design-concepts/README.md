# Portfolio design concepts

These are exploratory previews for the agreed hybrid engineering-and-product direction. The production website source has not been changed.

## Static concepts

| Image | Direction |
| --- | --- |
| [01-warm-editorial.png](./01-warm-editorial.png) | Ivory, serif headlines, fine architecture diagrams, featured-project storytelling |
| [02-dark-technical.png](./02-dark-technical.png) | Dark surfaces, orange actions, clear technical diagrams and visible outcomes |
| [03-bold-typographic.png](./03-bold-typographic.png) | Cobalt, oversized typography, asymmetric composition and mechanism/outcome pairs |

All three were generated with the built-in `image_gen` tool and then edited to correct technology labels, experience dates and summaries. The full initial prompts and factual-correction prompt are in [PROMPTS.md](./PROMPTS.md). These are raster design concepts; conceptual diagrams and shortened copy are illustrative rather than a replacement for the site's approved text.

## Moving concept

`living-systems.html` is an in-conversation interactive portfolio preview. It is an HTML fragment for the conversation renderer, not a new Next.js route or a standalone exported website.

The hero contains a projected 3D model drawn from geometric coordinates, with three stories:

- **Traffic routing:** a consistent-hashing ring, server nodes and animated request markers.
- **AI knowledge:** document markers travel in separate tenant lanes toward separate index stacks.
- **Product flow:** a signal travels through conceptual need, build, ship and learn stages.

Drag changes the viewing angle; the story buttons change the geometry; pause/play controls movement. The preview respects the initial reduced-motion preference and suspends animation when out of view or when the document is hidden. Optional host design controls adjust motion pace, perspective and signal color. No live backend metrics are simulated: all moving signals are explicitly illustrative, while the four fixed proof metrics retain their real project context.

This intentionally explores a meaningful replacement for a generic decorative sphere. A final implementation can use the existing React Three Fiber/Three.js stack for richer lighting and materials after a design direction is chosen.

## References consulted

- [Lusion: Devin AI](https://lusion.co/projects/devin_ai/) describes using animation and interactive design to make a complex AI product clear and approachable. This informed the proposal to make technical architecture understandable through motion.
- [Rauno Freiberg: Designing Depth](https://rauno.me/craft/depth) discusses layered composition and deliberate motion choreography. This informed the depth and sequencing direction.
- [Bruno Simon's portfolio](https://bruno-simon.com/) demonstrates an interaction-led 3D portfolio and documents its use of Three.js. This informed the invitation to interact with a model, while the subject matter here comes from Rupam's own projects.

These are original concepts. No third-party code, assets, or complete layouts were copied.

## Validation

The generated images were inspected visually. The moving preview's JavaScript was parsed and exercised against a lightweight DOM/canvas harness: all three scene selections, pause/play, animation frame scheduling, drag handling and finite numeric geometry passed. Its fragment is about 22 KB and uses no external runtime resources. Browser rendering has not been inspected because browser automation was unavailable during the preceding project review; those programmatic checks do not constitute browser visual QA.
