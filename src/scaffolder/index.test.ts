import { describe, it, expect, vi } from 'vitest';
import { scaffold } from './index.js';
import * as fileWriter from './file-writer.js';

vi.mock('./file-writer.js', () => ({
  writeFile: vi.fn(),
  writeExtraFile: vi.fn(),
}));

describe('scaffolder index', () => {
  it('scaffolds claude without skills', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold({
      targetPath: '/tmp/target',
      platform: 'claude',
      installSkill: false
    });

    expect(written).toContain('AI_FRAMEWORK.md');
    expect(written).toContain('wiki/index.md');
    expect(written).toContain('wiki/log.md');
    expect(written).toContain('.mcp.json');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3);
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(1); // .mcp.json
  });

  it('scaffolds claude with skills', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold({
      targetPath: '/tmp/target',
      platform: 'claude',
      installSkill: true
    });

    expect(written).toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(written).toContain('.mcp.json');
    expect(fileWriter.writeFile).toHaveBeenCalledTimes(7); // 3 base + 4 skills
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(1); // .mcp.json
  });

  it('scaffolds gemini-cli with skills', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold({
      targetPath: '/tmp/target',
      platform: 'gemini-cli',
      installSkill: true
    });

    expect(written).toContain('.gemini/settings.json');
    expect(written).toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(written).not.toContain('.agent/mcp_config.json');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(7); // 3 base + 4 skills
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(1); // .gemini/settings.json
  });

  it('scaffolds cursor with skills', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold({
      targetPath: '/tmp/target',
      platform: 'cursor',
      installSkill: true
    });

    expect(written).toContain('.cursor/mcp.json'); // from platformExtras
    expect(written).toContain('.cursor/rules/nullprobe-intro.mdc'); // from skillDefs

    // 3 base files
    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3);
    // 1 mcp json + 4 skills
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(5);
  });

  it('scaffolds antigravity with skills', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold({
      targetPath: '/tmp/target',
      platform: 'antigravity',
      installSkill: true
    });

    expect(written).toContain('.agent/mcp_config.json');
    expect(written).toContain('.antigravitycli/rules/nullprobe-intro.md');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3);
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(5);
  });
});
