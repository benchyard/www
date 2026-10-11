export const reviewed = "2026-10-11";
export const transcript = [
  [
    "1",
    "A task is sent.",
    "In the issue-board workspace, Alice asks Codex to add a status filter to a fictional issue board and test it. The session is in Ask first mode.",
  ],
  [
    "2",
    "The agent edits three files.",
    "Codex changes three files. Each edit appears in the conversation and under Changes, where you can see exactly what changed.",
  ],
  [
    "3",
    "It asks before running the tests.",
    "The session shows Approval needed for the command npm test and waits. The same request appears on a signed-in phone, which can watch and approve while the MacBook drives.",
  ],
  [
    "4",
    "You decide.",
    "Approve, and the command runs: four filter tests pass. Deny, and it is not run; the replay lets you ask for the request again.",
  ],
  [
    "5",
    "You look through the result.",
    "Changes shows what changed in each of the three files, Files the project's files, and Terminal the recorded output of the command. Ports lists the app running in the workspace.",
  ],
  [
    "6",
    "You open the running app.",
    "Open in browser shows the issue board. In progress and Done each show three issues, All issues shows six.",
  ],
];
export const guides = [
  {
    slug: "agents",
    title: "Coding agents in Benchyard",
    description:
      "Compare supported sign-ins, approvals and steering for Claude Code, Codex, Cursor and Gemini CLI in Benchyard.",
    lead: "Benchyard gives your coding agent a workspace that keeps running. The agents share one interface, but each signs in its own way and can do different things.",
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
              "ChatGPT sign-in with a one-time code, or API key",
              "Signing in with a code must be allowed for your ChatGPT account. If it is not, use an API key.",
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
          "An agent is the program that reads files, runs tools and carries out a coding task. A model is the AI behind it, and a provider is the company that runs the model. Supporting an agent does not mean every model it can use has been tested.",
          "A team can send its agents' requests through a gateway of its own (a service the team runs between its agents and the provider) for Claude Code, Codex and Gemini CLI, but not for Cursor. Whether a particular gateway and model work together is for the team to check; Benchyard does not guarantee it.",
          "More agents and models are planned, including Kimi Code, GLM Code and MiniMax. They are not available today.",
        ],
      },
      {
        id: "approvals",
        title: "Do all agents use the same approval controls?",
        paragraphs: [
          "No. Benchyard shows the approvals each agent asks for, and agents differ in what they ask. Cursor does not ask before each edit in the way Claude Code and Codex do in Ask first mode.",
          "A session's mode is Ask first, Accept edits, Full auto or Plan, where the agent has it. While an approval waits, the action that needs it does not happen. A notification opens the session, and you decide there, signed in.",
        ],
      },
      {
        id: "steering",
        title: "Can I change direction while an agent is working?",
        paragraphs: [
          "Codex can take a new instruction while it is working. With the other agents you stop what it is doing and send a new message.",
          "One device sends the messages in a session at a time; your other signed-in devices can watch and approve. Separate sessions, each with its own copy of the code if you like, keep tasks apart. Agents in different sessions do not coordinate with each other by themselves.",
        ],
      },
      {
        id: "credentials",
        title: "Where do the credentials come from?",
        paragraphs: [
          "Use your own subscription or API key for the agent, or a sign-in your team provides. Benchyard does not include an agent subscription.",
          "Agent sign-ins for Claude Code, Codex and Cursor, API keys for the services Benchyard knows, and secrets you tie to a service's address are held by credential keepers outside the workspace, so the agent uses them without seeing them. They are stored encrypted. Benchyard is not end-to-end encrypted; the security guide says what that means before you choose how to provide secrets.",
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
    lead: "A workspace is where your agents work: it holds your project's files, your sessions and the tools they use. You reach it from the browser on your computer or phone.",
    sections: [
      {
        id: "lifecycle",
        title: "What persists when I leave?",
        paragraphs: [
          "Closing a browser tab or your laptop does not stop a running workspace. An agent keeps working until it finishes, needs you, fails, or the workspace stops.",
          "Stopping a workspace ends its terminals and running programs. Its files, conversations and sign-ins are kept. A machine can also be suspended: what was running is kept and carries on when it starts again. A container is stopped, not suspended. The workspace's card says which happened and why.",
          "Opening a session of a stopped or suspended workspace does not start it. Sending a message does: the message is held and sent once the workspace is up, and you can take it back before then. Opening the terminal, the files, the desktop or a preview also starts it.",
          "A workspace is stopped when idle only if you ask for it. The setting is Never unless you choose 30 minutes, 1 hour, 4 hours or 1 day; a size of workspace can have a time of its own, and Keep running exempts one workspace. Idle means no agent is at work or waiting for you, nothing is running in its terminals or in the background, and you have not had it open for a while.",
        ],
      },
      {
        id: "environments",
        title: "Where does the workspace run?",
        paragraphs: [
          "A machine type is the size of a workspace: how many processors and how much memory it has. Shared types share processing power with other workspaces, so their size reads “up to”; Dedicated types have their processors and memory reserved. A machine type also says whether it has a desktop. Which types you can choose depends on your installation and account.",
        ],
        table: {
          head: ["Kind", "What it is"],
          rows: [
            [
              "Container",
              "A light, isolated environment for each workspace. When stopped, what was running ends and its files are kept.",
            ],
            [
              "Machine",
              "A virtual computer for each workspace, with its own disk. It can be suspended when idle, so that what was running carries on when it starts again.",
            ],
          ],
        },
      },
      {
        id: "tools",
        title: "What can I do inside a workspace?",
        paragraphs: [
          "The terminal in the browser keeps going when you close the tab, and you can open the same terminal from several tabs or devices. The file browser shows the project's folder, edits text files, and uploads or downloads one file at a time.",
          "To use your own terminal or editor, connect over SSH: install the benchyard command on your computer, sign in with it, add your public key in the app, and connect to the workspace by its name. The usual tools for copying files work too. The connection is encrypted and passes through Benchyard's server. Like the rest of Benchyard, it is not end-to-end encrypted.",
          "Where a workspace includes a desktop, it opens in the browser. It has no sound, and programs that need a graphics card run slowly. Only the workspace's owner can use any of these.",
        ],
      },
      {
        id: "snapshots",
        title: "How do snapshots and rollback work?",
        paragraphs: [
          "A snapshot is a saved copy of the workspace's files at one moment. It does not hold what was running. You can take up to ten yourself, and choose a daily one that is taken while the workspace is idle or stopped. Only the workspace's owner can use them.",
          "Going back to a snapshot (a rollback) asks you to confirm, saves the present state as a snapshot first, and then puts the files back as they were. Sessions and messages from after the snapshot leave the history. Rolling back to the saved state undoes it. You can also make a new workspace from a snapshot.",
          "Where a snapshot is kept depends on the installation's storage, and the app says which. On a cloud provider's storage it is kept separately from the workspace's disk, so it survives if the disk is lost. An installation whose storage keeps snapshots alongside the disk says so: there a snapshot undoes mistakes but is lost if that storage is. Whether snapshots are offered depends on the installation.",
        ],
      },
      {
        id: "devices",
        title: "How do I continue on my phone?",
        paragraphs: [
          "Sign in on the other device and open the same workspace and session. One device sends the messages at a time; your other signed-in devices can watch and approve.",
          "On an iPhone, add Benchyard to the Home Screen before turning on notifications. You turn them on for each device, and the device asks your permission. A notification opens the session, where you look at the request and approve it.",
        ],
      },
      {
        id: "previews",
        title: "How do browser previews work?",
        paragraphs: [
          "Where previews are available, the Ports list offers Open in browser for an app running inside a workspace. The preview opens at an address of its own, separate from the Benchyard app.",
          "A preview opens only for the workspace's owner, signed in. It is not a public link or a way to share the app with other team members. Opening a preview starts a stopped workspace, but the app itself has to be started again before there is anything to see.",
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
              "An approval is needed, a plan is ready, a task finished or failed, a note from the agent, a workspace is ready.",
              "Turn it on for each device. On an iPhone, add the app to the Home Screen first.",
            ],
            [
              "Email",
              "An approval is needed, a plan is ready to review, a task failed, an agent needs you to sign in again. Not for finished tasks or agent notes.",
              "Turn it on and confirm your email address. The installation must have mail set up.",
            ],
          ],
        },
        paragraphs: [
          "No email is sent while you have the session open, and at most one per session in ten minutes. Delivery of email and notifications is not guaranteed.",
        ],
      },
      {
        id: "demo-transcript",
        title: "The demo, step by step",
        paragraphs: [
          "The demo on the homepage is a replay drawn for the website, not the live app. The changes, files, test results and issue board in it come from a real run in Benchyard with demo data; two lines of unrelated notices are left out of the test output. The agent's replies are scripted.",
        ],
        transcript: true,
      },
    ],
  },
  {
    slug: "security",
    title: "Security and data boundaries",
    description:
      "How your sign-ins and keys are kept away from agents, how what you store is protected, and how workspaces and teams are kept apart.",
    lead: "Benchyard runs code for you and holds your sessions. This page says plainly what is protected and what is not, so you can decide what to trust it with.",
    sections: [
      {
        id: "keepers",
        title: "What do credential keepers protect?",
        paragraphs: [
          "An agent needs your sign-ins and keys to do its work, but it does not need to see them. For a protected credential the workspace gets a stand-in. A credential keeper outside the workspace holds the real value and adds it only to requests for the service that credential belongs to. The agent can use the credential at that service while the workspace runs, without ever having its value.",
          "Protected this way: your subscription sign-in for Claude Code, Codex or Cursor; your own API key for a service Benchyard knows; a secret you tie to a service's address; a team's key, unless the team sends it through a gateway of its own; and the access token you use for GitHub or GitLab.",
          "Not protected: a secret that is not tied to a service's address; a team's key that goes through the team's own gateway; access keys for cloud accounts, private keys and database passwords; and anything saved in a file in the workspace. An agent can read all of these.",
          "Two more limits. Some programs do not send their requests by way of the keeper, and a protected credential does not work in them. And a service that repeats back what it is sent would show the value to whoever asked.",
        ],
      },
      {
        id: "server-access",
        title: "How is what I store protected?",
        paragraphs: [
          "Your agent sign-ins, API keys and secrets are stored encrypted, with a separate key for each person and each team. Passwords are stored in a form that cannot be read back.",
          "Benchyard is not end-to-end encrypted. The service has to use your credentials on your behalf and show you your sessions, so the party that runs it can access them. On the hosted service that is Benchyard; on an installation your company runs, it is your company.",
        ],
      },
      {
        id: "isolation",
        title: "Is every workspace isolated the same way?",
        paragraphs: [
          "No. A container workspace runs in a sandbox of its own, with its own network rules. A machine workspace is a virtual computer of its own that accepts no incoming connections.",
          "Where a workspace gives you administrator rights, an agent working for you has them too, and can change more of the workspace, including the parts of Benchyard that run inside it. Being a team's administrator gives no access to another member's workspace.",
        ],
      },
      {
        id: "network",
        title: "What can a workspace reach on the network?",
        paragraphs: [
          "The public internet. It cannot reach addresses inside private networks, and it cannot send email directly. There is no list of allowed destinations, so anything an agent can read could be sent out.",
          "Each workspace has a traffic allowance: a limit on how much it can send, which fills up again over time. Whether running out restricts the workspace is up to the installation's administrators, and it does not unless they turn that on. A restriction stops new connections; ones that are already open carry on.",
        ],
      },
      {
        id: "teams",
        title: "What can a team administrator access?",
        paragraphs: [
          "A team can share rules, skills, tools and agent sign-ins, and see its usage. Each workspace still belongs to the person who made it: a team's administrator cannot open another member's workspace, or start and stop it.",
          "A shared tool that runs code reaches a member's workspaces only after that member allows it. Shared rules guide agents; they are not an enforced security policy.",
        ],
      },
      {
        id: "preview-boundary",
        title: "How are previews separated from the console?",
        paragraphs: [
          "A preview opens at an address separate from the Benchyard app, with a sign-in of its own, and only for the workspace's owner.",
          "What you see in a preview is still a program running in the workspace. Keeping it at a separate address does not make it trustworthy, and does not make it a link you can share.",
        ],
      },
      {
        id: "sign-in",
        title: "How do people sign in, and what is recorded?",
        paragraphs: [
          "You sign in with a username and password or with a passkey. For two-factor authentication you can use a passkey, an authenticator app, approval from a device where you are already signed in, or a recovery code; an installation can require it. Signing in through a company's single sign-on is not available. The devices you are signed in on are listed, and you can sign any of them out.",
          "An installation's administrators have a record of what was done to accounts, sign-ins, teams and settings, and by whom. It does not cover what happens inside workspaces and sessions, and it never holds secret values. They also have a list of problems the installation ran into. Neither has a set period after which entries are removed.",
        ],
      },
      {
        id: "availability",
        title: "What assurances are offered here?",
        paragraphs: [
          "This page describes how the product behaves. It is not a certification, an uptime agreement or a statement of compliance. Contact us to discuss your requirements before requesting access.",
        ],
        link: ["mailto:hello@benchyard.com", "Discuss your requirements"],
      },
    ],
  },
];
