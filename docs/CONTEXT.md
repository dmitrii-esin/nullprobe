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

### 2026-05-26 — Audit Remediation Complete (Antigravity session)
- Applied and verified all fixes from the 2026-05-25 audit report (tracked in `docs/AUDIT_FIX_HANDOFF.md`).
- Key fixes include: `npm pack` safety via `prepublishOnly`, correct `.agent`/`.gemini` namespaces documented in `AGENTS.md`, network timeouts enforced in github/tavily clients, prompt-injection sanitized in search flows.
- Baseline live-confirmed: `tsc --noEmit` exit 0, 98 tests pass, branch coverage **89.02%**.

### 2026-05-25 — Audit protocol added + first multi-lens audit run (Claude Code session)
- `protocols/audit.md` — new runbook: multi-perspective QA review via specialized subagents (frontend / backend / ML personas + code auditor + reqs-vs-reality + adversarial). Read-only, structured-table output, prioritized remediation grouping.
- `protocols/prompts/audit-spec.md` — original + polished prompt preserved (matches existing `prompts/` convention).
- `protocols/README.md`, `CLAUDE.md` — wired Audit row into both protocol tables.
- `package.json` — added `protocol:audit` script (echo pointer; protocol requires an AI agent to drive subagents).
- First audit run produced **32 findings**: 1 release-blocker (`npm pack` ships no `dist/` — `bin` would dangle on publish), 8 high-severity (overwrite guard gap on `AI_FRAMEWORK.md`/`wiki/*`, Gemini-CLI skill path contradicts its own comment, 7-location version drift, init-flow's intent capture is a placebo, backend/ML stack-blindness), and 23 medium-to-nit (stale comment block, error-swallowing in github/client, dead `installSkill` field, marketing-vs-reality drift, missing timeouts on a few network calls, prompt-injection vector via search→wiki).
- Baseline live-confirmed: `tsc --noEmit` exit 0, 47/47 tests pass, branch coverage **88.49%** (CONTEXT previously claimed 89.81% — drift recorded), `npm audit` 0 vulnerabilities.
- Subagent fanout caveat noted: 4 of 6 parallel subagents bounced with "Credit balance is too low" before producing findings. L4/L5/L6 performed inline; L1 inferred from overlapping L2/L3 evidence. Lesson captured in `wiki/log.md` + `wiki/index.md`.
- **No code changes made during audit** — report is the deliverable; remediation deferred until owner picks a batch.

### 2026-05-25 — Dev MCP expansion + optional-MCP customization step (Claude Code session)
- Dev MCP configs in repo root (`.mcp.json`, `.cursor/mcp.json`, `.agent/mcp_config.json`, new `.gemini/settings.json`) now include `context7`, `shadcn`, `chrome-devtools`, `github` MCPs for contributor sessions — NOT shipped via init by default
- `src/scaffolder/templates/mcp-context7.ts` refactored — exports `buildMcpConfig(extras)` builder + `EXTRA_MCP_CHOICES` registry; `MCP_CONTEXT7_CONFIG` kept for back-compat
- `src/types.ts` — `InitAnswers.extraMcps: ExtraMcpId[]` added; new `ExtraMcpId` union type
- `src/flows/init-flow.ts` — new optional confirm + checkbox: "Customize MCP servers?" (default off → context7 only)
- `src/scaffolder/index.ts` — `platformExtras()` now uses `buildMcpConfig(answers.extraMcps)` instead of the static constant
- Tests: 47 pass (added 1), branch coverage 88.49%
- `docs/PLAN.md` — new §0 (MCP customization tracker), §0a (MCP discovery aggregator roadmap), §2.9 (verification scenario)

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
