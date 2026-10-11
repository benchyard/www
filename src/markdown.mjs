// The legal pages are Markdown in content/legal/. This renders the subset
// those documents use: headings, paragraphs, lists, tables, links, emphasis,
// and code. A construct it does not know fails the build.
import { policies } from "../content/legal.mjs";

const routes = new Map(
  policies.map((policy) => [policy.file, `/legal/${policy.slug}/`]),
);
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function href(target, file) {
  if (target.startsWith("mailto:") || target.startsWith("https://"))
    return target;
  const name = target.split("/").pop();
  const path = routes.get(name);
  if (!path)
    throw new Error(`${file} links to ${target}, which is not a legal page`);
  return path;
}

function inline(text, file) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end === -1) throw new Error(`${file} has an unclosed emphasis`);
      out += `<strong>${inline(text.slice(i + 2, end), file)}</strong>`;
      i = end + 2;
      continue;
    }
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end === -1) throw new Error(`${file} has an unclosed code span`);
      out += `<code>${esc(text.slice(i + 1, end))}</code>`;
      i = end + 1;
      continue;
    }
    if (text[i] === "[") {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(text.slice(i));
      if (link) {
        out += `<a href="${esc(href(link[2], file))}">${inline(link[1], file)}</a>`;
        i += link[0].length;
        continue;
      }
      out += esc("[");
      i++;
      continue;
    }
    let next = text.length;
    for (const mark of ["**", "`", "["]) {
      const at = text.indexOf(mark, i);
      if (at !== -1 && at < next) next = at;
    }
    out += esc(text.slice(i, next));
    i = next;
  }
  return out;
}

function cells(line) {
  const parts = line.split("|").map((cell) => cell.trim());
  if (parts[0] === "") parts.shift();
  if (parts.at(-1) === "") parts.pop();
  return parts;
}

function slug(text, used) {
  const plain = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "");
  let id = plain
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!id) id = "section";
  const base = id;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

export function renderMarkdown(source, file) {
  const lines = source.replaceAll("\r\n", "\n").replace(/\n$/, "").split("\n");
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (
      line.startsWith("#### ") ||
      line.startsWith("> ") ||
      line.startsWith("```")
    )
      throw new Error(
        `${file}:${i + 1} uses Markdown this renderer does not support`,
      );
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }
    if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      i--;
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      i--;
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(cells(lines[i]));
        i++;
      }
      i--;
      const body = rows.filter(
        (row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)),
      );
      if (body.length < 1) throw new Error(`${file} has an empty table`);
      blocks.push({ type: "table", head: body[0], rows: body.slice(1) });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }
  const titleBlock = blocks.find((block) => block.type === "h1");
  if (!titleBlock) throw new Error(`${file} has no title`);
  const used = new Set(["main"]);
  const sections = [];
  const html = blocks
    .filter((block) => block.type !== "h1")
    .map((block) => {
      if (block.type === "h2" || block.type === "h3") {
        const id = slug(block.text, used);
        const title = inline(block.text, file);
        if (block.type === "h2")
          sections.push({ id, title: block.text.replace(/[*`]/g, "") });
        return `<${block.type} id="${id}">${title}</${block.type}>`;
      }
      if (block.type === "p") return `<p>${inline(block.text, file)}</p>`;
      if (block.type === "ul" || block.type === "ol") {
        const tag = block.type;
        return `<${tag}>${block.items.map((item) => `<li>${inline(item, file)}</li>`).join("")}</${tag}>`;
      }
      const head = block.head
        .map((cell) => `<th scope="col">${inline(cell, file)}</th>`)
        .join("");
      const rows = block.rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${inline(cell, file)}</td>`).join("")}</tr>`,
        )
        .join("");
      return `<div class="table-scroll" role="region" tabindex="0" aria-label="${esc(block.head[0])}"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    .join("");
  return { title: titleBlock.text, sections, html };
}
