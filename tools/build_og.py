#!/usr/bin/env python3
"""Build the deterministic social card from generated background artwork."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "og" / "benchyard-background.png"
OUTPUT = ROOT / "assets" / "og" / "benchyard.png"
FONT = Path("/System/Library/Fonts/SFNS.ttf")


def font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT), size=size)


def main() -> None:
    with Image.open(SOURCE) as source:
        image = source.convert("RGB")
        ratio = max(1200 / image.width, 630 / image.height)
        image = image.resize(
            (round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS
        )
        left = (image.width - 1200) // 2
        top = (image.height - 630) // 2
        image = image.crop((left, top, left + 1200, top + 630))

    draw = ImageDraw.Draw(image, "RGBA")
    draw.rectangle((0, 0, 690, 630), fill=(2, 7, 16, 125))
    draw.rounded_rectangle((72, 67, 120, 115), radius=12, fill=(18, 127, 230, 255))
    draw.line((82, 98, 104, 82, 104, 103, 112, 96), fill=(255, 255, 255, 255), width=5)
    draw.text((137, 65), "Benchyard", font=font(43), fill=(247, 250, 252, 255))
    draw.text((72, 183), "The workbench for", font=font(58), fill=(247, 250, 252, 255))
    draw.text((72, 248), "your team and", font=font(58), fill=(247, 250, 252, 255))
    draw.text((72, 313), "their agents.", font=font(58), fill=(247, 250, 252, 255))
    draw.text((75, 420), "Self-hosted  ·  Open Console  ·  Free Worker", font=font(25), fill=(150, 207, 255, 255))
    draw.text((75, 489), "Your code. Your infrastructure. Not a SaaS.", font=font(23), fill=(202, 213, 226, 255))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    image.save(OUTPUT, "PNG", optimize=True)


if __name__ == "__main__":
    main()
