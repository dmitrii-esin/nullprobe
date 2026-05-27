# nullprobe 1.0.0 Release Plan

**Target Version:** 1.0.0  
**Goal:** First stable, broadly distributed release with excellent multi-platform support.

## Release Philosophy for 1.0.0

- nullprobe should be easy to install for **anyone** who uses AI tools (not just Node.js developers).
- Prioritize low-friction installation paths: one-liner scripts, popular package managers, and direct binaries.
- Build sustainable automation from day one (three tiers of automation available).
- Leave clear room for future multi-language versions (Scala, Java, Python, Rust, Dart, etc.).

## Target Platforms for 1.0.0

### Tier 1 – Primary (Must work excellently)
- **npm** (with OIDC Trusted Publishing)
- **Standalone binaries** (GitHub Releases)
- **One-liner installer**
  - Bash/zsh: `curl` / `wget`
  - PowerShell (Windows)
- **Docker** (GHCR)

### Tier 2 – High Value Package Managers
- Homebrew (personal tap: `dmitrii-esin/homebrew-nullprobe`)
- Scoop (personal bucket: `dmitrii-esin/scoop-nullprobe`)
- Winget

### Tier 3 – Future / Nice to Have (prepare lightly)
- Version managers (`mise`, `aqua`)
- Chocolatey
- Self-hosted / Cloudsmith apt repository
- JSR

**Future Multi-Language Note:**  
The release infrastructure should be designed so that adding support for Scala, Java, Python, Rust, Dart, and other language-specific distributions in the future does not require a complete rewrite. The plan will call out extension points.

## Three Release Automation Options

We will prepare three parallel options so the project has flexibility:

1. **Manual Release Process** (lowest automation)
2. **Basic GitHub Actions Workflow** (moderate automation)
3. **GoReleaser-based Release** (highest automation, recommended long-term)

See the respective runbooks/workflows for details.

## Binary Naming Convention (Best Practice)

Adopted convention for 1.0.0 and beyond:

```
nullprobe_<version>_<os>_<arch>
```

Examples:
- `nullprobe_1.0.0_darwin_arm64`
- `nullprobe_1.0.0_linux_x64`
- `nullprobe_1.0.0_windows_x64.exe`

Checksum file: `checksums.txt` (SHA256)

This naming is clear, sortable, and widely used by modern CLI tools.

## Security & Supply Chain for 1.0.0

- GitHub Release attestations
- npm OIDC Trusted Publishing (no long-lived token)
- Checksums on all binary releases
- SBOM generation (via GoReleaser or GitHub)
- Optional: cosign signing (can be added later)

## Versioning & Breaking Changes

- 1.0.0 is the first stable release.
- We will be conservative with breaking changes after 1.0.0.
- Future major versions will be used for significant architectural shifts (including multi-language support if needed).

## Open Questions & Dependencies

Collected at the end of the preparation work (see final report).

## Timeline

This document is the planning artifact. Actual execution will happen in a controlled session with the owner.

---

**Status:** Prepared as part of the 1.0.0 readiness work (May 2026). Not yet executed.