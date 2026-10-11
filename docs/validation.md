# Homepage refresh validation

Date: 2026-10-09 (Asia/Shanghai).

## Provenance and scope

- Both repositories switched to main and fast-forwarded. Product: `6ebde5e2d4e081f9b57c87751a7a14c0e5ebb8b8`; website base: `b02ac3f6fcb6dc6312104ecf1e81aa3e5e4addcd`.
- Product working tree is clean. `feat/airwallex-billing` remains at `1d1638eff353e69d09b98f6c35b85e95c6b072cb`, unmerged.
- The existing local `serve.mjs` hot-reload change was preserved through a stash/apply conflict and combined with main's MIME/cache rules. A safety stash named `codex-preserve-serve-before-main` is retained.
- Changes are local, not committed, pushed or deployed. No model API calls or external email were sent. The demo used a disposable Linux ARM64 Docker container and main's real application UI.

## Website checks

- `npm run check`: passed for all four routes. Checks internal links and cross-page anchors, unique IDs/titles/descriptions, canonical/social URLs, heading hierarchy, image dimensions and responsive sources, WebP images, MP4/VTT sources, content hashes, unused assets, social-card dimensions, generated sitemap and cache rules.
- `npm run format:check`: passed.
- `git diff --check`: passed.
- `npm test`: **15 passed** across Chromium, Firefox and WebKit.
- Layout checks cover all four pages at 320, 360, 390, 768, 1024, 1280 and 1440 CSS pixels in light and dark themes, without horizontal page overflow.
- Axe checks at 360, 390 and 1280 pixels on all four pages and all three engines: no WCAG 2 A/AA or WCAG 2.1 AA violations reported. Automated checks do not replace a human accessibility audit.
- Keyboard skip link, native mobile menu, FAQ disclosure, script-disabled operation, enlarged text/reflow and native video play/pause/seek/caption selection passed.
- MP4 byte ranges (including suffix and invalid ranges), HEAD, MIME types, immutable assets, non-cached HTML and missing routes passed.
- Reference screenshots: `docs/screenshots/`. Other engine captures: ignored `studio/output/validation/`. Layout logs: `docs/validation/layout-*.json`.

## Video evidence

- Website MP4: 1280×720, H.264, yuv420p, 30fps, **60.000 seconds**, **806,279 bytes**. No audio track. Faststart enabled.
- Master MP4: 1920×1080, same codec/frame rate/duration, **1,322,020 bytes**; saved at `studio/output/benchyard-demo-1080p.mp4`, outside `dist/`.
- Eight English WebVTT cues and matching public HTML transcript.
- Recorded: real application sessions and diff; real phone approval of `npm test`; four passing Node filter tests; actual Ports → Open in browser transition; live In progress / Done / All interactions asserting 3 / 3 / 6 visible issues.
- Agent replies are scripted. The intro and outro include stills; the timeline is edited. The lock-screen notification and email are illustrations. These disclosures appear beside the website video and in the transcript. The video does not assert real model speed or external notification delivery.
- Both master and website video decoded in full with FFmpeg without errors. Intro, approval, test-output, preview and outro frames were visually inspected. Device silhouettes were revised to the owner's thin-outline reference, without a separate case or side-key decorations. The revised notification scene uses an edge-to-edge lock screen, a single clock, vector status indicators and compact translucent notifications. Homepage and video share `src/lock-screen.mjs` and `src/lock-screen.css`; no native iOS notification delivery is implied.
- `npm run verify:media`: each browser played the complete 60-second website video to `ended`, with no media error, eight caption cues and successful native fullscreen. Results: `docs/validation/media-playback.json`.
- WebKit honors the OS caption preference. The test explicitly selects the native English track. Physical iPhone playback/PWA push delivery was not tested; the desktop WebKit check is not a hardware claim.

## Performance

Three cold-context samples per viewport, local Chromium, 150ms network latency, 1.6Mbps download and 4× CPU throttling. Bytes below are uncompressed file sizes, including the poster. Source: `docs/validation/performance.json`.

| Measurement                                 | Mobile 390px      | Desktop 1280px       |
| ------------------------------------------- | ----------------- | -------------------- |
| LCP samples                                 | 960 / 968 / 972ms | 1860 / 1844 / 1852ms |
| CLS                                         | 0.0002            | 0.0005               |
| Initial resource bytes                      | 289,791           | 334,529              |
| Selected page image bytes, including poster | 232,024           | 326,052              |
| MP4 fetched before play                     | No                | No                   |

Both resource budgets passed: initial resources below 1MB, selected page images below 3MB. These are local lab results, not real-user p75 measurements. INP and production CDN latency were not measured. These measurements precede the lock-screen CSS revision; image and font assets remain unchanged, while HTML/CSS byte totals may differ slightly.

## Remaining deployment checks

Publication was intentionally excluded. A read-only probe of `https://www.benchyard.com` failed during TLS negotiation (`SSL_ERROR_SYSCALL`) in this environment. Therefore no claim is made that the production host currently serves these changes or has correct Range, MIME, WAF, crawler or cache configuration.

Before release, verify the actual host's TLS, guide routing, video ranges and MIME, canonical redirect, generated cache rules and crawler access. Confirm the contact mailbox is monitored and the advertised environment options match the hosted deployment. The GEO review template covers manual baseline and day-14/day-30 checks; no follow-up automation was created.

## App phone surface correction

The mobile session screenshot keeps the real application colors. Its surrounding safe areas now match `web/src/lib/theme.ts` and the session’s `data-edge-bottom="surface"`: white (`#ffffff`) in light mode and `#1c221e` in dark mode. Horizontal inset padding and the artificial inner rounded frame were removed. The video approval scene uses the same light surface. Both revised videos decoded without errors; full-length browser playback above was recorded before this cosmetic revision. Current native playback controls are covered by the website suite.

## Notification alignment and security diagram

- Push and email illustrations share a responsive height and align their top, bottom and captions with CSS subgrid. Desktop illustrations are 600px high at the reviewed 1440px viewport. The phone retains its screen aspect ratio; at 320px both illustrations shrink to about 532px high and the email uses compact spacing.
- The security figure now separates devices, the Benchyard server and the execution workspace with labeled connections, original SVG icons and explicit server-visibility and encryption boundaries. It stacks vertically on narrow screens.
- The full website suite passed all 15 checks. A subsequent 30-case focused check across Chromium, Firefox and WebKit, light/dark themes and 320/390/768/1024/1440px verified equal illustration heights, aligned tops on desktop, and no clipped email or horizontal page overflow. Evidence: `docs/validation/notification-alignment.json`.
- Reviewed light/dark screenshots: `docs/screenshots/notifications-*.png` and `docs/screenshots/security-diagram-*.png`. No video changes were needed for these homepage sections.

## Credential protection diagram revision

The security diagram now shows the specific protected-credential path from main’s `docs/features.md`, “Credentials and the keeper”: the agent sees a placeholder, the keeper holds and inserts the real credential outside the workspace, and the configured host receives the request. The service response is shown returning separately. Plain environment variables, custom gateway keys and file secrets remain explicitly outside this guarantee, and server readability is still disclosed. The security guide uses the same explanation. Section subheadings now wrap naturally without fixed narrow measures or manual line breaks. All 15 browser tests passed; light, dark and mobile diagram captures were inspected.

## Poster playback control correction — 2026-10-11

The extra teal play symbol was baked into the poster and overlapped the browser's native controls. Both poster sources now omit playback UI. The artwork uses the site's brand mark, Bricolage/IBM Plex fonts, neutral background and teal accents, with static demo duration metadata instead of a video chapter counter. `studio/render-poster.mjs` is shared by the full render and `npm run demo:poster`, so regeneration preserves the correction.

Validation: `npm run check` passed for all 14 routes. Nine focused Playwright checks passed across Chromium, Firefox and WebKit, covering media playback/pause/seek, captions, script-free markup, reflow, Range requests, MIME and caching. Poster screenshots were inspected at 1440px and 390px, with light/dark page themes. Before interaction, the poster-only load made zero MP4 requests. In the actual in-app browser, clicking the native play control started playback and the timeline advanced beyond eight seconds; the page was then restored to its poster. Review captures are in ignored `studio/output/poster-review/`. The MP4 is byte-for-byte unchanged.

## Color agent branding — 2026-10-11

Codex now uses the locally vendored LobeHub color variant throughout the homepage, agent guide, poster, app screenshots and video. Kimi Code and GLM Code color marks are included in the hero strip, planned-integration section, guide, poster and outro, with explicit Planned labels. Source and license provenance is recorded in `docs/asset-licenses.md`. SVG gradient references were checked for unique identifiers and valid targets.

The demo was recaptured using the existing isolated Linux demo binaries from product commit `6ebde5e2d4e081f9b57c87751a7a14c0e5ebb8b8`; only glyph appearance is normalized during capture. No product checkout changes were made. The disposable demo container was removed after capture. The new website MP4 is 789,079 bytes, 60 seconds, 1280×720, 30fps, yuv420p; the 1080p master was regenerated under ignored studio output.

`npm run check` passed for 14 pages. All 21 Playwright tests passed across Chromium, Firefox and WebKit, including light/dark layouts at 320–1440px, accessibility, keyboard, no-script behavior, captions and native playback. `npm run verify:media` completed the full 60-second video in each engine, with eight subtitle cues, working fullscreen and no media errors. The poster, agent strips and result/outro video frames were visually inspected.

## Complete brand palette — 2026-10-11

The website and Benchyard application share locally bundled artwork for all six displayed brands: Claude orange, Codex blue/purple, Gemini multicolor, Kimi's blue-accented letterform, ChatGLM blue, and Cursor's official 2.5D cube in its original neutral palette. Cursor's asset is from its official brand kit; its source and separate licensing are documented. Screenshot capture, poster composition and the video outro use the same artwork. The recaptured 60-second MP4 is 795,716 bytes.

The application production build and lint passed, with 223 unit tests passing and one skipped. Its actual AgentGlyph and both AgentMark sizes were rendered and inspected in light and dark themes. All 18 images loaded in each theme. Website inline gradients have ten distinct IDs and no unresolved references. The temporary application preview page and development server were removed after inspection.

Final verification passed: all 14 website pages, all 21 Playwright checks, and full 60-second playback in Chromium, Firefox and WebKit with fullscreen, eight subtitle cues and no media errors.

## Product facts, the replay and the new opening — 2026-10-11

The sections above describe the 60-second video, which is gone: the homepage's demo is a replay drawn on the page (README, "The demo, and screenshot production"). Their video measurements are history.

- **Facts.** Every claim on the homepage and in the guides was checked against product main `44744a98` and `docs/claims.md` rewritten with where. Clouds are no longer named and a person's own machine is not mentioned; `check.mjs` refuses both outside the legal pages.
- **Capture.** `npm run demo:capture` ran the fictional task in the real app at product commit `ed818788`, built from a detached worktree under `.cache/` (removed afterwards), in a disposable container that the script removed. It wrote the screenshots and `content/demo.json`. Every screenshot and the JSON were read: fictional data only. The capture itself tried the board's filters (3, 3, 6). A picture of a stopped workspace was tried and not got: the Stop button was not found within the wait, and it was left out.
- **Checks.** `npm run check`: 14 pages. `npm test`: 29 passed, 1 skipped (WebKit reaches buttons with Tab only by an OS setting), in Chromium, Firefox and WebKit. The tests drive the replay at 1440 and 390 pixels: it waits at the approval and goes no further by itself; Deny runs nothing and Ask again brings the request back; Approve from the phone and from the desktop; each of Changes, Files, Terminal and Ports; the board in its frame shows 3, 3 and 6; no page error. Keyboard only and reduced motion in Chromium and Firefox. Without scripts the finished session is on the page. Axe: no WCAG 2 A/AA or 2.1 AA violations on the homepage and guides at 360, 390 and 1280 pixels.
- **Performance** (`npm run measure`, same method as above; `docs/validation/performance.json`): mobile LCP 1280 to 1308 ms, CLS 0.0008, 191,412 initial bytes; desktop LCP 1300 to 1328 ms, CLS 0.002, 263,858 initial bytes. Budgets passed. Mobile LCP is slower than the video page's 960 to 972 ms; desktop is faster than its 1844 to 1860 ms. The script is 10,949 bytes and the board 5,354 bytes, fetched only when opened.
- **Not verified:** a real phone or tablet; the production host; anything at a real cloud or on Kubernetes; real model calls, mail or push. The scroll-linked settling of the replay was looked at in Chromium only.

## Motion — 2026-10-11

The opening arrives in order and session cards drift beside the lead; the tour's picture stays in place and changes with the step in the middle of the screen; the desktop and phone come together as they are scrolled to; headings, cards and the security diagram's parts rise as they come into view. All of it is off under reduced motion and without the script, where every part is in its place.

`npm run check`: 14 pages. `npm test`: 29 passed, 1 skipped. A first run failed three tests: with motion on, the tour and the sliding phone made the page wider than the screen at 1120 and 1280 pixels; both were fixed and the run repeated. `npm run measure`: mobile LCP 1264 to 1272 ms, CLS 0.0007; desktop LCP 1264 to 1268 ms, CLS 0.0015. The motion was looked at in Chromium at 1440 pixels only; no other engine or real device.
