# Benchyard public website

A static homepage, a guide directory, four public guides and the customer legal policies for secure cloud workspaces for agents and teams. Plain HTML and CSS, local fonts and responsive WebP. Every page includes the small shared navigation/walkthrough enhancement; the homepage additionally includes its motion marker and interactive task replay. Every page remains readable without scripts. No third-party embeds, trackers or runtime framework.

`content/en.mjs` is the current integration registry used by the hero, agent cards and guide. Kimi is supported through Kimi For Coding or Moonshot API keys. DeepSeek Harness is labelled Integration in progress on the homepage and agent guide; it is not in the supported strip. Planned integrations appear only in the guide. General agent positioning does not imply support for every agent. Team configuration is shared, while workspaces remain individually owned.

`content/device-setup.mjs` supplies both homepage and guide setup instructions. The Mac/iPhone scenes are labelled illustrative walkthroughs, not OS screenshots or proof of physical-device delivery. They point at the console, never request browser notification permission on this website, and distinguish adding a web app from granting push permission.

`src/navigation.mjs` defines feature destinations. `src/navigation.js` adds 150 ms hover opening, 200 ms pointer-leave grace, keyboard/click disclosures, mobile navigation and manually stepped device setup. Top-level links remain available without JavaScript. Direct `#device-setup` navigation expands the instructions.

## Build and preview

Requires Node 20+. The lockfile pins build and development dependencies.

```sh
npm ci
npm run check
npm run dev                          # localhost:4321, live reload in responses only
PORT=4322 LIVE_RELOAD=0 node serve.mjs # local preview without development live reload
npx playwright install chromium firefox webkit
npm test                             # use the acceptance preview above
npm run measure                      # six local performance samples
sudo npx playwright install-deps firefox webkit  # once, on a Linux host that lacks their libraries
npm run format:check
```

`WWW_TEST_URL` overrides the acceptance URL. Firefox tests disable the host proxy for local traffic. WebKit uses macOS Option-Tab navigation. These are desktop-engine tests, not physical iPhone tests.

## Files and routes

- `content/en.mjs`: homepage copy and current integration list.
- `content/guides.mjs`: guide content, factual review date, the demo's walkthrough.
- `content/demo.json`: the replay's data, written by the capture from a real run. Not edited by hand.
- `content/legal/`: customer policies (terms, privacy, and the related notices), rendered as pages. The launch checklist and research memorandum are not published.
- `src/page.mjs`: shared HTML, home and guide renderers, canonical site, console and contact addresses.
- `src/styles.css`: responsive light/dark styles; slim device silhouette without an extra case.
- `src/demo.mjs`, `src/demo.css`, `src/site.js`: the replay on the homepage. The first draws the finished session from `content/demo.json`, the script plays it.
- `src-img/`: real app screenshot originals and the social card's artwork. Screens use fictional demo data.
- `studio/`: reproducible fixture, the capture of the real app, and lab measurement tools. Never copied into `dist/`.
- `docs/claims.md`: internal product-fact evidence, reviewed against the product main branch.
- `docs/validation.md`: checks, measured results and release limitations.

Routes: `/`, `/guides/`, `/guides/getting-started/`, `/guides/agents/`, `/guides/workspaces/`, `/guides/security/`, and `/legal/<policy>/` for each customer policy. Every route has its own title, description and canonical URL. The sitemap is generated from these routes. Cross-page fragments, resource hashes, the per-page script allowlist, text the site must not carry (a cloud's name, a person's own machine) and cache headers are checked by `check.mjs`.

## The demo, and screenshot production

The demo on the homepage is a replay, not a video and not the live app. `src/demo.mjs` draws a copy of the app's session screen in the app's own colours and wording; `src/site.js` plays it: the task is sent, the agent edits three files and asks before running `npm test`, and the replay waits until the visitor approves or denies, on the drawn desktop or the drawn phone. Afterwards Changes, Files, Terminal and Ports can be opened, and Ports opens the issue board in a sandboxed frame.

What is real: `content/demo.json` holds the diff, the files and the output of `npm test` from a run of the task in the real app (its product commit is in the file), and the board in the frame is that run's `index.html` with the module it imports put in its place. What is not: the agent's replies are scripted, the interface is a drawn copy, the terminal takes no input, and "Ask again" after a denial is the replay's own control. npm's notice of a newer npm and a Node warning are left out of the shown output. The page says so beside the demo and in `/guides/workspaces/#demo-transcript`.

The capture needs: a checkout of the product at a commit on its main branch, with `web/` dependencies installed; Go matching its go.mod; Docker with `node:22-bookworm`; Playwright Chromium. The product checkout in use by others is never built in: add a worktree of your own and remove it afterwards.

```sh
git -C ../hestia worktree add --detach "$PWD/.cache/benchyard" main
npm --prefix .cache/benchyard/web ci
npm run demo:capture        # container, capture, container removed
npm run card                # the social card's artwork, from the new screenshot
npm run check
git -C ../hestia worktree remove "$PWD/.cache/benchyard"
```

`BENCHYARD_SOURCE` names another checkout; `KEEP_DEMO=1` leaves the container (`benchyard-www-demo`, port 18080 on loopback only) for a look. Container data is disposable and the studio mount is read-only. Generated binaries and reference pictures are ignored under `studio/output/`.

The capture writes desktop screenshots at 4× (5760×3600), phone screenshots at 3× (1170×2220), the small-screen hero as a crop of the desktop diff at that same density, and `content/demo.json`. `src/pictures.mjs` shares the responsive pixel widths with the HTML and publishes only widths the source covers, so a 1× original stays at half and full size and a denser one also feeds 2× and 3×. Nothing is upscaled. The social card is drawn at 2×. Look at every picture and at `content/demo.json` before committing: fictional data only. The screenshots in `src-img/` stay the last capture until this script is run again.

## Assets, caching and deployment

`npm run build` produces the entire deployable site in `dist/`. PNG sources are converted into WebP variants. The social card is a 1200×630 PNG. Build-only dependencies are sharp/lightningcss; Playwright, axe and Prettier are development tools.

| Paths                                               | Cache policy                          |
| --------------------------------------------------- | ------------------------------------- |
| `/assets/*`                                         | `public, max-age=31536000, immutable` |
| HTML, sitemap, robots, social card, icons, licences | `no-cache`                            |

The generated `_headers` file provides those rules for compatible static hosts; configure other hosts equivalently. Keep old hashed assets available through a deployment transition so an already-open page can still load its script and the demo's board. Set `LIVE_RELOAD=0` for acceptance tests.

Production must serve `.js` as JavaScript and support direct navigation to every guide route. A normal static file server supplies this without an application backend. Verify those responses against the actual deployed host; local success is not production verification.

## Publishing and search

GitHub Pages publishes `dist/` from `main`. The Pages hostname is `www.benchyard.com`; `benchyard.com` redirects there. Before treating the site as launched, verify `hello@benchyard.com` is monitored and confirm which environments and features are enabled in the hosted console. Public copy qualifies deployment/account availability. The product can support registration when configured; invitation access is the chosen marketing flow, not a claim that sign-up code is absent.

The canonical site is `https://www.benchyard.com`; the console is `https://console.benchyard.com`. Previews require a separate origin and their domain is not printed on the homepage. Preserve host redirects to the canonical site.

Robots policy is unchanged. Search-bot access and model-training policy are separate decisions. Do not add hidden instructions, unsupported claims, keyword pages or scripts to influence AI answers. The visible guides and the demo's walkthrough supply facts with stable section links. No AI citation placement is promised.

Use `docs/geo-review.md` for manual post-launch checks at days 14 and 30. No automation or analytics tracker is installed.

The simulated iPhone lock screen is `src/lock-screen.mjs` and `src/lock-screen.css`. The illustration uses original CSS wallpaper and SVG indicators; it is not a native push-delivery recording. Layout reference: [Apple’s notification guide](https://support.apple.com/guide/iphone/view-and-respond-to-notifications-iph6534c01bc/ios).
