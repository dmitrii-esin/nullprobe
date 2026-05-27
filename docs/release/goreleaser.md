# GoReleaser Release Process (Option 3 - Recommended Long Term)

This is the highest-automation option and the recommended path after 1.0.0.

## Why GoReleaser?
- One tag → binaries + checksums + Homebrew tap + Scoop bucket + GitHub Release
- Excellent supply chain features
- Actively maintained and widely used by CLI tools
- Now has credible Node.js support

## Current State
We have a solid draft in `.goreleaser.yaml` at the root.

## Setup Steps (Future)

1. Create the two repos (owner will do this):
   - `dmitrii-esin/homebrew-nullprobe`
   - `dmitrii-esin/scoop-nullprobe`

2. Add a GitHub token as a secret (with repo + workflow write permissions) when ready to automate tap/bucket updates.

3. Configure npm OIDC (same as the basic workflow).

4. When comfortable, change the workflow to call `goreleaser release` instead of the custom steps.

## Recommended Migration Path
- v1.0.0 → Use Basic GitHub Actions (or Manual)
- v1.1.0 or v1.2.0 → Move to full GoReleaser

## Current `.goreleaser.yaml` Notes
The current draft is intentionally conservative. It documents the Node builder (still experimental) and leaves room for future multi-language distributions.

## Future Multi-Language Consideration
Because we plan to support Scala, Java, Python, Rust, Dart, etc. in the future, GoReleaser is a good choice because it is language-agnostic. We can evolve the config over time without throwing everything away.

## Command (when ready)
```bash
goreleaser release --clean
```