# Portfolio project map and design brief

Reviewed: 9 November 2026.

This document records the existing implementation and the material available for a later design refresh. The agreed direction is **a hybrid of engineering and product**. Existing factual content is the baseline; design changes should improve its hierarchy, clarity and presentation.

## 1. What this project is

A single-page personal portfolio for Rupam Mahato, an IIT Kharagpur dual-degree student graduating in May 2027. Its current positioning is backend engineering, AI systems and cloud infrastructure. It also advertises full-time availability and freelance/contract services.

The intended visitor journey is: understand Rupam's focus, see evidence of delivery, inspect selected work and experience, then open the résumé or make contact. The likely audiences are recruiters, hiring managers, engineering leaders and potential clients. A product audience becomes more relevant under the agreed hybrid direction.

The portfolio itself is a presentation website. The payment systems, RAG pipelines, authentication services and databases described in its copy belong to other projects and employers; their implementations are not in this repository.

There is one authored page route, `/`, plus a generated social-preview image at `/opengraph-image`. There are no authored project detail pages, API handlers, database models, CMS integrations, contact form, authentication flow or payment flow here.

## 2. Review coverage and limits

- Read every first-party source file, configuration file, instruction file and ignore file.
- Inspected the lockfile's dependency resolutions, generated route manifest and recent Git history.
- Reviewed the SVG icon source and PNG dimensions; visually inspected the Apple icon.
- Extracted the text and visually reviewed all 15 pages across all six local PDF references.
- Read the installed Next.js guides for layouts/pages, CSS and server/client components rather than relying on older conventions.
- Ran TypeScript checking and HTTP checks against the existing production build.
- Browser/native automation was unavailable: the browser host and native pipe could not be reached. Website visual appearance and browser interactions remain unverified at runtime. Layout observations below come from source, while reference-PDF observations come from rendered PDF pages.
- Third-party package internals, Git object history and generated build files are infrastructure, not authored portfolio content. They were inspected selectively rather than treated as files to redesign.
- External project repositories and live websites were not audited. A URL in a local file does not establish its current availability.

## 3. File-by-file map

| File or directory | Responsibility | Relevance to a redesign |
| --- | --- | --- |
| `app/page.tsx` | Entire homepage, section sequence, inline copy and interactive state | Main place to change composition, hierarchy and section layouts |
| `app/globals.css` | Theme tokens, reset, typography, every major component style, breakpoints and reduced-motion rules | Main visual design surface |
| `app/layout.tsx` | Root document, fonts, metadata, viewport, Person JSON-LD and production analytics | Keep browser theme, identity and search/social metadata consistent with the design |
| `app/opengraph-image.tsx` | Programmatic 1200 x 630 PNG for link previews | Update alongside any new identity or headline |
| `lib/site-data.ts` | Contact links, proof metrics, education, awards, skills, projects, services and experience | Primary structured content source; retain facts during visual work |
| `components/command-palette.tsx` | Searchable keyboard quick-jump dialog | Navigation enhancement; can be restyled independently |
| `components/project-visual.tsx` | Three explanatory SVG project diagrams | Current project imagery; independent of WebGL |
| `components/scene-canvas.tsx` | Shared fixed WebGL canvas, support probe and motion/device settings | Preserve loading and fallback safeguards if 3D is retained |
| `components/scene-view.tsx` | Client re-export of Drei's `View` | Connects a DOM region to the shared canvas |
| `components/stack-orbit.tsx` | Slowly rotating blue wireframe icosahedron | Decorative center of the skills presentation |
| `public/icon.svg` | Dark rounded RM monogram with orange dot, 64 x 64 viewBox | Vector identity asset |
| `public/icon-32.png` | 32 x 32 raster favicon | Browser icon counterpart |
| `public/apple-icon.png` | 180 x 180 Apple touch icon | Installed/bookmarked identity counterpart |
| `package.json` | Dependencies and `dev`, `build`, `start` scripts | Runtime/build baseline; package name is still generic `my-project` |
| `pnpm-lock.yaml` | Exact dependency graph and package integrity values, lockfile v6 | Reproducible dependency record; do not hand-edit for design work |
| `next.config.mjs` | Sets `images.unoptimized: true` | Revisit only if future work introduces image assets and optimization requirements |
| `postcss.config.mjs` | Registers `@tailwindcss/postcss` | CSS build integration |
| `tsconfig.json` | Strict TypeScript, bundler resolution, React JSX, `@/*` alias, Next plugin and generated type paths | Development/type-checking configuration |
| `next-env.d.ts` | Next-generated type declarations | Generated; not a design file |
| `AGENTS.md` | Requires reading the installed Next.js documentation before coding | Applies to future implementation work |
| `CLAUDE.md` | Refers to `AGENTS.md` | No additional product or design requirements |
| `.gitignore` | Ignores dependencies, build artifacts, local environment files, prior tool files and private reference PDFs | Reference assets are not automatically public website assets |
| Six root PDFs | Résumé variants and project evidence | Source material for positioning and optional future imagery; detailed below |
| `node_modules/` | Installed third-party packages and local Next.js documentation | Dependency/runtime infrastructure |
| `.next/` | Existing production/development outputs, types, caches and manifests | Generated; do not edit as source |
| `tsconfig.tsbuildinfo` | Incremental compiler cache | Generated and ignored |
| `.git/` | Repository metadata and history | Not part of the delivered website |

There are no authored photos, project screenshots, videos or product image assets in `public/`; the visible project graphics are generated SVGs. Screenshots are currently embedded only in the private reference PDFs.

## 4. Runtime architecture and data flow

```text
app/layout.tsx [server]
  |-- global CSS + Geist / Geist Mono
  |-- metadata + Person JSON-LD
  |-- app/page.tsx [client boundary, initial HTML prerendered]
  |     |-- lib/site-data.ts
  |     |-- SectionLabel / Clock / ProjectCard / SkillRing
  |     |-- CommandPalette
  |     |-- ProjectVisual -> Ring / Gate / Tenants SVG
  |     `-- near Stack: dynamic SceneCanvas + SceneView + StackOrbit
  `-- Vercel Analytics [production only]

app/opengraph-image.tsx -> separate generated social-preview PNG
```

Content comes from local imports and inline JSX, with no runtime content API. React state changes menus, experience expansion, skill filtering and lazy 3D mounting. Contact and résumé actions hand off to email or external websites.

The entire homepage is marked `use client`, so its imported UI belongs to the client module graph. This still permits initial prerendered HTML. In particular, the comment in `project-visual.tsx` about server rendering should not be read as saying the component is excluded from the client bundle: it is imported by the client page.

## 5. Page structure and visitor-facing content

| Order | Section | Existing presentation and purpose |
| --- | --- | --- |
| Persistent | Header | RM home mark, Work/Services/About/Stack/Contact navigation, search, résumé and mobile menu |
| 1 | Hero, `#top` | Backend/AI identity, large systems headline, introduction, selected-work CTA, résumé, email and availability |
| 2 | Highlights | Four metrics: 5K+ concurrent users, 2,046 req/s, 26-day MVP delivery and 93 re-authenticated routes |
| 3 | Work, `#work` | Three equally weighted project cards with diagrams, descriptions, tags and links/fallbacks |
| 4 | Services, `#services` | Four cards covering backend, AI/RAG, cloud/infrastructure and full-stack MVPs |
| 5 | Background, `#about` | Bio, education, five leadership/award entries and four expandable experience entries |
| 6 | Stack, `#stack` | All/Backend/Frontend/AI-ML/Cloud filters, orbiting HTML labels and a 3D center |
| 7 | Contact, `#contact` | Availability, email, four social profiles, copyright, update date, IST clock and back-to-top link |

The site's headings use an editorial voice: “Designing systems that hold their shape,” “Useful complexity, carefully arranged,” and “Let's make it legible.” The factual body content is more specifically engineering focused.

### Structured data in `lib/site-data.ts`

- `contact`: email, GitHub, LinkedIn, Codeforces, LeetCode and a Google Drive résumé URL. The site does not serve a local résumé download.
- `updated`: manually set to `Sep 2026`.
- `proof`: four headline figures; currently all presented with equal weight.
- `skillCategories`: 22 skills across Backend (6), Frontend (4), AI/ML (7) and Cloud (5). `skills` flattens these lists.
- `education`: IIT Kharagpur; B.Tech. Civil Engineering plus M.Tech. Environmental Engineering & Management; November 2022 to May 2027. Preserve these actual degree details when framing the software/product story.
- `awards`: sponsorship, team/intern mentorship, IIT Bombay Action Plan, Smart India Hackathon and Hero CoLabs.
- `Project`/`Visual`: typed project model and the `ring`, `gate`, `tenants` diagram choices.
- `projects`: three records. Only the load-balancer record currently has live and repository URLs.
- `services`: four title/description records.
- `experience`: four tuples in `[role, organisation, period, summary]` order, newest first.

### Project stories

| Project | Existing engineering evidence | Product dimension available in the references |
| --- | --- | --- |
| Consistent Hashing Load Balancer, 2026 | Virtual nodes, health checks, failover, 19.66% key remapping and 2,046 req/s | Makes routing behavior visible through an operations console; shows diagnosis and measurable improvement |
| Megalith 2025 | Next.js platform, role-based JWT auth, MongoDB analytics and payment/certificate/email automation | Registration scale, user growth and reduced organizer effort |
| Membition, 2024 | Multi-tenant RAG, isolated Pinecone indexes, hardened ingestion and 13 scope rules | NGO onboarding and self-service setup |

Zyke appears as founding-engineer experience and in the 26-day proof metric, but does not have a selected-work card. Its PDF contains substantial product imagery that the homepage currently does not use.

### Experience stories

- **Neosophical Labs, May-July 2026:** payroll SLA engine, compliance defect fixes, marketing-agent digests and data ingestion.
- **Datsol / Posterity, November 2025-May 2026:** hiring portal, hierarchical access, rate limits and resilient external-sheet sync.
- **10X Analysts, May-July 2025:** document knowledge APIs, tenant permissions, cross-origin authentication and a FastAPI BFF proxy.
- **Zyke, October 2024-January 2025:** sole-engineer MVP delivery, metered AI-provider costs and reliable Razorpay credit/payment flows.

These are all currently shown as dense prose summaries. Their role, scope, audience and outcome can be made easier to compare through layout without adding new claims.

## 6. Interaction-by-interaction behavior

### Homepage helpers and state

- `SectionLabel`: shared numbered section eyebrow.
- `Clock`: initializes to a dash, then updates once per second in `Asia/Kolkata`. Its state is isolated so the full page does not rerender every second; the timer is cleaned up.
- `ProjectCard`: Motion article entering from 24 px below with opacity 0 to 1. It animates once when in view, using an 80 px viewport margin and a small index-based stagger. Missing URLs produce “Live demo unavailable” and “Code private” text.
- `SkillRing`: places filtered skills using sine/cosine around an ellipse. All 22 use larger radii and 13 px labels; filtered sets use smaller radii and default 15 px labels. Coordinates are rounded to two decimals to avoid server/browser output differences.
- `active`: tracks the section in a narrow viewport band using `IntersectionObserver` with `-35% 0px -55% 0px` margins. It starts empty.
- `menuOpen`: toggles the mobile nav. Section navigation closes it.
- `openExperience`: starts at 0, showing the newest entry. Clicking another entry opens only that entry; clicking it again closes all entries with state `-1`.
- `filter`: starts at `All` and changes only the visible HTML skill labels and caption, not the 3D shape.
- `show3d`: starts false and becomes permanently true when Stack is within the observer's 800 px preload margin.
- Pointer spotlight: a delegated passive pointer listener finds `.spot` cards and writes local pointer coordinates to CSS variables. Enabled only for hover devices without reduced-motion preference; cleaned up on unmount.
- `goTo`: scrolls to a lowercased section ID, respects reduced motion and closes the mobile menu. These button actions do not update the URL hash or create normal link history.

### Command palette

Uses a native modal `dialog`. Cmd/Ctrl+K toggles it; the header Search button opens it. Opening resets query and selection. The native dialog supplies modal focus containment, Escape handling and an inert background; clicking the backdrop also closes it.

There are 16 initial items: five sections, three projects, résumé, copy-email, send-email and four social profiles. Matching is a case-insensitive substring search over labels and hints. Arrow keys wrap selection; Enter runs the current result. Hover selects a row. Closing synchronizes React state, and selection is scrolled into view.

Project results all jump to the Work section; they do not target individual cards, open case studies or launch project demos. Copy-email attempts clipboard writing and falls back to `mailto` if the promise rejects. There is no visible copy-success feedback, and an entirely unavailable Clipboard API produces no fallback through the current optional-chain expression.

### Static project visuals

`project-visual.tsx` implements small reusable Label, Box and Arrow helpers, then selects one of three SVG scenes with an accessible descriptive label:

- `Ring`: five nodes, sample keys, clockwise arcs and 48 virtual-node ticks.
- `Gate`: a request passing JWT-verifying edge middleware into admin/public branches, plus refresh rotation.
- `Tenants`: three NGO lanes, separate indexes and shared scope restrictions.

These are conceptual illustrations rather than live simulations or screenshots. Geometry is deterministic. Their colors are hardcoded independently of the CSS theme.

### 3D rendering

The page dynamically imports the three 3D modules with server rendering disabled. `SceneCanvas` probes WebGL support first and skips the layer when unsupported. A single fixed, non-interactive canvas at z-index 5 renders the Drei View region, while HTML labels remain in the page.

The camera sits at `[0, 0, 6.5]` with 40-degree field of view. Device pixel ratio is capped at 1 on coarse pointers and 1.5 otherwise. Normal motion uses a continuous render loop. Reduced motion switches to demand rendering, with `RedrawOnScroll` invalidating on scroll/resize so the view continues tracking its DOM box.

`StackOrbit` renders an ambient-lit, blue wireframe icosahedron of radius 0.65 and detail 1. It rotates around Y at 0.12 radians per second unless motion is reduced. It is a visual accent; it carries no skill data. Once loaded, the canvas remains mounted, including when Stack leaves the viewport.

Source comments document earlier performance/context/text-rendering problems and the reasons for lazy loading, shared context and HTML labels. The mentioned historical LCP and bundle figures were not remeasured in this review.

## 7. Existing visual system

The implementation is predominantly custom global CSS, with Tailwind v4 imported for its framework/theme support. It is not a component-library-driven design. `tw-animate-css` is imported, while the visible custom animation is primarily Motion, CSS transitions and the Three.js loop.

| Element | Current definition |
| --- | --- |
| Background | `#0b0c0e` |
| Panels | `#111316`, `#171a1e` |
| Main text | Warm white `#eceae4` |
| Secondary/muted text | `#a3a8b1`, `#7d8490` |
| Primary accent | Orange `#ff5a2c` |
| Secondary graphic accent | Blue `#6f8cff` in SVGs and 3D |
| Status | Green `#4ade80` |
| Fonts | Geist Sans for body/headings; Geist Mono for labels, metadata and tags |
| Main container | Maximum 1296 px; viewport-dependent side padding from 20 to 72 px |
| Header | Fixed, 68 px high, dark translucent background with blur |
| Hero | Desktop minimum one small-viewport height; large left-aligned text and an orange radial wash |
| Type sizes | H1 roughly 43-102 px; H2 roughly 34-64 px; contact heading up to 112 px |
| Rhythm | Main sections use 72-128 px vertical padding |
| Shapes | Cards generally 16 px radius; buttons 10 px; skill filters pills |
| Project layout | Three columns, 20 px gaps, 400:310 diagram aspect ratio |
| Service layout | Two columns |
| Background layout | Two unequal columns, with experience beside bio/education/awards |
| Stack | 440 px tall bordered panel |

The `em` element is restyled as orange emphasis with normal font style, rather than italics. Borders are subtle white-alpha lines. Cards gain pointer-positioned orange highlights on hover. A CSS feature query adds a 2 px scroll-progress line under the header where scroll timelines are supported.

At **900 px and below**, projects/services/background become one column; navigation becomes a dropdown; the header résumé and keyboard hint disappear; proof metrics form two columns; experience date columns shrink; and the stack panel becomes 340 px tall. The hero stops filling the viewport. At **520 px and below**, only the eyebrow typography receives an additional explicit adjustment. Other responsiveness comes from fluid type, wrapping and shared widths.

Reduced-motion CSS disables smooth scrolling and effectively minimizes animation/transition durations. MotionConfig follows the user's preference, and the 3D animation also checks it.

## 8. Metadata, analytics and configuration

`layout.tsx` loads Latin Geist fonts through `next/font/google`, applies their CSS variables and imports the global stylesheet. It declares an English document, a dark color scheme, a dark browser theme color, a responsive viewport, a canonical root URL and `metadataBase` pointing to the portfolio's Vercel domain.

Metadata currently describes a backend engineer. Person JSON-LD includes the same role, contact email, Kharagpur location and four profile URLs. The site title is “Rupam Mahato - Portfolio.” Icons have `?v=2` cache-busting URLs.

`opengraph-image.tsx` separately repeats the current systems headline and engineering identity using dark/orange inline styling. A new theme or hybrid identity would need coordinated changes here and in the root metadata; changing CSS alone will not update them.

Vercel Analytics is included only when `NODE_ENV` is `production`. No custom analytics event instrumentation appears in the first-party source. There are no authored sitemap or robots routes.

Declared stack: Next.js 16.3.3, React 19, TypeScript 5.7.3, Tailwind 4.3.3, Motion 13.1.1, Lucide, Three.js 0.185.1, React Three Fiber 9.7.0 and Drei 10.7.8. The lockfile resolves React/React DOM 19.2.8 and Lucide 1.35.0. There are no lint or test scripts and no checked-in automated tests or CI workflow.

Recent commits show a previous dark/Geist redesign, removal of a hero hash-ring simulator, custom RM icons, moving the résumé to Google Drive, lazy-loading the Stack scene and removing unused components/packages. Future work should account for those deliberate simplifications.

## 9. Reference PDFs and what each contributes

The PDFs are reference material, not automatically approved public assets. Their historical screenshots demonstrate what was captured at the time, rather than current external-site status.

| Reference | Pages | Contents and design usefulness |
| --- | --- | --- |
| [Rupam_Resume_Updated.pdf](./Rupam_Resume_Updated.pdf) | 1 | Backend/AI/cloud positioning; technical skill groups; engineering implementation details; experience, projects and leadership. Most current homepage facts follow this version. |
| [Rupam_Resume_Product.pdf](./Rupam_Resume_Product.pdf) | 1 | Product management, business analytics and AI/SaaS positioning. Adds objective statements, user/workflow outcomes, pricing/unit economics and broader leadership evidence. Useful for choosing emphasis under the hybrid direction. |
| [Consistent_Hashing_Load_Balancer_Portfolio.pdf](./Consistent_Hashing_Load_Balancer_Portfolio.pdf) | 3 | Link/repository cover plus three screenshots of a dark amber operations console: launch, ring controls/statistics and event/live-traffic panels. |
| [Megalith_Website_Project_Portfolio.pdf](./Megalith_Website_Project_Portfolio.pdf) | 1 | Project description, URLs and a screenshot of a private GitHub repository overview. It does not contain a visitor-facing fest website screenshot. |
| [Membition_Chatbot_Project_Portfolio.pdf](./Membition_Chatbot_Project_Portfolio.pdf) | 4 | Three repository references and six screenshots: repository views plus NGO organization information, PDF upload and chatbot-configuration steps. Demonstrates a seven-step self-service setup flow. |
| [Zyke_Product_Portfolio.pdf](./Zyke_Product_Portfolio.pdf) | 5 | Hosted/archive and repository references plus eight screenshots. An editorial cream/serif case study shows brand-to-content workflow, generated output, cost metrics, demo framing and expandable sections explaining product/build/business context. |

Zyke offers the richest existing visual story for a hybrid portfolio. The load-balancer console offers strong systems imagery. Membition offers a user-flow story. Megalith's current PDF primarily supplies repository evidence, so it would need a different visual treatment if no additional product screenshots are available.

### Content differences to keep explicit

These are editorial questions for later work, not corrections made during this review:

- The engineering résumé and site say **93 routes** at 10X Analysts; the product résumé says **95 endpoints**. These may use different scopes, but that is not established locally. Do not silently interchange them.
- Datsol is **Full Stack Developer** in the site/engineering résumé and **Full Stack Developer Intern** in the product résumé.
- Leadership counts and event scopes differ between the résumé versions. They may describe different responsibilities or periods; do not merge them into a new unsupported aggregate.
- New product-résumé facts such as pricing, analytics and additional leadership outcomes are available, but are not yet approved homepage copy merely because they exist in the folder.
- The Google Drive résumé target is fixed in `contact.resume`; which résumé that remote file currently contains was not verified.
- A source comment says Megalith's live URL was removed after a TLS failure on 19 September 2026. This is a dated observation, not a fresh availability check.
- PDFs list repository URLs for Megalith and Membition, but the page omits them. Screenshots label these repositories private. Having a URL does not imply public access.
- The displayed update date remains September 2026 and copyright is hardcoded to 2026.

## 10. Implications for a hybrid design refresh

The portfolio can communicate both **what was built** and **why it mattered** using its existing body of work. The visual hierarchy should let a product reader find ownership, user problems and outcomes quickly, while giving an engineering reader a clear route to architecture, tradeoffs and implementation detail.

The following are design opportunities inferred from the content and source, not browser-verified usability findings:

1. **Balance the introduction.** The current hero, services, metadata and preview image all lead with engineering. A hybrid direction requires coordinated emphasis across those surfaces, with any wording changes reviewed separately from layout changes.
2. **Put outcomes beside mechanisms.** Existing project descriptions already contain metrics and technical decisions. Visually separate role, problem, outcome and implementation so those details can be found without reading a dense paragraph.
3. **Establish a project hierarchy.** The three cards currently have equal weight. A featured project with supporting projects could communicate the strongest hybrid story sooner. Featuring Zyke would change project selection and should be a deliberate content decision.
4. **Use evidence where it helps.** Existing SVGs make infrastructure legible, but the PDFs contain real product/console imagery. A later design can combine the two after selecting suitable crops and public-safe assets. Private repository screenshots are not equivalent to product screenshots.
5. **Expose ownership in experience.** Keep the current dates and roles, but make responsibilities and results easier to scan before opening long details. The current accordion shows only the newest summary by default.
6. **Make capabilities readable.** The skill ring presents technologies without expressing product skills or relationships. A grouped layout could show engineering, product and analytics capabilities more clearly if the content scope is approved. The existing 22-label ring also warrants small-screen collision checks.
7. **Align the CTA hierarchy with the audience.** Selected work, résumé and contact should remain easy to locate. The current repeated freelance messaging and four service cards place considerable emphasis on client acquisition; the balance can be adjusted through placement and visual weight.
8. **Keep motion purposeful.** The 3D center is decorative and continues rendering once mounted. Its retention should depend on the final design's benefit; preserve reduced-motion and WebGL fallback behavior if retained.

### What can change while preserving facts

Theme, typography, spacing, layout, project hierarchy, metric treatment, section composition, navigation styling, illustration treatment, responsive behavior and interaction presentation can all be redesigned independently of factual claims.

Changing role positioning, rewriting descriptions, adding product skills, promoting Zyke into selected work, publishing PDF screenshots or replacing résumé links goes beyond pure styling and should be treated as explicit content choices. The agreed hybrid direction guides the design; it does not settle every individual content edit.

## 11. Implementation considerations for later work

- Most factual records are centralized, but hero copy, section headings, introductions, availability, footer text, social labels and metadata remain hardcoded elsewhere. Content separation is partial.
- Theme colors also live in SVG constants, the 3D material, favicon assets, root viewport settings and the generated preview image. A theme change must include these surfaces.
- Nav labels are duplicated in `page.tsx` and `command-palette.tsx`. Section IDs, navigation and palette items must stay aligned if sections change.
- `Visual` and the SVG scene map assume exactly the current three diagram types. A new project image format would need a small data/component extension.
- No authored project-detail route exists despite the content file's forward-looking comment about case-study pages. Adding one is new functionality.
- Global selectors such as `nav`, `footer`, `h2`, `button` and `em` affect future components. Keep their scope in mind when adding sections.
- Navigation buttons depend on JavaScript. Native anchor links could improve URL behavior and progressive enhancement during a redesign.
- Project cards begin with zero opacity for their entrance animation, so their visibility depends on successful client animation/hydration. Include this in resilience checks.
- Existing accessibility foundations include labeled navigation, accessible diagram descriptions, visible focus styles, button expansion/pressed state, a native modal and reduced-motion handling. A skip link, active-link semantics, mobile-menu keyboard behavior and full screen-reader interaction remain review items.
- A browser pass should test 320/375/390 px phones, tablet widths near the 900 px breakpoint and large screens. Particular risks are skill-label collisions, long experience titles, navigation fit, email wrapping and dense project copy.
- The date/role/metric differences above must be resolved from the intended source, not guessed during a visual implementation.

## 12. Validation and workspace state

Completed checks:

- `pnpm exec tsc --noEmit --incremental false`: passed with exit code 0.
- Started the existing build with `next start` bound to `127.0.0.1:3100` for local inspection.
- HTTP GET `/`: 200, expected portfolio title and page content.
- HTTP GET `/icon.svg`, `/icon-32.png`, `/apple-icon.png`: all 200 with expected image content types.
- HTTP GET `/opengraph-image`: 200, PNG.
- Reviewed all reference PDFs using extracted text and rendered page images.

No fresh production build, browser visual QA, live-link availability audit or end-to-end interaction tests were performed. The HTTP checks validate the existing build, while TypeScript checked the current source. No website source, factual content or dependency manifest was changed during this review.

At review start, Git already showed a modified `next-env.d.ts` switching generated type imports to `.next/dev/types`, and an untracked `Rupam_Resume_Product.pdf`. Those changes were preserved. Other reference PDFs are ignored by the existing patterns. PDF review outputs were stored in the ignored `.next/cache/project-review/` directory; temporary PDF-reading libraries were installed outside the project dependency tree.

This report is the only new authored project file from the review. It provides the implementation map and content constraints for the subsequent design work.
