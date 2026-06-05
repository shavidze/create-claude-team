---
name: pre-flight
description: Pre-coding discipline checklist before any non-trivial implementation work. TRIGGER when about to implement a feature, write >30 lines, add a new file, refactor, or introduce abstractions. Forces explicit assumptions, simplicity test, surgical scope, and verifiable success criteria.
---

# Pre-flight checklist

You're about to write or change code. Before you start, walk through this checklist **out loud** in the chat. Do NOT skip steps.

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
- **No-abstraction check:** Am I adding a class, interface, helper, or config knob that's only used in one place *today*? If yes — inline it.
- **Cut list:** What did I almost add that isn't required? (state it, then leave it out)

## 3. Surgical scope

For every file you plan to touch, name *why this request requires this file*. If you can't articulate it in one line, you're scope-creeping — drop it.

Banned drive-bys: reformatting, renaming unrelated variables, deleting "dead" code, "while I'm here" refactors. Match existing style.

## 4. Success criteria (define BEFORE coding)

- **Backend:** which test filter passes? Which request returns what status/body?
- **Frontend:** which page renders without error? Which user action produces which result?
- **Migration/schema:** what does the generated SQL look like?

If you can't name the verification command **before** coding, stop and define it.

## 5. Verify (after)

Once code is written:
1. Run the verification command from §4. "It compiles" ≠ "it works".
2. `git status` — only intended files are staged.
3. `git log --oneline -1` — confirm the commit hash exists.

## Output back to the user

Post this before writing any code:

> **Pre-flight gate:**
> - Assumptions: …
> - Smallest version: … (~N lines)
> - Files to touch: … (why each one)
> - Success: passes `<command>` returning `<expected>`

Then proceed. If any gate raised a question, ask before continuing.
