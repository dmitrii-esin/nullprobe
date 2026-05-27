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

## Positioning & External Research (2026)

- Major 2026-05-27 architecture & memory/skills analysis against 13 external repos (especially agentmemory + iii, OpenClaw, Anthropic skills standard, Hallmark, mem0): see `docs/ARCHITECTURE_ANALYSIS_2026-05-27.md`.
- Key insight: nullprobe is the strong *durable institutional layer + protocols* bootstrapper. The automatic "living memory" half is best supplied by pairing with production runtimes such as agentmemory on iii (which literally implements the 4-tier model cited in our own sources).
- Detailed sub-agent reports and clones of the two most relevant repos are in `/tmp/nullprobe-analysis/` from that session.

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

## Architecture Analysis (2026-05-27)

- **[docs/ARCHITECTURE_ANALYSIS.md](../docs/ARCHITECTURE_ANALYSIS.md)** — Full architectural review: nullprobe vs. 13 reference repositories. 9 gap findings, competitive matrix, 3 strategic paths forward.
- **[wiki/exploration/2026-05-27-architecture-analysis.md](exploration/2026-05-27-architecture-analysis.md)** — Technical sidecar: agent rosters, MCP protocol details, benchmark numbers, tool surfaces.
- Key finding: nullprobe is a clean static scaffolder, but AI_FRAMEWORK.md describes a knowledge system the tool doesn't implement. Closest competitor (atelier-pipeline) fills exactly that gap.
- Key decision pending: choose between lightweight scaffolder / memory-aware scaffolder / runtime system.

## Source Repos Tracked

**Original 7 (in `src/github/sources.ts`):**
- Karpathy LLM Wiki (gist) → wiki pattern, CLAUDE.md schema
- rohitg00 LLM Wiki v2 (gist) → memory lifecycle, 4-tier consolidation
- rohitg00/agentmemory → automatic session capture, promotion bridge
- multica-ai/andrej-karpathy-skills → 4 behavioral principles as skills
- intellectronica/skillz → pre-standard SKILL.md format (⚠️ superseded by agentskills.io)
- josephsenior/Agentic-Design-Patterns → Reflection, Guardrails, Evaluation patterns
- upstash/context7 → live docs fetching into prompts

**Researched in architecture analysis (2026-05-27):**
- [anthropics/skills](https://github.com/anthropics/skills) → official SKILL.md standard + [agentskills.io](http://agentskills.io)
- [mem0ai/mem0](https://github.com/mem0ai/mem0) → universal memory layer, ADD-only extraction, multi-signal retrieval
- [robertsfeir/mybrain](https://github.com/robertsfeir/mybrain) → 8-tool MCP protocol for persistent knowledge
- [robertsfeir/atelier-pipeline](https://github.com/robertsfeir/atelier-pipeline) → 11-agent orchestration + brain + quality gates
- [openclaw/openclaw](https://github.com/openclaw/openclaw) → full AI assistant platform, skills/workspace architecture
- [iii-hq/iii](https://github.com/iii-hq/iii) → zero-integration runtime (Worker/Function/Trigger)
- [Nutlope/hallmark](https://github.com/Nutlope/hallmark) → anti-slop design skill, 65 gates, 22 themes
- [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) → curated 100+ Claude skills catalog
