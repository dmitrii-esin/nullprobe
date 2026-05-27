# PRE-PUBLISH CHECKLIST — nullprobe Multi-Registry Release

**Purpose:** One single, comprehensive, orchestratable checklist to safely prepare and execute publishing nullprobe across multiple package registries and distribution channels (npm + GitHub Releases + install script + Homebrew + Scoop + future channels).

**Philosophy:** Clear → Safe → Simple. Every item traces to a concrete risk (supply chain, user confusion, broken installs, security, or reputation).

**When to use:** Before the first public release and before every subsequent major/minor release that touches distribution.

**How to use:**
- Copy this file or work directly in it during the release cycle.
- Mark items `[x]` only when truly complete (with evidence where required).
- Do not skip gates.
- Log major decisions and blockers to `wiki/log.md`.

**Existing protocols this checklist integrates with:**
- `protocols/security.md` (run via `npm run protocol:security`)
- `protocols/verification.md`
- `protocols/cleanup.md`

---

## Current Preparation Sprint (May 2026) — Do These First

This sprint focuses on **preparation only** (no publishing). Complete these items before the first public release.

- [x] Packaging hygiene
  - [x] `tsconfig.json` excludes `**/*.test.ts` (no more test files in published `dist/`)
  - [x] `package.json` has proper `repository`, `author`, `homepage`, `bugs`
  - [x] `prepublishOnly` guard strengthened
- [x] README overhaul (clear, scannable, user-friendly)
  - [x] Install section leads with honest current state + future paths
  - [x] Status table condensed into a short honest paragraph
  - [x] Documentation follows modern CLI best practices
- [x] Standalone installer
  - [x] Root `install.sh` replaced with production-style POSIX downloader + graceful fallback messaging
- [x] Orchestration research complete
  - [x] `docs/RELEASE_ORCHESTRATION_EVALUATION.md` created (recommends GoReleaser v2 as primary)
  - [x] Draft `.goreleaser.yaml` created at repo root
- [ ] Run full verification gate (see Phase 1 + Phase 8) and confirm everything is green
- [ ] Light updates to `docs/PLAN.md` §3 with GoReleaser/JReleaser findings (optional polish)
- [ ] Owner review + code review of all prep changes

**Gate:** All items in this sprint marked complete + verification passes before moving to "first real release" execution.

---

## Phase 0: Strategic & Governance Decisions (Gate 0)

Do these first. Publishing architecture decisions here affect everything downstream.

- [ ] **Decide target version** — Stay at `0.x` (pre-1.0) or promote to `1.0.0`? Document rationale in wiki/log.md.
- [ ] **Package name & scope decision** — Keep `nullprobe` (unscoped) or move to `@dmitrii-esin/nullprobe`? (Unscoped is strongly preferred for CLIs.)
- [ ] **Primary distribution story** — Define the "recommended" install path for new users in 2026 (npm global? one-liner curl? Homebrew?).
- [ ] **Deprecation plan for current install method** — How will we communicate "stop cloning + building from source"?
- [ ] **First-publish special requirements** — Confirm npm account has 2FA enabled and is ready for provenance (`--provenance`).
- [ ] **License & copyright review** — MIT is already in place. Confirm all embedded templates (AI_FRAMEWORK.md, skills, protocols) have correct attribution or are original.
- [ ] **Repository URL finalized** — GitHub repo must be public and match what will be in `package.json`.

**Gate 0 sign-off:** All Phase 0 items complete + decision log entry in `wiki/log.md`. Do not proceed without this.

---

## Phase 1: Internal Safety & Verification (Gate 1 — Non-negotiable)

These are hard blockers. Run the project's own protocols.

- [ ] Run full **Security Protocol** (`npm run protocol:security` + manual steps in `protocols/security.md`)
  - [ ] Secrets scan (including Tavily handling)
  - [ ] `npm audit` — zero CRITICAL/HIGH or all documented + accepted
  - [ ] Command injection + path traversal review
  - [ ] File write scope review
  - [ ] Network request audit (Tavily + GitHub client)
  - [ ] Exposed files / npm pack hygiene check
  - [ ] No `postinstall`/`preinstall` scripts
  - [ ] OWASP applicability table reviewed
  - [ ] Security report generated and CRITICAL items logged to `wiki/log.md`
- [ ] Run full **Verification Protocol** (`protocols/verification.md`)
  - [ ] Clean build + all automated tests pass (≥80% branch on core modules)
  - [ ] Manual scaffold tests across platforms (Claude, Cursor, etc.)
  - [ ] Overwrite guard verified
  - [ ] `nullprobe update` behavior verified
  - [ ] Structured execution log filled
- [ ] Run **Cleanup Protocol** (dry-run first) — workspace is clean before packaging work begins.
- [ ] Manual `npm pack --dry-run` inspection
  - [ ] Only expected files in tarball (`dist/`, `AI_FRAMEWORK.md`, LICENSE, README, package.json)
  - [ ] No test files (`*.test.js`) present in `dist/`
  - [ ] No `.js.map` source maps (or explicit decision to ship them)
  - [ ] Package size reasonable (< 100 kB unpacked is ideal for a CLI)

**Gate 1 sign-off:** Security report = CLEAR, Verification report = all PASS, `npm pack --dry-run` looks clean. No open CRITICAL/HIGH findings.

---

## Phase 2: Packaging & Build Hygiene (npm Foundation)

- [ ] **Fix `dist/` pollution** (critical for clean npm publish)
  - [ ] Update `tsconfig.json` or build script so tests are excluded from `dist/` output (or compile tests to a separate folder)
  - [ ] Decide on source maps for published package (recommended: disable for production publish)
  - [ ] Update `build` script or add `prepack` / `prepublishOnly` logic if needed
- [ ] **Complete `package.json` metadata** (many items currently missing)
  - [ ] Add `"repository"` (full object with type + url)
  - [ ] Add `"author"` (name + email + url)
  - [ ] Add `"homepage"`
  - [ ] Add `"bugs"`
  - [ ] Add `"keywords"` — expand beyond current set if helpful for discoverability
  - [ ] Add `"funding"` (optional but good practice)
  - [ ] Review `"files"` field — still optimal?
  - [ ] Consider adding `"publishConfig"` (e.g., registry, access)
- [ ] Add or update `prepublishOnly` safety guard (already partially present — strengthen it)
  - Must run build + verify no test artifacts + run a minimal smoke test of the published tarball
- [ ] Verify shebang + executable bit on `dist/index.js` survives packaging
- [ ] Confirm `engines` field is accurate and tested

**Evidence required:** Final `npm pack --dry-run` output (clean) committed or pasted into the release issue.

---

## Phase 3: Binary / Standalone Distribution Foundation

This is the prerequisite for GitHub Releases, install script, Homebrew, Scoop, etc.

- [ ] Validate `bun build --compile` works for nullprobe
  - [ ] Test on current platform
  - [ ] Test cross-compilation targets (at minimum: darwin-arm64, darwin-x64, linux-x64, linux-x64-musl, windows-x64)
  - [ ] Measure binary size and startup time; document trade-offs
- [ ] Create build matrix script or GitHub Action step (even if not yet wired to releases)
- [ ] Decide binary naming convention (`nullprobe-<os>-<arch>`, with/without extension)
- [ ] Decide on version embedding (build-time constants via `--define`)
- [ ] Create minimal `install.sh` (POSIX) + `install.ps1` (Windows) skeleton (even if incomplete)
  - Must detect platform/arch, download from future GitHub Releases URL pattern, verify SHA256, place in PATH
- [ ] Document minimum supported OS/arch matrix (e.g., macOS 12+, Ubuntu 20.04+, Windows 10+)

**Gate:** You can successfully produce at least 3 working standalone binaries from source.

---

## Phase 4: Documentation & User Guidance Overhaul (Clarity Gate)

Users must never be confused about how to install.

- [ ] **Major README rewrite**
  - [ ] New "Install" section as the #1 thing on the page (prominently)
  - [ ] Clear installation matrix table (npm | one-liner | Homebrew | Scoop | source | npx)
  - [ ] Recommended method called out explicitly
  - [ ] "Quick start" that works in < 30 seconds for the primary method
  - [ ] Migration guide from "clone + build + link" → new methods
  - [ ] Update all "Status" tables that still say "npm publish: Not yet"
- [ ] Update `package.json` description + README "description" alignment
- [ ] Create or update `CHANGELOG.md` (or decide on GitHub Releases as changelog source)
- [ ] Update `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` install instructions (they currently assume source)
- [ ] Add clear "Requirements" section (Node ≥18 for npm path; nothing for binary path)
- [ ] Add security / provenance notes for advanced users (npm provenance, binary checksums)
- [ ] Review all code examples and commands for accuracy post-publishing

**Clarity test:** A stranger should be able to install correctly in two different ways after reading only the README for 60 seconds.

---

## Phase 5: Release Process & Automation

- [ ] Design + implement (or at least design) the release workflow
  - Preferred: Tag-driven (`v1.0.0`) GitHub Action that:
    - Runs full verification + security protocols
    - Builds all binaries + checksums
    - Publishes to npm (with provenance)
    - Creates GitHub Release with binaries attached
    - (Later) updates Homebrew tap + Scoop bucket
- [ ] Add `npm run release` or `npm run publish` convenience script (or document the exact sequence)
- [ ] Decide on changelog generation strategy (manual vs automated)
- [ ] Set up required secrets / OIDC for trusted publishing (npm provenance)
- [ ] Document the full release runbook (even if the automation is partial)

---

## Phase 6: Secondary & Future Channels Preparation

Do the scaffolding now so later work is just "flip the switch".

- [ ] **Homebrew**
  - [ ] Create `dmitrii-esin/homebrew-nullprobe` repo (or decide on naming)
  - [ ] Draft initial Formula (binary download from GitHub Releases + SHA)
  - [ ] Decide automation strategy (manual updates vs GoReleaser-style action)
- [ ] **Scoop**
  - [ ] Create bucket repo skeleton
  - [ ] Draft initial JSON manifest
- [ ] **Winget** (optional early work)
  - [ ] Study manifest requirements
- [ ] **JSR** (optional)
  - [ ] Evaluate dual-publishing cost/benefit
- [ ] **One-liner install script hosting**
  - [ ] Decide final URL pattern (`https://nullprobe.dev/install.sh` vs raw GitHub vs dedicated domain)
- [ ] **Docker** (low priority)
  - [ ] Skeleton `Dockerfile` using a binary stage if desired

---

## Phase 7: Legal, Supply Chain & Reputation

- [ ] npm package provenance + attestation enabled on first publish
- [ ] Consider SBOM generation (optional but increasingly expected)
- [ ] Confirm all third-party code (skills, protocols, AI_FRAMEWORK) has appropriate licensing/attribution
- [ ] Add `SECURITY.md` (even a minimal one) — where to report vulnerabilities
- [ ] Review `.github/dependabot.yml` or equivalent (or add it)
- [ ] Decide on long-term maintenance & ownership signal (README badge, funding, etc.)

---

## Phase 8: Final Pre-Release Verification & Dry Runs

- [ ] Full end-to-end dry run of intended release process (on a throwaway tag or branch if possible)
- [ ] Test `npm install -g` from the packed tarball (or TestPyPI equivalent via Verdaccio / local registry)
- [ ] Test standalone binaries on at least macOS + Linux (ideally Windows too)
- [ ] Test the (even partial) install script against the binaries
- [ ] Run `npm pack` one final time and do a human review of every file that will be published
- [ ] Update `docs/CONTEXT.md` "Recent changes" and "Current status" with the publishing work

---

## Phase 9: Go-Live Orchestration Plan

This is the actual publishing day checklist.

- [ ] Announce maintenance window (if needed) in relevant channels
- [ ] Create the release Git tag
- [ ] Execute the release automation (or manual sequence)
- [ ] Verify npm package appears and is installable within minutes
- [ ] Verify GitHub Release + binaries are live
- [ ] (If doing Homebrew/Scoop on day 1) push tap/bucket updates
- [ ] Update all primary docs (README, website if any, etc.) to remove "not yet published" language
- [ ] Post release notes to `wiki/log.md` + GitHub discussion / release
- [ ] Monitor for 24–48h:
  - npm download / install issues
  - GitHub issue reports about broken installs
  - Security or supply-chain alerts

---

## Phase 10: Post-Publish Cleanup & Iteration

- [ ] Archive or clearly mark old "install from source" instructions
- [ ] Update internal contributor docs (AGENTS.md etc.)
- [ ] Add the new install methods to the shipped QA protocols (if users opt in)
- [ ] Schedule the next distribution improvement (e.g., Homebrew automation, Winget)
- [ ] Celebrate responsibly and log lessons in `wiki/log.md`

---

## Quick Reference: Existing npm Scripts to Use

```bash
npm run protocol:security      # Full security checks
npm run protocol:verify        # (alias for manual verification flow)
npm run protocol:cleanup       # Workspace hygiene
npm run protocol:cleanup:dry
npm pack --dry-run             # What will actually be published
npm run build
npm test
```

---

## Notes for Future Releases

- After the first publish, many items in Phases 0–2 become lighter (metadata rarely changes).
- The heavy recurring work will be in **Phase 1 (Safety)** + **Phase 8 (Dry runs)** + **Phase 9 (Orchestration)**.
- Consider creating a lightweight "Release Captain" runbook that references this checklist.

---

**Last updated:** 2026-05-XX (replace with actual date when you start using this)

**Owner for this release cycle:** ________________

This single document is now the master orchestration tool for safe multi-registry publishing of nullprobe. Use it ruthlessly.