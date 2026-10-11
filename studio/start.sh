#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
app="${BENCHYARD_SOURCE:-../benchyard}"
# A second worktree of the product cannot have the branch main checked out, so
# what is asked is that its commit is on main.
if ! git -C "$app" merge-base --is-ancestor HEAD main; then
  echo "Capture requires a commit on the product's main branch." >&2; exit 1
fi
case "$(uname -m)" in x86_64) arch=amd64 ;; *) arch=arm64 ;; esac
export DEMO_ARCH="${DEMO_ARCH:-$arch}"
npm --prefix "$app/web" run build
mkdir -p studio/output/bin
output_dir="$PWD/studio/output/bin/"
(cd "$app" && GOOS=linux GOARCH="$DEMO_ARCH" CGO_ENABLED=0 go build -o "$output_dir" ./cmd/benchyard-server ./cmd/benchyardd ./internal/testutil/fakeclaude ./internal/testutil/fakecodex ./internal/testutil/fakecursor ./internal/testutil/fakegemini ./internal/testutil/fakesmtp/fakesmtpd)
node studio/prepare.mjs
docker run -d --name benchyard-www-demo --init -p 127.0.0.1:18080:18080 -v "$PWD/studio:/studio:ro" -e BENCHYARD_LOCAL_STOP_ON_EXIT=1 node:22-bookworm /studio/output/bin/benchyard-server --listen :18080 --data /data --users alice:demo-password:alice@example.com:Alice:Demo --public-url http://localhost:18080 --preview-host '*.localhost' --benchyardd-bin /studio/output/bin/benchyardd --claude-bin /studio/output/bin/fakeclaude --codex-bin /studio/output/bin/democodex --cursor-bin /studio/output/bin/fakecursor --gemini-bin /studio/output/bin/fakegemini
