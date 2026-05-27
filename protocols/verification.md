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

## Verification Steps

Use this table for execution. Mark status during the run.

| # | Step | Description / Key Actions | Expected Result |
|---|------|---------------------------|-----------------|
| 1 | Clean Build | `rm -rf dist/`<br>`npm run build` | `tsc` exits 0 and `dist/index.js` exists + is executable |
| 2 | Run Automated Test Suite | `npm test` (with coverage) | All tests pass<br>Branch coverage ≥ 80% on `src/scaffolder/`, `src/flows/`, `src/search/`<br>No unexplained skipped tests |
| 3 | Manual Test — clean `nullprobe init` | `rm -rf /tmp/test-probe && mkdir /tmp/test-probe`<br>`npm run dev -- init /tmp/test-probe` (Claude + recommended) | These 7 files exist and are non-empty:<br>• AI_FRAMEWORK.md<br>• wiki/index.md<br>• wiki/log.md<br>• 4 nullprobe skills under `.claude/skills/` |
| 4 | Manual Test — overwrite guard | Re-run the same init command into `/tmp/test-probe` | The flow prompts before overwriting; nothing is silently replaced |
| 5 | Manual Test — Cursor platform | `rm -rf /tmp/test-cursor && mkdir /tmp/test-cursor`<br>`npm run dev -- init /tmp/test-cursor` (Cursor + recommended) | At least one `.mdc` file exists in `.cursor/rules/` |
| 6 | Manual Test — `nullprobe update` | `npm run dev -- update` (from project root, network available) | Command exits 0 (or only fails on genuine network error) **and** `wiki/log.md` contains a new timestamped entry (or a clear network-error message is surfaced) |
| 7 | Cross-Check Against Requirements | For each "Working" item in `docs/CONTEXT.md`, confirm the corresponding verification step(s) actually cover it | All documented "Working" behaviors have passing evidence from steps above |
| 8 | Generate Report | Fill the structured report template (see below) | Report is complete with clear PASS/FAIL per category and remediation notes for any failures |

**On failure in any step:** Document the exact failure (command output, file:line, observed vs expected) before continuing. Do not silently accept failures.

**Postconditions / Teardown:** Remove any temporary directories created during testing (e.g. `/tmp/test-probe`, `/tmp/test-cursor`) unless you intentionally want to keep them for further investigation.

### Execution Log (use during the run)

Copy this table and fill it in real time:

| # | Step | Status (PASS / FAIL / BLOCKED / SKIP) | Actual Result / Evidence | Notes / Remediation |
|---|------|---------------------------------------|--------------------------|---------------------|
| 1 | Clean Build | | | |
| 2 | Run Automated Test Suite | | | |
| 3 | Manual Test — clean init | | | |
| 4 | Manual Test — overwrite guard | | | |
| 5 | Manual Test — Cursor | | | |
| 6 | Manual Test — update | | | |
| 7 | Cross-Check Against Requirements | | | |
| 8 | Generate Report | | | |

---

## Risk Focus (Key Areas This Protocol Covers)

This protocol primarily mitigates the following risks:

- Incorrect or broken scaffolding behavior (especially multi-platform drift)
- Regressions in core functionality after changes
- Silent data loss or destructive behavior (e.g. overwrite scenarios)
- Inaccurate claims in project documentation vs reality
- Network-dependent features failing without clear feedback

**Not covered here:** Security, performance, or long-term maintainability audits (see sibling protocols).

## npm shortcut

```bash
npm run protocol:verify
# Runs: rm -rf dist && npm run build && npm test
# Manual steps require human execution — see runbook for full procedure.
```

---

## Success Criteria (overall)

- [ ] Build exits 0
- [ ] All automated tests pass + branch coverage ≥ 80% on core modules (with no unexplained skips)
- [ ] All manual test cases executed with results recorded in the Execution Log
- [ ] Spec cross-check complete for all "Working" items in `docs/CONTEXT.md`
- [ ] Structured report generated with clear PASS/FAIL per category and remediation notes for failures

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
