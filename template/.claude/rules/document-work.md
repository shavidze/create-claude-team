# Rule: document every completed task

**Trigger:** after finishing ANY task that changed code — a bug fix, a feature, a
refactor, a config change — and BEFORE telling the user it's done.

Every change leaves a durable, detailed record in `docs/`. Two destinations:

## Features / significant changes → `docs/decisions/NNN-*.md`

The up-front plan is written per [`plan-to-docs.md`](plan-to-docs.md). When the work
is verified, update that **same** doc:

- Set **Status: Completed** (with date).
- Record what was **actually done** — including any deviations from the plan.
- List the **key files** changed.
- Give the **exact verification**: commands run + results (test counts, build status).
- Note the **commit hash(es)** and where it deployed (develop / main / prod URL).

## Bug fixes / small tasks → `docs/CHANGELOG.md`

A decision doc is too heavy for a one-off fix. Instead, add a dated entry at the TOP
of `docs/CHANGELOG.md` (create it if missing):

```
## YYYY-MM-DD — <short title>
- **Type:** fix | chore | perf | style | docs
- **Asked / what was wrong:** …
- **What was done:** … (files touched)
- **Verification:** … (command + result)
- **Commit:** <hash>
```

## Always

- Write it **in detail** — enough that a future session understands what changed and
  why **without** reading the diff.
- Do this **before** reporting the task complete.
- **Don't ask** whether to document — just do it.

## Exceptions

Typo / pure-formatting changes, or work the user explicitly says not to record.
