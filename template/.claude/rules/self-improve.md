# Rule: improve the config when a mistake repeats

**Trigger:** the Tech Lead corrects the same class of mistake a second time — wrong
pattern, a convention you didn't know, an output style they keep fixing.

A correction that lives only in chat is forgotten next session. Encode it so it
compounds.

## The feedback loop

1. **Observe** — what exactly was wrong?
2. **Diagnose** — why? Missing rule? Unstated convention? An agent prompt gap?
3. **Fix the source**, not just this instance:
   - One-off convention → add a line (with a ✅/❌ example) to the relevant rule,
     skill, or agent file.
   - New recurring pattern → create a small skill in `.claude/skills/`.
   - Wrong behavior from an agent → tighten that agent's `## Constraints`.
4. **Confirm** — state in chat what you changed and where, so the Tech Lead can
   veto it.

## Why this matters

This is the compounding mechanism of the whole setup: every correction makes the
next session sharper. Ten fixes over a month ≈ an assistant that already knows
your codebase's quirks. Skipping this step means relearning the same lesson forever.

## Keep it honest

- Don't invent rules from a single stylistic preference — wait for a real repeat.
- Prefer editing an existing file over adding a new one. Config bloat is its own
  failure mode.
- Never silently rewrite a convention the Tech Lead set. Propose, then apply.
