export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard | Secure cloud workspaces for agents and teams",
    description:
      "Build with your agents in a persistent cloud workspace. Guide tasks, review changes and approve next steps from your laptop, tablet or phone.",
  },
  hero: {
    title: "Secure cloud workspaces for agents and teams.",
    tagline: "Build from any device, on your own or together.",
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
      "Read what changed, look at the test results and open the running app in your browser.",
    ],
  ],
  tour: [
    [
      "Review the changes",
      "See exactly what the agent changed in each file, beside the conversation, while it waits for your decision.",
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
      "Open the running app",
      "Ports lists the apps running in the workspace. Where previews are available, Open in browser shows one at an address of its own, which only you can open.",
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
      "Keep every workspace in reach",
      "Each workspace lists its sessions and says whether it is running.",
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
        "See what changed beside the conversation, look through the files and use a terminal in the workspace.",
      ],
      [
        "Keep work in context",
        "Give each task its own session. Tasks that run side by side can each work on their own copy of the code.",
      ],
      [
        "Return when you are ready",
        "Closing a browser does not stop the workspace. A stopped workspace keeps its files and session history, and starts again when you send a message.",
      ],
    ],
    tools: [
      [
        "Terminal and files in the browser",
        "A terminal that keeps going when you close the tab, and a file browser with an editor.",
      ],
      [
        "Connect from your own computer",
        "Prefer your own terminal or editor? Connect to a workspace over SSH and copy files with the tools you already use.",
      ],
      [
        "Snapshots and rollback",
        "Save the state of a workspace's files whenever you like, or once a day automatically. Going back to a snapshot saves the present state first, so you can undo it.",
      ],
      [
        "A desktop when you need one",
        "On workspaces that include a desktop, open it in the browser to look at what an agent built. It has no sound.",
      ],
    ],
    locations: [
      [
        "Containers",
        "A light, isolated environment for each workspace. Stopping one ends what was running and keeps its files.",
      ],
      [
        "Machines",
        "A virtual computer for each workspace, with its own disk. An idle machine can be suspended, so that what was running carries on when it starts again.",
      ],
      [
        "Shared or Dedicated",
        "Each size of workspace says which it is. Shared sizes share processing power with other workspaces; Dedicated sizes have processors and memory reserved for them.",
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
        "Sign in to ChatGPT with a one-time code, or use an API key.",
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
        "Share rules, skills and tools. A shared tool that runs code reaches a member only after that member allows it.",
      ],
      [
        "Managed sign-ins and usage",
        "Provide the agent sign-ins your team's workspaces use, and see usage across the team.",
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
      "What should be tailored: agents, workspace sizes, limits, network, or something else?",
    ],
    items: [
      [
        "A tailored installation",
        "Agents, workspace sizes, limits and how the installation is set up are agreed for your business. This page is not a catalog, and it does not promise a feature that is not agreed.",
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
    lead: "An agent needs your sign-ins and keys to do its work, but it does not need to see them. For protected credentials the agent gets a stand-in, and a credential keeper outside the workspace adds the real value only to requests for the service it belongs to.",
    items: [
      [
        "Credentials outside the workspace",
        "Protected this way: agent sign-ins for Claude Code, Codex and Cursor, API keys for the services Benchyard knows, and any secret you tie to a service's address.",
      ],
      [
        "Encrypted in storage",
        "Your sign-ins, keys and secrets are stored encrypted, with a separate key for each person and team. Benchyard is not end-to-end encrypted: the party that runs the service can access what it stores.",
      ],
      [
        "Secrets need care",
        "A secret that is not tied to a service, a private key, and anything saved in a file in the workspace can be read by the agent.",
      ],
      [
        "Workspaces are kept apart",
        "Each workspace is isolated from the others. Where a workspace gives you administrator rights, an agent working for you has them too.",
      ],
      [
        "Network and traffic",
        "A workspace can reach the public internet, but not addresses inside private networks. Each workspace has an allowance for how much it sends, and an installation's administrators decide whether running out restricts it.",
      ],
      [
        "Sign-in and records",
        "Sign in with a password or a passkey, with two-factor authentication. An installation's administrators have a record of changes to accounts, sign-ins, teams and settings.",
      ],
    ],
  },
  faq: [
    [
      "What is Benchyard?",
      "Benchyard is a workspace in the cloud for coding agents. It keeps the conversation, the files, a terminal, the changes and a preview of the running app together, and you reach it from a computer or a phone.",
    ],
    [
      "Does work continue when I close my laptop?",
      "Yes, while the workspace is running. Closing the browser does not stop it. A task that needs your approval waits for your decision; stopping the workspace ends what was running in it.",
    ],
    [
      "What happens when a workspace is stopped?",
      "Its files, conversations and sign-ins are kept; terminals and running programs end. Opening a session does not start it. Sending a message does, and the message is held until the workspace is up. An idle machine may be suspended instead, and then what was running carries on when it starts again.",
    ],
    [
      "Can I approve from a second device?",
      "Yes. One device drives a session at a time, and any other device you are signed in on can watch and approve. Sending a message from another device takes the session over. Open the session from a notification to make the decision.",
    ],
    [
      "Are agents and models the same thing?",
      "No. An agent is the tool that works on your code; a model is the AI behind it. Which models you can use depends on the agent and how it is set up. The agents shown here are the current ones, and more are planned.",
    ],
    [
      "Do I need a separate agent account?",
      "Yes. Bring the subscription or API key your agent accepts, or use a sign-in your team provides. What the agent's provider charges is separate from Benchyard.",
    ],
    [
      "Can I share a preview with my team?",
      "No. A preview opens only for the workspace's owner, signed in. It is not a public link or a way to share with a team. Whether previews are available depends on the installation.",
    ],
    [
      "What gets sent by email?",
      "If you turn email on, you get one when an agent needs your approval, has a plan for you to review, fails, or needs you to sign in again. Finished tasks and agent notes are not emailed.",
    ],
    [
      "How is workspace use counted?",
      "Where an installation charges for use, what workspaces use is counted in credits. Agent subscriptions and API usage are separate and stay with their providers.",
    ],
    [
      "How do I get access?",
      "Request an invitation and tell us which agents you use and what you want to work on. We will discuss availability and pricing before you start.",
    ],
    [
      "Can a business run Benchyard itself?",
      "Yes, as an installation you agree, on infrastructure you operate. You can also use the hosted service. Contact us with the business, where it should run, and what should be tailored.",
    ],
  ],
};
