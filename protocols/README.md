# Protocols

AI-agnostic runbooks for recurring operational tasks. Any AI opening this workspace must locate, read, and execute these without extra instructions.

## Discovery

This directory lives at `/protocols/` in the project root. It is referenced from:
- `README.md` (project root)
- `CLAUDE.md` (Claude Code)
- `AGENTS.md` (Cursor, Codex, Copilot, Windsurf)
- `GEMINI.md` (Gemini CLI / Antigravity)

## Available Protocols

| Protocol | File | npm script | Purpose |
|----------|------|------------|---------|
| Exploration | [exploration.md](exploration.md) | `npm run protocol:explore` | Discover AI environment updates, new tools, and techniques |
| Verification | [verification.md](verification.md) | `npm run protocol:verify` | Deterministic test + spec cross-check |
| Security | [security.md](security.md) | `npm run protocol:security` | OWASP scan, secrets, deps, permissions |
| Cleanup | [cleanup.md](cleanup.md) | `npm run protocol:cleanup` | Remove artifacts, restore clean workspace |

## How to Use

1. **Read** the relevant runbook before starting the task.
2. **Follow steps in order** — each step has a success criterion.
3. **Log results** — every protocol ends with a structured output block.
4. **Re-run** as needed — all protocols are idempotent.

## Versioning

Each runbook carries a `version:` field in its header. When making breaking changes to a runbook, increment the version and add a changelog entry at the bottom of that file.

## Format Convention

```
## [N]. Step Title
**What:** What this step does.
**How:**
  <commands or actions>
**Success:** What "done" looks like.
```
