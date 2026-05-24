import path from 'node:path';
import type { InitAnswers } from '../types.js';
import { writeFile } from './file-writer.js';
import { getAiFrameworkContent } from './templates/ai-framework.js';
import { SKILL_NULLPROBE_INTRO } from './templates/skill-nullprobe-intro.js';
import { SKILL_THINK_BEFORE_CODING } from './templates/skill-think-before-coding.js';
import { SKILL_SIMPLICITY_GUARD } from './templates/skill-simplicity-guard.js';
import { SKILL_SESSION_CRYSTALLIZE } from './templates/skill-session-crystallize.js';
import { WIKI_INDEX } from './templates/wiki-index.js';
import { wikiLog } from './templates/wiki-log.js';

export async function scaffold(answers: InitAnswers): Promise<string[]> {
  const base = path.resolve(answers.targetPath);
  const today = new Date().toISOString().split('T')[0];
  const aiFramework = await getAiFrameworkContent();

  const files: Array<[string, string]> = [
    ['AI_FRAMEWORK.md', aiFramework],
    ['wiki/index.md', WIKI_INDEX],
    ['wiki/log.md', wikiLog(today)],
  ];

  if (answers.installSkill) {
    files.push(
      ['.claude/skills/nullprobe-intro/SKILL.md', SKILL_NULLPROBE_INTRO],
      ['.claude/skills/think-before-coding/SKILL.md', SKILL_THINK_BEFORE_CODING],
      ['.claude/skills/simplicity-guard/SKILL.md', SKILL_SIMPLICITY_GUARD],
      ['.claude/skills/session-crystallize/SKILL.md', SKILL_SESSION_CRYSTALLIZE],
    );
  }

  const written: string[] = [];
  for (const [relPath, content] of files) {
    const full = path.join(base, relPath);
    await writeFile(full, content);
    written.push(relPath);
  }

  return written;
}
