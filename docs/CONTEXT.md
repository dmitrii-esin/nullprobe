# CONTEXT.md — Live Project Snapshot

> Read this at the start of every session. Update the "Recent changes" section after substantive work.
> This is the shared contract between all AI environments (Claude, Cursor, Antigravity).

## What this project is

nullprobe v0.1 — a lightweight CLI (TypeScript, npm) that scaffolds an AI collaboration layer into any project. Two questions, under 30 seconds.

## Current status

| Area | State |
|------|-------|
| `nullprobe init` | Working — scaffolds 4 skills + wiki + AI_FRAMEWORK.md |
| `nullprobe update` | Partially working — GitHub repo check works; search is a stub |
| npm publish | Not published — install from source |
| Multi-env scaffold | Claude only today; Cursor/Antigravity output planned for v0.2 |

## Key files

| File | Purpose |
|------|---------|
| `src/index.ts` | CLI entry — commander routes to commands |
| `src/flows/init-flow.ts` | Conversational init prompts (inquirer) |
| `src/scaffolder/index.ts` | **Wiring file** — add new templates here |
| `src/scaffolder/templates/` | One `.ts` file per output file, exports string constant |
| `src/github/sources.ts` | Source repos tracked by `update` command |
| `AI_FRAMEWORK.md` | Portable guide — this is what gets scaffolded into target projects |

## Active constraints

- ESM-only (`"type": "module"`) — all imports need `.js` extensions in compiled output
- `tsx` for dev, `tsc` for build — no bundler
- Serial GitHub API calls — unauthenticated, 60 req/hr limit

## v0.2 targets

- `nullprobe update --search` — actual internet search for new tools
- Scaffold Cursor rules (`.cursor/rules/`) and Antigravity config (`.agent/`) based on platform selection
- npm publish

## Recent changes

### 2026-05-24 — v0.1 bootstrapped (Claude Code session)
- Built full CLI: `init` + `update` commands
- Scaffolds: AI_FRAMEWORK.md, 4 skills, wiki/index.md, wiki/log.md
- Multi-env setup: `.claude/`, `.cursor/`, `.agent/` namespaces
- Context7 MCP across all 3 environments
- Committed and pushed to https://github.com/dmitrii-esin/nullprobe
