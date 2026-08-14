# Public claims checklist

| Claim | Evidence |
|---|---|
| Self-hosted, not SaaS | [Deployment docs](https://github.com/benchyard/benchyard-console/tree/main/deploy) |
| Console is Apache-2.0 | [Apache-2.0 license](https://github.com/benchyard/benchyard-console/blob/main/LICENSE) |
| Worker is a free closed-source binary | [Worker license](https://hero.benchyard.com/legal/worker-license/) and public GHCR release |
| Worker identity is independent and revocable | [Worker protocol](https://github.com/benchyard/benchyard-console/blob/main/contracts/worker-protocol.md) |
| Stale attempts are fenced | [Protocol tests](https://github.com/benchyard/benchyard-console/tree/main/apps/api/tests/contract) |
| Secrets are encrypted in Console | [Threat model](https://github.com/benchyard/benchyard-console/blob/main/docs/security/threat-model.md) |
| Job process is isolated and terminated on timeout | [Worker protocol security model](https://github.com/benchyard/benchyard-console/blob/main/contracts/worker-protocol.md) |
| Releases use immutable digests | [Release manifest specification](https://github.com/benchyard/benchyard-console/blob/main/docs/operations/releases.md) |

Every new security or product claim must name an implementation document or automated test before publication.
