---
name: think-before-coding
description: Karpathy Principle 1 — before implementing anything, state assumptions, surface tradeoffs, and ask if unclear. Invoke before any non-trivial code change.
allowed-tools: Read, Grep, Glob
---

# Think Before Coding

Source: andrej-karpathy-skills (multica-ai) — Principle 1

Before implementing, pause and produce a brief analysis block:

## Steps

1. State your assumptions explicitly → verify: each assumption is falsifiable
2. If multiple interpretations exist, list them → verify: at least 2 alternatives shown
3. Check if a simpler approach exists → verify: you considered the trivial solution
4. If anything is unclear, stop and ask → verify: no silent guesses

## Output Format

```
ASSUMPTIONS:
- [assumption 1]
- [assumption 2]

ALTERNATIVES:
- [approach A] — tradeoff: ...
- [approach B] — tradeoff: ...

CHOSEN: [approach] because [reason]
UNCLEAR: [nothing / list what needs clarification]
```

## Rules

- Never skip this for changes touching >3 files
- Never pick silently between interpretations
- Push back when the request is overcomplicated
- A 2-minute pause here saves a 20-minute rewrite

## When NOT to use this skill

- Single-line fixes, typos, obvious bugs
- When the user has given explicit step-by-step instructions
- Pure research/exploration (no code change planned)
