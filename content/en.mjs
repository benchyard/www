export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard | Secure cloud workspaces for agents and teams",
    description:
      "Build with your agents in a persistent cloud workspace. Guide tasks, review changes and approve next steps from your laptop, tablet or phone.",
  },
  hero: {
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
    ["business", "For Business"],
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
  tour: [
    [
      "Review the changes",
      "Read each file's diff beside the conversation while the agent waits for your decision.",
      "session-approval",
      "Codex session with three changed files, a readable filter diff and a test command awaiting approval.",
    ],
    [
      "See what ran",
      "The command you approved, its output and the agent's summary stay in the session.",
      "session-done",
      "Completed Codex task with the output of the approved test command and three file changes.",
    ],
    [
      "Open a port",
      "Ports lists what is listening in the workspace. Where the installation has previews, Open in browser shows it at an address of its own, which only you can open.",
      "ports",
      "The workspace Ports panel offers Open in browser for the running issue-board development server.",
    ],
    [
      "Try the result",
      "Use the running app before you accept the change. A preview is not a public link or a way to share with a team.",
      "preview",
      "The running issue-board application with All issues, In progress and Done filters and six fictional issues.",
    ],
    [
      "Keep every project in reach",
      "Each workspace lists its sessions and says whether it is running, with its SSH name beside it.",
      "workspaces",
      "Benchyard workspace list with the running issue-board workspace and its connected agent sessions.",
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
        "Closing a browser does not stop the workspace. A stopped workspace keeps its files and session history, and starts again when you send a message.",
      ],
    ],
    tools: [
      [
        "Terminal and files in the browser",
        "A terminal that outlives a closed tab, and a file tree with an editor for the open folder.",
      ],
      [
        "SSH from your own computer",
        "Add a public key and connect with ssh, scp, rsync or sftp through the benchyard command. No port is opened on the workspace.",
      ],
      [
        "Snapshots and rollback",
        "Take a snapshot of the workspace's disk by hand, or daily while it is idle. A rollback saves the present state first, so it can be undone.",
      ],
      [
        "A desktop where the machine type has one",
        "Open a graphical desktop in the browser to look at what an agent built. It has no sound and is drawn in software.",
      ],
    ],
    locations: [
      [
        "Containers",
        "A container for each workspace. Stopping one ends what was running and keeps its files.",
      ],
      [
        "Machines",
        "A virtual machine for each workspace, with a disk of its own. An idle machine can be suspended, which keeps what was running in its memory.",
      ],
      [
        "Shared or Dedicated",
        "Each machine type says which it is. Shared types share their host's cores with other workspaces; Dedicated types have cores and memory reserved for them.",
      ],
    ],
  },
  agents: {
    title: "Your choice of agent. One familiar workspace.",
    lead: "Start with the agent you use today. These are the current integrations; each keeps its own sign-in requirements and capabilities.",
    future:
      "More agent and model integrations are planned, including Kimi Code, GLM Code and MiniMax. Tell us what you would like to use. Availability will be documented as each integration is verified.",
    planned: [
      ["kimi", "Kimi Code"],
      ["glm", "GLM Code"],
    ],
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
  business: {
    eyebrow: "FOR BUSINESS",
    title: "Run Benchyard the way your business works.",
    lead: "Contact us about a hosted account or an installation on infrastructure you operate. We agree the shape before anything starts.",
    subject: "Benchyard for business",
    cta: "Contact us",
    body: [
      "Business and your role",
      "Where should it run: Benchyard's hosted service, your own infrastructure, or both?",
      "What should be tailored: agents, machine types, limits, network, or something else?",
    ],
    items: [
      [
        "A tailored installation",
        "Agents, machine types, limits and how the deployment is set up are agreed for your business. This page is not a catalog, and it does not promise a feature that is not agreed.",
      ],
      [
        "On your infrastructure",
        "Benchyard can run on infrastructure your business operates. That installation is licensed separately from the hosted service, and the operator's own privacy notice applies to it.",
      ],
    ],
    note: "Availability depends on what we agree. Agent subscriptions and API usage stay with their providers.",
  },
  security: {
    title: "Keep secrets outside the workspace.",
    lead: "For the credentials the keepers hold, agents receive placeholders. A credential keeper outside the workspace adds the real value only to requests for that credential's hosts.",
    items: [
      [
        "Credentials outside the workspace",
        "The keepers hold secrets that name their hosts, API keys for the providers Benchyard knows, and subscription sign-ins for Claude Code, Codex and Cursor. The workspace holds a placeholder.",
      ],
      [
        "What the operator can read",
        "Whoever runs the installation can read stored credentials and session content. Stored credentials are encrypted with keys the operator holds. This is not end-to-end encryption.",
      ],
      [
        "Secrets need care",
        "A secret that names no hosts, a team key for the team's own gateway, private keys and anything saved in files can be read by the agent.",
      ],
      [
        "Environment matters",
        "Containers and machines are isolated in different ways. Where a machine type lets people become root, the protection boundary changes.",
      ],
      [
        "Network and traffic",
        "A workspace can reach any public address; private network ranges are refused. Each workspace has an allowance for what it sends, and installation admins decide whether an empty one restricts it.",
      ],
      [
        "Sign-in and records",
        "Sign in with a password or a passkey, with two-factor authentication. Installation admins have an audit log of changes to accounts, sign-ins, teams and settings.",
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
      "What happens when a workspace is stopped?",
      "Its files, conversations and sign-ins are kept; terminals and running programs end. Opening a session does not start it. Sending a message does, and the message is held until the workspace is up. An idle machine may be suspended instead, which keeps what was running in its memory.",
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
      "How is workspace use counted?",
      "Where an installation charges for use, what workspaces use is counted in machine credits, and credits can be bought by card through a payment provider. Agent subscriptions and API usage are separate and stay with their providers.",
    ],
    [
      "How do I get access?",
      "Request an invitation and tell us which agents you use and what you want to work on. We will discuss availability, supported environments and pricing before you start.",
    ],
    [
      "Can a business run Benchyard itself?",
      "Yes, as an installation you agree, on infrastructure you operate. You can also use the hosted service. Contact us with the business, where it should run, and what should be tailored.",
    ],
  ],
};
