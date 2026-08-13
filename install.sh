#!/bin/sh
# Bootstrap: pull ghcr.io/benchyard/benchyard-cli, then install.
# Example: curl -fsSL https://benchyard.com/install.sh | sh -s -- control
set -eu

OPT_ROOT=/opt/benchyard
REG="$OPT_ROOT/registry.env"
GHCR="${BENCHYARD_GHCR:-ghcr.io/benchyard}"
TAG="${BENCHYARD_VERSION:-latest}"
ROLE="${1:-}"
NO_PULL=0
for arg in "$@"; do
  case "$arg" in
    --no-pull) NO_PULL=1 ;;
  esac
done
case "$ROLE" in
  --no-pull) ROLE="${2:-}" ;;
esac

if [ "$(id -u)" -ne 0 ]; then
  echo "install.sh: run as root (needs docker + /opt/benchyard + /usr/local/bin)" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "install.sh: docker is required" >&2
  exit 1
fi

log() { printf 'benchyard-install: %s\n' "$*"; }

relay_hint() {
  cat >&2 <<EOF
install.sh: could not pull $CLI_IMAGE

If this host cannot reach ghcr.io, on a machine that can:

  ./cli/relay-images.sh control|worker $(hostname -f 2>/dev/null || hostname)

docker login ghcr.io first if the pull returned 401 (GitHub PAT with read:packages).
EOF
}

try_pull() {
  img="$1"
  log "pull $img"
  if command -v timeout >/dev/null 2>&1; then
    if timeout 45 docker pull "$img"; then
      log "pull ok $img"
      return 0
    fi
  else
    if docker pull "$img"; then
      log "pull ok $img"
      return 0
    fi
  fi
  log "pull fail $img"
  return 1
}

CLI_IMAGE="${GHCR}/benchyard-cli:${TAG}"

if [ "$NO_PULL" = 1 ]; then
  if ! docker image inspect "$CLI_IMAGE" >/dev/null 2>&1; then
    relay_hint
    exit 1
  fi
elif ! try_pull "$CLI_IMAGE"; then
  relay_hint
  exit 1
fi

mkdir -p "$OPT_ROOT" /benchyard
cat > "$REG" <<EOF
BENCHYARD_GHCR=${GHCR}
BENCHYARD_VERSION=${TAG}
BENCHYARD_CLI_IMAGE=${CLI_IMAGE}
EOF
log "wrote $REG"

TTY_FLAGS=
if [ -t 0 ] && [ -t 1 ]; then
  TTY_FLAGS="-it"
fi

INSTALL_ARGS="install"
if [ -n "$ROLE" ] && [ "$ROLE" != "--no-pull" ]; then
  INSTALL_ARGS="install $ROLE"
fi
if [ "$NO_PULL" = 1 ]; then
  INSTALL_ARGS="$INSTALL_ARGS --no-pull"
fi

OWNER="${BENCHYARD_OWNER:-${SUDO_USER:-}}"
OWNER_UID=0
OWNER_GID=0
if [ -n "$OWNER" ] && [ "$OWNER" != "root" ] && id "$OWNER" >/dev/null 2>&1; then
  OWNER_UID="$(id -u "$OWNER")"
  OWNER_GID="$(id -g "$OWNER")"
  chown "$OWNER_UID:$OWNER_GID" "$OPT_ROOT" "$REG" 2>/dev/null || true
elif [ -d /benchyard ]; then
  OWNER_UID="$(stat -c %u /benchyard 2>/dev/null || echo 0)"
  OWNER_GID="$(stat -c %g /benchyard 2>/dev/null || echo 0)"
  if [ "$OWNER_UID" != 0 ]; then
    chown "$OWNER_UID:$OWNER_GID" "$OPT_ROOT" "$REG" 2>/dev/null || true
  fi
fi

# shellcheck disable=SC2086
exec docker run --rm $TTY_FLAGS \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /opt/benchyard:/opt/benchyard \
  -v /benchyard:/benchyard \
  -v /usr/local/bin:/host-bin \
  -e BENCHYARD_IN_CONTAINER=1 \
  -e BENCHYARD_OWNER="$OWNER" \
  -e BENCHYARD_OWNER_UID="$OWNER_UID" \
  -e BENCHYARD_OWNER_GID="$OWNER_GID" \
  "$CLI_IMAGE" $INSTALL_ARGS
