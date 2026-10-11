import { securityDiagram } from "./security-diagram.mjs";
import { lockScreenMarkup, statusIcons } from "./lock-screen.mjs";
import { card } from "./pictures.mjs";
import { mark } from "./brand.mjs";
import { agentMark } from "./agents.mjs";
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
const access = (t) => mailto(t.access.subject, t.access.body);
const button = (t) =>
  `<a class="btn btn-primary" href="${access(t)}">Request access <span aria-hidden="true">↗</span></a>`;
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
    `${at(`img/${name}-${theme}-${Math.round(w / 2)}.webp`)} ${Math.round(w / 2)}w, ${at(`img/${name}-${theme}-${w}.webp`)} ${w}w`;
  return `<picture>${dark ? `<source type="image/webp" media="(prefers-color-scheme: dark)" srcset="${set("dark")}" sizes="${sizes}">` : ""}<img src="${at(`img/${name}-light-${Math.round(w / 2)}.webp`)}" srcset="${set("light")}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${priority ? 'fetchpriority="high"' : ""} loading="${eager || priority ? "eager" : "lazy"}" decoding="async"></picture>`;
}
const phone = (content) =>
  `<div class="iphone"><div class="phone-status" aria-hidden="true"><span>9:41</span><span class="phone-indicators">${statusIcons}</span></div><div class="island" aria-hidden="true"></div><div class="phone-screen">${content}</div><span class="phone-home" aria-hidden="true"></span></div>`;
const cards = (items) =>
  `<ul class="cards">${items.map(([title, body]) => `<li><h3>${esc(title)}</h3><p>${esc(body)}</p></li>`).join("")}</ul>`;
const heading = (label, title, lead = "") =>
  `<div class="section-heading"><p class="eyebrow">${label}</p><h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ""}</div>`;
function shell(
  t,
  at,
  body,
  { path = "/", title = t.meta.title, description = t.meta.description } = {},
) {
  const nav = t.nav
    .map(([id, label]) => `<li><a href="/#${id}">${label}</a></li>`)
    .join("");
  return `<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f2f3ef" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#111513" media="(prefers-color-scheme: dark)"><link rel="canonical" href="${site}${path}"><meta property="og:url" content="${site}${path}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:site_name" content="Benchyard"><meta property="og:type" content="website"><meta property="og:image" content="${site}/social-card.png"><meta property="og:image:width" content="${card.width}"><meta property="og:image:height" content="${card.height}"><meta property="og:image:alt" content="Benchyard: persistent workspaces for coding agents"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${at("fonts/bricolage-grotesque-latin-wght-normal.woff2")}"><link rel="preload" as="font" type="font/woff2" crossorigin href="${at("fonts/ibm-plex-sans-latin-400-normal.woff2")}"><link rel="stylesheet" href="${at("styles.css")}"></head><body>
 <a class="skip" href="#main">Skip to content</a><header class="top"><div class="wrap top-in"><a class="brand" href="/" aria-label="Benchyard home">${mark}<span>Benchyard</span></a><nav class="desktop-nav" aria-label="Main navigation"><ul>${nav}</ul></nav><div class="top-actions"><a class="signin" href="${consoleAddress}">Sign in</a>${button(t)}</div><details class="mobile-nav"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation"><ul>${nav}<li><a href="/guides/workspaces/">Guides</a></li><li><a href="${consoleAddress}">Sign in</a></li></ul></nav></details></div></header>
 <main id="main" tabindex="-1">${body}</main><footer class="bottom"><div class="wrap footer-grid"><div><a href="/" class="brand">${mark}<span>Benchyard</span></a><p>Keep work moving.<br>Come back when it needs you.</p></div><nav aria-label="Product"><h2>Product</h2><ul>${nav}<li><a href="/#pricing">Access &amp; pricing</a></li></ul></nav><nav aria-label="Guides"><h2>Guides</h2><ul>${guides.map((g) => `<li><a href="/guides/${g.slug}/">${g.title}</a></li>`).join("")}<li><a href="/guides/workspaces/#demo-transcript">Demo transcript</a></li></ul></nav><nav aria-label="Contact"><h2>Get in touch</h2><ul><li><a href="${access(t)}">Request access</a></li><li><a href="/#business">For Business</a></li><li><a href="mailto:${contactAddress}">${contactAddress}</a></li><li><a href="/#faq">Questions</a></li></ul></nav></div><div class="wrap legal"><nav aria-label="Legal"><ul>${policies.map((policy) => `<li><a href="/legal/${policy.slug}/">${esc(policy.label)}</a></li>`).join("")}</ul></nav><p>Claude, Codex, Cursor, Gemini, Kimi and GLM are trademarks of their respective owners. Benchyard is not affiliated with or endorsed by their providers. Product information reviewed <time datetime="${reviewed}">${reviewed}</time>.</p></div></footer></body></html>`;
}
export function render(t, { asset } = {}) {
  const at = (name) => "/" + asset(name);
  const names =
    t.agents.items
      .map(
        ([id, name]) =>
          `<span class="agent-name">${agentMark(id)}${name}</span>`,
      )
      .join("") +
    t.agents.planned
      .map(
        ([id, name]) =>
          `<span class="agent-name">${agentMark(id)}${name}<small class="agent-status">Planned</small></span>`,
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
    `<picture>${["dark", "light"].map((theme) => `<source type="image/webp" media="(max-width: 700px)${theme === "dark" ? " and (prefers-color-scheme: dark)" : ""}" width="560" height="400" srcset="${at(`img/hero-detail-${theme}-280.webp`)} 280w, ${at(`img/hero-detail-${theme}-560.webp`)} 560w" sizes="92vw">`).join("")}`,
  );
  const mobile = shot(
    at,
    "phone-approval",
    "The same Codex session on a phone, with Deny and Approve controls for npm test.",
    390,
    740,
    { eager: true, sizes: "(min-width: 701px) 248px, 278px" },
  );
  return shell(
    t,
    at,
    `
 <section class="hero" id="top"><div class="wrap"><div class="hero-copy"><div><h1>${esc(t.hero.title)} <span class="hero-tagline">${esc(t.hero.tagline)}</span></h1></div><div><p class="lead hero-lead">${t.hero.lead}</p><p class="actions">${button(t)}<a class="btn btn-text" href="#demo"><span aria-hidden="true">▷</span> Watch the 60-second demo</a></p><p class="note">${t.hero.note}</p></div></div><div class="agent-strip" aria-label="Agent integrations and planned additions">${names}</div><figure class="stage"><div class="frame frame-desktop">${desktop}</div><div class="hero-phone">${phone(mobile)}</div><figcaption>One workspace, across your devices. Real interface with fictional demo data.</figcaption></figure></div></section>
 <section id="demo" class="band"><div class="wrap">${heading("SEE IT IN ACTION", "From task to preview, wherever you are.", "Follow one task: add a status filter, approve the tests from a phone, and check the running app.")}<div class="video-frame"><video controls playsinline preload="none" width="1280" height="720" poster="${at("img/demo-poster-light-1920.webp")}" aria-label="Benchyard 60-second product demonstration" aria-describedby="demo-description"><source src="${at("media/benchyard-demo-720p.mp4")}" type="video/mp4"><track kind="subtitles" src="${at("media/benchyard-demo.en.vtt")}" srclang="en" label="English" default><p><a href="${at("media/benchyard-demo-720p.mp4")}">Download the demo video</a></p></video></div><p id="demo-description" class="caption">Recorded in Benchyard with demo data. Agent responses are scripted; timing is edited. The lock-screen notification is simulated. <a href="/guides/workspaces/#demo-transcript">Read the transcript</a>.</p><ol class="steps">${t.steps.map(([title, body], i) => `<li><span class="step-number">0${i + 1}</span><h3>${title}</h3><p>${body}</p></li>`).join("")}</ol></div></section>
 <section id="workspace"><div class="wrap">${heading("THE WORKSPACE", t.workspace.title, t.workspace.lead)}${cards(t.workspace.items)}<figure class="frame workspace-shot">${shot(at, "workspaces", "Benchyard workspace list with the running issue-board workspace and its connected agent sessions.")}<figcaption>Keep projects and sessions in reach.</figcaption></figure><div class="locations"><h3>Choose where it runs.</h3><p>Available environments depend on your deployment and account.</p>${cards(t.workspace.locations)}</div><a class="text-link" href="/guides/workspaces/">Explore workspace behavior <span aria-hidden="true">→</span></a></div></section>
 <section id="preview" class="band"><div class="wrap"><div class="split-heading">${heading("BROWSER PREVIEWS", "See the change working.", "Open a development server from Ports and try the app in your browser. Previews use a separate origin and require the workspace owner’s sign-in.")}<p class="aside-note">Available where previews are configured. Preview links are not public or team-sharing links.</p></div><div class="preview-grid"><figure class="frame">${shot(at, "ports", "The workspace Ports panel offers Open in browser for the running issue-board development server.", 1440, 900, { sizes: "(min-width: 900px) 540px, 92vw" })}<figcaption>01 &nbsp; Open the workspace port</figcaption></figure><figure class="frame">${shot(at, "preview", "The running issue-board application with All issues, In progress and Done filters and six fictional issues.", 1440, 900, { sizes: "(min-width: 900px) 540px, 92vw" })}<figcaption>02 &nbsp; Try the result</figcaption></figure></div></div></section>
 <section id="agents"><div class="wrap">${heading("CURRENT INTEGRATIONS", t.agents.title, t.agents.lead)}<ul class="agent-cards">${t.agents.items.map(([id, name, body]) => `<li>${agentMark(id)}<h3>${name}</h3><p>${body}</p></li>`).join("")}</ul><div class="integration-future"><h3>Room for what comes next.</h3><div class="agent-strip" aria-label="Planned integrations">${t.agents.planned.map(([id, name]) => `<span class="agent-name">${agentMark(id)}${name}<small class="agent-status">Planned</small></span>`).join("")}</div><p>${t.agents.future}</p></div><a class="text-link" href="/guides/agents/">Compare sign-ins and capabilities <span aria-hidden="true">→</span></a></div></section>
 <section id="notifications" class="band"><div class="wrap">${heading("WHEN IT NEEDS YOU", "Step away. Stay in the loop.", "Choose notifications on your devices and actionable updates by email. Open the session when it is time to make a decision.")}<div class="notifications-grid"><article class="notification-card"><div class="notification-intro"><span class="eyebrow">DEVICE PUSH</span><h3>A tap back to your work.</h3><p>Approvals, completion, agent notes and workspace-ready updates. Enable push per device; on iPhone, add Benchyard to the Home Screen first.</p></div><div class="notification-visual">${lockScreenMarkup()}</div><p class="caption">Simulated lock-screen notifications. Open the session to approve.</p></article><article class="notification-card mail-card"><div class="notification-intro"><span class="eyebrow">EMAIL</span><h3>The decisions worth an email.</h3><p>Approvals, plans to review, failed turns and expired agent sign-ins. Completion and agent notes are not emailed.</p></div><div class="notification-visual"><div class="mail-surface"><div class="mail-toolbar"><span><span aria-hidden="true">←</span> &nbsp; Inbox</span><span>1 message</span></div><div class="mail-header"><h4>Approval needed</h4><div class="mail-sender"><span class="mail-avatar">${mark}</span><div><strong>Benchyard</strong><p>To: alice@example.com</p></div><time>9:41 AM</time></div></div><div class="mail-body"><div class="mail-message"><div class="mail-brand">${mark}<strong>Benchyard</strong></div><span class="mail-status">APPROVAL NEEDED</span><p><strong>Add a status filter</strong> needs your approval.</p><p>Open the session to review the request and decide whether to allow it.</p><span class="mail-button">Open session <span aria-hidden="true">↗</span></span><small>issue-board · Codex</small></div><p class="mail-delivery-note">An update for a decision that needs you.</p></div></div></div><p class="caption">Illustrated email using fictional data. Requires opt-in, a verified address and configured mail delivery.</p></article></div><a class="text-link" href="/guides/workspaces/#notifications">How notifications work <span aria-hidden="true">→</span></a></div></section>
 <section id="teams"><div class="wrap">${heading("FOR TEAMS", t.teams.title, t.teams.lead)}${cards(t.teams.items)}<details class="settings-detail"><summary>See sign-in and security settings</summary><figure class="frame">${shot(at, "security", "Benchyard account settings for password, passkeys, two-factor authentication and signed-in devices.")}</figure></details></div></section>
 <section id="security" class="band"><div class="wrap">${heading("SECURITY", t.security.title, t.security.lead)}${securityDiagram()}${cards(t.security.items)}<a class="text-link" href="/guides/security/">Read the security boundaries <span aria-hidden="true">→</span></a></div></section>
 <section id="business"><div class="wrap">${heading(t.business.eyebrow, t.business.title, t.business.lead)}${cards(t.business.items)}<p class="actions"><a class="btn btn-primary" href="${mailto(t.business.subject, t.business.body)}">${esc(t.business.cta)} <span aria-hidden="true">↗</span></a></p><p class="note">${esc(t.business.note)}</p></div></section>
 <section id="pricing"><div class="wrap access-panel"><div><p class="eyebrow">ACCESS &amp; PRICING</p><h2>Make room for your next task.</h2><p class="lead">Tell us how you work. We will discuss access, available environments and pricing before you start.</p><p class="note">Agent subscriptions and API usage are separate.</p><p class="note">For your own installation, or machines people already run, <a href="#business">contact us</a>.</p></div><div>${button(t)}<p class="note">Already have access? <a href="${consoleAddress}">Sign in</a>.</p></div></div></section>
 <section id="faq" class="band"><div class="wrap narrow">${heading("A FEW DETAILS", "Questions, answered.")}<div class="faq">${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${esc(a)}</p></details>`).join("")}</div><p class="foot">Looking for details? Read the <a href="/guides/workspaces/">workspace guide</a>, <a href="/guides/agents/">agent guide</a> and <a href="/guides/security/">security guide</a>.</p></div></section>`,
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
  const body = `<article class="guide wrap"><header class="guide-header"><a class="text-link" href="/">← Back to Benchyard</a><p class="eyebrow">BENCHYARD GUIDES</p><h1>${g.title}</h1><p class="lead">${g.lead}</p><p class="note">Last reviewed <time datetime="${reviewed}">${reviewed}</time>. Availability depends on your deployment and account.</p></header><nav class="toc" aria-label="On this page"><strong>On this page</strong><ul>${g.sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join("")}</ul></nav><div class="guide-body">${g.sections.map((s) => `<section id="${s.id}"><h2>${s.title}</h2>${(s.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}${s.id === "lifecycle" ? `<figure class="frame">${shot((name) => "/" + asset(name), "session-done", "Completed Codex task with actual filter test results and three file changes in the workspace.")}</figure>` : ""}${s.table ? table(s.table) : ""}${s.id === "models-and-providers" ? `<div class="agent-strip" aria-label="Planned integrations">${t.agents.planned.map(([id, name]) => `<span class="agent-name">${agentMark(id)}${name}<small class="agent-status">Planned</small></span>`).join("")}</div>` : ""}${s.link ? `<p><a href="${s.link[0]}">${s.link[1]} →</a></p>` : ""}${s.transcript ? `<p><a href="/#demo">Watch the video on the homepage</a>.</p><ol class="transcript">${transcript.map(([time, title, text]) => `<li><span>${time}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join("")}</ol>` : ""}</section>`).join("")}<aside class="guide-next"><h2>Keep exploring</h2><ul>${guides
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
