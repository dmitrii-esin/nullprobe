---
name: nullprobe-intro
description: Explains why nullprobe exists and prompts the AI to fetch, search, and analyze existing skills, tools, and techniques for the current GenAI environment. Invoke at the start of any new project or after running nullprobe init.
allowed-tools: WebFetch, WebSearch, Read, Bash
---

# nullprobe-intro

You are working in a project scaffolded by nullprobe — a minimal AI Knowledge OS injector.
This skill orients you and activates the research mode.

## What nullprobe installed

- `AI_FRAMEWORK.md` — portable guide synthesizing Karpathy wiki philosophy, rohitg00 4-tier memory lifecycle, andrej-karpathy-skills behavioral principles, skillz format, agentic patterns, and Context7
- `wiki/index.md` — content catalog (update on every ingest)
- `wiki/log.md` — chronological append-only session record

## Steps

1. Read `AI_FRAMEWORK.md` in full → verify: you can summarize the 4 behavioral principles and the 4-tier memory model
2. Read `wiki/index.md` → verify: you know what is already documented for this project
3. Ask the user: "Which GenAI environment are you using? (Claude Code / Cursor / Gemini CLI / Antigravity / other)" → verify: answer recorded
4. Search the internet and the source repos below for new skills, rules, techniques, or plugins specific to that environment → verify: at least 3 relevant results found
5. Summarize findings to the user in plain language — no jargon — and ask: "Want me to add any of these to the wiki?"
6. File confirmed findings into `wiki/index.md` and append an entry to `wiki/log.md`

## Source repos to check

- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2
- https://github.com/rohitg00/agentmemory
- https://github.com/multica-ai/andrej-karpathy-skills
- https://github.com/intellectronica/skillz
- https://github.com/josephsenior/Agentic-Design-Patterns
- https://github.com/upstash/context7

## Rules

- Do not overload the user with every result — present top 3 most relevant, offer to show more
- File only findings that score >= 2 of 3: specific, durable, actionable (quality gate from AI_FRAMEWORK.md Part III)
- Append to `wiki/log.md` with format: `## [YYYY-MM-DD] ingest | nullprobe-intro findings`
- If `wiki/index.md` has no entries yet, create the first category: `## AI Environment`

## When NOT to use this skill

- Mid-session when you already know the environment (use targeted skills instead)
- When you are asked to do something unrelated to project orientation
