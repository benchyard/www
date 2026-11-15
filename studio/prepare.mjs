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
\tcase strings.Contains(text, "Please run npm test again"):
\t\trun := exec.Command("npm", "test")
\t\trun.Dir = cwd
\t\tif run.Run() == nil {
\t\t\tmessage(t, words("I ran npm test again: the four filter tests still pass."))
\t\t} else {
\t\t\tmessage(t, words("I ran npm test again, and it failed."))
\t\t}
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
// The same for Claude: three prompts become calls of Benchyard's own tools,
// made for real through the workspace's benchyard-workspace server: a
// question for the person, a message to the Codex session, and a form for a
// key. The capture writes the Codex session's id where this one reads it.
let claude = await readFile(
  `${app}/internal/testutil/fakeclaude/main.go`,
  "utf8",
);
claude = claude
  .replace('"github.com/benchyard/benchyard/internal/testutil/fakeimg"', "")
  .replaceAll("fakeimg.PNG()", "[]byte{}");
const mcpCase = '\tcase strings.HasPrefix(prompt, "mcp:"):';
const said = 'return stream(ctx, words("The tool said: "+out), 0)';
if (!claude.includes(mcpCase) || !claude.includes(said))
  throw new Error("fakeclaude no longer has the MCP prompt this patch uses");
claude =
  claude
    .replace(
      mcpCase,
      `\tcase demoPrompt(prompt) != "":\n\t\tprompt = demoPrompt(prompt)\n\t\tfallthrough\n${mcpCase}`,
    )
    .replace(said, "return stream(ctx, words(demoSaid(tool, out)), 0)") +
  `
func demoPrompt(p string) string {
	switch p {
	case "Which database should the reporting service use? Ask me.":
		return ` +
  "`" +
  `mcp: benchyard-workspace ask_person {"questions":[{"question":"Which database should the new reporting service use?","header":"Database","options":[{"label":"PostgreSQL","description":"The database the issue board already uses."},{"label":"SQLite","description":"One file, with nothing to run beside it."}]}]}` +
  "`" +
  `
	case "Ask the Codex session to run the filter tests again.":
		id, _ := os.ReadFile("/studio/output/codex-session.txt")
		b, _ := json.Marshal(map[string]any{"session": strings.TrimSpace(string(id)), "text": "Please run npm test again and tell me whether the four filter tests still pass."})
		return "mcp: benchyard-workspace sessions_message " + string(b)
	case "Send the issue board's errors to Sentry.":
		return ` +
  "`" +
  `mcp: benchyard-workspace request_secret {"name":"SENTRY_AUTH_TOKEN","purpose":"To send the issue board's errors to your Sentry project.","hosts":["sentry.io"]}` +
  "`" +
  `
	}
	return ""
}

func demoSaid(tool, out string) string {
	switch {
	case tool == "ask_person" && strings.Contains(out, "PostgreSQL"):
		return "Thanks. I will plan the reporting service on PostgreSQL."
	case tool == "sessions_message":
		return "I asked the Codex session to run the filter tests again. It answers in its own session."
	case tool == "request_secret" && strings.Contains(strings.ToLower(out), "didn"):
		return "Understood. I will leave Sentry out for now."
	}
	return "The tool said: " + out
}
`;
await mkdir(`${root}/studio/output/democlaude`, { recursive: true });
await writeFile(`${root}/studio/output/democlaude/main.go`, claude);
execFileSync(
  "go",
  [
    "build",
    "-o",
    `${root}/studio/output/bin/democlaude`,
    `${root}/studio/output/democlaude/main.go`,
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
