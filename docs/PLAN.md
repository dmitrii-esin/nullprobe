# Development Plan

Live backlog for nullprobe. Add items here; move to CONTEXT.md "Recent changes" when shipped.

---

## 0. MCP Customization (in flight)

**Status:** Implementation done — needs e2e verification across all 4 platforms before shipping.

**Goal:** Let users opt into extra MCP servers during `nullprobe init` without violating the "two questions and done" philosophy.

**Default behavior (unchanged):** scaffold `context7` only. User answers `N` (or just presses Enter) to the new confirm prompt.

**Opt-in flow:**

1. New confirm in `src/flows/init-flow.ts`: `"Customize MCP servers? (default scaffolds context7 only)"` — default `false`.
2. If `true`, an `@inquirer/prompts` `checkbox` is shown with the registry from `src/scaffolder/templates/mcp-context7.ts → EXTRA_MCP_CHOICES`.
3. Selected IDs flow as `InitAnswers.extraMcps` into the scaffolder, which calls `buildMcpConfig(extras)` to produce the merged MCP config (context7 + selected extras) for the platform-specific path.

**Optional MCP registry (current):**

| ID | Package | Why |
|----|---------|-----|
| `shadcn` | `npx shadcn@latest mcp` | UI component registry — useful in shadcn-based projects |
| `chrome-devtools` | `npx -y chrome-devtools-mcp` | Browser debugging from the AI |
| `github` | `npx -y @modelcontextprotocol/server-github` | Repo/issue/PR access; needs `GITHUB_PERSONAL_ACCESS_TOKEN` |

**To finish:**

- [ ] Manual e2e: run `npm run dev -- init /tmp/test-mcp-custom` for each of the 4 platforms with one or more extras selected; confirm the produced MCP config contains exactly the expected servers and that `merge-mcp` still preserves user-added entries on re-run.
- [ ] Update `docs/PLAN.md` §2 verification — add an `2.9` scenario for MCP customization.
- [ ] Consider widening the registry once we have data on what users actually want (track requests in `wiki/log.md`).

**Dev-session note:** The repo's own MCP configs (`.mcp.json`, `.cursor/mcp.json`, `.agent/mcp_config.json`, `.gemini/settings.json`) ship with all 4 MCPs (context7 + shadcn + chrome-devtools + github) so contributors hacking on nullprobe have full tooling. The CLI **does not** scaffold this expanded set into target projects by default — it stays lean (context7 only) unless the user opts into extras via the new prompt.

---

## 0a. MCP Discovery Source

**Status:** Not started

**Goal:** Surface new/popular MCPs to users via `nullprobe update` and `protocols/exploration.md` so the optional-MCP registry stays current without manual curation.

**Candidates:**

| Source | Type | Notes |
|--------|------|-------|
| [mcp.so](https://mcp.so) | Aggregator, web-scrape | Largest community catalog. No public API confirmed — would need HTML scrape or RSS. |
| [smithery.ai](https://smithery.ai) | Aggregator + registry | Has a documented registry JSON; first choice if API is stable. |
| [glama.ai/mcp](https://glama.ai/mcp/servers) | Aggregator | Quality-curated; useful for "trending" signal. |
| `modelcontextprotocol/servers` GitHub | Official | Already accessible via existing `@octokit/rest` plumbing in `src/github/`. Cheapest first hop. |

**Action items:**

1. Pick the registry/API with the most reliable JSON endpoint (likely Smithery).
2. Add a new source to `src/github/sources.ts` (or a new `src/search/mcp-registry.ts` if non-GitHub) returning `{ name, package, description, popularity }` rows.
3. Add an "MCP discovery" branch to `nullprobe update` that appends findings to `wiki/log.md` like the existing search backends.
4. Document in `protocols/exploration.md` as a third source (after Tavily and GitHub).

---

## 1. Test Coverage

**Status:** Not started

**Scope:**

| Area | What to test |
|------|-------------|
| `skill-to-mdc` | `parseSkillMeta` extracts name/description/allowedTools from real SKILL.md strings; `stripSkillFrontmatter` removes exactly the frontmatter block; `wrapAsMdc` produces valid `.mdc` with correct `alwaysApply` values for all 4 skills |
| `platforms` | `skillPath()` returns correct paths per platform; `extraFiles()` returns empty array for claude/gemini-cli, one ExtraFile per skill for cursor/antigravity; ExtraFile `relPath` matches `skillPath()` |
| `file-writer` | `mergeMcpServers`: all 6 cases from the source comment (no file, unreadable, invalid JSON, no key, idempotent, merge); `atomicWrite` leaves no temp file on failure |
| `scaffolder/index` | `scaffold()` with each platform produces the correct file list; second call on same dir does not wipe existing MCP servers |
| `search/tavily` | HTTP status → `TavilyErrorCode` mapping; network error → `NETWORK_ERROR`; happy path maps `published_date` → `publishedDate` |
| `search/github` | `enrichQuery` pass-through when AI term present; disjunction appended when absent; `RateLimitError` thrown on 403/429 |
| `wiki/append` | `buildBlock` format (H2 heading, indented lines, `---` fence); no-op when wiki/log.md does not exist; appends without truncating existing content |

**Stack recommendation:** Vitest (fast, native ESM, no transform config needed for this project).

**Acceptance:** `npm test` passes with ≥80% branch coverage on the above modules.

---

## 2. Verification Plan

Actionable checklist to confirm all functional requirements after any change. Run top-to-bottom before tagging a release.

### 2.1 Claude scaffold

```bash
rm -rf /tmp/test-claude && npm run dev -- init /tmp/test-claude
# Select: Claude → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-claude/AI_FRAMEWORK.md` exists and is non-empty
- [ ] `/tmp/test-claude/wiki/index.md` exists
- [ ] `/tmp/test-claude/wiki/log.md` exists
- [ ] `/tmp/test-claude/.mcp.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-claude/.claude/skills/nullprobe-intro/SKILL.md` — contains `name: nullprobe-intro`
- [ ] `/tmp/test-claude/.claude/skills/think-before-coding/SKILL.md` exists
- [ ] `/tmp/test-claude/.claude/skills/simplicity-guard/SKILL.md` exists
- [ ] `/tmp/test-claude/.claude/skills/session-crystallize/SKILL.md` exists
- [ ] No `.cursor/` or `.antigravitycli/` directory created

### 2.2 Cursor scaffold

```bash
rm -rf /tmp/test-cursor && npm run dev -- init /tmp/test-cursor
# Select: Cursor → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-cursor/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-cursor/.cursor/mcp.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-cursor/.cursor/rules/nullprobe-intro.mdc` — starts with `---`, contains `alwaysApply: false`
- [ ] `/tmp/test-cursor/.cursor/rules/think-before-coding.mdc` — contains `alwaysApply: true`
- [ ] `/tmp/test-cursor/.cursor/rules/simplicity-guard.mdc` — contains `alwaysApply: true`
- [ ] `/tmp/test-cursor/.cursor/rules/session-crystallize.mdc` — contains `alwaysApply: false`
- [ ] No `.claude/skills/` directory created

### 2.3 Antigravity scaffold

```bash
rm -rf /tmp/test-antigravity && npm run dev -- init /tmp/test-antigravity
# Select: Antigravity → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-antigravity/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-antigravity/.agent/mcp_config.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/nullprobe-intro.md` — starts with `---`
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/think-before-coding.md` exists
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/simplicity-guard.md` exists
- [ ] `/tmp/test-antigravity/.antigravitycli/rules/session-crystallize.md` exists
- [ ] No `.claude/skills/` or `.cursor/rules/` created

### 2.4 Gemini CLI scaffold

```bash
rm -rf /tmp/test-gemini && npm run dev -- init /tmp/test-gemini
# Select: Gemini CLI → recommended setup → confirm path
```

Expected files:
- [ ] `/tmp/test-gemini/AI_FRAMEWORK.md` exists
- [ ] `/tmp/test-gemini/.gemini/settings.json` — valid JSON with `mcpServers.context7`
- [ ] `/tmp/test-gemini/.claude/skills/nullprobe-intro/SKILL.md` exists (fallback)
- [ ] No `.cursor/rules/`, `.antigravitycli/rules/`, or `.agent/` created

### 2.5 Overwrite guard + MCP merge safety

```bash
# Run once to create the baseline
rm -rf /tmp/test-merge && npm run dev -- init /tmp/test-merge
# Select: Cursor → confirm path

# Manually add a second MCP server to simulate an existing config
node -e "
  const p = '/tmp/test-merge/.cursor/mcp.json';
  const c = JSON.parse(require('fs').readFileSync(p, 'utf8'));
  c.mcpServers.myserver = { command: 'node', args: ['server.js'] };
  require('fs').writeFileSync(p, JSON.stringify(c, null, 2));
"

# Run again on the same directory
npm run dev -- init /tmp/test-merge
# Select: Cursor → confirm overwrite when prompted
```

Expected:
- [ ] CLI prompts "These files already exist" before overwriting
- [ ] After second run: `/tmp/test-merge/.cursor/mcp.json` still contains `mcpServers.myserver` (merge preserved it)
- [ ] `/tmp/test-merge/.cursor/mcp.json` still contains `mcpServers.context7`

### 2.6 Update — GitHub search

```bash
npm run dev -- update
# Select: Search → query: "memory management" → GitHub backend
```

Expected:
- [ ] Spinner shows, then succeeds
- [ ] At least 1 result printed with title + URL
- [ ] `wiki/log.md` in cwd has a new `## [today] search | GitHub search` entry

### 2.7 Update — Tavily search

```bash
TAVILY_API_KEY=tvly-xxx npm run dev -- update
# Select: Search → query: "cursor rules 2025" → Tavily backend
```

Expected:
- [ ] Spinner shows, then succeeds
- [ ] At least 1 result printed with title + URL + content snippet
- [ ] `wiki/log.md` has a new `## [today] search | Tavily search` entry

### 2.8 Tavily not configured — setup message

```bash
unset TAVILY_API_KEY && npm run dev -- update
# Select: Search → any query → Tavily backend
```

Expected:
- [ ] Setup instructions printed (sign-up URL, export command, reload + re-run)
- [ ] `wiki/log.md` has a `Queued Tavily search` entry (not a real search entry)
- [ ] Process exits cleanly (no error thrown)

### 2.9 Optional MCP customization

```bash
rm -rf /tmp/test-mcp-custom && npm run dev -- init /tmp/test-mcp-custom
# Select: Claude → recommended → confirm path
# At "Customize MCP servers?" answer: Y
# In checkbox: pick shadcn + github
```

Expected:
- [ ] `/tmp/test-mcp-custom/.mcp.json` contains `mcpServers.context7`, `mcpServers.shadcn`, `mcpServers.github`
- [ ] `mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN` is the literal `${GITHUB_PERSONAL_ACCESS_TOKEN}` (env-var ref, not a real token)
- [ ] No `chrome-devtools` entry
- [ ] Re-run with the same selections + a manually-added third server → merge-mcp preserves the manual entry

Repeat with `cursor`, `gemini-cli`, `antigravity` to confirm parity at `.cursor/mcp.json`, `.gemini/settings.json`, `.agent/mcp_config.json`.

---

## 3. Language-Agnostic Distribution

**Status:** Research complete — implementation not started

**Goal:** Users without Node.js installed should be able to install nullprobe. The npm channel remains primary; everything below adds reach.

### Recommended path (phased)

**Phase 1 — Foundation (prerequisite for all non-npm channels)**

Add a GitHub Actions release workflow:
- Trigger: `push` to `v*` tags
- Matrix: 5 `bun build --compile` targets → `nullprobe-darwin-arm64`, `nullprobe-darwin-x64`, `nullprobe-linux-x64`, `nullprobe-linux-arm64`, `nullprobe-linux-x64-musl`
- Attach binaries as GitHub Release assets

This requires adding Bun as a build dependency (dev-only). No runtime changes to the source.

**Phase 2 — High reach, low effort**

| Channel | Work | Notes |
|---------|------|-------|
| **npm** | Already planned | `npm publish`. Requires Node.js ≥18. |
| **pnpm** | Zero | pnpm installs from npm registry automatically. |
| **curl install script** | ~50 lines bash | Detects OS/arch, downloads binary from GitHub Releases, places in `~/.local/bin` or `/usr/local/bin`. Host at `nullprobe.sh/install` or as `install.sh` in the repo root. |

**Phase 3 — Package managers**

| Channel | Effort | Notes |
|---------|--------|-------|
| **Homebrew tap** | Medium | Create `dmitrii-esin/homebrew-nullprobe` repo with a Formula pointing to GitHub Release tarballs + SHA256s. Must update checksums on each release (automatable via CI). |
| **Scoop bucket (Windows)** | Low-Medium | Create `dmitrii-esin/scoop-nullprobe` repo with a JSON manifest. Simpler review than Winget. |
| **Winget (Windows)** | Medium | Submit manifest YAML to `microsoft/winget-pkgs`. Community-reviewed, takes days to merge. |

**Phase 4 — Optional**

| Channel | Effort | Notes |
|---------|--------|-------|
| **Docker** | Low | `FROM scratch` + musl binary. Publish to GHCR. Useful for CI environments. |
| **Snap** | Medium | `snapcraft.yaml`, Snap Store review. Linux-only. |

**Do not pursue:** Flatpak (sandboxing hostile to CLI filesystem access), apt/deb (PPA maintenance overhead), pip/pipx (JS-in-Python shim is unusual and confusing to users).

### Implementation notes

- nullprobe's dependencies (`@octokit/rest`, `@inquirer/prompts`, `chalk`, `commander`, `ora`) have no native addons — `bun build --compile` will work without modifications.
- The musl Linux target (`bun-linux-x64-musl`) is required for Alpine-based containers and some CI runners.
- The `install.sh` script is the single highest-leverage deliverable: one command, zero runtime dependencies, works on any POSIX shell.
