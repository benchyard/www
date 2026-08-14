#!/bin/sh
set -eu

root="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
gallery="$root/launch/product-hunt-assets/gallery"
output="$root/launch/product-hunt-assets"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required" >&2
  exit 1
fi
filters=""
index=0
for ignored in 1 2 3 4 5 6
do
  filters="${filters}[${index}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x09090b,setsar=1,fade=t=in:st=0:d=0.5,fade=t=out:st=11.5:d=0.5[v${index}];"
  index=$((index + 1))
done
filters="${filters}[v0][v1][v2][v3][v4][v5]concat=n=6:v=1:a=0[outv]"

ffmpeg -hide_banner -loglevel warning -y \
  -loop 1 -t 12 -i "$gallery/01-console-worker-workspace.png" \
  -loop 1 -t 12 -i "$gallery/02-ticket-execution.png" \
  -loop 1 -t 12 -i "$gallery/03-todo-board.png" \
  -loop 1 -t 12 -i "$gallery/04-docs.png" \
  -loop 1 -t 12 -i "$gallery/05-tests.png" \
  -loop 1 -t 12 -i "$gallery/06-mobile-messaging.png" \
  -i "$output/demo-captions.vtt" \
  -filter_complex "$filters" -map '[outv]' -map 6:s:0 -r 24 \
  -c:v libx264 -preset medium -crf 21 -pix_fmt yuv420p -movflags +faststart \
  -c:s mov_text -metadata:s:s:0 language=eng \
  "$output/benchyard-product-hunt-demo.mp4"

ffmpeg -hide_banner -loglevel warning -y \
  -i "$output/benchyard-product-hunt-demo.mp4" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -an -c:s webvtt \
  "$output/benchyard-product-hunt-demo.webm"

echo "built 72-second Product Hunt demo (MP4 and WebM)"
