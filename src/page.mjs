import { workspaceSections } from "./workspace-sections.mjs";
import { navigation } from "./navigation.mjs";
import { walkthrough } from "./walkthrough.mjs";
import { deviceDocks } from "./device-docks.mjs";
import { securityDiagram } from "./security-diagram.mjs";
import { lockScreenMarkup, statusIcons } from "./lock-screen.mjs";
import { card, pictureWidths } from "./pictures.mjs";
import { mark } from "./brand.mjs";
import { agentMark } from "./agents.mjs";
import { demo } from "./demo.mjs";
import { guides, reviewed, transcript } from "../content/guides.mjs";
import { policies } from "../content/legal.mjs";
export const site = "https://www.benchyard.com";
export const consoleAddress = "https://console.benchyard.com";
export const contactAddress = "hello@benchyard.com";
export const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const mailto = (subject, lines) =>
  `mailto:${contactAddress}?subject=${encodeURIComponent(subject)}&amp;body=${encodeURIComponent(lines.join("\n\n"))}`;
const access = (t) => consoleAddress + t.access.path;
const button = (t) =>
  `<a class="btn btn-primary" href="${access(t)}">${esc(t.access.label)} <span aria-hidden="true">↗</span></a>`;
export function shot(
  at,
  name,
  alt,
  w = 1440,
  h = 900,
  {
    priority = false,
    eager = false,
    dark = true,
    sizes = "(min-width: 1200px) 1120px, 92vw",
  } = {},
) {
  const set = (theme) =>
    pictureWidths(name)
      .map((width) => `${at(`img/${name}-${theme}-${width}.webp`)} ${width}w`)
      .join(", ");
  return `<picture>${dark ? `<source type="image/webp" media="(prefers-color-scheme: dark)" srcset="${set("dark")}" sizes="${sizes}">` : ""}<img src="${at(`img/${name}-light-${pictureWidths(name)[0]}.webp`)}" srcset="${set("light")}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${priority ? 'fetchpriority="high"' : ""} loading="${eager || priority ? "eager" : "lazy"}" decoding="async"></picture>`;
}
const phone = (content) =>
  `<div class="iphone"><div class="phone-status" aria-hidden="true"><span>9:41</span><span class="phone-indicators">${statusIcons}</span></div><div class="island" aria-hidden="true"></div><div class="phone-screen">${content}</div><span class="phone-home" aria-hidden="true"></span></div>`;
const cards = (items, ids = []) =>
  `<ul class="cards">${items.map(([title, body], i) => `<li ${ids[i] ? `id="${ids[i]}"` : ""} data-in><h3>${esc(title)}</h3><p>${esc(body)}</p></li>`).join("")}</ul>`;
const heading = (label, title, lead = "") =>
  `<div class="section-heading" data-in><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ""}</div>`;
function shell(
  t,
  at,
  body,
  {
    path = "/",
    title = t.meta.title,
    description = t.meta.description,
    script = false,
  } = {},
) {
  const nav = t.nav
    .map(([id, label]) => `<li><a href="/#${id}">${label}</a></li>`)
    .join("");
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f2f3ef" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#111513" media="(prefers-color-scheme: dark)"><link rel="canonical" href="${site}${path}"><meta property="og:url" content="${site}${path}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:site_name" content="Benchyard"><meta property="og:type" content="website"><meta property="og:image" content="${site}/social-card.png"><meta property="og:image:width" content="${card.width}"><meta property="og:image:height" content="${card.height}"><meta property="og:image:alt" content="Benchyard: secure cloud workspaces for agents and teams"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${at("fonts/bricolage-grotesque-latin-wght-normal.woff2")}"><link rel="preload" as="font" type="font/woff2" crossorigin href="${at("fonts/ibm-plex-sans-latin-400-normal.woff2")}"><link rel="stylesheet" href="${at("styles.css")}"><script defer src="${at("navigation.js")}"></script>${script ? `<script src="${at("fx.js")}"></script><script defer src="${at("site.js")}"></script>` : ""}</head><body>
 <a class="skip" href="#main">Skip to content</a><header class="top"><div class="wrap top-in"><a class="brand" href="/" aria-label="Benchyard home">${mark}<span>Benchyard</span></a><nav class="desktop-nav" aria-label="Main navigation"><ul>${navigation(t.nav, "desktop")}</ul></nav><div class="top-actions"><a class="btn btn-primary account-entry" href="${consoleAddress}">${esc(t.access.accountLabel)} <span aria-hidden="true">↗</span></a></div><details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation"><ul>${navigation(t.nav, "mobile")}<li><a href="/guides/">Guides</a></li></ul></nav></details></div></header>
 <main id="main" tabindex="-1">${body}</main><footer class="bottom"><div class="wrap footer-grid"><div><a href="/" class="brand">${mark}<span>Benchyard</span></a><p>Keep work moving.<br>Come back when it needs you.</p></div><nav aria-label="Product"><h2>Product</h2><ul>${nav}<li><a href="/#offers">${esc(t.promotions.nav)}</a></li></ul></nav><nav aria-label="Guides"><h2>Guides</h2><ul><li><a href="/guides/">All guides</a></li>${guides.map((g) => `<li><a href="/guides/${g.slug}/">${g.title}</a></li>`).join("")}<li><a href="/guides/workspaces/#demo-transcript">The demo, step by step</a></li></ul></nav><nav aria-label="Contact"><h2>Get in touch</h2><ul><li><a href="${access(t)}">${esc(t.access.label)}</a></li><li><a href="/#business">For Business</a></li><li><a href="mailto:${contactAddress}">${contactAddress}</a></li><li><a href="/#faq">Questions</a></li></ul></nav></div><div class="wrap legal"><nav aria-label="Legal"><ul>${policies.map((policy) => `<li><a href="/legal/${policy.slug}/">${esc(policy.label)}</a></li>`).join("")}</ul></nav><p>Claude, Codex, Cursor, Gemini, Kimi, GLM, DeepSeek and MiniMax are trademarks of their respective owners. Benchyard is not affiliated with or endorsed by their providers. Product information reviewed <time datetime="${reviewed}">${reviewed}</time>.</p></div></footer></body></html>`;
}
export function render(t, { asset } = {}) {
  const at = (name) => "/" + asset(name);
  const names = t.agents.items
    .map(
      ([id, name]) => `<span class="agent-name">${agentMark(id)}${name}</span>`,
    )
    .join("");
  let desktop = shot(
    at,
    "session-approval",
    "Codex session with three changed files, a readable filter diff and a test command awaiting approval.",
    1440,
    900,
    {
      priority: true,
      sizes: "(min-width: 1200px) 980px, (min-width: 701px) 85vw, 92vw",
    },
  );
  desktop = desktop.replace(
    "<picture>",
    `<picture>${["dark", "light"]
      .map(
        (theme) =>
          `<source type="image/webp" media="(max-width: 700px)${theme === "dark" ? " and (prefers-color-scheme: dark)" : ""}" width="560" height="400" srcset="${pictureWidths(
            "hero-detail",
          )
            .map(
              (width) =>
                `${at(`img/hero-detail-${theme}-${width}.webp`)} ${width}w`,
            )
            .join(", ")}" sizes="92vw">`,
      )
      .join("")}`,
  );
  const mobile = shot(
    at,
    "phone-approval",
    "The same Codex session on a phone, with Deny and Approve controls for npm test.",
    390,
    740,
    { sizes: "(min-width: 701px) 248px, 278px" },
  );
  return shell(
    t,
    at,
    `
 <section class="lede" id="top"><div class="wrap"><h1>${esc(t.hero.title)}</h1><p class="lead">${t.hero.lead}</p><ul class="hero-proof">${t.proof.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join("")}</ul><a class="launch-offer" href="#offers"><span class="offer-credit"><strong>${esc(t.promotions.bannerAmount)}</strong><span>${esc(t.promotions.bannerUnit)}</span></span><span class="offer-copy"><span class="offer-label">${esc(t.promotions.bannerLabel)}</span><strong>${esc(t.promotions.bannerTitle)}</strong><small>${esc(t.promotions.bannerTerms)}</small></span><span class="offer-link">${esc(t.promotions.teaser)} <span aria-hidden="true">→</span></span></a><div class="agent-strip" aria-label="Supported agents"><span class="works-with">Works with</span>${names}</div></div><figure class="stage hero-scene" id="devices"><div class="frame frame-desktop">${desktop}</div><div class="hero-phone">${phone(mobile)}</div><figcaption>The same session in a dedicated window on Mac and iPhone. Real interface with fictional data.</figcaption></figure><div class="lede-stage" id="demo" data-fx><div class="lede-play"><h2>Start a task. Step away. Return when it matters.</h2><p class="demo-flow">Start a task <span aria-hidden="true">→</span> Step away <span aria-hidden="true">→</span> Get notified <span aria-hidden="true">→</span> Review and act</p><p class="note">Benchyard provides the workspace; your agent does the task. Explore this coding example.</p>${demo(at("demo-board.html"))}<p id="demo-description" class="caption">A replay drawn for this page, not the live app. The changes, files, test results and issue board come from a real run with demo data. The agent’s replies are scripted. <a href="/guides/workspaces/#demo-transcript">Read it as text</a>.</p></div></div></section>
 <section id="workspace"><div class="wrap">${heading("", t.workspace.title, t.workspace.lead)}<div class="tour" id="preview">${t.tour.map(([title, body, name, alt], i) => `<div class="tour-text" data-tour="${i}"><h3>${esc(title)}</h3><p>${esc(body)}</p></div><figure class="frame tour-shot" data-shot="${i}">${shot(at, name, alt, 1440, 900, { sizes: "(min-width: 1000px) 720px, 92vw" })}</figure>`).join("")}</div>${workspaceSections(t.workspace, esc)}</div></section>
 <section id="notifications" class="band"><div class="wrap">${heading("WHEN IT NEEDS YOU", "Stay informed without watching every step.", "Get notified when your agent needs a decision, finishes a task or encounters a problem. Open the session to review the context and take the next step.")}<div class="notifications-grid"><article class="notification-card" data-in><div class="notification-intro"><span class="eyebrow">DEVICE PUSH</span><h3>A tap back to your work.</h3><p>When an approval is needed, a task finishes or fails, an agent leaves a note or a workspace is ready. Turn notifications on for each device; on an iPhone, add Benchyard to the Home Screen first.</p></div><div class="notification-visual">${lockScreenMarkup()}</div><p class="caption">Simulated lock-screen notifications. Open the session to approve.</p></article><article class="notification-card mail-card" data-in><div class="notification-intro"><span class="eyebrow">EMAIL</span><h3>The decisions worth an email.</h3><p>When an approval is needed, a plan is ready to review, a task fails or an agent needs you to sign in again. Finished tasks and agent notes are not emailed.</p></div><div class="notification-visual"><div class="mail-surface"><div class="mail-toolbar"><span><span aria-hidden="true">←</span> &nbsp; Inbox</span><span>1 message</span></div><div class="mail-header"><h4>Approval needed</h4><div class="mail-sender"><span class="mail-avatar">${mark}</span><div><strong>Benchyard</strong><p>To: alice@example.com</p></div><time>9:41 AM</time></div></div><div class="mail-body"><div class="mail-message"><div class="mail-brand">${mark}<strong>Benchyard</strong></div><span class="mail-status">APPROVAL NEEDED</span><p><strong>Add a status filter</strong> needs your approval.</p><p>Open the session to review the request and decide whether to allow it.</p><span class="mail-button">Open session <span aria-hidden="true">↗</span></span><small>issue-board · Codex</small></div><p class="mail-delivery-note">An update for a decision that needs you.</p></div></div></div><p class="caption">Illustrated email using fictional data. You turn email on and confirm your address; the installation must have mail set up.</p></article></div>${deviceDocks()}<a class="text-link" href="/guides/workspaces/#device-setup">Set up notifications on your devices <span aria-hidden="true">→</span></a><a class="text-link" href="/guides/workspaces/#notifications">How notifications work <span aria-hidden="true">→</span></a></div></section>
 <section id="agents"><div class="wrap">${heading("CURRENT INTEGRATIONS", t.agents.title, t.agents.lead)}<ul class="agent-cards">${[...t.agents.items.map(([id, name, body]) => [id, name, body, ""]), ...t.agents.inProgress.map(([id, name]) => [id, name, "Integration is underway. Not yet available.", "In progress"]), ...t.agents.planned.map(([id, name]) => [id, name, "Planned integration. Not yet available.", "Planned"])].map(([id, name, body, status]) => `<li data-in><div class="agent-card-heading">${agentMark(id)}<h3>${esc(name)}</h3></div>${status ? `<span class="agent-card-status">${status}</span>` : ""}<p>${esc(body)}</p></li>`).join("")}</ul><a class="text-link" href="/guides/agents/">Compare sign-ins and capabilities <span aria-hidden="true">→</span></a></div></section>
 <section id="security" class="band"><div class="wrap">${heading("SECURITY", t.security.title, t.security.lead)}${securityDiagram()}${cards(t.security.items, ["security-credentials", "security-storage", "security-exceptions", "security-isolation"])}<a class="text-link" href="/guides/security/">Read the security boundaries <span aria-hidden="true">→</span></a></div></section>
 <section id="teams"><div class="wrap">${heading("FOR TEAMS", t.teams.title, t.teams.lead)}${cards(t.teams.items, ["team-tools", "team-usage", "team-ownership"])}<details class="settings-detail"><summary>See sign-in and security settings</summary><figure class="frame">${shot(at, "security", "Benchyard account settings for password, passkeys, two-factor authentication and signed-in devices.")}</figure></details></div></section>
 <section id="business"><div class="wrap">${heading(t.business.eyebrow, t.business.title, t.business.lead)}${cards(t.business.items, ["business-tailored", "business-infrastructure"])}<p class="actions" id="business-contact"><a class="btn btn-primary" href="${mailto(t.business.subject, t.business.body)}">${esc(t.business.cta)} <span aria-hidden="true">↗</span></a></p><p class="note">${esc(t.business.note)}</p></div></section>
 <section id="faq" class="band"><div class="wrap narrow">${heading("A FEW DETAILS", "Questions, answered.")}<div class="faq">${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${esc(a)}</p></details>`).join("")}</div><p class="foot">Looking for details? Read the <a href="/guides/workspaces/">workspace guide</a>, <a href="/guides/agents/">agent guide</a> and <a href="/guides/security/">security guide</a>.</p></div></section>
 <section id="pricing" class="band pricing"><div class="wrap">${heading("", t.pricing.title, t.pricing.lead)}<div class="pricing-cards">${t.pricing.cards.map((plan) => `<article><h3>${esc(plan.name)}</h3><p class="pricing-value">${esc(plan.price)}</p><p class="pricing-period">${esc(plan.period)}</p><p>${esc(plan.body)}</p><ul>${plan.features.map((feature) => `<li>${esc(feature)}</li>`).join("")}</ul><a class="btn btn-primary" href="${plan.path.startsWith("#") ? plan.path : consoleAddress + plan.path}">${esc(plan.cta)} <span aria-hidden="true">↗</span></a></article>`).join("")}</div><div class="pricing-usage" id="pricing-usage"><h3>${esc(t.pricing.billingTitle)}</h3><dl>${t.pricing.meters.map(([label, body]) => `<div><dt>${esc(label)}</dt><dd>${esc(body)}</dd></div>`).join("")}</dl><p class="note">${esc(t.pricing.note)}</p><p class="note">${esc(t.pricing.providerNote)}</p></div><div class="promotions" id="offers"><h3>${esc(t.promotions.nav)}</h3><ul class="cards promotion-offers">${t.promotions.offers.map(([title, body]) => `<li><h4>${esc(title)}</h4><p>${esc(body)}</p></li>`).join("")}</ul><p class="note">${esc(t.promotions.signupNote)}</p><details class="promotion-more"><summary>${esc(t.promotions.more)}</summary><p>${esc(t.promotions.availability)}</p>${cards(t.promotions.rewards)}<p><a class="text-link" href="${consoleAddress}/billing">${esc(t.promotions.billing)} <span aria-hidden="true">→</span></a></p></details><p class="note">${esc(t.promotions.terms)}</p></div></div></section>

`,
    { script: true },
  );
}
export function renderGuide(t, g, { asset }) {
  const agentCell = (name) => {
    const agent = t.agents.items.find(([, label]) => label === name);
    return agent
      ? `<span class="agent-name">${agentMark(agent[0])}${esc(name)}</span>`
      : esc(name);
  };
  const table = (data) =>
    `<div class="table-scroll" role="region" tabindex="0" aria-label="${esc(g.title)} comparison"><table><thead><tr>${data.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${data.rows.map((row) => `<tr>${row.map((v, i) => (i ? `<td>${esc(v)}</td>` : `<th scope="row">${agentCell(v)}</th>`)).join("")}</tr>`).join("")}</tbody></table></div>`;
  const body = `<article class="guide wrap"><header class="guide-header"><a class="text-link" href="/">← Back to Benchyard</a><p class="eyebrow">BENCHYARD GUIDES</p><h1>${g.title}</h1><p class="lead">${g.lead}</p><p class="note">Last reviewed <time datetime="${reviewed}">${reviewed}</time>. What is available depends on your installation and account.</p></header><nav class="toc" aria-label="On this page"><strong>On this page</strong><ul>${g.sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join("")}</ul></nav><div class="guide-body">${g.sections.map((s) => `<section id="${s.setup ? "notification-setup" : s.id}"><h2>${s.title}</h2>${(s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}${s.id === "lifecycle" ? `<figure class="frame">${shot((name) => "/" + asset(name), "session-done", "Completed Codex task with actual filter test results and three file changes in the workspace.")}</figure>` : ""}${s.table ? table(s.id === "supported-agents" ? { ...s.table, rows: t.agents.items.map(([, name, auth]) => [name, auth]) } : s.table) : ""}${s.setup ? walkthrough({ expanded: true }) : ""}${s.id === "models-and-providers" ? `<p class="integration-progress">${t.agents.inProgress.map(([, name]) => `${esc(name)} — Integration in progress. Not yet available.`).join(" ")}</p><div class="agent-strip" aria-label="Planned integrations">${t.agents.planned.map(([id, name]) => `<span class="agent-name">${agentMark(id)}${name}<small class="agent-status">Planned</small></span>`).join("")}</div>` : ""}${s.link ? `<p><a href="${s.link[0]}">${s.link[1]} →</a></p>` : ""}${s.transcript ? `<p><a href="/#demo">Play the demo on the homepage</a>.</p><ol class="transcript">${transcript.map(([time, title, text]) => `<li><span>${time}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol>` : ""}</section>`).join("")}<aside class="guide-next"><h2>Keep exploring</h2><ul>${guides
    .filter((x) => x.slug !== g.slug)
    .map((x) => `<li><a href="/guides/${x.slug}/">${x.title}</a></li>`)
    .join("")}</ul>${button(t)}</aside></div></article>`;
  return shell(t, (name) => "/" + asset(name), body, {
    path: `/guides/${g.slug}/`,
    title: g.title + " | Benchyard",
    description: g.description,
  });
}
export function renderLegal(t, policy, doc, { asset }) {
  const toc = `<nav class="toc" aria-label="On this page"><strong>On this page</strong><ul>${doc.sections.map((section) => `<li><a href="#${section.id}">${esc(section.title)}</a></li>`).join("")}</ul></nav>`;
  const body = `<article class="guide legal-doc wrap"><header class="guide-header"><a class="text-link" href="/">← Back to Benchyard</a><p class="eyebrow">LEGAL</p><h1>${esc(doc.title)}</h1></header>${toc}<div class="guide-body">${doc.html}</div></article>`;
  return shell(t, (name) => "/" + asset(name), body, {
    path: `/legal/${policy.slug}/`,
    title: `${doc.title} | Benchyard`,
    description: policy.description,
  });
}

export function renderGuideIndex(t, { asset }) {
  return shell(
    t,
    (name) => "/" + asset(name),
    `<article class="guide wrap"><header class="guide-header"><p class="eyebrow">BENCHYARD GUIDES</p><h1>Find your next step.</h1><p class="lead">Get started, connect an agent and understand how your workspace works.</p></header><ul class="cards guide-directory">${guides.map((g) => `<li><h2><a href="/guides/${g.slug}/">${esc(g.title)}</a></h2><p>${esc(g.description)}</p></li>`).join("")}</ul></article>`,
    {
      path: "/guides/",
      title: "Guides | Benchyard",
      description:
        "Get started with Benchyard, connect supported agents, set up device notifications and understand workspace and security boundaries.",
    },
  );
}
