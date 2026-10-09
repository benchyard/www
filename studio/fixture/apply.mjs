import { readFile, writeFile } from "node:fs/promises";
const dir = process.argv[2];
if (!dir?.startsWith("/data/")) throw new Error("Isolated fixture only");
await writeFile(
  `${dir}/filter.mjs`,
  `/** Return the issues matching the selected status. */
export function filterIssues(issues, status = 'all') {
  if (status === 'all') return issues;
  return issues.filter(issue => issue.status === status);
}
`,
);
await writeFile(
  `${dir}/filter.test.mjs`,
  `import test from 'node:test';
import assert from 'node:assert/strict';
import { filterIssues } from './filter.mjs';
const issues = [{ id: 1, status: 'progress' }, { id: 2, status: 'done' }];
test('all includes every issue', () => assert.equal(filterIssues(issues).length, 2));
test('in progress excludes completed issues', () => assert.deepEqual(filterIssues(issues, 'progress'), [issues[0]]));
test('done includes only completed issues', () => assert.deepEqual(filterIssues(issues, 'done'), [issues[1]]));
test('empty board stays empty', () => assert.deepEqual(filterIssues([], 'done'), []));
`,
);
let html = await readFile(`${dir}/index.html`, "utf8");
html = html.replace(
  "<!-- FILTER -->",
  '<nav aria-label="Issue status"><button data-status="all" aria-pressed="true">All issues</button><button data-status="progress" aria-pressed="false">In progress</button><button data-status="done" aria-pressed="false">Done</button></nav>',
);
html = html.replace(
  "<!-- SCRIPT -->",
  `<script type="module">
import { filterIssues } from './filter.mjs';
const rows = [...document.querySelectorAll('article')];
const issues = rows.map((row, id) => ({ id, status: row.dataset.status }));
for (const button of document.querySelectorAll('nav button')) {
  button.onclick = () => {
    const visible = new Set(filterIssues(issues, button.dataset.status).map(issue => issue.id));
    rows.forEach((row, id) => row.hidden = !visible.has(id));
    document.querySelector('#count').textContent = visible.size + ' issues';
    document.querySelectorAll('nav button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  };
}
</script>`,
);
await writeFile(`${dir}/index.html`, html);
