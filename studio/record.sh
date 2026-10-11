#!/usr/bin/env bash
# One command for a capture: a fresh demo container from the product's source,
# the capture, and the container removed whether or not the capture succeeds.
# Run it under the docker group: sg docker -c "bash studio/record.sh"
set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="/usr/local/go/bin:/usr/local/node/bin:$PATH"
export BENCHYARD_SOURCE="${BENCHYARD_SOURCE:-$PWD/.cache/benchyard}"
name=benchyard-www-demo
docker rm -f "$name" >/dev/null 2>&1 || true
trap '[[ -n "${KEEP_DEMO:-}" ]] || docker rm -f "$name" >/dev/null 2>&1 || true' EXIT
bash studio/start.sh
for _ in $(seq 1 60); do
  curl -fsS -o /dev/null http://localhost:18080/ && break
  sleep 1
done
node studio/capture.mjs
