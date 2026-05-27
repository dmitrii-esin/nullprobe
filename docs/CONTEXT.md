# CONTEXT.md — Live Project Snapshot

> Read this at the start of every session. Update the "Recent changes" section after substantive work.
> This is the shared contract between all AI environments (Claude, Cursor, Antigravity).

## What this project is

nullprobe v0.2 — Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

## Current status

| Area | State |
|------|-------|
| `nullprobe init` | Working — scaffolds 4 skills + wiki + AI_FRAMEWORK.md |
| `nullprobe update` | Working — GitHub and Tavily search backends live; results logged to wiki |
| npm publish | Not published — install from source |
| Multi-env scaffold | Claude (.claude/skills/ + .mcp.json), Cursor (.cursor/rules/*.mdc + .cursor/mcp.json), Antigravity (.antigravitycli/rules/*.md + .agent/mcp_config.json), Gemini CLI (.claude/skills/ + .gemini/settings.json) |

## Key files

| File | Purpose |
|------|---------|
| `src/index.ts` | CLI entry — commander routes to commands |
| `src/flows/init-flow.ts` | Conversational init prompts (inquirer) |
| `src/scaffolder/index.ts` | **Wiring file** — add new templates here |
| `src/scaffolder/templates/` | One `.ts` file per output file, exports string constant |
| `src/github/sources.ts` | Source repos tracked by `update` command |
| `AI_FRAMEWORK.md` | Portable guide — this is what gets scaffolded into target projects |

## Active constraints

- ESM-only (`"type": "module"`) — all imports need `.js` extensions in compiled output
- `tsx` for dev, `tsc` for build — no bundler
- Serial GitHub API calls — unauthenticated, 60 req/hr limit

## Roadmap

See `docs/PLAN.md` for the full development plan with test coverage scope, verification checklist, and multi-registry distribution research.

Current backlog highlights:
- Test coverage (Vitest, ≥80% branch on core modules) — **DONE** (89.81% branch, 46 tests)
- Verification plan — documented in PLAN.md §2, run before each release — **DONE** (all 8 scenarios passed)
- Language-agnostic distribution: Phase 1 (Bun binary CI), Phase 2 (curl install script), Phase 3 (Homebrew tap, Scoop) — not started
- Generalizable / User-Facing QA Protocols (PLAN.md §4) — **DONE**. Full set of 5 (verification, audit, security, exploration, cleanup) now ships when user opts in during `init`. Includes generalized templates, wiring, and documentation across all environments.

## Recent changes

### 2026-05-27 — Architecture & Positioning Deep Analysis (agent memory, skills, hosts)
- Completed wide-ranging architectural review of nullprobe vs 13 high-signal external repositories (primary focus: rohitg00/agentmemory + iii-hq/iii as the runtime realization of the exact memory model cited in our sources, OpenClaw, Anthropic skills standard + Hallmark quality gates, mem0, and related repos).
- Used three specialized sub-agents with deep expertise (Memory Systems Architect, Skills & Runtime Expert, Synthesizer Architect) for rigorous domain analysis.
- Major findings persisted:
  - Consolidated synthesis report: `docs/ARCHITECTURE_ANALYSIS_2026-05-27.md` (executive summary, key gaps table, direct answers to the 5 core questions, 7 most important questions the owner should ask next with impact notes, pros/cons of closest alternatives, prioritized lightweight recommendations).
  - Two detailed sub-agent deep-dive reports + local clones of the two most relevant repos available in `/tmp/nullprobe-analysis/`.
- Core insight: nullprobe's philosophy is accurate and high-fidelity, but the "living, self-updating procedural memory" delivery is manual/static while the cited sources' actual implementations deliver automatic hooks, hybrid search, graphs, 53 MCP tools, viewers, and runtime extensibility.
- Strong recommendation: explicit positioning as the best-in-class *durable institutional layer + operational protocols + multi-env bootstrapper*, with clean complementarity to agentmemory/iii (or mem0) for the automatic half.
- All analysis respected the "no changes during thinking" rule. Persistence of results (this entry + new docs file + wiki/log + wiki/index + PLAN review item) performed at owner request after delivery.
- New review task added to `docs/PLAN.md` §5 with clear next actions and links to all artifacts.

### 2026-05-27 — Initial exploration synthesis on mandated sources (Antigravity / parallel session)
- Prepared the short-form synthesis report `docs/EXPLORATION_REPORT.md` covering the five key resources (13-agent M&A due diligence system, Mem0, Vectorize agent memory comparison, AIDD + SudoLang, Hallmark anti-slop design skill).
- Delivered a clean comparison table with Key Insights & Innovations and initial Nullprobe Integration Proposals for each.
- Committed as part of parallel Antigravity CLI session work.
- This formed the first body of research on these topics.

### 2026-05-27 — Deep Exploration protocol execution on 5 mandated high-signal sources
- Executed full `protocols/exploration.md` v3 (including Step 0.5 Targeted Nullprobe Self-Improvement Inquiry, broad domain sweeps using all available tools, strict exclusion + substance filters, and the exact 5-field + Integration Proposal finding template) focused on the five sources previously identified in PLAN.md §4a.
- Produced rich structured findings with concrete neurosymbolic quality gates, institutional memory patterns (Hindsight-style reflect + multi-strategy), slop-test anti-generic gates (Hallmark), SudoLang + large skill library patterns (AIDD), and 2026 Agent Skills standard alignment.
- Key deliverables persisted:
  - Detailed report with tables, top-3 ROI ranking, and surgical incorporation proposals: [docs/exploration-2026-05-27-mandated-sources.md](./exploration-2026-05-27-mandated-sources.md)
  - Full protocol artifacts, query trace, and raw research in `/tmp/nullprobe-explore-2026-05-27/` (research-only phase respected the original "no repo changes" constraint).
- Top actionable items identified for protocols, wiki model / Cognitive Firewall, Exploration v3 self-improvement loop, and shipped user-facing QA protocols (especially blocking citation/accusatory/slop gates).
- Research performed without modifying the repository until explicit owner request to persist (this entry + PLAN.md reference + new report file).
- Updated this Recent changes section + PLAN.md §4a per project rules.

### 2026-05-27 — QA Protocols final documentation & user-facing improvements
- Updated main README.md with clear Prerequisites and step-by-step "How to use" instructions for the optional shipped QA protocols feature (addressing discoverability).
- Enhanced shipped `protocol-readme.ts` with:
  - 4 realistic best-practice starter example rows (VER-110, AUD-110, SEC-110, CLN-110).
  - Guidance on leveraging optional MCPs (e.g. chrome-devtools).
  - Clear note documenting the internal (rich v3 self-improving) vs generalized (light v1.2) asymmetry for Exploration.
  - Minimal Changelog section.
- Added minimal Changelog sections to the three deepened generalized templates.
- Lightly updated AI_FRAMEWORK.md Part IX for better MCP and asymmetry guidance.
- Added clarifying notes in AGENTS.md and CLAUDE.md about the PROTOCOL_BUNDLE registry pattern.
- All items from the consolidated findings table (F-01 to F-07) addressed surgically.
- Full session activities (protocol implementation, multi-lens audits, internal protocol execution runs, remediation, and final documentation pass) now properly logged in wiki/log.md and this Recent changes section.

### 2026-05-27 — Backend (Python/Go + databases + CI/CD) perspective audit of generalized QA protocols feature + Exploration protocol changes
- As senior backend engineer (Python/Go + databases + CI/CD) using Claude Code, performed a targeted audit of the post-remediation generalized QA protocols feature (all 5 runbooks optionally shipped via `nullprobe init`) and Exploration protocol evolution (internal v3.0.0 self-improvement engine vs. generalized v1.2).
- Read `docs/CONTEXT.md` first per mandatory session-start rule (AGENTS.md / Claude.md). Performed multi-file analysis of: `src/flows/init-flow.ts` (gating + pickQaProtocols UX), `src/scaffolder/{index.ts,protocol-bundle.ts,platforms.ts,templates/protocol-*.ts}` (all 6 generalized templates + wiring/registry), `AI_FRAMEWORK.md` (Part IX), `protocols/{README.md,exploration.md,verification.md,audit.md,security.md,cleanup.md}`, `docs/PLAN.md` §4, `docs/REMEDIATION_QA_PROTOCOLS.md`, design prompts in `protocols/prompts/`, prior remediation/frontend audit entries, and test coverage in `src/scaffolder/index.test.ts`.
- Focused strictly on: whether the feature helps or hinders backend-heavy projects; concrete gaps for backend concerns (API contracts, database migrations, CI/CD reliability, error handling patterns, authz, transactions, observability, supply-chain for Go/Python modules, etc.); and any architectural or implementation issues in the delivered generalized protocols + Exploration changes.
- Delivered 11 specific, evidence-anchored findings in the exact mandated table format: | ID | Severity (Critical/High/Medium/Low/Nit) | Category | Location (file:section) | Finding | Evidence | Recommendation |.
- Key themes: Post-remediation architecture is clean and surgical (PROTOCOL_BUNDLE single source of truth in `src/scaffolder/protocol-bundle.ts`, derived paths, correct gating behind "specific", strong overwrite + custom/ guidance). The table-driven philosophy and extension points (VER-/AUD-/SEC- etc. IDs) provide genuine long-term value for any stack including backend. However, generalized starters contain almost no concrete backend examples or pre-seeded risks; Exploration generalized v1.2 (`src/scaffolder/templates/protocol-exploration.ts`) received only a one-sentence footer nod vs. the rich internal v3 machinery (Step 0.5 Targeted Self-Improvement, Step 8 Synthesis & Promotion + "Nullprobe Integration Proposal" taxonomy targeting protocol-bundle.ts etc. in `protocols/exploration.md`); only verification receives user priority seeding; discoverability gated; no template refresh path. Net: helps disciplined backend teams willing to customize; low immediate value and some missed high-ROI opportunities for Python/Go + DB + CI projects. Remediation fully resolved prior structural/thin-content issues.
- No changes made to code, templates, or protocols (pure audit + analysis). Full findings tables + detailed writeup is the primary session deliverable.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — Focused frontend dev audit of generalized QA protocols feature + Exploration protocol evolution
- As senior frontend developer (Cursor + modern React/Next.js stack with shadcn/ui + MCP tools including chrome-devtools and shadcn), performed a targeted audit of the post-remediation generalized QA protocols feature (all 5 runbooks optionally shipped via `nullprobe init`) and Exploration protocol evolution (internal v3.0.0 self-improvement engine vs. generalized v1.2).
- Read `docs/CONTEXT.md` first per mandatory session-start rule (AGENTS.md / Claude.md). Performed multi-file analysis of: `src/flows/init-flow.ts` (gating + pickQaProtocols UX), `src/scaffolder/{index.ts,protocol-bundle.ts,platforms.ts,templates/protocol-*.ts}` (all 6 generalized templates + wiring/registry), `AI_FRAMEWORK.md` (Part IX), `protocols/{README.md,exploration.md,verification.md,audit.md,security.md,cleanup.md}`, `docs/REMEDIATION_QA_PROTOCOLS.md`, `README.md`, `PLAN.md` §4, design prompts in `protocols/prompts/`, prior remediation entries, and test coverage in `src/scaffolder/index.test.ts`.
- Focused strictly on: real delivered value for a typical frontend web project, UX friction points for Cursor users, and concrete gaps in the generalized content for modern web/FE use cases (RSC boundaries, shadcn components, Playwright/Cypress, a11y/perf/visual regression, Next.js artifacts, MCP synergy with chrome-devtools, FE-specific security/exploration lenses, etc.).
- Delivered 9 specific, evidence-anchored findings in the exact mandated table format: | ID | Severity (Critical/High/Medium/Low/Nit) | Category | Location (file:section) | Finding | Evidence | Recommendation |.
- Key themes: The feature (table-driven scannability, 1-3 priority seeding into verification, strong dedicated overwrite warning + "protocols/custom/" guidance, clean single-source PROTOCOL_BUNDLE after remediation) provides real process/structure value and aligns well with Cursor + AI-driven workflows. However, starter content is still too generic for a typical FE project; the Exploration generalized template received only a minimal self-improvement nod (vs rich internal v3 with Step 0.5 + Integration Proposal taxonomy); discoverability is constrained by "specific" approach gating; high-ROI FE/MCP opportunities (e.g. chrome-devtools for visual checks, concrete shadcn/Next.js examples, client-bundle risks) are largely absent. Remediation successfully closed prior thin-protocol and structural gaps.
- No changes made to code, templates, or protocols (pure audit + analysis). Full findings table + detailed writeup is the primary session deliverable.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — ISTQB/ISO 29119-3 structured evaluation of `protocols/verification.md` and `protocols/audit.md`
- As QA expert (ISTQB principles + ISO/IEC/IEEE 29119-3 test documentation standards), performed focused evaluation *strictly limited to* `protocols/verification.md` and `protocols/audit.md` (CONTEXT.md read only to satisfy mandatory session-start rule; zero other files inspected for the analysis).
- Evaluated the two protocols for: clear structure (per-item ID, Objective, Preconditions, Test Conditions/Technique, Expected Results, Postconditions), traceability (to requirements/risks/artifacts), risk-based focus, appropriate level of detail (lightweight yet sufficient for execution), and measurable success criteria.
- Delivered 12 specific, evidence-anchored findings in the exact mandated table format: | ID | Severity (Critical/High/Medium/Low/Nit) | Category | Location (file:section) | Finding | Evidence | Recommendation |.
- Key themes identified: Both protocols are pragmatic, high-signal operational runbooks with excellent executable "How" steps, concrete shell commands, per-step + overall success checklists, report templates, Hard Rules, and changelog. They deviate from formal 29119-3 Test Case / Test Procedure schema (rely on custom "What / How / Success" and global Prerequisites instead of the prescribed labeled fields and per-case IDs). Traceability exists but is informal and largely one-way. Risk-based prioritization is implicit only (e.g. 80% coverage gate, L6 adversarial lens + severity in audit output). Measurable criteria are mostly solid but contain concrete defects (file count mismatch in verification Step 3; non-deterministic conditional success in update Step 6; audit success checklist thresholds that are too low to guarantee depth).
- No edits performed on verification.md or audit.md themselves (evaluation + findings only). Full findings table + detailed writeup in the session deliverable.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — Analysis + design proposal: Evolving Exploration protocol (v2) into nullprobe self-improvement engine
- Performed deep multi-file analysis of current `protocols/exploration.md` (v2.0.0 open-ended discovery runbook with exclusion list, broad sweeps, 5-axis substance filter, structured findings, query trace, ROI-ranked shortlist, wiki/log.md output, sibling alignments) against the project's self-improvement needs.
- Cross-referenced: `docs/CONTEXT.md`, `docs/PLAN.md` (incl. §0a MCP discovery, §4a memory systems research, protocol evolution), `AI_FRAMEWORK.md` (esp. Part VIII co-evolution rule + Part IX protocols, 4-tier consolidation philosophy), `wiki/log.md` + `wiki/index.md`, `protocols/{README,verification,audit,cleanup,security}.md` (post-remediation table-driven patterns), `src/scaffolder/{index.ts,protocol-bundle.ts,templates/protocol-exploration.ts}`, `src/github/sources.ts`, init/update flows, and all 5 project axes (skills unification, persistent memory/Cognitive Firewall, deterministic protocols, promotion prep, information-overload reduction).
- Identified 10 specific gaps in feedback loops: insufficient directed synthesis/promotion into own artifacts (AI_FRAMEWORK, protocols, PLAN, scaffolder, sources, wiki), open-ended bias without paired targeted self-dev pass, general-purpose finding template not meta-optimized, no closed-loop outcome tracking or protocol self-evolution, weak bidirectional coupling with audit/verification, missing nullprobe-specific high-yield discovery lenses, output surface too narrow (log only), etc.
- Produced concrete, practical, high-leverage recommendations (preserving lightweight/surgical/simplicity-first values): (1) new lightweight "Targeted Nullprobe Self-Improvement Inquiry" pass with inquiry seeds from live artifacts (PLAN items, recent audit/verification, components like update mechanism / wiki model / multi-env unification / MCP automation); (2) enhanced v3 finding template + "Nullprobe Integration Proposal" block with fixed taxonomy of target artifacts (AI_FRAMEWORK.md, exploration.md, PROTOCOL_BUNDLE, sources.ts, etc.) and integration types (new exclusion, protocol enhancement, new search backend, skill candidate, wiki pattern, etc.); (3) new Step 8 "Synthesis & Promotion" (skippable on thin runs) producing copy-paste micro-updates + mandatory "file back" using existing co-evolution rule; (4) explicit prior-run review + end-of-run "Protocol Health" reflection for meta-learning; (5) expanded resource categories with dedicated nullprobe self-dev lenses (memory architectures for consolidation, cross-platform skill unification patterns, table-driven protocol best practices, robustness for network content, etc.); (6) bidirectional sibling alignment section + capture format for seeding verification/audit cases; (7) optional structured "Exploration Outcome Tracker" table (Finding | Promoted to | Outcome) + wiki/exploration/ sidecar guidance. All additions table-driven, time-bounded, with "or honest skip" paths.
- Full detailed rationale, exact example section text, implementation notes (pure md edits to protocols/exploration.md + possible future generalized template refresh), risks/mitigations, and prioritized rollout (v2.1 template+one step; v3.0 fuller) captured in this session's output writeup.
- No code or protocol file changes in this pass — pure analysis + design proposal (ready for owner review/approval before any evolution implementation). Aligns with "next major task" explicitly called out in prior remediation entries.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — Requirements vs Reality audit of generalized QA protocols (PLAN §4)
- Performed full "Requirements vs Reality" audit as specialized subagent: compared actual delivered implementation (init-flow, scaffolder wiring + 6 protocol templates, AI_FRAMEWORK Part IX, docs) against the original handoff prompt (protocols/prompts/generalized-qa-protocols.md), design-options starter, approved design intent, PLAN.md §4 vision/non-goals, and best-practice research (SeleniumBase tables etc.).
- Key findings documented in session output (gaps identified around init prompt count vs "two questions" promise, thin generalization of security/exploration/cleanup v2 protocols vs the high-value table-driven patterns in v1, missing unit test coverage for the new feature, and minor messaging drift in the QA confirm prompt).
- No code changes; pure analysis + verification of exact builder output via direct execution.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — Design proposals for deepened generalized security/exploration/cleanup protocols
- Directly addressed the key gap identified in the same-day "Requirements vs Reality" audit: the v2 generalized security.md, exploration.md, and cleanup.md templates remained thin list/prose versions while verification and audit delivered high-value, scannable, table-driven patterns with strong extension points.
- Produced practical, lightweight design for all three (matching the quality bar and philosophy of the shipped verification 3-col tables + audit structured findings table + the original best-practice research: SeleniumBase, pen-test reports, ISO 29119 spirit).
- For **each protocol** documented:
  1. Recommended primary structure/sections (header metadata + prerequisites + core content + report/output template + success checklist + changelog, modeled on internal rich versions but fully generalized).
  2. Suggested primary table format(s) with exact column definitions (e.g. security checks or findings table with ID/Severity/Area/Finding/Evidence/Action; exploration sources + search log + exclusion; cleanup safe-targets with "Why safe" rationale column).
  3. 3–4 high-signal, genuinely useful starter examples/checks that apply across many project types (with concrete starter commands or methods where relevant, using universal package-manager-agnostic notes).
  4. Effective "Add your own..." customization handling (dedicated sections with ready-to-copy table headers using the SEC-### / EXP-### / CLN-### ID conventions already referenced in the generalized protocols/README template; guidance on domain-specific extensions; 1–2 example seeded rows).
  5. Industry patterns to emulate (scannable narrow tables over prose, explicit evidence/rationale columns, exclusion lists for signal, severity + coverage views, "why safe" for destructive actions) and anti-patterns to avoid (vague one-liners, project-specific hardcoding, overwhelming checklists, no runnable starters, customization that feels like work).
- Cross-cutting recommendations: (a) the three deepened templates belong in `src/scaffolder/templates/protocol-*.ts` (drop-in replacements for the thin builders); (b) minor enhancement to generalized `protocol-readme.ts` to include one example row/table snippet for each new ID family; (c) no changes to init-flow or seeding logic required (current "1-3 things that must never regress" → verification only remains perfect lightweight balance); (d) optional later: `nullprobe update` could one day refresh the protocol templates.
- Deliverable is this analysis + complete design specs (ready for a subsequent implementation session). No template or wiring code modified in this pass. All proposals preserve the "optional, off-by-default, two-questions" promise and keep total surfaced content minimal but high-signal.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md). Related: PLAN.md §4 already marks the generalized protocols work complete at feature level; these designs close the quality gap.

### 2026-05-27 — Structural design proposal for optional QA protocols bundle (remediation follow-up)
- Full codebase analysis of the generalized protocols implementation (6 templates in `src/scaffolder/templates/protocol-*.ts`, conditional wiring in `src/scaffolder/index.ts`, overwrite detection via `ALWAYS_WRITTEN` in `src/scaffolder/platforms.ts`, init-flow prompt + `checkExistingFiles`, types, test coverage gaps, PLAN.md §4, handoff prompts in `protocols/prompts/`, root `protocols/`, and AI_FRAMEWORK Part IX).
- Confirmed exact duplication points and current shape: 6 protocol paths listed both in the `if (answers.includeProtocols) { files.push(...) }` block (the writing site, per Critical wiring rule) *and* in `ALWAYS_WRITTEN` (spread into every platform's `detectPaths` for the pre-scaffold overwrite guard); 6 separate imports + `build*Protocol()` calls in `index.ts` (5 of 6 are trivial `return \`...\`` wrappers around static Markdown; only verification performs priority seeding interpolation).
- No unit tests exercise the protocols branch or seeding logic (consistent with earlier audit).
- Delivered concrete, prioritized recommended design for the 5 requested points plus extensibility: (1) single-source-of-truth `PROTOCOL_BUNDLE` registry eliminates path duplication and the 6-line push boilerplate; (2) `const` string exports (for the 5 static protocol templates) + one small builder + registry/map preferred over individual build fns; (3) clean `for (const entry of PROTOCOL_BUNDLE) { files.push([entry.relPath, entry.getContent(answers)]) }` API in `scaffold()`; (4) user-specific protocols folder concept handled with zero added complexity today (the shipped `protocols/` *is* the user-owned surface per original intent; registry provides cheap hook for future "generalized starters vs. user-owned files" separation or preserve-on-reinit semantics without touching flow or writer); (5) future protocols or entirely new optional bundles (e.g. examples/, extra-docs/) become 1-2 line additions in the bundle definition with no cross-cutting changes elsewhere.
- Design adheres to all project constraints (ESM static imports only, no globs/runtime discovery, composition + registry over conditionals, "one obvious place" generalized to the bundle module for grouped optionals, minimal surface, surgical) and the spirit of the Critical wiring rule. Full trade-off analysis and pseudocode included in proposal.
- This pass: pure analysis + design proposal + required CONTEXT update. No files added, no templates or wiring modified (deepening designs from earlier same-day session remain drop-in compatible with the proposed registry). Ready for review/approval before any implementation.
- Updated this Recent changes section per project rules (AGENTS.md / Claude.md).

### 2026-05-27 — Full internal protocol execution (Verification + Audit + Security + Cleanup)
- Executed all four requested internal protocols as part of testing the delivered feature.
- Cleanup: Clean (dry-run + actual).
- Security: Clean (no hardcoded secrets, clean npm audit, proper .env handling, no dangerous exec patterns, good file write discipline).
- Verification: All core steps passed (build, 100 tests, multi-platform scaffold, protocols feature, overwrite guard logic).
- Audit: Multi-lens review (Frontend, Backend, Code Auditor + prior best-practice review) completed. No release-blocking issues found in the recent work.
- Consolidated findings table delivered below (in session response).

### 2026-05-27 — Remediation of internal Verification & Audit protocols — Medium/Low findings
- Added practical live Execution Log tables to both protocols (major usability improvement for during-run recording).
- Added lightweight "Risk Focus" sections to both files.
- Made overall Success Criteria more demanding and measurable (especially in Audit).
- Added explicit Postconditions/Teardown guidance in Verification.
- Fixed remaining minor inconsistencies.
- All changes remain surgical and lightweight.

The two core internal QA runbooks are now significantly stronger against the best practices referenced in the project while preserving their original pragmatic character.
- Addressed the two Critical findings from the best-practice audit:
  - Converted the procedural Steps in `protocols/verification.md` to a narrow, scannable table format (SeleniumBase-inspired) for much higher determinism and executability during runs.
  - Restructured the 6 process Steps in `protocols/audit.md` into a clear table + stabilized the default lens registry (reducing excessive improvisation while preserving the powerful multi-perspective model).
- Also improved the non-deterministic success criterion in the `nullprobe update` manual test (now requires observable log entry or clear error surfacing).
- Changes are surgical and preserve the lightweight character of both runbooks.
- Both protocols now better exemplify the table-driven, deterministic practices the project advocates.

### 2026-05-27 — Exploration Protocol v3 (self-improvement engine)
- Evolved the internal Exploration protocol (`protocols/exploration.md`) to v3.0.0 and the generalized template to v1.2 as a dedicated self-improving / self-development tool for the project.
- Key additions (surgical, lightweight): Step 0.5 Targeted Nullprobe Self-Improvement Inquiry (directed queries from live PLAN/CONTEXT/wiki gaps), enhanced 5-field finding template with "Nullprobe Integration Proposal" block (target artifact + micro-proposal), new Step 8 Synthesis & Promotion (with mandatory filing back of high-ROI items), prior-run reflection, expanded nullprobe self-dev discovery lenses, and bidirectional sibling protocol alignment.
- Both the rich internal version (primary engine for developing nullprobe) and the lighter generalized version were updated.
- Directly addresses the user's request to treat the protocols as self-improvable tools for AI-driven expansion, improvement, and polishing of the project.
- Build clean. 100 tests passing.

### 2026-05-27 — QA Protocols Remediation — Major phases delivered
- Phases 1 & 2: Safety improvements (better overwrite warning + user-specific folder guidance), messaging fix, prompt gated behind "specific" approach, test coverage added.
- Phase 3: Structural cleanup complete — introduced `protocol-bundle.ts` as single source of truth, eliminated path duplication, converted static protocols to clean `const` exports, simplified scaffolder wiring to a registry loop.
- Phase 4: Content depth complete — all three previously thin protocols (security, exploration, cleanup) significantly deepened with tables, high-signal universal starters, exclusion/novelty filters, OWASP views, "why safe" rationales, and strong extension points (following expert subagent design).
- Build clean, 100 tests passing, manual scaffold verification successful with full deepened set.
- Full plan in `docs/REMEDIATION_QA_PROTOCOLS.md`. Remaining work is mostly documentation polish (Phase 5).
- Ready for next major task: focused improvement of the Exploration protocol as a self-improving mechanism for the project.
- Messaging fixed in init prompt (now accurately says "full set of 5").
- Stronger, dedicated overwrite warning when `protocols/` files exist, plus guidance recommending a separate user-specific folder (e.g. `protocols/custom/`).
- QA protocols prompt now correctly gated behind `approach === 'specific'` (protects the core lightweight experience).
- Added unit test coverage for the `includeProtocols` path + seeding.
- Build and all tests green.
- Full phased Remediation Plan (including structural cleanup + content deepening for the 3 thin protocols) is in `docs/REMEDIATION_QA_PROTOCOLS.md`.
- Next major focus after remediation: Treating the Exploration protocol as a self-improving tool for the project.
- Comprehensive cross-verification audit completed using `protocols/audit.md` multi-lens approach (3 specialized subagents + direct checks).
- Major gaps identified: thin v2 protocols (Critical), unconditional prompt violating lightweight philosophy (High), overwrite risk for living protocol files, wiring duplication, missing tests, messaging drift.
- Detailed phased Remediation Plan written to `docs/REMEDIATION_QA_PROTOCOLS.md` covering all requested levels (fixes + structural improvements + content depth).
- User decisions incorporated: gate prompt behind "specific" approach, deepen the three thin protocols, stronger overwrite warning + recommendation for separate user-specific protocols folder, yes to structural cleanup (registry pattern).
- Plan ready for owner review/approval before implementation begins. Two expert subagents provided high-quality design input for content deepening and refactoring.

### 2026-05-26 — Full generalized QA protocols completed (all 5)
- Implemented generalized `security.md`, `exploration.md`, and `cleanup.md` for user projects (following the same lightweight style as verification + audit).
- All five now ship together when the user opts into QA protocols during `init`.
- Updated PLAN.md §4 status + Next Actions (now accurate).
- Added feature mentions to README.md, CLAUDE.md, AGENTS.md, GEMINI.md, and expanded AI_FRAMEWORK Part IX.
- Wiring, build, and manual verification completed.

### 2026-05-26 — Generalized QA Protocols shipped (implementation per approved design)
- Optional opt-in during `init`: one confirm ("Include customizable QA protocols...?") + optional short free-text for 1-3 "must never regress" items.
- New top-level `protocols/` (README + generalized verification.md using 3-col tables + audit.md using structured findings table) with clear "Add your own..." extension points.
- Seeded starter rows (VER-100+) from user input; fully platform-agnostic.
- New builders in `src/scaffolder/templates/`, wiring in index.ts + platforms.ts (ALWAYS_WRITTEN), small flow addition modeled on extra MCPs.
- AI_FRAMEWORK.md (source) updated with Part IX guidance so AIs in user projects know to use them.
- PLAN.md §2.10 verification scenario + backlog item closed in CONTEXT.
- All changes surgical, default-off, zero impact on recommended path. Build + tests + manual scaffold verified.

### 2026-05-26 — Audit Remediation Complete (Antigravity session)
- Applied and verified all fixes from the 2026-05-25 audit report (tracked in `docs/AUDIT_FIX_HANDOFF.md`).
- Key fixes include: `npm pack` safety via `prepublishOnly`, correct `.agent`/`.gemini` namespaces documented in `AGENTS.md`, network timeouts enforced in github/tavily clients, prompt-injection sanitized in search flows.
- Baseline live-confirmed: `tsc --noEmit` exit 0, 98 tests pass, branch coverage **89.02%**.

### 2026-05-25 — Audit protocol added + first multi-lens audit run (Claude Code session)
- `protocols/audit.md` — new runbook: multi-perspective QA review via specialized subagents (frontend / backend / ML personas + code auditor + reqs-vs-reality + adversarial). Read-only, structured-table output, prioritized remediation grouping.
- `protocols/prompts/audit-spec.md` — original + polished prompt preserved (matches existing `prompts/` convention).
- `protocols/README.md`, `CLAUDE.md` — wired Audit row into both protocol tables.
- `package.json` — added `protocol:audit` script (echo pointer; protocol requires an AI agent to drive subagents).
- First audit run produced **32 findings**: 1 release-blocker (`npm pack` ships no `dist/` — `bin` would dangle on publish), 8 high-severity (overwrite guard gap on `AI_FRAMEWORK.md`/`wiki/*`, Gemini-CLI skill path contradicts its own comment, 7-location version drift, init-flow's intent capture is a placebo, backend/ML stack-blindness), and 23 medium-to-nit (stale comment block, error-swallowing in github/client, dead `installSkill` field, marketing-vs-reality drift, missing timeouts on a few network calls, prompt-injection vector via search→wiki).
- Baseline live-confirmed: `tsc --noEmit` exit 0, 47/47 tests pass, branch coverage **88.49%** (CONTEXT previously claimed 89.81% — drift recorded), `npm audit` 0 vulnerabilities.
- Subagent fanout caveat noted: 4 of 6 parallel subagents bounced with "Credit balance is too low" before producing findings. L4/L5/L6 performed inline; L1 inferred from overlapping L2/L3 evidence. Lesson captured in `wiki/log.md` + `wiki/index.md`.
- **No code changes made during audit** — report is the deliverable; remediation deferred until owner picks a batch.

### 2026-05-25 — Dev MCP expansion + optional-MCP customization step (Claude Code session)
- Dev MCP configs in repo root (`.mcp.json`, `.cursor/mcp.json`, `.agent/mcp_config.json`, new `.gemini/settings.json`) now include `context7`, `shadcn`, `chrome-devtools`, `github` MCPs for contributor sessions — NOT shipped via init by default
- `src/scaffolder/templates/mcp-context7.ts` refactored — exports `buildMcpConfig(extras)` builder + `EXTRA_MCP_CHOICES` registry; `MCP_CONTEXT7_CONFIG` kept for back-compat
- `src/types.ts` — `InitAnswers.extraMcps: ExtraMcpId[]` added; new `ExtraMcpId` union type
- `src/flows/init-flow.ts` — new optional confirm + checkbox: "Customize MCP servers?" (default off → context7 only)
- `src/scaffolder/index.ts` — `platformExtras()` now uses `buildMcpConfig(answers.extraMcps)` instead of the static constant
- Tests: 47 pass (added 1), branch coverage 88.49%
- `docs/PLAN.md` — new §0 (MCP customization tracker), §0a (MCP discovery aggregator roadmap), §2.9 (verification scenario)

### 2026-05-25 — MCP config paths fixed + tests + verification (Claude Code session)
- `src/scaffolder/index.ts` — Claude now scaffolds `.mcp.json` (was empty); Gemini CLI now uses `.gemini/settings.json` (was `.agent/mcp_config.json`); cases split
- `src/scaffolder/platforms.ts` — detectPaths updated for claude and gemini-cli
- `src/github/client.ts` — added `AbortSignal.timeout(10_000)` to gist fetch (was hanging indefinitely on unreachable gist)
- Test suite: 46 tests, 89.81% branch coverage — all pass
- `verify.sh` — e2e verification script (expect-driven init + direct API tests for update)
- `docs/PLAN.md` §2 verification — all 8 scenarios confirmed passing
- `.gitignore` — added `.env.local` and `.env.*.local`
- `.env.local` — Tavily API key (gitignored)

### 2026-05-25 — protocols added (Claude Code session)
- `protocols/README.md` — index and discovery instructions for all runbooks
- `protocols/exploration.md` — AI environment discovery runbook (web/X/Reddit/repo sources)
- `protocols/verification.md` — deterministic test + manual test + spec cross-check runbook
- `protocols/security.md` — OWASP Top 10 / secrets / deps / permissions security runbook
- `protocols/cleanup.md` — artifact cleanup with dry-run mode
- `protocols/prompts/protocol-spec.md` — original prompt saved for reference
- `package.json` — added `protocol:verify`, `protocol:security`, `protocol:cleanup`, `protocol:cleanup:dry`, `protocol:explore` scripts
- `CLAUDE.md`, `AGENTS.md`, `README.md` — all updated to reference `/protocols/`

### 2026-05-25 — v0.2 shipped (Claude Code session)
- `src/scaffolder/skill-to-mdc.ts` — SKILL.md → Cursor .mdc transformer (parseSkillMeta, stripSkillFrontmatter, wrapAsMdc)
- `src/scaffolder/platforms.ts` — platform registry (claude, cursor, gemini-cli, antigravity) with skillPath/detectPaths/extraFiles
- `src/scaffolder/index.ts` — uses PLATFORMS registry; cursor/antigravity write skills as .mdc/.md via platform.extraFiles()
- `src/flows/init-flow.ts` — checkExistingFiles is now platform-aware (uses PLATFORMS[platform].detectPaths)
- `src/search/tavily.ts` — fetch-based Tavily wrapper (no SDK), full error codes
- `src/flows/update-flow.ts` — real GitHub and Tavily search backends wired; results appended to wiki/log.md
- Antigravity skill path: `.antigravitycli/rules/` (confirmed — `.windsurf/rules/` was wrong)

### 2026-05-24 — v0.1 bootstrapped (Claude Code session)
- Built full CLI: `init` + `update` commands
- Scaffolds: AI_FRAMEWORK.md, 4 skills, wiki/index.md, wiki/log.md
- Multi-env setup: `.claude/`, `.cursor/`, `.agent/` namespaces
- Context7 MCP across all 3 environments
- Committed and pushed to https://github.com/dmitrii-esin/nullprobe
