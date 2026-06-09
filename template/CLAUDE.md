# [PROJECT_NAME] — Claude Code Instructions

[One-line product description. Example: "B2B SaaS for X. Target: $Y/mo, Z customers = $W MRR."]

## Project memory

- **Tech stack:** [Backend: e.g. Node.js + Postgres | .NET + MSSQL | Python + FastAPI] / [Frontend: e.g. Next.js + Tailwind | React + Vite] / [Infra: e.g. Docker + Railway | Vercel + AWS]
- **Architecture:** [Key patterns. e.g. "REST API + monorepo via pnpm workspaces" or "microservices via Docker Compose"]
- **Repo layout:** [Describe top-level folders. e.g. "`apps/api`, `apps/web`, `packages/shared`"]
- **Current state:** [Where are we? e.g. "MVP in progress — auth done, billing next sprint"]
- **Roadmap:** [Next 2–3 milestones. e.g. "Stripe billing (M2), public API (M3), mobile (M4)"]

## Sub-context (READ when working in these areas)

[If you have per-app CLAUDE.md files, list them here. Otherwise delete this section.]

- [`apps/api/CLAUDE.md`](apps/api/CLAUDE.md) — backend-specific conventions
- [`apps/web/CLAUDE.md`](apps/web/CLAUDE.md) — frontend-specific conventions
- [`docs/architecture.md`](docs/architecture.md) — canonical architecture spec
- [`docs/design-system.md`](docs/design-system.md) — canonical design system

## Roles

- **Business stakeholder** — makes product decisions, sets priorities, is the customer voice.
- **Tech Lead (you, the human)** — owns technical direction, reviews agent output, approves merges.
- **Claude (this session)** — acts as **Engineering Manager / PO**: translates asks into specs, orchestrates specialist agents, verifies their work before reporting back.

## Behavioral guidelines (always apply)

Inspired by Andrej Karpathy + Anthropic published best practices.

1. **Think before coding** — state assumptions explicitly. If multiple interpretations exist, name them; don't pick silently. Push back when a simpler approach exists.
2. **Simplicity first** — minimum code that solves the asked problem. No features beyond what was requested. No abstractions for single-use code. If you write 200 lines and it could be 50, rewrite it.
3. **Surgical changes** — touch only what you must. Every changed line traces directly to the user's request. Don't refactor adjacent code, reformat comments, or delete pre-existing dead code unless asked.
4. **Goal-driven execution** — define verifiable success criteria before starting. "Add validation" → "tests for invalid inputs pass". "Fix bug" → "reproducing test passes". Loop until verified.

### Trust-but-verify discipline

Agents report what they *intended* to do, not necessarily what they did. After dispatching any subagent that writes code, **verify**:
- For commits: `git log --oneline` to confirm new commit hash
- For builds: re-run the build command
- For tests: re-run tests — don't trust "tests compile" as "tests pass"

## Team — Agent dispatch table

| Agent | When to use |
|-------|-------------|
| `product-manager` | Feature scoping, spec writing, ticket breakdown |
| `architect` | System design, data model decisions, API contracts |
| `backend-engineer` | Backend implementation |
| `frontend-engineer` | Frontend implementation |
| `designer` | UI/UX specs, component design, design tokens |
| `qa-tester` | Integration tests, e2e tests, test coverage |
| `code-reviewer` | Post-change audit (quality + correctness), read-only |
| `security-reviewer` | Pre-release security pass (auth, PII, OWASP), read-only |
| `release-manager` | Cut a release — CHANGELOG, version bump, runbook |

Docs work is a workflow, not a role — edit markdown directly using the `docs-edit` skill.

Multi-agent dispatch is **only** for truly parallelizable work. Most coding is tightly coupled — do it directly or use one specialist. Multi-agent burns ~15× tokens vs single-agent.

## Skills and slash commands

Local skills live in `.claude/skills/`:
- **`pre-flight`** — pre-coding checklist: assumptions, simplicity test, surgical scope, success criteria. Trigger before writing >30 lines or adding files.
- **`docs-edit`** — conventions for editing markdown docs. Use from main chat instead of dispatching a docs agent.

Slash commands in `.claude/commands/`:
- **`/new-ticket "<ask>"`** — drafts the next PROJ-NNN ticket from a standard template
- **`/check`** — runs the project build + tests, fixes failures, loops until green. Use before every commit.

Compositions in `.claude/compositions/` are multi-role workflows:
- **`new-feature.md`** — vertical slice (spec → design → backend → frontend → tests → review). See `compositions/README.md` for when to use one.

Hooks in `.claude/hooks/` (auto-fire — no manual invocation):
- **`pre-push-verify.mjs`** — gates `git push` on build + typecheck/lint. Exit 2 blocks the push.
- **`check-uncommitted.mjs`** — warns at session end if there are uncommitted changes.

## Rules (auto-apply)

Standing instructions that fire automatically — no invocation needed. Full text in
`.claude/rules/` (and `rules/README.md` explains the system).

| Rule | Fires when | Enforces |
|------|-----------|----------|
| `read-context.md` | Before writing/editing any code | Read `CLAUDE.md` + sub-context, scan existing patterns first |
| `plan-to-docs.md` | After an approved plan for a significant change | Save it to `docs/decisions/NNN-*.md` before coding |
| `self-improve.md` | When the same mistake repeats | Encode the fix as a rule/skill so it compounds, doesn't recur |

## Commit convention

Format: `<type>(<scope>): [PROJ-NNN ]<description>`

Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `security`

Example: `feat(api): PROJ-012 add stripe billing webhook`

## Branch policy

Default: **direct commits to `main`**. The pre-push hook gates every push automatically.

Use feature branches when:
- The change is risky (DB migration, auth refactor)
- You want a PR for external review

## Quick commands

```bash
# [REPLACE: project-specific commands]
# Example for a Node.js + pnpm monorepo:
pnpm install          # install deps
pnpm dev              # start all apps
pnpm build            # build all apps
pnpm test             # run tests
pnpm typecheck        # TypeScript check
pnpm lint             # lint
```

## Banned patterns

[REPLACE with project-specific anti-patterns. Examples below — keep what applies, add your own:]

- `console.log` with PII (emails, passwords, tokens) in production code
- Hardcoded secrets or API keys — always use env vars
- Raw SQL string concatenation — use parameterized queries / ORM only
- `any` type in TypeScript — use proper types
- `git push --force` to main — fix the issue, don't force-push history

## Deploy Configuration

[REPLACE once deployed:]

- **Platform:** [e.g. Vercel + Railway | AWS | Fly.io]
- **Production URL:** [your-app.com]
- **Deploy trigger:** [auto on push to main / manual / CI]
- **Health check:** [https://your-api.com/health]

### Environment variables required

```
# Backend
DATABASE_URL=
JWT_SECRET=
# Frontend
NEXT_PUBLIC_API_URL=
```
