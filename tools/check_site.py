#!/usr/bin/env python3
"""Validate local links and canonical metadata without network access."""

from __future__ import annotations

import html.parser
import struct
import sys
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://hero.benchyard.com"


class Document(html.parser.HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.canonicals: list[str] = []
        self.meta: dict[str, str] = {}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag in {"a", "link"} and data.get("href"):
            self.links.append(str(data["href"]))
        if tag in {"img", "script", "source", "track"} and data.get("src"):
            self.links.append(str(data["src"]))
        if tag == "video" and data.get("poster"):
            self.links.append(str(data["poster"]))
        if tag == "link" and data.get("rel") == "canonical" and data.get("href"):
            self.canonicals.append(str(data["href"]))
        if tag == "meta":
            key = data.get("property") or data.get("name")
            if key and data.get("content"):
                self.meta[str(key)] = str(data["content"])


def png_size(path: Path) -> tuple[int, int]:
    raw = path.read_bytes()[:24]
    if len(raw) != 24 or raw[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"{path.relative_to(ROOT)} is not a PNG")
    return struct.unpack(">II", raw[16:24])


def local_target(page: Path, href: str) -> Path | None:
    if not href or href.startswith(("#", "mailto:", "tel:", "data:")):
        return None
    parsed = urlsplit(href)
    if parsed.scheme in {"http", "https"}:
        return None
    target = ROOT / parsed.path.lstrip("/") if parsed.path.startswith("/") else page.parent / parsed.path
    target = target.resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        raise ValueError(f"link escapes site root: {href}") from None
    if target.is_dir():
        target /= "index.html"
    return target


def main() -> int:
    errors: list[str] = []
    home: Document | None = None
    for page in sorted(ROOT.rglob("*.html")):
        if ".git" in page.parts:
            continue
        doc = Document()
        doc.feed(page.read_text(encoding="utf-8"))
        if page == ROOT / "index.html":
            home = doc
        if page.name == "index.html" and not doc.canonicals:
            errors.append(f"{page.relative_to(ROOT)}: missing canonical link")
        for canonical in doc.canonicals:
            if not canonical.startswith(ORIGIN):
                errors.append(f"{page.relative_to(ROOT)}: unexpected canonical {canonical}")
        for href in doc.links:
            try:
                target = local_target(page, href)
            except ValueError as exc:
                errors.append(f"{page.relative_to(ROOT)}: {exc}")
                continue
            if target is not None and not target.exists():
                errors.append(
                    f"{page.relative_to(ROOT)}: missing {href} -> {target.relative_to(ROOT)}"
                )
    required_meta = {
        "og:title",
        "og:description",
        "og:url",
        "og:image",
        "og:image:width",
        "og:image:height",
        "twitter:card",
        "twitter:image",
    }
    if home is None:
        errors.append("index.html: missing")
    else:
        for name in sorted(required_meta - set(home.meta)):
            errors.append(f"index.html: missing {name}")
        if home.meta.get("og:url") != f"{ORIGIN}/":
            errors.append("index.html: og:url must use the canonical origin")
        expected_image = f"{ORIGIN}/assets/og/benchyard.png"
        if home.meta.get("og:image") != expected_image or home.meta.get("twitter:image") != expected_image:
            errors.append("index.html: social image must use the canonical 1200x630 PNG")
    og_path = ROOT / "assets" / "og" / "benchyard.png"
    if not og_path.exists() or png_size(og_path) != (1200, 630):
        errors.append("assets/og/benchyard.png: expected a 1200x630 PNG")
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if f"Sitemap: {ORIGIN}/sitemap.xml" not in robots:
        errors.append("robots.txt: canonical sitemap missing")
    sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
    for canonical_page in sorted(ROOT.rglob("index.html")):
        if ".git" in canonical_page.parts:
            continue
        relative = canonical_page.parent.relative_to(ROOT).as_posix()
        url = f"{ORIGIN}/" if relative == "." else f"{ORIGIN}/{relative}/"
        if f"<loc>{url}</loc>" not in sitemap:
            errors.append(f"sitemap.xml: missing {url}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print("site links and canonical metadata: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
