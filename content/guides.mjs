export const reviewed = "2026-10-11";
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
          "A session's mode is Ask first, Accept edits, Full auto or Plan, where the agent supports it. A waiting approval pauses the action that needs permission. A notification opens the session; the decision is made inside the signed-in application.",
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
          "API keys for the providers Benchyard knows, subscription sign-ins for Claude Code, Codex and Cursor, and secrets that name their hosts are held by credential keepers outside the workspace. Whoever runs the installation can read stored credentials and session content. Read the security guide before choosing how to provide secrets.",
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
          "Stopping a workspace ends its terminals and running programs. Its files, conversations and sign-ins are kept. A machine can also be suspended: what was running is kept in the machine's memory and goes on when it starts again. A container is stopped, not suspended. The workspace's card says which happened and why.",
          "Opening a session of a stopped or suspended workspace does not start it. Sending a message does: the message is held and sent once the workspace is up, and you can take it back before then. Opening the terminal, the files, the desktop or a preview also starts it.",
          "A workspace is stopped when idle only if you ask for it. The setting is Never unless you choose 30 minutes, 1 hour, 4 hours or 1 day; a machine type can carry a time of its own, and Keep running exempts one workspace. Idle means no agent is at work or waiting for you, nothing is running in its terminals or in the background, and you have not had it open for a while.",
        ],
      },
      {
        id: "environments",
        title: "Where does the workspace run?",
        paragraphs: [
          'A machine type is the size of a workspace. Shared types share their host\'s cores with other workspaces and read "up to" their size; Dedicated types have their cores and memory reserved. A machine type also says whether it has a desktop. Which types you can choose depends on your installation and account.',
        ],
        table: {
          head: ["Kind", "What it is"],
          rows: [
            [
              "Container",
              "A container for each workspace. When stopped, what was running ends and its files are kept. Whether you can become root is set by its machine type.",
            ],
            [
              "Machine",
              "A virtual machine for each workspace, with a disk of its own. It can be suspended when idle, keeping what was running in memory. The app does not say which provider a machine is at.",
            ],
          ],
        },
      },
      {
        id: "tools",
        title: "What can I do inside a workspace?",
        paragraphs: [
          "The terminal in the browser is a session that stays when you close the tab, and several tabs or devices can share it. The file editor shows the open folder as a tree, opens text files up to 2 MB, and uploads or downloads one file at a time.",
          "For SSH, install the benchyard command on your computer, sign in with it, add a public key in the app, and connect with ssh to the workspace's name. Shell, scp, rsync, sftp and local forwards work; no port is opened on the workspace. The connection is relayed through the server, which supplies the workspace's host key.",
          "Where a machine type has a desktop, it opens in the browser. It has no sound and is drawn in software. All of these belong to the workspace's owner.",
        ],
      },
      {
        id: "snapshots",
        title: "How do snapshots and rollback work?",
        paragraphs: [
          "A snapshot holds the workspace's disk at one moment, not what was running. You can take up to ten by hand, and choose a daily one that is taken while the workspace is idle or stopped. Only the workspace's owner can use them.",
          "A rollback asks you to confirm, saves the present state as a snapshot first, and then puts the disk back. Sessions and messages from after the snapshot leave the history. Rolling back to the saved state undoes it. A new workspace can also be made from a snapshot.",
          "Where a snapshot is kept depends on the storage, and the app says which. On a cloud provider's disks the storage provider keeps it apart from the disk, so it survives losing the disk. An installation on storage that keeps snapshots beside the disk says so: there a snapshot undoes mistakes and is lost with that storage. Whether snapshots are offered depends on the installation.",
        ],
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
        title: "What can the operator read?",
        paragraphs: [
          "Whoever runs the installation can read provider sign-ins, stored API keys and secrets, and session content. There is no end-to-end encryption that keeps these from the operator.",
          "Stored credentials are encrypted with a key for each person and each team, and those keys are wrapped by a master key the operator holds. That protects a copy of the database; it does not change the trust relationship. Passwords are stored as hashes.",
        ],
      },
      {
        id: "keepers",
        title: "What do credential keepers protect?",
        paragraphs: [
          "For a credential the keepers hold, the workspace receives a placeholder. A keeper outside the workspace holds the real value and puts it only into the declared fields of requests to that credential's hosts. The agent can use the credential at those hosts while the workspace runs, without receiving its value.",
          "The keepers hold: a secret that names its hosts; your own API key for a provider Benchyard knows; a subscription sign-in for Claude Code, Codex or Cursor; a team's key when the team gives no gateway address; and a token for git over HTTPS.",
          "They do not hold: a secret that names no hosts, which is a plain variable in the workspace; a team's key sent to a gateway address of the team's own; cloud access keys, private keys and database passwords; and anything saved in files in the home. An agent can read all of these.",
          "Other limits: a program that ignores proxy settings does not go through a keeper, and a host that repeats what it is sent gives the value back to whoever asked.",
        ],
      },
      {
        id: "isolation",
        title: "Is every workspace isolated the same way?",
        paragraphs: [
          "No. A container workspace is a pod of its own with its own network rules, in a gVisor sandbox unless the operator chose another runtime. A machine workspace is a virtual machine of its own that accepts nothing inbound.",
          "Where a machine type lets people become root, the agent can affect more of the container or machine, including the workspace daemon. Team administration gives no access to another member's workspace.",
        ],
      },
      {
        id: "network",
        title: "What can a workspace reach on the network?",
        paragraphs: [
          "Any public address. Requests to private network ranges and outgoing mail on port 25 are refused. There is no list of allowed hosts, so anything an agent can read could be sent out.",
          "Each workspace has a traffic allowance: a count of what it sends, which refills over time. Whether an empty allowance restricts the workspace is a setting of the installation's admins, and it is off unless they turn it on. When a restriction applies, connections that are already open are not ended.",
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
        id: "sign-in",
        title: "How do people sign in, and what is recorded?",
        paragraphs: [
          "People sign in with a username and password or with a passkey. Two-factor authentication uses a passkey, an authenticator app, approval from a device that is already signed in, or a recovery code; an installation can require it. Single sign-on is not available. Signed-in devices are listed and can be signed out one by one.",
          "Installation admins have an audit log of what was done to accounts, sign-ins, teams and settings, and by whom. It does not record what happens inside workspaces and sessions, and it never holds secret values. An Events page shows them what went wrong inside the installation. No retention period is set for either.",
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
