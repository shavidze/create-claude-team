---
name: setup-team
description: Interactive setup wizard. Asks questions about the project and generates a fully customized CLAUDE.md + .claude/ agent/hook configuration in place. Run once per new project. Usage: /setup-team
---

# Team setup wizard

You are setting up the Claude Code team configuration for a new project. Walk through the steps below **interactively** — ask each question, wait for the answer, then proceed. Do NOT generate files until all questions are answered.

---

## Step 1 — Gather project info

Ask questions **one at a time**. After each answer, acknowledge it briefly (one line), then ask the next question. Do NOT ask multiple questions in one message. Do NOT generate files until all questions (1–10, including 5b) are answered.

Start with question 1:

1. **Project name** — what's the name of this project/product? (used in CLAUDE.md headings and commit prefixes)

After the answer, ask question 2:

2. **Ticket prefix** — 2–5 letter prefix for tickets (e.g. PROJ, CRM, APP). Will become `PREFIX-NNN` in commits.

After the answer, ask question 3:

3. **One-liner** — describe the product in one sentence (e.g. "B2B SaaS for salon management").

After the answer, ask question 4:

4. **Backend stack** — choose one:
   - A) .NET 10 + C# + EF Core + MSSQL
   - B) Node.js + TypeScript + Express/Fastify + PostgreSQL/MySQL
   - C) Python + FastAPI/Django + PostgreSQL
   - D) Go + PostgreSQL
   - E) Other (describe)
After the answer, ask question 5:

5. **Frontend stack** — choose one:
   - A) Next.js + React + TypeScript + Tailwind
   - B) React (Vite) + TypeScript + Tailwind
   - C) Vue 3 + TypeScript
   - D) No frontend (API only)
   - E) Other (describe)

After the answer, ask question 5b:

5b. **Mobile app?** — does this project include a React Native mobile app? yes/no.
   - If yes: bare **React Native CLI** or **Expo**? (in-house default + recommended: **React Native CLI, bare**)
   - If yes and the backend is GraphQL, the mobile data layer is **Apollo Client**; if REST, note it (RTK Query).

After the answer, ask question 6:

6. **Monorepo?** — yes/no. If yes, what are the top-level app folder names? (e.g. `apps/api`, `apps/web`)

After the answer, ask question 7:

7. **Deploy platform** — where does this run? (e.g. Railway + Vercel, AWS, Azure, Fly.io, Docker self-hosted)

After the answer, ask question 8:

8. **Multi-tenant?** — does the app isolate data per customer/organization/clinic/etc.? yes/no. If yes, briefly describe the isolation model.

After the answer, ask question 9:

9. **Multi-language UI?** — do the client apps (web and/or mobile) need multiple languages? If yes, which languages, and which is the default? (web → next-intl; mobile → react-i18next)

After the answer, ask question 10:

10. **Stakeholder name** — who is the business stakeholder? (first name is fine)

---

## Step 2 — Confirm before generating

Once you have all answers, show a summary:

> **About to generate:**
> - `CLAUDE.md` — customized for [PROJECT_NAME], [TICKET_PREFIX], [STACK] (incl. mobile if chosen)
> - `.claude/agents/` — [N] agent files ([backend/frontend/mobile]-engineer tailored to [STACK]; market-strategist + the rest stack-agnostic)
> - `.claude/rules/` — auto-apply rules (read-context, plan-to-docs, self-improve)
> - `.claude/compositions/` — multi-role workflows (new-feature)
> - `.claude/commands/` — `/new-ticket` + `/check` (wired to [STACK] build/test)
> - `.claude/hooks/pre-push-verify.mjs` — configured for [STACK] build commands
> - `.claude/settings.json` — permissions for [STACK] CLI tools
>
> **Estimated files:** ~22 (one fewer if no mobile app)  
> **This will NOT be committed** (add `.claude/` and `CLAUDE.md` to `.gitignore`)
>
> Proceed? (yes / adjust)

Wait for confirmation.

---

## Step 3 — Generate files

Generate each file using the customization rules below. Use the Write tool for each file.

### CLAUDE.md customization rules

- Replace `[PROJECT_NAME]` with the project name
- Replace `[TICKET_PREFIX]` with the ticket prefix
- Replace the one-liner description with the actual description
- Fill in the **Tech stack** bullet with the exact stack chosen
- Fill in the **Repo layout** bullet based on monorepo answer (include `apps/mobile` if 5b = yes)
- If mobile (5b = yes): add the mobile stack line (RN CLI + TS strict + React Navigation v7 + Apollo + react-i18next + encrypted MMKV + @shopify/restyle) and the mobile banned patterns (no AsyncStorage/unencrypted MMKV; no raw hex; no inline-arrow `renderItem` on hot lists)
- If multi-tenant: add a "Multi-tenancy" section describing the isolation model and add a `data-isolation-check` to the banned patterns
- If multi-language: note it in the **Behavioral guidelines** and add i18n to banned patterns; the i18n section must cover **web (next-intl)** and/or **mobile (react-i18next)** per the apps chosen
- Replace `[stakeholder name]` in the Roles section
- Set the **Commit convention** `PROJ` to the chosen ticket prefix

### Backend-engineer agent customization

**If .NET (choice A):**
```
Stack: .NET 10, C# (LangVersion=preview, Nullable enable), EF Core 9, MSSQL (LocalDB locally).
Clean architecture across projects: [PROJECT].{Api, Application, Domain, Persistence, Infrastructure, Common}.

Build command: dotnet build apps/api/[PROJECT].slnx --nologo --verbosity quiet
Migration: dotnet ef migrations add <Name> --project apps/api/src/[PROJECT].Persistence
Verify: dotnet build succeeds + dotnet ef migrations add generates expected SQL

Conventions:
- DateTime.UtcNow only — never DateTime.Now
- Records for ALL DTOs. File-scoped namespaces. async/await everywhere — no .Result, no .Wait()
- [If multi-tenant] Every entity holding user data implements ITenantScoped. Composite indexes (TenantId, X).
```

**If Node.js (choice B):**
```
Stack: Node.js 20 + TypeScript strict + [Express|Fastify] + Prisma + [Postgres|MySQL].
Project layout: apps/api/src/ with controllers/, services/, prisma/, middleware/.

Build command: pnpm --filter api build (or tsc --noEmit for typecheck)
Migration: pnpm --filter api db:migrate
Verify: pnpm typecheck + pnpm build succeed

Conventions:
- async/await everywhere — no callback chains, no Promise.then chains
- Strict TypeScript — no `any`, proper return types
- Zod schemas for all request validation
```

**If Python (choice C):**
```
Stack: Python 3.12 + FastAPI/Django + SQLAlchemy/Django ORM + PostgreSQL.
Layout: apps/api/ with routes/, services/, models/, migrations/.

Build command: python -m pytest (or ruff check .)
Migration: alembic upgrade head (or python manage.py migrate)
Verify: ruff lint passes + tests pass
```

**If Go (choice D):**
```
Stack: Go 1.22 + [Chi|Gin|Echo] + SQLC/GORM + PostgreSQL.
Layout: apps/api/ with handlers/, services/, db/, migrations/.

Build command: go build ./...
Migration: goose up
Verify: go build + go vet pass
```

### Frontend-engineer agent customization

**If Next.js (choice A):**
```
Stack: Next.js 14+, React 18+, TypeScript strict, Tailwind CSS, App Router.
Server Components by default; "use client" only for state/effects/browser APIs.
Path alias: ~/  → apps/web/src/

Build: pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web build
[If multi-language] All UI strings through next-intl. Keys in apps/web/src/messages/{lang}.json.
```

**If React/Vite (choice B):**
```
Stack: React 18+, TypeScript strict, Vite, Tailwind CSS.
Build: pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web build
```

**If Vue (choice C):**
```
Stack: Vue 3, TypeScript strict, Vite, Tailwind CSS, Pinia for state.
Build: pnpm --filter web type-check && pnpm --filter web lint && pnpm --filter web build
```

### Mobile-engineer agent customization (only if 5b — mobile = yes)

Generate `.claude/agents/mobile-engineer.md` (write access to `apps/mobile` only). These
conventions are the in-house standard — see `docs/decisions/001-mobile-conventions.md`. Do NOT
water them down:

```
Stack: React Native CLI (bare — no Expo) + TypeScript strict. Path alias @/ → apps/mobile/src/.
- Navigation: React Navigation v7 (native-stack + bottom-tabs, typed param lists).
- Server data: Apollo Client (GraphQL) + GraphQL Codegen typed hooks. [If REST backend: RTK Query.]
- Client/UI state: minimal — Zustand for rare cross-screen UI state; local state otherwise.
- i18n: react-i18next + i18next. JSON at apps/mobile/src/translations/resources/{lang}/common.json.
  Selected language persisted in ENCRYPTED MMKV; OS-locale fallback; useTranslation() — no raw strings.
- Styling: @shopify/restyle (or typed tokens), light/dark, useStyles() hook. Never raw hex / magic numbers.
- Storage: ENCRYPTED MMKV ALWAYS — the only storage layer (no Keychain/Keystore). Auth tokens + all PII
  live in encrypted MMKV; encryptionKey injected from secure config (react-native-config / build secret),
  never hardcoded or committed. No AsyncStorage, no unencrypted MMKV.
- Forms: react-hook-form + Yup, schemas in apps/mobile/src/forms/schemas/, error messages via i18n.
- Performance (the bar): FlatList/FlashList with memoized renderItem (useCallback) + stable keyExtractor
  + getItemLayout for fixed rows; React.memo on pure rows; narrow store/context slices; near-zero `any`;
  cache remote images. Never .map() a large list into a ScrollView, never inline-arrow renderItem on hot lists.
- Quality: ESLint + Prettier + husky pre-commit (never --no-verify).

Build/verify: pnpm --filter mobile typecheck && pnpm --filter mobile lint
Run: pnpm --filter mobile ios | android ; smoke-test on a sim/emulator (no red box).
Commit scope: feat(mobile): ...
```

### pre-push-verify.mjs customization

Uncomment and fill in the checks array based on chosen stacks:

- .NET: uncomment the `dotnet build` entry, fill in solution file path
- Node.js frontend: uncomment `pnpm typecheck` and `pnpm lint` entries
- **Mobile (RN, if 5b = yes):** add `pnpm --filter mobile typecheck` and `pnpm --filter mobile lint`
  entries, gated on `files.some(f => f.startsWith('apps/mobile/'))`
- Add `when:` predicates to match the correct app directories

### /check command customization

In `.claude/commands/check.md`, replace the two placeholders with the chosen stack's commands:

- `[BUILD_COMMAND]` → e.g. `dotnet build`, `pnpm build`, `ruff check .`, `go build ./...`
- `[TEST_COMMAND]` → e.g. `dotnet test`, `pnpm test`, `python -m pytest`, `go test ./...`

### Stack-agnostic agents (copy as-is, no customization)

These agents don't depend on the stack — generate them unchanged: `market-strategist`
(market research before building), `product-manager`, `architect`, `designer`, `qa-tester`,
`code-reviewer`, `security-reviewer`, `product-verifier`, `release-manager`. Only the
**engineer** agents (`backend-engineer`, `frontend-engineer`, `mobile-engineer`) are stack-tailored
per the blocks above — and `mobile-engineer` is generated **only if 5b = yes**.

### Rules + compositions (no customization needed)

`.claude/rules/` and `.claude/compositions/` are stack-agnostic — copy them as-is.
Confirm `CLAUDE.md` keeps its "Rules (auto-apply)" section so the rules stay in context.
The `new-feature` composition's build step should dispatch `frontend-engineer` (web) and/or
`mobile-engineer` (mobile) per the apps chosen.

### settings.json customization

Add stack-specific allowed commands to the `allow` array:

**If .NET:**
```json
"Bash(dotnet build*)",
"Bash(dotnet test*)",
"Bash(dotnet ef *)",
"Bash(dotnet run *)",
"Bash(dotnet watch *)",
"Bash(dotnet restore*)",
"Bash(dotnet format*)"
```

**If Node.js / pnpm:**
```json
"Bash(pnpm install)",
"Bash(pnpm dev)",
"Bash(pnpm build)",
"Bash(pnpm lint)",
"Bash(pnpm test)",
"Bash(pnpm typecheck)",
"Bash(pnpm --filter *)",
"Bash(pnpm db:*)",
"Bash(npx --yes *)"
```

**If Python:**
```json
"Bash(python *)",
"Bash(pip install*)",
"Bash(pytest*)",
"Bash(ruff *)",
"Bash(alembic *)",
"Bash(uvicorn *)"
```

**If Mobile (React Native CLI, 5b = yes):**
```json
"Bash(npx react-native *)",
"Bash(pnpm --filter mobile *)",
"Bash(pod install*)",
"Bash(bundle exec pod *)",
"Bash(watchman *)"
```

**If Go:**
```json
"Bash(go build*)",
"Bash(go test*)",
"Bash(go vet*)",
"Bash(go run *)",
"Bash(goose *)"
```

---

## Step 4 — gitignore instruction

After generating all files, output this message to the Tech Lead:

> **One final step — keep this local (not committed):**
>
> Add these lines to your project's `.gitignore`:
> ```
> # Claude Code local team config — not committed
> CLAUDE.md
> .claude/
> ```
>
> This keeps your Claude setup private. Each team member who uses Claude Code sets it up locally on their own machine.
>
> **Setup complete.** You now have:
> - [N] agent files in `.claude/agents/`
> - Pre-push gate wired to your stack's build commands
> - `/new-ticket` slash command ready
> - `/pre-flight` skill for engineers to use before coding
>
> Start with: open Claude Code in this project, say "What should we work on?" and hand it the first ticket.
