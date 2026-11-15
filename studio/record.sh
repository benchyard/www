#!/usr/bin/env bash
# One command for a capture: a fresh demo container from the product's source,
# the capture, and the container removed whether or not the capture succeeds.
# Run it under the docker group: sg docker -c "bash studio/record.sh"
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="/usr/local/go/bin:/usr/local/node/bin:$HOME/.local/node/bin:$PATH"
export BENCHYARD_SOURCE="${BENCHYARD_SOURCE:-$PWD/.cache/benchyard}"
# Another capture or test run may hold the usual name and port: DEMO_NAME and
# DEMO_PORT give this one its own.
export DEMO_NAME="${DEMO_NAME:-benchyard-www-demo}" DEMO_PORT="${DEMO_PORT:-18080}"
export DEMO_CONTAINER="$DEMO_NAME" DEMO_URL="http://localhost:$DEMO_PORT"
name=$DEMO_NAME
docker rm -f "$name" >/dev/null 2>&1 || true
trap '[[ -n "${KEEP_DEMO:-}" ]] || docker rm -f "$name" >/dev/null 2>&1 || true' EXIT
bash studio/start.sh
for _ in $(seq 1 60); do
  curl -fsS -o /dev/null "$DEMO_URL/" && break
  sleep 1
done
node studio/capture.mjs
