# Copy evidence and boundaries

Reviewed 2026-10-09 against benchyard main `6ebde5e2d4e081f9b57c87751a7a14c0e5ebb8b8`; www base `b02ac3f6fcb6dc6312104ecf1e81aa3e5e4addcd`. Source paths below belong to the private sibling product checkout. They are internal review references, not public website links. No Airwallex behavior was used.

| Claim / surface | Evidence | Public qualification |
| --- | --- | --- |
| Persistent workspace, browser-independent processes | docs/features.md; internal/workspace/local | Workspace must remain running; approval waits and idle-stop policies still apply. |
| Stop preserves disk/history | docs/features.md; docs/storage.md | Processes and terminals end. No process-memory resume claim. |
| Current agent integrations and login | docs/features.md; docs/agent-protocols.md; internal/driver | Claude subscription/key; Codex device code/key; Cursor account/key; Gemini key only. |
| Agent vs model/provider | docs/features.md, Team-managed sign-ins; internal/benchyardd/auth/managed.go | Team custom endpoints for Claude/Codex/Gemini; no documented Cursor custom address. Real provider end-to-end compatibility remains unverified. |
| Future Kimi, GLM, MiniMax direction | Owner instruction in this implementation conversation, 2026-10-09 | Planned direction only, not current availability or a delivery date. Not attributed to main's roadmap. |
| Approvals/steering vary | docs/features.md; docs/agent-protocols.md | Cursor lacks the same Ask first edit approvals. Codex native steer; others stop and send. |
| Multiple devices | docs/features.md; internal/benchyardd/session/manager.go | One message-driving device; other signed-in devices can approve. |
| Container/cloud/own-machine options | docs/features.md; docs/roadmap.md; docs/machine-types.md | Account/deployment availability; own Linux/systemd, personal space only. |
| Preview isolation and access | docs/features.md, Previews; internal/server/preview.go; e2e/tests/preview.spec.ts | Separate origin; owner only; configured deployments; no public/team sharing. |
| Push categories and iPhone prerequisite | docs/features.md; web/public/sw.js; web/src/components/Push.tsx | Per-device opt-in; Home Screen on iPhone; opens session, no lock-screen approval. |
| Email categories and delivery | docs/features.md, Mail; internal/server/notify.go; internal/server/mailer.go | Verified address, opt-in and SMTP; actionable only; no Done/notes; viewing suppression and 10-minute throttle. |
| Team scope | docs/features.md, Teams / Team-managed sign-ins | Shared configuration and managed credentials; individual workspaces, no admin access to contents/start/stop. |
| Credential keepers | docs/features.md, Credentials and the keeper; docs/storage.md | Supported secrets, not every env/file/gateway secret. Server can read credentials and sessions. |
| Isolation | docs/features.md; docs/roadmap.md | Backend-specific; gVisor only configured runtime; sudo changes boundary. |
| Billing and access | docs/roadmap.md; internal/server/ledger.go | Invitation marketing; no invoices/checkout/charging claims. |
| Recorded file edits and tests | studio/fixture; studio/capture.mjs | Scripted agent. Real git diff, approved npm test, four tests, real preview filtering. |
| Screenshot and device illustration | studio/capture.mjs; studio/surfaces.mjs | Fictional Alice, issue-board and tasks. Notification/email are illustrations. |

No claims of uptime SLA, certification, end-to-end encryption, universal network isolation, measured customer productivity or automatic cross-agent collaboration.

## Research informing presentation

Official marketing pages reviewed 2026-10-09: Claude Code, ChatGPT overview, OpenAI Codex, Cursor Cloud, Ona and Replit. Their capabilities are not evidence of Benchyard capabilities. Adopted presentation ideas: task-led storytelling, readable UI, result-first previews, concise positioning and useful explanatory guides.
