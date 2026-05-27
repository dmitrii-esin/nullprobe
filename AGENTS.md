# AGENTS.md

This file is read by: **OpenAI Codex CLI**, **Cursor**, and any tool that follows the AGENTS.md convention.

This project supports multiple AI environments in parallel. Each has its own namespace; all share the same source code, wiki, and AI_FRAMEWORK.md.

## Where each tool finds its instructions

| Tool | Primary instructions | MCP / config |
|------|---------------------|--------------|
| Claude Code | `CLAUDE.md` + `.claude/skills/*/SKILL.md` | `.mcp.json` |
| Cursor | `AGENTS.md` + `.cursor/rules/*.mdc` | `.cursor/mcp.json` |
| Gemini CLI (Google) | `GEMINI.md` (skills inlined as H2 sections) | `.gemini/settings.json` |
| Antigravity (Windsurf) | `.antigravitycli/rules/*.md` | `.agent/mcp_config.json` |
| OpenAI Codex CLI | `AGENTS.md` | (no separate namespace) |
| GitHub Copilot | `.github/copilot-instructions.md` | (no separate namespace) |

## Session Start

Read `docs/CONTEXT.md` first — current project status, what works, recent changes.
Update "Recent changes" after substantive work.

## Source Architecture

```
src/
├── index.ts                  # CLI entry (commander)
├── commands/                 # Thin handlers — delegate to flows + scaffolder
├── flows/                    # All user interaction (@inquirer/prompts)
├── scaffolder/
│   ├── index.ts              # Wiring file — add new output files HERE
│   └── templates/            # Embedded string constants, one per output file
└── github/
    ├── sources.ts            # 7 tracked source repos
    └── client.ts             # GitHub API (serial, unauthenticated)
```

**Critical wiring rule:** Adding a new skill requires two steps:
1. Create `src/scaffolder/templates/skill-<name>.ts`
2. Add to `files` array in `src/scaffolder/index.ts` — missing this means it's never written

## MCP Servers (keep in sync across all configs)

| Server | Claude | Cursor | Antigravity |
|--------|--------|--------|-------------|
| `context7` | `.mcp.json` | `.cursor/mcp.json` | `.agent/mcp_config.json` |

## Shared Artifacts (all environments read/write)

- `docs/CONTEXT.md` — live project snapshot (read at session start, update after work)
- `AI_FRAMEWORK.md` — portable AI collaboration guide (authoritative)
- `wiki/index.md` — knowledge catalog
- `wiki/log.md` — session record (append with `## [YYYY-MM-DD] type | title`)
- `src/` — shared TypeScript source

## Namespace Protection

Each AI environment owns its config directory:
- `.claude/` — Claude Code (skills, settings, `.mcp.json` at root)
- `.cursor/` — Cursor (`.cursor/rules/*.mdc`, `.cursor/mcp.json`)
- `.gemini/` — Gemini CLI (`.gemini/settings.json`); root-level `GEMINI.md` is the instruction file
- `.antigravitycli/` — Antigravity / Windsurf (rules); `.agent/mcp_config.json` for MCP

Don't edit another environment's namespace unless intentionally updating shared protocols.

## Skills (in `.claude/skills/` — patterns apply to all environments)

| Skill | Source | Invoke when... |
|-------|--------|----------------|
| `nullprobe-intro` | nullprobe | Starting a new session, orienting the AI |
| `think-before-coding` | andrej-karpathy-skills | Before non-trivial code changes |
| `simplicity-guard` | andrej-karpathy-skills | After writing code, catching complexity |
| `session-crystallize` | rohitg00 LLM Wiki v2 | End of session, compressing learnings |
| `context7-research` | upstash/context7 | Need current docs for a library |

## Behavioral Guidelines (same across all environments)

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask if unclear
2. **Simplicity First** — no features beyond what was asked, no speculative abstractions
3. **Surgical Changes** — every changed line traces to the request
4. **Goal-Driven Execution** — verifiable success criteria, loop until verified

## Build

```bash
npm run build    # TypeScript must compile clean
npm run dev -- init /tmp/test   # Test scaffold output
```

## Protocols

Operational runbooks live in [`/protocols/`](protocols/README.md). Read and follow them for recurring tasks.

**Note on grouped optional artifacts**: The QA protocols feature (shipped to user projects) uses a `PROTOCOL_BUNDLE` registry in `src/scaffolder/protocol-bundle.ts` as the single source of truth. Adding new protocols to this bundle follows the same spirit as the Critical wiring rule.

When using `nullprobe init` on other projects, users can opt in to receiving a full set of generalized, customizable versions of these protocols.

| Task | Runbook |
|------|---------|
| Discover new tools / techniques | [`protocols/exploration.md`](protocols/exploration.md) |
| Verify before releasing | [`protocols/verification.md`](protocols/verification.md) |
| Security check | [`protocols/security.md`](protocols/security.md) |
| Clean workspace | [`protocols/cleanup.md`](protocols/cleanup.md) |

## Core Principle

**Lightweight above all.** Every feature must pass: "Does this make the tool simpler to use, or more complex?"
