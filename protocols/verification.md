# Verification Protocol

**version:** 1.0.0
**purpose:** Deterministic end-to-end verification of nullprobe — automated tests, manual test cases, and spec cross-checks — producing a structured pass/fail report.
**when to run:** Before any release, after any non-trivial change, or when CI is unavailable.
**output:** Structured report printed to stdout and optionally saved to `wiki/log.md`.

## Prerequisites

- `node >= 18` installed
- Dependencies installed: `npm install`
- Build compiles cleanly: `npm run build`
- Optional: `/tmp/test-probe/` writable (manual scaffold tests)

---

## Steps

### 1. Clean Build

**What:** Ensure the compiled output is fresh and matches source.
**How:**
  ```bash
  rm -rf dist/
  npm run build
  ```
**Success:** `tsc` exits 0, `dist/index.js` exists and is executable (`chmod +x` applied by build script).

---

### 2. Run Automated Test Suite

**What:** Execute all unit and integration tests with coverage.
**How:**
  ```bash
  npm test
  # Equivalent: vitest run --coverage
  ```
**Success criteria:**
  - Exit code 0 (all tests pass)
  - Coverage report generated in `coverage/`
  - Branch coverage ≥ 80% on `src/scaffolder/`, `src/flows/`, `src/search/`
  - No skipped tests without a comment explaining why

**On failure:** Note failing test names, error messages, and file:line references. Do not proceed to Step 3 until fixed or explicitly accepted as a known failure.

---

### 3. Manual Test — `nullprobe init` (clean directory)

**What:** Scaffold into a fresh temp directory and verify all expected files are created.
**How:**
  ```bash
  rm -rf /tmp/test-probe && mkdir /tmp/test-probe
  npm run dev -- init /tmp/test-probe
  # Select: Claude, recommended setup
  ```
**Verify these files exist:**
  ```bash
  ls /tmp/test-probe/AI_FRAMEWORK.md
  ls /tmp/test-probe/wiki/index.md
  ls /tmp/test-probe/wiki/log.md
  ls /tmp/test-probe/.claude/skills/nullprobe-intro/SKILL.md
  ls /tmp/test-probe/.claude/skills/think-before-coding/SKILL.md
  ls /tmp/test-probe/.claude/skills/simplicity-guard/SKILL.md
  ls /tmp/test-probe/.claude/skills/session-crystallize/SKILL.md
  ```
**Success:** All 8 files exist, none are empty (size > 0).

---

### 4. Manual Test — `nullprobe init` (overwrite guard)

**What:** Confirm the overwrite prompt fires when files already exist.
**How:**
  ```bash
  # Re-run init into the same directory from Step 3
  npm run dev -- init /tmp/test-probe
  ```
**Success:** The flow asks whether to overwrite existing files before proceeding. Files are not silently overwritten.

---

### 5. Manual Test — `nullprobe init` (Cursor platform)

**What:** Verify Cursor-specific output (`.mdc` skills in `.cursor/rules/`).
**How:**
  ```bash
  rm -rf /tmp/test-cursor && mkdir /tmp/test-cursor
  npm run dev -- init /tmp/test-cursor
  # Select: Cursor, recommended setup
  ```
**Verify:**
  ```bash
  ls /tmp/test-cursor/.cursor/rules/
  # Expect: *.mdc skill files
  ```
**Success:** At least one `.mdc` file present in `.cursor/rules/`.

---

### 6. Manual Test — `nullprobe update`

**What:** Verify the update command runs without crashing and writes to wiki/log.md.
**How:**
  ```bash
  # Run from the nullprobe repo root (needs network)
  npm run dev -- update
  ```
**Success:** Command exits 0 (or non-zero only on genuine network error), `wiki/log.md` is updated with a new entry if search returns results.

---

### 7. Cross-Check Against Requirements

**What:** Verify that documented features match actual behavior.
**How:** For each row in the status table in `docs/CONTEXT.md`, confirm:

  | Feature | Expected | Actual | Pass/Fail |
  |---------|----------|--------|-----------|
  | `nullprobe init` scaffolds 4 skills + wiki | Step 3 verified | — | — |
  | `nullprobe update` GitHub + Tavily search | Step 6 verified | — | — |
  | Multi-env scaffold (Claude/Cursor/Antigravity) | Steps 3+5 verified | — | — |

**Success:** Every "Working" row in CONTEXT.md is covered by a passing test case above.

---

### 8. Generate Report

**What:** Produce the structured verification report.
**How:** Fill in:
  ```
  ## Verification Report — YYYY-MM-DD

  **Build:** PASS / FAIL
  **Automated tests:** PASS / FAIL  (N passed, N failed, coverage: X%)
  **Manual — init (clean):** PASS / FAIL
  **Manual — init (overwrite guard):** PASS / FAIL
  **Manual — init (Cursor):** PASS / FAIL
  **Manual — update:** PASS / FAIL
  **Spec cross-check:** PASS / FAIL

  ### Failures
  - <test name>: <error> (<file>:<line>)

  ### Gaps (requirements not covered by any test)
  - <gap description>

  ### Recommended fixes
  - <fix>
  ```
**Success:** Report is complete. All PASS or failures are documented with remediation steps.

---

## npm shortcut

```bash
npm run protocol:verify
# Runs: rm -rf dist && npm run build && npm test
# Manual steps require human execution — see runbook for full procedure.
```

---

## Success Criteria (overall)

- [ ] Build exits 0
- [ ] All automated tests pass, coverage ≥ 80% on core modules
- [ ] All manual test cases executed and documented
- [ ] Spec cross-check complete — no undocumented gaps
- [ ] Report generated

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
