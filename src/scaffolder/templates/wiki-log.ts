export function wikiLog(today: string): string {
  return `\
# Wiki Log

> Chronological, append-only record of what happened.
> Format: \`## [YYYY-MM-DD] operation | Title\`
> Grep-able: \`grep "^## \\\\[" wiki/log.md | tail -10\`

---

## [${today}] init | nullprobe scaffolded this project

  Tool: nullprobe v0.1
  Skills installed: nullprobe-intro, think-before-coding, simplicity-guard, session-crystallize
  Files: AI_FRAMEWORK.md, wiki/{index,log}.md, .claude/skills/*/SKILL.md
  Next step: run the nullprobe-intro skill to orient the AI and populate the wiki
`;
}
