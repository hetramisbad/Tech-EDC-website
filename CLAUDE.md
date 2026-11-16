# Tech@EDC website: rules for agents

Read `docs/MASTER_PLAN.md` fully before writing code. It is the contract. Also read `AGENTS.md`: this is Next.js 16, check `node_modules/next/dist/docs/` before using an API you are unsure of.

## Commands

- `npm run build`: static export to `out/`. Must pass with zero errors before you hand off.
- `npm run lint`
- Serve the build: `python3 -m http.server 4173 -d out` (run in background), then open `http://localhost:4173/`.
- Screenshots: `python3 -I qa/shoot.py <url-path> <name> [--width 1440] [--full]`. Output goes to `qa/screenshots/` (gitignored). Headless Chrome is at `/usr/bin/google-chrome`; Python Playwright is installed.
- The workspace cannot reach external websites from the shell or from Chrome (only npm/pip). Use the WebFetch tool to read live pages. The Tech@NYU layout reference is served locally: `python3 -m http.server 4174 -d reference/Tech-at-NYU` → `http://localhost:4174/`.

## File ownership (edit only what you own)

| Owner | Files |
| --- | --- |
| Lead | `next.config.ts`, `package.json`, `content/**`, `docs/**`, `CLAUDE.md`, git |
| Design | `app/globals.css`, `app/layout.tsx`, `app/icon.svg`, `components/**`, `public/brand/**`, `public/fonts/**`, `app/styleguide/**` |
| Home | `app/page.tsx`, `app/_home/**` |
| Pages | `app/team/**`, `app/blog/**`, `app/programs/**`, `app/buildathon/**`, `app/not-found.tsx`, `lib/**` (copy lives in `content/pages.ts`) |
| QA | `qa/**` |

Everyone may append to `STATUS.md` (own section only). Need a change in a file you do not own, or a new npm package? Write it under "Requests" in `STATUS.md` and continue with a conservative workaround.

## Hard rules

- No NYU text, photos, logos, fonts, or CSS copied from `reference/`. Structure and measurements only.
- No partner/sponsor/company logos or names anywhere in rendered output.
- All copy and URLs come from `content/*`. No hard-coded external URLs in components.
- Only design tokens and shared components from `components/`. No one-off colors, fonts, or spacing.
- Static export only: no API routes, server actions, middleware, `next/image` optimization, or runtime env.
- Do not run git. Do not touch `reference/`.
