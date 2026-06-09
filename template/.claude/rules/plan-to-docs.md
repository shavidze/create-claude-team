# Rule: persist approved plans to docs

**Trigger:** the Tech Lead approves a plan (e.g. on exiting plan mode), and the
change is significant — a new feature, a migration, an auth/data-model change, or
anything touching more than a couple of files.

Before starting implementation, save the approved plan so the decision is durable
and reviewable.

## Steps

1. Write the plan to `docs/decisions/NNN-short-description.md`
   (create `docs/decisions/` if missing). Number sequentially from existing files.
2. Include these sections:
   - **Status:** Approved → In Progress → Completed (update as you go)
   - **Date:** absolute date (YYYY-MM-DD)
   - **Context:** why this change is needed
   - **Approach:** what will be done, and the main alternative considered
   - **Key files:** files to create / modify / delete
   - **Verification:** the exact command(s) that prove it works
3. Set status to **In Progress** when you start, **Completed** when verified.

## Exceptions — no doc needed

Typo / formatting / comment-only changes, dependency patch bumps, config-only
tweaks. Don't ceremony-tax small work.

## Don't ask, just do it

When the trigger is met, create the doc automatically before coding. Don't ask
"would you like a decision record?" — the answer is yes for significant changes.
