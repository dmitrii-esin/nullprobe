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

## Audit Process Steps

Use this table to execute the audit repeatably.

| # | Step | Key Actions | Success Criteria |
|---|------|-------------|------------------|
| 1 | Orient | Read `docs/CONTEXT.md`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `README.md`<br>List `src/`, `protocols/`, top-level files<br>Skim `package.json` scripts & dependencies | You can name every major top-level concern in one sentence |
| 2 | Pick Subagent Lenses | Use the default 6-lens registry below as the stable core<br>Only add extra personas when a clear gap is identified (document why) | At least the 6 default lenses are assigned (or explicit justification for any omission) |
| 3 | Brief & Launch Subagents | Send one message with all briefs in parallel<br>Each brief must contain: Persona, Goal, Scope, Method, "No code changes" rule, required output format, honesty mandate | All subagents are dispatched concurrently and produce findings in the mandated table format |
| 4 | Aggregate Findings | Assign unique `AUD-###` IDs<br>Dedupe across lenses<br>Take the higher severity on conflicts<br>Drop pure noise (no evidence, no behavior impact) | One clean findings table exists<br>Every row has real `file:line` or command evidence<br>No duplicate IDs |
| 5 | Produce Remediation Options | Group findings into: Quick wins (S), Deeper fixes (M/L), Deferrable, Won't-fix (with rationale)<br>For each option note scope, risk, dependencies, and resolved AUD-IDs | Clear, prioritized remediation options exist with effort/risk estimates |
| 6 | Output the Report | Produce the structured report (see template below) | Report is complete and usable without further clarification |

**Default Lens Registry (stable core — improvise only when justified)**

| Lens | Persona | Primary Focus |
|------|---------|---------------|
| L1 | Frontend (Cursor + modern web stack) | Does the tool deliver value or get in the way for this common stack? |
| L2 | Backend (Python/Go + DB + CI) | Same question for backend-heavy projects |
| L3 | ML/Data (notebooks, pipelines) | Same question for data/ML workflows |
| L4 | Code Auditor | Type safety, dead code, error handling, duplication, edge cases |
| L5 | Requirements vs Reality | Do the claims in docs match actual behavior? |
| L6 | Adversarial / Robustness | Prompt injection, supply-chain, secrets, file/network risks, resilience |

**Hard Rule:** All findings must include evidence (`file:line` or runnable command). "Vibes" are not findings.

## Risk Focus

This protocol is designed to surface risks in the following areas (via the default lens set):

- Requirement drift / over-promising
- Architectural or code quality issues
- Usability and value delivery for different tech stacks
- Security, robustness, and supply-chain problems

It is intentionally broad rather than narrowly scoped to one risk category.

### Execution Log (use during the audit)

| # | Step | Status | Notes / Observations | Time Spent |
|---|------|--------|----------------------|------------|
| 1 | Orient | | | |
| 2 | Pick Subagent Lenses | | | |
| 3 | Brief & Launch Subagents | | | |
| 4 | Aggregate Findings | | | |
| 5 | Produce Remediation Options | | | |
| 6 | Output the Report | | | |

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

- [ ] At least 5 of the 6 default lenses produced findings (or explicit justification why fewer were used)
- [ ] Every finding has a unique ID, severity, `file:line` or command evidence, and a clear recommendation
- [ ] At least one Critical or High severity finding (or explicit statement that none were found after thorough review)
- [ ] Remediation options are grouped and prioritized with effort/risk estimates
- [ ] No code was modified during the audit phase
- [ ] The canonical prompt that triggered this run is referenced or preserved

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
