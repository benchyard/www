// The page's words in English. A language is one file like this: copy it to
// content/<code>.mjs, translate the values, and add the code to `languages`
// in build.mjs. Keys and structure stay the same.
//
// Everything here is meant to be true of Benchyard as it is built. Where a
// thing is on the roadmap and not built, the text says "planned".

export const repo = "https://github.com/benchyard/benchyard";
const doc = (path) => `${repo}/blob/main/${path}`;

export default {
  lang: "en",
  dir: "ltr",
  meta: {
    title: "Benchyard: coding agents that keep working when you close the laptop",
    description:
      "Benchyard runs Claude Code, Codex, Cursor and Gemini CLI in persistent workspaces on your own infrastructure. Start a job at your desk; watch it, approve what it asks and steer it from a browser or your phone.",
  },
  source: repo,
  skip: "Skip to the content",
  nav: {
    label: "Sections",
    items: [
      ["#how", "How it works"],
      ["#workspace", "The workspace"],
      ["#security", "Security"],
      ["#where", "Where it runs"],
      ["#teams", "Teams"],
      ["#install", "Self-hosting"],
      ["#faq", "Questions"],
    ],
    source: "Source",
  },
  hero: {
    title: "Coding agents that keep working when you close the laptop",
    lead: "Benchyard runs Claude Code, Codex, Cursor and Gemini CLI in persistent workspaces on your own infrastructure. Start a job at your desk; watch it, approve what it asks and steer it from a browser or your phone.",
    primary: ["#install", "Install it"],
    secondary: ["#how", "See how it works"],
    note: "Self-hosted. You bring your own agent subscriptions or API keys.",
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
      ["Ports and previews", "See which ports your programs listen on. Where the installation has a preview domain, open one in the browser at an address of its own."],
      ["Containers", "Rootless podman, with `docker` as an alias, inside the workspace's sandbox."],
      ["A desktop, where turned on", "For programs with windows, such as a browser an agent is driving, shown in the app."],
      ["Snapshots", "Take one, roll back to it, or make a new workspace from it, where the storage supports snapshots."],
      ["Schedules", "Start a session at set times: a nightly dependency check, a weekly report."],
      ["Rules, skills and tools", "Instructions, skills, MCP servers and plugins set once and given to every agent that can use them."],
      ["Search", "Find a session by its title or by what you and the agent wrote, across all your workspaces."],
    ],
    shotAlt: "The Workspaces page: two running workspaces, each with its agents, its SSH name, and Stop and Delete buttons.",
  },
  security: {
    title: "Credentials are kept out of the agent's reach",
    lead: "An agent that can use a credential can usually also read it and send it somewhere. Benchyard is built so that most of yours never enter the workspace at all.",
    points: [
      {
        title: "Kept credentials",
        body: "A secret that names the hosts it is for is a placeholder inside the workspace. The real value is put into requests to those hosts on the way out, by a credential keeper that runs outside the workspace. A program there can use the credential against its hosts and can't take it anywhere else.",
      },
      {
        title: "Agent sign-ins",
        body: "Your subscription sign-ins and API keys are held by the server. The agent's files in the workspace hold stand-ins, and renewals go through the keeper, so a refresh token is never in a workspace.",
      },
      {
        title: "An SSH key the agent can't read",
        body: "Each person has a key their workspaces connect with. The server holds its private half and signs SSH sign-ins for it; programs in a workspace can use it while the workspace runs and can't copy it.",
      },
      {
        title: "Sandboxed workspaces",
        body: "On Kubernetes each workspace is a gVisor pod in a namespace of its own. Agents run as an ordinary user, can't stop or read Benchyard's own daemon, and can't reach the cluster, private networks or cloud metadata addresses.",
      },
    ],
    plain: {
      title: "What this does not do",
      items: [
        "The installation's operator can read what the server holds: credentials, and the history of sessions. Benchyard does not claim otherwise.",
        "A secret that names no hosts is an ordinary variable in the workspace, and a private key you put in `~/.ssh` yourself is a file there. An agent can read both.",
        "A workspace can reach any public address on the internet. Limiting where it may connect is planned.",
        "Keeping session content from the server (end-to-end encryption) is planned, not built.",
      ],
      more: ["How credentials and isolation work, in full", doc("docs/features.md")],
    },
  },
  where: {
    title: "Where workspaces run",
    lead: "One installation can offer several kinds side by side. An admin defines machine types (cores, memory, disk) and who may use them.",
    items: [
      {
        title: "Containers on Kubernetes",
        body: "A sandboxed pod per workspace with its own volume. The default, and the quickest to start.",
      },
      {
        title: "Machines at Google Cloud and AWS",
        body: "A virtual machine per workspace in your own cloud account, made and stopped by Benchyard, with an idle stop so it doesn't run when nobody uses it.",
      },
      {
        title: "Your own machine",
        body: "Attach a Linux machine you already have (a workstation, a server with a graphics card) with one command, where an admin has turned this on. Agents work there as an account made for them.",
      },
    ],
    foot: "Workspaces update and stop when idle, and start again when you open them or a schedule runs.",
  },
  teams: {
    title: "For a team, and for whoever runs it",
    items: [
      ["Teams", "Anyone can make a team and invite people. A team shares rules, tools and, if its admin sets them, agent keys."],
      ["Limits", "Workspaces per person, what a team adds for its members, and which machine types each may use."],
      ["Usage", "Tokens per agent, model, workspace and session, running time per workspace, and for a team, per member."],
      ["Two-factor authentication", "An authenticator app, passkeys, or approval from a device where you're already signed in. A passkey can also sign you in without a password."],
      ["Audit log", "Sign-ins, account and team changes, credentials set and removed (by name, never the value), for installation admins."],
      ["Accounts", "By invitation, or open registration if you turn it on. Mail for invites, password resets and notifications, through your own SMTP server."],
      ["Five languages", "English, Spanish, French, and Simplified and Traditional Chinese."],
      ["On a phone", "The app installs to the home screen and sends push notifications. On an iPhone, push needs the app added to the Home Screen first."],
    ],
    shotAlt: "Settings, Sign-in and security: passkeys, two-factor authentication with its methods, and the devices where the person is signed in.",
  },
  install: {
    title: "Run it yourself",
    lead: "Benchyard is installed on Kubernetes with a Helm chart from the repository. It needs a Postgres database, an S3-compatible bucket, a master key (a Secret or a Vault transit key), gVisor on the nodes, and an HTTPS address that passes WebSockets.",
    code: `git clone ${repo}.git && cd benchyard

# Build and push the server and workspace images to your registry
REGISTRY=registry.example.com/benchyard TAG=v0.1.0 PUSH=1 scripts/build-images.sh

# Install, with your database, bucket and master key in my-values.yaml
helm upgrade --install benchyard deploy/helm/benchyard -n benchyard -f my-values.yaml`,
    codeLabel: "Commands to build the images and install the chart",
    notes: [
      "There are no published images yet: you build them from the repository.",
      "It is installed and in use on a single-node k3s cluster with gVisor. It has not yet been installed on a managed cloud cluster; treat a first install there as a test.",
    ],
    links: [
      ["Before installing, and every setting", doc("deploy/helm/benchyard/README.md")],
      ["How each feature works", doc("docs/features.md")],
      ["Where data lives", doc("docs/storage.md")],
      ["What is planned, and what is left open", doc("docs/roadmap.md")],
    ],
  },
  pricing: {
    title: "Pricing",
    body: "Benchyard is self-hosted today: you run it on your own infrastructure and pay your agent providers directly. Hosted plans are being prepared.",
  },
  faq: {
    title: "Questions",
    items: [
      [
        "Does Benchyard sell access to the models?",
        "No. You sign in to each agent with your own subscription or API key, and the provider bills you as it does today.",
      ],
      [
        "What happens to a running agent when my laptop sleeps?",
        "Nothing. The agent runs in the workspace. When you come back, on any device, the session shows everything that happened, and anything it was waiting to ask is still waiting.",
      ],
      [
        "Can an agent read my API keys and tokens?",
        "Not the ones the keepers hold: agent sign-ins, API keys for the providers Benchyard knows, and secrets you limit to named hosts. It can read a secret with no hosts and files you put in the home folder yourself.",
      ],
      [
        "Where is my code?",
        "On the workspace's disk, in the cluster or cloud account the installation runs in. The server keeps the history of sessions so that every device can show it.",
      ],
      [
        "Which agent is it built around?",
        "None in particular. Each agent has a driver for its own protocol, and a feature an agent lacks (steering mid-turn, say) is simply not offered for it.",
      ],
      [
        "What isn't built yet?",
        "Among other things: sign-in through an identity provider (OIDC), limits on where a workspace may connect, and session content the server can't read. The roadmap says what is next and what is knowingly left open.",
      ],
    ],
  },
  footer: {
    tagline: "Persistent devservers for coding agents.",
    groups: [
      {
        title: "Product",
        links: [
          ["#how", "How it works"],
          ["#security", "Security"],
          ["#where", "Where it runs"],
          ["#install", "Self-hosting"],
        ],
      },
      {
        title: "Documentation",
        links: [
          [doc("docs/features.md"), "Features"],
          [doc("deploy/helm/benchyard/README.md"), "Helm chart"],
          [doc("docs/storage.md"), "Storage"],
          [doc("docs/roadmap.md"), "Roadmap"],
        ],
      },
      {
        title: "Project",
        links: [[repo, "Source on GitHub"]],
      },
    ],
    legal: "Claude Code, Codex, Cursor and Gemini are names of their owners' products. Benchyard is not affiliated with them.",
  },
};
