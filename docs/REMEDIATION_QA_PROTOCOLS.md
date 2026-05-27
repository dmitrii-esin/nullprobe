# Remediation Plan — Generalized QA Protocols (Full Scope)

**Date:** 2026-05-27  
**Origin:** Cross-verification audit (2026-05-27) using `protocols/audit.md` multi-lens approach + direct verification.  
**Status:** Ready for owner review and approval before implementation.

---

## Executive Summary

The optional generalized QA protocols feature has been implemented in full (all 5 protocols now ship when opted in). However, the cross-verification surfaced meaningful gaps against nullprobe’s own principles ("lightweight above all", "two questions and done", Surgical Changes, Simplicity First) and against the original vision in the handoff (`protocols/prompts/generalized-qa-protocols.md` + approved design).

This plan addresses **all requested levels** of remediation:
- Fixes (messaging, safety, UX)
- Structural improvements (wiring, duplication, patterns)
- Content depth improvements (bringing the three thin protocols up to the quality bar of verification + audit)

All work will respect the user’s explicit decisions:
1. Gate the QA protocols prompt behind `approach === 'specific'` (like extra MCPs).
2. Deepen security, exploration, and cleanup protocols with proper table-driven, high-value starter content.
3. Add a clear overwrite warning for `protocols/` + guidance recommending users create a separate user/project-specific protocols folder for heavily customized content.
4. Perform the structural cleanup (registry pattern, remove unnecessary wrappers, single source of truth for the bundle).

The plan is phased, prioritized, and designed for surgical execution with minimal risk.

---

## Background & Audit Findings Summary

### Key Issues Identified (Consolidated from 3 Subagents + Direct Checks)

| Severity | Issue | Impact |
|----------|-------|--------|
| Critical | Security, Exploration, Cleanup are thin skeletons | Undermines the "full professional set" claim; users get little value from 3/5 protocols |
| High | QA protocols prompt is unconditional (appears on recommended path) | Violates "two questions and done" + lightweight philosophy |
| High | Overwrite guard treats living customized `protocols/` the same as one-time scaffold files | Real foot-gun for users who invest in the feature |
| High | Duplication + verbose wiring (6 imports, paths in two places, unnecessary function wrappers for static content) | Violates Surgical Changes + Simplicity First |
| High | "AI will consult these protocols" claim is aspirational, not real | Integration story is incomplete |
| Medium | No unit test coverage for the new feature | Risk and maintenance debt |
| Medium | Messaging drift (prompt still says "verification + audit" while shipping 5) | Confusion |

**Positive baseline:** v1 (verification + audit + README) is high quality and aligns well with the original best-practice research and design intent.

---

## Scope of This Remediation (User-Confirmed)

- **All three levels**: Fixes + Structural improvements + Content depth improvements.
- Specific decisions incorporated:
  - Prompt gating: behind `approach === 'specific'`.
  - Content: Deepen the three protocols (table-driven, useful starters, strong extension points).
  - UX safety: Stronger warning for `protocols/` overwrite + explicit recommendation for users to create a separate user-specific protocols folder.
  - Structural: Registry + single source of truth, remove boilerplate function wrappers for static content, clean bundle handling.

**Non-goals for this plan (unless explicitly added later):**
- `nullprobe update` refresh support for generalized protocols (still deferred).
- Changes to internal contributor `/protocols/` runbooks.
- New init questions or heavy customization UI.

---

## Phased Remediation Plan

### Phase 0 — Preparation & Design Validation (Low effort, high value)

- Review and approve this plan.
- (Optional but recommended) Quick alignment call / async confirmation on any tradeoffs.
- Update `docs/CONTEXT.md` Recent changes with a "Remediation Plan approved" entry once greenlit.

**Owner action required:** Approve or request adjustments.

---

### Phase 1 — Quick Wins & Safety Fixes (Small surface, immediate user benefit)

1. **Fix messaging drift**
   - Update the confirm prompt text in `src/flows/init-flow.ts` to accurately reflect the full set of 5 protocols.

2. **Improve overwrite safety for `protocols/`**
   - Keep protocols in `ALWAYS_WRITTEN` (for detection).
   - Add a dedicated, higher-friction warning message in `init-flow.ts` when existing protocol files are detected (distinct from the generic "Overwrite them?" prompt).
   - Update the shipped `protocols/README.md` (and generalized README template) with strong guidance recommending users create a separate folder (e.g. `protocols/user/` or `my-protocols/`) for heavily customized / project-specific content that should never be at risk from re-init.

3. **Add minimal unit test coverage**
   - Add one focused test case in `src/scaffolder/index.test.ts` that exercises `includeProtocols: true` (with and without priorities) and asserts the 6 expected paths are written + seeding works.

**Deliverables:** Safer UX, accurate messaging, basic regression protection.

**Estimated effort:** Low (1–2 focused sessions).

---

### Phase 2 — Lightweight Philosophy Alignment (Flow change)

- Gate the entire "Include customizable QA protocols?" confirm + input behind `approach === 'specific'` (exact precedent used for extra MCP customization).
- Update related comments, the confirm message itself, and any documentation that describes when the question appears.
- Ensure the change is reflected in the new verification scenario (PLAN.md §2.10) and any manual testing guidance.

**Rationale:** Directly implements user decision #2 and restores stronger alignment with "two questions and done" for the default/recommended path.

**Deliverables:** Flow change + docs/test updates.

**Estimated effort:** Low–Medium (small but touches user-visible behavior and tests).

---

### Phase 3 — Structural Improvements (Architecture cleanup)

Implement the clean registry design proposed by the Architecture subagent:

- Create `src/scaffolder/protocol-bundle.ts` (single source of truth for the bundle definition: paths + content providers).
- Convert the 5 static protocol templates from `buildXxxProtocol()` functions to `export const PROTOCOL_XXX = `...`` (matching the existing skill/wiki pattern).
- Keep `buildVerificationProtocol(priorities)` as the only dynamic builder.
- Update `src/scaffolder/index.ts`: replace the 6-import + manual push block with a clean loop over the bundle.
- Update `src/scaffolder/platforms.ts`: derive the protocol paths from the bundle (eliminate duplication with `ALWAYS_WRITTEN`).
- Remove now-unnecessary protocol-specific imports from `index.ts`.
- Update the Critical wiring rule documentation (AGENTS.md / Claude.md) with one clarifying sentence about grouped optional bundles.
- Add a short comment in the new bundle file explaining the single-source intent.

**Deliverables:** Dramatically simpler, more maintainable wiring with zero behavior change. Future protocol additions become O(1) and low-risk.

**Estimated effort:** Medium (mechanical but requires care with the refactor).

---

### Phase 4 — Content Depth Improvements (Highest user-visible value)

Deepen `security.md`, `exploration.md`, and `cleanup.md` to the quality bar of the v1 protocols, following the detailed design from the QA Process Design subagent (and cross-referenced against the rich internal versions in `/protocols/` for inspiration only).

For each of the three:

- Adopt narrow, scannable tables with stable IDs (`SEC-###`, `EXP-###`, `CLN-###`).
- Include high-signal universal starter content (4–6 concrete, immediately useful rows/checks per protocol) with "Why safe / Why this matters" rationales.
- Provide clear, copy-paste-ready extension sections with example rows.
- Add minimal but useful supporting structures (exclusion/novelty filter for exploration, OWASP applicability view for security, dry-run + verification emphasis for cleanup).
- Ensure every file ends with a minimal Changelog section (to match guidance already in the generalized README).

Also perform the small enhancement to `protocol-readme.ts` to show realistic example rows for the new ID families.

**Deliverables:** Three substantially more valuable, table-driven generalized protocols that users will actually want to keep and extend.

**Estimated effort:** Medium–High (content creation is the bulk of the work; the subagent design makes it well-scoped).

---

### Phase 5 — Documentation, Polish & Verification

- Update all affected documentation to reflect the gated prompt, the new overwrite warning + user-specific folder guidance, the structural changes (high-level only), and the now-high-quality full set of 5.
- Refresh PLAN.md §2.10 (verification scenario) and §4 as needed.
- Update `AI_FRAMEWORK.md` Part IX if the integration story or descriptions benefit from the deeper content.
- Add a note in the shipped `protocols/README.md` about the recommended user-specific folder pattern.
- Run full build + test suite.
- Execute manual end-to-end verification (at minimum the updated 2.10 scenario on 2+ platforms, plus one "specific" path test).
- Update `docs/CONTEXT.md` Recent changes with a detailed completion entry.
- Append a concise entry to `wiki/log.md`.

**Deliverables:** Fully documented, verified, and consistent state.

**Estimated effort:** Low–Medium.

---

## Risk & Tradeoff Notes

- **Content depth (Phase 4)** is the largest single effort item. The subagent designs are intentionally scoped to stay lightweight while delivering real value.
- The structural refactor (Phase 3) is mechanical and low-risk but touches the core wiring file — will be done with full test + manual verification afterward.
- Gating the prompt (Phase 2) changes behavior for users who previously selected "recommended" and then answered yes to protocols. This is the correct long-term alignment per user decision.
- No behavior changes to the actual generated protocol content for users who are already using the feature (only improvements).

---

## Recommended Execution Order

1. Phase 0 (plan approval)
2. Phase 1 (quick safety + messaging wins — builds confidence)
3. Phase 2 (lightweight alignment)
4. Phase 3 (structural cleanup)
5. Phase 4 (content depth — do this after structure is clean)
6. Phase 5 (verification + final docs)

This order minimizes risk and allows incremental value delivery + testing.

---

## Next Steps

1. Owner reviews this plan and provides any adjustments or priorities.
2. Once approved, a detailed implementation todo list will be created and execution will begin (using subagents for content drafting or review where helpful, per the original request).
3. All changes will follow project rules (think-before-coding before non-trivial edits, surgical changes, simplicity guard at the end, CONTEXT + wiki updates, build + test verification).

---

**This document is the authoritative remediation plan.** All work will be traceable back to the 2026-05-27 audit findings and the user’s explicit decisions.

Ready for your review and approval.