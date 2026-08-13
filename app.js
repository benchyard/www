const STEPS = [
  {
    key: "running",
    pill: "running",
    tone: "pill-warn",
    agent: "Editing worktree on origin/dev. Will not commit.",
    foot: "You can interrupt and comment anytime.",
  },
  {
    key: "gating",
    pill: "gating",
    tone: "pill-warn",
    agent: "Worker running the repo gate. ruff check on changed files.",
    foot: "Authoritative gate — not the agent’s local check.",
  },
  {
    key: "pushed",
    pill: "pushing",
    tone: "pill-warn",
    agent: "Commit as benchyard. Pushing origin/dev.",
    foot: "Same-repo merge lock held.",
  },
  {
    key: "retesting",
    pill: "retesting",
    tone: "pill-info",
    agent: "Read-only. Replaying the original failing request against deploy.",
    foot: "No edits in this turn.",
  },
  {
    key: "verify",
    pill: "verify",
    tone: "pill-info",
    agent: "Retest passed. Waiting on a human to close.",
    foot: "Nothing closes itself.",
  },
];

const order = ["running", "gating", "pushed", "retesting", "verify"];

function apply(index) {
  const step = STEPS[index];
  const pill = document.getElementById("status-pill");
  const list = document.querySelector("[data-list-status]");
  const agent = document.getElementById("agent-line");
  const foot = document.getElementById("foot-line");
  if (!pill || !agent) return;

  pill.className = `pill ${step.tone}`;
  pill.textContent = step.pill;
  if (list) {
    list.className = `pill ${step.tone}`;
    list.textContent = step.pill;
  }
  agent.textContent = step.agent;
  if (foot) foot.textContent = step.foot;

  const reached = new Set(order.slice(0, index + 1));
  document.querySelectorAll("#timeline [data-k]").forEach((el) => {
    const k = el.getAttribute("data-k");
    el.classList.remove("done", "now");
    if (k === step.key) el.classList.add("now");
    else if (reached.has(k) && k !== step.key) el.classList.add("done");
  });
}

function bootDemo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply(0);
    return;
  }
  let i = 0;
  apply(i);
  window.setInterval(() => {
    i = (i + 1) % STEPS.length;
    apply(i);
  }, 2400);
}

function bootCopy() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const el = sel ? document.querySelector(sel) : null;
      const text = el ? el.textContent.trim() : "";
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied";
        window.setTimeout(() => {
          btn.textContent = "Copy";
        }, 1400);
      } catch {
        btn.textContent = "Copy failed";
      }
    });
  });
}

bootDemo();
bootCopy();
