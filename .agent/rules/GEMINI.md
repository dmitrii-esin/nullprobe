# nullprobe — Gemini CLI / Antigravity Rules

## Project Overview

nullprobe is a lightweight CLI that deploys AI collaboration layers into projects.
TypeScript, ESM-only, npm distribution.

## Universal Coding Behavior (Karpathy Guidelines)

### Principle 1: Think Before Coding
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them.
- If a simpler approach exists, say so.

### Principle 2: Simplicity First
- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.

### Principle 3: Surgical Changes
- Don't "improve" adjacent code or formatting.
- Match existing style.
- Every changed line traces to the request.

### Principle 4: Goal-Driven Execution
- Define verifiable success criteria.
- For multi-step tasks, state plan with verify checks.

## Namespace Protection

- `.claude/` — owned by Claude Code workflow
- `.cursor/` — owned by Cursor workflow
- `.agent/` — owned by Antigravity/Gemini CLI workflow

Prefer not to edit other namespaces unless intentionally updating shared protocols.

## Session Start

Read `docs/CONTEXT.md` first — current status, what works, recent changes. Update "Recent changes" after substantive work.

## Shared Artifacts (read/write from any environment)

- `AI_FRAMEWORK.md` — portable guide (authoritative)
- `wiki/index.md` — knowledge catalog
- `wiki/log.md` — session log (append after substantive work)
- `src/` — shared source code

## MCP Servers

Config: `.agent/mcp_config.json`
- `context7` — live documentation for installed dependencies

Keep in sync with `.mcp.json` (Claude) and `.cursor/mcp.json` (Cursor).

## Validation

Before finishing work:
- `npm run build` — TypeScript must compile clean
- Append to `wiki/log.md` if durable knowledge was produced

## Core Principle

Lightweight above all. No overloading. Two questions and done.
