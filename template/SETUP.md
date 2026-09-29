# SETUP — turning this template into a real project

This directory (`testClaude`) is a **staging copy** of the Claude Code config from `detalebi`,
generalized for a **web + mobile + backend** monorepo. Nothing here touches `detalebi`.

When you've named the real project, do the steps below once.

## 1. Rename the placeholder

The template uses `MyApp` / `myapp` / `@myapp` as placeholders. Replace them with your real name:

```bash
cd /Users/gurbela/Code/testClaude
# pick your real name, then:
grep -rl 'myapp\|MyApp' . --include='*.md' --include='*.json' --include='*.mjs' \
  | xargs sed -i '' -e 's/MyApp/<RealName>/g' -e 's/myapp/<realname>/g'
```

Optionally rename the directory itself (e.g. to the project name).

## 2. Set the ticket prefix (optional)

The commit convention and `/new-ticket` use `DT-NNN`. To use your own prefix, search/replace
`DT-` across `CLAUDE.md`, `.claude/commands/new-ticket.md`, and the agent files.

## 3. Fill the Project memory + product context

- `CLAUDE.md` → **Project memory** block: stakeholder, what the product is, roadmap, deploy targets.
- `.claude/agents/product-manager.md` and `designer.md` have a **Product context** placeholder —
  fill them once the `market-strategist` study exists.

## 4. Scaffold the monorepo

pnpm workspace with three apps. Minimum the hooks expect:

```
/
├─ package.json          # workspace root, "packageManager": "pnpm@..."
├─ pnpm-workspace.yaml    # packages: ["apps/*"]
├─ apps/
│  ├─ api/                # NestJS + GraphQL + Prisma   (name: "api")
│  ├─ web/                # Next.js 14                  (name: "web")
│  └─ mobile/             # React Native CLI (bare)     (name: "mobile")
```

Scaffold the mobile app with the React Native CLI (no Expo):

```bash
npx @react-native-community/cli@latest init Mobile --directory apps/mobile
```

**Each app's `package.json` must expose the scripts the pre-push hook runs** (otherwise the gate
silently passes nothing):

| App | required scripts |
|-----|------------------|
| `api` | `typecheck` (e.g. `tsc --noEmit`), `db:migrate`, `db:generate` |
| `web` | `typecheck`, `lint`, `build` |
| `mobile` | `typecheck` (`tsc --noEmit`), `lint`, `ios`, `android` |

The gate (`.claude/hooks/pre-push-verify.mjs`) only runs a check when files under that app changed.

## 5. Initialize git (activates the hooks)

```bash
git init
git add -A && git commit -m "chore: scaffold monorepo + Claude config"
git branch -M main
git remote add origin <your-repo-url>
```

- `pre-push-verify.mjs` (PreToolUse) gates every `git push` on per-app typecheck/lint/build.
- The **auto-push** hook in `.claude/settings.local.json` (PostToolUse) runs the same gate after
  each `git commit` and pushes if it's green. Requires `jq` and `node` on PATH.
- `check-uncommitted.mjs` (Stop) warns at session end about uncommitted changes.

> `settings.local.json` is machine-local (usually gitignored). `settings.json` is committed and
> shared. Permissions in `settings.local.json` are intentionally minimal here — they grow as you
> approve commands.

## 6. What changed vs. the detalebi config

- **Stack:** unified monorepo — `apps/api` (NestJS/GraphQL, unchanged), `apps/web` (Next.js),
  **`apps/mobile` (React Native CLI, new)**.
- **New agents:**
  - **`market-strategist`** — the "designer-philosopher". Studies the market *before* building:
    competitors, target audience & jobs-to-be-done, positioning, evidence-based feature priority.
    Run it at the very start of a new product/feature, ahead of `product-manager`.
  - **`mobile-engineer`** — React Native CLI implementation (write access to `apps/mobile` only).
- **Hook:** `pre-push-verify.mjs` gained `mobile` typecheck + lint checks.
- **i18n:** now covers web (next-intl) **and** mobile (react-i18next).
- **Product specifics** from detalebi (car parts, shops) were stripped to placeholders.

## 7. Recommended first move

Don't start with code. Start with the market:

```
1. market-strategist  → market study + positioning + GO/SHARPEN/RECONSIDER
2. product-manager     → PRD + DT-NNN tickets (consumes the study)
3. architect           → data model + API contracts
4. backend / web / mobile engineers → build the slice
5. product-verifier    → walk the real workflow before merge to main
```
