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
| Multi-env scaffold | Claude (.claude/skills/ + .mcp.json), Cursor (.cursor/rules/*.mdc + .cursor/mcp.json), Antigravity (.antigravitycli/rules/*.md + .agent/mcp_config.json), Gemini CLI (.claude/skills/ + .gemini/settings.json) |

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
- Test coverage (Vitest, ≥80% branch on core modules) — **DONE** (89.81% branch, 46 tests)
- Verification plan — documented in PLAN.md §2, run before each release — **DONE** (all 8 scenarios passed)
- Language-agnostic distribution: Phase 1 (Bun binary CI), Phase 2 (curl install script), Phase 3 (Homebrew tap, Scoop) — not started

## Recent changes

### 2026-05-25 — MCP config paths fixed + tests + verification (Claude Code session)
- `src/scaffolder/index.ts` — Claude now scaffolds `.mcp.json` (was empty); Gemini CLI now uses `.gemini/settings.json` (was `.agent/mcp_config.json`); cases split
- `src/scaffolder/platforms.ts` — detectPaths updated for claude and gemini-cli
- `src/github/client.ts` — added `AbortSignal.timeout(10_000)` to gist fetch (was hanging indefinitely on unreachable gist)
- Test suite: 46 tests, 89.81% branch coverage — all pass
- `verify.sh` — e2e verification script (expect-driven init + direct API tests for update)
- `docs/PLAN.md` §2 verification — all 8 scenarios confirmed passing
- `.gitignore` — added `.env.local` and `.env.*.local`
- `.env.local` — Tavily API key (gitignored)

### 2026-05-25 — protocols added (Claude Code session)
- `protocols/README.md` — index and discovery instructions for all runbooks
- `protocols/exploration.md` — AI environment discovery runbook (web/X/Reddit/repo sources)
- `protocols/verification.md` — deterministic test + manual test + spec cross-check runbook
- `protocols/security.md` — OWASP Top 10 / secrets / deps / permissions security runbook
- `protocols/cleanup.md` — artifact cleanup with dry-run mode
- `protocols/prompts/protocol-spec.md` — original prompt saved for reference
- `package.json` — added `protocol:verify`, `protocol:security`, `protocol:cleanup`, `protocol:cleanup:dry`, `protocol:explore` scripts
- `CLAUDE.md`, `AGENTS.md`, `README.md` — all updated to reference `/protocols/`

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
