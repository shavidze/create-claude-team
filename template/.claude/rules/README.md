# Rules — always-on behavioral triggers

Rules are **not** skills and **not** agents. They are standing instructions that
apply automatically, with no invocation, whenever their trigger condition is met.

| Layer | How it activates | Example |
|-------|-----------------|---------|
| **Rule** | Auto — fires on a condition (before coding, before commit, on a phrase) | `read-context.md` |
| **Skill** (`.claude/skills/`) | Claude invokes it (`Skill: pre-flight`) | `pre-flight` |
| **Command** (`.claude/commands/`) | Tech Lead types `/name` | `/check` |
| **Agent** (`.claude/agents/`) | Dispatched for a role | `backend-engineer` |

## How rules get enforced

Rules only work if they are referenced from `CLAUDE.md`. The "Rules (auto-apply)"
section in `CLAUDE.md` lists each rule and its trigger. Claude reads `CLAUDE.md`
at the start of every session, so the rules are always in context.

When you add a new rule file here, add one line to that section in `CLAUDE.md`.

## Rules in this template

| Rule | Trigger | What it enforces |
|------|---------|------------------|
| `read-context.md` | Before writing/editing any code | Read `CLAUDE.md` + relevant sub-context, scan existing patterns first |
| `plan-to-docs.md` | After an approved plan, before implementing | Persist the complete plan to `docs/decisions/` |
| `document-work.md` | After finishing any task (bug or feature) | Record what was done: features → decision doc; bugs/small → `docs/CHANGELOG.md` |
| `verify-before-done.md` | Before reporting any task complete | Map every read/display surface + caches + edge cases, test each, run for real |
| `self-improve.md` | After Claude repeats a mistake | Encode the fix as a new rule/skill so it never recurs |

Keep this set small. A rule the team ignores is worse than no rule — it trains
everyone to skim past `CLAUDE.md`.
