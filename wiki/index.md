# Wiki Index — nullprobe development

> Content catalog for this project's own knowledge base.
> Updated on every session that produces durable knowledge.

---

## Architecture Decisions

- **ESM-only** — all deps (inquirer, chalk, ora) are ESM-only; project uses `"type": "module"`
- **Templates as strings** — skill/wiki content embedded as TypeScript string constants in `src/scaffolder/templates/`, no runtime file reads
- **Serial GitHub calls** — `update` checks 7 sources one at a time (~2-4s), avoids rate limits, preserves source order
- **Overwrite guard in flow layer** — `init-flow.ts` checks for existing files and asks; `scaffolder/index.ts` writes unconditionally
- **Skills in `.claude/skills/`** — skills are Claude-native but patterns apply to all environments; cross-env rules replicated in `.cursor/rules/` and `.agent/rules/`

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
- Subagent fan-out is not all-or-nothing — plan for partial failure; cap at 4-6 lenses and have inline fallback for any lens that must produce output
- `npm pack --dry-run` belongs in verification, not just security/release — passing tests + build does not guarantee a publishable tarball (cleanup of `dist/` between build and pack ships a broken `bin`)
- Single source of truth for version: read from `package.json` at runtime, never embed `v0.x` string literals in code/templates/banners

## Source Repos Tracked

- Karpathy LLM Wiki (gist) → wiki pattern, CLAUDE.md schema
- rohitg00 LLM Wiki v2 (gist) → memory lifecycle, 4-tier consolidation
- rohitg00/agentmemory → automatic session capture, promotion bridge
- multica-ai/andrej-karpathy-skills → 4 behavioral principles as skills
- intellectronica/skillz → canonical SKILL.md format
- josephsenior/Agentic-Design-Patterns → Reflection, Guardrails, Evaluation patterns
- upstash/context7 → live docs fetching into prompts
