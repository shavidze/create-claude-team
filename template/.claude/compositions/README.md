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

## In this template

- `new-feature.md` — end-to-end vertical slice for a non-trivial feature.

Add your own as patterns repeat in your project (e.g. `new-integration.md`,
`new-migration.md`).
