# Contributing to AccessCraft

Thank you for helping make the web more accessible. This guide explains how to propose changes, set up the project and get a pull request merged.

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report bugs** using the [bug report form](https://github.com/blessinglinus698-coder/accesscraft/issues/new/choose).
- **Report scan inaccuracies** (false positives and negatives) with the scan accuracy form.
- **Suggest features** through a feature request, or start a Discussion for early ideas.
- **Improve documentation**, including typos and unclear explanations.
- **Write code**. Look for issues labelled `good first issue` and `help wanted`.

Security vulnerabilities must be reported privately. See [SECURITY.md](SECURITY.md).

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. For anything beyond a small fix, open or comment on an issue first so we can agree on the approach.
3. Comment on the issue to claim it. If there is no activity for two weeks, it may be reassigned.

## Development setup

Requirements: Node.js 18 or newer (20 recommended), npm, and a working Chrome or Chromium for Puppeteer.

```bash
git clone https://github.com/<your-username>/accesscraft.git
cd accesscraft
git remote add upstream https://github.com/blessinglinus698-coder/accesscraft.git
```

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend proxies `/api` to the backend on port 5000.

## Making a change

1. Sync and branch from `main`:
   ```bash
   git fetch upstream
   git checkout -b feat/short-description upstream/main
   ```
2. Keep changes focused. One logical change per pull request.
3. Run the checks CI will run:
   ```bash
   (cd frontend && npm run build)
   (cd backend && find . -name node_modules -prune -o -name '*.js' -print0 | xargs -0 -n1 node --check)
   ```
4. Update documentation when behavior, configuration or environment variables change.

### Accessibility standard for our own UI

AccessCraft is an accessibility tool, so its interface must be accessible. UI changes must:

- be fully operable by keyboard with a visible focus indicator
- use semantic HTML and correct ARIA only where native elements fall short
- meet WCAG 2.2 AA colour contrast in both light and dark themes
- respect `prefers-reduced-motion` and `prefers-color-scheme`
- be tested with the project's own scanner

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <lowercase subject>

<optional body explaining what and why>

Signed-off-by: Your Name <you@example.com>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `security`.
Scopes: `scanner`, `design`, `frontend`, `backend`, `api`, `ui`, `a11y`, `docker`, `deps`, `docs`, `ci`, `repo`.

The pull request title must follow the same format. It becomes the squash-commit message and drives release notes.

## Developer Certificate of Origin (DCO)

AccessCraft uses the [Developer Certificate of Origin](https://developercertificate.org/) instead of a CLA. By signing off, you certify that you wrote the change or have the right to submit it under the project's license.

Sign off every commit with `-s`:

```bash
git commit -s -m "fix(scanner): handle pages that never finish loading"
```

This appends a line that must match your commit author:

```
Signed-off-by: Your Name <you@example.com>
```

Configure git once so the name and email are correct:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

To sign off every commit automatically, add `alias gc='git commit -s'` or use a `prepare-commit-msg` hook.

**Forgot to sign off?**

```bash
# Latest commit
git commit --amend --no-edit --signoff

# Several commits
git rebase HEAD~3 --signoff

git push --force-with-lease
```

The `DCO` check blocks merging until all commits are signed off. Commits from bots such as Dependabot are exempt.

## Pull request process

1. Push your branch and open a pull request against `main`, completing the template.
2. Make sure automated checks pass: CI, DCO, CodeQL, dependency review and PR title.
3. A code owner reviews your change. Please respond to feedback within two weeks.
4. Resolve review conversations and keep the branch up to date with `main`.
5. A maintainer squash-merges once approved and all checks are green.

Draft pull requests are welcome for early feedback.

## Reporting issues well

A great bug report has a minimal reproduction, the exact URL or snippet, expected and actual behavior, and version information. Reports with this detail are fixed much faster.

## Releases

Releases follow [Semantic Versioning](https://semver.org/). Release notes are drafted automatically from merged pull request titles and labels.

## Licensing

By contributing, you agree that your contributions are licensed under the project's MIT license.

## Questions

Use [Discussions](https://github.com/blessinglinus698-coder/accesscraft/discussions). See [SUPPORT.md](.github/SUPPORT.md).
