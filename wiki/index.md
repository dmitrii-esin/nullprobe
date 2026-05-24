# Wiki Index — nullprobe development

> Content catalog for this project's own knowledge base.
> Updated on every session that produces durable knowledge.

---

## Architecture Decisions

- [ESM-only](decisions/esm-only.md) — all deps are ESM-only (inquirer, chalk, ora), so the project is `"type": "module"`
- [Templates as strings](decisions/templates-as-strings.md) — embedded in TypeScript, no runtime file reads
- [Serial GitHub calls](decisions/serial-github.md) — 7 requests over ~2-4s, avoids rate limits, preserves source order
- [Overwrite guard in flow layer](decisions/overwrite-guard.md) — scaffolder writes unconditionally, flow layer asks first

## Behavioral Principles (from Karpathy skills)

1. **Think Before Coding** — state assumptions, surface tradeoffs, ask if unclear
2. **Simplicity First** — minimum code that solves the problem, nothing speculative
3. **Surgical Changes** — touch only what you must, every changed line traces to the request
4. **Goal-Driven Execution** — define verifiable success criteria, loop until verified

## Skills Installed (this project uses its own output)

| Skill | Source | Purpose |
|-------|--------|---------|
| `nullprobe-intro` | nullprobe | Orient AI + research tools for the environment |
| `think-before-coding` | andrej-karpathy-skills (Principle 1) | Pause, state assumptions, surface tradeoffs |
| `simplicity-guard` | andrej-karpathy-skills (Principle 2) | Catch complexity creep after writing code |
| `session-crystallize` | rohitg00 LLM Wiki v2 | Compress session learnings into wiki |
| `context7-research` | upstash/context7 | Fetch live docs instead of relying on training data |

## Lessons Learned

- Inquirer v9 doesn't ship types — use `@inquirer/prompts` instead (modern, typed, same team)
- `tsx -e` with top-level await fails because `-e` context is treated as CJS — use a `.ts` file instead
- The lightweight philosophy must be the first thing anyone reads — it's the core differentiator
- The project must eat its own dog food: use the same skills it scaffolds for others

## Source Repos Tracked

- Karpathy LLM Wiki (gist) → wiki pattern, CLAUDE.md schema
- rohitg00 LLM Wiki v2 (gist) → memory lifecycle, 4-tier consolidation
- rohitg00/agentmemory → automatic session capture, promotion bridge
- multica-ai/andrej-karpathy-skills → 4 behavioral principles as skills
- intellectronica/skillz → canonical SKILL.md format
- josephsenior/Agentic-Design-Patterns → Reflection, Guardrails, Evaluation patterns
- upstash/context7 → live docs fetching into prompts
