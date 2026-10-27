// Prepare a deterministic fixture from the main branch's test agent.
// No application source is changed; generated binaries stay in output/.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const app =
  process.env.BENCHYARD_SOURCE ||
  fileURLToPath(new URL("../../benchyard/", import.meta.url));
await mkdir(`${root}/studio/output/bin`, { recursive: true });
let go = await readFile(`${app}/internal/testutil/fakecodex/main.go`, "utf8");
go = go
  .replace('"github.com/benchyard/benchyard/internal/testutil/fakeimg"', "")
  .replace("fakeimg.PNG()", "[]byte{}");
const demo = `
\tcase text == "Add a status filter to the issue board and test it.":
\t\tmessage(t, words("I will add a status filter to the issue board, keep the counts in sync, and cover the filter behavior with tests."))
\t\ttime.Sleep(2 * time.Second)
\t\tif out, err := exec.Command("node", "/studio/fixture/setup.mjs", cwd).CombinedOutput(); err != nil { return fmt.Errorf("fixture: %s: %w", out, err) }
\t\tif out, err := exec.Command("node", "/studio/fixture/apply.mjs", cwd).CombinedOutput(); err != nil { return fmt.Errorf("apply: %s: %w", out, err) }
\t\tfor _, name := range []string{"filter.mjs", "filter.test.mjs", "index.html"} {
\t\t\tdiff, _ := exec.Command("git", "-C", cwd, "diff", "--", name).Output()
\t\t\titem := map[string]any{"type": "fileChange", "id": "patch-" + newID(), "status": "completed", "changes": []any{map[string]any{"path": filepath.Join(cwd, name), "kind": map[string]any{"type": "update"}, "diff": string(diff)}}}
\t\t\tnotify("item/started", map[string]any{"threadId": thread, "turnId": t.id, "item": item})
\t\t\tnotify("item/completed", map[string]any{"threadId": thread, "turnId": t.id, "item": item})
\t\t}
\t\tmessage(t, words("The filter and tests are ready. Please approve npm test to check the four filter cases before reviewing the running app."))
\t\ttime.Sleep(2 * time.Second)
\t\tif err := act(ctx, t, "tool: npm test"); err != nil { return err }
\t\tif b, _ := os.ReadFile(filepath.Join(cwd, ".test-passed")); string(b) == "yes" {
\t\t\tmessage(t, words("Implemented the status filter.\\n\\n- All, In progress, and Done views keep the issue count in sync.\\n- Four filter tests passed, including the empty state.\\n- Three files changed.\\n\\nOpen port 4173 from Ports to try the updated issue board."))
\t\t}
`;
go = go.replace(
  "func act(ctx context.Context, t *turnState, text string) error {\n\tswitch {",
  "func act(ctx context.Context, t *turnState, text string) error {\n\tswitch {" +
    demo,
);
go = go.replace(
  "fakecodex wants to run a command",
  "Run the issue-board filter tests",
);
go = go
  .replaceAll("GPT-Fake mini", "Demo mini")
  .replaceAll("GPT-Fake", "GPT-6-Astra")
  .replaceAll('"gpt-fake"', '"gpt-6-astra"');
await writeFile(`${root}/studio/output/democodex.go`, go);
execFileSync(
  "go",
  [
    "build",
    "-o",
    `${root}/studio/output/bin/democodex`,
    `${root}/studio/output/democodex.go`,
  ],
  {
    env: {
      ...process.env,
      GOOS: "linux",
      GOARCH: process.env.DEMO_ARCH || "arm64",
      CGO_ENABLED: "0",
    },
    stdio: "inherit",
  },
);
await writeFile(
  `${root}/studio/output/source.json`,
  JSON.stringify(
    {
      commit: execFileSync("git", ["-C", app, "rev-parse", "HEAD"], {
        encoding: "utf8",
      }).trim(),
      recorded: new Date().toISOString().slice(0, 10),
      scripted: true,
    },
    null,
    2,
  ),
);
