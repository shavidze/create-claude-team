#!/usr/bin/env node
// PreToolUse hook (matcher: Bash). Gates `git push` on build + lint/typecheck.
// Exit 2 blocks the push. Customize the `checks` array for your project.

import { execSync, spawnSync } from 'node:child_process';

let raw = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) raw += chunk;

let payload = {};
try { payload = JSON.parse(raw); } catch { /* not JSON, no-op */ }
const cmd = payload?.tool_input?.command ?? '';

if (!/\bgit\s+push\b/.test(cmd)) process.exit(0);
if (/--dry-run\b/.test(cmd)) process.exit(0);

const root = execSync('git rev-parse --show-toplevel').toString().trim();
process.chdir(root);

try { execSync('git fetch origin main --quiet', { stdio: 'ignore' }); } catch {}

let base;
try { base = execSync('git merge-base HEAD origin/main').toString().trim(); }
catch { base = execSync('git rev-parse HEAD~1').toString().trim(); }

const changed = execSync(`git diff --name-only ${base}..HEAD`)
  .toString().split('\n').map(s => s.trim()).filter(Boolean);

// ─── Monorepo: apps/api (NestJS) + apps/web (Next.js) + apps/mobile (React Native CLI) ───
// Each app needs `typecheck` (and web/mobile a `lint`) script in its package.json.
const checks = [
  {
    label: 'pnpm typecheck',
    exe: 'pnpm',
    args: ['--filter', 'api', 'typecheck'],
    when: files => files.some(f => f.startsWith('apps/api/')),
  },
  {
    label: 'pnpm typecheck web',
    exe: 'pnpm',
    args: ['--filter', 'web', 'typecheck'],
    when: files => files.some(f => f.startsWith('apps/web/')),
  },
  {
    label: 'pnpm lint web',
    exe: 'pnpm',
    args: ['--filter', 'web', 'lint'],
    when: files => files.some(f => f.startsWith('apps/web/')),
  },
  {
    label: 'pnpm typecheck mobile',
    exe: 'pnpm',
    args: ['--filter', 'mobile', 'typecheck'],
    when: files => files.some(f => f.startsWith('apps/mobile/')),
  },
  {
    label: 'pnpm lint mobile',
    exe: 'pnpm',
    args: ['--filter', 'mobile', 'lint'],
    when: files => files.some(f => f.startsWith('apps/mobile/')),
  },
];

function run(label, exe, args) {
  process.stderr.write(`→ pre-push: ${label}\n`);
  const r = spawnSync(exe, args, { encoding: 'utf8', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    failures.push(label);
    process.stderr.write(`❌ ${label} failed\n`);
    const tail = ((r.stdout || '') + (r.stderr || '')).split('\n').slice(-25).join('\n');
    process.stderr.write(tail + '\n');
  }
}

const failures = [];
let ran = false;
for (const check of checks) {
  if (check.when(changed)) {
    run(check.label, check.exe, check.args);
    ran = true;
  }
}

if (failures.length) {
  process.stderr.write(`\nPre-push gate failed: ${failures.join(', ')}. Fix and retry. Do NOT use --no-verify.\n`);
  process.exit(2);
}

if (ran) process.stderr.write('✓ pre-push checks passed\n');
process.exit(0);
