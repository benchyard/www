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

| Measurement | Mobile 390px | Desktop 1280px |
| --- | --- | --- |
| LCP samples | 960 / 968 / 972ms | 1860 / 1844 / 1852ms |
| CLS | 0.0002 | 0.0005 |
| Initial resource bytes | 289,791 | 334,529 |
| Selected page image bytes, including poster | 232,024 | 326,052 |
| MP4 fetched before play | No | No |

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
