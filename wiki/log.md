# Wiki Log — nullprobe development

> Chronological, append-only record of what happened.
> Format: `## [YYYY-MM-DD] operation | Title`

---

## [2026-05-24] init | Project bootstrapped

  Decision: Start nullprobe v0.1 as a lightweight AI Knowledge OS injector CLI.
  Tech: TypeScript, ESM-only, @inquirer/prompts, Commander.js, @octokit/rest, chalk, ora
  Success criteria: CLI outputs AI_FRAMEWORK.md + 1 skill + wiki/index.md + wiki/log.md in <30s
  Result: All 4 files scaffolded successfully. Build compiles clean. --help works.

## [2026-05-24] decision | Core philosophy clarified

  The tool is lightweight above all else. Instead of overloading with multi-framework design,
  it asks two questions: (1) what AI environment? (2) recommended tools, something specific,
  or search? This is the core differentiator and must be the first thing anyone reads.

## [2026-05-24] lesson | @inquirer/prompts over inquirer

  inquirer v9.3 does not ship TypeScript declarations.
  @inquirer/prompts (same team) is the modern replacement — fully typed, ESM-only, individual imports.
  Switched and type-check passes clean.

## [2026-05-24] update | Applied source repo skills to project itself

  Installed 4 skills from referenced repositories into .claude/skills/:
  - think-before-coding (from andrej-karpathy-skills, Principle 1)
  - simplicity-guard (from andrej-karpathy-skills, Principle 2)
  - session-crystallize (from rohitg00 LLM Wiki v2, 4-tier consolidation)
  - context7-research (from upstash/context7, live docs pattern)
  The scaffolder now outputs all 4 alongside nullprobe-intro when users run `init`.
  Project eats its own dog food: same skills it ships, it uses.

## [2026-05-24] update | Multi-environment setup (nebula-horizon pattern)

  Applied parallel namespace pattern from nebula-horizon:
  - .claude/ (Claude Code) — skills, settings, karpathy plugin
  - .cursor/ (Cursor) — rules (.mdc), MCP config
  - .agent/ (Antigravity/Gemini CLI) — rules, MCP config
  MCP: context7 configured across all 3 environments (.mcp.json, .cursor/mcp.json, .agent/mcp_config.json)
  Created AGENTS.md as the multi-tool overview doc (Cursor reads this as root instructions)
  Behavioral rules (Karpathy) replicated in each tool's native format
