#!/usr/bin/env node
// Stop hook. Warns at session end if there are uncommitted changes.
// Informational only — does not block.

import { execSync } from 'node:child_process';

try {
  const status = execSync('git status --porcelain').toString().trim();
  if (status) {
    process.stderr.write(
      '\n⚠️  Uncommitted changes detected. Did you mean to commit before ending the session?\n' +
      'Run `git status` to review.\n\n'
    );
  }
} catch {
  // Not a git repo or git not available — ignore
}

process.exit(0);
