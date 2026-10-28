export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard | Secure cloud workspaces for agents and teams",
    description:
      "Run agents in persistent cloud workspaces. Share team tools, protect supported credentials and get notified when your attention is needed—from any device.",
  },
  hero: {
    title: "Secure cloud workspaces for agents and teams.",
    tagline: "",
    lead: "Run your agents in persistent workspaces. Get notified when they need you or finish a task, then review and act from any device.",
  },
  nav: [
    ["workspace", "Workspace"],
    ["agents", "Agents"],
    ["security", "Security"],
    ["teams", "For Teams"],
    ["business", "For Business"],
    ["pricing", "Pricing"],
  ],
  cloudFooterLabel: "Cloud Computers for Agents",
  access: {
    label: "Sign up",
    accountLabel: "Sign in / Sign up",
    path: "/register",
  },
  pricing: {
    title: "For your own work, your team, or your business.",
    lead: "Start personally, share a setup with your team, or talk to us about a tailored deployment.",
    cards: [
      {
        name: "Personal",
        price: "Pay as you go",
        period: "Or choose a personal plan",
        body: "A persistent place for your projects and agents.",
        features: [
          "Choose your agent, model and workspace type",
          "Bring your agent subscription or API key",
          "Buy credits or choose a plan in Billing",
        ],
        cta: "Get started",
        path: "/register",
      },
      {
        name: "Team",
        price: "Per-seat plans",
        period: "Shared billing for your team",
        body: "Share tools and billing while keeping each member's workspace private.",
        features: [
          "Shared rules, skills and managed agent sign-ins",
          "Team credits and usage visibility",
          "Choose seat types and review the team's total",
        ],
        cta: "View team plans",
        path: "/billing",
      },
      {
        name: "Business",
        price: "Custom pricing",
        period: "Tailored to your requirements",
        body: "Agree the deployment, capacity and setup your business needs.",
        features: [
          "Hosted service or your own infrastructure",
          "Tailored agents, workspace sizes and limits",
          "A proposal for your scope and requirements",
        ],
        cta: "Discuss your requirements",
        path: "#business-contact",
      },
    ],
    billingTitle: "What uses credits?",
    meters: [
      ["Running", "Compute and disk at the workspace type's rates."],
      [
        "Stopped or suspended",
        "Disk still counts; suspended memory can also count.",
      ],
      [
        "Storage & traffic",
        "Snapshots and outbound traffic beyond the allowance can add usage.",
      ],
    ],
    note: "Current credit prices, currencies, plans and machine rates are shown in the console. Review them before buying or starting a workspace.",
    providerNote:
      "Your agent subscription or API usage is billed separately by its provider.",
  },
  promotions: {
    nav: "Offers & credits",
    teaser: "Explore offers",
    bannerLabel: "NEW MEMBER OFFER",
    bannerAmount: "3",
    bannerUnit: "trial credits",
    bannerTitle: "A head start for your first workspace.",
    bannerTerms: "Confirm your email to claim · Valid for 7 days",
    eyebrow: "A LITTLE HELP GETTING STARTED",
    title: "Your first workspace starts with 3 credits on us.",
    lead: "Sign up, confirm your email and use your trial credits toward workspace usage. Bring the agent subscription or API key you already use.",
    offers: [
      [
        "3 trial credits",
        "For eligible new accounts after email confirmation. Use them within 7 days of receiving them. The trial is available once per account and email address.",
      ],
      [
        "2 extra credits with a friend's link",
        "Have a friend on Benchyard? Open their referral link before signing up. Eligible new accounts receive 2 more credits alongside the trial; these extra credits last 30 days.",
      ],
    ],
    more: "Explore more ways to earn and save",
    availability:
      "Check Billing for the rewards available to your account, their amounts and expiry dates. When offered, you can:",
    rewards: [
      [
        "Earn as you get started",
        "Create your first workspace and start your first session in it to earn first-step rewards. Complete eligible steps after confirming your email and within 30 days of creating your account.",
      ],
      [
        "Invite friends",
        "Share your link from Billing, Invite friends. A first sign-up can earn a first-step reward; a friend's qualifying first paid purchase can earn you referral credits. Monthly limits apply.",
      ],
      [
        "Get a first-purchase bonus",
        "An eligible first purchase of credits or a plan can come with bonus credits. Check the offer before paying; the bonus is based on the part you pay for after any discount.",
      ],
      [
        "Use a credit or discount code",
        "Redeem a credit code in Billing, or apply a discount code when reviewing an order. Each code has its own eligibility, expiry and usage limits.",
      ],
    ],
    billing: "See your offers in Billing",
    terms:
      "Promotional credits are used before purchased credits, expire on their stated dates and cannot pay for plans or seats. They have no cash value. Refunded purchases can reverse related bonuses and referral rewards.",
    signupNote:
      "Confirm your email within 7 days of creating your account to receive the trial. Your Billing page shows the rewards you qualify for and when they expire.",
    providerNote:
      "Agent subscriptions and API usage are billed separately by their providers.",
    existing: "Already have an account?",
    signin: "Sign in",
    businessNote: "For an installation on infrastructure you operate,",
    businessLink: "contact us",
  },
  proof: [
    ["Persistent work", "Keep projects, sessions and tools together."],
    ["Team collaboration", "Share instructions, tools and managed sign-ins."],
    [
      "Credential protection",
      "Keep supported credentials outside the workspace.",
    ],
  ],
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
    continuity: {
      title: "Bring your local sessions. Continue in Benchyard.",
      lead: "Import Claude Code or Codex sessions from your computer, including their conversation records. Pick up the work in a persistent workspace.",
      local: "Your computer",
      localDetail: "Claude Code / Codex",
      transfer: "Bring them over",
      record: "Conversation + agent record",
      cloud: "Benchyard workspace",
      cloudDetail: "Resume the imported session",
      elsewhere: "Continue elsewhere",
      choices: [
        [
          "Move to another workspace",
          "Same agent and session, with its saved context and timeline.",
        ],
        [
          "Continue with another agent",
          "A new session receives the conversation record. Long records are shortened.",
        ],
      ],
      boundary:
        "Imports and workspace moves carry session records. Prepare project files separately.",
      flexibility:
        "Choose an agent and model per session. Work in parallel, use separate Git worktrees, or fork a conversation.",
      persistence:
        "Close the browser and return to your files and sessions later.",
      link: "How import and Continue elsewhere work",
    },
    operations: {
      title: "Keep recurring work moving.",
      lead: "Schedule agent tasks, review what ran, and step in when a decision is needed.",
      stages: [
        ["Schedule", "Choose the prompt, agent, model and timing."],
        ["Guide", "Queue a follow-up, steer the task or review an approval."],
        [
          "Recover",
          "Restore a supported snapshot; the current state is saved first.",
        ],
      ],
      note: "Steering varies by agent. Snapshots depend on the workspace.",
      link: "Schedules, controls and recovery",
    },
    configurations: {
      title: "Choose your workspace.",
      lead: "Containers or virtual machines, with different sizes and features to suit your project.",
      types: [
        [
          "Container",
          "An isolated environment with persistent project files.",
          "Rootless Podman + compose",
        ],
        [
          "Virtual machine",
          "A computer with its own disk and persistent system installs.",
          "Docker on types with sudo",
        ],
      ],
      options: [
        ["CPU & memory", "Shared or Dedicated"],
        ["Disk", "Grow where supported"],
        ["Desktop", "Graphical apps in the browser"],
        ["sudo", "Administrator rights where included"],
      ],
      note: "Compare available types and rates when you create a workspace. Shared capacity is available up to its limit; Dedicated capacity is reserved.",
      link: "Compare workspace configurations",
    },
    workbench: {
      lead: "Review diffs, follow Git history, edit files, run commands and find services beside the agent conversation.",
      layout: "Switch between a panel beside chat and a wider review layout.",
      visualTitle: "The workbench: chat and project tools",
      conversation: "Agent conversation",
      conversationNote: "The task, decisions and results",
      panels: [
        ["Changes", "Review file diffs"],
        ["Git graph", "Follow commits and branches"],
        ["Files", "Browse and edit the project"],
        ["Terminal", "Run commands and check output"],
        ["Ports", "Find services and open previews where available"],
      ],
      caption: "Workbench overview · Illustrated layout",
      remoteTitle: "Keep your local tools connected, too.",
      remote:
        "Connect your editor over SSH, transfer files, or forward a workspace port to localhost. Connections go through Benchyard.",
      link: "Explore the workbench and its tools",
    },
    story: {
      context: "01 / Bring your context",
      connect: "02 / One connected workbench",
      build: "03 / Ongoing work, under your control",
      machines: "04 / Space that fits your work",
      connectTitle: "Your project tools, beside the conversation.",
      connectNote: "Only a workspace's owner can use these tools.",
      machinesTitle: "Choose the workspace type that fits your work.",
      machinesNote:
        "Choose from the workspace types available to your account.",
      project: "Your project",
      sessions: ["Session A", "Session B"],
      copies: "Separate copies of the code",
      saved: "Files and session history stay together",
      browser: "Browser",
      editor: "Editor / SSH",
      workspace: "Your workspace",
      port: "Forward a port → localhost",
      lifecycle: [
        "Build in a container",
        "Try it on a desktop",
        "Save a snapshot",
      ],
      lifecycleNote: "Desktop availability depends on the workspace.",
      container: "Container",
      machine: "Virtual machine",
      containerNote: "Isolated environment",
      machineNote: "A computer with its own disk",
    },
    title: "A persistent place for your agents to work.",
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
        "SSH from your own computer",
        "Run ssh, scp, rsync or sftp, or open the workspace in VS Code or Cursor over Remote SSH. No port is opened: the connection goes through Benchyard.",
      ],
      [
        "Ports on your computer",
        "Ports lists what is listening in the workspace and says when a new port opens. Forward one with a single command, and open it as localhost on your computer.",
      ],
      [
        "A desktop when you need one",
        "On workspaces that include a desktop, open it in the browser to use graphical apps or follow what an agent does in its browser. It has no sound.",
      ],
      [
        "Containers inside",
        "Build and run containers alongside your agents. Container workspaces include rootless Podman with docker commands and compose; machine workspaces can use Docker.",
      ],
      [
        "Snapshots and rollback",
        "Save the state of a workspace's files whenever you like, or once a day automatically. Going back to a snapshot saves the present state first, so you can undo it.",
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
      [
        "Administrator rights",
        "Where a machine type includes sudo, you and your agents can become root and install system packages. On a machine they stay; in a container they last until it restarts.",
      ],
      [
        "Room to grow",
        "Need more space? Grow a workspace's disk yourself, up to what its machine type allows. It takes effect at the next start.",
      ],
      [
        "Tools already there",
        "Git, the GitHub CLI, Node, Python, build tools and the supported agents come installed. Add more without root: mise for runtimes, pixi for system packages, uv for Python.",
      ],
    ],
  },
  agents: {
    title: "Bring your agents into one workspace.",
    lead: "Start with the agent you use today. Explore supported agents and upcoming integrations. Each supported agent keeps its own sign-in requirements and capabilities.",
    future:
      "More agent and model integrations are planned, including GLM Code and MiniMax. Tell us what you would like to use. Availability will be documented as each integration is verified.",
    inProgress: [["deepseek", "DeepSeek Harness"]],
    planned: [
      ["glm", "GLM Code"],
      ["minimax", "MiniMax"],
    ],
    items: [
      ["claude", "Claude Code", "Connect a Claude subscription or an API key."],
      [
        "codex",
        "Codex",
        "Sign in to ChatGPT with a one-time code where your account allows it, or use an API key.",
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
      ["kimi", "Kimi", "Connect with a Kimi For Coding or Moonshot API key."],
    ],
  },
  teams: {
    title: "Shared ways of working. Space for every teammate.",
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
    title: "Benchyard, configured for your business.",
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
    title: "Protect credentials. Keep control.",
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
        "A workspace can reach the public internet, but not addresses inside private networks. Check your workspace's outbound traffic allowance and what happens when it runs out.",
      ],
      [
        "Sign-in and records",
        "Sign in with a password or a passkey, with two-factor authentication. Review your signed-in devices and secure your account from Settings.",
      ],
    ],
  },
  faq: [
    [
      "When will Benchyard notify me?",
      "With device push enabled, supported events include approval requests, plans ready for review, task completion or failure, agent notes and workspace readiness. Turn notifications on for each device. Delivery depends on your settings; email covers fewer events. Open the session to review and act.",
    ],
    [
      "What can my team share?",
      "Teams share instructions, skills, tools and managed agent sign-ins, and see usage. Workspaces remain individually owned. A shared tool that runs code needs each member’s permission.",
    ],
    [
      "Who can access my workspace and stored data?",
      "Team administration does not grant access to another member’s workspace or private previews. The service is not end-to-end encrypted: its operator can access stored data. Credential protection applies to supported credentials, not every secret or file.",
    ],
    [
      "What is Benchyard?",
      "Benchyard provides secure cloud workspaces for supported agents and teams. It keeps the conversation, the files, a terminal, the changes and a preview of the running app together, and you reach it from a computer or a phone.",
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
      "No. An agent is the tool that carries out tasks; a model is the AI behind it. Which models you can use depends on the agent and how it is set up. The agents shown here are the current ones, and more are planned.",
    ],
    [
      "Do I need a separate agent account?",
      "Yes. Bring the subscription or API key your agent accepts, or use a sign-in your team provides. What the agent's provider charges is separate from Benchyard.",
    ],
    [
      "Can I use sudo in a workspace?",
      "Where your machine type includes it, yes: you and your agents get sudo without a password. On a machine, what you install as root stays; in a container only /workspace is kept, so it lasts until the workspace restarts. Without sudo, mise, pixi and uv install into your home. Look for sudo in the workspace type’s features.",
    ],
    [
      "Can I connect from my own terminal or editor?",
      "Yes. Install the benchyard command, sign in with it and add your public key, then ssh to the workspace by its name or open it in VS Code or Cursor over Remote SSH. benchyard forward makes a port of the workspace a localhost port on your computer.",
    ],
    [
      "Can I share a preview with my team?",
      "No. A preview opens only for the workspace's owner, signed in. It is not a public link or a way to share with a team. The Ports panel shows when a browser preview is available.",
    ],
    [
      "What gets sent by email?",
      "If you turn email on, you get one when an agent needs your approval, has a plan for you to review, fails, or needs you to sign in again. Finished tasks and agent notes are not emailed.",
    ],
    [
      "How is workspace use counted?",
      "Workspace usage is counted in credits. Check the type’s rates before starting. Agent subscriptions and API usage are separate and stay with their providers.",
    ],
    [
      "How do I sign up?",
      "Registration is open. Choose Sign up, enter your email and follow the link in your inbox to create your account. Eligible new accounts receive 3 trial credits, valid for 7 days after they are granted. If a friend shared a referral link, open it before signing up to qualify for 2 extra credits, valid for 30 days.",
    ],
    [
      "Can a business run Benchyard itself?",
      "Yes, as an installation you agree, on infrastructure you operate. You can also use the hosted service. Contact us with the business, where it should run, and what should be tailored.",
    ],
  ],
};
