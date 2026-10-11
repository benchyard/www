# Visual assets

Agent marks are bundled in `src/icons/` and rendered by `src/agents.mjs`, with no runtime requests to icon hosts. The same artwork is used in the Benchyard application. Brand marks identify integrations; their inclusion does not imply endorsement. Trademark attribution is visible in the footer.

## LobeHub color marks

Claude, Codex, Gemini, Kimi and ChatGLM color SVGs are vendored from LobeHub Icons (MIT, Copyright (c) 2023 LobeHub), pinned to commit `c385b2b8d1f9e19aa86e628d4e23c91ee1111a47`, under `packages/static-svg/icons/`. The MIT notice is redistributed in `public/fonts/LICENSES.md` alongside the font notices.

Source: https://github.com/lobehub/lobe-icons/tree/c385b2b8d1f9e19aa86e628d4e23c91ee1111a47/packages/static-svg/icons

Claude uses its orange brand color, Codex its blue/purple gradient, and Gemini its multicolor gradient. Kimi keeps its blue accent and white letterform on a dark tile for contrast. The GLM Code planned-integration label uses the ChatGLM provider mark. Inline SVG gradient identifiers are unique per rendered instance.

## Cursor

`cursor-brand.svg` is the official 2.5D cube from `General Logos/Cube/SVG/CUBE_25D.svg` in Cursor's brand asset package. Its five original neutral colors and path geometry are preserved; the artwork is scaled into a 24×24 view box and CSS fills are expanded into SVG attributes for safe inline use. This asset is provided by Cursor/Anysphere under its brand guidance, not the LobeHub MIT license. Cursor's official palette remains black, white and gray.

Source: https://cursor.com/brand
Asset package: https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/cursor-brand-assets.zip

## Captures

Application screenshots use real Benchyard with fictional data. `studio/agent-branding.mjs` normalizes the four agent glyphs in recordings of the SVG-based UI to the same local artwork. Account state, text, approvals and results are unchanged. Kimi Code and GLM Code appear only in marketing artwork as planned integrations. Device surfaces, lock-screen notifications, email illustration and video composition are authored for this site. No third-party website screenshots or personal notifications are redistributed.
