import { readFileSync } from "node:fs";

const colors = {
  claude: "claude-color",
  cursor: "cursor-brand",
  gemini: "gemini-color",
  codex: "codex-color",
  kimi: "kimi-color",
  glm: "chatglm-color",
};
const artwork = Object.fromEntries(
  Object.entries(colors).map(([id, file]) => {
    let svg = readFileSync(
      new URL(`./icons/${file}.svg`, import.meta.url),
      "utf8",
    )
      .replace(/<svg[^>]*>|<\/svg>|<title>.*?<\/title>/g, "")
      .trim();
    // The Kimi color mark has a white letterform; keep its contrast in both themes.
    if (id === "kimi")
      svg = `<rect width="24" height="24" rx="5" fill="#101114"/>${svg}`;
    return [id, svg];
  }),
);
let instance = 0;
export function agentMark(id) {
  if (!artwork[id]) throw new Error(`Unknown agent icon: ${id}`);
  // Inline gradient IDs must be unique across repeated marks on the same page.
  const prefix = `agent-${id}-${instance++}`;
  const body = artwork[id].replace(
    /lobe-icons-[\w-]+/g,
    (value) => `${prefix}-${value}`,
  );
  return `<svg class="agent-mark" data-agent="${id}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}
