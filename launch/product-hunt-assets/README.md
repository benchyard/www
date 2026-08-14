# Product Hunt asset pack

- `logo-512.png`: square product logo.
- `gallery/01` through `06`: ordered product gallery using mock data.
- `launch-copy.md`: tagline, description, maker comment, and FAQ.
- `demo-script.md`: 75-second recording script and capture checklist.
- `benchyard-product-hunt-demo.mp4`: 72-second H.264 launch demo.
- `benchyard-product-hunt-demo.webm`: captioned VP9 launch demo.
- `demo-captions.vtt`: accessible English captions embedded in both videos.

Rebuild both videos with `tools/build_product_hunt_demo.sh` after refreshing
the release-candidate screenshots. The script is deterministic and uses only
the bundled Acme fixtures.
