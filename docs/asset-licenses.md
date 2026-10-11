# Visual assets

The base agent glyphs are copied from the Benchyard main application's `web/src/components/ui.tsx`, not loaded from an external host. Claude uses Simple Icons (CC0 1.0); Codex, Cursor and Gemini use LobeHub icons (MIT, Copyright (c) 2023 LobeHub). The redistributed MIT notice is included in `public/fonts/LICENSES.md` alongside existing font notices and copied into the published site. Trademark attribution remains visible in the footer.

Sources: https://github.com/lobehub/lobe-icons/blob/master/LICENSE and https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md. Brand marks identify integrations; their inclusion does not imply endorsement.

All application images are captured from the real application with fictional data. Device surfaces, lock-screen notification, email illustration and video composition are authored for this site. No third-party website screenshots or personal notifications are redistributed.

## Color marks

`src/icons/{codex,kimi,chatglm}-color.svg` are vendored from LobeHub Icons (MIT), pinned to commit `c385b2b8d1f9e19aa86e628d4e23c91ee1111a47`, under `packages/static-svg/icons/`. Codex uses the blue/purple gradient variant. Kimi retains its blue accent and white letterform on a dark tile for contrast. The GLM Code planned-integration label uses the ChatGLM provider's blue gradient mark; it does not claim a separate verified agent integration. Inline SVG gradient identifiers are unique per rendered instance. No runtime requests to icon hosts are made.

Source: https://github.com/lobehub/lobe-icons/tree/c385b2b8d1f9e19aa86e628d4e23c91ee1111a47/packages/static-svg/icons

During demo capture, `studio/agent-branding.mjs` applies the same Codex artwork as a presentation-only CSS background to the application's existing Codex glyphs. The captured UI still runs the real application and fixture commands; account state, text, approvals and results are unchanged. Kimi Code and GLM Code appear only in the marketing artwork as planned integrations, never as fabricated application sessions.
