export const reviewed = "2026-10-09";
export const transcript = [
  [
    "00:00",
    "Your workspace keeps working.",
    "A Benchyard workspace holds the project and separate agent sessions.",
  ],
  [
    "00:05",
    "Start a task with your preferred agent.",
    "Codex receives a request to add a status filter to a fictional issue board and test it.",
  ],
  [
    "00:13",
    "Step away while your workspace stays running.",
    "The workspace has real changes in three files. It remains available independently of the browser.",
  ],
  [
    "00:21",
    "Get notified when a decision needs you.",
    "A simulated phone notification points back to the session. The notification itself does not approve the command.",
  ],
  [
    "00:28",
    "Review and approve from your phone.",
    "The signed-in phone opens the same session and approves npm test. The command waits until approval.",
  ],
  [
    "00:38",
    "Check what changed and what passed.",
    "The command runs four real filter tests. The session contains the result and the file diff.",
  ],
  [
    "00:47",
    "Open your running app in the browser.",
    "A workspace port opens the issue board. In progress and Done each display three matching issues.",
  ],
  [
    "00:55",
    "Your agents. Your workspace.",
    "Current integrations include Claude Code, Codex, Cursor and Gemini CLI. More agent and model integrations are planned. Request access to discuss your setup.",
  ],
];
export const guides = [
  {
    slug: "agents",
    title: "Coding agents in Benchyard",
    description:
      "Compare supported sign-ins, approvals and steering for Claude Code, Codex, Cursor and Gemini CLI in Benchyard.",
    lead: "Benchyard provides a persistent workspace around your coding agent. The current integrations share a workspace interface, but their authentication and capabilities are different.",
    sections: [
      {
        id: "supported-agents",
        title: "Which agents and sign-ins are supported?",
        table: {
          head: ["Agent", "Supported sign-in", "Important detail"],
          rows: [
            [
              "Claude Code",
              "Claude subscription or API key",
              "Use the subscription or key that provides your agent access.",
            ],
            [
              "Codex",
              "ChatGPT device code or API key",
              "ChatGPT device-code login must be available for your account. This is not a localhost browser redirect flow.",
            ],
            [
              "Cursor",
              "Cursor account or API key",
              "Account sign-in may need renewing after approximately 60 days.",
            ],
            [
              "Gemini CLI",
              "API key",
              "Subscription sign-in is not supported in Benchyard.",
            ],
          ],
        },
      },
      {
        id: "models-and-providers",
        title: "How do agents, models and providers differ?",
        paragraphs: [
          "An agent is the CLI that reads files, runs tools and manages a coding task. Models and providers supply its underlying inference. Supporting an agent does not mean every model or compatible endpoint has been tested.",
          "Team-managed sign-ins can configure a gateway address for Claude Code, Codex and Gemini CLI. Cursor does not have a documented custom-address setting here. Compatibility depends on the agent protocol, gateway and chosen model; configuration support is not an end-to-end compatibility guarantee.",
          "More agent and model integrations are planned, including Kimi Code, GLM Code and MiniMax. These names describe the intended direction, not verified built-in availability today.",
        ],
      },
      {
        id: "approvals",
        title: "Do all agents use the same approval controls?",
        paragraphs: [
          "No. Benchyard presents approvals from each agent’s protocol. The available modes, edit approvals, planning and subagent behavior depend on that integration. Cursor does not provide the same Ask first edit-approval behavior as Claude Code or Codex.",
          "A waiting approval pauses the action that needs permission. A notification opens the session; the decision is made inside the signed-in application.",
        ],
      },
      {
        id: "steering",
        title: "Can I change direction while an agent is working?",
        paragraphs: [
          "Codex supports native steering during a turn. Other integrations use stopping the current turn and sending a new message. Do not assume that every integration can accept an in-progress instruction in the same way.",
          "One device drives messages in a session at a time. Another signed-in device can observe and approve. Separate sessions and Git worktrees can help keep parallel tasks apart; they do not imply automatic cooperation between agents.",
        ],
      },
      {
        id: "credentials",
        title: "Where do the credentials come from?",
        paragraphs: [
          "Use your supported provider subscription or API key, or credentials made available by your team. Benchyard access does not include an agent subscription or promise a provider allowance.",
          "Supported provider sign-ins and host-scoped secrets can be mediated by credential keepers. The Benchyard server can read credentials and session content. Read the security guide before choosing how to provide secrets.",
        ],
        link: ["/guides/security/", "Read the security and credentials guide"],
      },
    ],
  },
  {
    slug: "workspaces",
    title: "How Benchyard workspaces work",
    description:
      "Understand persistent workspaces, stopping and resuming, phone approvals, browser previews and notifications in Benchyard.",
    lead: "A workspace is the running environment for your coding sessions, project files and tools. You access it from the browser on your computer or phone.",
    sections: [
      {
        id: "lifecycle",
        title: "What persists when I leave?",
        paragraphs: [
          "Closing a browser tab or laptop does not stop a running workspace. A running agent can continue until it finishes, needs input, encounters a failure or the workspace stops.",
          "Stopping a workspace ends its running processes and terminals. Its disk contents and session history remain. Starting it again does not restore a suspended process’s memory; restart development servers and other processes as needed. Idle-stop and deployment policies may also affect how long a workspace runs.",
        ],
      },
      {
        id: "environments",
        title: "Where does the workspace run?",
        table: {
          head: ["Environment", "Availability and boundary"],
          rows: [
            [
              "Containers",
              "Available on configured infrastructure. Runtime isolation depends on the deployment; gVisor is not a claim about every backend.",
            ],
            [
              "Google Cloud or AWS",
              "Cloud-machine backends are available where configured and enabled for your account.",
            ],
            [
              "Your own Linux machine",
              "Requires Linux with systemd and the own-machine feature. Personal spaces only. The server does not create, start or stop your machine.",
            ],
          ],
        },
      },
      {
        id: "devices",
        title: "How do I continue on my phone?",
        paragraphs: [
          "Sign in on the other device and open the same workspace and session. One device drives messages at a time; other signed-in devices can watch and approve.",
          "On an iPhone, add Benchyard to the Home Screen before enabling push notifications. Push is enabled per device and requires that device’s permission. Notifications open the session, where you inspect and approve the request.",
        ],
      },
      {
        id: "previews",
        title: "How do browser previews work?",
        paragraphs: [
          "When previews are configured, the Ports list offers Open in browser for the development server running inside a workspace. The preview opens on a separate origin from the console.",
          "Previews require the workspace owner’s sign-in. They are not public links or a way to share the app with other team members. A stopped workspace may start when its preview is opened, but the development server must still be running on the port.",
        ],
      },
      {
        id: "notifications",
        title: "What is pushed, and what is emailed?",
        table: {
          head: ["Channel", "What to expect", "Requirements"],
          rows: [
            [
              "Device push",
              "Approvals, plans, completion, failure, agent notes and workspace-ready events.",
              "Opt in on each device. iPhone requires adding the app to the Home Screen.",
            ],
            [
              "Email",
              "Approvals, plans to review, failed turns and expired agent sign-ins. No completion or agent-note mail.",
              "Opt in, confirm your email address, and use a deployment with SMTP configured.",
            ],
          ],
        },
        paragraphs: [
          "Email notifications are suppressed while you are viewing the session and throttled to avoid repeated mail within ten minutes. Email and push delivery are not availability guarantees.",
        ],
      },
      {
        id: "demo-transcript",
        title: "60-second demo: task to preview",
        paragraphs: [
          "Recorded in Benchyard with demo data. Agent responses are scripted; timing is edited. The lock-screen notification is simulated. File changes, tests and preview interactions are real.",
        ],
        transcript: true,
      },
    ],
  },
  {
    slug: "security",
    title: "Security and data boundaries",
    description:
      "Learn what Benchyard servers and agents can read, how credential keepers work, and how workspace and team boundaries differ.",
    lead: "Benchyard runs code and holds session data. These boundaries explain the current design so you can decide which environment and credentials fit your work.",
    sections: [
      {
        id: "server-access",
        title: "What can the Benchyard server read?",
        paragraphs: [
          "The server can read provider sign-ins, stored API keys and secrets, and session content. There is no end-to-end encryption that prevents the server from accessing these contents.",
          "Storage protection and credential mediation do not change that trust relationship. Do not treat the server as unable to access the information you give it.",
        ],
      },
      {
        id: "keepers",
        title: "What do credential keepers protect?",
        paragraphs: [
          "For supported provider credentials and host-scoped secrets, the workspace receives a placeholder. Credential keepers hold the real value outside the workspace and insert it only into configured request fields for the credential’s hosts. The agent can use the credential at those hosts while the workspace runs, without receiving its raw value.",
          "This is not a universal guarantee that an agent cannot read secrets. Plain environment variables, custom gateway keys and secrets written into files can be readable in the workspace. Configure each secret according to its actual handling.",
        ],
      },
      {
        id: "isolation",
        title: "Is every workspace isolated the same way?",
        paragraphs: [
          "No. Container, cloud-machine and attached-machine backends have different boundaries. gVisor applies only to deployments using that runtime. An attached Linux machine is not automatically equivalent to a sandboxed container.",
          "Where a workspace allows sudo or root access, the agent can affect more of the machine and its daemon protections. Network controls also depend on the actual deployment; this guide makes no blanket managed-egress promise.",
        ],
      },
      {
        id: "teams",
        title: "What can a team administrator access?",
        paragraphs: [
          "Teams can share rules, skills, tools and managed credentials and review usage. Workspaces remain individually owned: team administration does not grant access to another member’s workspace contents or controls to start and stop it.",
          "Shared tools can execute code and need member approval. Shared instructions are useful configuration, not a promise of an enforced security policy.",
        ],
      },
      {
        id: "preview-boundary",
        title: "How are previews separated from the console?",
        paragraphs: [
          "Configured browser previews use a different origin from the console, with separate authentication cookies. Access currently belongs to the workspace owner.",
          "The application being previewed is still code running in the workspace. Preview separation does not make arbitrary application content trustworthy or turn the preview into a public sharing link.",
        ],
      },
      {
        id: "availability",
        title: "What assurances are offered here?",
        paragraphs: [
          "This page describes product behavior, not a certification, uptime agreement or compliance attestation. Contact us to discuss your requirements, available environments and operational arrangements before requesting access.",
        ],
        link: ["mailto:hello@benchyard.com", "Discuss your requirements"],
      },
    ],
  },
];
