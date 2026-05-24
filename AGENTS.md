# AGENTS.md

This project supports multiple AI environments working in parallel. Each has its own namespace; all share the same source code, wiki, and AI_FRAMEWORK.md.

## Multi-Environment Setup

| Environment | Config Directory | MCP Config | Rules |
|-------------|-----------------|------------|-------|
| Claude Code | `.claude/` | `.mcp.json` | `CLAUDE.md` |
| Cursor | `.cursor/` | `.cursor/mcp.json` | `.cursor/rules/*.mdc` |
| Antigravity / Gemini CLI | `.agent/` | `.agent/mcp_config.json` | `.agent/rules/GEMINI.md` |

## MCP Servers (keep in sync across all configs)

| Server | Purpose |
|--------|---------|
| `context7` | Live, version-specific documentation for installed dependencies |

## Shared Artifacts (all environments read/write)

- `AI_FRAMEWORK.md` — portable AI collaboration guide (authoritative source of truth)
- `wiki/index.md` — knowledge catalog (read at session start)
- `wiki/log.md` — chronological session record (append after substantive work)
- `src/` — shared TypeScript source code

## Namespace Protection

Each AI environment owns its config directory. When working from one environment, prefer not to edit another's config unless intentionally updating shared protocols:

- Claude Code owns `.claude/` — skills, agents, commands
- Cursor owns `.cursor/` — rules (`.mdc`), MCP config
- Antigravity owns `.agent/` — rules, MCP config, scripts

## Skills (installed for all environments via `.claude/skills/`)

| Skill | Source | Invoke when... |
|-------|--------|----------------|
| `nullprobe-intro` | nullprobe | Starting a new session, orienting the AI |
| `think-before-coding` | andrej-karpathy-skills | Before non-trivial code changes |
| `simplicity-guard` | andrej-karpathy-skills | After writing code, catching complexity |
| `session-crystallize` | rohitg00 LLM Wiki v2 | End of session, compressing learnings |
| `context7-research` | upstash/context7 | Need current docs for a library |

## Behavioral Guidelines (same across all environments)

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask if unclear
2. **Simplicity First** — minimum code that solves the problem, nothing speculative
3. **Surgical Changes** — touch only what you must, every changed line traces to the request
4. **Goal-Driven Execution** — define verifiable success criteria, loop until verified

## Core Principle

**Lightweight above all.** This tool exists because the AI tooling space is overloaded with fragile multi-framework designs. nullprobe asks two questions and deploys the essentials. Every feature must pass: "Does this make the tool simpler to use, or more complex?"
