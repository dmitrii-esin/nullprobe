# Protocol Specification Prompt

> Saved for learning purposes. This is the original prompt that produced the `/protocols/` runbooks.
> Date received: 2026-05-25

---

Implement consolidated, unified protocols as AI-agnostic runbooks. Choose format by project fit: primarily Markdown files in `/protocols/` (discoverable via README + AGENTS.md), plus npm scripts where automation adds value. Any AI opening the workspace must locate, read, and execute them without extra instructions.

All protocols must be:
- Human-readable, step-by-step, well-documented
- Deterministic for verification, security, and cleanup
- Versioned, with prerequisites, success criteria, outputs, and logs

**1. Exploration Protocol**
Runbook for continuous discovery of relevant AI environment updates.
- Search web, X, DEV.to, Reddit, blogs, and referenced repos (Karpathy skills, awesome-antigravity, Context7, memory techniques).
- Extract latest versions, features, concepts, and tools applicable to skills, IDEs, workflows, or setup.
- Output: date, source, summary, applicability, recommended action.
- Re-runnable with timestamped logs.

**2. Verification Protocol**
Deterministic verification runbook.
- Execute all automated tests via defined commands.
- Run every documented manual test case.
- Cross-check implementation against requirements and specs.
- Produce structured report: pass/fail, evidence, gaps, fixes.

**3. Security Protocol**
Structured security verification runbook.
- Follow OWASP Top 10 and relevant standards.
- Scan for secrets, API keys, PII, hardcoded credentials, misconfigurations, and exposed files.
- Check dependencies and permissions.
- Use available scanners + defined manual fallbacks.
- Generate severity-rated report with remediation steps. Block on critical findings.

**4. Cleanup Protocol**
Deterministic cleanup runbook.
- Remove temporary files, caches, build artifacts, logs, and test outputs.
- Respect .gitignore and project rules.
- Support dry-run mode, then execute with confirmation.
- Restore clean, reproducible workspace state and log changes.

Place runbooks in `/protocols/`. Add index and discovery instructions to README.md. Update package.json with `protocol:*` scripts where useful. Reference these protocols in any existing AI instruction files.

When completed - save this prompt as-is somewhere in the project for learning purposes and keep a reference.
