# Compositions — multi-step workflows

A composition is a recipe that chains agents and skills into a repeatable
workflow. Reach for one when a task spans several roles — e.g. a feature that
needs a spec, a design, backend, frontend, and tests.

| Layer | Scope |
|-------|-------|
| **Skill** | One discipline (a checklist, a convention set) |
| **Agent** | One role (backend-engineer, designer) |
| **Composition** | One workflow that orchestrates several agents in order |

## When to use a composition

- The work is a full vertical slice (spec → design → build → test → review).
- You want the same sequence followed every time, with the same gates.

## When NOT to

Most coding is a single tightly-coupled change. Do it directly or with one
specialist agent. Compositions are for genuinely multi-role work — they cost more
tokens, so the coordination has to earn its keep.

## Critical sequencing rule for this stack

Any feature that changes the GraphQL schema **must** follow this order:

```
architect (schema contract) → backend-engineer (NestJS + Prisma) → codegen → frontend-engineer (Apollo hooks)
```

Frontend cannot start until codegen has run against the new schema. Starting
in parallel will produce type mismatches that waste a full rework cycle.

## In this project

- `new-feature.md` — end-to-end vertical slice for a non-trivial feature.
  Includes the codegen gate between backend and frontend.

Add your own as patterns repeat (e.g. `new-migration.md` for schema-only changes,
`new-integration.md` for third-party service wiring).
