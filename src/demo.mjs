// The replay on the homepage: a drawn copy of the app's session screen whose
// content is the data of a real run (content/demo.json, written by
// studio/capture.mjs). This renders the finished session, so the page reads
// whole without scripts; src/site.js plays it step by step.
import { readFileSync } from "node:fs";
import { agentMark } from "./agents.mjs";
export const data = JSON.parse(
  readFileSync(new URL("../content/demo.json", import.meta.url), "utf8"),
);
// The run's output as it was, less two things that say nothing of the task:
// npm's notice of a newer npm and Node's warning about its proxy agent.
data.test.output = data.test.output
  .split("\n")
  .filter(
    (line) =>
      !/^npm notice|^#? ?\(node:\d+\) \[UNDICI-EHPA\]|^#? ?\(Use `node --trace-warnings/.test(
        line,
      ),
  )
  .join("\n")
  .trim();
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** The issue board as its own server hands it out: the page with the module it imports put in its place. */
export function board() {
  const page = data.files["index.html"];
  const from = "import { filterIssues } from './filter.mjs';";
  if (!page.includes(from))
    throw new Error("the captured board no longer imports its filter");
  return page
    .replace(
      from,
      data.files["filter.mjs"].replace("export function", "function"),
    )
    .replace("<title>", '<meta name="robots" content="noindex" /><title>');
}

const icon = (d, extra = "") =>
  `<svg class="rp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${extra}>${d}</svg>`;
const icons = {
  check: icon('<path d="M20 6 9 17l-5-5"/>'),
  chevron: icon('<path d="m9 18 6-6-6-6"/>'),
  file: icon(
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h6"/>',
  ),
  changes: icon(
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M9 10h6M12 13V7M9 17h6"/>',
  ),
  folder: icon(
    '<path d="M6 14l1.5-2.9A2 2 0 0 1 9.2 10H20a2 2 0 0 1 1.9 2.5l-1.5 6a2 2 0 0 1-2 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.7.9l.8 1.2a2 2 0 0 0 1.7.9H18a2 2 0 0 1 2 2v2"/>',
  ),
  terminal: icon(
    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 11 2-2-2-2M11 13h4"/>',
  ),
  ports: icon(
    '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v6a3 3 0 0 0 3 3h6M18 15V9a3 3 0 0 0-3-3h-1"/>',
  ),
  chat: icon(
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ),
  laptop: icon(
    '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.3 2.6A1 1 0 0 1 20.4 20H3.6a1 1 0 0 1-.9-1.4L4 16"/>',
  ),
  play: `<svg class="rp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12.5-7.5a1 1 0 0 0 0-1.8L8.5 3.6A1 1 0 0 0 7 4.5z"/></svg>`,
  open: icon(
    '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  ),
  close: icon('<path d="M18 6 6 18M6 6l12 12"/>'),
  edit: icon(
    '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
  ),
  search: icon('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
};

/** A unified diff as rows with the old and the new line number, as the app's Changes panel shows it. */
function diffRows(diff) {
  const rows = [];
  let a = 0,
    b = 0;
  for (const line of diff.replace(/\n$/, "").split("\n")) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (hunk) {
      a = +hunk[1];
      b = +hunk[2];
      rows.push(
        `<tr class="rp-hunk"><td></td><td></td><td>${esc(hunk[0])}</td></tr>`,
      );
    } else if (!a && !b) continue;
    else if (line.startsWith("+"))
      rows.push(
        `<tr class="rp-add"><td></td><td>${b++}</td><td>+ ${esc(line.slice(1))}</td></tr>`,
      );
    else if (line.startsWith("-"))
      rows.push(
        `<tr class="rp-del"><td>${a++}</td><td></td><td>- ${esc(line.slice(1))}</td></tr>`,
      );
    else if (!line.startsWith("\\"))
      rows.push(
        `<tr><td>${a++}</td><td>${b++}</td><td>  ${esc(line.slice(1))}</td></tr>`,
      );
  }
  return rows.join("");
}

const sessions = [
  ["codex", "Add a status filter", true],
  ["gemini", "Outline the onboarding guide"],
  ["cursor", "Check keyboard navigation"],
  ["claude", "Review API error handling"],
];
const paragraphs = (text) => {
  const lines = text.split("\n").filter(Boolean);
  // The agent's closing note has three points between two sentences.
  if (lines.length < 4) return lines.map((l) => `<p>${esc(l)}</p>`).join("");
  return `<p>${esc(lines[0])}</p><ul>${lines
    .slice(1, -1)
    .map((l) => `<li>${esc(l)}</li>`)
    .join("")}</ul><p>${esc(lines.at(-1))}</p>`;
};
const approval = (where) =>
  `<div class="rp-approval" data-approval hidden><p class="rp-approval-title">Approval needed</p><p class="rp-command"><b>Shell</b> ${esc(data.test.command)}</p><div class="rp-approval-actions"><button type="button" class="rp-deny" data-deny="${where}">Deny<span class="visually-hidden"> ${esc(data.test.command)} on the ${where}</span></button><button type="button" class="rp-approve" data-approve="${where}">Approve<span class="visually-hidden"> ${esc(data.test.command)} on the ${where}</span></button></div></div>`;
const shell = (output) =>
  `<div class="rp-card rp-shell" data-at="6" data-shell data-state="done"><div class="rp-card-head">${icons.chevron}<b>Shell</b><code>${esc(data.test.command)}</code><span class="rp-tick">${icons.check}</span></div>${output ? `<div class="rp-shell-body"><pre class="rp-cmd">$ ${esc(data.test.command)}</pre><dl><dt>cwd</dt><dd>${esc(data.project)}</dd><dt>reason</dt><dd>${esc(data.test.reason)}</dd></dl><pre class="rp-out" data-output tabindex="0" aria-label="Output of ${esc(data.test.command)}">${esc(data.test.output)}</pre></div>` : ""}<p class="rp-card-foot" data-shell-note>Approved from iPhone</p></div>`;

export function demo(boardHref) {
  const [intro, ready, ran, done] = data.replies;
  const total = data.changes.reduce(
    (n, c) => [n[0] + c.added, n[1] + c.removed],
    [0, 0],
  );
  const edits = data.changes
    .map(
      (c, i) =>
        `<div class="rp-card" data-at="${3 + i}" data-edit="${i}"><div class="rp-card-head">${icons.chevron}<b>Edit</b><code>update ${esc(data.project)}/${esc(c.name)}</code><span class="rp-tick">${icons.check}</span></div><p class="rp-chip">${icons.file}${esc(c.name)}</p></div>`,
    )
    .join("");
  const tabs = [
    ["chat", "Chat", icons.chat],
    [
      "changes",
      `Changes <span data-count>· ${data.changes.length}</span>`,
      icons.changes,
    ],
    ["files", "Files", icons.folder],
    ["terminal", "Terminal", icons.terminal],
    ["ports", "Ports", icons.ports],
  ]
    .map(
      ([id, label, glyph]) =>
        `<button type="button" role="tab" id="rp-tab-${id}" aria-controls="rp-panel-${id}" aria-selected="${id === "changes"}" data-tab="${id}">${glyph}<span>${label}</span></button>`,
    )
    .join("");
  const names = Object.keys(data.files);
  return `<div class="rp" data-replay data-dock="changes" data-view="chat" data-board="${boardHref}">
 <div class="rp-window" role="group" aria-label="Replay of a Benchyard session with demo data">
  <div class="rp-side" aria-hidden="true"><p class="rp-who"><span class="rp-avatar">A</span><span><b>alice</b><small>Benchyard</small></span></p><p class="rp-search">${icons.search}Search sessions</p><p class="rp-new">${icons.edit}New session</p><p class="rp-label">Workspaces</p><p class="rp-ws">issue-board<i></i></p><ul>${sessions.map(([agent, title, current]) => `<li${current ? ' class="rp-current"' : ""}>${agentMark(agent)}<span>${title}</span></li>`).join("")}</ul><p class="rp-device">${icons.laptop}This device: <b>MacBook</b></p></div>
  <div class="rp-head"><span class="rp-agent">${agentMark("codex")}</span><div><p class="rp-title">Add a status filter</p><p class="rp-sub">Ask first<span>Model</span>Demo model</p></div><span class="rp-pill" data-pill data-kind="idle">Idle</span></div>
  <div class="rp-tabs" role="tablist" aria-label="Parts of the session">${tabs}</div>
  <div class="rp-chat" id="rp-panel-chat" role="tabpanel" aria-labelledby="rp-tab-chat">
   <div class="rp-scroll" data-scroll>
    <div class="rp-log" data-log>
     <p class="rp-user" data-at="1">${esc(data.prompt)}</p>
     <div class="rp-say" data-at="2" data-stream>${paragraphs(intro)}</div>
     ${edits}
     <div class="rp-say" data-at="6" data-stream>${paragraphs(ready)}</div>
     ${shell(true)}
     <div class="rp-say" data-at="8">${paragraphs(ran)}</div>
     <div class="rp-say" data-at="8">${paragraphs(done)}</div>
    </div>
   </div>
   ${approval("desktop")}
   <div class="rp-composer"><p data-composer data-idle="Tell the agent what to do" data-busy="Queue a follow-up, or steer">Tell the agent what to do</p></div>
   <button type="button" class="rp-start" data-start hidden>${icons.play}<span>Play the task</span></button>
  </div>
  <div class="rp-dock">
   <div class="rp-panel" id="rp-panel-changes" role="tabpanel" aria-labelledby="rp-tab-changes" data-panel="changes">
    <p class="rp-panel-note" data-empty hidden>No changes yet.</p>
    <ul class="rp-rows">${data.changes.map((c, i) => `<li data-at="${3 + i}"><button type="button" data-change="${i}" aria-pressed="${i === 0}"><b>M</b><span>${esc(c.name)}</span><span class="rp-plus">+${c.added}</span><span class="rp-minus">−${c.removed}</span></button></li>`).join("")}</ul>
    ${data.changes.map((c, i) => `<div class="rp-diff" data-diff="${i}"${i ? " hidden" : ""} data-at="${3 + i}"><p class="rp-path">${esc(c.name)}</p><div class="rp-code" tabindex="0" role="region" aria-label="Changes to ${esc(c.name)}"><table><tbody>${diffRows(c.diff)}</tbody></table></div></div>`).join("")}
   </div>
   <div class="rp-panel" id="rp-panel-files" role="tabpanel" aria-labelledby="rp-tab-files" data-panel="files">
    <ul class="rp-tree">${names.map((name, i) => `<li><button type="button" data-file="${i}" aria-pressed="${i === 1}">${icons.file}<span>${esc(name)}</span></button></li>`).join("")}</ul>
    ${names.map((name, i) => `<div class="rp-file" data-fileview="${i}"${i === 1 ? "" : " hidden"}><p class="rp-path">${esc(name)}</p><pre class="rp-code" tabindex="0" aria-label="${esc(name)}">${esc(data.files[name])}</pre></div>`).join("")}
   </div>
   <div class="rp-panel" id="rp-panel-terminal" role="tabpanel" aria-labelledby="rp-tab-terminal" data-panel="terminal">
    <p class="rp-panel-note">Recorded output of the approved command. This terminal does not take input.</p>
    <pre class="rp-term" tabindex="0" aria-label="Recorded terminal output">$ ${esc(data.test.command)}\n${esc(data.test.output)}</pre>
   </div>
   <div class="rp-panel" id="rp-panel-ports" role="tabpanel" aria-labelledby="rp-tab-ports" data-panel="ports">
    <p class="rp-panel-note">Apps running in the workspace.</p>
    <div class="rp-port"><b>${data.port}</b><code>node server.mjs</code><button type="button" data-open>${icons.open}Open in browser</button></div>
    <p class="rp-panel-note">Opens the issue board the agent changed. On this page it runs in a frame; in the app it opens at an address of its own that only you can open.</p>
   </div>
  </div>
  <div class="rp-phone" data-phone aria-label="The same session on a phone" hidden>
   <div class="rp-phone-screen">
    <p class="rp-phone-head"><b>Add a status filter</b><span class="rp-pill" data-kind="approval">Needs approval</span></p>
    <p class="rp-driving">${icons.laptop}<span><b>MacBook</b> is driving. You can watch and approve.</span></p>
    <div class="rp-say">${paragraphs(ready)}</div>
    <div class="rp-card rp-shell" data-state="waiting"><div class="rp-card-head">${icons.chevron}<b>Shell</b><code>${esc(data.test.command)}</code></div><p class="rp-card-foot">Waiting for approval</p></div>
    ${approval("phone")}
    <p class="rp-phone-files"><b>${data.changes.length} files changed</b><span class="rp-plus">+${total[0]}</span><span class="rp-minus">−${total[1]}</span></p>
   </div>
  </div>
  <div class="rp-browser" data-browser hidden><p class="rp-browser-bar"><span>issue-board, port ${data.port}</span><button type="button" data-close>${icons.close}<span>Close the preview</span></button></p></div>
 </div>
 <div class="rp-controls" data-controls><button type="button" data-play>Play</button><button type="button" data-skip>Skip to the end</button><button type="button" data-again hidden>Ask again</button><p class="rp-status" role="status" data-status></p></div>
</div>`;
}
