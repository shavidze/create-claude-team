# Composition: new feature (vertical slice)

Use for a non-trivial feature that crosses spec, design, backend, frontend, and
tests. For a single-layer change, skip this and use one specialist agent directly.

Claude (Engineering Manager) drives this — dispatch each step, **verify its output
before moving on**, and stop early if a gate fails.

## Steps

1. **Scope** — `product-manager`
   Produce a short PRD: problem, user stories, acceptance criteria, i18n notes,
   out-of-scope, `DT-NNN` ticket breakdown. Flag upfront if the feature requires
   GraphQL schema changes (those need paired backend + frontend codegen tickets).
   → Tech Lead approves before continuing.

2. **Persist the plan** — apply rule `rules/plan-to-docs.md`
   Save the approved approach to `docs/decisions/NNN-*.md` before any code.

3. **Architecture** (if the feature touches the GraphQL schema or Prisma models) — `architect`
   Produce: Prisma schema changes, NestJS module/resolver/service structure,
   GraphQL `@ObjectType()` / `@InputType()` contracts, auth guard requirements.
   Resolve the GraphQL contract between backend and frontend **here**, before
   either side starts coding. Frontend cannot start until the schema shape is agreed.

4. **Design** (only if there's UI) — `designer`
   Produce screen specs with: layout, all states (skeleton / empty / error / success),
   and trilingual copy table (ka / en / ru) with next-intl keys.
   → Tech Lead approves copy before frontend starts.

5. **Build backend** — `backend-engineer`
   Implements per the architect's spec: Prisma migration, NestJS module + resolver +
   service, guards. Pre-flight gate first. Ends green on `pnpm --filter api typecheck`.

6. **Run codegen** — after backend GraphQL schema is merged, run:
   ```bash
   pnpm --filter web codegen
   ```
   Verify generated types in `apps/web/src/gql/` reflect the new schema before
   frontend starts. If codegen fails, stop and fix the schema.

7. **Build frontend** — `frontend-engineer` (web) and/or `mobile-engineer` (mobile)
   Each implements its surface using generated Apollo hooks + i18n keys from the designer's
   copy table. Dispatch whichever surface(s) the feature targets — web, mobile, or both (in
   parallel, since they touch different app dirs). Web ends green on
   `pnpm --filter web typecheck && pnpm --filter web build`; mobile on
   `pnpm --filter mobile typecheck && pnpm --filter mobile lint`.

8. **Test** — `qa-tester`
   - Backend: integration tests for each new resolver (happy path + guard/auth path)
   - Frontend: Playwright e2e for the critical user flow
   Tests must run green, not just compile.

9. **Review** — `code-reviewer` (always), then `security-reviewer` if the change
   touches auth, user data, file uploads, or external input.

10. **Verify and report** — run `/check` yourself. Confirm commits exist
    (`git log --oneline`). Report files touched, what passed, open questions.

## Gates (do not skip)

- [ ] PRD approved by Tech Lead before code
- [ ] Plan saved to `docs/decisions/`
- [ ] GraphQL contract agreed (architect spec) before backend + frontend diverge
- [ ] Codegen run and verified after backend schema changes, before frontend starts
- [ ] Trilingual copy approved before frontend starts
- [ ] `pnpm --filter api typecheck` green after backend
- [ ] `pnpm --filter web typecheck && build` green after frontend
- [ ] Tests green (not just compiling) after qa-tester
- [ ] Reviewer verdict is APPROVE (or fixes applied) before reporting done
