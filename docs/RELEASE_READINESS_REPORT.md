# nullprobe 1.0.0 Release Readiness Report

**Date:** May 2026  
**Status:** Preparation Complete — Ready for Final Review & Execution

> **For any future agent or contributor:**  
> Start here. This document + the linked release options describe the current state and next steps. Do not start new distribution work without reading this first.

---

## Summary of Work Completed

All requested preparation for a full multi-platform 1.0.0 release has been completed (no publishing performed).

### Commits Made
- `chore: preparation for 1.0.0 multi-platform release`
- `docs: add release orchestration evaluation and update planning artifacts for 1.0.0`

### Major Deliverables Created / Updated

**Core Improvements**
- README completely overhauled for clarity and modern expectations
- `install.sh` rewritten as a proper standalone installer
- New `install.ps1` (Windows PowerShell equivalent)
- Packaging hygiene fixes (`tsconfig.json`, `package.json` metadata)

**Planning & Documentation**
- `docs/RELEASE_1.0_PLAN.md` — High-level 1.0.0 release plan
- `docs/RELEASE_ORCHESTRATION_EVALUATION.md` — Research on GoReleaser vs alternatives
- `docs/release/` folder with three release options:
  - `manual.md`
  - `github-actions.md`
  - `goreleaser.md`
- `.github/workflows/release.yml` — Basic GitHub Actions release workflow
- `.goreleaser.yaml` — Draft production configuration
- `docs/PRE_PUBLISH_CHECKLIST.md` — Expanded with current preparation sprint

**Future-Proofing**
- Explicit notes added regarding future multi-language support (Scala, Java, Python, Rust, Dart, etc.)
- Three-tier automation strategy designed to scale

---

## Three Release Options Prepared

1. **Manual** (`docs/release/manual.md`) — Maximum control, lowest automation
2. **Basic GitHub Actions** (`docs/release/github-actions.md` + workflow file) — Moderate automation
3. **GoReleaser** (`docs/release/goreleaser.md`) — Highest automation (recommended long-term)

All three options are documented and ready for use.

---

## Remaining Items Needed From You

Before we can execute the actual 1.0.0 release together, please provide the following when you're ready:

### High Priority (Required for Automation)
- **GitHub Personal Access Token** (with `repo` + `workflow` write permissions) — needed for GoReleaser to update Homebrew/Scoop repos and create releases.
- Confirmation on **npm OIDC Trusted Publishing** setup (we chose Option B).

### Medium Priority
- Confirmation that you want the following repos created:
  - `dmitrii-esin/homebrew-nullprobe`
  - `dmitrii-esin/scoop-nullprobe`
- Any strong preference on binary naming (current proposal: `nullprobe_<version>_<os>_<arch>`)

### Lower Priority (Can be added later)
- Signing certificates (Windows / macOS)
- Cloudsmith / Packagecloud account (for apt repository)
- Apple Developer account (for notarization)

### Strategic
- Final confirmation on the full list of platforms for 1.0.0 (current plan is quite broad).

---

## Recommended Path Forward

1. You review the new files in `docs/release/` and `docs/RELEASE_1.0_PLAN.md`.
2. We have a short session to align on the exact scope and automation level for 1.0.0.
3. You provide the GitHub token (and any other secrets).
4. We run a final full verification together.
5. We execute the release using the chosen automation option (with you present).

---

**Everything is prepared.** We are blocked only on the items listed above and your final go-ahead.

Let me know when you're ready to review the new release documentation or when you have the GitHub token available. I'm ready to continue as soon as you give the signal.