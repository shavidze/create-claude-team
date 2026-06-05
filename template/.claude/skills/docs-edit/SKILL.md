---
name: docs-edit
description: Conventions and discipline for editing markdown documentation — architecture specs, design docs, READMEs, runbooks. Use directly from the main chat instead of dispatching a docs agent (saves ~15× tokens).
---

# Docs-edit discipline

You are editing project documentation. Apply these rules:

## Before editing

1. Read the full file first — understand its current structure and voice.
2. Identify the specific section(s) that need changing. Don't rewrite the whole doc for a small update.
3. Confirm the edit is consistent with CLAUDE.md and other docs (no contradictions).

## While editing

- Match the existing markdown style: heading levels, code block language tags, table alignment.
- Keep sentences declarative and present-tense ("The API returns..." not "The API will return...").
- No passive voice where active is possible.
- No placeholder phrases: "TBD", "TODO", "coming soon" — either write the content or delete the section.
- Dates in docs: use absolute dates (YYYY-MM-DD), not relative ones ("next week", "soon").

## What to never do

- Don't add new sections "just in case" — docs bloat fast.
- Don't preserve outdated information "for history" — that's what git is for. Delete stale content.
- Don't convert lists to prose or prose to lists without a clear reason.

## After editing

- Re-read the edited section in context. Does it flow? Is it consistent with surrounding paragraphs?
- Check any code blocks: are they still accurate?
- Verify all internal links still resolve.

## Output

Make the edit directly (with Edit tool). No need to narrate what you're doing — the diff is self-documenting. If the change is substantial (>20 lines), briefly state what changed and why in chat.
