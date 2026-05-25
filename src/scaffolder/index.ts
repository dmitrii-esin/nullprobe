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
import { PLATFORMS } from './platforms.js';

export async function scaffold(answers: InitAnswers): Promise<string[]> {
  const base = path.resolve(answers.targetPath);
  const today = new Date().toISOString().split('T')[0];
  const aiFramework = await getAiFrameworkContent();

  // Plain overwrite files — always written regardless of platform.
  const files: Array<[string, string]> = [
    ['AI_FRAMEWORK.md', aiFramework],
    ['wiki/index.md', WIKI_INDEX],
    ['wiki/log.md', wikiLog(today)],
  ];

  const platform = PLATFORMS[answers.platform];

  const skillDefs: Array<[string, string]> = [
    ['nullprobe-intro', SKILL_NULLPROBE_INTRO],
    ['think-before-coding', SKILL_THINK_BEFORE_CODING],
    ['simplicity-guard', SKILL_SIMPLICITY_GUARD],
    ['session-crystallize', SKILL_SESSION_CRYSTALLIZE],
  ];

  if (answers.installSkill) {
    if (answers.platform === 'claude' || answers.platform === 'gemini-cli') {
      for (const [name, content] of skillDefs) {
        files.push([platform.skillPath(name), content]);
      }
    }
  }

  const written: string[] = [];
  for (const [relPath, content] of files) {
    const full = path.join(base, relPath);
    await writeFile(full, content);
    written.push(relPath);
  }

  // Platform-specific extra files — each carries its own write mode.
  const extras = platformExtras(answers);
  for (const extra of extras) {
    await writeExtraFile(base, extra);
    written.push(extra.relPath);
  }

  // Cursor and Antigravity: write skills as platform-native rule files.
  if (answers.installSkill && (answers.platform === 'cursor' || answers.platform === 'antigravity')) {
    for (const [name, content] of skillDefs) {
      const skillExtras = platform.extraFiles(content, name);
      for (const extra of skillExtras) {
        await writeExtraFile(base, extra);
        written.push(extra.relPath);
      }
    }
  }

  return written;
}

// ---------------------------------------------------------------------------
// platformExtras
//
// Returns the ExtraFile entries that are specific to each AI platform.
// Adding a new platform means adding one entry here — the dispatch logic
// lives entirely in writeExtraFile, not scattered across scaffold().
//
// ---- Gemini CLI vs Antigravity: known and expected divergence points -----
//
// Both currently share .agent/mcp_config.json because the public previews of
// both tools use the same MCP config path. This WILL diverge. Track it here
// and update the switch before v0.2 ships.
//
// Confirmed identical today (2026-05-25):
//   - MCP config path: .agent/mcp_config.json
//   - MCP config schema: same JSON shape, same "mcpServers" key
//
// Expected divergence — act when confirmed:
//
// 1. Rule/instruction file
//    Gemini CLI:  GEMINI.md at project root (single-file, no sub-dirs)
//    Antigravity: .windsurf/rules/*.md (one file per rule, flat directory)
//    Action: split the case, add a GEMINI.md template and .windsurf/rules/
//            template, remove .agent/ skill-file output for both.
//
// 2. Skill/plugin loading
//    Gemini CLI:  No stable multi-file skill loader in 0.1.x preview.
//                 Skills must be inlined into GEMINI.md or use @import
//                 (unstable). Do NOT write .claude/skills/ for this platform.
//    Antigravity: .windsurf/rules/<name>.md — flat .md, NOT sub-directory.
//                 A file at .windsurf/rules/foo/SKILL.md is silently ignored.
//    Action: for gemini-cli, inline skills as ## sections in GEMINI.md.
//            for antigravity, write .windsurf/rules/<name>.md.
//
// 3. Memory / session hooks
//    Gemini CLI:  Uses GEMINI.md `memory:` frontmatter key (unconfirmed,
//                 watch the changelog). No hook system in 0.1.x.
//    Antigravity: Supports Windsurf Flows (.windsurf/flows/) for hooks —
//                 functionally similar to Claude's settings.json hooks.
//    Action: add a .windsurf/flows/session-capture.yaml template for
//            antigravity when Flows API is stable.
//
// Rule: keep the two platforms in the SAME case ONLY while the output is
// byte-identical. The first confirmed difference must split the case.
// ---------------------------------------------------------------------------

function platformExtras(answers: InitAnswers): ExtraFile[] {
  const mcpContent = buildMcpConfig(answers.extraMcps ?? []);

  switch (answers.platform) {
    case 'cursor':
      return [
        {
          relPath: '.cursor/mcp.json',
          content: mcpContent,
          ifExists: 'merge-mcp',
        },
      ];

    case 'gemini-cli':
      return [
        {
          relPath: '.gemini/settings.json',
          content: mcpContent,
          ifExists: 'merge-mcp',
        },
      ];

    case 'antigravity':
      return [
        {
          relPath: '.agent/mcp_config.json',
          content: mcpContent,
          ifExists: 'merge-mcp',
        },
      ];

    case 'claude':
      return [
        {
          relPath: '.mcp.json',
          content: mcpContent,
          ifExists: 'merge-mcp',
        },
      ];

    default:
      return [];
  }
}
