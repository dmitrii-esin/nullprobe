# Exploration Protocol v3 — Deep Research on Mandated Sources (2026-05-27)

**Date:** 2026-05-27  
**Run type:** Targeted deep execution of `protocols/exploration.md` v3 (self-improvement engine) on 5 specific high-signal sources requested by the user.  
**Constraint during research:** All work performed in `/tmp/nullprobe-explore-2026-05-27/` only. No changes to the repository until this persistence step.  
**Output locations:** This file in `/docs` + reference added to `docs/PLAN.md` §4a + entry in `docs/CONTEXT.md`.

## Mandated Sources (with deep reasoning)

1. https://dev.to/zoharbabin/building-a-13-agent-ai-system-for-ma-due-diligence-architecture-deep-dive-20ah (and https://github.com/zoharbabin/due-diligence-agents)
2. https://github.com/mem0ai/mem0
3. https://vectorize.io/articles/best-ai-agent-memory-systems
4. https://github.com/paralleldrive/aidd
5. https://github.com/Nutlope/hallmark

## Core Findings Table (Short Version)

| ID | Source | Novelty | One-Sentence Summary | Key Patterns / Deltas | Nullprobe Dev Fit | User Value | ROI × Ease (lightweight) |
|----|--------|---------|----------------------|-----------------------|-------------------|------------|--------------------------|
| F1 | Nutlope/hallmark | **Very High** (Apr 2026, 2k+ stars in 30 days) | Design skill with 65+ blocking slop-test gates + self-critique + 22 themes + "study" verb from screenshots/URLs. | Anti-AI-fingerprint gates, portable `design.md`, clean multi-env packaging (`npx skills add`). | High — simplicity-guard + protocol rows for output quality | High for FE users (non-generic UIs) | **Very High** |
| F2 | zoharbabin/due-diligence-agents + dev.to | **High** (Feb 2026, active May) | 13-agent neurosymbolic system: 38-step resumable pipeline, deterministic symbolic cross-domain triggers, 5 **blocking** quality gates (citation verification, accusatory Judge, NOT_FOUND, dedup, numerical), persistent compound KB with graph + fingerprint lineage. | "Stop using LLMs for deterministic work", accusatory framing, fail-closed gates, lineage across runs. | **Very High** — direct lift for verification/audit protocols, Exploration v3 (symbolic triage + synthesis), wiki model (Cognitive Firewall) | High — rigorous, citable analysis patterns for shipped protocols | **Very High** |
| F3 | vectorize.io memory article (Hindsight) | **High** (2026) | Clear split: Personalization vs **Institutional Knowledge**. Hindsight leads with fact extraction + entity resolution at write + 4-strategy retrieval + `reflect` synthesis. MCP-first. | Institutional > raw buffers; read-optimized architecture; highest benchmarks for learning from experience. | High — wiki + Exploration self-improvement engine needs this model | Medium-High for repeated agentic workflows | High |
| F4 | paralleldrive/aidd + SudoLang | Medium (active 2026) | Full AIDD scaffolding with 30+ specialized SKILL.md, SudoLang (typed constraint pseudocode), vision.md, dual human/AI testing, AGENTS.md + custom/ overrides, churn analysis. | Skills as institutional primitive; SudoLang for lower tokens + better determinism; custom override import pattern. | Medium — useful contrast and selective patterns (SudoLang, churn, vision) | Medium (complementary to nullprobe) | Medium |
| F5 | mem0ai/mem0 | Low for this run | Dominant memory layer (vector + paid graph). | Weaker on institutional knowledge per 2026 benchmarks without Pro tier. | None (hard exclusion at headline level) | Low | N/A |

## Cross-Cutting 2026 Themes
- Institutional memory (extracted lessons that compound) is the higher-value problem.
- Neurosymbolic hybrids + **blocking** quality gates beat pure LLM approaches.
- Skills (SKILL.md standard + packaging) are validated as the right primitive for portable expertise.
- Slop/quality gates + citation + accusatory framing are converging best practice.

## Top 3 by ROI ÷ Effort (Lightweight Principle)
1. **F2** (DD-Agents gates + neurosymbolic triggers + lineage KB) — Highest. Surgical upgrades to protocols + Exploration v3 + wiki.
2. **F1** (Hallmark slop gates) — Easiest high-impact win for output quality and guardrails.
3. **F3 + Agent Skills standard** (from broader sweep) — Strong model for wiki evolution and validation of nullprobe's own multi-env skill approach.

## Key Incorporation Proposals (for Project + Users)

**Highest immediate value (shipped user protocols):**
- Add 4–6 concrete table rows to the generalized `verification.md` / `audit.md` (and exploration) based on F1 + F2:
  - Mandatory citation verification to source
  - Accusatory / adversarial self-review framing
  - Explicit `NOT_FOUND` escape valve
  - Slop / fingerprint / anti-generic output checks
  - Symbolic cross-domain or cross-finding trigger rules
  - Evidence / numerical audit gates

**For nullprobe internals (self-improvement):**
- Adopt "institutional vs personalization" framing + fact extraction + `reflect` synthesis for the wiki model and Exploration v3 Step 8.
- Align skill output more explicitly with the 2026 `agentskills.io` standard (progressive disclosure language, frontmatter conventions).
- Document AIDD as a natural "execution layer" complement to nullprobe's lightweight pre-mission probe.

**Future / lower priority:**
- Optional institutional memory backend (Hindsight-style or lightweight graph) for `update` + wiki (feature-flagged).

**Full detailed structured findings** (with exact Step 4 protocol templates and Nullprobe Integration Proposal blocks for each) are preserved in the research session at `/tmp/nullprobe-explore-2026-05-27/full_report.md`.

## References
- Full protocol execution artifacts and query trace: `/tmp/nullprobe-explore-2026-05-27/`
- Related shorter synthesis: [EXPLORATION_REPORT.md](./EXPLORATION_REPORT.md)
- This run was performed under the Exploration protocol v3.0.0 (`protocols/exploration.md`).

---

*This report was generated during a dedicated deep research pass on the five mandated sources and persisted per owner request.*
