export const PROTOCOL_EXPLORATION = `\
# Exploration Protocol (Generalized)

**version:** 1.2
**purpose:** Regularly discover *genuinely new* techniques, tools, patterns, and ideas that can improve how you and your AI collaborate. Ruthlessly filter for novelty.
**frequency:** Every 2–6 weeks, or before major workflow changes.
**output:** Structured findings (usually appended to \`wiki/log.md\`).
**time budget:** 30–60 minutes recommended.

## Step 0: Exclusion Filter (Most Important)

Before searching, establish what is already known. Do **not** log these as new findings:

- Headline-level mentions of major frameworks (LangChain, CrewAI, etc.) — only log genuine new sub-features released in the last 90–180 days
- Generic "awesome-X" lists and "Top 10 AI tools" roundups
- Basic prompt engineering patterns (chain-of-thought, few-shot, ReAct, etc.) at textbook level
- "MCP servers exist" without a specific new, useful release
- Your own previously evaluated tools and patterns

**Your team's additional hard exclusions:**

- 
- 

## Recommended Discovery Sources (High Signal)

| Category | What to Search (prefer last 90 days) | Tools |
|----------|--------------------------------------|-------|
| Real-time discussion | Agent workflows, new MCP servers, AI IDE patterns | X (Latest), relevant subreddits |
| Code & releases | Trending repos, new tools with stars + recent activity | GitHub search + trending |
| Research | New papers on agent memory, workflows, evaluation | arXiv cs.AI / cs.CL |
| High-signal humans | Independent researchers and practitioners | Simon Willison, Latent Space, specific blogs |
| Official | "What's new" pages for your AI environments and model providers | Anthropic, OpenAI, Cursor, etc. changelogs |

## Capture Format (Use This)

\`\`\`markdown
### Finding: Short descriptive name

- **Source + date:** URL — YYYY-MM-DD
- **One-sentence summary:** What it actually is
- **Why it might matter to us:** Specific problem or workflow it could improve
- **Small recommended experiment:** Lowest-risk way to try it (e.g. "Install in scratch workspace, run for 20 minutes")
\`\`\`

## Search Log (For Reproducibility)

| Category | Query | Tool | Hits | Novel Items Kept | Date |
|----------|-------|------|------|------------------|------|
|          |       |      |      |                  |      |

## Add Your Own Sources & Filters

- Trusted discovery sources specific to your domain or stack
- Your personal novelty bar (e.g. "must have working demo or production anecdote")

## Success Criteria

- [ ] At least one genuinely novel, high-signal item found (or honest "thin run" note recorded)
- [ ] Every finding follows the capture format
- [ ] Search queries were logged
- [ ] One concrete next experiment is defined

---

*Generalized exploration protocol. The discipline (exclusion filter + logging + novelty bar) matters more than the exact sources.*

**For self-improving projects:** After the broad sweep, spend a few minutes on targeted queries aimed at improving *your own* processes, protocols, wiki model, or tooling. Capture "Integration Proposals" for the highest-ROI findings.

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 1.2     | 2026-05-27 | Improved structure and self-improvement guidance |
`;

