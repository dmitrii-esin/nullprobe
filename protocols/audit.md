# Audit Protocol

**version:** 1.0.0
**purpose:** Brutally honest, multi-perspective QA review of the project. Spawn specialized subagents (different lenses, different personas) to surface bugs, requirement drift, missing implementations, redundant code, and UX gaps. Read-only — no code changes during the audit phase.
**when to run:** Before a release. After a large refactor. When something feels off and you can't pin it. Quarterly health check.
**output:** A structured findings table (Issue ID, Severity, Category, Location, Finding, Evidence, Recommendation) plus a prioritized list of remediation options.

---

## The Prompt (canonical invocation)

> Run a multi-perspective QA audit of this project.
>
> **Hypothesis:** the project likely contains bugs, requirement misalignments, missing implementations, or redundant code. Treat this as a brutally honest review — not a confidence check.
>
> **Rules:**
> 1. **No code changes during analysis.** Only inspect, read, and execute existing logic.
> 2. **Spawn specialized subagents in parallel.** Each subagent reviews from a different lens — end-user personas across realistic tech stacks (e.g., Cursor + Next.js + shadcn + chrome-devtools MCP frontend; Python/Go backend with DB and CI; ML/notebook stack), plus dedicated lenses for code/architecture, requirements-vs-reality, and adversarial security/robustness. Improvise additional personas if they stress-test something the standard set misses.
> 3. **Ultrathink.** Apply deep reasoning; question every assumption; verify documented claims by reading code, not by trusting the doc.
> 4. **Report as a structured table** — `Issue ID | Severity | Category | Location | Finding | Evidence | Recommendation` — followed by a prioritized list of remediation options grouped by theme (quick wins, deeper fixes, deferrable, won't-fix candidates).

The original prompt that produced this protocol is preserved at [`prompts/audit-spec.md`](prompts/audit-spec.md).

---

## Prerequisites

- `node >= 18` installed
- Dependencies installed (`npm install`)
- Project builds cleanly (`npm run build`) — note pre-existing build state in the report; do not fix during audit
- Network access if subagents fetch live data (e.g., GitHub API source repos)

---

## Steps

### 1. Orient

**What:** Build a quick mental model of the project before delegating.
**How:**
  - Read `docs/CONTEXT.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `README.md`
  - List `src/`, `protocols/`, top-level config
  - Skim `package.json` scripts and dependencies
**Success:** You can name every top-level concern in one sentence each.

---

### 2. Pick Subagent Lenses

**What:** Choose the review perspectives. The default registry below covers most cases; **improvise additional personas** for any concern that doesn't fit.

**Default lens registry:**

| Lens | Persona | What they look for |
|------|---------|--------------------|
| L1 — Frontend Persona | Developer scaffolding a **Cursor + Next.js + shadcn + chrome-devtools MCP** frontend app | Does nullprobe deliver useful skills/MCPs for this stack? What's missing? Does it actively get in the way? |
| L2 — Backend Persona | Developer scaffolding a **Python/Go backend** with DB + CI/CD via Claude Code | Same lens, backend stack |
| L3 — ML/Data Persona | Data scientist scaffolding **Jupyter / data pipeline / ML training** project | Same lens, ML stack |
| L4 — Code Auditor | Senior TS engineer reading `src/` cold | Type holes, dead code, redundancy, error handling, edge cases, async correctness |
| L5 — Requirements vs Reality | QA lead with the docs in one hand and the code in the other | Every claim in README/CONTEXT/PLAN/CLAUDE — does the code actually do it? |
| L6 — Adversarial / Security / Robustness | Red-team reviewer | Prompt injection in fetched skills, supply chain, secrets, bad inputs, network failure modes, file overwrite races |

**Success:** Subagent list locked. Each persona has a clearly defined lens different from the others.

---

### 3. Brief and Launch Subagents in Parallel

**What:** Send all subagents in a single message so they run concurrently.
**How:** Each subagent brief must include:
  - **Persona / lens** (one sentence)
  - **Goal** (what to find, from this lens specifically)
  - **Scope** (what files / commands to inspect; what's out of scope)
  - **Method** (concrete inspection or read-only execution steps)
  - **No-code-changes rule** (analysis only; do not Edit/Write)
  - **Output format** — every finding as: `Issue ID | Severity (1=critical, 2=high, 3=medium, 4=low, 5=nit) | Category | Location (file:line) | Finding | Evidence | Recommendation`
  - **Honesty mandate** — call out missing features, drift, and "lipstick on a pig" without softening

**Success:** All subagents dispatched in parallel; the parent task is now waiting on results.

---

### 4. Aggregate Findings

**What:** Merge subagent reports into one normalized table.
**How:**
  - Assign unique `Issue ID`s (e.g., `AUD-001`, `AUD-002`, …)
  - De-duplicate findings that multiple lenses surfaced; note which lenses agreed (higher confidence)
  - Reconcile severity disagreements — pick the higher one and note the rationale
  - Drop noise: nitpicks that don't change behavior, taste preferences without evidence

**Success:** Single table. Every row has a real `file:line` or command-evidence. No duplicates.

---

### 5. Produce Remediation Options

**What:** Translate findings into actionable options.
**How:** Group as:
  - **Quick wins** — small surgical fixes, no architectural risk
  - **Deeper fixes** — multi-file or design-level changes
  - **Deferrable** — real but not blocking
  - **Won't-fix candidates** — explain why

For each option include: scope estimate (S/M/L), risk, dependencies between fixes, and which Issue IDs it resolves.

**Success:** User can pick a batch and start work without re-reading the findings.

---

### 6. Output the Report

**What:** Present results to the requester.
**How:**

```
## Audit Report — YYYY-MM-DD

### Findings
| ID | Severity | Category | Location | Finding | Evidence | Recommendation |
| -- | -------- | -------- | -------- | ------- | -------- | -------------- |
| AUD-001 | … | … | … | … | … | … |

### Remediation Options
- **Quick wins (S):** AUD-002, AUD-007 — …
- **Deeper fixes (M/L):** AUD-001, AUD-005 — …
- **Deferrable:** AUD-009 — …
- **Won't-fix candidates:** AUD-011 — …

### Notes from each lens
- L1 (Frontend persona): top 1–2 takeaways
- L2 (Backend persona): …
- L3 (ML/Data persona): …
- L4 (Code auditor): …
- L5 (Reqs vs reality): …
- L6 (Adversarial): …
```

**Success:** Report is complete. The user can act on it without follow-up clarifying questions.

---

## npm shortcut

```bash
npm run protocol:audit
# Prints a reminder pointing to this file. The audit itself requires an AI agent
# to spawn subagents — there is no deterministic shell equivalent.
```

---

## Hard Rules

- **No code changes during analysis.** If a subagent finds a "trivial" bug, it goes in the report, not in a diff.
- **No fixes until the user picks a remediation option.** The report is the deliverable.
- **Evidence required for every finding** — `file:line` or a runnable command. No vibes.
- **Brutal honesty.** A finding being awkward to admit is not a reason to leave it out.

---

## Success Criteria (overall)

- [ ] At least 4 distinct subagent lenses ran in parallel
- [ ] Every finding has a unique ID, severity, and evidence
- [ ] Remediation options grouped by effort
- [ ] No code was modified during the audit
- [ ] The prompt that triggered the protocol is preserved in `prompts/`

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
