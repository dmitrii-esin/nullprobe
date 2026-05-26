import path from 'node:path';
import type { ExtraFile, InitAnswers } from '../types.js';
import { writeFile, writeExtraFile } from './file-writer.js';
import { getAiFrameworkContent } from './templates/ai-framework.js';
import { SKILL_NULLPROBE_INTRO } from './templates/skill-nullprobe-intro.js';
import { SKILL_THINK_BEFORE_CODING } from './templates/skill-think-before-coding.js';
import { SKILL_SIMPLICITY_GUARD } from './templates/skill-simplicity-guard.js';
import { SKILL_SESSION_CRYSTALLIZE } from './templates/skill-session-crystallize.js';
import { WIKI_INDEX } from './templates/wiki-index.js';
import { wikiLog } from './templates/wiki-log.js';
import { buildMcpConfig } from './templates/mcp-context7.js';
import { geminiMd } from './templates/gemini-md.js';
import { PLATFORMS } from './platforms.js';

export async function scaffold(answers: InitAnswers): Promise<string[]> {
  const base = path.resolve(answers.targetPath);
  const today = new Date().toISOString().split('T')[0];
  const aiFramework = await getAiFrameworkContent();

  const files: Array<[string, string]> = [
    ['AI_FRAMEWORK.md', aiFramework],
    ['wiki/index.md', WIKI_INDEX],
    ['wiki/log.md', wikiLog(today, answers.approach, answers.details)],
  ];

  const platform = PLATFORMS[answers.platform];

  const skillDefs: Array<[string, string]> = [
    ['nullprobe-intro', SKILL_NULLPROBE_INTRO],
    ['think-before-coding', SKILL_THINK_BEFORE_CODING],
    ['simplicity-guard', SKILL_SIMPLICITY_GUARD],
    ['session-crystallize', SKILL_SESSION_CRYSTALLIZE],
  ];

  // Claude has a stable multi-file skill loader — write per-skill files.
  // Cursor / Antigravity write skills via platform.extraFiles() below.
  // Gemini CLI inlines skills into GEMINI.md (see platformExtras).
  if (answers.platform === 'claude') {
    for (const [name, content] of skillDefs) {
      files.push([platform.skillPath(name), content]);
    }
  }

  const written: string[] = [];
  for (const [relPath, content] of files) {
    const full = path.join(base, relPath);
    await writeFile(full, content);
    written.push(relPath);
  }

  const extras = platformExtras(answers);
  for (const extra of extras) {
    await writeExtraFile(base, extra);
    written.push(extra.relPath);
  }

  if (answers.platform === 'cursor' || answers.platform === 'antigravity') {
    for (const [name, content] of skillDefs) {
      for (const extra of platform.extraFiles(content, name)) {
        await writeExtraFile(base, extra);
        written.push(extra.relPath);
      }
    }
  }

  return written;
}

function platformExtras(answers: InitAnswers): ExtraFile[] {
  const mcpContent = buildMcpConfig(answers.extraMcps);

  switch (answers.platform) {
    case 'claude':
      return [{ relPath: '.mcp.json', content: mcpContent, ifExists: 'merge-mcp' }];
    case 'cursor':
      return [{ relPath: '.cursor/mcp.json', content: mcpContent, ifExists: 'merge-mcp' }];
    case 'gemini-cli':
      return [
        { relPath: '.gemini/settings.json', content: mcpContent, ifExists: 'merge-mcp' },
        { relPath: 'GEMINI.md', content: geminiMd(), ifExists: 'overwrite' },
      ];
    case 'antigravity':
      return [{ relPath: '.agent/mcp_config.json', content: mcpContent, ifExists: 'merge-mcp' }];
    default: {
      const _exhaustive: never = answers.platform;
      throw new Error(`Unknown platform: ${_exhaustive as string}`);
    }
  }
}
