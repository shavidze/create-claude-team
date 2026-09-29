# Rule: full-surface verification before "done"

**Trigger:** before telling the user ANY coding task is complete (bug or feature).

A change is NOT done when the happy path works — it's done when **every surface the
data touches** is correct and verified AND the feature does the **whole job from the
user's real workflow**. Shipping half-tested *or half-thought-out* functionality is a
failure (see [[feedback_no_half_baked]], [[feedback_feature_is_a_workflow]]). Walk this
before reporting done.

## 0. Walk the primary user workflow (product completeness — do this FIRST)

Before tracing data surfaces, become the user. Open the running app (`run` / `verify`
skills) and walk the **primary** workflow end-to-end — the everyday path, not test data
poked through GraphQL:

- Start at the **primary entry point** the user actually uses (e.g. the "Add part" form,
  not a power-user "Inbound batch" page). Can the user invoke the feature from there?
- Do the full job the way the user would, then **find every answer the user will ask**:
  "where do I see how many / at what price / what I owe?" If an expected read surface
  doesn't exist, the feature is **not done** — a missing surface is the failure mode that
  data-tracing (step 1) cannot catch, because the data never reached it.
- Cross-check against the pre-flight §0 "what they DO / what they SEE" list. Every item
  must be reachable. Any gap is either built now or **raised** as an explicit cut — never
  silent.

## 0b. Prod gate — `main` auto-deploys + mandatory product-verifier

Merging to `main` auto-deploys to production (Railway + Vercel). For any user-facing
feature, do the §0 workflow walk **before merging to main**, not after. Don't let a
conceptually-incomplete feature reach prod and get discovered there.

**Mandatory:** at the end of EVERY user-facing feature, dispatch the **`product-verifier`**
agent (see the dispatch table in `CLAUDE.md`). It independently walks the real user
workflow and returns SHIP / DO-NOT-SHIP. A DO-NOT-SHIP (missing entry point, missing
"what they SEE" surface, or a silent scope cut) blocks the merge until fixed or the cut
is explicitly raised and approved. This is not optional polish — it is the gate that
would have caught DT-034.

## 1. Map the blast radius

For the changed write path / new field/model, list **out loud in chat** every surface
that reads or shows that data:

- **Backend reads:** every aggregate / query / derived figure that sums or computes it —
  dashboard, analytics (gross/net profit, revenue, monthly chart, best-sellers),
  list/connection totals, per-row values, inbound/batch profitability, search, filters.
- **Frontend displays:** every place it appears — lists, per-row cells, totals,
  **detail pages, admin AND public pages**.
- **Caches:** public ISR / fetch `revalidate` — does the change reflect, and after how
  long? Is that acceptable, or does it need on-demand revalidation?
- **Scoping / permissions / edge cases:** zero, partial, fractional, already-applied,
  concurrent, and a missing relation (e.g. no primary warehouse, null fitment).

If you can't list them from memory, **grep the field/model across the repo first** —
don't guess the surface list.

## 2. Test each

- Add an automated test for the core invariant. **Mandatory** for money / stock /
  accounting / counts. Assert the **number**, not just "no error".
- Run the **FULL** suite (`pnpm --filter api test`), not only the new test.
- `pnpm typecheck` + `build` for **both** apps.

## 3. Run it for real

For UI / flows, actually exercise it (the `run` / `verify` skills) or trace the data
through each surface from step 1. Don't assume a surface is fine because the code "looks"
right.

## 4. No silent scope

If you deliberately leave a surface out, **say so** with the reason. Never leave a
silent gap and call it done.

## 5. Report what you verified

Before saying "done", state the **surfaces you checked** + the test/command results.
"Tests pass" is not enough — name the surfaces (e.g. "verified: sales totals, per-sale,
monthly chart, inbound profit, public page (60s cache)").
