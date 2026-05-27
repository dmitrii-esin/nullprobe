# Release Documentation

This folder contains the three release automation options prepared for nullprobe 1.0.0.

## Documents

- `manual.md` — Fully manual release process
- `github-actions.md` — Basic GitHub Actions workflow (moderate automation)
- `goreleaser.md` — GoReleaser-based automation (recommended long-term path)

## Supporting Files

- `.github/workflows/release.yml` — The actual Basic GitHub Actions workflow
- Root `.goreleaser.yaml` — Draft GoReleaser configuration

**Canonical status document:** `docs/RELEASE_READINESS_REPORT.md`

See also:
- `docs/RELEASE_1.0_PLAN.md`
- `docs/PLAN.md` §3 (Distribution strategy)