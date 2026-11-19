# Portfolio design checks

`check-design-components.mjs` uses Node 22's built-in `fetch` and `WebSocket`, with no additional test package.

1. Build with `pnpm build`, then serve with `pnpm exec next start --hostname 127.0.0.1 --port 3100`.
2. Start a separate headless Chrome for Testing with `--remote-debugging-address=127.0.0.1 --remote-debugging-port=9224 --user-data-dir=<an isolated directory>`. Use a dedicated profile, not your personal browser session. This review used the installed browser under `%LOCALAPPDATA%/ms-playwright/chromium-1243/chrome-win64/chrome.exe`, with `--headless=new --use-angle=swiftshader --enable-unsafe-swiftshader` for software WebGL.
3. Run `node scripts/check-design-components.mjs` from the repository root.

The script opens and closes its own test tab, verifies the component preview and assembled homepage, checks responsive widths, and saves screenshots to `output/design-components/`. Landing checks cover native section links, browser Back, the active section, mobile menu and resize behavior, landscape scrolling, search navigation, direct section loads and the JavaScript-disabled fallback. It requires the isolated browser to support WebGL2 for the normal-scene tests; the fallback test then deliberately disables it. Close the isolated browser when finished.

Work checks cover the featured project and two supporting projects at eight widths from 320 to 1440px. They check layout order, outcome values, project destinations, link targets, text bounds, diagram label bounds and size, and the absence of Work animations or canvases. Full-section screenshots are saved as `work-desktop.png` and `work-mobile.png`.

Services and Background checks cover the same eight widths, column changes, text bounds, factual entry counts and touch-sized disclosure controls. Experience is checked with mouse, Enter and Space, including exclusive opening, focus retention and expansion without JavaScript. Full-section screenshots are saved as `services-desktop.png`, `services-mobile.png`, `about-desktop.png` and `about-mobile.png`.

Stack and Contact checks cover all four categories and 22 tools, email and profile destinations, responsive columns, text bounds, touch-sized links, keyboard focus order and native footer navigation. All tools and Back to top are also checked without JavaScript. Screenshots are saved as `stack-desktop.png`, `stack-mobile.png`, `contact-desktop.png` and `contact-mobile.png`.

Continuity checks cover the full page at ten widths from 320 to 1920px. They check rendered HTML text bounds, shared container edges, section padding and heading scale, plus 200% root text size at desktop and phone widths. Navigation checks include every mobile section link from the keyboard, reading order after menu dismissal, all direct section loads on desktop/mobile, smooth-scroll header clearance and the desktop fallback without JavaScript. Review screenshots are `continuity-desktop.png` and `continuity-mobile-{services,about,stack,contact}.png`.

Final identity checks verify the page/Open Graph/Twitter metadata, canonical URL, theme color, structured data, preview noindex directive, social PNG dimensions, favicon/Apple icon responses and a missing page's 404 behavior. The social card is saved as `social-preview.png`. High-density display checks emulate device pixel ratio 3 with coarse and fine pointers, verify the hero's respective 1 and 1.5 rendering caps, and check pause behavior. Results are saved as `release-checks.json`. The run also fails on packaged asset HTTP errors or uncaught browser exceptions. These checks do not establish real-device or other-browser performance, screen-reader behavior, external link availability or deployed sharing-cache behavior.

To keep a live development preview on port 3100 during validation, serve the production build on port 3101 and set `PORTFOLIO_URL` to `http://127.0.0.1:3101` for the test process. Stop that additional server after testing. The installed Next.js version isolates development output under `.next/dev`, allowing a production build alongside it.

Use `PORTFOLIO_URL` or `CHROME_DEBUG_URL` only when running on different local ports. The test hides the isolated browser's scrollbars to keep screenshot layout widths stable, uses an emulated reduced-motion preference and simulates a document-hidden event. It does not measure real-device GPU performance.
