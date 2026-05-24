---
name: context7-research
description: Use Context7 pattern to pull up-to-date, version-specific documentation and examples directly from source repos. Invoke when you need current docs for a library, framework, or tool being used in this project.
allowed-tools: WebFetch, WebSearch, Read, Bash
---

# Context7 Research

Source: upstash/context7 — pulls live, version-specific docs into prompts

When working with external libraries or tools, don't rely on training data — fetch current documentation directly.

## Steps

1. Identify what you need docs for (library name + version) → verify: version pinned from package.json or lockfile
2. Fetch the official documentation for that exact version → verify: docs match installed version
3. Extract the specific API/pattern needed for the current task → verify: extracted info is actionable
4. If docs conflict with training knowledge, trust the fetched docs → verify: noted any conflicts

## Sources (in priority order)

1. Official docs site (e.g., commander.js.org, inquirer docs)
2. GitHub README of the exact version tag
3. TypeScript declarations in node_modules (authoritative for API shape)
4. GitHub issues/discussions for edge cases

## For nullprobe's own dependencies

| Package | Docs source |
|---------|-------------|
| @inquirer/prompts | https://github.com/SBoudrias/Inquirer.js/tree/main/packages/prompts |
| commander | https://github.com/tj/commander.js |
| @octokit/rest | https://github.com/octokit/rest.js |
| chalk | https://github.com/chalk/chalk |
| ora | https://github.com/sindresorhus/ora |

## Rules

- Always check the installed version first (`package.json` or `node_modules/*/package.json`)
- Never assume an API exists based on training data alone — verify it
- When docs are unavailable, read the TypeScript declarations directly
- Cache findings in `wiki/index.md` under a `## Dependencies` section for future sessions

## When NOT to use this skill

- For Node.js built-in APIs (stable, well-known, rarely change)
- When you've already verified the API in this session
- For trivial lookups that TypeScript compiler errors would catch anyway
