export const PROTOCOL_SECURITY = `\
# Security Protocol (Generalized)

**version:** 1.1
**purpose:** Structured basic security hygiene — secrets, dependencies, injection risks, file scope, and supply chain awareness.
**when to run:** Before releases, after adding dependencies, after auth/network/file-write changes.
**output:** Severity-rated findings + remediation actions.

## Core Security Checks

Execute these starters and record findings:

| SEC-ID | Area                        | What to Verify                                      | Starter Method                                      | Severity if Missed |
|--------|-----------------------------|-----------------------------------------------------|-----------------------------------------------------|--------------------|
| SEC-001 | Secrets & Credentials      | No hardcoded API keys, tokens, passwords, PII      | Broad grep for common patterns + check .env* + .gitignore | Critical          |
| SEC-002 | Dependency Vulnerabilities | No HIGH/CRITICAL issues in package manager audit   | \`npm audit\` (or yarn/pnpm/cargo/pip equivalent)  | High              |
| SEC-003 | Command / Code Injection   | No unsanitized user/external input to shell/eval   | Grep for exec, spawn, eval + trace input sources   | Critical          |
| SEC-004 | File Write Scope           | Only write to intended, validated paths            | Review path.resolve usage + upload/temp handlers   | High              |
| SEC-005 | Sensitive File Exposure    | Secrets/configs excluded from git and published packages | \`.gitignore\` + \`npm pack --dry-run\` review   | Critical          |

## OWASP Top 10 Quick Applicability (adapt to your stack)

| OWASP Item | Typically Applies? | Covered by Starters Above | Your Project Notes |
|------------|--------------------|---------------------------|--------------------|
| A03 Injection | Very often | SEC-003 | |
| A05 Security Misconfiguration | Very often | SEC-005 | |
| A06 Vulnerable Components | Always | SEC-002 | |
| A08 Software/Data Integrity | Often | SEC-002, SEC-005 | |

## Add Your Project-Specific Security Concerns

Use SEC-1xx IDs. Examples:
- Handling of PII / financial / health data
- Compliance requirements (GDPR, SOC2, HIPAA, etc.)
- High-value payment or crypto flows
- Third-party SDK / supply chain policy

| SEC-ID | Area | Finding / Risk | Evidence | Recommended Action | Status |
|--------|------|----------------|----------|--------------------|--------|
| SEC-100 | (your area) | ... | ... | ... | Open |

## Success Criteria

- [ ] Secrets scan clean (or findings documented + mitigated)
- [ ] Dependency audit triaged
- [ ] High-risk code paths reviewed
- [ ] Project-specific risks listed above

---

*Generalized security protocol. Extend the tables with risks that matter in your domain.*

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 1.1     | 2026-05-27 | Deepened with table-driven checks and extension points |
`;

