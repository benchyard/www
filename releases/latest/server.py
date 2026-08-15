#!/usr/bin/env python3
"""Host updater sidecar. Listens on the compose network only; no published ports."""

from __future__ import annotations

import json
import os
import re
import subprocess
import threading
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$")
IMAGE_RE = re.compile(r"^ghcr\.io/benchyard/benchyard-[a-z]+@sha256:[a-f0-9]{64}$")
REPOSITORY = os.environ.get("BENCHYARD_RELEASE_REPOSITORY", "benchyard/benchyard-console")
ROLE = os.environ.get("BENCHYARD_UPDATER_ROLE", "console")
COMPOSE_DIR = Path(os.environ.get("BENCHYARD_COMPOSE_DIR", "/opt/benchyard/console"))
REGISTRY_ENV = Path(os.environ.get("BENCHYARD_REGISTRY_ENV", "/opt/benchyard/registry.env"))
LISTEN = os.environ.get("BENCHYARD_UPDATER_LISTEN", "0.0.0.0")
PORT = int(os.environ.get("BENCHYARD_UPDATER_PORT", "8787"))
INSTALL_SH = os.environ.get("BENCHYARD_INSTALL_URL", "https://hero.benchyard.com/install.sh")

_lock = threading.Lock()
_state = {"busy": False, "last_error": "", "last_version": ""}


def _run(argv: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(argv, check=check, text=True, capture_output=True)


def _upsert_env(path: Path, values: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    existing: dict[str, str] = {}
    order: list[str] = []
    if path.is_file():
        for line in path.read_text(encoding="utf-8").splitlines():
            if not line.strip() or line.lstrip().startswith("#") or "=" not in line:
                order.append(line)
                continue
            key, _, value = line.partition("=")
            existing[key] = value
            order.append(key)
    for key, value in values.items():
        if key not in existing and key not in order:
            order.append(key)
        existing[key] = value
    lines: list[str] = []
    seen: set[str] = set()
    for item in order:
        if "=" not in item and item not in existing:
            lines.append(item)
            continue
        key = item if item in existing else item.split("=", 1)[0]
        if key in seen or key not in existing:
            continue
        seen.add(key)
        lines.append(f"{key}={existing[key]}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def _download(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers={"User-Agent": "benchyard-updater"})
    with urllib.request.urlopen(req, timeout=60) as response:
        dest.write_bytes(response.read())


def _verify_manifest(manifest: Path, bundle: Path) -> None:
    _run(
        [
            "cosign",
            "verify-blob",
            "--bundle",
            str(bundle),
            "--certificate-oidc-issuer",
            "https://token.actions.githubusercontent.com",
            "--certificate-identity-regexp",
            r"^https://github.com/benchyard/benchyard-console/.github/workflows/release\.yml@refs/tags/",
            str(manifest),
        ]
    )


def _parse_manifest(manifest: Path, expected: str) -> dict[str, str]:
    data = json.loads(manifest.read_text(encoding="utf-8"))
    if data.get("schema_version") != 1:
        raise RuntimeError("unsupported release manifest schema")
    version = str(data.get("version") or "")
    if expected != "latest" and version != expected:
        raise RuntimeError("release manifest version mismatch")
    if not VERSION_RE.fullmatch(version):
        raise RuntimeError("invalid release version")
    images = data.get("images") or {}
    required = {"api", "web", "worker"}
    if set(images) != required:
        raise RuntimeError("invalid image set in release manifest")
    if any(not IMAGE_RE.fullmatch(str(images[name])) for name in required):
        raise RuntimeError("mutable or untrusted image reference")
    return {
        "version": version,
        "api": str(images["api"]),
        "web": str(images["web"]),
        "worker": str(images["worker"]),
    }


def apply_release(version: str) -> str:
    if version != "latest" and not VERSION_RE.fullmatch(version):
        raise RuntimeError("invalid version")
    work = Path("/tmp/benchyard-updater")
    work.mkdir(parents=True, exist_ok=True)
    base = (
        f"https://github.com/{REPOSITORY}/releases/latest/download"
        if version == "latest"
        else f"https://github.com/{REPOSITORY}/releases/download/{version}"
    )
    manifest = work / "release-manifest.json"
    bundle = work / "release-manifest.sigstore.json"
    _download(f"{base}/release-manifest.json", manifest)
    _download(f"{base}/release-manifest.sigstore.json", bundle)
    _verify_manifest(manifest, bundle)
    parsed = _parse_manifest(manifest, version)
    registry = {
        "BENCHYARD_VERSION": parsed["version"],
        "BENCHYARD_API_IMAGE": parsed["api"],
        "BENCHYARD_WEB_IMAGE": parsed["web"],
        "BENCHYARD_WORKER_IMAGE": parsed["worker"],
    }
    _upsert_env(REGISTRY_ENV, registry)
    if ROLE == "worker":
        worker_images = {
            "BENCHYARD_VERSION": parsed["version"],
            "BENCHYARD_WORKER_IMAGE": parsed["worker"],
        }
        _upsert_env(COMPOSE_DIR / "worker.env", worker_images)
        _upsert_env(COMPOSE_DIR / ".env", worker_images)
        services = ["worker"]
    else:
        _upsert_env(
            COMPOSE_DIR / ".env",
            {
                "BENCHYARD_VERSION": parsed["version"],
                "BENCHYARD_API_IMAGE": parsed["api"],
                "BENCHYARD_WEB_IMAGE": parsed["web"],
            },
        )
        services = ["api", "web", "scheduler"]
    compose = ["docker", "compose", "--project-directory", str(COMPOSE_DIR), "-f", str(COMPOSE_DIR / "compose.yaml")]
    if (COMPOSE_DIR / "compose.override.yaml").is_file():
        compose.extend(["-f", str(COMPOSE_DIR / "compose.override.yaml")])
    _run([*compose, "pull", *services])
    _run([*compose, "up", "-d", "--remove-orphans"])
    return parsed["version"]


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        print(f"updater: {format % args}", flush=True)

    def _json(self, code: int, payload: dict[str, object]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            self._json(200, {"ok": True, "role": ROLE})
            return
        if self.path == "/status":
            version = ""
            if REGISTRY_ENV.is_file():
                for line in REGISTRY_ENV.read_text(encoding="utf-8").splitlines():
                    if line.startswith("BENCHYARD_VERSION="):
                        version = line.split("=", 1)[1]
            self._json(200, {"version": version, "busy": _state["busy"], "last_error": _state["last_error"]})
            return
        self._json(404, {"error": "not found"})

    def do_POST(self) -> None:
        if self.path != "/apply":
            self._json(404, {"error": "not found"})
            return
        length = int(self.headers.get("Content-Length") or "0")
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._json(400, {"error": "invalid json"})
            return
        version = str(body.get("version") or "latest").strip() or "latest"
        if not _lock.acquire(blocking=False):
            self._json(409, {"error": "update already running"})
            return
        _state["busy"] = True
        _state["last_error"] = ""

        def work() -> None:
            try:
                applied = apply_release(version)
                _state["last_version"] = applied
            except Exception as error:
                _state["last_error"] = str(error)
                print(f"updater: apply failed: {error}", flush=True)
            finally:
                _state["busy"] = False
                _lock.release()

        threading.Thread(target=work, daemon=True).start()
        self._json(202, {"accepted": True, "version": version, "install_sh": INSTALL_SH})


def main() -> None:
    server = ThreadingHTTPServer((LISTEN, PORT), Handler)
    print(f"updater: listen {LISTEN}:{PORT} role={ROLE} dir={COMPOSE_DIR}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
