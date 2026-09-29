# /check — build + verify

Run the project's build and tests, fix anything broken. Use before every commit
and after any change an agent reports as "done".

**Usage:** `/check` — runs all layers. `/check api` — backend only. `/check web` — frontend only.

## Instructions for Claude

### Full check (default)

Run these in order. Fix before proceeding to the next step.

**1. API typecheck**
```bash
pnpm --filter api typecheck
```

**2. API tests**
```bash
pnpm --filter api test
```

**3. Frontend codegen** (skip if no `.graphql` files changed)
```bash
pnpm --filter web codegen
```

**4. Frontend typecheck + lint + build**
```bash
# NEXT_DIST_DIR=.next-prod keeps the verification build from corrupting a running
# dev server's `.next` cache (a recurring MODULE_NOT_FOUND / webpack-runtime crash).
pnpm --filter web typecheck && pnpm --filter web lint && NEXT_DIST_DIR=.next-prod pnpm --filter web build
```

### If any step fails

- Read the full output — find the **first** error, not the last line.
- Fix the cause: type error, failing test, schema mismatch, missing i18n key.
- Re-run that step before continuing. Never skip ahead.

### Special cases

- **Prisma schema changed** — run `pnpm --filter api db:generate` before typechecking the API.
- **GraphQL schema changed on the backend** — run codegen (step 3) even if no `.graphql` query files changed; the generated types must reflect the new schema before the frontend build.
- **New i18n key added** — confirm the key exists in all three files: `en.json`, `ka.json`, `ru.json`. A missing key causes a runtime error in next-intl, not a build error.

## Rules

- "Typechecks" is not "tests pass" — run both, don't skip.
- Never make a test pass by weakening its assertion or marking it skipped. Fix the code.
- Do not commit while `/check` is red.
