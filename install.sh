#!/bin/sh
# Verified bootstrap. Writes compose + updater; never installs floating tags.
set -eu

REPOSITORY="${BENCHYARD_RELEASE_REPOSITORY:-benchyard/benchyard-console}"
VERSION="${BENCHYARD_VERSION:-latest}"
ROLE=""
API_URL=""
TOKEN=""
DRY_RUN=0
WORK_DIR="${TMPDIR:-/tmp}/benchyard-install-$$"
BUNDLE_DIR="${BENCHYARD_BUNDLE_DIR:-}"

usage() {
  printf '%s\n' "Usage: install.sh [--version X.Y.Z] [--api-url URL] [--token TOKEN] [--dry-run] [console|worker]"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --version)
      [ "$#" -ge 2 ] || { usage >&2; exit 2; }
      VERSION="$2"
      shift 2
      ;;
    --api-url)
      [ "$#" -ge 2 ] || { usage >&2; exit 2; }
      API_URL="$2"
      shift 2
      ;;
    --token)
      [ "$#" -ge 2 ] || { usage >&2; exit 2; }
      TOKEN="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    console|worker)
      ROLE="$1"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'install.sh: unknown argument: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$(uname -s)" in
  Linux) ;;
  *) printf 'install.sh: only Linux is supported\n' >&2; exit 1 ;;
esac
case "$(uname -m)" in
  x86_64|amd64|aarch64|arm64) ;;
  *) printf 'install.sh: unsupported architecture: %s\n' "$(uname -m)" >&2; exit 1 ;;
esac

if [ "$VERSION" = latest ]; then
  RELEASE_BASE="https://github.com/${REPOSITORY}/releases/latest/download"
else
  case "$VERSION" in
    *[!0-9A-Za-z.-]*) printf 'install.sh: invalid version\n' >&2; exit 2 ;;
  esac
  RELEASE_BASE="https://github.com/${REPOSITORY}/releases/download/${VERSION}"
fi

printf 'benchyard-install: release %s role %s\n' "$VERSION" "${ROLE:-console}"
printf 'benchyard-install: manifest %s/release-manifest.json\n' "$RELEASE_BASE"
[ "$DRY_RUN" -eq 0 ] || exit 0

for command in curl python3 cosign docker; do
  command -v "$command" >/dev/null 2>&1 || {
    printf 'install.sh: %s is required\n' "$command" >&2
    exit 1
  }
done
if [ "$(id -u)" -ne 0 ]; then
  printf 'install.sh: run the verified installation as root\n' >&2
  exit 1
fi

[ -n "$ROLE" ] || ROLE=console
if [ "$ROLE" = worker ] && { [ -z "$API_URL" ] || [ -z "$TOKEN" ]; }; then
  printf 'install.sh: worker install requires --api-url and --token\n' >&2
  exit 2
fi

trap 'rm -rf "$WORK_DIR"' EXIT HUP INT TERM
mkdir -m 700 "$WORK_DIR"
MANIFEST="$WORK_DIR/release-manifest.json"
BUNDLE="$WORK_DIR/release-manifest.sigstore.json"

curl --proto '=https' --tlsv1.2 -fsSLo "$MANIFEST" "$RELEASE_BASE/release-manifest.json"
curl --proto '=https' --tlsv1.2 -fsSLo "$BUNDLE" "$RELEASE_BASE/release-manifest.sigstore.json"

cosign verify-blob \
  --bundle "$BUNDLE" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  --certificate-identity-regexp "^https://github.com/benchyard/benchyard-console/.github/workflows/release\\.yml@refs/tags/" \
  "$MANIFEST" >/dev/null

eval "$(python3 - "$MANIFEST" "$VERSION" "$WORK_DIR" "$RELEASE_BASE" "$BUNDLE_DIR" <<'PY'
import hashlib, json, re, shutil, sys, urllib.request
from pathlib import Path

manifest_path, expected, work, release_base, bundle_dir = sys.argv[1:6]
manifest = json.loads(Path(manifest_path).read_text(encoding="utf-8"))
if manifest.get("schema_version") != 1:
    raise SystemExit("unsupported release manifest schema")
if expected != "latest" and manifest.get("version") != expected:
    raise SystemExit("release manifest version mismatch")
images = manifest["images"]
required = {"api", "web", "worker"}
if set(images) != required:
    raise SystemExit("invalid image set in release manifest")
image_re = re.compile(r"ghcr\.io/benchyard/benchyard-[a-z]+@sha256:[0-9a-f]{64}")
if any(not image_re.fullmatch(images[name]) for name in required):
    raise SystemExit("mutable or untrusted image reference in release manifest")
version = manifest.get("version")
if not isinstance(version, str) or not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?", version):
    raise SystemExit("invalid release version in manifest")
artifacts = manifest.get("artifacts") or {}
needed = ("compose", "compose_worker", "updater")
work_dir = Path(work)
for name in needed:
    dest = work_dir / name
    if bundle_dir:
        src = Path(bundle_dir) / {
            "compose": "compose.yaml",
            "compose_worker": "compose.worker.yaml",
            "updater": "updater/server.py",
        }[name]
        dest.write_bytes(src.read_bytes())
    else:
        item = artifacts.get(name) or {}
        url = item.get("url") or ""
        digest = item.get("sha256") or ""
        if not url.startswith("https://github.com/benchyard/benchyard-console/releases/download/"):
            raise SystemExit(f"untrusted {name} URL in release manifest")
        if not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise SystemExit(f"invalid {name} digest in release manifest")
        req = urllib.request.Request(url, headers={"User-Agent": "benchyard-install"})
        with urllib.request.urlopen(req, timeout=60) as response:
            payload = response.read()
        if hashlib.sha256(payload).hexdigest() != digest:
            raise SystemExit(f"{name} checksum mismatch")
        dest.write_bytes(payload)
print(
    "RESOLVED_VERSION=" + version,
    "BENCHYARD_API_IMAGE=" + images["api"],
    "BENCHYARD_WEB_IMAGE=" + images["web"],
    "BENCHYARD_WORKER_IMAGE=" + images["worker"],
    sep="\n",
)
PY
)"

upsert_env() {
  file="$1"
  key="$2"
  value="$3"
  mkdir -p "$(dirname "$file")"
  touch "$file"
  tmp="$(mktemp)"
  awk -v k="$key" -v v="$value" '
    BEGIN { done = 0 }
    $0 ~ "^" k "=" { print k "=" v; done = 1; next }
    { print }
    END { if (!done) print k "=" v }
  ' "$file" > "$tmp"
  mv "$tmp" "$file"
}

rand() { dd if=/dev/urandom bs=32 count=1 2>/dev/null | od -An -tx1 | tr -d ' \n'; }

mkdir -p /opt/benchyard/updater /opt/benchyard/console /opt/benchyard/worker
install -m 0644 "$WORK_DIR/updater" /opt/benchyard/updater/server.py
{
  printf 'BENCHYARD_VERSION=%s\n' "$RESOLVED_VERSION"
  printf 'BENCHYARD_API_IMAGE=%s\n' "$BENCHYARD_API_IMAGE"
  printf 'BENCHYARD_WEB_IMAGE=%s\n' "$BENCHYARD_WEB_IMAGE"
  printf 'BENCHYARD_WORKER_IMAGE=%s\n' "$BENCHYARD_WORKER_IMAGE"
} > /opt/benchyard/registry.env

if [ "$ROLE" = console ]; then
  install -m 0644 "$WORK_DIR/compose" /opt/benchyard/console/compose.yaml
  if [ ! -f /opt/benchyard/console/.env ]; then
    cat > /opt/benchyard/console/.env <<EOF
PUBLIC_ORIGIN=http://localhost:3011
CORS_ORIGINS=http://localhost:3011
WEB_PORT=3011
API_PORT=8004
WORKSPACE_ROOT=/benchyard

BENCHYARD_SECRET_MASTER_KEY=$(rand)
POSTGRES_PASSWORD=$(rand)
S3_ACCESS_KEY=benchyard
S3_SECRET_KEY=$(rand)
S3_BUCKET=benchyard

POSTGRES_IMAGE=postgres:16
MINIO_IMAGE=minio/minio:RELEASE.2025-09-07T16-13-09Z
EOF
    chmod 600 /opt/benchyard/console/.env
  fi
  upsert_env /opt/benchyard/console/.env BENCHYARD_VERSION "$RESOLVED_VERSION"
  upsert_env /opt/benchyard/console/.env BENCHYARD_API_IMAGE "$BENCHYARD_API_IMAGE"
  upsert_env /opt/benchyard/console/.env BENCHYARD_WEB_IMAGE "$BENCHYARD_WEB_IMAGE"
  set -a
  # shellcheck disable=SC1091
  . /opt/benchyard/registry.env
  set +a
  docker pull "$BENCHYARD_API_IMAGE"
  docker pull "$BENCHYARD_WEB_IMAGE"
  compose_args="-f /opt/benchyard/console/compose.yaml"
  if [ -f /opt/benchyard/console/compose.override.yaml ]; then
    compose_args="$compose_args -f /opt/benchyard/console/compose.override.yaml"
  fi
  # shellcheck disable=SC2086
  docker compose --project-directory /opt/benchyard/console $compose_args up -d --remove-orphans
  printf 'benchyard-install: console %s is up. Open the web UI and create the first admin.\n' "$RESOLVED_VERSION"
  exit 0
fi

install -m 0644 "$WORK_DIR/compose_worker" /opt/benchyard/worker/compose.yaml
if [ ! -f /opt/benchyard/worker/worker.env ]; then
  cat > /opt/benchyard/worker/worker.env <<EOF
BENCHYARD_API_URL=${API_URL}
BENCHYARD_ENROLLMENT_TOKEN=${TOKEN}
EOF
  chmod 600 /opt/benchyard/worker/worker.env
else
  upsert_env /opt/benchyard/worker/worker.env BENCHYARD_API_URL "$API_URL"
  upsert_env /opt/benchyard/worker/worker.env BENCHYARD_ENROLLMENT_TOKEN "$TOKEN"
fi
upsert_env /opt/benchyard/worker/worker.env BENCHYARD_VERSION "$RESOLVED_VERSION"
upsert_env /opt/benchyard/worker/worker.env BENCHYARD_WORKER_IMAGE "$BENCHYARD_WORKER_IMAGE"
upsert_env /opt/benchyard/worker/.env BENCHYARD_VERSION "$RESOLVED_VERSION"
upsert_env /opt/benchyard/worker/.env BENCHYARD_WORKER_IMAGE "$BENCHYARD_WORKER_IMAGE"
set -a
# shellcheck disable=SC1091
. /opt/benchyard/registry.env
set +a
docker pull "$BENCHYARD_WORKER_IMAGE"
docker compose --project-directory /opt/benchyard/worker \
  -f /opt/benchyard/worker/compose.yaml \
  up -d --remove-orphans
printf 'benchyard-install: worker %s is up. Enrollment uses the one-time token once.\n' "$RESOLVED_VERSION"
