export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard | Secure cloud workspaces for agents and teams",
    description:
      "Build with your agents in a persistent cloud workspace. Guide tasks, review changes and approve next steps from your laptop, tablet or phone.",
  },
  hero: {
    eyebrow: "One workspace. Across your devices.",
    title: "A secure cloud workspace yard for agents.",
    tagline: "Build from any device, solo or with your team.",
    lead: "Keep code, terminals and previews in a workspace that runs independently of your browser. Guide your agents, review changes and approve the next step anytime, anywhere, from your laptop, tablet or phone.",
    note: "Access by invitation. Bring your agent subscription or API key.",
  },
  nav: [
    ["workspace", "Workspace"],
    ["agents", "Agents"],
    ["notifications", "Notifications"],
    ["teams", "For Teams"],
    ["security", "Security"],
  ],
  access: {
    label: "Request access",
    subject: "Benchyard access",
    body: [
      "Which agents do you use?",
      "What would you like to work on with Benchyard?",
    ],
  },
  steps: [
    [
      "Start a task",
      "Choose a workspace and an agent. Give it the task, then follow its progress.",
    ],
    [
      "Make the decisions",
      "Get notified when your attention is needed. Open the session to review and approve.",
    ],
    [
      "Check the result",
      "Read the diff, inspect the test output and open the running app in your browser.",
    ],
  ],
  workspace: {
    title: "A place for the whole task.",
    lead: "The conversation, files, terminal and changes stay together. Close your browser and return to the same workspace from another device.",
    items: [
      [
        "Review the changes",
        "Read file diffs beside the conversation, inspect files and use a terminal in the workspace.",
      ],
      [
        "Keep work in context",
        "Separate tasks into sessions and use Git worktrees when parallel work needs separate working copies.",
      ],
      [
        "Return when you are ready",
        "Closing a browser does not stop the workspace. Stopping the workspace ends its processes; disk contents and session history remain.",
      ],
    ],
    locations: [
      [
        "Containers",
        "Container workspaces on the configured infrastructure. Isolation depends on the backend and runtime.",
      ],
      [
        "Cloud machines",
        "Google Cloud and AWS machine backends, where offered by your deployment and account.",
      ],
      [
        "Your own Linux machine",
        "Attach a Linux machine with systemd when enabled for your account. Available in your personal space.",
      ],
    ],
  },
  agents: {
    title: "Your choice of agent. One familiar workspace.",
    lead: "Start with the agent you use today. These are the current integrations; each keeps its own sign-in requirements and capabilities.",
    future:
      "More agent and model integrations are planned, including Kimi, GLM and MiniMax. Tell us what you would like to use. Availability will be documented as each integration is verified.",
    items: [
      ["claude", "Claude Code", "Connect a Claude subscription or an API key."],
      [
        "codex",
        "Codex",
        "Connect ChatGPT through a device code, or use an API key.",
      ],
      [
        "cursor",
        "Cursor",
        "Connect a Cursor account or an API key. Account sign-in may need renewing after about 60 days.",
      ],
      [
        "gemini",
        "Gemini CLI",
        "Connect with an API key. Subscription sign-in is not supported here.",
      ],
    ],
  },
  teams: {
    title: "For teams, with room for individual work.",
    lead: "Share the setup your team needs while keeping workspaces individually owned.",
    items: [
      [
        "Shared instructions and tools",
        "Share rules, skills and tools. Members approve shared tools that run code.",
      ],
      [
        "Managed sign-ins and usage",
        "Manage the credentials available in team workspaces and review usage across your team.",
      ],
      [
        "Individual workspaces",
        "A team admin cannot open a member’s workspace contents or start and stop their workspaces.",
      ],
    ],
  },
  security: {
    title: "Keep secrets outside the workspace.",
    lead: "For supported provider credentials and host-scoped secrets, agents receive placeholders. A credential keeper adds the real value only to requests for the configured hosts.",
    items: [
      [
        "Credentials outside the workspace",
        "For keeper-protected credentials, agents receive placeholders. The real values stay outside the workspace and are added to the configured outgoing requests.",
      ],
      [
        "Server visibility",
        "Benchyard’s server can read stored credentials and session content. This is not end-to-end encryption.",
      ],
      [
        "Environment matters",
        "Isolation varies across containers, cloud machines and your own machine. Root access changes the protection boundary.",
      ],
      [
        "Secrets need care",
        "Plain environment variables, custom gateway keys and secrets written into files may be readable by the agent.",
      ],
    ],
  },
  faq: [
    [
      "What is Benchyard?",
      "Benchyard is a persistent workspace for coding agents. It brings sessions, files, terminals, diffs and browser previews together, with access from a computer or phone.",
    ],
    [
      "Does work continue when I close my laptop?",
      "It can continue while the workspace remains running. Closing the browser does not stop it. A task that needs approval waits for your decision; stopping the workspace ends its running processes.",
    ],
    [
      "Can I approve from a second device?",
      "Yes. One device drives messages at a time, and another signed-in device can watch and approve. Open the session from a notification to make the decision.",
    ],
    [
      "Are agents and models the same thing?",
      "No. An agent is the tool that works on your code; a model is what powers it. Model and provider choices depend on the agent and its configuration. The integrations shown here are the current ones, not a limit on Benchyard’s future direction.",
    ],
    [
      "Do I need a separate agent account?",
      "Yes. Bring the subscription or API key supported by your agent, or use credentials supplied by your team. Agent provider charges and access requirements are separate.",
    ],
    [
      "Can I share a preview with my team?",
      "Browser previews currently require the workspace owner’s sign-in. They are not public or team-sharing links. Preview availability depends on the deployment.",
    ],
    [
      "What gets sent by email?",
      "When enabled and configured, email is for approvals, plans needing review, failed turns and expired agent sign-ins. Completion and agent notes are not sent by email.",
    ],
    [
      "How do I get access?",
      "Request an invitation and tell us which agents you use and what you want to work on. We will discuss availability, supported environments and pricing before you start.",
    ],
  ],
};
