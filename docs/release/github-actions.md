# Basic GitHub Actions Release (Option 2)

This is the "moderate automation" path. It uses the workflow at `.github/workflows/release.yml`.

## How It Works
- Triggered by pushing a version tag (`v1.0.0`)
- Builds binaries using Bun across platforms
- Creates a **draft** GitHub Release with all artifacts + checksums
- Attempts to publish to npm using OIDC Trusted Publishing

## Setup Required

### 1. npm OIDC Trusted Publishing
- In npm, configure Trusted Publishing for the `nullprobe` package.
- Add a publishing environment called `npm-publish` in GitHub repo settings.
- No long-lived `NPM_TOKEN` is needed.

### 2. Workflow Safety Features (already included)
- Release is created as **draft** by default
- Conservative permissions

## Usage

```bash
# When ready to release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Then go to GitHub Actions → watch the run → review the draft release → publish it manually.

## Pros
- No local build required
- Reproducible
- Good audit trail

## Cons
- Less flexible than GoReleaser for Homebrew/Scoop updates
- Still requires manual steps for tap/bucket updates

## Recommendation
Good middle ground for 1.0.0 if you don't want to go all-in on GoReleaser yet.