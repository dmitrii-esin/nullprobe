# nullprobe

Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

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

nullprobe itself is set up for Claude Code, Cursor, and Antigravity/Gemini CLI in parallel:

| Environment | Config | Rules |
|-------------|--------|-------|
| Claude Code | `.claude/`, `.mcp.json` | `CLAUDE.md` |
| Cursor | `.cursor/`, `.cursor/mcp.json` | `.cursor/rules/*.mdc` |
| Antigravity / Gemini CLI | `.agent/`, `.agent/mcp_config.json` | `.agent/rules/GEMINI.md` |

Context7 MCP is configured across all three for live documentation lookup.

## Status (v0.1)

| Feature | Status |
|---------|--------|
| `nullprobe init` — scaffold 4 skills + wiki | Working |
| `nullprobe update` — check source repos for commits | Working |
| `nullprobe update` — search internet for new tools | Planned (v0.2) |
| npm publish | Not yet — install from source for now |
| Cursor/Antigravity-specific scaffold output | Planned (v0.2) |

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
