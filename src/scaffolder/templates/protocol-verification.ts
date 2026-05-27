export function buildVerificationProtocol(priorities: string[] = []): string {
  const seededRows = priorities.length > 0
    ? priorities.map((p, i) => {
        const id = `VER-${100 + i}`;
        return `| ${id} | Manual + automated regression on: ${p} | No breakage in ${p} behavior or data |`;
      }).join('\n')
    : '| VER-100 | (Add your first critical check here) | (Describe the expected stable behavior) |';

  return `\
# Verification Protocol (Generalized)

**version:** 1.0  
**purpose:** Deterministic checks that the things that matter most in *this* project never regress.  
**when to run:** Before releases, after risky changes, or on a schedule.  
**output:** Filled table (add **Actual Result** + **Status** columns when executing).

## Core Verification Cases

Use this 3-column format (SeleniumBase-inspired — extremely scannable).

| ID      | Step Description                          | Expected Result                          |
|---------|-------------------------------------------|------------------------------------------|
| VER-001 | Basic smoke / happy-path launch           | App starts and core UI is responsive     |
${seededRows}

## Add Your Own Verification Cases Here

Copy the table header above and append rows. Use incrementing IDs (VER-###).

**Good candidates:**
- Business-critical user journeys unique to your domain
- Data integrity invariants ("X never goes negative")
- Cross-browser / cross-device behaviors you have historically broken
- Performance or accessibility regressions that matter to your users

**Execution tip:** Add two columns at runtime: \`Actual Result\` and \`Status (PASS/FAIL/BLOCKED)\`. Commit the results with the date.

## Success Criteria (overall)

- [ ] All core + your custom rows executed
- [ ] Failures documented with evidence
- [ ] New cases added for anything discovered during this run

---

*Lightweight starter shipped by nullprobe. Replace and extend with your real requirements.*
`;
}
