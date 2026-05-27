# Exploration Sidecar: Architecture Analysis — Reference Repository Deep Dive

> **Date:** 2026-05-27  
> **Session:** Antigravity — deep architectural analysis  
> **Parent report:** [docs/ARCHITECTURE_ANALYSIS.md](../../docs/ARCHITECTURE_ANALYSIS.md)

This sidecar preserves the raw technical details from each reference repository analysis.

---

## 1. atelier-pipeline — Full Architecture

**Repo:** https://github.com/robertsfeir/atelier-pipeline  
**License:** Apache 2.0

### Agent Roster (11 agents)

| Agent | Role | Mode |
|-------|------|------|
| Eva | Pipeline Orchestrator / DevOps | Skill (main thread) |
| Robert | Chief Product Officer | Skill + Subagent |
| Sable | Senior UI/UX Designer | Skill + Subagent |
| Sarah | Senior Software Architect | Skill + Subagent |
| Colby | Senior Software Engineer | Subagent |
| Poirot | Blind Code Investigator | Subagent |
| Sherlock | Bug Detective | Subagent |
| Agatha | Documentation Specialist | Skill + Subagent |
| Ellis | Commit Manager | Subagent |
| Distillator | Compression Engine | Subagent |
| Sentinel | Security Auditor (opt-in) | Subagent |

### Phase Sizing

| Size | When | What runs |
|------|------|-----------|
| Micro | ≤2 files, mechanical only | Colby → test → Ellis |
| Small | Bug fix, <3 files | Colby → gate → Poirot → Ellis |
| Medium | 2-4 ADR steps | Robert → Sarah → wave build → review → Agatha → Ellis |
| Large | 5+ ADR steps | Full pipeline (11 agents) |

### Brain MCP Protocol (6 tools)

| Tool | Purpose |
|------|---------|
| `agent_capture` | Save decision, lesson, preference, correction |
| `agent_search` | Semantic search across brain thoughts |
| `atelier_browse` | Paginated browse by type/status |
| `atelier_stats` | Brain health check |
| `atelier_relation` | Create typed edges (supersedes, contradicts, evolves_from) |
| `atelier_trace` | Walk relation chains |

### Key Principles
- **Wave-based QA:** Each wave = build-test-review cycle
- **12 mandatory gates:** Never skipped
- **6 enforcement hooks:** PreToolUse (path, sequencing, git), SubagentStop (DoR/DoD), PreCompact (state preservation)
- **Information asymmetry:** Parallel reviewers see constrained context to prevent anchoring
- **Loop-breaker:** 3 consecutive failures → halt + Stuck Pipeline Analysis

### Brain Cost
- OpenRouter embeddings: $0.02/1M tokens → $0.06/month for 3,500+ thoughts → <$0.72/year
- Alternatives: GitHub Models (free for Enterprise), local Ollama (free)

---

## 2. MyBrain — 8-Tool MCP Protocol

**Repo:** https://github.com/robertsfeir/mybrain  
**License:** MIT

### Tool Surface (v2.0)

| Tool | Function | Cost |
|------|----------|------|
| `agent_capture` | Store thought with dedup + conflict detection + supersedes | ~$0.0001/call |
| `agent_search` | Semantic search (relevance + importance + recency scoring) | ~$0.0001/call |
| `atelier_browse` | Paginated listing (status/type/agent/scope/human filters) | Free (SQL) |
| `atelier_stats` | Health check + counts | Free (SQL) |
| `atelier_relation` | Link via typed relation | Free (SQL) |
| `atelier_trace` | Walk relation graph | Free (SQL) |
| `atelier_hydrate` | Ingest JSONL telemetry from Claude sessions | Scales with files |
| `atelier_hydrate_status` | Poll hydration completion | Free (SQL) |

### Conflict Detection
- Similarity > 0.9 → duplicate (auto-rejected)
- Similarity 0.7–0.9 → LLM-classified (requires `conflict_llm_enabled: true`)
- Similarity < 0.7 → new thought (accepted)

### Deployment Modes
- **Bundled** (recommended): PostgreSQL + Ollama + MCP server in single container
- **Docker**: Multi-container compose
- **Native**: No Docker, Ollama on host
- **RDS**: Remote PostgreSQL, OpenRouter for embeddings

### Database Requirements
- PostgreSQL with `pgvector` and `ltree` extensions
- Migrations: `lib/db.mjs → runMigrations(pool)` auto-applies at startup

---

## 3. Mem0 — Memory Algorithm (April 2026)

**Repo:** https://github.com/mem0ai/mem0  
**License:** Apache 2.0  
**Stars:** 26k+  
**Backing:** Y Combinator S24

### Benchmark Results

| Benchmark | Old | New | Tokens | Latency p50 |
|-----------|-----|-----|--------|-------------|
| LoCoMo | 71.4 | **91.6** | 7.0K | 0.88s |
| LongMemEval | 67.8 | **94.8** | 6.8K | 1.09s |
| BEAM (1M) | — | **64.1** | 6.7K | 1.00s |
| BEAM (10M) | — | **48.6** | 6.9K | 1.05s |

### Architecture Changes (v3)
1. **Single-pass ADD-only extraction** — one LLM call, no UPDATE/DELETE. Memories accumulate.
2. **Agent-generated facts are first-class** — action confirmations stored with equal weight
3. **Entity linking** — entities extracted, embedded, linked across memories
4. **Multi-signal retrieval** — semantic + BM25 keyword + entity matching scored in parallel
5. **Temporal reasoning** — time-aware retrieval for current state, past events, future plans

### Multi-Level Memory
- **User**: Cross-session preferences and history
- **Session**: Within-conversation context
- **Agent**: Agent-specific knowledge and capabilities

### SDKs
- Python: `pip install mem0ai`
- JavaScript: `npm install mem0ai`
- CLI: `npm install -g @mem0/cli` or `pip install mem0-cli`
- Agent sign-up: `mem0 init --agent --agent-caller <name>`

---

## 4. OpenClaw — Platform Architecture

**Repo:** https://github.com/openclaw/openclaw  
**License:** MIT  
**Sponsors:** OpenAI, GitHub, NVIDIA, Vercel

### Core Architecture
- **Gateway**: Local-first control plane (sessions, channels, tools, events)
- **Channels**: WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, IRC, Teams, Matrix, LINE, and 12+ more
- **Workspace**: `~/.openclaw/workspace` with `AGENTS.md`, `SOUL.md`, `TOOLS.md`
- **Skills**: `~/.openclaw/workspace/skills/<skill>/SKILL.md`

### Security Model
- DM pairing by default (unknown senders get pairing code)
- Sandbox modes: Docker, SSH, OpenShell backends
- Default sandbox: allow bash/read/write/edit/sessions; deny browser/canvas/cron/discord/gateway

### Key Capabilities
- Multi-agent routing (isolated agents per channel/account)
- Voice Wake + Talk Mode (macOS/iOS/Android)
- Live Canvas with A2UI (agent-driven visual workspace)
- Registry: [ClawHub](https://clawhub.ai)

### Dev Setup
```bash
pnpm install
pnpm openclaw setup
pnpm gateway:watch
```

---

## 5. iii — Three Primitives

**Repo:** https://github.com/iii-hq/iii  
**License:** ELv2 (engine), Apache 2.0 (SDK)

### Mental Model: Worker → Function → Trigger

- **Workers**: Processes that register with engine, then register triggers and functions. Any language.
- **Triggers**: Declarative event bindings (HTTP, cron, queue, state change, stream, direct call)
- **Functions**: Units of work with stable identifiers (e.g., `content::classify`, `orders::validate`)

### Key Innovation
- "Zero-integration": Workers join a live catalog. Every other worker is immediately notified and can call.
- Agents can add workers at runtime, extending the system while running.
- Same interface for developers and AI agents.

### CLI
```bash
iii worker add queue
iii worker add agent
iii worker add sandbox
iii worker add <anything>
```

---

## 6. Anthropic Skills — Official Standard

**Repo:** https://github.com/anthropics/skills  
**Standard:** [agentskills.io](http://agentskills.io)

### Key Points
- Each skill is self-contained in its own folder with a `SKILL.md` file
- YAML frontmatter: name, description, allowed-tools (progressive disclosure)
- Skills range from creative (art, music, design) to technical (testing, MCP generation) to enterprise (communications, branding)
- Includes source-available production skills: docx, pdf, pptx, xlsx (powers Claude's document capabilities)
- Apache 2.0 for open-source skills

### Relevance to nullprobe
- nullprobe currently references `intellectronica/skillz` as the canonical format
- The official standard is now defined HERE at agentskills.io
- nullprobe's scaffolded skills should be audited against this standard

---

## 7. Hallmark — Anti-Slop Design Skill

**Repo:** https://github.com/Nutlope/hallmark  
**By:** Together AI

### Four Verbs
| Verb | What it does |
|------|-------------|
| *(default)* | Build new UI. Pick macrostructure, apply rules, run slop test. |
| `hallmark audit <target>` | Score existing code against anti-patterns. Punch list, no edits. |
| `hallmark redesign <target>` | Throw out structure, keep copy/IA/brand, rebuild different. |
| `hallmark study <screenshot\|URL>` | Extract DNA from a design. Refuses pixel-clones. Optionally emits portable `design.md`. |

### Architecture
- 22 themes
- 65 slop-test gates + pre-emit self-critique
- Forces different macrostructure for different briefs
- Self-contained SKILL.md format
- Works with Claude Code, Cursor, and Codex

---

## Comparison: nullprobe's wiki/log.md vs. Real Memory Systems

| Dimension | nullprobe wiki/log.md | MyBrain | Mem0 |
|:---|:---|:---|:---|
| Storage format | Flat markdown file | PostgreSQL + pgvector | Vector DB + graph + BM25 |
| Search | `grep` / manual scanning | Three-axis semantic (relevance + importance + recency) | Multi-signal (semantic + BM25 + entity linking) |
| Deduplication | None | Cosine similarity > 0.9 = auto-reject | ADD-only (no overwrites) |
| Conflict detection | None | 0.7–0.9 similarity = LLM-classified | Entity linking cross-memory |
| Knowledge decay | None (described in AI_FRAMEWORK.md) | TTL-based per thought type | Temporal reasoning |
| Consolidation | None (described in AI_FRAMEWORK.md) | Background synthesis: observations → reflections | Single-pass extraction |
| Scale | ~100 wiki pages max | 3,500+ thoughts @ $0.06/month | Benchmarked at 1M–10M tokens |
| API | None (file-only) | 8-tool MCP protocol | Python/JS SDKs + REST + MCP + CLI |
| Integration | Manual editing | Claude Code / Claude Desktop via MCP | Any LLM framework |
