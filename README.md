# hero.benchyard.com

Public Hero for [Benchyard](https://hero.benchyard.com). Static HTML on **GitHub Pages**, DNS on **Cloudflare**.

Apex `benchyard.com` / `www` are not pointed at this site. Instance home stays the tickets list.

```bash
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- control
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- worker
```

Canonical install script source: `benchyard-control/cli/install.sh` (copied here so the documented URL works).
