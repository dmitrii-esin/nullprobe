# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**nullprobe** — Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

## Session Start

Read `docs/CONTEXT.md` first — it has the live project status, what works, and recent changes. Update its "Recent changes" section after substantive work.

## Commands

```bash
npm run dev -- init [path]   # Scaffold AI layer (dev mode)
npm run dev -- update        # Check source repos for new techniques
npm run build                # Compile to dist/
```

## Protocols

Operational runbooks for recurring tasks live in [`/protocols/`](protocols/README.md). Read and follow them — no extra instructions needed.

| Task | Runbook | npm script |
|------|---------|------------|
| Discover new tools | [`protocols/exploration.md`](protocols/exploration.md) | `npm run protocol:explore` |
| Verify before release | [`protocols/verification.md`](protocols/verification.md) | `npm run protocol:verify` |
| Security check | [`protocols/security.md`](protocols/security.md) | `npm run protocol:security` |
| Clean workspace | [`protocols/cleanup.md`](protocols/cleanup.md) | `npm run protocol:cleanup` |

## Architecture

```
src/
├── index.ts                 # CLI entry (commander)
├── types.ts                 # Shared types
├── commands/                # Thin command handlers
├── flows/                   # Conversational prompts (@inquirer/prompts)
├── scaffolder/              # File generation
│   └── templates/           # Embedded content as string constants
└── github/                  # Source repo definitions + API client
```

Key patterns:
- Templates are embedded TypeScript strings (no runtime file reads)
- Flows handle all user interaction; scaffolder writes unconditionally
- Overwrite guards live in the flow layer, not the scaffolder
- GitHub API calls are serial (7 sources, avoids rate limits)

### Output Structure (what `init` produces)

```
target-project/
├── AI_FRAMEWORK.md
├── wiki/
│   ├── index.md
│   └── log.md
└── .claude/skills/
    ├── nullprobe-intro/SKILL.md
    ├── think-before-coding/SKILL.md
    ├── simplicity-guard/SKILL.md
    └── session-crystallize/SKILL.md
```

## Core Principle

**Lightweight above all.** This tool exists because the AI tooling space is overloaded with fragile multi-framework designs. nullprobe's job is the opposite: ask two questions, deploy the essentials, get out of the way. Every feature addition must pass: "Does this make the tool simpler to use, or more complex?"

## Tech Stack

- TypeScript (strict, ESM-only)
- @inquirer/prompts — conversational terminal UI
- Commander.js — CLI routing
- @octokit/rest — GitHub API
- chalk + ora — terminal output

## Behavioral Principles (apply to all work in this repo)

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask if unclear
2. **Simplicity First** — minimum code that solves the problem, nothing speculative
3. **Surgical Changes** — touch only what you must, every changed line traces to the request
4. **Goal-Driven Execution** — define verifiable success criteria, loop until verified
