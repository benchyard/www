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
    slug: "getting-started",
    title: "Get started with Benchyard",
    description:
      "A first-task guide for new users: connect an agent, prepare a workspace, review decisions and inspect the result.",
    lead: "Create an account, then start with one small task and an agent you know. Benchyard provides the workspace; your agent carries out the task.",
    sections: [
      {
        id: "access",
        title: "Create your account",
        paragraphs: [
          "Registration is open. Choose Sign up, enter your email and follow the link in your inbox to create your account. If a friend shared a referral link, open it before signing up. Available environments depend on your account.",
          "Eligible new accounts receive 3 trial credits after email confirmation, valid for 7 days from the grant. A friend's referral link adds 2 credits, valid for 30 days. Confirm your email within 7 days of creating the account to qualify; these rewards are once per account and email address. Billing shows your credits, expiry dates and any additional offers. Agent subscriptions and API usage are separate.",
        ],
        link: ["https://console.benchyard.com/register", "Sign up"],
      },
      {
        id: "connect",
        title: "Connect a supported agent",
        paragraphs: [
          "Choose a supported integration and connect the subscription or API key it accepts, or use a sign-in your team provides. Provider charges are separate.",
        ],
        link: ["/guides/agents/", "Compare supported agents"],
      },
      {
        id: "prepare",
        title: "Prepare a workspace and project",
        paragraphs: [
          "Create or select a workspace available to your account. Prepare a project you are comfortable using for a trial. If you use the browser file tools, upload the files your task needs; you can also use the workspace terminal to prepare your project.",
        ],
      },
      {
        id: "task",
        title: "Give the agent a small task",
        paragraphs: [
          "For a project with a test suite, ask the agent to explain one existing test and propose a small improvement. State the intended result and ask it to seek approval before running commands where the integration supports that control. Approval behavior differs between agents.",
        ],
      },
      {
        id: "review",
        title: "Review decisions and results",
        paragraphs: [
          "Read requests in context before approving. Inspect Changes and Files, check command output and use Ports to open a running app where previews are enabled. A preview is accessible only to the workspace owner.",
        ],
      },
      {
        id: "return",
        title: "Step away and return",
        paragraphs: [
          "Closing the browser does not stop a running workspace. Tasks may wait for approval, fail or end when the workspace stops. Enable notifications for the devices you use, then return to the same session to inspect the result.",
        ],
        link: [
          "/guides/workspaces/#device-setup",
          "Set up Mac or iPhone notifications",
        ],
      },
      {
        id: "team",
        title: "Share your team setup",
        paragraphs: [
          "Teams can share instructions, skills, tools and managed sign-ins, and see usage. Workspaces remain individually owned. Team administration does not grant access to another member’s workspace or preview.",
        ],
        link: ["/guides/security/#teams", "Understand team boundaries"],
      },
    ],
  },
  {
    slug: "agents",
    title: "Agents in Benchyard",
    description:
      "Compare supported sign-ins, approvals and steering for Claude Code, Codex, Cursor, Gemini CLI and Kimi in Benchyard.",
    lead: "Benchyard gives your supported agents persistent cloud workspaces. The agents share one interface, but each signs in its own way and can do different things.",
    sections: [
      {
        id: "supported-agents",
        title: "Which agents and sign-ins are supported?",
        table: {
          head: ["Agent", "Supported sign-in"],
          rows: [], // Filled from the shared integration registry by the renderer.
        },
      },
      {
        id: "models-and-providers",
        title: "How do agents, models and providers differ?",
        paragraphs: [
          "An agent is the program that reads files, runs tools and carries out a coding task. A model is the AI behind it, and a provider is the company that runs the model. Supporting an agent does not mean every model it can use has been tested.",
          "A team can send its agents' requests through a gateway of its own (a service the team runs between its agents and the provider) for Claude Code, Codex, Gemini CLI and Kimi, but not for Cursor. Whether a particular gateway and model work together is for the team to check; Benchyard does not guarantee it.",
          "More agents and models are planned, including GLM Code and MiniMax. They are not available today.",
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
          "One device drives a session at a time, and your other signed-in devices can watch and approve. Sending a message from another device takes the session over. Separate sessions, each with its own copy of the code if you like, keep tasks apart. Agents in different sessions do not coordinate with each other by themselves.",
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
      "Understand persistent workspaces, machine types and sudo, SSH, ports, containers, previews and notifications in Benchyard.",
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
        id: "session-continuity",
        title: "How do agents, models and context carry across sessions?",
        paragraphs: [
          "Each session has its own agent and model selection from the options available to your account. Multiple sessions can work in one workspace. Choose a separate Git worktree when they should edit independent copies; merging their branches remains up to you or an agent.",
          "Continue with another agent starts a new session in the same workspace. With your first message, the new agent receives a record of the old session's messages, answers and tool calls. Tool results may be clipped, and long conversations keep the beginning and most recent portion, up to about 60,000 characters. The original session stays as it was. This transfers a conversation record, not the other model's internal state.",
          "Move to another workspace continues the same session with the same agent, its saved record and timeline. Wait for the task to finish or stop it, and start the destination workspace first. Project files and Git worktrees are not copied: prepare the project in the destination, for example on the same branch. Resumption depends on the agent's saved record and support for it.",
          "Fork from here creates a new session from a point in the conversation, keeping the original. It uses the agent's native fork where supported, or supplies the conversation record. Files are not rolled back. You can also bring Claude Code or Codex sessions from your computer through Bring them over or Benchyard's MCP tools where available; those imports carry session records, not project files.",
        ],
        link: ["/#workspace-context", "Explore session workflows"],
      },
      {
        id: "ongoing-work",
        title: "How do I schedule, guide and recover ongoing work?",
        paragraphs: [
          "A schedule combines a workspace, agent, optional model, prompt, permission mode and timing. Choose hourly, daily, weekdays, weekly or a cron expression. Each run creates an ordinary session you can read and continue; it can start in a selected folder or a new Git worktree. A stopped workspace starts for the run, and the option to stop it afterwards waits for the workspace to become quiet.",
          "Queue holds your next message until the current turn ends. Steer sends a correction into the running turn: Claude Code and Codex can accept it without stopping; other supported paths may interrupt and resend. You can inspect running commands and stop them, and review approval requests before allowing an action.",
          "Check results through Ports and available browser previews, or a desktop on types that include one. Container workspaces include rootless Podman with docker commands and compose; machine workspaces with sudo can use Docker.",
          "Where supported, take a snapshot by hand or enable daily snapshots. Restoring replaces the workspace's disk state and returns its session history to that point; later history is removed from view. Benchyard saves the present state first so the rollback can be undone. Creating a new workspace from a snapshot copies the disk files, not the original session history, and stays on the same platform.",
        ],
        link: ["/#workspace-operations", "Explore ongoing work"],
      },
      {
        id: "environments",
        title: "Where does the workspace run?",
        paragraphs: [
          "A machine type is the size of a workspace: how many processors and how much memory it has. Shared types share processing power with other workspaces, so their size reads “up to”; Dedicated types have their processors and memory reserved. A machine type also says whether it has a desktop and whether it includes sudo. Compare the types available to your account in the workspace picker.",
          "Each machine type has a disk size. Where the type allows it, you can grow a workspace's disk yourself from its card, in whole gigabytes up to the type's limit; it grows at the next start, and a disk never shrinks. A change of machine type takes effect when the workspace next starts.",
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
        id: "configurations",
        title: "Which workspace configuration should I choose?",
        paragraphs: [
          "Choose from container and virtual-machine workspace types with different CPU, memory, disk and feature combinations. The machine picker shows the types available to your account and team, including desktop and sudo options and their rates.",
          "For everyday editing and agent tasks, start with a size that fits your project's requirements. More CPU can help builds and tests that run in parallel; more memory leaves room for larger projects and several services running together. Check whether a size is Shared or Dedicated when comparing capacity.",
        ],
        table: {
          head: ["Configuration", "What to check"],
          rows: [
            [
              "CPU and memory",
              "Compare the CPU count and memory shown for each type. Shared capacity is an up-to limit when resources are available; Dedicated capacity is reserved.",
            ],
            [
              "Disk",
              "Check the included space and maximum disk size. Supported disks can grow in whole gigabytes at the next start and cannot shrink.",
            ],
            [
              "Desktop",
              "Choose a type that includes a desktop to use graphical apps in the browser.",
            ],
            [
              "Sudo",
              "Choose a type with sudo for administrator rights. System packages persist on machines; container system changes outside /workspace last until restart.",
            ],
            [
              "Idle behavior",
              "Check when the type stops or suspends idle workspaces. Available behavior depends on its platform and configuration.",
            ],
            [
              "Traffic and rates",
              "Check the traffic allowance and the running, stopped or suspended rates shown for the type. Storage can still cost credits while a workspace is stopped.",
            ],
          ],
        },
        link: ["/#workspace-machines", "See workspace configurations"],
      },
      {
        id: "tools",
        title: "What can I do inside a workspace?",
        paragraphs: [
          "On a wide screen, choose Chat, Dock or Review. Dock puts Changes, Git graph, Files, Terminal and Ports beside the chat; Review puts the tools in the middle, a terminal below and the chat to the side. Resize the panels to suit your work. Your layout choice follows you across devices.",
          "The terminal in the browser keeps going when you close the tab, and you can open the same terminal from several tabs or devices. The file browser shows the project's folder, edits text files, and uploads or downloads one file at a time.",
          "Where a workspace includes a desktop, it opens in the browser, on a computer or a phone. It has a browser for agents to drive and room for any app with windows. It has no sound, and programs that need a graphics card run slowly. Only the workspace's owner can use any of these.",
        ],
      },
      {
        id: "software",
        title: "What is installed, and can I install more?",
        paragraphs: [
          "A workspace comes with the supported agents, Git, the GitHub CLI, Node, Python, build tools, the usual command-line tools and clients for PostgreSQL and Redis. Agent and runtime versions are pinned.",
          "Without administrator rights you can still install most things into your home: mise for language runtimes and command-line tools, pixi for system libraries and programs, uv for Python, and npm or cargo as usual. They are kept with your files.",
          "Where your machine type includes sudo, you and your agents can become root without a password. On a machine, what you install as root stays on its disk. In a container only /workspace is kept, so a package installed as root lasts until the workspace restarts.",
        ],
      },
      {
        id: "ssh",
        title: "How do I connect over SSH?",
        paragraphs: [
          "Install the benchyard command on your computer with the line the app shows, sign in with it, write its SSH settings, and add your public key in the app. Then ssh to the workspace by its name, such as api.benchyard. The app's SSH dialog gives the lines to copy, and the steps for setting up another computer.",
          "A shell, commands, scp, rsync and sftp all work, and so does an editor's remote mode, such as VS Code or Cursor with Remote SSH. A stopped workspace starts when you connect. Forwarding a port of the workspace to your computer works; agent forwarding and forwarding back to your computer do not.",
          "No port is opened anywhere: the connection goes through Benchyard's address, and Benchyard supplies the workspace's host key, so ssh checks it without asking. The connection is encrypted between your computer and the workspace. Like the rest of Benchyard, it is not end-to-end encrypted.",
          "In the other direction, each person has a key their workspaces use to sign in to other hosts, such as git over SSH. Benchyard holds its private half, and programs in the workspace can use it while the workspace runs without being able to copy it. Add its public half where you want it to work.",
        ],
      },
      {
        id: "ports",
        title: "How do ports reach my computer?",
        paragraphs: [
          "Ports lists your programs listening on TCP ports that the workspace can reach over localhost, with their commands, and a session says when a new port opens. Benchyard does not open ports to the internet.",
          "To use one as localhost on your computer, run benchyard forward with the workspace's name and the port, and keep it running for as long as you need it. It goes over the same SSH connection, so set up SSH first.",
          "Where available, Open in browser shows the port at an address of its own instead. See browser previews below.",
        ],
      },
      {
        id: "containers",
        title: "Can I run containers?",
        paragraphs: [
          "Yes. In a container workspace, docker commands use rootless Podman, and podman-compose is included. Images are kept with your files. These containers share the workspace's network: a server in one is on localhost, publishing a port has no effect, and two containers cannot use the same port. Compose services can reach dependencies created before them by name.",
          "On machine types with sudo, machine workspaces use Docker with its own daemon. Their container networking follows that runtime; the shared-network restrictions above apply to rootless Podman in container workspaces.",
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
          "Sign in on the other device and open the same workspace and session. One device drives a session at a time, and the others can watch and approve. To carry on from another device, just send a message there: that device takes the session over, and a line in the session says which device is driving.",
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
              "Turn it on and confirm your email address.",
            ],
          ],
        },
        paragraphs: [
          "No email is sent while you have the session open, and at most one per session in ten minutes. Delivery of email and notifications is not guaranteed.",
        ],
      },
      {
        id: "device-setup",
        title: "How do I add Benchyard to my Dock or Home Screen?",
        paragraphs: [
          "No separate app download is needed. Add the Benchyard console as a web app, then enable notifications on each device. The steps below are illustrative; menu wording varies by operating system version.",
        ],
        setup: true,
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
          "Where a workspace gives you administrator rights (sudo), an agent working for you has them too, and can change more of the workspace, including the parts of Benchyard that run inside it. In a container, root still cannot read Benchyard's own process or its token, administer the network or mounts, or keep system changes outside /workspace past a restart. Being a team's administrator gives no access to another member's workspace.",
          "Only the keys you add in the app can connect to your workspaces over SSH; nothing inside a workspace can add one. Removing a key stops new connections at once.",
        ],
      },
      {
        id: "network",
        title: "What can a workspace reach on the network?",
        paragraphs: [
          "The public internet. It cannot reach addresses inside private networks, and it cannot send email directly. There is no list of allowed destinations, so anything an agent can read could be sent out.",
          "Each workspace has a traffic allowance: a limit on how much it can send, which fills up again over time. The app shows your allowance and any restriction that applies. A restriction stops new connections; ones that are already open carry on.",
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
