# create-claude-team — პროექტის სრული აღწერა

**თარიღი:** 2026-06-10
**ვერსია:** 1.0.0 · MIT ლიცენზია · Node.js ≥ 18

## რა არის ეს პროექტი

`create-claude-team` არის npm CLI scaffolding ინსტრუმენტი, რომელიც ნებისმიერ
პროექტში ერთი ბრძანებით აყენებს Claude Code-ის სრულ „AI dev team" კონფიგურაციას.
ინსტალაციის შემდეგ პროექტს ემატება 9 სპეციალისტი agent, ავტომატური ქცევითი
წესები (rules), skill-ები, slash command-ები, multi-role workflow-ები
(compositions) და git hook-ები — ყველაფერი მორგებულია მომხმარებლის არჩეულ tech stack-ზე.

ძირითადი იდეა: Claude Code-ის მთავარი სესია მუშაობს **Engineering Manager**-ის
როლში — დავალებებს თარგმნის სპეციფიკაციებად, ანაწილებს სპეციალისტ agent-ებზე და
**ამოწმებს** მათ შედეგს, სანამ ადამიანს (Tech Lead-ს) შეატყობინებს.

## რეპოზიტორიის სტრუქტურა

```
create-claude-team/
├── package.json          # npm პაკეტი, bin: create-claude-team
├── README.md             # მომხმარებლის დოკუმენტაცია (ქართულად)
├── bin/
│   └── create.mjs        # CLI — ინტერაქტიული setup wizard (~280 ხაზი)
└── template/             # სამიზნე პროექტში დასაკოპირებელი ფაილები
    ├── CLAUDE.md         # მთავარი ინსტრუქციების ფაილი (placeholder-ებით)
    └── .claude/
        ├── settings.json # permissions + hooks კონფიგურაცია
        ├── agents/       # 9 სპეციალისტი agent
        ├── rules/        # 3 auto-apply წესი + README
        ├── skills/       # pre-flight, docs-edit, setup-team
        ├── compositions/ # new-feature workflow + README
        ├── commands/     # /check, /new-ticket
        └── hooks/        # pre-push-verify.mjs, check-uncommitted.mjs
```

## როგორ მუშაობს CLI ([bin/create.mjs](../bin/create.mjs))

გაშვება: `npx create-claude-team` (ან ლოკალურად `node bin/create.mjs`)
სამიზნე დირექტორიაში. CLI სვამს 7 კითხვას:

1. **პროექტის სახელი** — CLAUDE.md-ის სათაურებსა და build ბრძანებებში ჯდება.
2. **Ticket prefix** (მაგ. `PROJ`, `CRM`) — commit-ებში იღებს `PREFIX-NNN` სახეს.
3. **Backend stack** — 5 ვარიანტი: .NET 10 + EF Core + MSSQL · Node.js + TS +
   PostgreSQL · Python + FastAPI · Go + PostgreSQL · Other.
4. **Frontend stack** — Next.js · React (Vite) · Vue 3 · API-only · Other.
5. **Multi-tenant?** — დადებითი პასუხის შემთხვევაში CLAUDE.md-ში ემატება
   tenant-იზოლაციის სექცია
   (ყველა entity-ს `TenantId`, tenant-ის საზღვრებს მიღმა query აკრძალულია).
6. **ორენოვანი UI?** — დადებითი პასუხის შემთხვევაში ემატება i18n სექცია
   (hardcoded ტექსტი კომპონენტებში აკრძალულია და key-ები ორივე ენის ფაილში
   ერთდროულად უნდა არსებობდეს).
7. **Stakeholder-ის სახელი** — Roles სექციაში ჯდება.

პასუხების მიხედვით CLI:

- აკოპირებს `template/`-ს სამიზნე დირექტორიაში (`cpSync`, recursive);
- ანაცვლებს placeholder-ებს (`[PROJECT_NAME]`, `[TICKET_PREFIX]`,
  `[TECH_STACK]`, `PROJ-NNN` და სხვ.) CLAUDE.md-სა და 9-ვე agent ფაილში;
- `backend-engineer.md`-ში **მთლიან `## Stack` სექციას** ანაცვლებს არჩეული
  stack-ის კონვენციებით (build/migration ბრძანებები, ენის წესები);
- `pre-push-verify.mjs`-ში `checks` მასივს აკონფიგურირებს stack-ის build
  ბრძანებებზე, შეცვლილი ფაილების path-პრედიკატებით;
- `/check` ბრძანებაში აყენებს კონკრეტულ `[BUILD_COMMAND]`/`[TEST_COMMAND]`-ს
  (მაგ. `dotnet build` + `dotnet test`, ან `go build ./...` + `go test ./...`);
- `settings.json`-ის `allow` სიას უმატებს stack-ისთვის სპეციფიკურ Bash-ის უფლებებს
  (მაგ. `dotnet ef *`, `pnpm --filter *`, `alembic *`, `goose *`);
- `.gitignore`-ს უმატებს `CLAUDE.md`-სა და `.claude/`-ს — კონფიგურაცია
  **ლოკალურია და repo-ში არ ინახება**.

ბოლო ნაბიჯად მომხმარებელს ურჩევს Claude Code-ში `/setup-team`-ის გაშვებას
დარჩენილი დეტალების ინტერაქტიულად დასაზუსტებლად.

## Template-ის შიგთავსი დეტალურად

`.claude/`-ის კომპონენტების სრული გზამკვლევი — agent-ების, skill-ების და
გაფართოების იდეების ჩათვლით — ცალკე დოკუმენტშია:
[claude-config-guide.md](claude-config-guide.md).

### CLAUDE.md — მთავარი ინსტრუქციები

გენერირებული პროექტის ცენტრალური ფაილი. შეიცავს:

- **Project memory** — stack, არქიტექტურა, repo layout, მიმდინარე მდგომარეობა,
  roadmap (შესავსები სექციები);
- **Roles** — Business stakeholder (პროდუქტის გადაწყვეტილებები), Tech Lead
  (ადამიანი — ტექნიკური მიმართულება და merge-ების დამტკიცება), Claude
  (Engineering Manager / PO);
- **ქცევითი პრინციპები** (Karpathy + Anthropic best practices): იფიქრე კოდამდე
  და დაასახელე დაშვებები · მინიმალური კოდი ზედმეტი აბსტრაქციების გარეშე ·
  ქირურგიული ცვლილებები (მხოლოდ ის, რაც მოთხოვნას ეხება) · ვერიფიცირებადი
  წარმატების კრიტერიუმები სამუშაოს დაწყებამდე;
- **Trust-but-verify** — agent-ის მოხსენება არ ნიშნავს შესრულებას: commit-ები
  `git log`-ით მოწმდება, build/ტესტები ხელახლა ეშვება;
- **Agent dispatch ცხრილი**, commit კონვენცია
  (`<type>(<scope>): PREFIX-NNN <desc>`), branch პოლიტიკა (default — პირდაპირ
  `main`-ზე, pre-push hook-ის დაცვით), banned patterns და deploy კონფიგურაცია.

### Agents — 9 სპეციალისტი (`.claude/agents/`)

თითოეული agent არის markdown ფაილი frontmatter-ით (`name`, `description`,
`model: sonnet`, `tools`) და მკაცრად შემოსაზღვრული პასუხისმგებლობით:

| Agent | როლი | წვდომა |
|-------|------|--------|
| `product-manager` | PRD, user stories, ticket breakdown | — |
| `architect` | სისტემური დიზაინი, data model, API კონტრაქტები | — |
| `backend-engineer` | backend იმპლემენტაცია, მიგრაციები | მხოლოდ backend ფაილები |
| `frontend-engineer` | frontend იმპლემენტაცია | მხოლოდ frontend ფაილები |
| `designer` | UI/UX სპეციფიკაციები, design tokens | — |
| `qa-tester` | ინტეგრაციული / e2e ტესტები | — |
| `code-reviewer` | ცვლილების აუდიტი (Critical/Major/Minor/Nit + ვერდიქტი) | read-only |
| `security-reviewer` | release-ამდე უსაფრთხოების შემოწმება (auth, PII, OWASP) | read-only |
| `release-manager` | CHANGELOG, version bump, runbook | — |

ინჟინერ agent-ებს აქვთ სავალდებულო **pre-flight gate** (30+ ხაზის ან ახალი
ფაილის წერამდე) და უსაფრთხოების non-negotiables: input ვალიდაცია controller-ის
საზღვარზე, მხოლოდ პარამეტრიზებული query-ები, secrets მხოლოდ env ცვლადებიდან.

### Rules — ავტომატური ქცევითი წესები (`.claude/rules/`)

წესები skill-ებისგან განსხვავდება იმით, რომ გამოძახება არ სჭირდებათ — ტრიგერის
დადგომისას ავტომატურად მოქმედებენ (CLAUDE.md-ის „Rules (auto-apply)" სექციიდან):

- **`read-context.md`** — ნებისმიერი კოდის წერამდე (მათ შორის „პატარა fix-ის")
  სავალდებულოა CLAUDE.md-ის და უახლოესი sub-context-ის წაკითხვა და არსებული
  pattern-ების სკანირება. წერის შემდეგ — self-check: edge cases, უსაფრთხოება,
  კონვენციებთან შესაბამისობა.
- **`plan-to-docs.md`** — დამტკიცებული მნიშვნელოვანი გეგმა ინახება
  `docs/decisions/NNN-*.md`-ში (Status / Date / Context / Approach / Key files /
  Verification სექციებით) კოდის დაწყებამდე, კითხვის გარეშე.
- **`self-improve.md`** — compounding loop: თუ Tech Lead ერთსა და იმავე შეცდომას
  მეორედ ასწორებს, ფიქსი კოდირდება წესად/skill-ად/agent-ის constraint-ად, რომ
  აღარ განმეორდეს. ყოველი კორექცია შემდეგ სესიას აუმჯობესებს.

### Skills (`.claude/skills/`)

- **`pre-flight`** — კოდისწინა დისციპლინის checklist: ცხადი დაშვებები,
  სიმარტივის ტესტი, ქირურგიული scope, ვერიფიცირებადი კრიტერიუმები.
- **`docs-edit`** — markdown დოკუმენტაციის რედაქტირების კონვენციები (აქტიური
  გვარი, აბსოლუტური თარიღები, placeholder-ების აკრძალვა). გამოიყენება მთავარი
  ჩატიდან, docs agent-ის გარეშე — ~15× ნაკლები ტოკენი.
- **`setup-team`** — ინტერაქტიული wizard თვითონ Claude-სთვის: 10 კითხვას სვამს
  სათითაოდ, აჯამებს, ადასტურებინებს და მერე აგენერირებს მთლიან კონფიგურაციას
  დეტალური customization წესებით თითო stack-ისთვის.

### Commands — slash ბრძანებები (`.claude/commands/`)

- **`/check`** — უშვებს build-სა და ტესტებს; ჩავარდნისას პოულობს პირველ რეალურ
  შეცდომას, ასწორებს და იმეორებს, სანამ ორივე green გახდება. წესები: „კომპილდება"
  ≠ „გადის"; ტესტის გასწორება assertion-ის შესუსტებით აკრძალულია; წითელ
  `/check`-ზე commit არ კეთდება.
- **`/new-ticket "<ask>"`** — შემდეგი `PREFIX-NNN` ticket-ის დრაფტი სტანდარტული
  template-ით: Problem, Acceptance criteria, Out of scope, Technical notes,
  Definition of done. ლიმიტი 200 სიტყვა; დიდი ამოცანა იყოფა.

### Compositions — multi-role workflow-ები (`.claude/compositions/`)

**`new-feature.md`** — სრული vertical slice 8 ნაბიჯად: scope (PM) → გეგმის
შენახვა docs-ში → დიზაინი/API კონტრაქტი (architect + designer) → backend →
frontend → ტესტები (QA) → review (code-reviewer, საჭიროებისას
security-reviewer) → საბოლოო ვერიფიკაცია. ყველა ეტაპს აქვს gate, რომლის
გამოტოვებაც აკრძალულია (PRD დამტკიცებული კოდამდე, `/check` green ყოველი ფაზის
შემდეგ, reviewer-ის თანხმობის (APPROVE) მიღებამდე).

Composition გამოიყენება მხოლოდ ნამდვილად მრავალროლიანი სამუშაოსთვის — უმეტესი
კოდირებისთვის ერთი agent-ის გამოყენება ან პირდაპირ შესრულება სჯობს, რადგან
multi-agent ~15× ტოკენს წვავს.

### Hooks — git-ის ავტომატური დაცვა (`.claude/hooks/`)

- **`pre-push-verify.mjs`** (PreToolUse, matcher: Bash) — იჭერს `git push`-ს,
  `origin/main`-თან merge-base-ით ადგენს შეცვლილ ფაილებს და უშვებს მხოლოდ
  რელევანტურ check-ებს (path-პრედიკატებით). ჩავარდნაზე exit 2 — push იბლოკება;
  `--no-verify` აკრძალულია settings-ის დონეზეც.
- **`check-uncommitted.mjs`** (Stop hook) — სესიის ბოლოს აფრთხილებს uncommitted
  ცვლილებებზე; მხოლოდ საინფორმაციოა, არ ბლოკავს.

### settings.json — permissions

- **allow** — უსაფრთხო git/ფაილური ბრძანებები + stack-სპეციფიკური ბრძანებები
  (CLI-ის მიერ ემატება);
- **deny** — დესტრუქციული ოპერაციები: `rm -rf`, `git push --force`,
  `git reset --hard`, `git rebase`, `git commit --amend`, `--no-verify` და სხვ.

## დიზაინის ფილოსოფია

1. **ლოკალური და კერძო** — `.claude/` და `CLAUDE.md` `.gitignore`-შია; ყველა
   გუნდის წევრი საკუთარ მანქანაზე აყენებს.
2. **ვერიფიკაცია ნდობაზე მაღლა დგას** — agent-ის სიტყვა არ კმარა: build/ტესტი/commit
   ყოველთვის ხელახლა მოწმდება.
3. **Compounding** — `self-improve` წესით ყოველი გასწორებული შეცდომა
   კონფიგურაციაში ილექება და სისტემა დროთა განმავლობაში ჭკვიანდება.
4. **ეკონომიური ორკესტრაცია** — multi-agent მხოლოდ რეალურად პარალელიზებადი
   სამუშაოსთვის; დოკუმენტაცია skill-ით კეთდება, agent-ით არა.
5. **მცირე წესების ნაკრები, რომელსაც ყველა იცავს** — წესი, რომელსაც გუნდი უგულებელყოფს,
   უარესია, ვიდრე წესის არქონა.

## გამოყენების სრული ციკლი

```bash
cd your-project
npx create-claude-team   # 7 კითხვა, ~2 წუთი
# შემდეგ Claude Code-ში:
/setup-team              # დარჩენილი დეტალების დაზუსტება
/new-ticket "..."        # პირველი ticket
/check                   # build + ტესტები commit-ამდე
```
