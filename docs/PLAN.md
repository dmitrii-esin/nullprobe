# Development Plan

Live backlog for nullprobe. Add items here; move to CONTEXT.md "Recent changes" when shipped.

---

## 0. MCP Customization (in flight)

**Status:** Implementation done — needs e2e verification across all 4 platforms before shipping.

**Goal:** Let users opt into extra MCP servers during `nullprobe init` without violating the "two questions and done" philosophy.

**Default behavior (unchanged):** scaffold `context7` only. User answers `N` (or just presses Enter) to the new confirm prompt.

**Opt-in flow:**

1. New confirm in `src/flows/init-flow.ts`: `"Customize MCP servers? (default scaffolds context7 only)"` — default `false`.
2. If `true`, an `@inquirer/prompts` `checkbox` is shown with the registry from `src/scaffolder/templates/mcp-context7.ts → EXTRA_MCP_CHOICES`.
3. Selected IDs flow as `InitAnswers.extraMcps` into the scaffolder, which calls `buildMcpConfig(extras)` to produce the merged MCP config (context7 + selected extras) for the platform-specific path.

**Optional MCP registry (current):**

| ID | Package | Why |
|----|---------|-----|
| `shadcn` | `npx shadcn@latest mcp` | UI component registry — useful in shadcn-based projects |
| `chrome-devtools` | `npx -y chrome-devtools-mcp` | Browser debugging from the AI |
| `github` | `npx -y @modelcontextprotocol/server-github` | Repo/issue/PR access; needs `GITHUB_PERSONAL_ACCESS_TOKEN` |

**To finish:**

- [ ] Manual e2e: run `npm run dev -- init /tmp/test-mcp-custom` for each of the 4 platforms with one or more extras selected; confirm the produced MCP config contains exactly the expected servers and that `merge-mcp` still preserves user-added entries on re-run.
- [ ] Update `docs/PLAN.md` §2 verification — add an `2.9` scenario for MCP customization.
- [ ] Consider widening the registry once we have data on what users actually want (track requests in `wiki/log.md`).

**Dev-session note:** The repo's own MCP configs (`.mcp.json`, `.cursor/mcp.json`, `.agent/mcp_config.json`, `.gemini/settings.json`) ship with all 4 MCPs (context7 + shadcn + chrome-devtools + github) so contributors hacking on nullprobe have full tooling. The CLI **does not** scaffold this expanded set into target projects by default — it stays lean (context7 only) unless the user opts into extras via the new prompt.

---

## 0a. MCP Discovery Source

**Status:** Not started

**Goal:** Surface new/popular MCPs to users via `nullprobe update` and `protocols/exploration.md` so the optional-MCP registry stays current without manual curation.

**Candidates:**

| Source | Type | Notes |
|--------|------|-------|
| [mcp.so](https://mcp.so) | Aggregator, web-scrape | Largest community catalog. No public API confirmed — would need HTML scrape or RSS. |
| [smithery.ai](https://smithery.ai) | Aggregator + registry | Has a documented registry JSON; first choice if API is stable. |
| [glama.ai/mcp](https://glama.ai/mcp/servers) | Aggregator | Quality-curated; useful for "trending" signal. |
| `modelcontextprotocol/servers` GitHub | Official | Already accessible via existing `@octokit/rest` plumbing in `src/github/`. Cheapest first hop. |

**Action items:**

1. Pick the registry/API with the most reliable JSON endpoint (likely Smithery).
2. Add a new source to `src/github/sources.ts` (or a new `src/search/mcp-registry.ts` if non-GitHub) returning `{ name, package, description, popularity }` rows.
3. Add an "MCP discovery" branch to `nullprobe update` that appends findings to `wiki/log.md` like the existing search backends.
4. Document in `protocols/exploration.md` as a third source (after Tavily and GitHub).

---

## 1. Test Coverage

**Status:** Not started

**Scope:**

| Area | What to test |
|------|-------------|
| `skill-to-mdc` | `parseSkillMeta` extracts name/description/allowedTools from real SKILL.md strings; `stripSkillFrontmatter` removes exactly the frontmatter block; `wrapAsMdc` produces valid `.mdc` with correct `alwaysApply` values for all 4 skills |
| `platforms` | `skillPath()` returns correct paths per platform; `extraFiles()` returns empty array for claude/gemini-cli, one ExtraFile per skill for cursor/antigravity; ExtraFile `relPath` matches `skillPath()` |
| `file-writer` | `mergeMcpServers`: all 6 cases from the source comment (no file, unreadable, invalid JSON, no key, idempotent, merge); `atomicWrite` leaves no temp file on failure |
| `scaffolder/index` | `scaffold()` with each platform produces the correct file list; second call on same dir does not wipe existing MCP servers |
| `search/tavily` | HTTP status → `TavilyErrorCode` mapping; network error → `NETWORK_ERROR`; happy path maps `published_date` → `publishedDate` |
| `search/github` | `enrichQuery` pass-through when AI term present; disjunction appended when absent; `RateLimitError` thrown on 403/429 |
| `wiki/append` | `buildBlock` format (H2 heading, indented lines, `---` fence); no-op when wiki/log.md does not exist; appends without truncating existing content |

**Stack recommendation:** Vitest (fast, native ESM, no transform config needed for this project).

**Acceptance:** `npm test` passes with ≥80% branch coverage on the above modules.

---

## 2. Verification Plan

Actionable checklist to confirm all functional requirements after any change. Run top-to-bottom before tagging a release.

### 2.1 Claude scaffold

```bash
rm -rf /tmp/test-claude && npm run dev -- init /tmp/test-claude
# Select: Claude → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-claude/AI_FRAMEWORK.md` exists and is non-empty
- [ ] `/tmp/test-claude/wiki/index.md` exists
- [ ] `/tmp/test-claude/wiki/log.md` exists
- [ ] `/tmp/test-claude/.mcp.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-claude/.claude/skills/nullprobe-intro/SKILL.md` — contains `name: nullprobe-intro`
- [ ] `/tmp/test-claude/.claude/skills/think-before-coding/SKILL.md` exists
- [ ] `/tmp/test-claude/.claude/skills/simplicity-guard/SKILL.md` exists
- [ ] `/tmp/test-claude/.claude/skills/session-crystallize/SKILL.md` exists
- [ ] No `.cursor/` or `.antigravitycli/` directory created

### 2.2 Cursor scaffold

```bash
rm -rf /tmp/test-cursor && npm run dev -- init /tmp/test-cursor
# Select: Cursor → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-cursor/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-cursor/.cursor/mcp.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-cursor/.cursor/rules/nullprobe-intro.mdc` — starts with `---`, contains `alwaysApply: false`
- [ ] `/tmp/test-cursor/.cursor/rules/think-before-coding.mdc` — contains `alwaysApply: true`
- [ ] `/tmp/test-cursor/.cursor/rules/simplicity-guard.mdc` — contains `alwaysApply: true`
- [ ] `/tmp/test-cursor/.cursor/rules/session-crystallize.mdc` — contains `alwaysApply: false`
- [ ] No `.claude/skills/` directory created

### 2.3 Antigravity scaffold

```bash
rm -rf /tmp/test-antigravity && npm run dev -- init /tmp/test-antigravity
# Select: Antigravity → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-antigravity/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-antigravity/.agent/mcp_config.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/nullprobe-intro.md` — starts with `---`
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/think-before-coding.md` exists
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/simplicity-guard.md` exists
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/session-crystallize.md` exists
- [ ] No `.claude/skills/` or `.cursor/rules/` created

### 2.4 Gemini CLI scaffold

```bash
rm -rf /tmp/test-gemini && npm run dev -- init /tmp/test-gemini
# Select: Gemini CLI → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-gemini/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-gemini/.gemini/settings.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-gemini/.claude/skills/nullprobe-intro/SKILL.md` exists (fallback)
- [ ] No `.cursor/rules/`, `.antigravitycli/rules/`, or `.agent/` created

### 2.5 Overwrite guard + MCP merge safety

```bash
# Run once to create the baseline
rm -rf /tmp/test-merge && npm run dev -- init /tmp/test-merge
# Select: Cursor → confirm path

# Manually add a second MCP server to simulate an existing config
node -e "
  const p = '/tmp/test-merge/.cursor/mcp.json';
  const c = JSON.parse(require('fs').readFileSync(p, 'utf8'));
  c.mcpServers.myserver = { command: 'node', args: ['server.js'] };
  require('fs').writeFileSync(p, JSON.stringify(c, null, 2));
"

# Run again on the same directory
npm run dev -- init /tmp/test-merge
# Select: Cursor → confirm overwrite when prompted
```

Expected:
- [ ] CLI prompts "These files already exist" before overwriting
- [ ] After second run: `/tmp/test-merge/.cursor/mcp.json` still contains `mcpServers.myserver` (merge preserved it)
- [ ] `/tmp/test-merge/.cursor/mcp.json` still contains `mcpServers.context7`

### 2.6 Update — GitHub search

```bash
npm run dev -- update
# Select: Search → query: "memory management" → GitHub backend
```

Expected:
- [ ] Spinner shows, then succeeds
- [ ] At least 1 result printed with title + URL
- [ ] `wiki/log.md` in cwd has a new `## [today] search | GitHub search` entry

### 2.7 Update — Tavily search

```bash
TAVILY_API_KEY=tvly-xxx npm run dev -- update
# Select: Search → query: "cursor rules 2025" → Tavily backend
```

Expected:
- [ ] Spinner shows, then succeeds
- [ ] At least 1 result printed with title + URL + content snippet
- [ ] `wiki/log.md` has a new `## [today] search | Tavily search` entry

### 2.8 Tavily not configured — setup message

```bash
unset TAVILY_API_KEY && npm run dev -- update
# Select: Search → any query → Tavily backend
```

Expected:
- [ ] Setup instructions printed (sign-up URL, export command, reload + re-run)
- [ ] `wiki/log.md` has a `Queued Tavily search` entry (not a real search entry)
- [ ] Process exits cleanly (no error thrown)

### 2.9 Optional MCP customization

```bash
rm -rf /tmp/test-mcp-custom && npm run dev -- init /tmp/test-mcp-custom
# Select: Claude → recommended → confirm path
# At "Customize MCP servers?" answer: Y
# In checkbox: pick shadcn + github
```

Expected:
- [ ] `/tmp/test-mcp-custom/.mcp.json` contains `mcpServers.context7`, `mcpServers.shadcn`, `mcpServers.github`
- [ ] `mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN` is the literal `${GITHUB_PERSONAL_ACCESS_TOKEN}` (env-var ref, not a real token)
- [ ] No `chrome-devtools` entry
- [ ] Re-run with the same selections + a manually-added third server → merge-mcp preserves the manual entry

Repeat with `cursor`, `gemini-cli`, `antigravity` to confirm parity at `.cursor/mcp.json`, `.gemini/settings.json`, `.agent/mcp_config.json`.

### 2.10 Optional QA protocols (full set of 5)

```bash
rm -rf /tmp/test-protocols && npm run dev -- init /tmp/test-protocols
# Select any platform → recommended (or specific)
# At "Include customizable QA protocols...?" answer: Y
# Enter: login flow, checkout (for verification seeding)
```

Expected:
- [ ] All five files exist: `protocols/README.md` + `verification.md`, `audit.md`, `security.md`, `exploration.md`, `cleanup.md`
- [ ] `verification.md` contains seeded VER-100+ rows from the provided priorities
- [ ] All files follow the generalized (lighter, more extensible) style with clear "Add your own..." sections
- [ ] Re-run triggers overwrite guard for all protocol paths (via ALWAYS_WRITTEN)
- [ ] AI_FRAMEWORK.md (in the target) contains Part IX describing the full set of five protocols

Run on at least two different platforms (e.g. Claude + Cursor) to confirm platform-agnostic behavior.

---

## 4. Generalizable / User-Facing QA Protocols

**Status:** v1 complete (verification + audit). Remaining three protocols (security, exploration, cleanup) implemented in follow-up.

**Goal:** Evolve the internal `/protocols/` runbooks into **general-purpose, less-specific, customizable QA protocols** that can be optionally shipped to end users via `nullprobe init`.

**Vision:** After a user runs `nullprobe init`, their project can receive a full set of living operational protocols (verification, audit, security, exploration, cleanup) with clear extension points so teams can add their own domain-specific checks.

**v1 Scope (Completed):**
- Generalized `verification.md` (3-column table style + optional priority seeding)
- Generalized `audit.md` (multi-lens structured findings table)
- `protocols/README.md` with usage + extension guidance
- Single optional "Include customizable QA protocols?" confirm during init (default off)
- Wiring + AI_FRAMEWORK Part IX integration
- Verification scenario 2.10

**v2 Scope (Completed in this session):**
- Generalized `security.md`
- Generalized `exploration.md`
- Generalized `cleanup.md`
- Full set of 5 protocols now ships together when user opts in
- Documentation updates across PLAN, README, CLAUDE.md, AGENTS.md, etc.

**Why this matters**
- Most projects lack good, living verification and audit practices.
- The current protocols (especially the multi-lens audit + deterministic verification tables) are genuinely high quality.
- Shipping generalized versions (with easy customization) would make nullprobe dramatically more useful for long-term project health, not just initial AI setup.

**Core Challenges**
- Current protocols are deeply nullprobe-specific: hardcoded paths (`src/`, `/tmp/test-*`), commands (`npm run dev -- init`), references to our PLAN.md §2 matrix, our own file-writer tests, etc.
- Need clean separation: nullprobe's own protocols (stay in this repo under `/protocols/`) vs. generalized templates (what gets scaffolded into user projects).
- Customization without bloat: How do we let users inject their own test cases / project specifics without violating the "two questions and done" + lightweight philosophy?
- Delivery format: Should generalized protocols live as a top-level `protocols/` folder in the target project? As a new skill? Inside `wiki/protocols/`? Generated as `QA_PROTOCOLS.md`? Or something else?
- Maintenance & evolution: Should `nullprobe update` be able to pull improved versions of the generalized protocol templates over time?

**Possible Delivery & Extension Models (to evaluate)**
- Optional step during `init`: "Include customizable QA protocols for this project?" (default: No, to protect simplicity).
- If enabled: light questionnaire or free-text input for 1–3 key verification scenarios or risk areas specific to the user's project.
- Scaffold a clean `protocols/` directory containing generalized, templated versions of the five protocols + a strong `README.md` explaining how to customize and add new cases (VER- / AUD- style).
- Provide "starter packs" seeded from the user's answers (e.g., "web frontend project", "CLI tool", "data/ML pipeline", "library").
- Clear patterns for extension: documented "Add your own test cases here" sections with examples.
- Optional: a tiny generator that turns user-provided bullet points into properly formatted test case table entries.

**Non-Goals (for v1)**
- Do not force protocols on every user.
- Do not make the init flow significantly longer.
- Do not try to auto-generate sophisticated test cases — keep the user in control of domain specifics.

**Next Actions**
- [x] Research + design (completed in original session)
- [x] Create generalized templates for verification + audit (v1)
- [x] Wire optional path + update AI_FRAMEWORK.md + add verification scenario
- [x] Expand to full set: security, exploration, cleanup generalized versions
- [x] Update all main documentation (README, CLAUDE, AGENTS, PLAN, etc.)
- [ ] Decide + implement whether generalized protocols should be refreshable via `nullprobe update` command (deferred)

**Research Notes**
- See the detailed best-practice research and examples (SeleniumBase markdown case plans, ISTQB-aligned templates, pen-test finding formats, ISO 29119-3) captured in the conversation leading to this item.
- Strong inspiration possible from how the current audit table and verification steps already work well when made deterministic and table-driven.

### 4a. Related Future Research: AI Tools & Memory Systems Analysis

**Status:** Research complete — two distinct reports produced across separate sessions on the same set of sources:

- [EXPLORATION_REPORT.md](./EXPLORATION_REPORT.md) — Initial short synthesis table (Antigravity / parallel session)
- [exploration-2026-05-27-mandated-sources.md](./exploration-2026-05-27-mandated-sources.md) — Deep v3 protocol execution with structured Step 4 findings, query trace, and concrete integration proposals

→**Goal:** Study advanced multi-agent architectures and modern AI agent memory systems as input for both:
- Improving nullprobe's own internal protocols, wiki memory model, and update mechanisms.
- Informing the design of generalized, user-shippable protocols (especially how verification/audit protocols could themselves incorporate better memory, cross-finding synthesis, quality gates, and institutional learning patterns).

**Key resources to analyze:**

- https://dev.to/zoharbabin/building-a-13-agent-ai-system-for-ma-due-diligence-architecture-deep-dive-20ah  
  (13-agent neurosymbolic M&A due diligence system: async pipeline, specialist + meta agents, deterministic cross-domain trigger rules, 5 blocking quality gates, citation verification, entity resolution, persistent knowledge base that compounds across runs, "make every run smarter than the last". Many direct parallels to nullprobe's audit + verification philosophy.)

- https://github.com/mem0ai/mem0  
  (Leading open-source agent memory framework — vector + graph, fact extraction, user/session/agent scoped memory. Widely adopted.)

- https://vectorize.io/articles/best-ai-agent-memory-systems  
  (Excellent 2026 comparison of 8 major agent memory frameworks: Mem0, Hindsight, Letta (ex-MemGPT), Zep/Graphiti, Cognee, etc. Strong distinctions between personalization vs institutional knowledge, multi-strategy retrieval, synthesis/reflect steps, temporal graphs, tiered/OS-inspired memory, and real production trade-offs.)

- https://github.com/paralleldrive/aidd  
  (AIDD Framework — comprehensive "AI Driven Development" system with CLI, large library of reusable agent skills, SudoLang structured prompting language, opinionated workflows (/discover → /task → /execute → /review), heavy emphasis on TDD, quality gates, and preventing AI-generated technical debt. Very relevant as a peer project in the "structured AI collaboration" space.)

This research is particularly relevant because nullprobe's core offering is *deploying living procedural memory + skills + protocols*. Understanding how the best current memory systems handle extraction, retrieval, synthesis, quality, and compounding knowledge will improve both the product and the protocols we ship.

---

### 4b. (Reserved for future related items)

---

## 5. Architecture Analysis Review — Strategic Direction Decision

**Status:** Review pending — materials saved, decision needed.

**Context:** A deep architectural analysis compared nullprobe against 13 reference repositories (Antigravity session, 2026-05-27). The analysis identified 9 gaps (1 critical, 2 high, 3 medium, 2 low, 1 nit) and proposed 3 strategic paths forward.

**Saved Materials:**

| Document | Location | Contents |
|----------|----------|----------|
| Full analysis report (Claude) | [docs/ARCHITECTURE_ANALYSIS.md](./ARCHITECTURE_ANALYSIS.md) | 9 gap findings, competitive matrix, 5 core questions answered, strategic paths |
| Technical sidecar (Claude) | [wiki/exploration/2026-05-27-architecture-analysis.md](../wiki/exploration/2026-05-27-architecture-analysis.md) | Raw reference data: agent rosters, MCP protocols, benchmarks, tool surfaces |
| Consolidated synthesis (Grok xAI) | [docs/ARCHITECTURE_ANALYSIS_2026-05-27.md](./ARCHITECTURE_ANALYSIS_2026-05-27.md) | 5 core Qs, 7 high-impact questions, gaps table, recommendations |
| Gaps & Proposed Solutions (Antigravity CLI) | [docs/architecture-gaps-exploration.md](./architecture-gaps-exploration.md) | Parallel exploration/gaps synthesis report |
| Wiki index | [wiki/index.md](../wiki/index.md) | Updated with all new repos + architecture analysis section |
| Wiki log | [wiki/log.md](../wiki/log.md) | Session record with key findings summary |

**Critical Gaps to Resolve:**

| ID | Severity | Gap | Quick Fix? |
|----|----------|-----|-----------|
| GAP-01 | Critical | AI_FRAMEWORK.md describes 4-tier memory system that isn't implemented | Yes — simplify docs OR scaffold MyBrain MCP |
| GAP-02 | High | Wrong skills standard (intellectronica/skillz → agentskills.io) | Yes — template text update |
| GAP-03 | High | No runtime intelligence after scaffolding | No — strategic decision needed |
| GAP-04 | Medium | Update command has no dedup/relevance scoring | Medium effort |
| GAP-05 | Medium | Protocol meta-work outweighs actual feature development | Process change |
| GAP-06 | Medium | No skill discovery / community integration | Medium effort |

**Strategic Decision Required:**

| Path | Description | Risk | ROI |
|------|-------------|------|-----|
| **1. Stay lightweight scaffolder** | Simplify AI_FRAMEWORK.md to match reality, add `nullprobe add <skill>`, call it done | Low | Medium |
| **2. Memory-aware scaffolder** | Keep scaffolding + integrate MyBrain/Mem0 MCP as optional component (like context7) | Medium | **High** |
| **3. Runtime system** | Add MCP server, hooks, quality gates → atelier-pipeline-lite | High (scope creep) | High |

**Open Questions:**

1. Have you evaluated atelier-pipeline hands-on?
2. Are you aware of the [agentskills.io](http://agentskills.io) standard?
3. Intended audience: individual devs bootstrapping, or teams establishing shared practices?
4. Protocol meta-work: product feature (shipped to users) or development practice (for building nullprobe)?
5. Which strategic path resonates?

**Action Items:**

- [ ] Review [docs/ARCHITECTURE_ANALYSIS.md](./ARCHITECTURE_ANALYSIS.md) — full report with competitive analysis
- [ ] Review [wiki/exploration/2026-05-27-architecture-analysis.md](../wiki/exploration/2026-05-27-architecture-analysis.md) — technical details on each reference repo
- [ ] Decide strategic direction (Path 1/2/3)
- [ ] Fix GAP-02 (wrong skills standard) — low effort, no strategic dependency
- [ ] Address GAP-01 (documentation-implementation mismatch) — depends on strategic path chosen
- [ ] Consider adding MyBrain or Mem0 to `EXTRA_MCP_CHOICES` (highest-ROI quick win for Path 2)

---

## 3. Language-Agnostic Distribution

**Status:** Research complete — implementation not started

**Goal:** Users without Node.js installed should be able to install nullprobe. The npm channel remains primary; everything below adds reach.

### Recommended path (phased)

**Phase 1 — Foundation (prerequisite for all non-npm channels)**

Add a GitHub Actions release workflow:
- Trigger: `push` to `v*` tags
- Matrix: 5 `bun build --compile` targets → `nullprobe-darwin-arm64`, `nullprobe-darwin-x64`, `nullprobe-linux-x64`, `nullprobe-linux-arm64`, `nullprobe-linux-x64-musl`
- Attach binaries as GitHub Release assets

This requires adding Bun as a build dependency (dev-only). No runtime changes to the source.

**Phase 2 — High reach, low effort**

| Channel | Work | Notes |
|---------|------|-------|
| **npm** | Already planned | `npm publish`. Requires Node.js ≥18. |
| **pnpm** | Zero | pnpm installs from npm registry automatically. |
| **curl install script** | ~50 lines bash | Detects OS/arch, downloads binary from GitHub Releases, places in `~/.local/bin` or `/usr/local/bin`. Host at `nullprobe.sh/install` or as `install.sh` in the repo root. |

**Phase 3 — Package managers**

| Channel | Effort | Notes |
|---------|--------|-------|
| **Homebrew tap** | Medium | Create `dmitrii-esin/homebrew-nullprobe` repo with a Formula pointing to GitHub Release tarballs + SHA256s. Must update checksums on each release (automatable via CI). |
| **Scoop bucket (Windows)** | Low-Medium | Create `dmitrii-esin/scoop-nullprobe` repo with a JSON manifest. Simpler review than Winget. |
| **Winget (Windows)** | Medium | Submit manifest YAML to `microsoft/winget-pkgs`. Community-reviewed, takes days to merge. |

**Phase 4 — Optional**

| Channel | Effort | Notes |
|---------|--------|-------|
| **Docker** | Low | `FROM scratch` + musl binary. Publish to GHCR. Useful for CI environments. |
| **Snap** | Medium | `snapcraft.yaml`, Snap Store review. Linux-only. |

**Do not pursue:** Flatpak (sandboxing hostile to CLI filesystem access), apt/deb (PPA maintenance overhead), pip/pipx (JS-in-Python shim is unusual and confusing to users).

### Implementation notes

- nullprobe's dependencies (`@octokit/rest`, `@inquirer/prompts`, `chalk`, `commander`, `ora`) have no native addons — `bun build --compile` will work without modifications.
- The musl Linux target (`bun-linux-x64-musl`) is required for Alpine-based containers and some CI runners.
- The `install.sh` script is the single highest-leverage deliverable: one command, zero runtime dependencies, works on any POSIX shell.

**2026 Update:** During pre-release preparation we evaluated universal orchestration tools. **GoReleaser v2** (with new Node SEA builder support) is the recommended engine to eventually drive binaries + Homebrew + Scoop + GitHub Releases from a single tag. See the companion document `docs/RELEASE_ORCHESTRATION_EVALUATION.md` for the full rationale and comparison with JReleaser. The phased plan above remains valid; GoReleaser is the implementation vehicle for Phases 1–3.

---

## 5. Architecture & Positioning Review (2026-05-27 Analysis)

**Status:** Analysis complete and persisted. Review + decision pending.

**Goal:** Review the major external architecture comparison performed on 2026-05-27 and decide on positioning, roadmap, and any lightweight follow-ups while preserving the "lightweight above all" charter.

**Background:**
- Wide comparison of nullprobe against 13 repositories (strongest signal from rohitg00/agentmemory + iii-hq/iii, OpenClaw, Anthropic skills + Hallmark, mem0, and the other sources already tracked in `src/github/sources.ts`).
- Performed with three specialized sub-agents (Memory Systems, Skills/Runtime, Synthesizer).
- Core tension identified: nullprobe's philosophy is a faithful transcription of the cited memory models, but the delivered mechanism is static/manual while the actual implementations provide automatic hooks, hybrid search, graphs, and runtime extensibility.

**Key Deliverables (review these first):**
- Primary synthesis: `docs/ARCHITECTURE_ANALYSIS_2026-05-27.md` (executive summary, consolidated gaps table, answers to the 5 core questions, 7 most important questions for the owner with impact notes, pros/cons table, prioritized recommendations).
- Detailed sub-agent reports (in session `/tmp/nullprobe-analysis/`):
  - `subagent-memory-architect-report.md`
  - `subagent-skills-runtime-expert-report.md`
- Local clones for inspection: `/tmp/nullprobe-analysis/{iii,agentmemory}/`
- Also logged in `wiki/log.md` and `wiki/index.md`.

**Specific Items to Decide:**
- Positioning change (zero-code headline update): clearly frame nullprobe as the durable institutional bootstrap + protocol layer, with explicit complementarity to agentmemory/iii for automatic capture.
- Whether to introduce a `SKILL_BUNDLE` registry (mirroring the successful `PROTOCOL_BUNDLE` pattern).
- Whether to ship one thin high-signal "agentmemory adapter" skill.
- How much wiki model evolution guidance to add (4-tier fidelity, optional graph support, etc.).
- Prioritization of the 7 "Most Important Questions" listed in the analysis document.
- Any content lifts for the generalized protocols based on the earlier expert audits + this new external view.

**Non-Goals:**
- Do not turn nullprobe into a full memory runtime or agent host.
- Do not violate the two-questions lightweight promise.

**Suggested First Action After Review:**
Add chosen direction(s) as concrete, small, surgical items under this section or as new sub-bullets. Update `docs/CONTEXT.md` Recent changes when decisions are made.

---

## 6. Addressing Architectural Gaps (Exploration 2026-05-27)

**Status:** Research & solutions proposed — implementation not started.

**Goal:** Address the three critical architectural gaps identified during the comparison of nullprobe against 13 external GenAI projects (openclaw, mem0, agentmemory, etc.). The solutions maintain nullprobe's "Lightweight above all" philosophy while scaling capabilities.

**Reference Material:**
- Review the detailed gap analysis and proposed solutions in [docs/architecture-gaps-exploration.md](./architecture-gaps-exploration.md).

**Action Items:**
- [ ] **Gap 1: Wiki Fatigue (Memory Consolidation):** Implement a rolling-window memory mechanism into the `session-crystallize` skill. Instead of vector DBs, the skill will periodically summarize stale entries from `wiki/log.md` into `wiki/index.md` and truncate the log.
- [ ] **Gap 2: Passive Skill Discoverability:** Update `AI_FRAMEWORK.md` to mandate the LLM to actively read the `.claude/skills/` or `.cursor/rules/` directory at the start of every session, rather than relying passively on IDE injection.
- [ ] **Gap 3: Semantic Tooling Backup:** Create a new scaffolded skill (e.g., `search-codebase`) that acts as a wrapper around native CLI tools like `ripgrep` (`rg`) to give the LLM semantic-like search powers without a heavy database.
