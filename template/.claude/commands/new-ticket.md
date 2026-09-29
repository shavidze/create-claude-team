# /new-ticket

Draft the next DT-NNN ticket and save it to `docs/tickets/`.

**Usage:** `/new-ticket "description of the ask"`

**Instructions for Claude:**

1. Read the current `CLAUDE.md` to understand project context and the current sprint.
2. **Determine the next ticket number automatically:** scan `docs/tickets/` for the
   highest existing `DT-NNN` and add 1. (Create `docs/tickets/` if it doesn't exist.)
   Don't ask the Tech Lead — the folder is the source of truth.
3. Draft a ticket in the format below, starting at `Status: Todo`.
4. **Write the file** to `docs/tickets/DT-NNN-short-slug.md` (kebab-case slug from the
   title). Report the path. Do NOT only paste it in chat.

---

# DT-NNN: [Imperative title — what we're building/fixing]

**Status:** Todo
**Type:** `feat` | `fix` | `refactor` | `test` | `chore`
**Owner:** `backend-engineer` | `frontend-engineer` | `qa-tester` | `tech-lead`
**Estimate:** X engineer-hour(s)

## Problem
[One sentence: what pain does this solve?]

## Acceptance criteria
- [ ] [Testable condition 1]
- [ ] [Testable condition 2]
- [ ] [Testable condition 3]

## Out of scope
- [What we're explicitly not doing]

## Technical notes
[Brief notes for the implementing engineer — relevant files, patterns to follow, gotchas. Keep under 5 lines.]

## Definition of done
- [ ] Code merged to main
- [ ] Tests passing (relevant test suite green)
- [ ] Reviewed by Tech Lead

---

Keep the ticket under 200 words. If the ask is too large for one engineer-day, split into multiple tickets.

## Keeping status current

`**Status:**` drives the board. Update it as work moves: `Todo` → `In Progress` →
`Done` (or `Blocked`, with a reason in the body). When a ticket reaches `Done`, tick
its acceptance-criteria boxes (`[x]`) so the file reflects what shipped. See
[`docs/tickets/README.md`](../../docs/tickets/README.md) for the lifecycle.
