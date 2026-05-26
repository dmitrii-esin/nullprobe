import type { ExtraFile } from '../types.js';
import { wrapAsMdc } from './skill-to-mdc.js';

export interface PlatformConfig {
  skillPath(skillName: string): string;
  detectPaths: string[];
  extraFiles(skillContent: string, skillName: string): ExtraFile[];
}

// Plain-overwrite files that the scaffolder ALWAYS writes regardless of
// platform — included in every platform's detectPaths so the overwrite prompt
// fires when re-running init in a directory that already has them.
const ALWAYS_WRITTEN = ['AI_FRAMEWORK.md', 'wiki/log.md', 'wiki/index.md'];

export const PLATFORMS: Record<string, PlatformConfig> = {
  claude: {
    skillPath: (name) => `.claude/skills/${name}/SKILL.md`,
    detectPaths: ['.claude/skills/nullprobe-intro/SKILL.md', '.mcp.json', ...ALWAYS_WRITTEN],
    extraFiles: () => [],
  },

  cursor: {
    skillPath: (name) => `.cursor/rules/${name}.mdc`,
    detectPaths: ['.cursor/rules/nullprobe-intro.mdc', '.cursor/mcp.json', ...ALWAYS_WRITTEN],
    extraFiles: (content, name) => [
      {
        relPath: `.cursor/rules/${name}.mdc`,
        content: wrapAsMdc(content, name),
        ifExists: 'overwrite',
      },
    ],
  },

  // Gemini CLI: skills are inlined into a generated GEMINI.md at the project
  // root (Gemini's stable instruction file). The .gemini/settings.json holds
  // MCP server config. No multi-file skill loader exists in Gemini CLI's
  // current public preview, so per-file skills under .claude/skills/ would be
  // silently ignored.
  'gemini-cli': {
    skillPath: (name) => `GEMINI.md#${name}`, // pseudo-path: skills are H2 sections inside GEMINI.md
    detectPaths: ['GEMINI.md', '.gemini/settings.json', ...ALWAYS_WRITTEN],
    extraFiles: () => [], // GEMINI.md is written by scaffolder/index.ts as a plain-overwrite file
  },

  antigravity: {
    skillPath: (name) => `.antigravitycli/rules/${name}.md`,
    detectPaths: ['.antigravitycli/rules/nullprobe-intro.md', '.agent/mcp_config.json', ...ALWAYS_WRITTEN],
    extraFiles: (content, name) => [
      {
        relPath: `.antigravitycli/rules/${name}.md`,
        content: wrapAsMdc(content, name),
        ifExists: 'overwrite',
      },
    ],
  },
};
