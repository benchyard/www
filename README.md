# hero.benchyard.com

Public Hero for [Benchyard](https://hero.benchyard.com). Static HTML on **GitHub Pages**, DNS on **Cloudflare**.

Apex `benchyard.com` / `www` are not pointed at this site. A user instance home is their workbench, not this page.

```bash
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- control
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- worker
```

Canonical install script source: `benchyard-control/cli/install.sh` (copied here so the documented URL works).
