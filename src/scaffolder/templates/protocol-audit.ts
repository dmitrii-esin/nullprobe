export const PROTOCOL_AUDIT = `\
# Audit Protocol (Generalized)

**version:** 1.0  
**purpose:** Brutally honest, multi-perspective review of *this* project from your domain's point of view.  
**when to run:** Before major releases, after large refactors, quarterly health checks.  
**output:** Structured findings table + prioritized remediation options.

## How to Run a Project Audit

1. Pick 3–6 lenses relevant to your stack and users (examples below).
2. Spawn (or ask your AI to act as) one reviewer per lens.
3. Each reviewer produces rows in the table below.
4. Aggregate, de-dupe, assign severity, and group into remediation options.

## Findings Table Template

| ID      | Severity | Category          | Location          | Finding                                      | Evidence / Reproduction          | Recommendation                          |
|---------|----------|-------------------|-------------------|----------------------------------------------|----------------------------------|-----------------------------------------|
| AUD-001 | High     | (e.g. UX / Data)  | (file or flow)    | Brief description of the issue               | How to see it                    | Concrete next step                      |

**Severity:** Critical / High / Medium / Low / Nit

## Suggested Starting Lenses (customize)

- End-user persona for your primary workflow (e.g. "power user doing daily reporting")
- Your specific tech stack (frontend, backend, data pipeline, mobile, etc.)
- Code / architecture auditor (dead paths, type holes, duplication)
- Requirements vs reality (compare your PRD / README claims to actual code)
- Security / robustness (inputs, secrets, error handling, supply chain)
- Accessibility / performance / compliance (whatever matters most to your users)

## Add Your Domain-Specific Risks & Custom Lenses Here

Below this line, add:
- New lens descriptions
- Project-specific risk categories
- Any AUD-### rows you discover or want tracked permanently

Example starter row you can keep or replace:

| AUD-100 | Medium | Domain Rule | [your critical flow] | [The thing that must never be violated in your business] | Manual test or log | Add automated guard or checklist step |

## Remediation Options (group findings here after each audit)

- **Quick wins (S):** ...
- **Deeper fixes (M/L):** ...
- **Deferrable:** ...
- **Won't-fix (with rationale):** ...

## Hard Rules for Your Audits

- Evidence required (file:line, command, or reproducible scenario).
- No code changes during the analysis pass — report only.
- Update this file with new rows as your project evolves.

---

*Generalized starter shipped by nullprobe. The table format and multi-lens approach are the valuable parts — fill them with *your* reality.*
`;

