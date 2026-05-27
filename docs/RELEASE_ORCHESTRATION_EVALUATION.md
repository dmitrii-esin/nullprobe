# Release Orchestration Evaluation (2026)

**Goal:** Choose (or design) a tool/system that lets a single tag (`vX.Y.Z`) reliably publish nullprobe to as many relevant platforms as possible with minimal ongoing maintenance.

**Platforms in scope (per user request + PLAN.md):**
- npm
- Standalone binaries (via `bun build --compile`)
- One-liner curl/wget installer (bash, zsh, POSIX shells)
- Homebrew (tap + eventually core)
- Scoop (Windows)
- Winget (Windows)
- Optional later: Docker, JSR, self-hosted apt, version managers (mise, aqua), etc.
- Regular users on Linux, macOS, Windows (no package manager required)

## Evaluation of Leading Tools (mid-2026)

### 1. GoReleaser v2 (Strongest Recommendation for nullprobe)

**Verdict:** Best fit overall.

**Why it wins for us:**
- Mature, widely adopted gold standard for CLI tools.
- v2.16+ added **experimental but real Node.js support** via the `builder: node` + SEA (Single Executable Application) path. This is exactly what we need for a TS CLI that wants to ship native-feeling binaries.
- Excellent built-in publishers:
  - `homebrew_casks:` (the modern replacement for the deprecated `brews`)
  - `scoops:`
  - `npms:` (Pro) — can publish a thin wrapper package that downloads the right binary on `npm install -g`
  - GitHub Releases with automatic checksums, SBOM, cosign signing, etc.
- One command (`goreleaser release`) after a tag does the heavy lifting.
- Strong supply-chain features (now table stakes).
- Active development and good documentation.

**Trade-offs:**
- The Node SEA builder is still marked "experimental" (feedback encouraged).
- Full npm publishing features require GoReleaser Pro.
- We would still maintain a small custom `install.sh` (or let GoReleaser generate related artifacts).

**Recommendation:** Adopt GoReleaser v2 as the primary orchestration engine for the first public release and beyond. Start with a minimal `.goreleaser.yaml` focused on binaries + GitHub Releases + Homebrew + Scoop. Add the npm publisher later (or keep manual `npm publish` + postinstall binary downloader as a simpler path).

### 2. JReleaser

**Verdict:** Excellent language-agnostic alternative.

**Strengths:**
- Designed from day one to be universal (not Go-centric).
- Very strong on announcements, multiple package managers, signing, and cross-platform packaging.
- Works great as a standalone CLI or Maven/Gradle plugin (less relevant for us).

**Weaknesses for nullprobe:**
- Slightly less mature binary-building story for pure Node/TS compared to GoReleaser's new SEA support.
- Smaller community in the JS/TS CLI world.

**When to choose it:** If we ever have heavy multi-language needs or strongly prefer a 100% language-neutral tool.

### 3. Other Options

- **semantic-release** + custom GitHub Actions matrix: Very good for npm/JS versioning and changelogs. Would require significant custom work for binaries + Homebrew/Scoop. Higher maintenance.
- **release-please** (Google): Great at generating release PRs and changelogs from conventional commits. Pairs well *with* GoReleaser/JReleaser but is not a full replacement.
- **Pure custom GitHub Actions**: Maximum flexibility, zero extra tool. High ongoing maintenance cost as the number of targets grows.
- **dist (ex cargo-dist)**: Outstanding for Rust, less relevant here.

## Final Recommendation

**Primary path:** GoReleaser v2.

**Near-term (this preparation cycle):**
- Create a minimal `.goreleaser.yaml` (draft included in this repo).
- Keep the custom high-quality `install.sh` (it gives us immediate bash/zsh reach and is easy to keep in sync with GoReleaser-generated artifacts).
- Continue using the existing `PRE_PUBLISH_CHECKLIST.md` as the human orchestration layer.

**Later (post first release):**
- Expand the GoReleaser config to drive Homebrew tap updates, Scoop bucket, and (if Pro) the npm binary wrapper.
- Consider adding provenance + SBOM generation.

This gives us the best balance of "one tag → many platforms" while staying true to the project's lightweight philosophy.

## References
- https://goreleaser.com/
- https://goreleaser.com/customization/builds/builders/node/ (Node SEA builder)
- https://jreleaser.org/
- Existing project artifact: `docs/PLAN.md` §3 (still largely valid)

*Evaluation performed during the 2026 pre-release preparation cycle.*
