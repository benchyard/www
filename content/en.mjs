// The page's words in English. A language is one file like this: copy it to
// content/<code>.mjs, translate the values, and add the code to `languages`
// in build.mjs. Keys and structure stay the same.
//
// Everything here is meant to be true of Benchyard as it is offered: a hosted
// service whose console people sign in to. Where a thing is planned and not
// built, the text says "planned".
//
// Addresses are not words: the console's and the contact address are in
// src/page.mjs. Here a link may name them as "@access" (the mail that asks
// for access), "@console" and "@contact", and a sentence may say {contact}
// where the contact address belongs.

export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard: coding agents that keep working when you close the laptop",
    description:
      "Benchyard runs Claude Code, Codex, Cursor and Gemini CLI in persistent workspaces in its cloud. Start a job at your desk; watch it, approve what it asks and steer it from a browser or your phone.",
  },
  // The mail "Request access" starts: its subject, and the lines it begins with.
  access: {
    label: "Request access",
    subject: "Access to Benchyard",
    body: ["Who are you (your name, and your company or team if there is one)?", "What would you use Benchyard for?"],
  },
  signIn: "Sign in",
  skip: "Skip to the content",
  nav: {
    label: "Sections",
    items: [
      ["#how", "How it works"],
      ["#workspace", "The workspace"],
      ["#security", "Security"],
      ["#where", "Where it runs"],
      ["#teams", "Teams"],
      ["#pricing", "Pricing"],
      ["#faq", "Questions"],
    ],
  },
  hero: {
    title: "Coding agents that keep working when you close the laptop",
    lead: "Benchyard runs Claude Code, Codex, Cursor and Gemini CLI in persistent workspaces in its cloud. Start a job at your desk; watch it, approve what it asks and steer it from a browser or your phone.",
    note: "The console doesn't take sign-ups yet: accounts are made by invitation. You bring your own agent subscriptions or API keys.",
    desktopAlt:
      "The Benchyard app in a browser: a list of workspaces and sessions on the left, and a session in which Claude Code asks for approval before it runs a test command, with Deny and Approve buttons.",
    phoneAlt:
      "The same session on a phone: the request to run the command, with Deny and Approve buttons, and a note that the laptop is driving the session.",
    caption: "A session waiting for approval, on a computer and on a phone. Screenshots are of the app with made-up data.",
  },
  how: {
    title: "How it works",
    lead: "The agent runs in a workspace, not on your computer. Your devices are windows onto it.",
    steps: [
      {
        title: "Start a session",
        body: "Pick a workspace and an agent, say what you want, and choose how much it may do by itself: ask first, accept edits, or full auto. Every agent has a plan mode: it proposes a plan and waits for your yes before it changes anything.",
      },
      {
        title: "Close the lid",
        body: "The agent, its terminals and whatever it started keep running in the workspace. Nothing depends on a browser tab staying open or a laptop staying awake.",
      },
      {
        title: "Answer from wherever you are",
        body: "When the agent needs an approval, fails or finishes, you get an alert, and a push notification on devices where you turned them on. Approve or deny, take the session over, steer it mid-turn or queue the next message, from a phone as well as a desk.",
      },
    ],
    shotAlt:
      "The session after approval: the command's line is marked approved, and the agent explains what it found and asks whether to make the change.",
  },
  agents: {
    title: "Four agents, your own accounts",
    lead: "Benchyard drives each agent's own command-line program. It doesn't resell model access: you sign in with the subscription or API key you already have, once, and every workspace of yours has it.",
    items: [
      { name: "Claude Code", body: "Subscription sign-in or an API key." },
      { name: "Codex", body: "ChatGPT sign-in or an API key." },
      { name: "Cursor", body: "Cursor sign-in or an API key. A sign-in lasts about 60 days, then you sign in again." },
      { name: "Gemini CLI", body: "An API key. Google doesn't allow personal accounts to sign in to Gemini CLI this way." },
    ],
    foot: "A team's admin can set one key per agent for the whole team instead.",
  },
  workspace: {
    title: "A workspace is a whole machine to work in",
    lead: "Each workspace has its own disk, home folder and project, and keeps them when it stops.",
    items: [
      ["Terminal", "A real terminal in the app, kept by tmux: it survives a reload and a dropped connection."],
      ["Files and changes", "Browse and edit files, and review what an agent changed as a diff against the last commit, beside the chat."],
      ["SSH, scp and rsync", "The `benchyard` command sets up `ssh <workspace>.benchyard` from your own computer, and forwards ports."],
      ["Ports", "See which ports your programs listen on, and forward them to your own computer over SSH."],
      ["Containers", "Rootless podman, with `docker` as an alias, inside the workspace's sandbox."],
      ["A desktop", "For programs with windows, such as a browser an agent is driving, shown in the app. On machine types that have one."],
      ["Snapshots", "Take one, roll back to it, or make a new workspace from it, where the workspace's storage supports snapshots."],
      ["Schedules", "Start a session at set times: a nightly dependency check, a weekly report."],
      ["Rules, skills and tools", "Instructions, skills, MCP servers and plugins set once and given to every agent that can use them."],
      ["Search", "Find a session by its title or by what you and the agent wrote, across all your workspaces."],
    ],
    shotAlt: "The Workspaces page: two running workspaces, each with its agents, its SSH name, and Stop and Delete buttons.",
  },
  security: {
    title: "Credentials are kept out of the agent's reach",
    lead: "An agent that can use a credential can usually also read it and send it somewhere. Benchyard is built so that most of yours never enter the workspace at all. They are held by Benchyard's server instead, and Benchyard can read what its server holds.",
    points: [
      {
        title: "Kept credentials",
        body: "A secret that names the hosts it is for is a placeholder inside the workspace. The real value is put into requests to those hosts on the way out, by a credential keeper that runs outside the workspace. A program there can use the credential against its hosts and can't take it anywhere else.",
      },
      {
        title: "Agent sign-ins",
        body: "Your subscription sign-ins and API keys are held by Benchyard's server. The agent's files in the workspace hold stand-ins, and renewals go through the keeper, so a refresh token is never in a workspace.",
      },
      {
        title: "An SSH key the agent can't read",
        body: "Each person has a key their workspaces connect with. Benchyard's server holds its private half and signs SSH sign-ins for it; programs in a workspace can use it while the workspace runs and can't copy it.",
      },
      {
        title: "Sandboxed workspaces",
        body: "A container workspace is a gVisor pod in a namespace of its own. Agents run as an ordinary user, can't stop or read Benchyard's own daemon, and can't reach the cluster, private networks or cloud metadata addresses.",
      },
    ],
    plain: {
      title: "What this does not do",
      items: [
        "It does not keep your credentials from Benchyard. Your provider sign-ins, API keys and secrets are held by Benchyard's server, and Benchyard, which operates it, can read them.",
        "It does not keep your sessions from Benchyard. The server keeps what you and the agents wrote and what the agents did, so that every device can show it, and the server can read it. End-to-end encryption of session content is planned, not built.",
        "Your code and files are on the workspace's disk, on machines Benchyard runs, unless the workspace is a machine of your own that you attached.",
        "A secret that names no hosts is an ordinary variable in the workspace, and a private key you put in `~/.ssh` yourself is a file there. An agent can read both.",
        "A workspace can reach any public address on the internet, so what an agent can read it could send. Limiting where a workspace may connect is planned.",
      ],
    },
  },
  where: {
    title: "Where workspaces run",
    lead: "Workspaces run in Benchyard's cloud. Each is made on a machine type (cores, memory, disk); which types you can use depends on your account and your team.",
    items: [
      {
        title: "Containers",
        body: "A sandboxed container per workspace, under gVisor, with its own volume. The default, and the quickest to start.",
      },
      {
        title: "Cloud machines",
        body: "A virtual machine per workspace at Google Cloud or AWS, made and stopped by Benchyard, with an idle stop so it doesn't run when nobody uses it.",
      },
      {
        title: "Your own machine",
        body: "Attach a Linux machine you already have (a workstation, a server with a graphics card) with one command, where this is turned on for your account. Agents work there as an account made for them, and Benchyard starts, stops and snapshots nothing on it.",
      },
    ],
    foot: "Workspaces update and stop when idle, and start again when you open them or a schedule runs.",
  },
  teams: {
    title: "For a team",
    items: [
      ["Teams", "Anyone can make a team and invite people. A team shares rules, tools and, if its admin sets them, agent keys."],
      ["Limits", "Workspaces per person, what a team adds for its members, and which machine types each may use."],
      ["Usage", "Tokens per agent, model, workspace and session, running time per workspace, and for a team, per member."],
      ["Two-factor authentication", "An authenticator app, passkeys, or approval from a device where you're already signed in. A passkey can also sign you in without a password."],
      ["Audit log", "Sign-ins, account and team changes, and credentials set and removed (by name, never the value) are recorded. The log is read by Benchyard's admins; teams don't have a view of it."],
      ["Accounts", "By invitation. Benchyard sends mail for invites, password resets and notifications."],
      ["Five languages", "English, Spanish, French, and Simplified and Traditional Chinese."],
      ["On a phone", "The app installs to the home screen and sends push notifications. On an iPhone, push needs the app added to the Home Screen first."],
    ],
    shotAlt: "Settings, Sign-in and security: passkeys, two-factor authentication with its methods, and the devices where the person is signed in.",
  },
  ownCluster: {
    title: "On your own cluster",
    body: "Benchyard can also run on your own Kubernetes cluster. If that is what you need, write to {contact}.",
  },
  pricing: {
    title: "Pricing",
    body: "Access is by request today, and plans will be published here later. You bring your own agent subscriptions or API keys and pay those providers as you do now: Benchyard doesn't resell model usage.",
  },
  faq: {
    title: "Questions",
    items: [
      [
        "Which agents?",
        "Claude Code, Codex, Cursor and Gemini CLI. Each has a driver for its own protocol, and a feature an agent lacks (steering mid-turn, say) is simply not offered for it.",
      ],
      [
        "Do I need my own agent subscription?",
        "Yes: a subscription or an API key for each agent you use. Benchyard doesn't resell model usage, and the provider bills you as it does today. In a team, an admin can set one key per agent for everyone.",
      ],
      [
        "How do I get an account?",
        "Write to {contact} and say who you are and what you'd use it for. The console doesn't take sign-ups yet; accounts are made by invitation.",
      ],
      [
        "What happens to a running agent when my laptop sleeps?",
        "Nothing. The agent runs in the workspace. When you come back, on any device, the session shows everything that happened, and anything it was waiting to ask is still waiting.",
      ],
      [
        "Who can read my code and credentials?",
        "Benchyard can. Your provider sign-ins, API keys and secrets are held by Benchyard's server, and Benchyard, which operates it, can read them. The server keeps the content of your sessions and can read it. Your code is on the workspace's disk, on machines Benchyard runs. Credentials are sealed so that they are kept from other people; they are not kept from Benchyard.",
      ],
      [
        "Can an agent read my API keys and tokens?",
        "Not the ones the keepers hold: agent sign-ins, API keys for the providers Benchyard knows, and secrets you limit to named hosts. It can read a secret with no hosts and files you put in the home folder yourself.",
      ],
      [
        "Can I run it on my own cluster?",
        "On request. Write to {contact} and say what you have in mind.",
      ],
      [
        "What isn't built yet?",
        "Among other things: sign-up without asking, published plans, sign-in through an identity provider (OIDC), limits on where a workspace may connect, and session content the server can't read.",
      ],
    ],
  },
  footer: {
    tagline: "Persistent workspaces for coding agents.",
    groups: [
      {
        title: "Product",
        links: [
          ["#how", "How it works"],
          ["#security", "Security"],
          ["#where", "Where it runs"],
          ["#pricing", "Pricing"],
        ],
      },
      {
        title: "Account",
        links: [
          ["@access", "Request access"],
          ["@console", "Sign in"],
        ],
      },
      {
        title: "Contact",
        links: [
          ["@contact", "@contact"],
          ["#own-cluster", "On your own cluster"],
        ],
      },
    ],
    legal: "Claude Code, Codex, Cursor and Gemini are names of their owners' products. Benchyard is not affiliated with them.",
  },
};
