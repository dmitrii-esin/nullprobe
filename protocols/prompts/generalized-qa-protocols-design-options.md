# Generalized QA Protocols — Design Options Starter (Short)

**Purpose:** Give the future agent a fast head start on the required **Design Proposal** for PLAN.md §4 (shipping customizable, general-purpose versions of the protocols to end users via `nullprobe init`).

**Read first:** The main handoff prompt at `protocols/prompts/generalized-qa-protocols.md` + PLAN.md §4 + §4a (AI memory research).

---

## Core Problem (One Paragraph)

The current five protocols are excellent internal tooling but are hardcoded to nullprobe's own codebase, commands, and test matrix. We want to extract the **valuable patterns** (deterministic tables, multi-lens audit, structured verification, quality gates) into generalized, shippable versions that users can adopt and extend with their own project-specific test cases — without turning nullprobe into a heavy framework.

---

## Key Design Dimensions & Options

### 1. Delivery Mechanism (Where the protocols appear in a user project)

| Option | Description | Pros | Cons | Lightweight Fit |
|--------|-------------|------|------|-----------------|
| A. Top-level `protocols/` folder | Scaffold full generalized `verification.md`, `audit.md`, etc. + strong README | Discoverable, familiar structure, easy to version-control | Adds visible files to every project that opts in | Good if opt-in |
| B. Single `QA_PROTOCOLS.md` (or `DEVELOPMENT_PROTOCOLS.md`) at root | One consolidated, well-organized document | Minimal surface area | Can become long; harder to evolve individual protocols | Very good |
| C. As one or more new skills (`.claude/skills/qa-protocols/` or equivalent) | Integrated with the existing skill system | Leverages what users already get from init; AI-native | Skills are more "for the AI" than "for the human team" | Strong alignment |
| D. Inside `wiki/protocols/` | Treated as living project memory | Consistent with wiki purpose | Less visible to humans who don't read wiki | Medium |

**Initial leaning:** Start with a hybrid of **B + C** (primary `QA_PROTOCOLS.md` + optional skills for the AI to load). Or pure **A** with a very small number of files. Avoid anything that feels like "another framework".

### 2. Customization / Extension Model (How users add their own cases)

| Option | Description | Pros | Cons | Lightweight Fit |
|--------|-------------|------|------|-----------------|
| 1. Pure documentation + examples | Excellent README + clearly marked "Add your VER- / AUD- cases here" sections with templates | Zero extra code in nullprobe | Users must do all the work manually | Excellent |
| 2. Light optional questionnaire at init | "Include QA protocols?" → "What are 2-3 critical things that must never regress?" (free text or bullets) | Captures intent early; can pre-populate starter rows | Adds one question (risk to "two questions" promise) | Acceptable only if truly optional + default off |
| 3. Post-init command or skill | `nullprobe customize-protocols` or a skill that helps the AI generate cases from user chat | Keeps init clean | Extra surface | Good for v2 |
| 4. Hybrid | Docs + one very small capture step when user says "yes" to protocols | Best of both | Slight complexity | Promising |

**Strong recommendation from prior research:** Use the **SeleniumBase-style 3-column table** (`# | Step Description | Expected Result`) as the canonical extension format. It is the most scannable and deterministic pattern we found.

### 3. Template Strategy (How we avoid maintaining two near-identical copies)

- Single-source + specialization at scaffold time (preferred for DRY).
- Two parallel maintained versions (internal vs generalized) — only acceptable if the generalized ones are dramatically simpler.
- "Protocol seeds" that both the internal `/protocols/` and the shipped versions derive from.

**Lean:** Single source of truth in the scaffolder templates, with clear markers for "internal-only" vs "general" sections.

### 4. Scope for v1

**Recommended minimal viable set:**
- Generalized `verification.md` (core value)
- Generalized `audit.md` (core value — the multi-lens model is unique)
- Short `README.md` or intro section explaining extension

Defer: Security, Exploration, Cleanup for v1 unless trivial.

---

## Lightweight Safeguards (Must-Haves)

- **Default = off.** New confirm prompt only if user explicitly wants "advanced operational tooling".
- No more than **one** additional meaningful question during init.
- The shipped protocols must feel **smaller and friendlier** than the internal ones (fewer nullprobe-specific details, more "replace these examples with yours").
- Clear "this is optional and advanced" messaging in docs and the scaffolded output.

---

## Open Questions the Future Agent Must Resolve

1. Exact delivery format (A/B/C above) — pick one primary + one fallback.
2. Should the generalized protocols reference or be inspired by modern agent memory patterns (see PLAN §4a links: 13-agent neurosymbolic system, Mem0, Hindsight, Letta, temporal graphs, blocking quality gates, synthesis/reflect steps, etc.)?
3. How do we handle "starter cases" for common project types without over-engineering (web app, CLI, data pipeline, library)?
4. Update path: Can `nullprobe update` refresh the generalized protocols later?
5. How does this interact with the existing `AI_FRAMEWORK.md` (should the framework point to the protocols)?

---

## Suggested Output Structure for the Design Proposal

1. Executive summary (2-3 sentences)
2. Recommended primary design (with rationale)
3. Alternative considered + why rejected
4. Impact on code (files touched, new templates needed)
5. How the lightweight principle is protected
6. Draft example of what a scaffolded generalized verification protocol might look like (1-2 key sections)
7. Open questions + risks

---

**This document is intentionally short.** Use it as a starting skeleton, not as final truth. Expand or discard options based on fresh analysis.

**Next step after reading this + the main prompt:** Produce the full Design Proposal before writing any production code.