#!/bin/sh
# Verified bootstrap for the Benchyard CLI. This script never installs floating tags.
set -eu

REPOSITORY="${BENCHYARD_RELEASE_REPOSITORY:-benchyard/benchyard-console}"
VERSION="${BENCHYARD_VERSION:-latest}"
ROLE=""
DRY_RUN=0
WORK_DIR="${TMPDIR:-/tmp}/benchyard-install-$$"

usage() {
  printf '%s\n' "Usage: install.sh [--version X.Y.Z] [--dry-run] [console|worker]"
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --version)
      [ "$#" -ge 2 ] || { usage >&2; exit 2; }
      VERSION="$2"
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
  Linux) OS=linux ;;
  *) printf 'install.sh: only Linux is supported\n' >&2; exit 1 ;;
esac
case "$(uname -m)" in
  x86_64|amd64) ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
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

printf 'benchyard-install: release %s, target %s/%s, role %s\n' \
  "$VERSION" "$OS" "$ARCH" "${ROLE:-interactive}"
printf 'benchyard-install: manifest %s/release-manifest.json\n' "$RELEASE_BASE"
[ "$DRY_RUN" -eq 0 ] || exit 0

for command in curl python3 cosign docker; do
  command -v "$command" >/dev/null 2>&1 || {
    printf 'install.sh: %s is required\n' "$command" >&2
    exit 1
  }
done

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

set -- $(python3 - "$MANIFEST" "$OS" "$ARCH" "$VERSION" <<'PY'
import json, re, sys
manifest = json.load(open(sys.argv[1], encoding="utf-8"))
if manifest.get("schema_version") != 1:
    raise SystemExit("unsupported release manifest schema")
if sys.argv[4] != "latest" and manifest.get("version") != sys.argv[4]:
    raise SystemExit("release manifest version mismatch")
artifact = manifest["artifacts"]["cli"][f"{sys.argv[2]}-{sys.argv[3]}"]
url, digest = artifact["url"], artifact["sha256"]
if not url.startswith("https://github.com/benchyard/benchyard-console/releases/download/"):
    raise SystemExit("untrusted CLI URL in release manifest")
if not re.fullmatch(r"[0-9a-f]{64}", digest):
    raise SystemExit("invalid CLI digest in release manifest")
images = manifest["images"]
required_images = {"api", "web", "cli", "worker"}
if set(images) != required_images:
    raise SystemExit("invalid image set in release manifest")
image_pattern = re.compile(
    r"ghcr\.io/benchyard/benchyard-[a-z]+@sha256:[0-9a-f]{64}"
)
if any(not image_pattern.fullmatch(images[name]) for name in required_images):
    raise SystemExit("mutable or untrusted image reference in release manifest")
version = manifest.get("version")
if not isinstance(version, str) or not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?", version):
    raise SystemExit("invalid release version in manifest")
print(version, url, digest, images["api"], images["web"], images["cli"], images["worker"])
PY
)
RESOLVED_VERSION="$1"
CLI_URL="$2"
EXPECTED_SHA="$3"
export BENCHYARD_API_IMAGE="$4"
export BENCHYARD_WEB_IMAGE="$5"
export BENCHYARD_CLI_IMAGE="$6"
export BENCHYARD_WORKER_IMAGE="$7"
CLI="$WORK_DIR/benchyard"
curl --proto '=https' --tlsv1.2 -fsSLo "$CLI" "$CLI_URL"
ACTUAL_SHA="$(python3 - "$CLI" <<'PY'
import hashlib, sys
h = hashlib.sha256()
with open(sys.argv[1], "rb") as stream:
    for block in iter(lambda: stream.read(1024 * 1024), b""):
        h.update(block)
print(h.hexdigest())
PY
)"
[ "$ACTUAL_SHA" = "$EXPECTED_SHA" ] || {
  printf 'install.sh: CLI checksum mismatch\n' >&2
  exit 1
}
chmod 700 "$CLI"

if [ "$(id -u)" -ne 0 ]; then
  printf 'install.sh: run the verified installation as root\n' >&2
  exit 1
fi
mkdir -p /opt/benchyard /usr/local/bin
umask 022
{
  printf 'BENCHYARD_VERSION=%s\n' "$RESOLVED_VERSION"
  printf 'BENCHYARD_CLI_IMAGE=%s\n' "$BENCHYARD_CLI_IMAGE"
  printf 'BENCHYARD_API_IMAGE=%s\n' "$BENCHYARD_API_IMAGE"
  printf 'BENCHYARD_WEB_IMAGE=%s\n' "$BENCHYARD_WEB_IMAGE"
  printf 'BENCHYARD_WORKER_IMAGE=%s\n' "$BENCHYARD_WORKER_IMAGE"
} > /opt/benchyard/registry.env
docker pull "$BENCHYARD_CLI_IMAGE"
install -m 0755 "$CLI" /usr/local/bin/benchyard

if [ -n "$ROLE" ]; then
  exec /usr/local/bin/benchyard install "$ROLE"
fi
exec /usr/local/bin/benchyard install
