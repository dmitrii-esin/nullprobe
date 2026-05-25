import { describe, it, expect } from 'vitest';
import { PLATFORMS } from './platforms.js';

describe('platforms', () => {
  it('claude platform returns correct paths and empty extraFiles', () => {
    const config = PLATFORMS.claude;
    expect(config.skillPath('my-skill')).toBe('.claude/skills/my-skill/SKILL.md');
    expect(config.detectPaths).toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(config.extraFiles('content', 'name')).toEqual([]);
  });

  it('cursor platform returns correct paths and wraps extraFiles', () => {
    const config = PLATFORMS.cursor;
    expect(config.skillPath('my-skill')).toBe('.cursor/rules/my-skill.mdc');
    expect(config.detectPaths).toContain('.cursor/rules/nullprobe-intro.mdc');
    
    const extra = config.extraFiles('---\nname: foo\n---\nbody', 'foo');
    expect(extra).toHaveLength(1);
    expect(extra[0].relPath).toBe('.cursor/rules/foo.mdc');
    expect(extra[0].ifExists).toBe('overwrite');
    expect(extra[0].content).toContain('alwaysApply: false');
    expect(extra[0].content).toContain('body');
  });

  it('gemini-cli platform maps to claude paths and returns empty extraFiles', () => {
    const config = PLATFORMS['gemini-cli'];
    expect(config.skillPath('my-skill')).toBe('.claude/skills/my-skill/SKILL.md');
    expect(config.detectPaths).toContain('.claude/skills/nullprobe-intro/SKILL.md');
    expect(config.extraFiles('content', 'name')).toEqual([]);
  });

  it('antigravity platform returns correct paths and wraps extraFiles', () => {
    const config = PLATFORMS.antigravity;
    expect(config.skillPath('my-skill')).toBe('.antigravitycli/rules/my-skill.md');
    expect(config.detectPaths).toContain('.antigravitycli/rules/nullprobe-intro.md');
    
    const extra = config.extraFiles('---\nname: foo\n---\nbody', 'foo');
    expect(extra).toHaveLength(1);
    expect(extra[0].relPath).toBe('.antigravitycli/rules/foo.md');
    expect(extra[0].ifExists).toBe('overwrite');
    expect(extra[0].content).toContain('alwaysApply: false');
    expect(extra[0].content).toContain('body');
  });
});
