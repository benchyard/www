# Benchyard's homepage

The public page for Benchyard: persistent workspaces where coding agents (Claude Code, Codex, Cursor, Gemini CLI) keep running, watched and steered from a browser or a phone. Benchyard is a hosted service; its console is at `https://console.benchyard.com`. The product's code is not public, and the page links to no repository.

A static site: one HTML page per language, one stylesheet, pictures and fonts. No backend, no JavaScript on the page, nothing loaded from another site, no trackers.

## Why this stack

Plain HTML and CSS, put together by a small Node script. It has two development dependencies, used only while building: `sharp` makes the pictures and `lightningcss` minifies the stylesheet. The page itself needs nothing, and the host that serves it installs nothing. The page is a single document whose words change far more often than its structure; a framework would add a build chain and a dependency tree to maintain for no gain in what a visitor gets. If the site grows to many pages (docs, a blog), moving `src/page.mjs` and `content/` into Astro is a small step.

## Run, build, check

Needs Node 20 or later.

```sh
npm ci          # once: the two libraries the build uses
npm run dev     # build, then serve dist/ at http://localhost:4321 (PORT=... to change)
npm run build   # build into dist/
npm run check   # build, then check links, pictures, headings, that nothing comes from another site,
                # that changing files are named by their content and nothing is left over,
                # and that the page names no repository and doesn't call the product open source
```

## Deploy

`dist/` is the whole site: upload it to any static host (Cloudflare Pages, Netlify, an S3 bucket behind a CDN, nginx). The build command is `npm run build` and the output folder is `dist`.

Set the two cache rules below at the host ("Caching").

## Caching

A file that can change is published in `dist/assets/` under a name that carries a hash of its content (`styles.3682ede8.css`, and likewise each font and picture); the pages and the stylesheet refer to those names, and the stylesheet is minified. A changed file is therefore a new address, and an old page never meets a new stylesheet. Two rules for the host:

| What | Header |
|---|---|
| `/assets/*` | `Cache-Control: public, max-age=31536000, immutable` |
| everything else (the pages, `robots.txt`, `sitemap.xml`, the icons, `social-card.png`) | `Cache-Control: no-cache` (kept, and asked about each time) |

- `dist/_headers` says exactly this for the hosts that read such a file (Cloudflare Pages, Netlify). Any other host ignores it and is set by hand (nginx: a `location /assets/` block with the first header; S3 behind a CDN: the header as object metadata on `assets/`).
- The files outside `assets/` keep their names because something asks for them by name: browsers (`favicon.ico`), crawlers (`robots.txt`), other sites (`social-card.png`, whose address they keep: to make them fetch a new card, give it a new name in `src/pictures.mjs` and `src/page.mjs` by hand).
- The build empties `dist/` first, so old assets don't pile up; a host that uploads `dist/` as a whole (Pages, Netlify) drops them too. One that only adds files (a bucket synced without deleting) keeps old assets, which harms nothing.
- The page's HTML is not minified: it is about 6 KB compressed, and the host's own gzip or Brotli does more than removing spaces would. The page has no JavaScript.
- `npm run dev` sends the same two headers, to see the behaviour locally.

## Where things are

| Path | What |
|---|---|
| `content/en.mjs` | Every word on the page. Edit text here, not in the template |
| `src/page.mjs` | The page's structure, as a function of the words, and the three addresses it points at: `site`, `consoleAddress`, `contactAddress` |
| `src/styles.css` | The stylesheet. Colours and fonts are the app's own; light and dark follow the visitor's system |
| `src/fonts/` | The fonts (Latin subsets), published in `assets/` under hashed names |
| `public/` | Copied as it is, names kept: icons, `robots.txt`, `sitemap.xml`, the fonts' licences (`fonts/LICENSES.md`) |
| `src-img/` | The pictures' originals: PNG screenshots of the app. Not published |
| `src/pictures.mjs` | Makes what is published from them while building: see "The pictures" |
| `build.mjs`, `serve.mjs`, `check.mjs` | Build, local preview, checks |
| `docs/screenshots/` | How the built page looks at 1280, 390 and 360 wide, light and dark |

## Changing the text

The page says only what Benchyard does today, as a hosted service. Its sources are `docs/features.md`, `docs/roadmap.md` and `docs/storage.md` in the product's repository, which is private; a claim that isn't supported there doesn't belong here, and what is on the roadmap is called "planned". No invented numbers, quotes or customer names.

What the page must keep saying, because the reader's data is on Benchyard's servers: provider sign-ins, API keys and secrets are held by the server and Benchyard can read them; the server can read the content of sessions. It claims no end-to-end encryption, certification or uptime.

The two things a visitor can do are "Request access" (a mail to `contactAddress`, with a subject and two questions from `access` in the content file) and "Sign in" (to `consoleAddress`). The console takes no sign-ups.

## Adding a language

Copy `content/en.mjs` to `content/<code>.mjs`, translate the values (keys and structure stay), and add the code to `languages` in `build.mjs`. The first language is served at `/`, the others at `/<code>/`. The fonts in `src/fonts` are Latin subsets: a language in another script needs its subsets added (or falls back to the system's fonts, which the stylesheet allows).

## The screenshots

`src-img/` holds screenshots of the real app, taken from a throwaway local server with stand-in agents and made-up data (the account "alice", the workspaces "api" and "web-app"). Nothing in them is a real account, address or host. To retake them after the app changes: run the product's local test server (`scripts/e2e-local.sh` in the product's repository shows how), drive it with Playwright at 1280×800 and at a phone's size in light and dark, and replace the files in `src-img/` under the same names (PNG, at two device pixels to one); `src/page.mjs` carries each picture's pixel size.

## The pictures

The build turns each PNG in `src-img/` into what the page loads (`src/pictures.mjs`), so the originals are the only pictures in the repository:

- **WebP in two sizes:** the original's own size without loss (for screens with two device pixels to one; for flat screenshots lossless WebP is under half the PNG and smaller than a lossy one at high quality, and the text stays exact), and half of it at quality 90. The page offers both (`srcset` with `sizes`), and a dark and a light one by the visitor's system.
- **The social card** (`social-card.png`, 1280 by 800): a PNG, since crawlers don't reliably take WebP, under a name that never changes, since other sites keep its address. It is made from `session-approval-light.png`; to show another picture, change `card` in `src/pictures.mjs`.
- Conversions are kept in `.cache/` (not in git), named by the original's content and the settings, so a build converts only what is new or changed: about 5 seconds from nothing, well under one afterwards.

## Where it is served

The site's address is `https://www.benchyard.com` (`site` in `src/page.mjs`, `public/robots.txt`, `public/sitemap.xml`): canonical and social-card addresses are made from it. The host must send `benchyard.com` on to `www.benchyard.com`; that is the host's setting, not a file here.

The console is at `https://console.benchyard.com` (`consoleAddress` in `src/page.mjs`). Previews of workspaces (a port of a workspace opened in the browser) must be served from a domain that is not the console's host and not under it: a page an agent serves must not share an origin, or cookies, with the console. The homepage names no preview domain.

## To decide

- **The contact address.** The page sends "Request access" and every "write to us" to `hello@benchyard.com` (`contactAddress` in `src/page.mjs`). Confirm that this mailbox exists and is read before the page is published, or change the constant.
- **Where it is hosted** (any static host; nothing here names one).
- **Licence** for this repository: see `LICENSE.md`.
- **The preview domain** for workspaces (see "Where it is served"); the page doesn't mention previews until there is one.
- **Which kinds of workspace the hosted service offers.** The page lists containers, cloud machines at Google Cloud and AWS, and a person's own machine "where this is turned on for your account". Take out what the service doesn't offer.
- **Pricing.** The section says access is by request and that plans will be published later, with no figures.
- **Terms and a privacy notice.** There are none, and the page links to none; a hosted service that holds people's credentials and sessions will need both.
- **Analytics:** none. If wanted, one served from the site's own host keeps the "nothing from another site" property.
