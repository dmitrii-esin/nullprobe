import { describe, it, expect } from 'vitest';
import { parseSkillMeta, stripSkillFrontmatter, wrapAsMdc } from './skill-to-mdc.js';

describe('skill-to-mdc', () => {
  const sampleSkill = `---
name: my-skill
description: A cool skill
allowed-tools: read_file, run_command
---
# Skill Content
This is the body.`;

  const invalidSkill = `No frontmatter here`;

  it('parseSkillMeta extracts name, description, and allowedTools', () => {
    const meta = parseSkillMeta(sampleSkill);
    expect(meta).toEqual({
      name: 'my-skill',
      description: 'A cool skill',
      allowedTools: ['read_file', 'run_command'],
    });
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
