# /check — build + verify

Run the project's build and tests, then fix anything that's broken. Use this
before every commit, and after any change an agent reports as "done".

**Usage:** `/check`

## Instructions for Claude

1. Run the build command:
   ```bash
   [BUILD_COMMAND]
   ```
2. Run the test command (skip if the project has no tests yet):
   ```bash
   [TEST_COMMAND]
   ```
3. If either fails:
   - Read the full output — find the first real error, not the last line.
   - Fix the cause (compile error, type error, failing assertion, missing dep).
   - Re-run from step 1. Repeat until both are green.
4. Report the result plainly: what ran, pass/fail counts, what you fixed.

## Rules

- "It compiles" is not "it passes" — run the tests too, don't assume.
- Never make a test pass by weakening its assertion or marking it skipped.
  Fix the code, or report the test as a real bug.
- Do not commit while `/check` is red.
