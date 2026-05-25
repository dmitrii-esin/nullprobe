# CONTEXT.md — Live Project Snapshot

> Read this at the start of every session. Update the "Recent changes" section after substantive work.
> This is the shared contract between all AI environments (Claude, Cursor, Antigravity).

## What this project is

nullprobe v0.2 — Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

## Current status

| Area | State |
|------|-------|
| `nullprobe init` | Working — scaffolds 4 skills + wiki + AI_FRAMEWORK.md |
| `nullprobe update` | Working — GitHub and Tavily search backends live; results logged to wiki |
| npm publish | Not published — install from source |
| Multi-env scaffold | Claude (.claude/skills/), Cursor (.cursor/rules/*.mdc), Antigravity (.antigravitycli/rules/*.md), Gemini CLI (.claude/skills/ fallback) |

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

## Roadmap

See `docs/PLAN.md` for the full development plan with test coverage scope, verification checklist, and multi-registry distribution research.

Current backlog highlights:
- Test coverage (Vitest, ≥80% branch on core modules) — not started
- Verification plan — documented in PLAN.md §2, run before each release
- Language-agnostic distribution: Phase 1 (Bun binary CI), Phase 2 (curl install script), Phase 3 (Homebrew tap, Scoop) — not started

## Recent changes

### 2026-05-25 — v0.2 shipped (Claude Code session)
- `src/scaffolder/skill-to-mdc.ts` — SKILL.md → Cursor .mdc transformer (parseSkillMeta, stripSkillFrontmatter, wrapAsMdc)
- `src/scaffolder/platforms.ts` — platform registry (claude, cursor, gemini-cli, antigravity) with skillPath/detectPaths/extraFiles
- `src/scaffolder/index.ts` — uses PLATFORMS registry; cursor/antigravity write skills as .mdc/.md via platform.extraFiles()
- `src/flows/init-flow.ts` — checkExistingFiles is now platform-aware (uses PLATFORMS[platform].detectPaths)
- `src/search/tavily.ts` — fetch-based Tavily wrapper (no SDK), full error codes
- `src/flows/update-flow.ts` — real GitHub and Tavily search backends wired; results appended to wiki/log.md
- Antigravity skill path: `.antigravitycli/rules/` (confirmed — `.windsurf/rules/` was wrong)

### 2026-05-24 — v0.1 bootstrapped (Claude Code session)
- Built full CLI: `init` + `update` commands
- Scaffolds: AI_FRAMEWORK.md, 4 skills, wiki/index.md, wiki/log.md
- Multi-env setup: `.claude/`, `.cursor/`, `.agent/` namespaces
- Context7 MCP across all 3 environments
- Committed and pushed to https://github.com/dmitrii-esin/nullprobe
