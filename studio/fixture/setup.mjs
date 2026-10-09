import { cp, writeFile, mkdir } from "node:fs/promises";
import { execFileSync, spawn } from "node:child_process";
const dir = process.argv[2];
if (!dir || !dir.startsWith("/data/"))
  throw new Error(
    "Demo fixture must be inside the isolated container data directory",
  );
await mkdir(dir, { recursive: true });
await cp("/studio/fixture/board.html", `${dir}/index.html`);
await writeFile(
  `${dir}/filter.mjs`,
  "export function filterIssues(issues) {\n  return issues;\n}\n",
);
await writeFile(
  `${dir}/filter.test.mjs`,
  "// Tests for issue-board filters.\n",
);
await writeFile(
  `${dir}/package.json`,
  JSON.stringify({
    name: "issue-board",
    private: true,
    type: "module",
    scripts: {
      test: "node --test filter.test.mjs && node -e \"require('fs').writeFileSync('.test-passed','yes')\"",
    },
  }),
);
await writeFile(`${dir}/.gitignore`, ".test-passed\n");
for (const args of [
  ["init"],
  ["add", "."],
  [
    "-c",
    "user.name=Demo",
    "-c",
    "user.email=demo@example.com",
    "commit",
    "-m",
    "Initial issue board",
  ],
])
  execFileSync("git", args, { cwd: dir });
const server = spawn("node", ["/studio/fixture/server.mjs", dir], {
  detached: true,
  stdio: "ignore",
});
server.unref();
