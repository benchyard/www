// Serves dist/ on http://localhost:4321 (PORT to change it), and rebuilds when
// src/, content/ or public/ change. A reload script is added to HTML responses
// only, so the browser refreshes; dist/ itself stays free of it.
import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("./", import.meta.url));
const root = join(dir, "dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".md": "text/plain; charset=utf-8",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt; charset=utf-8",
};
const port = Number(process.env.PORT || 4321);
const reload = `<script>new EventSource("/__livereload").onmessage=()=>location.reload()</script>`;

const clients = new Set();
let timer;
let building = false;
let again = false;

function notify() {
  for (const res of clients) res.write("data: reload\n\n");
}

function rebuild() {
  if (building) {
    again = true;
    return;
  }
  building = true;
  const child = spawn(process.execPath, ["build.mjs"], {
    cwd: dir,
    stdio: "inherit",
  });
  child.on("exit", (code) => {
    building = false;
    if (code === 0) notify();
    if (again) {
      again = false;
      rebuild();
    }
  });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 100);
}

for (const name of process.env.LIVE_RELOAD === "0"
  ? []
  : ["src", "content", "public", "src-img", "media"]) {
  try {
    watch(join(dir, name), { recursive: true }, schedule);
  } catch {
    /* optional source folder */
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/__livereload") {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    });
    res.write(":\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  let path;
  try {
    path = normalize(decodeURIComponent(url.pathname));
  } catch {
    res.writeHead(400).end("invalid path");
    return;
  }
  if (path.endsWith("/")) path += "index.html";
  try {
    let body = await readFile(join(root, path));
    if (extname(path) === ".html" && process.env.LIVE_RELOAD !== "0")
      body = Buffer.from(
        body.toString("utf8").replace("</body>", `${reload}</body>`),
      );
    const cache = path.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : "no-cache";
    const headers = {
      "content-type": types[extname(path)] || "application/octet-stream",
      "cache-control": cache,
      "accept-ranges": "bytes",
    };
    if (req.headers.range && extname(path) === ".mp4") {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      const size = body.length;
      let start = match?.[1]
        ? Number(match[1])
        : Math.max(0, size - Number(match?.[2]));
      let end =
        match?.[1] && match?.[2]
          ? Math.min(Number(match[2]), size - 1)
          : size - 1;
      if (!match || (!match[1] && !match[2]) || start > end || start >= size) {
        res
          .writeHead(416, { ...headers, "content-range": `bytes */${size}` })
          .end();
        return;
      }
      headers["content-range"] = `bytes ${start}-${end}/${size}`;
      headers["content-length"] = end - start + 1;
      res
        .writeHead(206, headers)
        .end(req.method === "HEAD" ? undefined : body.subarray(start, end + 1));
      return;
    }
    res
      .writeHead(200, { ...headers, "content-length": body.length })
      .end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`http://localhost:${port}`));
