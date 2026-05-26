# Audit Protocol Prompt

> Saved for learning purposes. This is the original prompt that produced `/protocols/audit.md`.
> Date received: 2026-05-25

---

## Original (verbatim)

We are going to implement and execute a new protocol - like QA engineer subagent.

Why: I'm sure this project has bugs or errors or some requirements misalignments or missed implementations or reduntant things. I want to check everything and save this as a runbook for later verefication.

I want you to review the project carefully and find all the issues and fix them.

Ultrathink deeply with deep reasoning and criticality, be brutally honest.

IMPORTANT: spawn subagents to review the project, and each subagent should have its own specialization (improvise, try to look from difefrent angles, perspective, pure example: i want scaffold cursor project  for frontend app with chrome devtools setup, skills related to frontedn dev and specified tech stakc, etc). and check otehrr stacks also).

NO ccode chnages during this process - only deep analysis, executions of exisitng logic and checking. When ready - displaye the output in a form of well-structured  table/spreadsheet and list of options on how to proceed with fixes.

Polish this prompt, fix gramamr and save the prompt in the newsly implemented protocol (decide the best name).

This may or may not be related to the current task.

---

## Polished (canonical)

Run a multi-perspective QA audit of this project.

**Hypothesis:** the project likely contains bugs, requirement misalignments, missing implementations, or redundant code. Treat this as a brutally honest review — not a confidence check.

**Rules:**

1. **No code changes during analysis.** Only inspect, read, and execute existing logic.
2. **Spawn specialized subagents in parallel.** Each reviews from a different lens — end-user personas across realistic tech stacks (e.g., Cursor + Next.js + shadcn + chrome-devtools MCP frontend; Python/Go backend with DB and CI; ML/notebook stack), plus dedicated lenses for code/architecture, requirements-vs-reality, and adversarial security/robustness. Improvise additional personas if they stress-test something the standard set misses.
3. **Ultrathink.** Apply deep reasoning; question every assumption; verify documented claims by reading code, not by trusting the doc.
4. **Report as a structured table** — `Issue ID | Severity | Category | Location | Finding | Evidence | Recommendation` — followed by a prioritized list of remediation options grouped by theme (quick wins, deeper fixes, deferrable, won't-fix candidates).

Save the runbook for later re-verification. Name the protocol concisely (one word, matching the existing `/protocols/` convention).
