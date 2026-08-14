# Benchyard Product Hunt launch copy

## Tagline

The self-hosted workbench for your team and their agents.

## Short description

Benchyard gives people and coding agents one shared workspace for tickets, TODOs, docs, tests, messages, and fenced jobs. Console is Apache-2.0 open source; the free Worker runs on your infrastructure.

## Maker comment

We built Benchyard because coding agents are powerful but still feel like isolated personal sessions. Benchyard adds the missing team console: shared context, explicit job leases, reviewable events, and human verification. It is self-hosted and not a SaaS. Console and the Worker protocol are open source; the official Worker is a free public binary.

## Gallery order

1. Console → Worker → workspace overview
2. Ticket plan and execution
3. Shared TODO board
4. Workspace documentation
5. Test catalog
6. Mobile messaging and notifications

## FAQ

- Data location: the operator's PostgreSQL, object storage, Console, and Workers.
- Secrets: encrypted in Console and injected into the assigned Worker for a job; Console administrators are trusted.
- Open source: Console and contract are Apache-2.0; Worker source is private.
- Cost: official images are publicly downloadable with no activation token.
- Supported provider: Cursor is currently supported.
