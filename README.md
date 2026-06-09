# create-claude-team

Claude Code AI team config — ერთი ბრძანებით ნებისმიერ პროექტში.

## გამოყენება

### ვარიანტი A — npm-დან (გამოქვეყნების შემდეგ)
```bash
cd your-project
npx create-claude-team
```

### ვარიანტი B — ლოკალურად (გამოქვეყნებამდე)
```bash
cd your-project
node C:\path\to\claude-team-template\bin\create.mjs
```

---

CLI დასვამს 7 კითხვას (~2 წუთი), შემდეგ:
- დააკოპირებს `.claude/` agents, hooks, skills, commands
- შეავსებს `CLAUDE.md`-ს შენი stack-ის და project name-ის მიხედვით
- pre-push hook-ს მოარგებს build command-ებს
- `.gitignore`-ს დაუმატებს `CLAUDE.md` და `.claude/` — **repo-ში არ შეიტანება**

---

## npm-ზე ატვირთვა

```bash
cd claude-team-template
npm login
npm publish
```

შემდეგ ნებისმიერ კომპიუტერზე:
```bash
npx create-claude-team
```

---

## სტრუქტურა

```
template/
├── CLAUDE.md                    # main project instructions
└── .claude/
    ├── settings.json            # permissions + hooks config
    ├── agents/
    │   ├── architect.md
    │   ├── backend-engineer.md
    │   ├── frontend-engineer.md
    │   ├── designer.md
    │   ├── qa-tester.md
    │   ├── product-manager.md
    │   ├── code-reviewer.md
    │   ├── security-reviewer.md
    │   └── release-manager.md
    ├── skills/
    │   ├── pre-flight/          # coding pre-checklist
    │   ├── docs-edit/           # doc editing conventions
    │   └── setup-team/          # interactive wizard (for Claude)
    ├── rules/                   # auto-apply behavioral triggers
    │   ├── read-context.md      # read before coding
    │   ├── plan-to-docs.md      # persist approved plans
    │   └── self-improve.md      # compounding feedback loop
    ├── compositions/            # multi-role workflows
    │   └── new-feature.md       # full vertical slice
    ├── hooks/
    │   ├── pre-push-verify.mjs  # gates git push on build
    │   └── check-uncommitted.mjs
    └── commands/
        ├── new-ticket.md        # /new-ticket slash command
        └── check.md             # /check — build + verify
```
