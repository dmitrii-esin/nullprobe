---
name: session-crystallize
description: End-of-session knowledge capture — compress session learnings into wiki entries following rohitg00 4-tier consolidation and Karpathy wiki philosophy. Invoke at session end or after significant progress.
allowed-tools: Read, Write, Grep, Glob
---

# Session Crystallize

Source: rohitg00 LLM Wiki v2 (4-tier consolidation) + Karpathy wiki philosophy

At the end of a work session, compress what was learned into durable knowledge.

## Steps

1. Review what happened this session (git diff, conversation context) → verify: you can summarize in 3 bullets
2. Identify knowledge that passes the quality gate (≥2 of 3: specific, durable, actionable) → verify: each candidate scored
3. Check `wiki/index.md` for existing related entries → verify: no duplicates created
4. Write new entries to appropriate wiki sections → verify: entries are concrete, not vague
5. Append to `wiki/log.md` with format: `## [YYYY-MM-DD] crystallize | Summary` → verify: log entry parseable

## Quality Gate (from AI_FRAMEWORK.md Part III)

Only file knowledge that scores ≥ 2 of 3:
- **Specific** — concrete, not vague
- **Durable** — will this still matter in 6 months?
- **Actionable** — does knowing this change future behavior?

## 4-Tier Classification

- **Working memory** → don't save (ephemeral observations)
- **Episodic** → save to `wiki/log.md` (what happened)
- **Semantic** → save to `wiki/index.md` (cross-session facts, seen 2+ times)
- **Procedural** → save as skill or wiki pattern (workflows, confirmed twice)

## Rules

- Strip PII, secrets, credentials before writing
- Use `supersedes` when updating existing knowledge (don't leave stale claims)
- Lean entries with 1-2 sentences beat padded paragraphs
- If nothing passes the quality gate, that's fine — don't force it

## When NOT to use this skill

- Mid-session (wait until a natural stopping point)
- When nothing new was learned (routine tasks with no surprises)
