#!/usr/bin/env node

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { cpSync, existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const templateDir = join(__dir, '..', 'template');
const target = process.cwd();

const rl = createInterface({ input, output });
const ask = (q) => rl.question(q);

// ── helpers ──────────────────────────────────────────────────────────────────

function menu(title, options) {
  console.log(`\n${title}`);
  options.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));
}

async function pickOne(title, options) {
  menu(title, options);
  while (true) {
    const raw = await ask(`Choice [1-${options.length}]: `);
    const n = parseInt(raw.trim());
    if (n >= 1 && n <= options.length) return n - 1;
    console.log(`  Please enter a number between 1 and ${options.length}`);
  }
}

function replaceAll(str, map) {
  for (const [k, v] of Object.entries(map)) {
    str = str.replaceAll(k, v);
  }
  return str;
}

function patchFile(path, map) {
  if (!existsSync(path)) return;
  const original = readFileSync(path, 'utf8');
  const patched = replaceAll(original, map);
  if (patched !== original) writeFileSync(path, patched, 'utf8');
}

// ── intro ─────────────────────────────────────────────────────────────────────

console.log('\n Claude Code — Team Setup\n');
console.log('This will copy a Claude AI team config into the current directory.');
console.log(`Target: ${target}\n`);

// ── questions ─────────────────────────────────────────────────────────────────

const projectName = (await ask('Project name: ')).trim() || 'MyProject';

const ticketPrefix = ((await ask('Ticket prefix (e.g. PROJ, CRM, APP) [PROJ]: ')).trim() || 'PROJ').toUpperCase();

const backendIdx = await pickOne('Backend stack:', [
  '.NET 10 + C# + EF Core + MSSQL',
  'Node.js + TypeScript + PostgreSQL',
  'Python + FastAPI + PostgreSQL',
  'Go + PostgreSQL',
  'Other (customize later in CLAUDE.md)',
]);

const frontendIdx = await pickOne('Frontend stack:', [
  'Next.js + React + TypeScript + Tailwind',
  'React (Vite) + TypeScript + Tailwind',
  'Vue 3 + TypeScript + Tailwind',
  'No frontend (API only)',
  'Other (customize later)',
]);

const multiTenant = (await ask('\nMulti-tenant app? (y/n) [n]: ')).trim().toLowerCase() === 'y';

const bilingual = (await ask('Bilingual UI? (y/n) [n]: ')).trim().toLowerCase() === 'y';

const stakeholder = (await ask('Business stakeholder name (first name) [Stakeholder]: ')).trim() || 'Stakeholder';

rl.close();

// ── derive stack strings ──────────────────────────────────────────────────────

const backendLabels = [
  '.NET 10 + C# + EF Core 9 + MSSQL',
  'Node.js 20 + TypeScript + Express + Prisma + PostgreSQL',
  'Python 3.12 + FastAPI + SQLAlchemy + PostgreSQL',
  'Go 1.22 + PostgreSQL',
  '[your backend stack — edit CLAUDE.md]',
];

const frontendLabels = [
  'Next.js 14 + React 18 + TypeScript + Tailwind CSS (App Router)',
  'React 18 + Vite + TypeScript + Tailwind CSS',
  'Vue 3 + Vite + TypeScript + Tailwind CSS',
  'No frontend',
  '[your frontend stack — edit CLAUDE.md]',
];

const backendBuildCmds = [
  'dotnet build apps/api/[PROJECT].slnx --nologo --verbosity quiet',
  'pnpm --filter api typecheck && pnpm --filter api build',
  'ruff check . && python -m pytest',
  'go build ./... && go vet ./...',
  '[your build command — edit pre-push-verify.mjs]',
];

// ── substitution map ──────────────────────────────────────────────────────────

const subs = {
  '[PROJECT_NAME]': projectName,
  '[TICKET_PREFIX]': ticketPrefix,
  'PROJ-NNN': `${ticketPrefix}-NNN`,
  'PROJ-': `${ticketPrefix}-`,
  '[stakeholder name]': stakeholder,
  '[TECH_STACK]': `${backendLabels[backendIdx]} / ${frontendLabels[frontendIdx]}`,
  '[your backend stack — edit CLAUDE.md]': backendLabels[backendIdx],
  '[your frontend stack — edit CLAUDE.md]': frontendLabels[frontendIdx],
};

// ── copy template ─────────────────────────────────────────────────────────────

console.log('\nCopying files...');
cpSync(templateDir, target, { recursive: true, force: true });

// ── patch CLAUDE.md ───────────────────────────────────────────────────────────

const claudeMdPath = join(target, 'CLAUDE.md');
patchFile(claudeMdPath, subs);

// Inject multi-tenant note
if (multiTenant) {
  let content = readFileSync(claudeMdPath, 'utf8');
  content = content.replace(
    '## Banned patterns',
    '## Multi-tenancy\n\nEvery entity holding user data is scoped to a tenant. Never query across tenant boundaries. Add a `TenantId` (or equivalent) to all data models and always filter by it.\n\n## Banned patterns'
  );
  writeFileSync(claudeMdPath, content, 'utf8');
}

// Inject bilingual note
if (bilingual) {
  let content = readFileSync(claudeMdPath, 'utf8');
  content = content.replace(
    '## Banned patterns',
    '## i18n\n\nAll UI strings go through the i18n system. No hardcoded text in components. Add keys to both language files simultaneously.\n\n## Banned patterns'
  );
  writeFileSync(claudeMdPath, content, 'utf8');
}

// ── patch agent files ─────────────────────────────────────────────────────────

const agentsDir = join(target, '.claude', 'agents');
for (const file of ['backend-engineer.md', 'frontend-engineer.md', 'qa-tester.md',
                     'architect.md', 'product-manager.md', 'designer.md',
                     'code-reviewer.md', 'security-reviewer.md', 'release-manager.md']) {
  patchFile(join(agentsDir, file), subs);
}

// ── patch backend-engineer stack section ──────────────────────────────────────

const bePath = join(agentsDir, 'backend-engineer.md');
if (existsSync(bePath)) {
  let content = readFileSync(bePath, 'utf8');

  const stackDetails = {
    0: `## Stack\n\n.NET 10, C# (LangVersion=preview, Nullable enable), EF Core 9, MSSQL.\nBuild: \`dotnet build apps/api/${projectName}.slnx --nologo --verbosity quiet\`\nMigrations: \`dotnet ef migrations add <Name>\`\n\n**Conventions:** \`DateTime.UtcNow\` only. Records for all DTOs. \`async/await\` everywhere — no \`.Result\`, no \`.Wait()\`.${multiTenant ? '\nEvery entity holding user data must be tenant-scoped (TenantId field + composite index).' : ''}`,
    1: `## Stack\n\nNode.js 20 + TypeScript strict + Express/Fastify + Prisma + PostgreSQL.\nBuild: \`pnpm --filter api typecheck\`\nMigrations: \`pnpm --filter api db:migrate\`\n\n**Conventions:** \`async/await\` everywhere. No \`any\` types. Zod schemas for all request validation.`,
    2: `## Stack\n\nPython 3.12 + FastAPI + SQLAlchemy + Alembic + PostgreSQL.\nBuild: \`ruff check . && python -m pytest\`\nMigrations: \`alembic upgrade head\`\n\n**Conventions:** Type hints everywhere. Pydantic models for request/response. No raw SQL — SQLAlchemy ORM only.`,
    3: `## Stack\n\nGo 1.22 + Chi/Gin + SQLC + PostgreSQL.\nBuild: \`go build ./... && go vet ./...\`\nMigrations: \`goose up\`\n\n**Conventions:** Return errors, don't panic. Context propagation on all DB calls. SQLC for queries — no raw string SQL.`,
    4: `## Stack\n\n[REPLACE: describe your backend stack, build command, migration command, and key conventions.]`,
  };

  content = content.replace(/## Stack[\s\S]*?(?=## Responsibilities)/, stackDetails[backendIdx] + '\n\n');
  writeFileSync(bePath, content, 'utf8');
}

// ── patch pre-push hook ───────────────────────────────────────────────────────

const hookPath = join(target, '.claude', 'hooks', 'pre-push-verify.mjs');
if (existsSync(hookPath)) {
  let content = readFileSync(hookPath, 'utf8');

  const hookChecks = {
    0: `  {\n    label: 'dotnet build',\n    exe: 'dotnet',\n    args: ['build', 'apps/api/${projectName}.slnx', '--nologo', '--verbosity', 'quiet'],\n    when: files => files.some(f => f.startsWith('apps/api/')),\n  },`,
    1: `  {\n    label: 'pnpm typecheck',\n    exe: 'pnpm',\n    args: ['--filter', 'api', 'typecheck'],\n    when: files => files.some(f => f.startsWith('apps/api/')),\n  },\n  {\n    label: 'pnpm typecheck web',\n    exe: 'pnpm',\n    args: ['--filter', 'web', 'typecheck'],\n    when: files => files.some(f => f.startsWith('apps/web/')),\n  },\n  {\n    label: 'pnpm lint web',\n    exe: 'pnpm',\n    args: ['--filter', 'web', 'lint'],\n    when: files => files.some(f => f.startsWith('apps/web/')),\n  },`,
    2: `  {\n    label: 'ruff check',\n    exe: 'ruff',\n    args: ['check', '.'],\n    when: files => files.some(f => f.endsWith('.py')),\n  },`,
    3: `  {\n    label: 'go build',\n    exe: 'go',\n    args: ['build', './...'],\n    when: files => files.some(f => f.endsWith('.go')),\n  },`,
    4: `  // TODO: add your build check here`,
  };

  content = content.replace(
    /\/\/ ─── CUSTOMIZE[\s\S]*?\/\/ ──────[\s\S]*?;/,
    `// ─── AUTO-CONFIGURED FOR ${backendLabels[backendIdx]} ───\nconst checks = [\n${hookChecks[backendIdx]}\n];`
  );
  writeFileSync(hookPath, content, 'utf8');
}

// ── patch settings.json ───────────────────────────────────────────────────────

const settingsPath = join(target, '.claude', 'settings.json');
if (existsSync(settingsPath)) {
  const dotnetAllows = [
    'Bash(dotnet build*)', 'Bash(dotnet test*)', 'Bash(dotnet ef *)',
    'Bash(dotnet run *)', 'Bash(dotnet watch *)', 'Bash(dotnet restore*)', 'Bash(dotnet format*)',
    'Bash(sqllocaldb *)',
  ];
  const nodeAllows = [
    'Bash(pnpm install)', 'Bash(pnpm dev)', 'Bash(pnpm build)', 'Bash(pnpm lint)',
    'Bash(pnpm test)', 'Bash(pnpm typecheck)', 'Bash(pnpm --filter *)',
    'Bash(pnpm db:*)', 'Bash(pnpm api:*)', 'Bash(npx --yes *)',
  ];
  const pythonAllows = [
    'Bash(python *)', 'Bash(pip install*)', 'Bash(pytest*)',
    'Bash(ruff *)', 'Bash(alembic *)', 'Bash(uvicorn *)',
  ];
  const goAllows = [
    'Bash(go build*)', 'Bash(go test*)', 'Bash(go vet*)',
    'Bash(go run *)', 'Bash(goose *)',
  ];

  const extraAllows = [dotnetAllows, nodeAllows, pythonAllows, goAllows, []][backendIdx];

  const settings = JSON.parse(readFileSync(settingsPath, 'utf8'));
  settings.permissions.allow = [...extraAllows, ...settings.permissions.allow];
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
}

// ── .gitignore ────────────────────────────────────────────────────────────────

const gitignorePath = join(target, '.gitignore');
const gitignoreEntry = '\n# Claude Code local team config - not committed\nCLAUDE.md\n.claude/\n';

if (existsSync(gitignorePath)) {
  const existing = readFileSync(gitignorePath, 'utf8');
  if (!existing.includes('.claude/')) {
    appendFileSync(gitignorePath, gitignoreEntry);
  }
} else {
  writeFileSync(gitignorePath, gitignoreEntry.trimStart());
}

// ── done ──────────────────────────────────────────────────────────────────────

console.log(`
Setup complete!

  Project : ${projectName}
  Tickets : ${ticketPrefix}-NNN
  Backend : ${backendLabels[backendIdx]}
  Frontend: ${frontendLabels[frontendIdx]}
  .gitignore updated (CLAUDE.md and .claude/ are local-only)

Next step:
  Open Claude Code in this directory and run:

    /setup-team

  Claude will fine-tune any remaining details interactively.
`);
