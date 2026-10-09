import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const dir = process.argv[2];
createServer(async (req, res) => {
  const path = new URL(req.url, "http://demo").pathname;
  if (!["/", "/index.html", "/filter.mjs"].includes(path))
    return res.writeHead(404).end();
  res.setHeader(
    "content-type",
    path.endsWith(".mjs") ? "text/javascript" : "text/html",
  );
  res.end(await readFile(dir + (path === "/" ? "/index.html" : path)));
}).listen(4173, "0.0.0.0");
