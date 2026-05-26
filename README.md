# nullprobe

A lightweight AI collaboration layer for your project. Deploys procedural memory, behavioral principles, and a living wiki so your AI session compounds knowledge instead of starting from zero every time.

> **Scope:** nullprobe ships generic AI-process skills (think-before-coding, simplicity-guard, session-crystallize, orientation). It does **not** ship stack-specific packs for frontend / backend / ML today — those are tracked for v0.3. If you need stack-aware skills now, layer them on top of what nullprobe scaffolds.

Instead of overloading you with multi-framework, multi-repo, multi-tool fragile setups, nullprobe asks two questions and gets out of the way:

1. **"What AI environment are you using?"** — Claude, Cursor, Gemini CLI, or Antigravity
2. **"How do you want to set up?"** — recommended tools, something specific, or search for compatible tools

That's it. Under 30 seconds. Your project gets a compounding knowledge layer that evolves with every session.

## Install

```bash
git clone https://github.com/dmitrii-esin/nullprobe.git
cd nullprobe
npm install
npm run build
npm link
```

## Usage

```bash
# Scaffold into current directory
nullprobe init

# Scaffold into a specific path
nullprobe init ./my-project

# Check source repos for new tools and techniques
nullprobe update
```

## What it creates

```text
your-project/
├── AI_FRAMEWORK.md
├── wiki/
│   ├── index.md                              # Content catalog
│   └── log.md                                # Session record
└── .claude/skills/
    ├── nullprobe-intro/SKILL.md              # Orientation + research skill
    ├── think-before-coding/SKILL.md          # Karpathy Principle 1
    ├── simplicity-guard/SKILL.md             # Karpathy Principle 2
    └── session-crystallize/SKILL.md          # rohitg00 4-tier memory capture
```

**AI_FRAMEWORK.md** — Synthesized principles from Karpathy LLM Wiki, rohitg00 memory lifecycle, andrej-karpathy-skills, skillz format, Agentic Design Patterns, and Context7. Drop it into any project for instant AI collaboration context.

**Skills** — Four ready-to-invoke skills covering project orientation, pre-coding discipline, complexity review, and end-of-session knowledge capture. Skills are in `.claude/skills/` but the patterns apply to any AI environment.

**wiki/** — A living knowledge base that your AI maintains. `index.md` catalogs what's known; `log.md` tracks what happened and when.

## Philosophy

The AI tooling space is drowning in complexity. nullprobe exists because:

- You shouldn't re-derive collaboration patterns for every new project
- A simple tool that deploys the right defaults beats a complex tool with 50 configuration options
- Knowledge should compound across sessions, not reset every time
- The tool itself must obey the principles it installs

## Multi-environment support

`nullprobe init` scaffolds for any of these AI environments:

| Environment | MCP config | Skills / rules path |
|-------------|------------|---------------------|
| Claude Code | `.mcp.json` | `.claude/skills/<name>/SKILL.md` |
| Cursor | `.cursor/mcp.json` | `.cursor/rules/<name>.mdc` |
| Gemini CLI | `.gemini/settings.json` | `GEMINI.md` (skills inlined as H2 sections — Gemini's current preview has no multi-file skill loader) |
| Antigravity (Windsurf) | `.agent/mcp_config.json` | `.antigravitycli/rules/<name>.md` |

Context7 MCP ships by default in every environment for live library documentation. Use the "specific" path during `init` to opt into additional MCPs (shadcn, chrome-devtools, github).

## Status (v0.2)

| Feature | Status |
|---------|--------|
| `nullprobe init` — scaffold AI collaboration layer (4 skills + wiki) | Working |
| `nullprobe update` — check source repos for commits | Working |
| `nullprobe update` — search internet (GitHub + Tavily) for new tools | Working |
| Multi-environment scaffold (Claude / Cursor / Antigravity / Gemini CLI) | Working |
| Gemini CLI: skills inlined into generated `GEMINI.md` (no multi-file loader yet) | Working |
| Stack-specific skill packs (frontend / backend / ML) | Not yet — `nullprobe` ships generic AI-collaboration skills today; stack-aware packs are tracked for v0.3 |
| npm publish | Not yet — install from source for now |

## Development

```bash
npm install
npm run dev -- init /tmp/test    # Run without building
npm run build                    # Compile TypeScript
```

See `AGENTS.md` for multi-environment contribution setup.

## Protocols

Operational runbooks live in [`/protocols/`](protocols/README.md). Any AI in this workspace can locate and follow them without extra instructions.

| Protocol | Purpose | npm script |
|----------|---------|------------|
| [Exploration](protocols/exploration.md) | Discover AI environment updates and new tools | `npm run protocol:explore` |
| [Verification](protocols/verification.md) | Full test + spec cross-check before release | `npm run protocol:verify` |
| [Security](protocols/security.md) | OWASP scan, secrets, deps, permissions | `npm run protocol:security` |
| [Cleanup](protocols/cleanup.md) | Remove artifacts, restore clean workspace | `npm run protocol:cleanup` |

## License

MIT
