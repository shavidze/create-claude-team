# /new-ticket

Draft the next PROJ-NNN ticket from a standard template.

**Usage:** `/new-ticket "description of the ask"`

**Instructions for Claude:**

1. Read the current `CLAUDE.md` to understand project context and the current sprint.
2. Ask the Tech Lead for the next ticket number if not obvious from context.
3. Draft a ticket in this format:

---

## PROJ-NNN: [Imperative title — what we're building/fixing]

**Type:** `feat` | `fix` | `refactor` | `test` | `chore`
**Owner:** `backend-engineer` | `frontend-engineer` | `qa-tester` | `tech-lead`
**Estimate:** X engineer-hour(s)

### Problem
[One sentence: what pain does this solve?]

### Acceptance criteria
- [ ] [Testable condition 1]
- [ ] [Testable condition 2]
- [ ] [Testable condition 3]

### Out of scope
- [What we're explicitly not doing]

### Technical notes
[Brief notes for the implementing engineer — relevant files, patterns to follow, gotchas. Keep under 5 lines.]

### Definition of done
- [ ] Code merged to main
- [ ] Tests passing (relevant test suite green)
- [ ] Reviewed by Tech Lead

---

Keep the ticket under 200 words. If the ask is too large for one engineer-day, split into multiple tickets.
