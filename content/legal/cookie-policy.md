# Benchyard Cookie Policy

Version: 0.2 | Last updated: October 10, 2026

Benchyard uses cookies and similar browser technologies as described below. See the [Privacy Policy](privacy-policy.md) for broader processing and contact information.

## 1. Website and application

We do not use advertising trackers on our marketing site. Hosting and network services may process IP addresses and request metadata to deliver and protect the site. External payment and provider pages have their own storage practices.

The Benchyard application uses cookies to maintain sign-in and recognize a device, and browser storage for requested preferences and interface state. Preview applications can set their own cookies on their separate origins. An enabled payment component or external provider page may use its own storage under that provider's notice.

## 2. Application inventory

The names below describe the current HTTPS application implementation. Browser controls, revocation, and production settings may shorten the stated maximums.

| Technology or name | Purpose | Current lifetime |
| --- | --- | --- |
| `__Host-benchyard_login` cookie | Authenticate a browser's account session | Up to 30 days; invalidated earlier on relevant sign-out or security actions |
| `__Host-benchyard_device` cookie | Associate the browser with a known device | Browser expiry up to 5 years; clearing browser data removes it. This is not a promise of a five-year authenticated session |
| `__Host-benchyard_approved` cookie | Remember that a browser was approved under account device-security controls | Browser expiry up to 5 years; approval can end earlier through revocation or security settings |
| `__Host-benchyard_preview` cookie | Authenticate access to one workspace preview origin | Up to 12 hours; associated account-session revocation also ends access |
| `benchyard.lang`, `benchyard.theme`, and related preference storage | Remember requested language and appearance | Until replaced or cleared; no fixed browser expiry |
| Local-storage keys beginning `benchyard.auth.`, `benchyard.folders.`, `benchyard.cache.`, `benchyard.sidebar.ws.`, and account interface state | Remember connection status, recent folders, and interface information | Until updated or cleared; designated account caches are removed on sign-out |
| Session storage | Prevent repeated preview redirects, remember temporary interface decisions, and manage reload behavior | Normally until the browser tab/session ends or the app clears it |
| Service worker registration and push permission | Receive enabled push notifications and open the relevant session | Until removed, revoked, or replaced; the current worker is not an offline cache of workspace contents |

This table covers Benchyard application storage. Payment components, separately hosted previews, and provider sign-in pages may use additional storage described in their own notices. Contact hello@benchyard.com for questions about a specific cookie or provider. A third-party notice does not replace any choice we must obtain for technologies embedded on our own pages.

## 3. Choices

You can delete or block cookies and site storage through your browser, change supported preferences in the app, and revoke notifications through browser or operating-system settings. Blocking authentication cookies will prevent sign-in or preview access. Clearing storage may remove preferences and device recognition and require you to sign in again.

Necessary technologies support functions you request. Where a technology is not covered by an applicable exemption, we will obtain the required choice before using it. Device recognition does not extend the lifetime of your account session, and you can remove an approved device through the available security controls.

We do not rely on continued browsing as consent to advertising or optional tracking. If optional analytics or advertising is introduced, we will update this inventory and provide any required prior consent and withdrawal controls. Contact hello@benchyard.com about storage or privacy choices.
