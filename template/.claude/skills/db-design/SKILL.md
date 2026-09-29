---
name: db-design
description: Database design discipline for this project's Prisma + PostgreSQL stack. TRIGGER before any data-model work — adding/changing a Prisma model, column, relation, enum, index, or writing a migration. Forces the ideal, convention-matching decision on types, integrity, indexing, scoping, money, transactions, and the project's migration workflow.
---

# Database design — make the ideal decision every time

You're about to touch the data model (`apps/api/prisma/schema.prisma`) or a migration.
Work through this **before** editing, and state the key decisions + rationale in chat.
This stack is **Prisma + PostgreSQL** (NestJS GraphQL code-first on top).

## 0. Read first

Open `schema.prisma` and find 1–2 existing models like the one you're adding. **Match
their conventions** — don't invent a new style. Scan how they're queried (services) so
your indexes fit real access paths.

## 1. Types — the non-negotiables

- **Money & quantities → `Decimal @db.Decimal(10,2)`.** Never `Float` (rounding) or
  `Int` when fractional values are possible (e.g. sold-by-litre). Prisma returns
  `Decimal` objects — convert at the read boundary with `Number(row.x)` (the existing
  pattern), and expose GraphQL fields as `Float`, not `Int`.
- **IDs:** `String @id @default(cuid())`.
- **Enums:** Prisma `enum` + `registerEnumType(X, { name: 'X' })` in the GraphQL model.
- **Timestamps:** `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`.
- **Localized text → `Json`** in the `LocalizedString` shape (`ka/en/ru/tr/hy`) — match
  `title`/`description`/category `name`.
- **Sparse / category-specific fields → `Json`** (like `Part.attributes`); use real
  columns when the field is always present and queried/sorted.
- **Nullable vs required:** required by default; nullable only when genuinely optional,
  with a sensible `@default`.

## 2. Integrity & relations

- Explicit relations with the right **`onDelete`**: `Cascade` for owned children
  (e.g. per-warehouse stock under a part), `Restrict`/`SetNull` otherwise. Never
  orphan rows.
- **Natural keys → `@@unique`** (e.g. `@@unique([partId, locationId])`, slug uniqueness).
- **Soft-delete, not hard-delete** for business data — flip a `status` enum (project
  decision #22). Don't `DELETE` parts/shops/sales.
- **Multi-tenant scoping:** every shop-owned table carries `shopId`, and **every query
  must scope by it** (the resolver guards ownership). Never write a query that could
  read across shops.

## 3. Caches & denormalization

Denormalize only as an explicit **cache of a clear source of truth** (e.g.
`Part.quantity`/`costPrice` cache `PartStock`/`CostLayer`). When you do:
- Comment it as a cache, and
- Resync it **inside the same `$transaction`** as the write that changes the truth.

## 4. Indexing

Add `@@index` for every **hot path**: filter columns, foreign keys, and sort keys
(this project hit sequential scans without them). Composite indexes ordered
most-selective-first. Don't over-index write-heavy tables.

## 5. Transactions

Wrap multi-row invariants (stock decrement + cost-layer consume + ledger row) in
`prisma.$transaction`. Keep **network/IO out of transactions** — fetch/re-host images,
call external APIs, etc. *before* opening the transaction (long-held tx = lock pain).

## 6. Migration workflow (project-specific — get this right)

1. Create with `pnpm --filter api migrate:dev` (local native Postgres on :5432).
   **Never edit an already-applied migration.**
2. Prove correctness: `pnpm --filter api exec prisma migrate status` → **"up to date"
   (no drift)** — this confirms the migration matches `schema.prisma`. A hand-written
   migration is only acceptable if `migrate status` is clean.
3. **Data-safety:** widening (e.g. `Int → Decimal`) is lossless on populated tables.
   Narrowing, `NOT NULL` on existing rows, or unique on dup data needs a **backfill
   step** in the migration — plan it.
4. After any schema change: `pnpm --filter api db:generate` (Prisma client), then
   **restart the local API** (it rewrites `apps/api/src/schema.gql` on boot) and run
   `pnpm codegen` so the web types update. Note: jest/ts-node boots strip the SDL
   comments — `git checkout apps/api/src/schema.gql` after tests, regenerate via a
   `node dist/main` boot.
5. **Seeded catalog data** (categories, makes…): adding a new entry must be picked up
   by `CatalogBootstrap` on boot via **create-if-missing**, not "seed only when empty"
   — otherwise an existing **production** DB never gets it (real bug we hit with oils).
6. Prod applies migrations via `prisma migrate deploy` on Railway container start.

## 7. Postgres schema placement — default to `public`

- **All tables live in the default `public` namespace** — correct for this single-role,
  single-`DATABASE_URL` app. **Do not** split into a `private` (or other) PG schema.
  Postgres schemas are namespaces, **not** a security boundary unless you also create
  separate DB roles + `GRANT`s — which this app doesn't.
- **"Private" data** (cost, margin, bin location, thresholds) is an **application-layer**
  boundary — enforced by `stripPrivate()` + RBAC guards, never by a DB schema. Keep it
  there.
- Multiple PG schemas (Prisma `multiSchema`, **preview** in v5 — adds `@@schema` on every
  model + migration friction) are only justified for: a third-party tool that owns its
  schema (PostGIS, an auth extension), or true privilege isolation via separate roles.
  We have none of those.
- Tenant isolation is **row-level `shopId` scoping**, not schema-per-tenant — right for
  this scale.

## 8. Verify

- `migrate status` clean + full API suite green.
- For accounting/integrity changes, **add a test that proves the invariant**
  (e.g. a fractional-litre FIFO sale decrements stock + cost layer correctly).
- Significant model changes get a `docs/decisions/NNN-*.md` (per `plan-to-docs`), and
  the completion writeup per `document-work`.

## Output

State the decision and **why** (the trade-off), not just the schema. If a choice could
reasonably go two ways (e.g. JSON column vs join table, cache vs compute), name both and
recommend one — don't pick silently.
