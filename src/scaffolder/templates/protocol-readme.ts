export const PROTOCOL_README = `\
# QA Protocols — Customizable for This Project

These are **your** living operational runbooks (verification, audit, security, exploration, and cleanup). They ship with starter content and clear extension points so your team (and AI) can add project-specific checks without friction.

**Core principle (inherited from nullprobe):** Keep them lightweight, deterministic, and scannable. Use the exact table formats below.

## How to Use

1. Read the relevant file before major changes or releases.
2. Run the steps (manually or have your AI follow them).
3. Fill in **Actual Result** / **Status** columns during execution.
4. Add new rows for anything that must never regress in *this* project.
5. Commit the updates — they become part of your institutional memory.

## Recommended IDs

- **VER-###** — Verification / regression cases (see \`verification.md\`)
- **AUD-###** — Audit / risk findings and custom lenses (see \`audit.md\`)
- **SEC-###** — Security-specific concerns (see \`security.md\`)
- **EXP-###** — Exploration / discovery findings (see \`exploration.md\`)
- **CLN-###** — Cleanup targets and rules (see \`cleanup.md\`)

## Adding Your Own Cases (Extension Points)

Every protocol file has a clearly marked **"Add your own..."** section. Use the same column structure.

**Realistic starter examples** (adapt or replace):

| ID      | Step Description                                      | Expected Result                                      |
|---------|-------------------------------------------------------|------------------------------------------------------|
| VER-110 | RSC hydration never breaks on deploy (Next.js)       | No hydration mismatch warnings in production         |
| AUD-110 | shadcn + Radix component contracts remain stable     | No unexpected prop or behavior changes after updates |
| SEC-110 | No secrets leak into client bundles                  | Build fails or warns on \`process.env\` in client code |
| CLN-110 | \`.next/\` and Turbopack cache can be safely deleted | Clean rebuild succeeds with no stale artifacts       |

Copy the table header, add rows with the next ID (use 100-series for project-specific), and fill **Actual Result** + **Status** when you execute.

## Important: Protect Your Custom Work

The files here are high-quality **starters** shipped by nullprobe.

**Strong recommendation:** Do not put your most customized, project-specific, or long-term living protocols directly in the root \`protocols/\` folder. Instead, create a separate directory such as:

- \`protocols/custom/\`
- \`my-protocols/\`
- \`team-protocols/\`

This way, if you ever re-run \`nullprobe init\` on this project, your heavily customized content is protected from the overwrite prompt.

The shipped files in this folder are safe to evolve or replace as the generalized versions improve.

## Integration with AI

Your AI (via the scaffolded \`AI_FRAMEWORK.md\` and skills) knows to consult these protocols on relevant tasks. Mention them explicitly when asking for reviews: "Follow the protocols/ directory runbooks."

**Leveraging Optional MCPs**: If you opted into extra MCPs (e.g. \`chrome-devtools\`), your AI can use them directly inside verification and audit steps for visual regression, DOM inspection, or browser-based checks.

**Note on Exploration**: The internal version of the Exploration protocol used by nullprobe contributors is significantly richer (v3) than the generalized starter shipped here (v1). The shipped version focuses on the core discipline (exclusion filter + structured capture) while remaining lightweight.

## Versioning Your Protocols

Bump the \`version\` at the top of each file when you make breaking changes to the structure. Add a short changelog entry at the bottom.

---

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 1.0     | 2026-05-27 | Initial generalized version shipped by nullprobe |

These protocols belong to your project. Customize them freely.
`;

