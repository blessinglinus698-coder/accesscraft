# AGENTS.md

Instructions for AI coding agents (Codex, Claude Code, Gemini CLI, Copilot, Cursor, Windsurf and others) working in this repository. Human contributors should read [CONTRIBUTING.md](CONTRIBUTING.md); everything here is consistent with it.

## Project overview

AccessCraft scans live websites for accessibility issues (axe-core driven by Puppeteer) and turns uploaded design images into starter HTML/CSS (node-vibrant for colour extraction).

| Part | Path | Stack |
| --- | --- | --- |
| Backend API | `backend/` | Node.js (ESM), Express 4, Puppeteer, axe-core, multer |
| Frontend | `frontend/` | React 18, Vite 5, Tailwind CSS 3 |

Backend layout: `server.js` (app entry, CORS, `/api/health`), `routes/scan.js` (`/api/scan/*`), `services/accessibilityScanner.js`, `services/designToCode.js`.
Frontend layout: `src/App.jsx`, `src/components/{ScanForm,ResultsView,DesignUpload}.jsx`, `src/index.css`.

The frontend dev server (port 5173) proxies `/api` to the backend (port 5000).

## Commands

Run from the repository root unless noted.

```bash
# Backend (cd backend)
npm install
cp .env.example .env
npm run dev          # nodemon
npm start            # production-style start

# Frontend (cd frontend)
npm install
npm run dev
npm run build        # must pass before opening a PR

# Whole stack in containers
docker compose up --build        # frontend on :8080, API on :5000
```

### Checks CI runs (run these before finishing)

```bash
(cd frontend && npm run build)
(cd backend && find . -name node_modules -prune -o -name '*.js' -print0 | xargs -0 -n1 node --check)
docker compose config -q
```

There is no test runner or linter configured yet. Do not claim tests passed; say which of the checks above you ran.

## Conventions

- ESM only (`"type": "module"`). Use `import`/`export` and include the `.js` extension in relative imports.
- Match the surrounding style: 2-space indent, double quotes, semicolons, `async/await`.
- Keep changes focused: one logical change per pull request. Do not reformat unrelated code.
- Do not add dependencies without a clear need; justify any new one in the PR description and check its licence is compatible with MIT.
- Do not commit `.env`, secrets, `node_modules/` or `dist/`.
- Update the README, `.env.example` and comments when behaviour or configuration changes.

### Accessibility is a hard requirement

This is an accessibility tool, so its own UI must comply. Any UI change must:

- be fully keyboard operable with a visible focus indicator
- use semantic HTML, with ARIA only where native elements fall short
- meet WCAG 2.2 AA contrast in light and dark themes
- respect `prefers-reduced-motion` and `prefers-color-scheme`

### Security

- Scanning fetches user-supplied URLs server-side. Treat URL handling as security sensitive (SSRF): never weaken validation, and do not add code that reaches internal networks or metadata endpoints.
- Chrome runs with `--no-sandbox` inside the container; keep the container non-root and do not widen its privileges.
- Never log or echo secrets. Report vulnerabilities privately per [SECURITY.md](SECURITY.md).
- `GET /api/scan/debug-chrome` exposes filesystem details; do not copy that pattern.

## Git, commits and pull requests

- Branch from `main` using `<type>/<short-description>`, for example `feat/layout-detection` or `fix/scan-timeout`.
- Commits use [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <lowercase subject>`.
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `security`.
  - Scopes: `scanner`, `design`, `frontend`, `backend`, `api`, `ui`, `a11y`, `docker`, `deps`, `docs`, `ci`, `repo`.
- Every commit must be signed off (`git commit -s`) to satisfy the DCO check. The `Signed-off-by` line must match the commit author.
- Do not add AI tool names or co-author trailers to commit messages or PR descriptions unless the repository owner asks for it.
- The PR title uses the same Conventional Commit format. Fill in `.github/PULL_REQUEST_TEMPLATE.md`.
- Never force-push to `main`, skip hooks, or bypass signing. Do not commit or push unless asked.

## Working agreements for agents

1. Read the relevant files before editing; prefer small, reviewable diffs.
2. Ask before destructive or hard-to-reverse actions (deleting files, rewriting history, changing CI or branch protection).
3. Leave unrelated working-tree changes alone.
4. Report honestly what you ran and what you could not verify (for example, Docker or Chrome not available).
5. `CLAUDE.md` and `GEMINI.md` only import this file for tools that do not read `AGENTS.md` natively. Edit this file, not those.
