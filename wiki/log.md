# Wiki Log — nullprobe development

> Chronological, append-only record of what happened.
> Format: `## [YYYY-MM-DD] operation | Title`

---

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
