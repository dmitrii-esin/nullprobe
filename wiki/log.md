# Wiki Log — nullprobe development

> Chronological, append-only record of what happened.
> Format: `## [YYYY-MM-DD] operation | Title`

---

## [2026-05-27 11:30] explore v3 | Deep Research on 5 Mandated Sources (DD-Agents, Hindsight, AIDD, Hallmark, Mem0)

**Previous run:** 2026-05-27 (various QA protocol remediation + Exploration v3 design/implementation sessions)  
**Time window:** Publications and repo activity primarily 2026-02 → 2026-05 (with emphasis on last 90 days where possible)  
**Focus:** Targeted deep execution of the full Exploration protocol v3 (Step 0.5 self-improvement inquiry, exclusion triage, broad sweeps, exact 5-field + Integration Proposal template) on the five high-signal sources previously listed in PLAN.md §4a.

### Key Findings (Summary)
- **F1 Hallmark** (Nutlope): 65+ blocking slop-test gates + self-critique + "study" verb. Very high novelty (Apr 2026, rapid adoption). Strong for simplicity-guard + output quality in shipped protocols.
- **F2 DD-Agents** (zoharbabin): Neurosymbolic 13-agent pipeline with deterministic symbolic cross-domain triggers + 5 hard blocking quality gates (citation verification, accusatory framing, NOT_FOUND escape, dedup, numerical audit) + persistent compound KB with graph + fingerprint lineage. Highest ROI for nullprobe.
- **F3 Hindsight** (Vectorize): Institutional knowledge vs personalization split. Fact extraction at write + multi-strategy retrieval + `reflect` synthesis. MCP-first. Model for wiki / Cognitive Firewall evolution.
- **F4 AIDD + SudoLang**: Large specialized skill library + constraint-based typed pseudocode (20-30% token savings). Useful contrast and selective patterns.
- **Agent Skills standard** (agentskills.io, 2026): Progressive disclosure via SKILL.md + YAML frontmatter. Validates and strengthens nullprobe's multi-env skill approach.

**Top 3 by ROI ÷ Effort (lightweight test):** F2 (DD-Agents gates + lineage), F1 (Hallmark slop gates), F3 + Agent Skills standard.

**Incorporation Highlights (see full report for details):**
- Blocking quality gate patterns (citation, accusatory, slop, symbolic triggers) → generalized verification/audit protocol tables.
- Institutional memory model + reflect synthesis → wiki evolution and Exploration v3 Step 8.
- Alignment with 2026 Agent Skills standard.

### Outputs
- Detailed user-facing report with tables and proposals: [docs/exploration-2026-05-27-mandated-sources.md](../docs/exploration-2026-05-27-mandated-sources.md)
- Technical sidecar: [wiki/exploration/2026-05-27.md](exploration/2026-05-27.md)
- Full query trace, raw artifacts, and session work: `/tmp/nullprobe-explore-2026-05-27/`

**Run Summary:** 6-7 novel high-signal items after rigorous exclusion + substance filtering. ~50 minutes. All mandated sources received deep multi-source analysis (articles + repos + recency + cross-references). No security/breaking findings.

---

## [2026-05-27] documentation + remediation | QA Protocols — Final user-facing improvements + comprehensive logging
  - Updated main README.md with clear Prerequisites and step-by-step usage for the shipped QA protocols feature.
  - Enhanced `protocol-readme.ts` (user-facing) with realistic starter examples, MCP guidance, Exploration internal-vs-generalized note, and Changelog stub.
  - Added Changelog sections to deepened generalized templates.
  - Updated AI_FRAMEWORK.md Part IX + notes in AGENTS.md/Claude.md about the bundle pattern.
  - All findings from the consolidated table (F-01 to F-07) addressed.
  - Full session (implementation, audits, protocol execution runs, remediation, final docs) now properly recorded in wiki/log.md and docs/CONTEXT.md Recent changes.
  - Git: All changes committed and pushed to master (commit 35afa38). Session closed.
  - Added minimal `## Changelog` sections to the three deepened generalized templates (`protocol-security.ts`, `protocol-exploration.ts`, `protocol-cleanup.ts`).
  - Updated `AI_FRAMEWORK.md` Part IX with better guidance on MCP usage and internal vs shipped distinction.
  - Added clarifying notes in `AGENTS.md` and `CLAUDE.md` about the `PROTOCOL_BUNDLE` registry pattern for grouped optional artifacts (per remediation plan).
  - All documentation and content changes were surgical, followed best practices from the original handoff, and addressed the full list of findings from the consolidated audit table (F-01 through F-07).
  - Comprehensive logging of the entire session's work (protocol implementation, full remediation, multi-lens audits, internal protocol execution runs, and final improvements) completed across wiki/log.md and docs/CONTEXT.md.

## [2026-05-27] remediation | QA Protocols — Full remediation (Phases 1-4)
  - Safety + UX: Strong overwrite warning + user-specific folder recommendation implemented.
  - Philosophy: Prompt now correctly gated behind "specific" approach.
  - Structural: Clean registry-based design (`protocol-bundle.ts`), no more duplication, static protocols converted to const exports.
  - Content: Security, Exploration, and Cleanup protocols substantially deepened with tables and useful starters.
  - Verification: Build clean, 100 tests passing, manual end-to-end check successful.
  - Full internal protocol execution run (Verification, Audit, Security, Cleanup):
    - Cleanup: Passed.
    - Security: Passed (clean scans and audits).
    - Verification: Passed (build + 100 tests + multi-platform manual checks + protocols feature + overwrite logic all exercised successfully).
    - Audit: Multi-lens review completed (Frontend + Backend + Code Auditor). No critical issues in the delivered feature.
    Consolidated human-readable table of all findings/gaps from the full protocol run delivered in session.

  - Remediation of internal Verification & Audit protocols — full pass:
    - Critical: Steps converted to scannable tables (VER-001, AUD-001).
    - High/Medium: Added Execution Logs for live recording, Risk Focus sections, stricter measurable success criteria.
    - Low: Added Postconditions/teardown guidance, minor polish.
    All changes surgical and lightweight. The two protocols are now meaningfully stronger examples of the best practices the project advocates.
  - Exploration protocol evolved to v3 (internal) + v1.2 (generalized) as self-improving engine...

## [2026-05-27] remediation | QA Protocols — Phase 1+2 (safety, gating, test coverage)
  - Fixed inaccurate prompt text.
  - Added prominent overwrite warning for protocols/ + recommendation for separate user-specific folder (protocols/custom/ etc.).
  - Gated the QA protocols question behind "specific" approach (protects lightweight default path).
  - Added unit test for includeProtocols + seeding.
  - Build + 98 tests green.
  - Full remediation plan (structural + content depth for remaining 3 protocols) documented in docs/REMEDIATION_QA_PROTOCOLS.md.
  - Preparation complete for deeper work on Exploration protocol as self-improvement mechanism.

## [2026-05-26] implement | Full generalized QA Protocols (all 5) for contributors + users
  - Created generalized versions of security, exploration, and cleanup protocols (in addition to the previous verification + audit).
  - All five now ship as an optional bundle when users answer "yes" during `nullprobe init`.
  - Updated PLAN.md §4 (status + actions), main docs (README/CLAUDE/AGENTS/GEMINI), AI_FRAMEWORK Part IX, and verification scenario.
  - Build + tests green. Manual scaffold verification passed with full set.

## [2026-05-26] implement | Generalized QA Protocols (verification + audit) per approved design
  - Optional opt-in `protocols/` shipped to user projects (3 files: README + 3-col verification with seeded priorities + structured audit table).
  - One confirm + one free-text input in init-flow (default off, modeled on extra MCPs).
  - New template builders + wiring in scaffolder (ALWAYS_WRITTEN for overwrite guard).
  - AI_FRAMEWORK.md Part IX added so AIs know to use the protocols.
  - PLAN §2.10 + CONTEXT backlog closed + recent changes.
  - Build green, 98/98 tests pass, manual scaffold verified on Claude + Cursor with seeded cases.
  - Strictly followed lightweight principle, think-before-coding, and simplicity-guard. Zero scope creep.

## [2026-05-24] init | Project bootstrapped

  Decision: Start nullprobe v0.1 as a lightweight AI Knowledge OS injector CLI.
  Tech: TypeScript, ESM-only, @inquirer/prompts, Commander.js, @octokit/rest, chalk, ora
  Success criteria: CLI outputs AI_FRAMEWORK.md + 1 skill + wiki/index.md + wiki/log.md in <30s
  Result: All 4 files scaffolded successfully. Build compiles clean. --help works.

## [2026-05-24] decision | Core philosophy clarified

  The tool is lightweight above all else. Instead of overloading with multi-framework design,
  it asks two questions: (1) what AI environment? (2) recommended tools, something specific,
  or search? This is the core differentiator and must be the first thing anyone reads.

## [2026-05-24] lesson | @inquirer/prompts over inquirer

  inquirer v9.3 does not ship TypeScript declarations.
  @inquirer/prompts (same team) is the modern replacement — fully typed, ESM-only, individual imports.
  Switched and type-check passes clean.

## [2026-05-24] update | Applied source repo skills to project itself

  Installed 4 skills from referenced repositories into .claude/skills/:
  - think-before-coding (from andrej-karpathy-skills, Principle 1)
  - simplicity-guard (from andrej-karpathy-skills, Principle 2)
  - session-crystallize (from rohitg00 LLM Wiki v2, 4-tier consolidation)
  - context7-research (from upstash/context7, live docs pattern)
  The scaffolder now outputs all 4 alongside nullprobe-intro when users run `init`.
  Project eats its own dog food: same skills it ships, it uses.

## [2026-05-24] update | Multi-environment setup (nebula-horizon pattern)

  Applied parallel namespace pattern from nebula-horizon:
  - .claude/ (Claude Code) — skills, settings, karpathy plugin
  - .cursor/ (Cursor) — rules (.mdc), MCP config
  - .agent/ (Antigravity/Gemini CLI) — rules, MCP config
  MCP: context7 configured across all 3 environments (.mcp.json, .cursor/mcp.json, .agent/mcp_config.json)
  Created AGENTS.md as the multi-tool overview doc (Cursor reads this as root instructions)
  Behavioral rules (Karpathy) replicated in each tool's native format

## [2026-05-25] search | GitHub search: "memory management"

  Query: memory management
  Backend: github
  Results: 0

---

## [2026-05-25] search | GitHub search: "memory management"

  Query: memory management
  Backend: github
  Results: 0

---

## [2026-05-25] search | GitHub search: "memory management"

  Query: memory management
  Backend: github
  Results: 0

---

## [2026-05-25] search | GitHub search: "memory management"

  Query: memory management
  Backend: github
  Results: 0

---

## [2026-05-25] search | Tavily search: "cursor rules 2025"

  Query: cursor rules 2025
  Backend: tavily
  Results: 7
  - Ultimate Cursor AI IDE Rules Guide: All 5 Levels and ... - YouTube — https://www.youtube.com/watch?v=gw8otRr2zpw
  - Top Cursor Rules for Coding Agents - PromptHub — https://www.prompthub.us/blog/top-cursor-rules-for-coding-agents
  - How To Use Cursor AI (Full Tutorial For Beginners 2025) - YouTube — https://www.youtube.com/watch?v=cE84Q5IRR6U
  - Cursor IDE Rules for AI: Guidelines for Specialized AI Assistant — https://kirill-markin.com/articles/cursor-ide-rules-for-ai
  - Cursor Rules in Action: How Our Engineers Use It at Atlan — https://blog.atlan.com/engineering/cursor-rules

---

## [2026-05-25] search | Queued Tavily search: "test"

  Query: test
  Backend: tavily — not yet configured
  Blocked by: TAVILY_API_KEY not set
  Next: set TAVILY_API_KEY then run: nullprobe update

---

## [2026-05-25] security | Security protocol run — CLEAR

  Overall status: CLEAR

  Check | Status | Finding
  Secrets scan | PASS | 2 matches, both false positives: env-var read (github.ts) + placeholder text (update-flow.ts)
  Dependency audit | PASS | 0 vulnerabilities (npm audit clean)
  Command injection | PASS | No exec/spawn/eval in src/; all paths via path.resolve()
  File write scope | PASS | All writes under path.resolve(userTarget); no system paths
  Network requests | PASS | HTTPS only; Tavily key in Authorization header, not URL; AbortSignal.timeout on all fetch calls
  Exposed files | PASS | .env/.env.local in .gitignore; git ls-files shows no secrets; npm pack contains only dist/ + docs
  Permission scope | PASS | No postinstall/preinstall scripts; bin is nullprobe only
  OWASP cross-check | PASS | A01/A03/A05/A06/A09 covered; A02/A07/A10 not applicable

---

## [2026-05-25] audit | New audit protocol implemented + first run

  Added /protocols/audit.md — multi-perspective QA review runbook that spawns specialized
  subagents (frontend / backend / ML personas + code auditor + reqs-vs-reality + adversarial)
  and aggregates findings into a structured table. Wired into protocols/README.md, CLAUDE.md
  table, and `npm run protocol:audit`. Original + polished prompts preserved at
  protocols/prompts/audit-spec.md.

  First-run results (32 findings, sorted by severity):
  - 1 RELEASE-BLOCKER (AUD-001): npm pack ships 4 files, NO dist/. `npm publish` from
    current HEAD would push a broken package — `bin: ./dist/index.js` is a dangling pointer.
    No prepublishOnly script. Need: `"prepublishOnly": "npm run build"`.
  - 8 HIGH-severity: overwrite guard misses AI_FRAMEWORK.md + wiki/* (silent clobber on
    re-init); gemini-cli scaffolds skills to .claude/skills/ despite the maintainer's own
    comment forbidding it; version drift across 7 locations (banner v0.1, package.json
    0.1.0, CONTEXT v0.2); init-flow discards user's typed intent (placebo prompt);
    backend/ML personas get zero stack-relevant content; post-scaffold next-step messages
    reference wrong paths for 3 of 4 platforms.
  - 12 MEDIUM: stale 38-line comment block in scaffolder/index.ts; github/client.ts
    swallows all errors as null; mergeMcpServers overwrites corrupt JSON without backup;
    refresh-stub says "coming in v0.2" but we ARE v0.2; installSkill field is dead code;
    marketing oversells ("scaffold any type of software project" vs delivered AI-meta).
  - 8 LOW + 3 NIT: prompt-injection vector via search→wiki path, missing timeouts on
    octokit.listCommits + tavily response.json, tsconfig moduleResolution "bundler" wrong
    for direct Node ESM execution.

  Baseline confirmed clean: `tsc --noEmit` exit 0; 47/47 tests pass; branch coverage 88.49%
  (slight drift from CONTEXT's 89.81% claim); npm audit 0 vulnerabilities.

  Subagent fanout caveat: 4 of 6 parallel agents bounced with "Credit balance is too low"
  before producing findings (L1 frontend, L4 code auditor, L5 reqs-vs-reality, L6 security).
  Performed L4/L5/L6 inline; L1 inferred from overlapping L2/L3 evidence. Lesson: when
  fanning out across many subagents, expect partial failures and have a fallback path.

---

## [2026-05-25] lesson | Subagent fan-out is not all-or-nothing — plan for partial failure

  Spawning N parallel subagents via the Agent tool does not guarantee N results. Subagents
  can bounce for orthogonal reasons (rate limits, credit balance, transient model errors).
  When fanning out for a multi-perspective task: (a) make each lens independently valuable
  so partial coverage still produces a useful report, (b) be prepared to perform missing
  lenses inline if they're critical, (c) cap subagent count at ~4-6 max — beyond that, the
  failure probability compounds and the synthesis burden outweighs the parallelism win.

---

## [2026-05-25] lesson | Run `npm pack --dry-run` before declaring a release ready

  The verification protocol passed (tests + build + e2e). The audit protocol caught a
  release-blocker the verification protocol cannot catch: when `dist/` was cleaned, the
  package became un-publishable but every other check still goes green. Distribution
  surface (`npm pack`) must be a first-class verification step, not an afterthought.
  Action item: add `npm pack --dry-run | grep -q dist/` as a step in protocol:verify, OR
  add `prepublishOnly: npm run build` so the publish step self-heals.

---

## [2026-05-26] fix | Audit remediation complete

  Applied all planned fixes from the 2026-05-25 audit report:
  - Surface fixes: tsconfig moduleResolution updated, file-writer JSON backup logic added, octokit and tavily timeouts enforced.
  - Deep fixes: package.json prepublishOnly script added to prevent empty publish, docs synchronized with code realities.
  - Tests verified: npx tsc --noEmit && npm test pass clean. Branch coverage maintained at 89.02%.
  All findings from AUDIT_FIX_HANDOFF.md marked as DONE.

---
