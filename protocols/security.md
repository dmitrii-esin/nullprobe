# Security Protocol

**version:** 1.0.0
**purpose:** Structured security verification of nullprobe — OWASP Top 10 checks, secrets scanning, dependency audit, permission review — producing a severity-rated report.
**when to run:** Before any release, after adding dependencies, after any auth/network/file-write change.
**blocking:** CRITICAL findings block release until resolved or explicitly accepted with a written justification.
**output:** Severity-rated report. CRITICAL findings are logged to `wiki/log.md`.

## Prerequisites

- `npm install` completed
- `git` available (for history scanning)
- Optional but recommended: `npm install -g secretlint` or `truffleHog` for secrets scan

---

## Checks

### 1. Secrets and Credentials Scan

**What:** Detect any API keys, tokens, passwords, or PII hardcoded in source or config files.
**How:**
  ```bash
  # Option A: grep (always available)
  grep -rn \
    -e "api[_-]key\s*=" \
    -e "apikey\s*=" \
    -e "secret\s*=" \
    -e "password\s*=" \
    -e "token\s*=" \
    -e "bearer\s" \
    -e "sk-[a-zA-Z0-9]" \
    --include="*.ts" --include="*.js" --include="*.json" --include="*.env" \
    --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git \
    .

  # Option B: secretlint (if installed)
  npx secretlint "**/*" --ignore-pattern "node_modules/**" --ignore-pattern "dist/**"

  # Option C: truffleHog (if installed)
  trufflehog filesystem . --exclude-paths=node_modules,dist,.git
  ```
**Review `src/search/tavily.ts`** specifically — it handles a user-supplied API key. Verify:
  - Key is read from environment variable, never hardcoded
  - Key is not logged to console or written to any file
**Review `.env` files:** Confirm none are committed (check `.gitignore`).
**Success:** Zero matches for credential patterns in tracked files. `.env` is in `.gitignore`.
**Severity if failed:** CRITICAL

---

### 2. Dependency Audit

**What:** Identify known vulnerabilities in npm dependencies.
**How:**
  ```bash
  npm audit
  # For a machine-readable report:
  npm audit --json > /tmp/npm-audit-$(date +%Y%m%d).json
  ```
**Triage:**
  - CRITICAL / HIGH: must be resolved before release (update, patch, or replace the package)
  - MODERATE: document and resolve within next release cycle
  - LOW / INFO: log and monitor
**Success:** `npm audit` exits 0, or all HIGH/CRITICAL findings have a documented resolution.
**Severity if failed:** CRITICAL (for HIGH+), HIGH (for MODERATE)

---

### 3. Command Injection Review

**What:** Verify that no user-supplied input is passed to `exec`, `spawn`, `eval`, or template literals in shell commands.
**How:**
  ```bash
  grep -rn \
    -e "exec(" -e "execSync(" -e "spawn(" -e "spawnSync(" \
    -e "eval(" -e "Function(" \
    --include="*.ts" --include="*.js" \
    --exclude-dir=node_modules --exclude-dir=dist \
    src/
  ```
**For each match:** Trace whether any argument originates from user input (argv, env, file content, API response). If yes, verify sanitization.
**nullprobe-specific:** The `init [path]` argument is passed directly to `fs.mkdirSync` / `fs.writeFileSync`. Verify path traversal is not possible — the path must be resolved with `path.resolve()` before use.
  ```bash
  grep -n "path.resolve\|path.join" src/scaffolder/index.ts src/commands/*.ts
  ```
**Success:** No unvalidated user input reaches shell execution. File paths are resolved, not concatenated raw.
**Severity if failed:** CRITICAL

---

### 4. File Write Scope Review

**What:** Ensure nullprobe only writes to the user-specified target directory, never to system paths or outside the project.
**How:**
  ```bash
  grep -rn "writeFileSync\|mkdirSync\|appendFileSync\|createWriteStream" \
    --include="*.ts" src/
  ```
**For each write call:** Confirm the target path is derived from the user-supplied `[path]` argument (resolved to absolute), not from a hardcoded system path.
**Success:** All write calls target paths under the resolved user argument. No writes to `/etc`, `~/.ssh`, or other system locations.
**Severity if failed:** CRITICAL

---

### 5. Network Request Review

**What:** Audit all outbound HTTP/HTTPS calls for security issues.
**How:**
  ```bash
  grep -rn "fetch(\|axios\|request(\|https.get\|http.get" \
    --include="*.ts" src/
  ```
**For each call, verify:**
  - URL is not constructed from unvalidated user input
  - API keys are passed as headers, never as URL query parameters (risk: logged in access logs)
  - TLS is not disabled (`rejectUnauthorized: false` or similar)
  - Response data is not passed to `eval` or `exec`
**Check `src/search/tavily.ts` and `src/github/client.ts` specifically.**
**Success:** All network calls use HTTPS, keys are in headers, no TLS bypass.
**Severity if failed:** HIGH (key in URL), CRITICAL (TLS bypass or eval of response)

---

### 6. Exposed Files and Misconfiguration

**What:** Ensure sensitive files are not tracked in git or included in the npm package.
**How:**
  ```bash
  # Check .gitignore covers common sensitive paths
  grep -E "\.env|\.env\.local|\.env\.\*|secrets|credentials" .gitignore

  # Check what npm would publish
  npm pack --dry-run 2>&1 | head -60
  # Verify: only dist/ and AI_FRAMEWORK.md are in the published package
  # (matches "files" field in package.json)

  # Check for accidentally committed env files
  git ls-files | grep -E "\.env|secret|credential|\.pem|\.key"
  ```
**Success:** `.env` variants in `.gitignore`, npm pack includes only `dist/` + `AI_FRAMEWORK.md`, no sensitive files in git index.
**Severity if failed:** CRITICAL (if credentials committed), HIGH (if sensitive config published to npm)

---

### 7. Permission and Scope Review

**What:** Verify the CLI requests only the permissions it needs.
**How:** Review:
  - `bin` field in `package.json` — only `nullprobe` binary, no unexpected scripts
  - `postinstall` / `preinstall` scripts — must not exist (install-time code execution risk)
  - `engines` field — correct Node version constraint
  ```bash
  node -e "const p = JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log(JSON.stringify({scripts: p.scripts, bin: p.bin, engines: p.engines}, null, 2))"
  ```
**Success:** No `postinstall`/`preinstall` scripts. Binary is the compiled CLI only.
**Severity if failed:** HIGH

---

### 8. OWASP Top 10 Applicability Check

**What:** Confirm which OWASP Top 10 items apply to nullprobe and that covered ones are addressed above.
**How:** For a local CLI tool scaffolding files:

  | OWASP Item | Applies? | Covered By |
  |-----------|----------|-----------|
  | A01 Broken Access Control | Partial — file write scope | Step 4 |
  | A02 Cryptographic Failures | No — no auth, no stored secrets | — |
  | A03 Injection | Yes — path args, shell calls | Steps 3, 4 |
  | A04 Insecure Design | Partial — principle of least privilege | Steps 4, 7 |
  | A05 Security Misconfiguration | Yes — exposed files, npm publish | Step 6 |
  | A06 Vulnerable Components | Yes — npm deps | Step 2 |
  | A07 Auth Failures | No — no auth | — |
  | A08 Software/Data Integrity | Partial — supply chain | Step 2 |
  | A09 Security Logging Failures | Partial — key logging risk | Steps 1, 5 |
  | A10 SSRF | No — URLs are hardcoded | — |

**Success:** All applicable items reviewed.

---

### 9. Generate Report

**What:** Produce the severity-rated security report.
**How:** Fill in:
  ```
  ## Security Report — YYYY-MM-DD

  **Overall status:** CLEAR / BLOCKED (critical findings present)

  | Check | Status | Severity | Finding | Remediation |
  |-------|--------|----------|---------|-------------|
  | Secrets scan | PASS/FAIL | — / CRITICAL | <detail> | <fix> |
  | Dependency audit | PASS/FAIL | — / HIGH | <detail> | <fix> |
  | Command injection | PASS/FAIL | — / CRITICAL | <detail> | <fix> |
  | File write scope | PASS/FAIL | — / CRITICAL | <detail> | <fix> |
  | Network requests | PASS/FAIL | — / HIGH | <detail> | <fix> |
  | Exposed files | PASS/FAIL | — / CRITICAL | <detail> | <fix> |
  | Permission scope | PASS/FAIL | — / HIGH | <detail> | <fix> |
  | OWASP cross-check | PASS/FAIL | — | <detail> | <fix> |
  ```

Log any CRITICAL finding to `wiki/log.md` with tag `security-finding`.
**Success:** Report complete. CRITICAL findings documented with remediation steps. Release blocked until resolved.

---

## npm shortcut

```bash
npm run protocol:security
# Runs: npm audit + grep-based secrets scan + npm pack --dry-run
# Full manual checks still required for release — see runbook.
```

---

## Success Criteria (overall)

- [ ] Zero secrets or credentials in tracked files
- [ ] `npm audit` clean (or all HIGH+ documented)
- [ ] No unvalidated user input reaches shell execution or file paths
- [ ] No sensitive files in git or npm package
- [ ] No `postinstall` scripts
- [ ] OWASP applicability review complete
- [ ] Report generated, CRITICAL findings logged

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-05-25 | Initial version |
