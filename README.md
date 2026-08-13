# hero.benchyard.com

Public Hero for [Benchyard](https://hero.benchyard.com). Static HTML on **GitHub Pages**, DNS on **Cloudflare**.

Apex `benchyard.com` / `www` are not pointed at this site. Instance home stays the tickets list.

```bash
# after Pages is live
curl -fsSL https://hero.benchyard.com/install.sh | sh -s -- control
```

Canonical install script source: `benchyard-control/cli/install.sh` (copied here so the documented URL works).
