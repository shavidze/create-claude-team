---
name: pre-flight
description: Pre-coding discipline checklist before any non-trivial implementation work. TRIGGER when about to implement a feature, write >30 lines, add a new file, refactor, or introduce abstractions. Forces explicit assumptions, simplicity test, surgical scope, and verifiable success criteria.
---

# Pre-flight checklist

You're about to write or change code. Before you start, walk through this checklist **out loud** in the chat. Do NOT skip steps.

## 0. The feature is a user workflow, not a data model

Before any model/API design, describe the feature as the **real user's workflow** — or
you will ship something technically correct that does the wrong job (see
[[feedback_feature_is_a_workflow]]).

- **Primary entry point:** where does the user actually start? Name the screen they use
  *every day* (e.g. the "Add part" form), not a secondary/power-user flow (e.g. an
  "Inbound batch" page). The feature MUST attach to the primary entry point. If it only
  works through a secondary flow, it's not done.
- **What must they DO:** list the actions the user must be able to perform end-to-end.
- **What must they SEE:** list every figure/list/state the user must be able to read
  back — "where do I see X?" Each one is a required read surface, not optional polish.
- **Scope cuts are decisions, not silences.** If you choose to leave out a user-visible
  capability ("detail page won't show purchases"), you MUST raise it to the Tech Lead as
  an explicit decision. Never bury a capability cut in a doc and call the feature scoped.

Write this back as: *"User opens **X**, does **A/B/C**, and can see **D/E/F**. Cutting
**G** — OK?"* Get it confirmed before designing the schema.

## 1. State assumptions

List the 2–4 things you are assuming about the request:

> Assumptions:
> - The request means X, not Y
> - The existing behavior is …
> - The success path is …

If any assumption could go more than one way, **stop and ask** the Tech Lead. Don't pick silently.

## 2. Simplicity test

Answer in one sentence each:

- **Smallest version:** What's the minimum code that solves the literal ask? (target: <50 lines unless inherently larger)
- **No-abstraction check:** Am I adding a NestJS module, service, resolver, helper, or config knob that's only used in one place *today*? If yes — inline it.
- **Cut list:** What did I almost add that isn't required? (state it, then leave it out)

## 3. Surgical scope

For every file you plan to touch, name *why this request requires this file*. If you can't articulate it in one line, you're scope-creeping — drop it.

Banned drive-bys: reformatting, renaming unrelated variables, deleting "dead" code, "while I'm here" refactors. Match existing style.

**NestJS-specific:** if adding a new resolver or service, name which existing module it registers in — or justify why a new module is needed.

## 4. Success criteria (define BEFORE coding)

Pick the criteria that apply:

- **New resolver / mutation:** which GraphQL operation, with which variables, returns what shape? Name the test that exercises it.
- **Prisma schema change:** what does `pnpm --filter api db:migrate dev --name X` generate? Is the SQL reversible?
- **Frontend component / page:** which URL, which Apollo query, which rendered output? Which next-intl keys must exist in all three language files?
- **GraphQL schema change:** does codegen (`pnpm --filter web codegen`) complete without errors after the change?
- **Auth / guard change:** which request without a token returns `UNAUTHENTICATED`? Which with wrong role returns `FORBIDDEN`?

If you can't name the verification command **before** coding, stop and define it.

## 5. Verify (after)

Once code is written:
1. Run the verification command from §4. "It typechecks" ≠ "it works".
2. If schema changed: `pnpm --filter api db:generate` + `pnpm --filter web codegen`.
3. If i18n keys added: confirm key exists in `en.json`, `ka.json`, and `ru.json`.
4. `git status` — only intended files are staged.
5. `git log --oneline -1` — confirm the commit hash exists.

## Output back to the user

Post this before writing any code:

> **Pre-flight gate:**
> - Assumptions: …
> - Smallest version: … (~N lines)
> - Files to touch: … (why each one)
> - Success: passes `<command>` returning `<expected>`

Then proceed. If any gate raised a question, ask before continuing.
