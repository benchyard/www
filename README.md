# hero.benchyard.com

Public Hero for [Benchyard](https://hero.benchyard.com). Static HTML on **GitHub Pages**, DNS on **Cloudflare**.

Apex `benchyard.com` / `www` are not pointed at this site. A user instance home is their workbench, not this page.

```bash
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- console
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- worker
```

`install.sh` is the public verified bootstrap. Signed release files live at
`/releases/{version}/` and `/releases/latest/`. Images are public GHCR digests.

## Product boundary

- Benchyard Console and the public Worker protocol are Apache-2.0 open source.
- Benchyard Worker source is private; official images are free binaries under
  the Benchyard Worker Binary License and are public on GHCR.
- Secrets are encrypted by Console and injected into the assigned Worker for a
  job. Console administrators are part of the trusted boundary.

Security and product claims on this site must match the public threat model.
Use fictional Acme data in every screenshot and fixture.
