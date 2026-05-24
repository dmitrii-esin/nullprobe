export const SKILL_SIMPLICITY_GUARD = `\
---
name: simplicity-guard
description: Karpathy Principle 2 — review code for unnecessary complexity, speculative features, premature abstractions. Invoke after writing code or during review.
allowed-tools: Read, Grep, Glob
---

# Simplicity Guard

Source: andrej-karpathy-skills (multica-ai) — Principle 2 (Simplicity First)

After writing code, run this checklist to catch complexity creep.

## Steps

1. Read the changed files → verify: you see the full diff
2. For each function/module, ask: "Could this be fewer lines without losing clarity?" → verify: answer documented
3. Check for speculative features (things not asked for) → verify: every feature traces to a request
4. Check for premature abstractions (wrappers around single uses) → verify: no single-use abstractions
5. If 200 lines could be 50, rewrite → verify: line count improved or justified

## Checklist

- [ ] No features beyond what was asked
- [ ] No abstractions wrapping single-use code
- [ ] No "flexibility" or "configurability" that wasn't requested
- [ ] No error handling for impossible scenarios
- [ ] No speculative type parameters or generics
- [ ] Would a senior engineer say "this is overcomplicated"? If yes → simplify

## Rules

- Three similar lines is better than a premature abstraction
- A function called once doesn't need to be extracted
- Default to no comments — well-named code is self-documenting
- If removing code doesn't break anything, it shouldn't exist

## When NOT to use this skill

- When writing new code for the first time (apply after, not during)
- When the complexity is inherent to the domain (genuine algorithmic complexity)
`;
