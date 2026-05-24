# nullprobe

A lightweight CLI that deploys a living AI collaboration layer into your project.

Instead of overloading you with multi-framework, multi-repo, multi-tool fragile setups, nullprobe asks two questions and gets out of the way:

1. **"What AI environment are you using?"** — Claude, Cursor, Gemini CLI, or Antigravity
2. **"How do you want to set up?"** — recommended tools, something specific, or search for compatible tools

That's it. Under 30 seconds. Your project gets a compounding knowledge layer that evolves with every session.

## Install

```bash
npm install -g nullprobe
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
├── AI_FRAMEWORK.md                          # Portable AI collaboration guide
├── .claude/skills/nullprobe-intro/SKILL.md  # Orientation + research skill
└── wiki/
    ├── index.md                             # Content catalog
    └── log.md                               # Session record
```

**AI_FRAMEWORK.md** — Synthesized principles from Karpathy LLM Wiki, rohitg00 memory lifecycle, andrej-karpathy-skills, skillz format, Agentic Design Patterns, and Context7. Drop it into any project for instant AI collaboration context.

**nullprobe-intro skill** — When invoked by your AI tool, it explains what was installed and prompts the AI to search for skills, tools, and techniques relevant to your environment.

**wiki/** — A living knowledge base that your AI maintains. `index.md` catalogs what's known; `log.md` tracks what happened and when.

## Philosophy

The AI tooling space is drowning in complexity. nullprobe exists because:

- You shouldn't re-derive collaboration patterns for every new project
- A simple tool that deploys the right defaults beats a complex tool with 50 configuration options
- Knowledge should compound across sessions, not reset every time
- The tool itself must obey the principles it installs

## Development

```bash
npm install
npm run dev -- init /tmp/test    # Run without building
npm run build                    # Compile TypeScript
```

## License

MIT
