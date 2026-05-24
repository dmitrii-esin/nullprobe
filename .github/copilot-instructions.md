# GitHub Copilot Instructions — nullprobe

nullprobe: Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

## Session Start

Read `docs/CONTEXT.md` — current project status, what works, what's planned.

## Source Architecture

```
src/
├── index.ts                  # CLI entry — commander routes init/update commands
├── types.ts                  # AIPlatform, InitAnswers, SourceRepo, CommitInfo
├── commands/                 # Thin handlers (delegate to flows + scaffolder)
├── flows/                    # All inquirer prompts (@inquirer/prompts)
├── scaffolder/
│   ├── index.ts              # Orchestrates writes — THE wiring file
│   └── templates/            # String constants, one per output file
└── github/
    ├── sources.ts            # 7 source repos tracked by update command
    └── client.ts             # GitHub API (serial, unauthenticated)
```

**When adding a new skill:** create `src/scaffolder/templates/skill-<name>.ts`, then add it to `src/scaffolder/index.ts`'s `files` array. Both steps are required.

## Key Patterns

- All templates are embedded TypeScript string constants — no runtime file reads
- Flow layer handles all user interaction; scaffolder writes unconditionally
- Overwrite guard lives in `src/flows/init-flow.ts`, not the scaffolder
- GitHub calls are serial (avoids 60 req/hr unauthenticated rate limit)
- ESM-only: `"type": "module"` in package.json, `.js` extensions in compiled imports

## Build

```bash
npm run build    # tsc — must pass before finishing work
npm run dev -- init /tmp/test
```

## Behavioral Guidelines

- No features beyond what was asked
- No abstractions for single-use code
- Every changed line traces to the user's request
- Match existing style — surgical edits only
