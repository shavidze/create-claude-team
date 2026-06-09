# Rule: read context before writing code

**Trigger:** before writing or editing ANY code — including "small fixes".

Before the first edit in a task, you MUST:

1. **Re-read the relevant part of `CLAUDE.md`** for the kind of change (stack
   conventions, banned patterns, commit format).
2. **Read the nearest sub-context** if one exists — an `apps/*/CLAUDE.md`,
   `docs/architecture.md`, or `docs/design-system.md` covering the area you touch.
3. **Scan existing source for the canonical pattern.** Find 1–2 files that already
   do something similar and match their structure, naming, and error handling.
   Do not invent a new pattern when one exists.

## After writing code (self-check before `/check`)

- **Edge cases:** null, empty, boundary values, concurrent access.
- **Security:** input validation, auth on protected paths, no string-built SQL,
  no secrets in code or logs.
- **Convention compliance:** does it match `CLAUDE.md` and the patterns you scanned?
- Run `/check` (or the build/test command) before committing.

## No exceptions

"It's a one-line fix" is not a reason to skip this. The cost of reading context is
seconds; the cost of an off-pattern change is a review round-trip.
