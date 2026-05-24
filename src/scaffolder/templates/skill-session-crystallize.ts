export const SKILL_SESSION_CRYSTALLIZE = `\
---
name: session-crystallize
description: End-of-session knowledge capture — compress learnings into wiki entries following rohitg00 4-tier consolidation. Invoke at session end or after significant progress.
allowed-tools: Read, Write, Grep, Glob
---

# Session Crystallize

Source: rohitg00 LLM Wiki v2 (4-tier consolidation) + Karpathy wiki philosophy

At the end of a work session, compress what was learned into durable knowledge.

## Steps

1. Review what happened this session (git diff, conversation context) → verify: summarize in 3 bullets
2. Identify knowledge that passes the quality gate (>=2 of 3: specific, durable, actionable) → verify: each scored
3. Check \\\`wiki/index.md\\\` for existing entries → verify: no duplicates
4. Write new entries to appropriate wiki sections → verify: entries are concrete
5. Append to \\\`wiki/log.md\\\`: \\\`## [YYYY-MM-DD] crystallize | Summary\\\` → verify: parseable

## Quality Gate

Only file knowledge that scores >= 2 of 3:
- **Specific** — concrete, not vague
- **Durable** — will this still matter in 6 months?
- **Actionable** — does knowing this change future behavior?

## 4-Tier Classification

- **Working memory** → don't save (ephemeral)
- **Episodic** → \\\`wiki/log.md\\\` (what happened)
- **Semantic** → \\\`wiki/index.md\\\` (cross-session facts, seen 2+ times)
- **Procedural** → skill or wiki pattern (workflows, confirmed twice)

## Rules

- Strip PII, secrets, credentials before writing
- Use supersession when updating existing knowledge
- Lean entries beat padded paragraphs
- If nothing passes the quality gate, don't force it

## When NOT to use this skill

- Mid-session (wait for a natural stopping point)
- When nothing new was learned
`;
