import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseSkillMeta, stripSkillFrontmatter, wrapAsMdc } from './skill-to-mdc.js';

describe('skill-to-mdc', () => {
  beforeEach(() => {
    // Silence the "no frontmatter found" warning emitted on invalid input.
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  const sampleSkill = `---
name: my-skill
description: A cool skill
allowed-tools: read_file, run_command
---
# Skill Content
This is the body.`;

  const sampleSkillCrlf =
    '---\r\nname: crlf-skill\r\ndescription: Saved on Windows\r\nallowed-tools: read_file\r\n---\r\n# Body\r\nLine.';

  const invalidSkill = `No frontmatter here`;

  it('parseSkillMeta extracts name, description, and allowedTools', () => {
    const meta = parseSkillMeta(sampleSkill);
    expect(meta).toEqual({
      name: 'my-skill',
      description: 'A cool skill',
      allowedTools: ['read_file', 'run_command'],
    });
  });

  it('parseSkillMeta parses CRLF-terminated frontmatter correctly', () => {
    const meta = parseSkillMeta(sampleSkillCrlf);
    expect(meta.name).toBe('crlf-skill');
    expect(meta.description).toBe('Saved on Windows');
    expect(meta.allowedTools).toEqual(['read_file']);
  });

  it('stripSkillFrontmatter handles CRLF', () => {
    const body = stripSkillFrontmatter(sampleSkillCrlf);
    expect(body).toContain('# Body');
    expect(body).not.toContain('---');
  });

  it('parseSkillMeta returns empty strings and array for missing frontmatter', () => {
    const meta = parseSkillMeta(invalidSkill);
    expect(meta).toEqual({ name: '', description: '', allowedTools: [] });
  });

  it('stripSkillFrontmatter removes the frontmatter block entirely', () => {
    const body = stripSkillFrontmatter(sampleSkill);
    expect(body).toBe('# Skill Content\nThis is the body.');
  });

  it('stripSkillFrontmatter leaves content without frontmatter untouched', () => {
    const body = stripSkillFrontmatter(invalidSkill);
    expect(body).toBe(invalidSkill);
  });

  it('wrapAsMdc produces valid .mdc content with correct alwaysApply values', () => {
    // think-before-coding should map to true
    const mdc1 = wrapAsMdc(sampleSkill, 'think-before-coding');
    expect(mdc1).toContain('alwaysApply: true');
    expect(mdc1).toContain('description: A cool skill');
    expect(mdc1).toContain('# Skill Content');

    // nullprobe-intro should map to false
    const mdc2 = wrapAsMdc(sampleSkill, 'nullprobe-intro');
    expect(mdc2).toContain('alwaysApply: false');

    // unknown skill should default to false
    const mdc3 = wrapAsMdc(sampleSkill, 'unknown-skill');
    expect(mdc3).toContain('alwaysApply: false');
  });
});
