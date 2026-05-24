# nullprobe — Gemini CLI Instructions

nullprobe is a lightweight TypeScript CLI that scaffolds AI collaboration layers into projects.
Two questions, under 30 seconds. No overloading.

## Session Start

Read `docs/CONTEXT.md` first — current project status, what works, recent changes.
Update its "Recent changes" section after substantive work.

## Project Structure

```
src/
├── index.ts                  # CLI entry (commander)
├── commands/                 # Thin handlers — delegate to flows + scaffolder
├── flows/                    # All user interaction (inquirer prompts)
├── scaffolder/
│   ├── index.ts              # Wiring file — add new output files here
│   └── templates/            # Embedded string constants, one file per output
└── github/                   # Source repo definitions + API client
```

**Critical wiring rule:** Adding a new skill template requires two steps:
1. Create `src/scaffolder/templates/skill-<name>.ts`
2. Add it to the `files` array in `src/scaffolder/index.ts` — missing this means the file is never written

## Build & Validate

```bash
npm run build    # TypeScript must compile clean before finishing any work
npm run dev -- init /tmp/test   # Test scaffold output
```

## Multi-Environment Namespaces

| Environment | Config | Do not edit from Gemini unless intentional |
|-------------|--------|---------------------------------------------|
| Claude Code | `.claude/` | ← leave alone |
| Cursor | `.cursor/` | ← leave alone |
| Antigravity / Gemini | `.agent/` | ← this is yours |

Shared (read/write from any environment): `src/`, `AI_FRAMEWORK.md`, `wiki/`, `docs/CONTEXT.md`

## MCP

Config: `.agent/mcp_config.json`
- `context7` — live docs for installed dependencies (keep in sync with `.mcp.json` and `.cursor/mcp.json`)

## Behavioral Guidelines (Karpathy)

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask if unclear
2. **Simplicity First** — no features beyond what was asked, no speculative abstractions
3. **Surgical Changes** — every changed line traces to the request
4. **Goal-Driven Execution** — define verifiable success criteria, loop until verified

## Core Principle

Lightweight above all. Every feature must pass: "Does this make the tool simpler to use, or more complex?"
