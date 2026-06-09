# Composition: new feature (vertical slice)

Use for a non-trivial feature that crosses spec, design, backend, frontend, and
tests. For a single-layer change, skip this and use one specialist agent directly.

Claude (Engineering Manager) drives this — dispatch each step, **verify its output
before moving on**, and stop early if a gate fails.

## Steps

1. **Scope** — `product-manager`
   Produce a short PRD: problem, user stories, acceptance criteria, out-of-scope,
   `[TICKET_PREFIX]-NNN` ticket breakdown. → Tech Lead approves before continuing.

2. **Persist the plan** — apply rule `rules/plan-to-docs.md`
   Save the approved approach to `docs/decisions/NNN-*.md` before any code.

3. **Design** (only if there's UI) — `architect` for data/API contracts,
   `designer` for screens, states, and copy. Resolve the API contract between
   frontend and backend here, not mid-implementation.

4. **Build backend** — `backend-engineer`
   Implements per the spec. Pre-flight gate first. Ends green on `/check`.

5. **Build frontend** (if any) — `frontend-engineer`
   Implements against the agreed contract. Ends green on `/check`.

6. **Test** — `qa-tester`
   Integration tests for new paths + at least one happy-path and one error-path
   per endpoint. Tests must run green, not just compile.

7. **Review** — `code-reviewer` (always), then `security-reviewer` if the change
   touches auth, payments, PII, or external input.

8. **Verify and report** — run `/check` yourself. Confirm the commit(s) exist
   (`git log --oneline`). Report files touched, what passed, and open questions.

## Gates (do not skip)

- [ ] PRD approved before code
- [ ] Plan saved to `docs/decisions/`
- [ ] API contract agreed before frontend + backend diverge
- [ ] `/check` green after backend, after frontend, after tests
- [ ] Reviewer verdict is APPROVE (or fixes applied) before reporting done
