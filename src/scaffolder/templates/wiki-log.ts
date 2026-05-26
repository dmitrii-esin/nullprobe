import { VERSION } from '../../version.js';
import type { InitApproach } from '../../types.js';

export function wikiLog(today: string, approach: InitApproach, details: string): string {
  const intentLine =
    approach === 'specific' && details.trim()
      ? `\n  User intent (specific): ${details.trim()}`
      : approach === 'search'
        ? `\n  User intent (search): search internet + reference repos for compatible AI tools`
        : '';

  return `\
# Wiki Log

> Chronological, append-only record of what happened.
> Format: \`## [YYYY-MM-DD] operation | Title\`
> Grep-able: \`grep "^## \\\\[" wiki/log.md | tail -10\`

---

## [${today}] init | nullprobe scaffolded this project

  Tool: nullprobe v${VERSION}
  Approach: ${approach}${intentLine}
  Skills installed: nullprobe-intro, think-before-coding, simplicity-guard, session-crystallize
  Files: AI_FRAMEWORK.md, wiki/{index,log}.md, platform-specific skills/rules
  Next step: run the nullprobe-intro skill to orient the AI and populate the wiki
`;
}
