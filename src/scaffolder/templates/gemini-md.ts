import { SKILL_NULLPROBE_INTRO } from './skill-nullprobe-intro.js';
import { SKILL_THINK_BEFORE_CODING } from './skill-think-before-coding.js';
import { SKILL_SIMPLICITY_GUARD } from './skill-simplicity-guard.js';
import { SKILL_SESSION_CRYSTALLIZE } from './skill-session-crystallize.js';

function stripFrontmatter(s: string): string {
  return s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

export function geminiMd(): string {
  const skills: Array<[string, string]> = [
    ['nullprobe-intro', SKILL_NULLPROBE_INTRO],
    ['think-before-coding', SKILL_THINK_BEFORE_CODING],
    ['simplicity-guard', SKILL_SIMPLICITY_GUARD],
    ['session-crystallize', SKILL_SESSION_CRYSTALLIZE],
  ];

  const inlined = skills
    .map(([name, body]) => `## Skill: ${name}\n\n${stripFrontmatter(body).trim()}`)
    .join('\n\n---\n\n');

  return `# GEMINI.md

> Instructions for Gemini CLI sessions in this project.
> Gemini CLI auto-loads this file at session start.

## Session Start

1. Read \`AI_FRAMEWORK.md\` — the portable AI collaboration guide for this project.
2. Read \`wiki/index.md\` to see what is already documented.
3. Read \`wiki/log.md\` (tail) to see what happened recently.

## MCP Servers

Configured in \`.gemini/settings.json\` — defaults to context7 (live library docs).

## Skills (inlined)

Gemini CLI's current preview has no multi-file skill loader, so the 4 nullprobe
skills are inlined below as H2 sections. They are functionally equivalent to the
\`.claude/skills/<name>/SKILL.md\` format used by other AI environments.

${inlined}

---

## Wiki maintenance

- Append to \`wiki/log.md\` after every meaningful session: \`## [YYYY-MM-DD] type | title\`
- File durable knowledge into \`wiki/index.md\` (quality gate: specific, durable, actionable — pass 2 of 3)
`;
}
