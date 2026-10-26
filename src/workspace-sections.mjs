// Lightweight, accessible diagrams alongside the workspace story.
const icon = (kind) => {
  const paths = {
    folder: '<path d="M3 7h7l2 3h17v16H3z"/><path d="M3 7V4h10l3 3h13v3"/>',
    terminal:
      '<rect x="3" y="5" width="26" height="22" rx="3"/><path d="m8 12 4 4-4 4m8 0h7"/>',
    screen:
      '<rect x="3" y="4" width="26" height="19" rx="3"/><path d="M11 29h10m-5-6v6M3 10h26"/>',
    cube: '<path d="m16 2 13 7v14l-13 7-13-7V9zm0 14 13-7M16 16 3 9m13 7v14M9 5l13 8v7"/>',
    disk: '<rect x="4" y="3" width="24" height="26" rx="3"/><path d="M4 12h24M4 21h24m-5-14h1m-1 10h1m-1 9h1"/>',
  };
  return `<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${paths[kind]}</svg>`;
};
export function workspaceSections(w, esc) {
  const t = w.story,
    c = w.configurations,
    b = w.workbench,
    s = w.continuity,
    ops = w.operations;
  const node = (title, kind, detail = "") =>
    `<div class="story-node">${icon(kind)}<strong>${esc(title)}</strong>${detail ? `<small>${esc(detail)}</small>` : ""}</div>`;
  const link = (href, label) =>
    `<a class="text-link" href="${href}">${esc(label)} <span aria-hidden="true">→</span></a>`;
  return `<div class="workspace-stories">
  <section class="context-section" id="workspace-context" aria-labelledby="continuity-title">
    <div class="compact-heading"><p class="eyebrow">${esc(t.context)}</p><h3 id="continuity-title">${esc(s.title)}</h3><p>${esc(s.lead)}</p></div>
    <div class="import-flow">${node(s.local, "terminal", s.localDetail)}<div class="import-arrow"><strong>${esc(s.transfer)}</strong><span aria-hidden="true">→</span><small>${esc(s.record)}</small></div>${node(s.cloud, "cube", s.cloudDetail)}</div>
    <div class="continue-elsewhere"><h4>${esc(s.elsewhere)}</h4><div class="continue-choices">${s.choices.map(([title, body], i) => `<div>${icon(i ? "terminal" : "disk")}<div><h5>${esc(title)}</h5><p>${esc(body)}</p></div></div>`).join("")}</div></div>
    <p class="context-boundary">${esc(s.boundary)}</p><div class="context-footer"><p>${esc(s.flexibility)}</p><p id="workspace-persistence">${esc(s.persistence)}</p></div>${link("/guides/workspaces/#session-continuity", s.link)}
  </section>
  <section class="workspace-workbench" id="workspace-tools" aria-labelledby="workbench-title"><div class="workbench-overview"><div class="story-copy"><p class="eyebrow">${esc(t.connect)}</p><h3 id="workbench-title">${esc(t.connectTitle)}</h3><p>${esc(b.lead)}</p><p>${esc(b.layout)}</p>${link("/guides/workspaces/#tools", b.link)}</div><figure class="workbench-visual"><figcaption>${esc(b.visualTitle)}</figcaption><div class="workbench-layout"><div class="workbench-conversation">${icon("terminal")}<strong>${esc(b.conversation)}</strong><span>${esc(b.conversationNote)}</span><div class="conversation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div><dl class="workbench-panels">${b.panels.map(([label, description], i) => `<div>${icon(["screen", "cube", "folder", "terminal", "screen"][i])}<dt>${esc(label)}</dt><dd>${esc(description)}</dd></div>`).join("")}</dl></div><p class="caption">${esc(b.caption)}</p></figure></div><div class="workbench-remote"><h4>${esc(b.remoteTitle)}</h4><p>${esc(b.remote)}</p></div></section>
  <section class="operations-section" id="workspace-operations" aria-labelledby="operations-title"><div class="compact-heading"><p class="eyebrow">${esc(t.build)}</p><h3 id="operations-title">${esc(ops.title)}</h3><p>${esc(ops.lead)}</p></div><ol class="operations-flow">${ops.stages.map(([label, detail], i) => `<li><span class="operation-number" aria-hidden="true">0${i + 1}</span>${icon(["terminal", "screen", "disk"][i])}<h4>${esc(label)}</h4><p>${esc(detail)}</p></li>`).join("")}</ol><p class="note">${esc(ops.note)}</p>${link("/guides/workspaces/#ongoing-work", ops.link)}</section>
  <section class="workspace-machine-story" id="workspace-machines" aria-labelledby="machines-title"><div class="compact-heading"><p class="eyebrow">${esc(t.machines)}</p><h3 id="machines-title">${esc(c.title)}</h3><p>${esc(c.lead)}</p></div><div class="machine-types-visual">${c.types.map(([title, body, runtime], i) => `<article><div class="machine-illustration ${i ? "vm-illustration" : "container-illustration"}" aria-hidden="true">${i ? `<div class="server-tower">${icon("disk")}<i></i><i></i><i></i></div>` : `<div class="container-stack">${icon("cube")}${icon("cube")}${icon("cube")}</div>`}</div><h4>${esc(title)}</h4><p>${esc(body)}</p><small>${esc(runtime)}</small></article>`).join("")}</div><div class="machine-options">${c.options.map(([label, description], i) => `<div>${icon(["cube", "disk", "screen", "terminal"][i])}<div><h4>${esc(label)}</h4><p>${esc(description)}</p></div></div>`).join("")}</div><p class="note">${esc(c.note)}</p>${link("/guides/workspaces/#configurations", c.link)}</section>
  </div>`;
}
