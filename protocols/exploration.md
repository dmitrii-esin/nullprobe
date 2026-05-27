# Exploration Protocol

**version:** 3.0.0
**purpose:** Open-ended discovery of *genuinely new* techniques, tools, MCP servers, plugins, configurations, tips, patterns, and concepts for an AI-augmented development environment. Stops re-surfacing already-known items.
**frequency:** Weekly, or before major workflow changes / when planning a tooling refresh.
**output:** Timestamped entry in `wiki/log.md`. Optional sidecar: `wiki/exploration/YYYY-MM-DD.md` for long query traces.

---

## How to Execute This Protocol

1. Open this file. Read each step in order. Do not skip Step 0.
2. Use **every** search tool you have access to in this workspace — web search, X search, browser fetch / `browse_page`, GitHub CLI or GitHub MCP, Tavily or equivalent web MCP, Context7 (only if already installed — and only for *verifying* maturity of a discovered library, never as a discovery source).
3. The goal is **new**. If you already know it, do not record it. Treat the Step 0 exclusion list as a hard filter at the search-result level, not just at the write-up level.
4. Time-filter aggressively: prioritize 2026 content and the **last 90–180 days**. Default window is 90 days; widen to 180 only if a category returns nothing.
5. Time budget per run: **30–60 minutes**. If you reach 60 minutes with < 5 novel items, stop and log a "thin run" note (Step 6).
6. Log every query you run. The protocol is only re-runnable if the trace is honest.

---

## Prerequisites

- Network access via at least one of: web search MCP, browser fetch, X search, GitHub CLI/MCP
- Workspace open with `wiki/log.md` writable
- Today's date known
- Exclusion list (Step 0) re-read this run

---

## Step 0. Load the Exclusion List

**What:** Establish what is already known so it is filtered out at the result level — not just at the write-up.
**How:** Treat the following as already-known. **Do not** search by these names. **Do not** log them as "new findings" even when they appear in trending lists, listicles, or comparison articles. **Do not** count them in the novel-items tally.

**Already-known items (hard exclusion):**

- Karpathy skills repo / `andrej-karpathy/skills` / any "Karpathy-style skills" rehash
- `awesome-antigravity-skills` / `awesome-antigravity` catalog and its mirrors
- Context7 (`upstash/context7`) and generic RAG-over-docs lookups
- `.cursorrules` / `.cursor/rules` baseline patterns and starter rule packs
- Generic memory frameworks at headline level: Mem0 baseline, vanilla vector-store RAG, LangChain `ConversationBufferMemory`
- Generic agent frameworks at headline level: LangChain, LlamaIndex, AutoGen, CrewAI — only log a *new sub-feature* released in the last 90 days, never the framework itself
- "MCP servers exist" — only log *specific, newly-released* MCP servers (last 90 days)
- Generic prompt-engineering tips: chain-of-thought, few-shot, persona, ReAct at the textbook level
- nullprobe's existing source repos (see `src/github/sources.ts`)

**Delta rule:** if an item *extends* something on this list with a genuinely new capability released in the last 180 days, you may log the **delta** as the finding — never the base item.

**Success:** Exclusion list re-read. Mental filter active. You can recite the categories without looking.

**Prior Run Reflection (30–60 seconds):** Quickly review the last 1–2 `explore v2` (or v3) entries in `wiki/log.md`. Note what produced high-ROI self-improvement items vs noise. Adjust your mental bar or category priority for *this* run accordingly.

---

## Step 0.5. Targeted Nullprobe Self-Improvement Inquiry (Lightweight)

**What:** Run a small number of *directed* queries explicitly aimed at improving nullprobe itself, using live project state as seeds. This complements the broad sweep with goal-driven exploitation.

**How (5–12 minutes):**
- Quickly review current open items and thin spots:
  - Open or stale items in `docs/PLAN.md` (especially §0a, §4, §4a).
  - Recent "Working" vs reality gaps or backlog notes in `docs/CONTEXT.md`.
  - Last 1–2 `explore`, `audit`, or `verification` entries in `wiki/log.md`.
  - Current components that feel thin (e.g. wiki model fidelity, `update` + discovery surface, multi-env unification, robustness of network flows, `PROTOCOL_BUNDLE` evolution).

- Run 1–3 high-signal directed queries (examples — adapt to current state):
  - `wiki "4-tier consolidation" OR "procedural memory promotion" OR "Cognitive Firewall" 2026`
  - `cross-platform OR "multi-environment" (Claude OR Cursor OR Windsurf OR Antigravity OR Gemini) skill OR rules unification -bloat`
  - `table-driven OR "markdown table" protocol OR verification OR audit "best practices" OR SeleniumBase OR "ISO 29119"`
  - `MCP server discovery OR registry automation OR "mcp.so" OR smithery`
  - `knowledge OS OR "agent memory" "large scale" OR co-evolution OR "schema evolution"`

Feed any promising results into the normal triage (Step 2).

**Success:** At least one directed query executed (or an explicit note: "Skipped — thin run / no clear open self-improvement targets this cycle").

---

## Step 1. Broad Domain Sweep (Untargeted)

**What:** Cast a wide net across AI engineering, agentic tooling, and developer-workflow domains. **Do not** start from named tools.
**How:** Run open-ended queries against each resource category below. Time-filter to the last 90 days where the tool supports it.

**Resource categories** (search by domain concept — never by exclusion-list names):

| Category | What to query |
|---|---|
| **X (Latest mode)** | `agentic coding workflow since:<90d>`, `AI IDE plugin since:<90d>`, `LLM memory architecture 2026`, `developer skill system 2026`, `MCP server release since:<90d>`, `AI agent benchmark 2026` |
| **Reddit** | New + Top (Month) in `r/AI_Agents`, `r/ClaudeAI`, `r/LocalLLaMA`, `r/cursor`, `r/singularity`, `r/MachineLearning` |
| **DEV.to** | Tags `#ai`, `#llm`, `#agents`, `#productivity`, `#devtools` — last 90 days |
| **GitHub** | Trending (Daily / Weekly), Explore, plus searches like `created:>YYYY-MM-DD stars:>50 topic:ai-agents`, `topic:mcp-server pushed:>YYYY-MM-DD`, `topic:llm-tools pushed:>YYYY-MM-DD` |
| **arXiv** | `cs.AI`, `cs.CL` — last 60 days, filter for "agent" / "tool use" / "memory" / "reasoning" / "code agent" |
| **modelcontextprotocol.io** | "Recently added" servers — last 90 days |
| **Official docs / changelogs** | "What's new" for Anthropic, OpenAI, Google AI Studio, Cursor, Windsurf, Antigravity, Grok, JetBrains AI — last 90 days only |
| **Tech blogs** | Simon Willison, Latent Space, Every.to, Pragmatic Engineer (AI editions), individual researcher blogs — last 90 days; skip pure newsletter recaps |
| **Promotion-prep bucket** | MFE architecture (Module Federation 2.x, native federation), staff/L4+ engineering blogs, system-design write-ups at scale |
| **Nullprobe Self-Development (High Priority)** | `wiki "4-tier" OR "procedural memory" OR "Cognitive Firewall" OR co-evolution`, `cross-platform skill unification -bloat`, `table-driven protocol OR verification OR audit patterns`, `MCP discovery OR registry automation`, `knowledge OS OR "agent memory" lightweight large-scale` | Web, X, GitHub, arXiv, official changelogs |

**Use every available tool:**

- Web search MCP / Tavily / direct browser fetch / `browse_page` / `WebFetch`
- X semantic + keyword search (Latest mode)
- GitHub CLI (`gh search code|repos|issues`, `gh api`) or GitHub MCP
- Context7 — only to *verify* maturity of a discovered library; never as a primary discovery source
- IDE built-in search where applicable

Every query you run gets logged in Step 5. No exceptions.

**Success:** At least one query executed against each resource category, or the category is explicitly skipped with a reason recorded.

---

## Step 2. Triage Against the Exclusion List

**What:** Drop anything on the Step 0 list before evaluating substance.
**How:** For each raw result:

- Item itself on exclusion list → drop silently (track count only, for Step 6).
- Re-announcement, summary, or "Top 10 AI tools" listicle restating known items → drop.
- New *release of* or new *sub-feature of* an excluded item → keep — but the finding is the **delta**, not the base item.

**Success:** Triaged set contains zero base-level excluded items.

---

## Step 3. Substance Filter

**What:** Of remaining items, keep only what is genuinely novel **and** applicable.
**How:** Each candidate must pass all three gates:

1. **Novel** — released, published, or substantially changed in the last 180 days (prefer ≤ 90).
2. **Substantive** — not hype. Has a repo, a paper, a config, a working demo, or a credible technical write-up.
3. **Applicable** — plausibly touches at least one project axis:
   - **Skills unification** across Antigravity / Cursor / Claude Code / Grok
   - **Persistent memory / Cognitive Firewall** / agent state
   - **Deterministic protocols** (verification / security / cleanup workflow patterns)
   - **Promotion prep** — MFE architecture, technical leadership, large-scale system design
   - **Information-overload reduction / agentic workflow ergonomics**

Discard anything that fails any gate.

**Success:** Filtered list of 0–20 candidates, each with a one-line justification.

---

## Step 4. Structure Each Finding

**What:** Convert each surviving candidate into the standard finding block.
**How:** Use this **exact** template — no shortcuts, no missing fields.

```markdown
### Finding N: <Novel item name>

- **Source + date:** <URL> — <publish or release date>
- **One-sentence summary:** <what it is, one line>
- **Applicability:** <one or more of: skills unification | memory/Cognitive Firewall | protocols | promotion prep | overload reduction>
- **Why new / better:** <what existing approach this replaces or extends, and the concrete delta>
- **Recommended experiment:** <smallest, lowest-risk integration — e.g., "install in scratch workspace, run X for 20 minutes, measure Y">

**Nullprobe Integration Proposal** (choose one primary target):
- **Primary target artifact:** `AI_FRAMEWORK.md` (Part VIII) | `protocols/exploration.md` (or sibling protocol) | `docs/PLAN.md` / `CONTEXT.md` | `src/github/sources.ts` | `src/scaffolder/` (templates, protocol-bundle.ts, index.ts, platforms.ts) | `wiki/index.md` or `wiki/log.md` | `src/search/` or `update-flow.ts` | Other (name it)
- **Integration type:** Protocol enhancement (table / step / exclusion) | New tracked source or discovery backend | Skill / template candidate | Wiki model or consolidation pattern | Co-evolution / schema update | Robustness / guardrail for network content | Documentation improvement | Other (surgical)
- **Concrete micro-proposal (1-3 sentences or ready-to-paste text):** ...
```

**Success:** Every finding has the five core fields filled. The Integration Proposal block is strongly encouraged for high-ROI items (especially during self-improvement runs). No `TBD`. No "see source."

---

## Step 5. Query Trace (for re-runnability)

**What:** Record every query executed this run so the next run can avoid duplication and a human can audit the search.
**How:** Append this table to the log entry:

```markdown
### Queries Executed

| Category | Query | Tool | Hits | Kept |
|---|---|---|---|---|
| X | `agentic coding workflow since:2026-02-25` | x-search | 47 | 2 |
| GitHub | `created:>2026-03-01 stars:>100 topic:llm-agent` | gh search | 23 | 1 |
| arXiv | `cat:cs.AI agent memory 2026` | web | 18 | 0 |
| ... | ... | ... | ... | ... |
```

**Success:** Every query in the run is in the table. `Hits` and `Kept` columns populated.

---

## Step 6. Rank and Summarize

**What:** End-of-run shortlist and run-level metrics.
**How:** Append:

```markdown
### Run Summary

- **Total novel items found:** N
- **Excluded-list items skipped:** M  (silent drops; count only — no names)
- **Categories skipped (with reason):** <list or "none">
- **Time spent:** <minutes>

**Top 3 by ROI × ease-of-adoption:**

1. <Finding name> — <why top: high ROI, low effort, single experiment>
2. <Finding name> — <one-line reason>
3. <Finding name> — <one-line reason>
```

**Ranking rule:** ROI = potential impact across project axes. Ease = hours to first integration. Rank by `ROI ÷ effort`. Ties broken by directness of fit to current priorities — in this order: (1) skills unification + Cognitive Firewall, (2) deterministic protocols, (3) promotion prep.

**Success:** Shortlist has exactly 3 items (or all items if fewer than 3 found). Each has a one-line justification.

---

## Step 7. Append to Log

**What:** Write the full entry to `wiki/log.md`.
**How:** Prepend (newest first) using this header:

```markdown
## [YYYY-MM-DD HH:MM] explore v2 | Open-Ended Discovery

**Previous run:** <date from last `explore v2` entry, or "first v2 run">
**Time window:** <e.g., "publications dated 2026-02-25 → 2026-05-25">

<Findings (Step 4)>
<Queries Executed (Step 5)>
<Run Summary (Step 6)>
```

**Success:** `wiki/log.md` contains a complete entry with today's timestamp.

---

## Step 8. Synthesis & Promotion (Lightweight but Mandatory for High-ROI Items)

**What:** Translate the most promising findings into concrete, surgical contributions back into nullprobe's own living system.

**How:**
- For each item in the Top 3 (or all surviving findings on a strong run):
  - Complete the **Nullprobe Integration Proposal** block in the finding.
  - Perform at least one "file back" action for the highest-ROI items (examples):
    - Append a short synthesis note to the relevant section of `AI_FRAMEWORK.md` (following Part VIII co-evolution rule).
    - Propose a specific improvement to a protocol (new table row, exclusion, step, or lens).
    - Suggest a new entry or refinement for `docs/PLAN.md` or `CONTEXT.md`.
    - Identify a candidate for `src/github/sources.ts` or a new search backend.
    - Draft a minimal new skill template or scaffolder enhancement.
- Log the actions taken in the Run Summary (or a short "Self-Improvement Actions" subsection).

**Success:** At least the top 1–2 findings have a completed Integration Proposal, and at least one concrete contribution was filed back into a project artifact during or immediately after the run.

---

## When to Stop Early

- **60 minutes elapsed and < 5 novel items** → stop. Log a "thin run" note with a one-line hypothesis (e.g., "two weeks since last run, market quiet").
- **Every category returns only excluded items** → stop. Log "saturation" and extend next run's time window to 270 days.
- **A `security` or `breaking-change` finding appears** → finish logging the current finding, then escalate to [`security.md`](security.md) immediately.

---

## Anti-Patterns (do not do)

- Searching by names on the exclusion list.
- Re-logging an excluded item because it appears in a fresh listicle.
- "Filler" findings to hit a count — fewer real items > more shallow ones.
- Skipping the query trace because "it was obvious."
- Logging without dates — every finding needs a publish/release date.
- Using Context7 as a *discovery* tool. It is for verifying maturity of something you already found.

---

## Success Criteria (overall)

- [ ] Exclusion list re-read this run + brief prior-run reflection completed
- [ ] At least one query per resource category (or explicit skip with reason)
- [ ] Targeted Self-Improvement Inquiry (Step 0.5) executed or explicitly skipped
- [ ] Every finding follows the five-field template (+ Integration Proposal block for high-ROI items)
- [ ] Query trace recorded with hits/kept counts
- [ ] Run summary with ranked top 3, skipped-count, and Self-Improvement Actions present
- [ ] At least one concrete contribution filed back into a project artifact (AI_FRAMEWORK, PLAN, a protocol, wiki, sources, scaffolder, etc.)
- [ ] Entry appended to `wiki/log.md`
- [ ] Any `security` or `breaking-change` finding escalated to [`security.md`](security.md) and surfaced in `docs/CONTEXT.md`

---

## Alignment with Sibling Protocols (Bidirectional)

- **Outbound:** A finding tagged as a dependency / config change feeds [`verification.md`](verification.md). Security or breaking-change findings escalate immediately to [`security.md`](security.md).
- **Inbound:** Recent `audit.md` or `verification.md` runs that surface gaps should trigger a *targeted* exploration sweep (via Step 0.5) before the next full open-ended run.
- Exploration outputs are encouraged to propose concrete improvements to sibling protocols (new VER-/AUD-/SEC- rows, lenses, tables, or steps) using the Integration Proposal block.
- Sidecar files in `wiki/exploration/` are subject to [`cleanup.md`](cleanup.md) retention rules (default: keep 12 most recent).

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-05-25 | Initial version |
| 2.0.0 | 2026-05-25 | Open-ended rewrite: exclusion list, broad domain sweep, five-field finding template, query trace, ranked shortlist, time-window discipline |
| 3.0.0 | 2026-05-27 | Evolved for self-improvement use: added Targeted Nullprobe Self-Improvement Inquiry (Step 0.5), enhanced finding template with Nullprobe Integration Proposal block, new Synthesis & Promotion step, prior-run reflection, expanded self-dev discovery lenses, and stronger bidirectional sibling alignment. Designed to turn discoveries into compounding improvements to the project's own protocols, AI_FRAMEWORK, PLAN, scaffolder, wiki model, and capabilities. |
