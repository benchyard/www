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

## Screenshot density — 2026-10-11

The capture takes desktop screenshots at 4× and phone screenshots at 3×, and the hero crop keeps that density. The build and the HTML share one list of widths and skip any width the PNG does not cover, so nothing is upscaled. The pictures on the page are still the 1× capture from product `ed818788`. A denser capture from earlier the same day showed the previous product UI (no list/cards toggle, no idle-policy bar) and was not published. The homepage demo remains the replay; no video was added.

`npm run check` passed for 14 pages. The density check passed in Chromium, Firefox and WebKit at 390, 700 and 1440 pixels, light and dark: each screenshot used the largest published width that screen needs. The rest of the site suite passed with it.

## Picked up at product `f93793b8` — 2026-10-11

- **Capture.** `npm run demo:capture` ran the task again in the real app at product commit `f93793b8`, from a detached worktree that was removed afterwards, in a container the script removed. The screenshots (4× on the desktop, 3× on the phone) and `content/demo.json` are from that run. The capture approved `npm test` from the phone while the MacBook drove, and tried the board's filters (3, 3, 6).
- **The replay** was redrawn to the app's shape at that commit: the menu with its bell, search, New session, Schedules, Rules, skills & tools, Secrets and the workspaces; on the phone the quiet line "MacBook is driving. Sending from here takes over." in place of the bar with Take over. It was compared with the new screenshots by eye at 1440 pixels.
- **Words.** "Credits" in place of "machine credits" on the site and in the two policies that said it. The site no longer says credits can be bought: buying was run only in the payment provider's sandbox. Which device drives a session is said as the app says it.

## Clarity-first website — 2026-10-18

Implemented general-agent positioning, persistent/team/security proof points, a unified desktop/phone scene, verified-only hero integrations, feature dropdown navigation and stable subsection anchors. Notifications now include shared Mac/iPhone setup instructions and original HTML/CSS illustrations, manual device/step controls, direct-link expansion and a no-script fallback. Added the guide directory and invited-user getting-started guide. Updated social artwork and metadata. The current integration registry feeds both homepage and agent guide.

All 16 routes pass `npm run check`; `npm run format:check` and `git diff --check` pass. The full browser run passed 42 tests, skipped the existing WebKit replay keyboard test, and exposed two mobile navigation failures in WebKit. Safari can emit focusout with a null relatedTarget during a pointer action; immediate dismissal was swallowing link activation. Dismissal now preserves that action, while explicit outside clicks and focus moving elsewhere still close menus. A subsequent focused run passed all 15 navigation, walkthrough, responsive-layout and accessibility checks across Chromium, Firefox and WebKit, including both formerly failing cases. Existing replay, density, cache and policy checks passed in the full run. The WebKit keyboard skip is an existing OS Tab-navigation limitation, not a claim of physical-device coverage.

The new desktop-disclosure tests also caught low-contrast fading in the old scroll-following tour. Text and section content now remain fully readable during anchor navigation. Visual inspection covered the desktop header and disclosure, the workspace/phone scene, light/dark mobile hero, mobile Add to Home Screen and launch illustrations, and the regenerated social card. The 1120px screenshot candidate avoids transferring a 1440px lossless image to a smaller 1× desktop display while preserving high-density variants.

### Remaining release checks

These are not represented by automated browser results:

- **Comprehension study:** recruit five target users unfamiliar with Benchyard. After five seconds ask “What is Benchyard?” Target: four identify an agent cloud workspace, rather than a new model or notification utility. After twenty seconds ask why they would use it and how their team participates. Target: four describe cloud execution and notification-led return; three recognize shared team configuration. After exploration ask whether teammates can open each other's workspaces and whether every secret is protected. Target: no unsupported assumption. Record verbatim responses and revise the hero if category understanding fails. No participants have been recruited or results collected by this implementation.
- **Physical devices:** on a real Mac and iPhone, add the console as a web app, grant permission, send a supported task event and verify that its notification opens the correct authenticated session. Check denied permission and signed-out handling. No native delivery claim is made from desktop Playwright or illustrated scenes.
- **Production:** verify HTTPS, canonical redirects, direct guide routes, resource MIME and cache headers, and confirm existing contact mailboxes work. This change has not been deployed. Preserve old hashed assets during rollout; roll back the static deployment if routing or resources regress.

The historical product review date remains unchanged because this website revision is not a complete new backend audit. No analytics, application backend, pricing, Cloud API or product authentication change was made.

### Final local performance

`npm run measure` passed all six cold-context samples after adding the 1120px image candidate. Local Chromium, 150 ms network latency, 1.6 Mbps download and 4× CPU throttling:

| Metric | Mobile (390px) | Desktop (1280px) |
| --- | --- | --- |
| LCP samples | 1476 / 1452 / 1440 ms | 1548 / 1572 / 1564 ms |
| CLS | 0.0135 | 0.0027 |
| Initial uncompressed resource bytes | 263,735 | 341,845 |
| Selected page image bytes | 194,256 | 293,864 |
| Preview board fetched before opening | No | No |

These are lab measurements, not field p75 or INP. `studio/measure.mjs` now enforces the planned LCP ≤ 2.5 seconds and CLS < 0.1 thresholds as well as the existing resource budgets. The earlier desktop measurement of roughly 2.8 seconds failed the new budget and was corrected by image sizing, not by loosening the threshold. The source report is `docs/validation/performance.json`.

A final six-case run passed desktop disclosures and actual emulated touch events in all three browser engines. Touch verification uses `hasTouch: true` and `.tap()` for the menu, setup anchor and device selector; it does not stand in for native push delivery. All changed code passes formatting and whitespace checks.

### Notification presentation restored — 2026-10-18

At the owner's request, restored the phone push-notification and email illustrations, replacing the installed Mac/Home Screen scene. The secondary setup walkthrough remains. No Dock is shown in the hero. Removed the unused app-experience renderer and styles. All 16 routes pass build checks; Chromium dark-theme mobile (390px) and desktop (1440px) layout and accessibility checks pass. Earlier installed-device visual notes describe a superseded design.


## Workspace feature sync — 2026-10-26

Reviewed against product main `b7ccaed3` (v0.9.0). Both repositories' `origin/main` refs were freshly fetched and already matched their checkouts. Homepage cards, FAQ, workspace and security guides, and workspace navigation now cover machine types, sudo, disk growth, installed tools, Workbench layouts, desktop access, SSH and port forwarding. Container networking is qualified separately from Docker on machine types with sudo. Product evidence is in `docs/claims.md`; screenshots and the interactive replay keep their original capture provenance.

- `npm run check`: passed, all 16 routes, anchors, metadata, media, resource hashes and cache rules.
- `npm run format:check` and `git diff --check`: passed.
- Chromium: all 16 existing cases passed across the main run and focused reruns. The light-theme layout/accessibility case needed a 240-second test timeout on this shared workspace.
- Firefox: all 16 existing cases passed across two runs; the site cases used a 240-second timeout.
- Coverage includes six page routes at 320/360/390/768/1024/1280/1440px in light/dark themes, axe WCAG checks, keyboard navigation, no-script use, 200% text reflow, replay approval/denial and its issue-board filters, guides, legal links and cache behavior.
- Additional browser interactions passed at 1440px and 390px: navigation from the guide directory to the workspace section, six machine cards, both new FAQ disclosures, software/SSH/ports/containers table-of-contents links and the security isolation section. Desktop and mobile cards were visually inspected.
- The workspace lacked browser libraries. They were installed without root in the external Pixi `browser-libs` environment. Chromium's no-script diff initially had zero height because its fallback fonts were not configured; explicit Fontconfig settings resolved it without changing the website's styles. To reproduce browser runs here, prefix commands with `FONTCONFIG_FILE=/workspace/home/.pixi/envs/browser-libs/etc/fonts/fonts.conf FONTCONFIG_PATH=/workspace/home/.pixi/envs/browser-libs/etc/fonts LD_LIBRARY_PATH=/workspace/home/.pixi/envs/browser-libs/lib`.
- WebKit could not start with the available runtime libraries, so no WebKit result is claimed. No physical-device, live product-runtime or production-host verification was performed.

New local browser captures are under ignored `studio/output/workspace-refresh/`; historical tracked screenshots were preserved. Changes remain uncommitted and unpublished. Local acceptance preview: `http://localhost:4322`; restart with `cd /workspace/project/www && PORT=4322 LIVE_RELOAD=0 node serve.mjs` after building.


## Open registration and promotions — 2026-10-26

Product main was pulled again and already matched `origin/main` at `b7ccaed3` (v0.9.0). Existing workspace-feature changes were retained. The hosted public endpoint confirmed open registration, 3 trial credits lasting 7 days and 2 additional referral credits lasting 30 days. Details and reward eligibility are recorded in `docs/claims.md`.

The homepage now has a prominent offer link, two current offer cards and a native disclosure for first-step rewards, referrals, first-purchase bonuses and codes when offered. Shared Sign up CTAs lead to the console's `/register`; getting-started copy, FAQ and the footer match open registration. The link checker now permits the two specific console paths `/register` and `/billing`.

- `npm run check`: all 16 pages passed. `npm run format:check` and `git diff --check`: passed.
- Seven focused Chromium regression tests passed: desktop disclosure/keyboard behavior, mobile navigation and walkthrough, section order/no-script setup, touch interactions, keyboard navigation, no-script/200% text reflow and business contact navigation.
- Additional Chromium browser checks passed at 320, 390 and 1440px in light/dark themes: hero offer navigation, visible Sign up CTA, both offer cards and expiry periods, all four additional reward cards, opening the disclosure and the Billing link. No horizontal overflow, JavaScript errors or axe WCAG 2 A/AA and WCAG 2.1 AA violations were reported. Native offer disclosure and registration links also worked with JavaScript disabled.
- All 16 routes were visited at 390px to verify shared Sign up links, removal of Request access CTAs and page overflow. FAQ and getting-started navigation were exercised.
- Clicking the getting-started registration link reached the live console `/register`, where the email field and 3-credit trial notice were visible. No email, captcha answer or registration form was submitted.
- Desktop/mobile offer screenshots were visually reviewed. New captures and the browser results are under ignored `studio/output/promotions/`. Historical screenshots were preserved.

The preview is running at `http://localhost:4322` with live reload disabled. To restart: `cd /workspace/project/www && PORT=4322 LIVE_RELOAD=0 node serve.mjs`. These changes are local, uncommitted and unpublished. Current verification used Chromium; no new Firefox, WebKit or physical-device result is claimed for this revision.

## Homepage readability revision — 2026-10-26

The installed-app desktop and phone illustrations now have equal 530px heights when displayed side by side. The replay heading stays on one line at desktop widths; narrower screens retain readable wrapping. The shared header has a single Sign in / Sign up button. The hero offer is a contrasting banner with a large trial-credit amount and a direct link to eligibility details.

The workspace feature grid is now four illustrated sections covering sessions and persistence, browser/SSH/ports, desktop/containers/snapshots, and machine choices. Existing capability boundaries remain in the copy. Diagram labels use the site's content module; the illustrations need no JavaScript.

Validation: static checks passed for all 16 pages, formatting and whitespace checks passed. Three Chromium regression cases passed (desktop keyboard/disclosures, mobile navigation/device walkthrough, and no-script positioning). Browser interactions checked the offer disclosure and anchor at 320, 390, 768, 1024 and 1440px with no horizontal overflow; desktop device heights and a single-line heading were measured. Light and dark axe WCAG checks passed. Screenshots under ignored `studio/output/layout-refresh/` were visually reviewed. The preview remains at http://localhost:4322; restart with `cd /workspace/project/www && PORT=4322 LIVE_RELOAD=0 node serve.mjs` after building. No commit or deployment was made.

## Workspace configurations — 2026-10-26

Added the owner-confirmed 32 CPU / 64 GB size highlight and configuration guidance to the homepage machine section, plus a six-row comparison table in the workspace guide. Re-read current product `b7ccaed3`; code sources and the provenance of the numeric offer are recorded in `docs/claims.md`.

`npm run check` passed for 16 routes; formatting and diff whitespace checks passed. Chromium exercised homepage → configuration guide → homepage at 320, 390, 768 and 1440px, checked the six table rows and absence of horizontal overflow, and passed scoped axe WCAG 2/2.1 A/AA checks on both changed sections in light and dark themes. Desktop/mobile screenshots were visually inspected and are under ignored `studio/output/configurations/`. Preview: http://localhost:4322/#workspace-machines. Changes remain uncommitted and unpublished.

### Workspace-choice correction

Removed the numerical maximum-size emphasis after the owner's clarification. Container/virtual-machine comparison now comes first, with configuration differences below it. Homepage and guide no longer advertise 32 CPU / 64 GB. Rebuilt all 16 routes successfully; Chromium again passed homepage/guide navigation and overflow checks at 320, 390, 768 and 1440px, plus scoped light/dark accessibility checks. Updated desktop capture was visually reviewed.

### Consolidated workbench section

Grouped Changes, Git graph, Files, Terminal and Ports into one homepage Workbench section, using one overview diagram and shared layout explanation. SSH and local port forwarding are a single supporting paragraph. The Workspace navigation now calls this section “Workbench & tools”; the existing anchor remains valid. Product evidence: `docs/features.md`, Workbench, at `b7ccaed3`.

Build/static checks passed for all 16 routes, as did formatting and whitespace checks. Chromium verified the five panel labels and homepage-to-tools-guide navigation at 320/390/768/1440px without overflow. Scoped light/dark axe checks passed. Desktop/mobile screenshots under ignored `studio/output/workbench/` were visually reviewed. Preview remains http://localhost:4322/#workspace-tools.

### Session continuity and ongoing-work revision

Rebuilt the first narrative section around per-session agent/model choices, independent worktrees, cross-agent record handoff, workspace moves, forks and imports. Replaced the generic app-building section with recurring schedules, live intervention and recovery. Both have new diagrams and linked guide sections with transfer/rollback boundaries; navigation labels match the new sections. Container runtime details remain with workspace environment choices.

All 16 built routes passed static checks; formatting and whitespace checks passed. Chromium exercised both homepage → guide → homepage flows at 320, 390, 768 and 1440px, including absence of horizontal overflow and removal of the old generic heading. Fixed a narrow-screen diagram overflow found during verification. Scoped axe checks passed for both homepage sections and both guide sections in light/dark themes. Desktop and mobile captures under ignored `studio/output/session-stories/` were visually inspected. No production publishing or live agent-operation tests were performed.

### Homepage focus and visual hierarchy

Replaced the verbose session narrative with a local-computer → Bring them over → Benchyard diagram and explicit Continue elsewhere choices for moving the same session or continuing with another agent. Agent/model selection, worktrees and forks remain a short supporting line; detailed transfer boundaries remain in the guide. The workbench heading now names chat and project tools directly. Removed the inherited top border from figure headings inside the workspace stories. Ongoing work is three short visual steps. Replaced repeated machine/configuration paragraphs with container and VM illustrations plus four capability icons.

All 16 routes passed build/static checks; formatting and whitespace checks passed. Chromium verified import/continuation labels, five workbench panels, two machine illustrations, a computed zero-width top border on the workbench figure heading, all four guide links and no overflow at 320/390/768/1440px. Scoped light/dark axe checks passed. Desktop/mobile and dark workbench screenshots under ignored `studio/output/focused-stories/` were visually reviewed. The preview remains http://localhost:4322/#workspace-context; changes are uncommitted and unpublished.

### Decorative separator cleanup

Removed repeated top dividers from captions, feature sections, card text, secondary notes and setup content, and bottom dividers from workbench descriptions, FAQ rows and guide sections. Spacing and enclosing card/illustration borders remain. Chromium checked zero-width decorative borders at 390/1440px in light/dark themes, exercised FAQ disclosure and configuration-guide navigation, and confirmed guide reflow. The dark desktop device illustration was visually inspected under `studio/output/dividers/`. All 16 routes passed static checks and diff whitespace checks passed.

## Pricing and latest product screenshots — 2026-10-26

Added Pricing to the shared header/navigation and separated Personal (credits or personal plans), Team (plans/seats) and Business (custom proposal). The trial/referral offers now have their own `#offers` anchor inside the pricing section. Removed installation-admin configuration framing from customer-facing feature explanations. Paid prices are linked to Billing rather than inferred from product defaults.

Built product main `b7ccaed3d212664d032eb036acab9459b126b6cb` in an isolated worktree and recaptured all 17 `src-img` assets, including light/dark desktop and phone UI, the hero crop and social artwork. The normal fictional account connected the local test agents, created sessions, approved the command from the phone viewport, ran four passing fixture tests and exercised all three preview filters. Updated `content/demo.json` from that run. No real model call or production account mutation was involved. The disposable capture container was removed afterwards.

`npm run check` passed for all 16 routes. Formatting and diff whitespace checks passed. Chromium checked Pricing navigation from guides at 390/1280/1440px, offer expansion, team Billing and business contact targets; four existing navigation/contact/no-script regression cases passed. Final homepage checks at 320/390/768/1440px confirmed no horizontal overflow, successful decoding of all images (including disclosed settings), a single header account button, equal desktop/phone illustration heights when side by side and a single-line desktop replay heading. Full-homepage light/dark axe WCAG 2/2.1 A/AA checks passed. The capture images, responsive homepage sections and social card were visually reviewed; local review captures are under ignored `studio/output/`.

Preview: http://localhost:4322 (Pricing: /#pricing). After a workspace restart, run `cd /workspace/project/www && PORT=4322 LIVE_RELOAD=0 node serve.mjs`; run `npm run build` first if the source changed. Changes remain uncommitted and unpublished.

The four replay/cache regression cases also passed in Chromium: desktop and phone approval/denial/retry, Changes/Files/Terminal/Ports interactions, the preview's filters, keyboard/reduced-motion behavior and served script/cache headers.

## Composer agent and model — 2026-10-27

Recaptured the homepage product images against Benchyard `b9ffce2618984cdfc4cb9fb3be618d6c4de89034` (v0.9.2). The scripted Codex fixture displays GPT-6-Astra, and the desktop chat panel is wide enough to show the selected agent. Ask first remains consistent with the pictured approval request. The interactive replay uses the same recorded agent/model metadata inside its composer. Capture assertions check both labels; the disposable capture container and isolated product worktree were removed.

`npm run check` passed for all 16 routes. Chromium verified composer labels, approval interaction and absence of horizontal overflow at 320/390/1440px; scoped light/dark axe checks passed. Fixed the replay's light-theme added-line contrast found during these checks. All four existing replay/cache regression tests passed, covering desktop/phone approval, denial/retry, project panels, preview filters, keyboard/reduced-motion behavior and cache headers. Formatting and diff whitespace checks passed. Product captures and responsive composer screenshots were visually reviewed. Preview: http://localhost:4322. This change has not been committed or published.
