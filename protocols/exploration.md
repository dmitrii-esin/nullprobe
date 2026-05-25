# Exploration Protocol

**version:** 1.0.0
**purpose:** Continuous discovery of relevant AI environment updates — new tools, techniques, versions, and concepts applicable to nullprobe and the broader AI engineering workflow.
**frequency:** Run at the start of a session or when `nullprobe update` surfaces new commits.
**output:** Timestamped entries appended to `wiki/log.md`.

## Prerequisites

- Network access (web search or Tavily MCP)
- Write access to `wiki/log.md`
- Familiarity with the sources listed in Step 1

---

## Steps

### 1. Define Search Scope

**What:** Identify the sources to check this run.
**How:** Always include:
  - X / Twitter: search `#AIcoding #ClaudeCode #CursorAI #GeminiCLI`
  - DEV.to: search `ai agents workflow tools 2025`
  - Reddit: `r/LocalLLaMA`, `r/ClaudeAI`, `r/ChatGPT` — top posts this week
  - Blogs: Karpathy (karpathy.ai), Simon Willison (simonwillison.net), LangChain blog
  - Reference repos (check for new commits since last run):
    - `andrej-karpathy/llm.c` and karpathy skill repos
    - `rohitg00/LLM-Wiki` or equivalent memory technique repos
    - `upstash/context7`
    - `awesome-antigravity` (if public)
    - nullprobe source repos tracked in `src/github/sources.ts`
**Success:** A defined list of sources for this run, no sources skipped without a reason.

---

### 2. Execute Searches

**What:** Run queries across all sources in scope.
**How:**
  ```
  For web search (Tavily MCP or browser):
    query: "AI coding workflow tools 2025 new"
    query: "Claude Code skills techniques"
    query: "LLM memory techniques session persistence"
    query: "Cursor AI rules best practices"
    query: "agentic coding workflow OWASP"

  For each reference repo:
    Check commits since last exploration date (see wiki/log.md for last run)
    Note: new releases, breaking changes, new features, deprecations
  ```
**Success:** Raw results collected for every source. No source silently skipped.

---

### 3. Extract and Filter

**What:** From raw results, extract only items applicable to nullprobe or AI engineering workflows.
**How:** For each result, ask:
  - Does this change how nullprobe scaffolds skills or wikis?
  - Does this affect Claude Code / Cursor / Gemini CLI configuration?
  - Is this a new tool, version, or pattern worth adding to AI_FRAMEWORK.md or wiki?
  - Does this reveal a security, deprecation, or breaking-change risk?

  Discard: unrelated news, marketing content, duplicate coverage of known items.
**Success:** A filtered list of ≥1 and ≤20 actionable findings.

---

### 4. Classify Each Finding

**What:** Tag each finding for routing.
**How:** Apply one tag per finding:

  | Tag | Meaning |
  |-----|---------|
  | `new-tool` | A new CLI, MCP server, or library to evaluate |
  | `version-bump` | A tracked dependency or tool has a new release |
  | `technique` | A new pattern, prompt pattern, or workflow technique |
  | `deprecation` | Something nullprobe uses is deprecated or removed |
  | `breaking-change` | API/behavior change that affects nullprobe output |
  | `security` | CVE, advisory, or supply-chain concern → escalate to Security Protocol |
  | `monitor` | Interesting but no immediate action needed |

**Success:** Every finding has exactly one tag.

---

### 5. Generate Output Entry

**What:** Produce a structured log entry.
**How:** Format:
  ```markdown
  ## [YYYY-MM-DD] explore | AI Environment Discovery

  **Sources checked:** <comma-separated list>
  **Previous run:** <date from last log entry, or "first run">

  ### Findings

  | Date | Source | Summary | Tag | Recommended Action |
  |------|--------|---------|-----|--------------------|
  | YYYY-MM-DD | <source> | <1-sentence summary> | `<tag>` | <action or "monitor"> |

  ### Actions Taken This Run

  - <action 1>
  - <action 2>
  - (none — all findings tagged monitor)
  ```
**Success:** Entry is complete, no finding is missing a recommended action.

---

### 6. Append to Log

**What:** Write the entry to `wiki/log.md`.
**How:**
  ```bash
  # Prepend to wiki/log.md (newest entry at top)
  # Or append — match existing convention in the file
  ```
**Success:** `wiki/log.md` contains the new entry with today's date.

---

## Success Criteria (overall)

- [ ] All sources in Step 1 checked or explicitly skipped with reason
- [ ] Every finding classified with a tag
- [ ] Structured output entry written to `wiki/log.md`
- [ ] Any `security` finding escalated to Security Protocol before proceeding

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
