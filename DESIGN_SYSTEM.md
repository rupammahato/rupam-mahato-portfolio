# Portfolio design foundation

Phase 1, established 10 November 2026.

## Direction and scope

Use a dark editorial layout for a portfolio that combines engineering depth with product ownership. The landing section will contain one original interactive 3D model. The remaining sections will use readable text, static diagrams and restrained interaction feedback.

The visual hierarchy should expose both the mechanism and its result. Preserve existing factual content, roles, project selection and links during design implementation. Do not silently combine claims from the two résumé versions.

Phase 1 establishes the visual rules and implements the CSS foundation. Phase 2 creates the original React components and 3D model, available together at `/design-preview`. Phase 3 integrates the header, hero and proof strip on the homepage. Lower sections retain their existing layouts until their scheduled phases; the old Stack sphere is retired so the hero is the only WebGL scene.

## Source of truth

`app/design-tokens.css` owns shared design values. It is imported once by `app/globals.css`, which is already imported by the root layout. Existing CSS custom-property names are retained so current components continue to work.

Use these tokens in new component styles. A component may define local geometry, but it should not invent another palette, type scale or transition curve. Do not duplicate the whole token set in a JavaScript theme object. Three.js materials that require numeric colors should resolve the relevant computed CSS color when the hero is built.

## Color and surface roles

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0b0c0e` | Continuous page background |
| `--panel` | `#111316` | Modest grouping surface where needed |
| `--panel-2` | `#171a1e` | Elevated content, including search |
| `--fg` | `#eceae4` | Headings and important content |
| `--fg-2` | `#a3a8b1` | Body descriptions and supporting copy |
| `--fg-3` | `#9299a3` | Dates, labels and secondary metadata |
| `--accent` | `#ff5a2c` | Primary action, emphasized outcome, active signal and focus ring |
| `--accent-fg` | `var(--bg)` | Text on solid orange |
| `--diagram-accent` | `#6f8cff` | Technical structures and diagram nodes |
| `--ok` | `#4ade80` | Actual availability/status indications |
| `--line` | White at 12% opacity | Quiet dividers and container edges |
| `--line-strong` | White at 24% opacity | Controls and stronger boundaries |

Keep orange selective. Use dark text on an orange-filled action. Technical blue belongs in illustrations rather than competing primary buttons. Status colors must have an accompanying text label.

All sections share the same background family. Use panels to group related information, rather than assigning a different background or visual theme to each section. The hero must blend into the page without a full-screen canvas covering later content.

Text colors should reach at least 4.5:1 contrast on their actual surface. Subtle divider colors are decorative; if a control needs a visible boundary to be recognizable, use a higher-contrast treatment. Check translucent overlays against the composited background during component review.

## Typography

Keep the existing Geist Sans and Geist Mono font loading. Sans is the main reading face; mono is reserved for short labels, dates and technical annotations. No additional font download is required.

| Role | Token | Size at the default 16px root |
| --- | --- | --- |
| Main headline | `--text-display` | Fluid 44–96px |
| Section heading | `--text-heading` | Fluid 32–60px |
| Project or component title | `--text-title` | Fluid 20–24px |
| Introduction | `--text-lead` | Fluid 17–20px |
| Larger body copy | `--text-lg` | 18px |
| Main body | `--text-base` | 16px |
| Compact body/action | `--text-sm` | 14px |
| Metadata | `--text-xs` | 12px |

Use rem-based limits with a fluid middle value so the text responds to viewport width and user font settings. Body leading is 1.65. Main heading leading is 1.08 with tracking of -0.045em. Component titles use a less compressed line height of 1.2.

Use weight 600 for headings and primary actions, 500 for metadata, and 400 for reading copy. Keep essential prose at a comfortable reading size; do not force full descriptions into the metadata style to fit a layout. Limit long copy to approximately `--measure-copy` (65 characters per line), or less in a narrow column.

There is one H1. Section headings follow one scale, even when their layouts differ. Project titles and company names remain below the section heading level. Orange emphasis should identify a meaningful word or outcome, not appear in every sentence.

## Layout and spacing

| Rule | Token/value |
| --- | --- |
| Maximum page content width | `--content-width`: 81rem / 1296px |
| Responsive side gutters | `--pad`: 1.25rem to 4.5rem / 20–72px |
| Section vertical padding | `--section-space`: 4.5rem to 7rem / 72–112px |
| Fixed header height | `--header-height`: 4.25rem / 68px |
| Extra anchor clearance | `--anchor-gap`: 1.5rem / 24px |
| Long-copy measure | `--measure-copy`: 65ch |

The shared spacing scale is 4, 8, 12, 16, 24, 32, 48 and 64px at the default root size, expressed through `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12` and `--space-16`.

Use the same content edges for the header, introduction, proof strip, section headings and footer. Section labels sit 24px before their content; section heading groups have a 48px bottom gap on spacious layouts. Smaller layouts may tighten internal gaps without changing the section hierarchy.

The existing 900px and 520px breakpoints remain the starting point. New components must also be checked at intermediate widths, particularly 901–1024px, where navigation and multi-column content can become crowded. Choose component breakpoints from actual fit, rather than adding a second site-wide breakpoint system.

At narrow widths, stack content in reading order: heading and actions before the hero model; project illustration beside its own description in the document sequence; experience date adjacent to its role. Do not use CSS reordering that makes keyboard order disagree with visual order.

`section[id]` uses the header height plus anchor gap for scroll clearance. Keep the header height and mobile-menu position tied to the same token.

## Shapes, borders and controls

- `--radius-sm`: 4px for small details and focus geometry.
- `--radius-control`: 8px for buttons, navigation states and search trigger.
- `--radius-panel`: 12px for bounded visual areas and dialogs.
- Circular geometry belongs to diagrams and actual round controls. Pills may be retained for genuine compact filters; ordinary content does not need pill framing.

Use one orange-filled primary action in a local action group. Secondary actions use a quiet outline or text link. Keep the orange focus ring visible against every surface. Maintain readable labels, disabled states and visible active/expanded state.

Aim for at least a 44px effective touch target. Provide focus and touch equivalents for hover behavior. Essential actions stay visible without hovering. The new components will apply these rules to their own controls in Phase 2.

Do not put a border and fill around every service, skill or experience entry. Most lower-page structure should come from alignment, whitespace and dividers. Reserve large shadows for overlays.

## Illustration and 3D language

Author the new components and visual geometry locally. Do not download a portfolio template, stock 3D scene or third-party component implementation.

The planned hero is a single layered system assembly: a product/interface plane, service blocks, isolated data structures and a request signal. Use charcoal surfaces, blue structural details and orange activity. Keep labels in HTML wherever practical so they remain readable and accessible.

The composition is illustrative. It must not claim that the separate projects form one deployed architecture, or present moving signals as live usage data. Actual career metrics remain static and keep their project context.

Static project diagrams should echo the hero's geometry, connector style and colors. Their line work should remain clear at the actual rendered size. Text in diagrams needs a separate small-screen check; a large SVG viewBox alone does not guarantee readable labels.

## Motion rules

| Token | Value | Intended behavior |
| --- | --- | --- |
| `--motion-fast` | 160ms | Hover, color and border feedback |
| `--motion-base` | 240ms | Small interactive state changes |
| `--motion-enter` | 400ms | A short entrance where appropriate |
| `--ease-out` | `cubic-bezier(.22, 1, .36, 1)` | Shared CSS easing |

The tokens become 0ms under reduced motion. Existing global reduced-motion overrides remain in place. JavaScript animation still needs its own reduced-motion handling; CSS tokens alone do not stop a Three.js render loop or a Motion transition.

Continuous movement is reserved for the future hero. Give it a pause control, stop rendering offscreen or in a hidden tab, and provide a composed still fallback. Limit pointer response and avoid interfering with phone scrolling. No auto-rotation of the whole page, scroll hijacking or compulsory interaction to reach content.

Below the hero, use brief state feedback. Keep proof figures static and project illustrations still. Any entrance motion must leave content available when JavaScript or animation fails.

At the end of Phase 1, the existing Stack orbit, spotlight effects and reveal animations remained in place. Phase 3 removes the Stack orbit and its fixed shared canvas. The lower-section spotlight and reveal effects remain for their section phases; they are not examples of the final motion policy.

## Section continuity specification

| Section | Intended composition | Relationship to the rest of the page |
| --- | --- | --- |
| Header | Stable identity, section links, search and résumé | Same container, surfaces and action styles |
| Hero | Text/actions beside one original interactive model | Establishes the geometry and accent usage |
| Proof | Four quiet, contextualized metrics | Thin ruled transition into reading content |
| Work | Featured project plus supporting projects | Static diagrams repeat the hero's visual language |
| Services | Compact two-column list | Shared typography and dividers, low visual weight |
| About/experience | Bio, education, leadership and readable accordion rows | Consistent roles, dates and expansion controls |
| Stack | Directly visible skill groups | Static text, compact spacing and no orbit |
| Contact/footer | Clear email and supporting links | Echoes the hero type and orange accent without another scene |

Preserve the existing section order and IDs during implementation. Header navigation and the command palette must remain aligned with those IDs. A jump into the middle of the page should land at a recognizable heading without requiring the hero for context.

## Phase handoff

1. **Foundation:** complete. Tokens are implemented and consumed by shared page styles; this document defines the remaining design decisions.
2. **Original component design:** complete. `hero-visual.tsx`, `hero-scene.tsx`, the original project illustrations and search styling are implemented and checked at `/design-preview`.
3. **Landing assembly:** complete. The homepage integrates the responsive header, original model, existing introduction, native section actions and static proof strip.
4. **Work assembly:** complete. The load balancer leads a featured/supporting layout with original static diagrams and factual outcome callouts.
5. **Services and background assembly:** complete. Numbered service rows and a readable background layout replace the boxed cards and custom accordion.
6. **Stack and contact assembly:** complete. All skills are directly visible in groups, followed by a responsive contact layout and quiet footer.
7. **Continuity review:** complete. Shared alignment, section spacing, responsive text, project-row alignment and whole-page navigation have been reviewed.
8. **Validation and identity:** complete within the available local environment. Production, metadata, social image and high-density display checks pass; real-device and other-browser measurements remain open.

Use the existing project dependencies. The source of factual records remains `lib/site-data.ts`; the homepage's inline copy also stays intact. Component work should reuse existing behavior where it fits and remove obsolete code when its replacement is integrated.

## Phase 1 verification

- `pnpm build` passed, including compilation, TypeScript and static page generation.
- Both CSS files parsed successfully, and custom-property references resolved to defined tokens or existing font/pointer variables.
- The lowest tested text/accent contrast across the three opaque surfaces was 5.61:1. Primary button text on orange measured 6.29:1. These calculations do not verify translucent overlays or rendered diagram label sizes.
- Browser visual review was attempted but stopped by Windows computer-use because the current Chrome URL could not be determined confidently. Responsive rendering and visual fit remain unverified.
- The build regenerated `next-env.d.ts`; its pre-existing development type imports were restored after the build.

## Phase 2 components and verification

| File | Responsibility |
| --- | --- |
| `components/hero-visual.tsx` | Server-rendered SVG still, deferred scene loading, WebGL capability detection, visibility and motion state, pause control, error fallback and accessible HTML caption |
| `components/hero-scene.tsx` | Locally authored product/service/knowledge geometry, signal paths, lighting, pointer response, responsive camera and context-loss handling |
| `components/hero-visual.module.css` | Contained scene layout, shared-token styling and mobile presentation |
| `components/project-visual.tsx` | Original static ring, JWT gate and tenant-isolation diagrams; theme tokens, larger labels and instance-specific arrow IDs |
| `components/command-palette.tsx` | Restyled search, close control, explicit input focus, unique list IDs, keyboard hints and empty-result state |
| `app/design-preview/` | Responsive component review route; marked noindex and given its own canonical URL |
| `scripts/check-design-components.mjs` | Repeatable browser checks using Node's built-in HTTP/WebSocket support and an isolated headless Chrome |

All geometry and illustrations are authored in the repository. No stock scene, external component implementation, texture, environment map or new dependency was added. The preview copies the existing introduction and project records for review; it is not the final homepage composition. Existing homepage callers of `ProjectVisual` and `CommandPalette` remain compatible.

The scene renders inside its own container. Its code is dynamically imported after the visual enters view. The SVG still is present in the initial server HTML and remains visible until the scene is ready. A capability failure, renderer error or lost WebGL context retains the still view. Pixel ratio is capped at 1 on coarse pointers and 1.5 otherwise.

Pointer movement adds limited perspective response without capturing touch scrolling. Continuous rendering is disabled when paused, under reduced motion, outside the viewport or in a hidden document. The fixed metrics remain unrelated to the illustrative moving signals. An explicit drag/orbit interface and multiple scene modes were not needed for this component phase.

Validation completed:

- Production compilation, TypeScript and static generation passed, including `/design-preview`.
- Browser checks confirmed initial WebGL rendering, pause/resume, offscreen suspension and simulated hidden-tab suspension by counting actual WebGL draw calls.
- Reduced-motion changes stop continuous rendering.
- Both unsupported WebGL and a deliberately lost context show the static fallback.
- Search checks passed for filtering, empty results, arrow/Enter handling, Ctrl+K, Escape, close button and focus restoration.
- Widths of 320, 390, 768 and 1024px passed overflow and heading/control-bound checks. Desktop was reviewed at 1440px. SVG marker IDs are unique.
- The server response contains the static hero illustration. The existing homepage diagrams and search also passed compatibility checks.
- No uncaught browser exceptions were recorded.
- Screenshots of the desktop, mobile, search, project illustrations and WebGL fallback were captured under `output/design-components/`; desktop, mobile, search, project and fallback screenshots were visually inspected.

The browser used software WebGL in an isolated test profile. This establishes rendering and interaction behavior, not frame-rate, battery or loading performance on actual phones. Those measurements remain part of later integration validation. The preview is excluded from search indexing, but is not an access-controlled page; do not add private material to it.

## Phase 3 landing assembly

The homepage now uses the original `HeroVisual` beside its existing headline, introduction and actions. On screens up to 1000px wide, the copy and actions precede the visual. The hero uses the same contained canvas and failure states checked in Phase 2. The quiet proof strip below it preserves all four figures and their original context, using a semantic description list.

`components/site-header.tsx` owns header navigation, active-section tracking and mobile-menu state. Header links and the command palette use the shared section names from `lib/navigation.ts`. Native anchors update the URL and preserve browser Back behavior. Active-section tracking is scheduled once per animation frame and includes the bottom-of-page case for short final sections. Target clearance derives from the section's computed scroll margin.

The menu breakpoint is 1000px, with desktop navigation returning at 1001px. The mobile menu covers the full content viewport width, scrolls within short landscape viewports, closes after navigation, dismisses on outside interaction or Escape, and closes when resizing to desktop. Escape restores focus to the toggle. The keyboard skip link targets the main landmark. Search keeps its native modal behavior.

Without JavaScript, the mobile section links stay visible in the document flow, the hero retains its SVG still, and the existing project cards remain visible. Normal animation behavior is unchanged by that fallback.

The legacy `scene-canvas.tsx`, `scene-view.tsx` and `stack-orbit.tsx` files have been removed after their last homepage callers were retired. This prevents a second canvas from loading later in the page. The Stack's existing HTML skill ring and filters remain until Phase 6; its complete layout redesign has not been brought forward.

Validation extends the existing `scripts/check-design-components.mjs` checks:

- Production build, TypeScript and static generation pass.
- Existing proof values and section-link destinations are checked explicitly.
- The hero renders on the homepage, while scrolling to lower content retains only one contained canvas and stops its drawing.
- Native actions, all five section destinations, header clearance, active-section indication, browser Back and search navigation pass.
- Mobile-menu tests pass at 320, 390, 768, 900 and 1000px; desktop links pass at 1001 and 1024px. A separate 740×320 check verifies landscape-menu scrolling.
- The skip link activates the main landmark, Escape restores menu-toggle focus, and outside interaction dismisses the menu.
- Fresh direct links below the hero hydrate without mounting its offscreen scene.
- JavaScript-disabled mobile navigation, the initial hero still and project-card visibility are checked.
- Phase 2 scene, reduced-motion, context-loss, unsupported-WebGL and search checks remain in the same run.
- Desktop landing, mobile landing, expanded mobile menu and JavaScript-disabled screenshots are captured under `output/design-components/` and visually reviewed.

The local preview is served at `http://127.0.0.1:3100/`. No production deployment, external link audit or real-device performance measurement was performed. The source of factual content, existing project selection and lower-section order remain unchanged.

## Phase 4 selected work

`components/project-card.tsx` replaces the homepage's animated project cards. The load balancer spans the grid with its diagram beside the project details; Megalith and Membition sit in two quieter columns below. At 900px and below, all three projects stack with their diagrams first. Thin dividers and shared typography carry the landing page's styling into this section.

The original project selection, order, descriptions, dates, technologies and links are preserved. Three outcome callouts in `lib/site-data.ts` repeat existing facts: 19.66% of keys remapped on node failure, 42.7% annual user growth and a separate knowledge index for each NGO. No new performance claim was added. The diagrams remain locally authored SVGs with accessible descriptions. Their label positions now fit the larger featured panel as well as the original component preview.

Work has no canvas, spotlight or entrance animation. Its content is visible in server HTML without JavaScript. External links keep their safe new-tab attributes and have 44px minimum target heights. The obsolete project reveal wrapper and its no-JavaScript CSS override were removed; Services retains its existing behavior until Phase 5.

Validation completed against the production build:

- Compilation, TypeScript and static generation passed. The restricted build could not fetch the existing Google fonts; the build with network access succeeded using Geist and Geist Mono.
- Browser checks cover the featured/supporting hierarchy at 320, 390, 520, 768, 900, 901, 1024 and 1440px, including text bounds, diagram label bounds and sizes, static content and project links.
- Existing hero, reduced-motion, search, section navigation, Back, mobile-menu and no-JavaScript checks passed with no uncaught browser exceptions.
- Desktop and mobile Work screenshots were captured and visually reviewed in `output/design-components/`.

The local production preview remains running at `http://127.0.0.1:3100/#work`. No deployment, external project availability audit or real-device performance check was performed. Phase 5 is next.

## Phase 5 services and background

Services now uses a numbered two-column list with thin dividers. It shares Work's spacing, type sizes and orange accents. There are no filled cards or pointer spotlights. Removing the last spotlight caller also removes its delegated pointer listener and CSS.

Background opens with the existing headline and biography in separate columns. Below, education and leadership sit beside experience. These layouts become a single column at 900px, keeping the existing content order. Education, leadership and experience have explicit headings, readable text sizes and consistent dividers.

`components/experience-list.tsx` uses native `details` and `summary` controls. The latest role starts open; rows share a disclosure group so opening another role closes the previous one in supporting browsers. Every summary remains in the server HTML, and the controls work without JavaScript. The old React accordion state and conditional paragraph rendering have been removed. Browsers without disclosure-group support can keep several rows open; all content remains accessible.

The service descriptions, biography, education record, five leadership/award entries and four experience records are unchanged. Source comparisons verified the factual records and biography against their original versions. No external component, image or dependency was added.

Validation completed:

- Production compilation, TypeScript and static generation passed with the intended fonts.
- Browser checks cover Services and Background at 320, 390, 520, 768, 900, 901, 1024 and 1440px, including text bounds, column changes and touch-sized experience controls.
- Mouse, Enter and Space toggle experience rows; collapsing retains keyboard focus and opening another row closes the previous row in the test browser.
- Services and every experience summary remain available with JavaScript disabled; a closed role can still be expanded.
- Existing scene, reduced-motion, Work, navigation, search and mobile-menu checks pass with no uncaught browser exceptions.
- Desktop and mobile section screenshots were saved under `output/design-components/` and visually reviewed. The test helper now sends full keyboard events to native controls and keeps screenshot layout widths stable when Chrome hides scrollbars.

The local production preview stays on port 3100. Phase 6, Stack and Contact, is next. Deployment, other browser engines and real-device performance remain unchecked.

## Phase 6 stack and contact

`components/stack-groups.tsx` displays the existing Backend, Frontend, AI/ML and Cloud categories as static lists. All 22 tools are visible together. Thin rules, the shared title scale and small blue list markers connect this section to the original technical diagrams. The skill ring, filter controls, filter state and positioning calculations have been removed. The original explanatory sentence now sits beside the section heading.

Contact pairs the existing closing headline with the availability note, email and profile links. It uses two columns above 900px and one column below that breakpoint. The email can wrap on narrow screens, every contact link has a minimum 44px target height, and decorative arrows are hidden from assistive technology. Profile links keep their safe new-tab attributes. The footer retains its update date, local clock and native Back to top link, with a stacked layout on smaller screens.

`lib/site-data.ts` is byte-for-byte unchanged from the beginning of this phase. The existing skill names, categories, contact destinations and availability copy remain intact. There is no new scene, external asset, form or dependency.

Validation:

- Production compilation, TypeScript and static generation passed. The existing Google fonts required network access; the live development server was restarted with that access.
- Stack and Contact checks cover 320, 390, 520, 768, 900, 901, 1024 and 1440px, including text bounds, column changes, all skill labels and contact target sizes.
- Checks verify the exact skill groups, email and profile destinations, keyboard focus order and Back to top behavior.
- The JavaScript-disabled check verifies that every tool stays visible and native footer navigation reaches the hero. Its expectation accounts for the static fallback header.
- The full browser run passed, including the existing hero, search, Work, Services, experience and mobile-navigation checks, with no uncaught browser exceptions. Waits now poll from Node so checks do not depend on page timers when JavaScript is disabled.
- Desktop and mobile screenshots for both sections were captured under `output/design-components/` and visually reviewed.

The development server stays available at `http://127.0.0.1:3100/` for live edits. Production browser checks use a separate local server on port 3101, which is stopped after validation. Phase 7 is next. No deployment, real-device performance measurement or external profile availability audit was performed.

## Phase 7 whole-page continuity

The complete desktop page and mobile transitions were reviewed together. Shared container edges, lower-section heading sizes and section padding remain consistent. The contained hero remains the only scene; lower sections retain their static diagrams, lists and disclosure rows. The layout and content order did not need a broader change.

Two refinements came out of the review:

- Supporting project outcomes, technology lists and link rows now align when the cards share a desktop row. Flexible space above the outcomes accommodates the different description lengths without fixed text heights or shortened copy. Stacked cards retain their existing reading order and spacing.
- Search is hidden at every viewport width when JavaScript is disabled. Previously the desktop fallback left an inactive Search button visible. Native section links and the resume link remain available.

The existing browser script now checks actual rendered text bounds across the homepage at 320, 390, 768, 900, 901, 1000, 1001, 1280, 1440 and 1920px. It verifies shared container alignment, a consistent heading scale, section padding and non-overlapping section order. Separate checks increase root text size to 200% at 390 and 1440px; visible HTML text stays within the viewport. SVG labels keep their separate diagram-size checks.

The navigation review covers every section from the mobile keyboard menu, continued keyboard reading order after closing that menu, native smooth scrolling and fresh direct links to all five lower sections on desktop and mobile. Direct links keep headings below the fixed header and do not mount the offscreen hero canvas. Existing Back, search, reduced-motion, landscape-menu and no-JavaScript checks remain in the run.

Production compilation, TypeScript and static generation passed. Full-page desktop and mobile transition screenshots were saved under `output/design-components/` and visually reviewed. The factual records in `lib/site-data.ts` remain byte-for-byte unchanged from the start of Phase 6. The live development preview remains on port 3100. Phase 8 is next; other browser engines, real-device performance, metadata and social-image alignment remain outside this phase.

## Phase 8 identity and final validation

`lib/site-identity.ts` now supplies the shared page title, description and existing canonical origin. Page, Open Graph and Twitter metadata use the same identity: backend and AI engineering with product ownership. The structured Person record keeps the factual Backend Engineer job title and existing contact/profile details, and now includes the canonical URL. No homepage claim, project record, role, date or contact destination was changed.

`app/opengraph-image.tsx` generates a 1200×630 social card with the existing headline, dark palette, orange emphasis and an original illustration echoing the landing page's layered model. The image was generated, downloaded and visually inspected. It is 75,812 bytes in this build. Both sharing metadata formats point to the generated card and provide its alt text. The existing SVG, 32px favicon and 180px Apple icon already match the palette and monogram; their files are unchanged. The component preview remains noindex, and its outdated assembly-status note was replaced.

Final checks completed:

- Production compilation, TypeScript and static generation pass, including the generated social image and component preview.
- Browser checks verify matching page/share metadata, the canonical URL, theme color, structured data, image dimensions, icon responses, preview indexing exclusion and a missing page's 404 response.
- The full layout and interaction suite passes: 320–1920px text bounds, 200% root text size, keyboard navigation, all direct section links, native scrolling, browser Back, mobile and landscape menus, search, disclosure rows and the JavaScript-disabled fallback.
- The hero retains its SVG fallback after unsupported WebGL or context loss. Pause, offscreen suspension, reduced motion and simulated hidden-tab suspension remain checked.
- With device pixel ratio 3, a coarse-pointer emulation rendered its 350px-wide canvas into a 350px buffer (ratio 1). Desktop emulation rendered 624 CSS pixels into 936 buffer pixels (ratio 1.5). Both stopped drawing when paused. These checks confirm rendering caps; they do not measure phone frame rate, battery consumption or field loading speed.
- No packaged JavaScript, CSS or font response failed, and no uncaught browser exception was recorded in the final run.
- `output/design-components/social-preview.png` and `release-checks.json` retain the social image and display-cap results. The factual-content file matches its pre-phase hash.

All eight implementation phases are complete locally. The development preview remains available on port 3100. No production deployment was performed, so the public site and sharing caches have not been updated. Real devices, Firefox/Safari, screen-reader behavior and external link availability still need verification before making claims about those environments. The existing production origin remains canonical and was not changed or revalidated externally.
