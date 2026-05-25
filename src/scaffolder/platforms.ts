import type { ExtraFile } from '../types.js';
import { wrapAsMdc } from './skill-to-mdc.js';

export interface PlatformConfig {
  skillPath(skillName: string): string;
  detectPaths: string[];
  extraFiles(skillContent: string, skillName: string): ExtraFile[];
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  claude: {
    skillPath: (name) => `.claude/skills/${name}/SKILL.md`,
    detectPaths: ['.claude/skills/nullprobe-intro/SKILL.md', '.mcp.json'],
    extraFiles: () => [],
  },

  cursor: {
    skillPath: (name) => `.cursor/rules/${name}.mdc`,
    detectPaths: ['.cursor/rules/nullprobe-intro.mdc'],
    extraFiles: (content, name) => [
      {
        relPath: `.cursor/rules/${name}.mdc`,
        content: wrapAsMdc(content, name),
        ifExists: 'overwrite',
      },
    ],
  },

  'gemini-cli': {
    skillPath: (name) => `.claude/skills/${name}/SKILL.md`,
    detectPaths: ['.claude/skills/nullprobe-intro/SKILL.md', '.gemini/settings.json'],
    extraFiles: () => [],
  },

  antigravity: {
    skillPath: (name) => `.antigravitycli/rules/${name}.md`,
    detectPaths: ['.antigravitycli/rules/nullprobe-intro.md'],
    extraFiles: (content, name) => [
      {
        relPath: `.antigravitycli/rules/${name}.md`,
        content: wrapAsMdc(content, name),
        ifExists: 'overwrite',
      },
    ],
  },
};
