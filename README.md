# Benchyard public website

A static homepage and three public guides for persistent coding-agent workspaces. Plain HTML and CSS, local fonts, responsive WebP, a native MP4 player and WebVTT captions. No scripts in the published site, third-party embeds, trackers or runtime framework.

The homepage describes a workspace for coding agents, not a product limited to a fixed list of models. `content/en.mjs` holds the current integration registry. Kimi, GLM and MiniMax are identified as future directions, not verified current integrations. Model/provider compatibility and agent support are separate concepts.

## Build and preview

Requires Node 20+. The lockfile pins build and development dependencies.

```sh
npm ci
npm run check
npm run dev                          # localhost:4321, live reload in responses only
PORT=4322 LIVE_RELOAD=0 node serve.mjs # script-free local acceptance preview
npx playwright install chromium firefox webkit
npm test                             # use the acceptance preview above
npm run measure                      # six local performance samples
npm run format:check
```

`WWW_TEST_URL` overrides the acceptance URL. Firefox tests disable the host proxy for local traffic. WebKit uses macOS Option-Tab navigation and explicitly selects the native subtitle track, which otherwise follows the system caption preference. These are desktop-engine tests, not physical iPhone tests.

## Files and routes

- `content/en.mjs`: homepage copy and current integration list.
- `content/guides.mjs`: guide content, factual review date, demo transcript.
- `src/page.mjs`: shared HTML, home and guide renderers, canonical site, console and contact addresses.
- `src/styles.css`: responsive light/dark styles; slim device silhouette without an extra case.
- `src-img/`: real app screenshot originals and rendered video posters. Screens use fictional demo data.
- `media/`: the 720p website video and English captions; published under content hashes.
- `studio/`: reproducible fixture, UI recording, video rendering and lab measurement tools. Never copied into `dist/`.
- `docs/claims.md`: internal product-fact evidence, reviewed against the product main branch.
- `docs/validation.md`: checks, measured results and release limitations.

Routes: `/`, `/guides/agents/`, `/guides/workspaces/`, `/guides/security/`. Every route has its own title, description and canonical URL. The sitemap is generated from these routes. Cross-page fragments, resource hashes, source types, subtitles and cache headers are checked by `check.mjs`.

## Demo and screenshot production

The 60-second video records Benchyard main (`6ebde5e2d4e081f9b57c87751a7a14c0e5ebb8b8`), not the Airwallex branch. The agent responses are scripted; file edits, `npm test`, mobile approval and the preview filter interactions really execute. The lock screen and email are illustrations, not proof of external message delivery. No real model calls, accounts, keys or external mail are used.

Prerequisites: sibling `../benchyard` checkout on main, its web dependencies installed, Go matching its go.mod, Docker with `node:22-bookworm`, FFmpeg with H.264 encoding, and Playwright Chromium. The default capture setup is Linux ARM64 for an Apple Silicon host. Set `DEMO_ARCH=amd64` for an x86 Docker host. `BENCHYARD_SOURCE` may point to another main checkout.

```sh
npm run demo:start
npm run demo:capture
npm run demo:render
npm run check
# After finishing with this disposable environment:
docker rm -f benchyard-www-demo
```

Use a fresh named demo container for another capture. The start command refuses a name collision. Container data is disposable; it is not mounted from a real user's application data. Only port 18080 on host loopback is exposed, and the studio mount is read-only. Generated binaries, frames, session metadata and the 1080p master are ignored under `studio/output/`.

Outputs:

- `studio/output/benchyard-demo-1080p.mp4`: 1920×1080, 30fps, H.264/yuv420p, faststart, 60 seconds, no audio.
- `media/benchyard-demo-720p.mp4`: website version, 1280×720, same duration/frame rate, under 15MB.
- `media/benchyard-demo.en.vtt`: English subtitles; the player provides native selection.
- `/guides/workspaces/#demo-transcript`: readable transcript and disclosure.
- Screenshot originals at 1440×900 and 390×740; mobile hero uses a generated crop of the real desktop diff. Source dimensions and responsive descriptors must remain in sync.

The intro uses a still of the recorded workspace, followed by actual task interactions. Timing is edited to the storyboard. Device decoration and the closing card are rendered separately. Neither runtime controls nor agent messages are painted over the application screenshots.

## Assets, caching and deployment

`npm run build` produces the entire deployable site in `dist/`. PNG sources are converted into WebP variants. The social card is a 1200×630 PNG. Build-only dependencies are sharp/lightningcss; Playwright, axe and Prettier are development tools.

| Paths | Cache policy |
| --- | --- |
| `/assets/*` | `public, max-age=31536000, immutable` |
| HTML, sitemap, robots, social card, icons, licences | `no-cache` |

The generated `_headers` file provides those rules for compatible static hosts; configure other hosts equivalently. Keep old hashed assets available through a deployment transition so an already-open page can still load its video. The local server preserves the pre-existing live-reload workflow, adds main's MIME/cache handling, and serves video byte ranges. Set `LIVE_RELOAD=0` for acceptance tests.

Production must serve `.mp4` as `video/mp4`, `.vtt` as `text/vtt`, support `Range` with `206` / `Content-Range`, and support direct navigation to every guide route. A normal static file server supplies this without an application backend. Verify those responses against the actual deployed host; local success is not production verification.

## Publishing and search

GitHub Pages publishes `dist/` from `main`. The Pages hostname is `www.benchyard.com`; `benchyard.com` redirects there. Before treating the site as launched, verify `hello@benchyard.com` is monitored and confirm which environments and features are enabled in the hosted console. Public copy qualifies deployment/account availability. The product can support registration when configured; invitation access is the chosen marketing flow, not a claim that sign-up code is absent.

The canonical site is `https://www.benchyard.com`; the console is `https://console.benchyard.com`. Previews require a separate origin and their domain is not printed on the homepage. Preserve host redirects to the canonical site.

Robots policy is unchanged. Search-bot access and model-training policy are separate decisions. Do not add hidden instructions, unsupported claims, keyword pages or scripts to influence AI answers. The visible guides and transcript supply facts with stable section links. No video-search eligibility or AI citation placement is promised.

Use `docs/geo-review.md` for manual post-launch checks at days 14 and 30. No automation or analytics tracker is installed.

The simulated iPhone lock screen is shared by the homepage and video through `src/lock-screen.mjs` and `src/lock-screen.css`. Edit these sources, then run `npm run demo:render` and `npm run check` to refresh both. The illustration uses original CSS wallpaper and SVG indicators; it is not a native push-delivery recording. Layout reference: [Apple’s notification guide](https://support.apple.com/guide/iphone/view-and-respond-to-notifications-iph6534c01bc/ios).
