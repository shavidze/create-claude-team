# MyApp — Claude Code Instructions

> **Template config.** This `.claude/` setup was lifted from the `detalebi` project and
> generalized for a **web + mobile + backend** monorepo. Before real work, do the one-time
> setup in [`SETUP.md`](SETUP.md): pick the real project name (replace `MyApp` / `@myapp`),
> set the ticket prefix, and fill the **Project memory** below. Stakeholder: TBD.

## Project memory

- **Tech stack:**
  - **Backend (`apps/api`):** NestJS + TypeScript + GraphQL (code-first) + Prisma + PostgreSQL
  - **Web (`apps/web`):** Next.js 14 + React 18 + TypeScript + Tailwind CSS + Apollo Client
  - **Mobile (`apps/mobile`):** React Native (CLI, bare — **no Expo**) + TypeScript strict + Apollo Client (GraphQL) + React Navigation v7 + react-i18next + encrypted MMKV + @shopify/restyle (typed theme tokens). Conventions are derived from the in-house gold-standard apps — see [`docs/decisions/001-mobile-conventions.md`](docs/decisions/001-mobile-conventions.md).
- **Architecture:** GraphQL API consumed by both a Next.js web app and a React Native mobile app; monorepo via pnpm workspaces
- **Repo layout:** `apps/api` (NestJS API), `apps/web` (Next.js), `apps/mobile` (React Native CLI)
- **Current state:** Template / setup phase — no product code yet
- **Roadmap:** TBD (start with the `market-strategist` → `product-manager` → `architect` chain)

## Sub-context (READ when working in these areas)

- [`apps/api/CLAUDE.md`](apps/api/CLAUDE.md) — backend-specific conventions (if present)
- [`apps/web/CLAUDE.md`](apps/web/CLAUDE.md) — web frontend conventions (if present)
- [`apps/mobile/CLAUDE.md`](apps/mobile/CLAUDE.md) — mobile (React Native) conventions (if present)
- [`docs/architecture.md`](docs/architecture.md) — canonical architecture spec
- [`docs/design-system.md`](docs/design-system.md) — canonical design system (shared tokens for web + mobile)

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
5. **Market before build** — for any net-new product or major feature, ground the ask in market reality first (the `market-strategist` agent): who is it for, what do they already use, why would they switch. Don't build on assumption when evidence is cheap to gather.
6. **i18n always** — the UI is multilingual. Every string (web AND mobile) must go through the i18n layer. Never hardcode copy in JSX/components. Add keys to all language files simultaneously.

### Trust-but-verify discipline

Agents report what they *intended* to do, not necessarily what they did. After dispatching any subagent that writes code, **verify**:
- For commits: `git log --oneline` to confirm new commit hash
- For builds: re-run the build command (per app)
- For tests: re-run tests — don't trust "tests compile" as "tests pass"

## Team — Agent dispatch table

| Agent | When to use |
|-------|-------------|
| `market-strategist` | **Before** scoping a net-new product or major feature — market/competitor research, target-audience & JTBD, positioning, evidence-based feature priority. The "designer-philosopher": study the market like a brand would before a line is written. |
| `product-manager` | Feature scoping, spec writing, ticket breakdown (consumes the market study) |
| `architect` | System design, data model decisions, API contracts |
| `backend-engineer` | Backend implementation (`apps/api`) |
| `frontend-engineer` | Web frontend implementation (`apps/web`) |
| `mobile-engineer` | Mobile implementation (`apps/mobile`, React Native CLI) |
| `designer` | UI/UX specs, component design, design tokens (web + mobile) |
| `qa-tester` | Integration tests, e2e tests, test coverage |
| `code-reviewer` | Post-change audit (quality + correctness), read-only |
| `security-reviewer` | Pre-release security pass (auth, PII, OWASP), read-only |
| `product-verifier` | **End of EVERY user-facing feature, before merge to main** — walks the real user workflow on the relevant surface (web AND/OR mobile), confirms the feature does the whole job from the primary entry point + every "what they SEE" exists, read-only |
| `release-manager` | Cut a release — CHANGELOG, version bump, runbook |

Docs work is a workflow, not a role — edit markdown directly using the `docs-edit` skill.

Multi-agent dispatch is **only** for truly parallelizable work. Most coding is tightly coupled — do it directly or use one specialist. Multi-agent burns ~15× tokens vs single-agent.

## Skills and slash commands

Local skills live in `.claude/skills/`:
- **`pre-flight`** — pre-coding checklist: assumptions, simplicity test, surgical scope, success criteria. Trigger before writing >30 lines or adding files.
- **`docs-edit`** — conventions for editing markdown docs. Use from main chat instead of dispatching a docs agent.
- **`db-design`** — database design discipline (Prisma + PostgreSQL): types, integrity, indexing, scoping, money/Decimal, transactions, migration workflow. Trigger before any data-model or migration change.
- **`setup-team`** — interactive wizard to (re)generate this config for a project. Run once when you name the real project.

Slash commands in `.claude/commands/`:
- **`/new-ticket "<ask>"`** — drafts the next DT-NNN ticket and saves it to `docs/tickets/` (status: Todo → In Progress → Done)
- **`/check`** — runs the project build + tests, fixes failures, loops until green. Use before every commit.

Compositions in `.claude/compositions/` are multi-role workflows:
- **`new-feature.md`** — vertical slice (spec → design → backend → frontend/mobile → tests → review). See `compositions/README.md` for when to use one.

Hooks in `.claude/hooks/` (auto-fire — no manual invocation):
- **`pre-push-verify.mjs`** — gates `git push` on per-app build + typecheck/lint (api / web / mobile). Exit 2 blocks the push.
- **`check-uncommitted.mjs`** — warns at session end if there are uncommitted changes.

## Rules (auto-apply)

Standing instructions that fire automatically — no invocation needed. Full text in
`.claude/rules/` (and `rules/README.md` explains the system).

| Rule | Fires when | Enforces |
|------|-----------|----------|
| `read-context.md` | Before writing/editing any code | Read `CLAUDE.md` + sub-context, scan existing patterns first |
| `plan-to-docs.md` | Before a significant change | Save the **complete** plan to `docs/decisions/NNN-*.md` before coding |
| `document-work.md` | After finishing ANY task (bug or feature) | Record what was done in detail: features → update the decision doc; bugs/small → `docs/CHANGELOG.md` |
| `verify-before-done.md` | Before reporting ANY task complete | Map the blast radius (every read/display surface + caches + edge cases), test each, run for real — no half-tested ship |
| `self-improve.md` | When the same mistake repeats | Encode the fix as a rule/skill so it compounds, doesn't recur |

## Commit convention

Format: `<type>(<scope>): [DT-NNN ]<description>`

Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `security`
Scopes: `api`, `web`, `mobile`, `repo` (root/tooling)

Example: `feat(mobile): DT-012 add part search screen`

## Branch policy

Default: **direct commits to `main`**. The pre-push hook gates every push automatically.

Use feature branches when:
- The change is risky (DB migration, auth refactor)
- You want a PR for external review

## Quick commands

```bash
pnpm install                    # install deps
pnpm dev                        # start all apps
pnpm build                      # build all apps
pnpm test                       # run tests
pnpm typecheck                  # TypeScript check
pnpm lint                       # lint
pnpm --filter api db:migrate    # run DB migrations
pnpm --filter api db:generate   # regenerate Prisma client
pnpm --filter mobile ios        # run the iOS app (RN CLI)
pnpm --filter mobile android    # run the Android app (RN CLI)
```

## i18n

The UI is multilingual via an i18n layer on **both** the web and mobile apps.

- **Default languages:** English (`en`), Georgian (`ka`), Russian (`ru`) — adjust per project in `SETUP.md`.
- All UI strings go through i18n. No hardcoded text in JSX/components — ever.
- **Web (`apps/web`):** next-intl. Message files at `apps/web/src/messages/{en,ka,ru}.json`.
  `useTranslations()` in Client Components, `getTranslations()` in Server Components.
- **Mobile (`apps/mobile`):** **react-i18next + i18next** (the in-house standard). JSON resource
  files at `apps/mobile/src/translations/resources/{en,ka,ru}/common.json`. The user's selected
  language is **persisted in encrypted MMKV** and restored on launch; fall back to the OS locale, then to the
  default language. Use the `useTranslation()` hook — never inline raw strings.
- Add keys to **all** language files simultaneously when adding any UI text.

## Banned patterns

- `console.log` with PII (emails, passwords, tokens) in production code
- Hardcoded secrets or API keys — always use env vars (mobile: never bake secrets into the bundle)
- Raw SQL string concatenation — use parameterized queries / Prisma ORM only
- `any` type in TypeScript — use proper types or `unknown`
- `git push --force` to main — fix the issue, don't force-push history
- Hardcoded UI text in JSX/components — always use i18n translation keys
- Missing i18n key in any language file — add all languages or none
- **Mobile:** `AsyncStorage` or unencrypted MMKV for ANY on-device data — the standard is **encrypted MMKV always** (tokens/PII included); the `encryptionKey` comes from secure config, never hardcoded/committed
- **Mobile:** raw hex / magic numbers in styles — use theme tokens (`@shopify/restyle` / typed tokens)
- **Mobile:** large dataset `.map()` into a `ScrollView`, or an inline arrow `renderItem` on a hot list — use `FlatList`/`FlashList` with a memoized `renderItem` + stable `keyExtractor`

## Deploy Configuration

> Fill in per project (see `SETUP.md`). Typical shape:

- **Platform:** API host (e.g. Railway) + web host (e.g. Vercel) + object storage (e.g. Cloudflare R2). Mobile ships via the App Store / Play Store (or CodePush/OTA for JS-only updates).
- **Deploy trigger:** auto on push to main (API + web).
- **Mobile release:** native binaries are built and submitted manually / via CI (Fastlane); they do **not** auto-deploy on push.
