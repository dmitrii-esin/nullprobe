import { describe, it, expect, vi } from 'vitest';
import { scaffold } from './index.js';
import * as fileWriter from './file-writer.js';
import type { InitAnswers, AIPlatform } from '../types.js';

vi.mock('./file-writer.js', () => ({
  writeFile: vi.fn(),
  writeExtraFile: vi.fn(),
}));

function answers(platform: AIPlatform, overrides: Partial<InitAnswers> = {}): InitAnswers {
  return {
    targetPath: '/tmp/target',
    platform,
    approach: 'recommended',
    details: '',
    extraMcps: [],
    ...overrides,
  };
}

describe('scaffolder index', () => {
  it('scaffolds claude with skills + MCP', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold(answers('claude'));

    expect(written).toContain('AI_FRAMEWORK.md');
    expect(written).toContain('wiki/index.md');
    expect(written).toContain('wiki/log.md');
    expect(written).toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(written).toContain('.mcp.json');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(7); // 3 base + 4 skills
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(1); // .mcp.json
  });

  it('scaffolds gemini-cli with inlined GEMINI.md (no .claude/skills/)', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold(answers('gemini-cli'));

    expect(written).toContain('AI_FRAMEWORK.md');
    expect(written).toContain('.gemini/settings.json');
    expect(written).toContain('GEMINI.md');
    expect(written).not.toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(written).not.toContain('.agent/mcp_config.json');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3); // 3 base only
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(2); // .gemini/settings.json + GEMINI.md
  });

  it('scaffolds cursor with .mdc skills + MCP', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold(answers('cursor'));

    expect(written).toContain('.cursor/mcp.json');
    expect(written).toContain('.cursor/rules/nullprobe-intro.mdc');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3);          // 3 base
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(5);     // mcp + 4 .mdc skills
  });

  it('scaffolds antigravity with .md rules + MCP', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold(answers('antigravity'));

    expect(written).toContain('.agent/mcp_config.json');
    expect(written).toContain('.antigravitycli/rules/nullprobe-intro.md');

    expect(fileWriter.writeFile).toHaveBeenCalledTimes(3);
    expect(fileWriter.writeExtraFile).toHaveBeenCalledTimes(5);
  });

  it('propagates selected extra MCPs into the scaffolded mcp config', async () => {
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    await scaffold(answers('claude', { extraMcps: ['shadcn', 'github'] }));

    const mcpCall = vi.mocked(fileWriter.writeExtraFile).mock.calls.find(
      ([, extra]) => extra.relPath === '.mcp.json'
    );
    expect(mcpCall).toBeDefined();
    const writtenConfig = JSON.parse(mcpCall![1].content);
    expect(Object.keys(writtenConfig.mcpServers).sort()).toEqual(['context7', 'github', 'shadcn']);
    expect(writtenConfig.mcpServers.github.env.GITHUB_PERSONAL_ACCESS_TOKEN).toBe('${GITHUB_PERSONAL_ACCESS_TOKEN}');
  });

  it('includes the user details in wiki/log.md when approach is specific', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();

    await scaffold(answers('claude', { approach: 'specific', details: 'pytest hooks + mypy strict' }));

    const logCall = vi.mocked(fileWriter.writeFile).mock.calls.find(
      ([, content]) => typeof content === 'string' && content.includes('Wiki Log')
    );
    expect(logCall).toBeDefined();
    const content = logCall![1] as string;
    expect(content).toContain('User intent (specific): pytest hooks + mypy strict');
    expect(content).toContain('Approach: specific');
  });

  it('includes all 6 protocol files when includeProtocols is true (with seeding)', async () => {
    vi.mocked(fileWriter.writeFile).mockClear();
    vi.mocked(fileWriter.writeExtraFile).mockClear();

    const written = await scaffold(answers('claude', {
      includeProtocols: true,
      protocolPriorities: ['login flow', 'checkout'],
    }));

    expect(written).toContain('protocols/README.md');
    expect(written).toContain('protocols/verification.md');
    expect(written).toContain('protocols/audit.md');
    expect(written).toContain('protocols/security.md');
    expect(written).toContain('protocols/exploration.md');
    expect(written).toContain('protocols/cleanup.md');

    // Verify seeding worked for verification
    const verCall = vi.mocked(fileWriter.writeFile).mock.calls.find(
      ([path]) => path.endsWith('protocols/verification.md')
    );
    expect(verCall).toBeDefined();
    const verContent = verCall![1] as string;
    expect(verContent).toContain('VER-100');
    expect(verContent).toContain('login flow');
  });
});
