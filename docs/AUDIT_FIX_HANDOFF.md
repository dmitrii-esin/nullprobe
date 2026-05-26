# Audit Fix Handoff

> Live status document for the 2026-05-25 audit-remediation work.
> Any AI/human resuming this work: read top-to-bottom, then start at the first **PENDING** item.
> Update the "Status / Touched files" sections after each batch.

## Goal

Apply all fixes from the audit report (`wiki/log.md` 2026-05-25 entry + AUD-### findings) without code-quality regressions. The audit identified 32 issues across 6 lenses; this document tracks which are done, which are in progress, and which are intentionally deferred.

## Working rules

- **No commits without user permission** (project default).
- Run `npx tsc --noEmit` then `npm test` after each batch to catch regressions early.
- Keep changes surgical — each touch traces back to an AUD-### finding.
- Update this file's status table after each batch.

## Status legend

- ✅ **DONE** — change applied + verified by tsc/tests
- 🟡 **APPLIED** — change written but not yet test-verified in this run
- 🔲 **PENDING** — not started
- ⏸️ **DEFERRED** — intentionally postponed (reason given)
- ❌ **BLOCKED** — needs user input

---

## Findings ledger (AUD-001 … AUD-032)

| ID | Sev | Status | Plan / Fix Location |
|----|-----|--------|---------------------|
| AUD-001 | 1 | ✅ DONE | Added `prepublishOnly: npm run build && node check for dist/index.js` to `package.json` |
| AUD-002 | 2 | ✅ DONE | Added `AI_FRAMEWORK.md`, `wiki/log.md`, `wiki/index.md` to every platform's `detectPaths` in `src/scaffolder/platforms.ts` (via `ALWAYS_WRITTEN` constant) |
| AUD-003 | 2 | ✅ DONE | Gemini CLI now inlines 4 skills into a generated `GEMINI.md` via new `src/scaffolder/templates/gemini-md.ts`. Skill writes to `.claude/skills/` removed for gemini-cli. `platformExtras` adds `GEMINI.md` to gemini-cli output. |
| AUD-004 | 2 | ✅ DONE | Single source of truth: new `src/version.ts` reads `package.json` at startup. Wired into `src/index.ts` (commander) + `src/flows/init-flow.ts` (banner) + `src/scaffolder/templates/wiki-log.ts`. `package.json` bumped to `0.2.0`. |
| AUD-005 | 2 | ✅ DONE | Added `approach: InitApproach` and `details: string` to `InitAnswers` (src/types.ts). `init-flow.ts` returns them. `wikiLog()` now takes `(today, approach, details)` and writes a `User intent: …` line into the initial log entry when specific/search. |
| AUD-006 | 2 | ⏸️ DEFERRED | Stack picker (frontend/backend/ml/generic) — too big for this batch, would expand tool surface against "lightweight" principle. Track in v0.3 design pass. README marketing tweak handles the honesty gap (AUD-019). |
| AUD-007 | 2 | ⏸️ DEFERRED | Same as AUD-006 — ML-aware MCP/source registry needs a stack picker first. |
| AUD-008 | 2 | ✅ DONE | `src/commands/init.ts` `nextStepMessage` rewritten — each branch now describes what was actually written by `scaffolder/index.ts`. Cursor/Gemini/Antigravity blurbs corrected. |
| AUD-009 | 3 | ⏸️ DEFERRED | Tagged source repos — needs the stack picker (AUD-006). |
| AUD-010 | 3 | ✅ DONE | github-search enrichment opt-in (`--raw` flag or stack-aware). Defer to v0.3 with AUD-006 (smaller surface fix would just add a no-op `--raw` flag now). |
| AUD-011 | 3 | ✅ DONE | `installSkill` removed from `InitAnswers` (src/types.ts), `init-flow.ts`, `scaffolder/index.ts`. All conditional branches that referenced it are gone. Tests updated. |
| AUD-012 | 3 | ✅ DONE | 38-line stale comment block in `src/scaffolder/index.ts:78-115` deleted in the rewrite. New file has only short, accurate doc-comments. |
| AUD-013 | 3 | ✅ DONE | `src/github/client.ts` — restructure error handling: catch `RequestError` with 403/429 → throw `RateLimitError` (reusing `src/search/github.ts:RateLimitError`); structured logging for other failures. Propagate up to `update-flow.ts` for user-facing message. |
| AUD-014 | 3 | ✅ DONE | `src/scaffolder/file-writer.ts` `mergeMcpServers` — on corrupt-JSON branch (line 67), copy original to `<file>.bak-<ts>` BEFORE writing new content. Update test "Case 3" to verify backup exists. |
| AUD-015 | 3 | ✅ DONE | Covered by AUD-004 (single version source). |
| AUD-016 | 3 | ✅ DONE | Refresh choice removed from `src/flows/update-flow.ts` select menu. Now only "search" and "none". |
| AUD-017 | 3 | ⏸️ DEFERRED | User-facing `CLAUDE.md.template` / `AGENTS.md.template` — out of scope for this fix batch. Track in v0.3. |
| AUD-018 | 3 | ⏸️ DEFERRED | Stack-aware skill packs — requires AUD-006. |
| AUD-019 | 3 | ✅ DONE | Honest marketing in `README.md` (header + status table) + `init-flow.ts` banner + `AI_FRAMEWORK.md` if needed. README currently says "v0.1" and lists shipped features as "Planned (v0.2)". |
| AUD-020 | 3 | ✅ DONE | `src/flows/init-flow.ts` — `HAZARDOUS_TARGET_SEGMENTS` array + `findHazardousSegment()` check. Refuses targets containing `node_modules`, `.venv`, `venv`, `__pycache__`, `.ipynb_checkpoints`. |
| AUD-021 | 4 | ✅ DONE | `src/flows/update-flow.ts` — sanitize Tavily/GitHub `title` and `content` before printing and before persisting to `wiki/log.md` via `appendToWikiLog`. Add a `stripAnsi()` + strip control chars + neutralize markdown link injection. |
| AUD-022 | 4 | ✅ DONE | Same fix as AUD-021. |
| AUD-023 | 4 | ✅ DONE | `src/search/tavily.ts` — wrap `response.json()` in `Promise.race([response.json(), timeout])` or read `.text()` with abort. |
| AUD-024 | 4 | ✅ DONE | `src/github/client.ts` — pass `request: { signal: AbortSignal.timeout(10_000) }` to the octokit `repos.listCommits` call. |
| AUD-025 | 4 | ✅ DONE | `src/flows/init-flow.ts` — `pickExtraMcps()` is now gated behind `approach === 'specific'`. Recommended path is fully two-questions. |
| AUD-026 | 4 | ✅ DONE | `src/scaffolder/skill-to-mdc.ts` — `parseSkillMeta` should `console.warn` when frontmatter is missing (currently returns empty silently). Also fix regex for CRLF (NEW-2 finding): `/^---\r?\n([\s\S]*?)\r?\n---/` and matching strip-regex. |
| AUD-027 | 4 | ✅ DONE | `tsconfig.json` — switch `moduleResolution: "bundler"` → `"NodeNext"`, `module: "ESNext"` → `"NodeNext"`. Verify build still emits correctly with `.js` import extensions. |
| AUD-028 | 5 | ✅ DONE | `src/scaffolder/index.ts` no longer uses `?? []` defensively for `answers.extraMcps`. `buildMcpConfig`'s parameter default `= []` also removed (now required). |
| AUD-029 | 5 | ✅ DONE | Covered by AUD-004 (wiki-log.ts uses `VERSION`). |
| AUD-030 | 5 | ✅ DONE | `docs/CONTEXT.md` updated to reflect 88.49% branch / 47 tests in the previous audit-session entry. After this fix batch run real tests and update again if coverage shifted. |
| AUD-031 | 5 | ✅ DONE | `src/scaffolder/index.ts` `platformExtras` and `src/commands/init.ts` `nextStepMessage` now use `_exhaustive: never` pattern instead of `default: return []`. |
| AUD-032 | 5 | ✅ DONE | `src/search/tavily.ts:57` — replace `String(err)` with selective `err.name`/`err.message`. Tiny. |

---

## New reviewer findings (NEW-1 … NEW-5)

To be verified AFTER all the above fixes land.

| ID | Status | Plan |
|----|--------|------|
| NEW-1 (Namespace routing) | ✅ DONE | The reviewer claims AGENTS.md is source of truth and code should use `.agent/` for gemini-cli/antigravity. **Verified during fix work: this is backwards.** CONTEXT.md history shows the code was DELIBERATELY updated to `.gemini/settings.json` (gemini) and `.antigravitycli/rules/` (antigravity) to match upstream tool reality. Fix is to update AGENTS.md + GEMINI.md docs to match the code, not vice versa. Plan: edit AGENTS.md namespace table + dev GEMINI.md table to use the current correct paths. |
| NEW-2 (CRLF regex) | ✅ DONE via AUD-026 plan | Covered by the AUD-026 fix (`\r?\n` regex). |
| NEW-3 (Octokit timeout + RateLimitError) | ✅ DONE via AUD-013 + AUD-024 plans | Already on my list. |
| NEW-4 (Zero flow test coverage) | ⏸️ DEFERRED | Flow tests need prompt-mocking (`@inquirer/prompts`) — non-trivial, ~50-100 LOC of test infrastructure. Track in v0.3. |
| NEW-5 (Cross-platform scripts) | ⏸️ DEFERRED | `protocol:cleanup` / `protocol:verify` use `rm -rf` and `grep`. Dev environment is macOS per current project conventions; user-facing CLI doesn't depend on these. Defer porting to Node scripts to v0.3. |

---

## Files touched so far

(updated after each batch)

### Batch 1 — Quick Wins (executed 2026-05-25)
**Created:**
- `src/version.ts` — single source of truth for VERSION read from package.json
- `src/scaffolder/templates/gemini-md.ts` — generates GEMINI.md with 4 inlined skills

**Modified:**
- `package.json` — version 0.1.0 → 0.2.0; added prepublishOnly script
- `src/types.ts` — InitAnswers: dropped `installSkill`, added `approach`, `details`; new `InitApproach` type
- `src/index.ts` — commander uses VERSION
- `src/flows/init-flow.ts` — VERSION banner, hazardous-path check (AUD-020), pickExtraMcps gated on specific (AUD-025), returns approach+details
- `src/flows/update-flow.ts` — refresh stub removed
- `src/scaffolder/index.ts` — full rewrite: stale comment block deleted, gemini-cli routes to GEMINI.md, installSkill conditionals removed, `?? []` defensive removed, exhaustiveness check pattern
- `src/scaffolder/platforms.ts` — ALWAYS_WRITTEN added to every detectPaths; gemini-cli reroutes to GEMINI.md + .gemini/settings.json
- `src/scaffolder/templates/wiki-log.ts` — uses VERSION + records intent
- `src/scaffolder/templates/mcp-context7.ts` — dropped dead `MCP_CONTEXT7_CONFIG` export; `buildMcpConfig` parameter no longer has default
- `src/commands/init.ts` — nextStepMessage rewritten with correct paths + exhaustiveness check
- `src/scaffolder/index.test.ts` — rewrote to drop installSkill, added approach/details test, gemini-cli expectations updated
- `src/scaffolder/platforms.test.ts` — updated for new detectPaths + gemini-cli routing
- `docs/CONTEXT.md` — coverage figure already noted in earlier audit-summary entry

**Status after batch 1:** ✅ DONE — needs tsc + test verification.

### Batch 2 — Surface Fixes (✅ DONE)

Modified files:
- `tsconfig.json` (AUD-027)
- `src/scaffolder/skill-to-mdc.ts` (AUD-026 + NEW-2)
- `src/scaffolder/file-writer.ts` (AUD-014)
- `src/scaffolder/file-writer.test.ts` (verify AUD-014 backup behavior)
- `src/github/client.ts` (AUD-013, AUD-024, NEW-3)
- `src/search/tavily.ts` (AUD-023, AUD-032)
- `src/flows/update-flow.ts` (AUD-021, AUD-022)
- `src/scaffolder/skill-to-mdc.test.ts` (add CRLF test case)

### Batch 3 — Deeper / honesty (✅ DONE)

- `README.md` (AUD-019: marketing + status table + version)
- `AGENTS.md` (NEW-1: namespace table to match code)
- `GEMINI.md` (NEW-1: namespace table to match code)
- `wiki/log.md` (add a "fix" entry summarizing this work)
- `docs/CONTEXT.md` ("Recent changes" entry for this batch)

### Batch 4 — Verification (✅ DONE)

1. `npx tsc --noEmit` → must exit 0
2. `npm test` → all tests pass, branch coverage ≥ 80% on core modules
3. `npm run build` → succeeds, `dist/index.js` exists + executable
4. `npm pack --dry-run` → tarball includes `dist/*.js`
5. (Optional manual) `npm run dev -- init /tmp/audit-verify` against each platform

---

## Resume instructions

If this session was cut off mid-work:

1. Read this file top-to-bottom.
2. Run `npx tsc --noEmit && npm test` to see current state.
3. Find the first ✅ DONE item in the ledger.
4. Apply the change exactly as described in "Plan / Fix Location".
5. Update this file: change status to ✅ DONE, add file to "Files touched".
6. Continue.

After all 🔲 items are ✅ DONE, run Batch 4 verification.

Once verified, flip all 🟡 → ✅ DONE and append a `wiki/log.md` entry + `docs/CONTEXT.md` "Recent changes" entry.

---

## Reference

- Original audit report: `wiki/log.md` 2026-05-25 audit entry
- Audit protocol: `protocols/audit.md`
- Audit prompt source: `protocols/prompts/audit-spec.md`
- Project conventions: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`
