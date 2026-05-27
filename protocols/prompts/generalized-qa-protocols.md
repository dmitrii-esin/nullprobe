# Generalized / User-Facing QA Protocols — Task Handoff Prompt

**Date:** 2026-05-26  
**Origin:** User request during review of `protocols/audit.md` and `protocols/verification.md`  
**Status:** Ready for execution by a fresh agent

---

## Session Start Instructions (MANDATORY)

Before doing any work:

1. Read `docs/CONTEXT.md` (current project status and philosophy).
2. Read the new section **## 4. Generalizable / User-Facing QA Protocols** in `docs/PLAN.md`.
3. Read the five existing protocols in `/protocols/` (especially `verification.md`, `audit.md`, `security.md`).
4. Read `protocols/README.md` and `protocols/prompts/`.
5. Read `CLAUDE.md`, `AGENTS.md`, and the root `AI_FRAMEWORK.md`.
6. Skim `src/scaffolder/` (especially `index.ts`, `platforms.ts`, `templates/`, and how `AI_FRAMEWORK.md` + skills are currently emitted).
7. Skim `src/flows/init-flow.ts` to understand the current question flow and "lightweight" constraint.

Only after completing the above, proceed.

---

## Project Context

**nullprobe** is a deliberately lightweight CLI tool. Its core promise is:

> Ask two questions, deploy the essentials (skills + AI_FRAMEWORK.md + wiki + optional MCPs), and get out of the way.

The `/protocols/` directory currently contains high-quality, **internal-only** operational runbooks used during nullprobe's own development:
- `verification.md` — deterministic build + manual + spec cross-check
- `audit.md` — multi-perspective (6-lens) QA review via specialized subagents
- `security.md`
- `exploration.md`
- `cleanup.md`

These protocols are excellent (especially the structured tables in audit and the detailed scenarios in verification + the real `verify.sh` implementation). However, they are **tightly coupled** to nullprobe itself (references to `src/`, `npm run dev -- init`, specific temp directories, our own PLAN.md §2 matrix, our scaffolder internals, etc.).

---

## The Task (User's Exact Request)

We want to evolve these protocols so that **end users of the nullprobe package** can also benefit from them.

**Goal:** Create less-specific, general-purpose versions of the protocols that can be shipped into user projects during `nullprobe init`, with clear, easy extension points so that users (and their AIs) can add their own project-specific test cases, risk scenarios, domain rules, and custom verification steps.

In short:
- Keep the current `/protocols/` for nullprobe contributors (internal use).
- Create generalized, templated, customizable versions that become part of what `nullprobe init` delivers to other people's projects.
- Make it trivial and non-intimidating for a user to extend the protocols with their own content.

This turns the protocols from "our secret sauce for building nullprobe" into a **core value proposition** that ships with every initialized project.

---

## Constraints & Philosophy (Non-Negotiable)

- **Lightweight above all** (the project's core principle). Any solution must pass the test: "Does this make the tool simpler and more powerful for the user, or more complex and heavier?"
- Default behavior must remain extremely simple. Adding protocols to a user's project must be **optional** and **off by default**.
- Do not turn `init` into a long questionnaire.
- Respect the existing multi-environment scaffolding system (Claude, Cursor, Gemini CLI, Antigravity).
- Every change must be surgical and traceable back to this requirement.
- Prefer markdown + simple tables (see best-practice research below) over complex templating engines.

---

## Best-Practice Research Already Performed (Use This)

In the preceding session we researched industry standards and real lightweight implementations:

**Strongest relevant examples:**
- **SeleniumBase Case Plans**: Ultra-simple 3-column Markdown tables (`# | Step Description | Expected Result`). Extremely scannable in GitHub, deterministic, and already used at scale for manual + mixed test documentation.
- **ISTQB-aligned templates** (e.g. rennanreis/qa-test-strategy-framework): Consistent structure with ID, Objective, Preconditions, focused technique table, Postconditions, Traceability.
- **Penetration test / security audit reports**: Severity legend + clean findings summary table (`ID | Finding | Severity | Location | Recommendation | Status`) + per-finding detail sections.
- **Modern ISO/IEC/IEEE 29119-3** philosophy: Flexible, risk-based, traceability-focused, lighter than old IEEE 829.
- Real GitHub manual testing repos commonly use master overview tables + individual detailed cases with "Actual Result" and "Status" columns filled at execution time.

Key lesson: The most effective formats for GitHub + AI + human collaboration are **clean, narrow Markdown tables** with explicit IDs (VER-001, AUD-017, etc.) rather than long prose.

The current `audit.md` table is already close to best practice. Verification is weaker and more narrative.

---

## Open Design Questions (The Agent Must Address)

The agent must explore these (and any others discovered) and recommend a concrete path:

1. **Delivery mechanism** — Where do the generalized protocols live in a user project after `init`?
   - Top-level `protocols/` folder?
   - A new top-level file (`QA_PROTOCOLS.md` or `DEVELOPMENT_PROTOCOLS.md`)?
   - As one or more skills in `.claude/skills/` (or equivalent for other platforms)?
   - Inside `wiki/protocols/`?
   - A combination?

2. **Customization / Extension UX** — How does a user add their own test cases?
   - Purely manual (excellent docs + empty "Add your cases here" sections with examples)?
   - Light opt-in questionnaire during init (e.g. "What are 2-3 critical things that must never regress in this project?")?
   - Free-text capture that gets turned into starter table rows?
   - Something else?

3. **Template strategy** — How do we avoid maintaining two completely separate copies of almost-identical content?
   - Parameterized templates in the scaffolder?
   - One "internal" version + one "generalized" version with clear markers?
   - A single source with build-time or scaffold-time specialization?

4. **Scope for v1** — Which protocols should be generalized first?
   - Probably Verification + Audit (the two the user was reviewing).
   - Security is also high value.
   - Exploration and Cleanup may be lower priority.

5. **Update path** — Should `nullprobe update` be able to refresh the generalized protocols in an existing user project over time (similar to how skills can evolve)?

6. **Impact on "two questions" promise** — Exactly how (if at all) does the init flow change?

---

## Expected Deliverables From This Task

The agent should produce (in order):

1. **Design Proposal** (first major output)
   - Recommended delivery format(s)
   - Recommended customization/extension model
   - Which protocols to tackle in v1 vs later
   - How to keep everything lightweight
   - Rough impact on `src/scaffolder/`, `flows/`, and documentation
   - Trade-off analysis of the main options

2. **Detailed Implementation Plan**
   - Phased breakdown (research → templates → flow changes → docs → verification)
   - New files required (especially under `src/scaffolder/templates/`)
   - Changes to existing files
   - New verification scenarios to add to PLAN.md §2

3. **Prototype / Concrete Examples** (if time permits in the session)
   - At least one generalized protocol (e.g. a version of `verification.md` or `audit.md`) written in the proposed style, showing clear extension points and example user-added cases.
   - Example of what a freshly scaffolded `protocols/` (or equivalent) would look like for a hypothetical user project.

4. **Risks & Lightweight Safeguards**
   - Explicit list of ways this feature could violate the project's core philosophy, plus mitigations.

---

## Success Criteria

- The design stays true to nullprobe's "lightweight above all" and "two questions and done" principles.
- Generalized protocols are clearly less specific than the internal ones while preserving the deterministic table-driven quality that makes the current ones valuable.
- There is an obvious, low-friction path for end users to extend the protocols with their own content.
- The proposal is concrete enough that implementation can begin in the next session after review.
- All recommendations are backed by the best-practice research and the project's documented constraints.

---

## Important References

- Current internal protocols: `/protocols/`
- Best practice research summary: (the conversation immediately preceding this prompt)
- Scaffolding mechanics: `src/scaffolder/index.ts`, `src/scaffolder/platforms.ts`, `src/flows/init-flow.ts`
- The portable document users receive: `AI_FRAMEWORK.md` (root)
- Existing prompt preservation pattern: `protocols/prompts/audit-spec.md`
- **Short design options starter** (head start for the Design Proposal): `protocols/prompts/generalized-qa-protocols-design-options.md`
- PLAN.md section 4 (the one you just read) + §4a (AI Tools & Memory Systems Analysis with the three links)

---

## Tone & Approach Guidance

- Be brutally honest about complexity creep.
- When in doubt, favor the simpler option.
- Use the `think-before-coding` and `simplicity-guard` patterns from the skills.
- Prefer shipping something small and valuable over a perfect but heavy system.
- Document assumptions and trade-offs clearly.

---

**This prompt is the complete handoff.** A fresh agent should be able to start from here with minimal additional context.

After the design proposal is complete, stop and wait for user (or owner) approval before writing production code.

---

*End of task prompt*