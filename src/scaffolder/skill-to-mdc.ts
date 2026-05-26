// Maps skill names to their alwaysApply value for Cursor .mdc files.
const ALWAYS_APPLY: Record<string, boolean> = {
  'nullprobe-intro': false,
  'think-before-coding': true,
  'simplicity-guard': true,
  'session-crystallize': false,
};

export interface SkillMeta {
  name: string;
  description: string;
  allowedTools: string[];
}

// Frontmatter regexes accept both LF (\n) and CRLF (\r\n) line endings so
// skills hand-edited on Windows still parse correctly.
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const FRONTMATTER_STRIP_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;

export function parseSkillMeta(skillContent: string): SkillMeta {
  const fmMatch = skillContent.match(FRONTMATTER_RE);
  if (!fmMatch) {
    console.warn('[skill-to-mdc] no frontmatter found in skill; resulting .mdc will have empty description');
    return { name: '', description: '', allowedTools: [] };
  }

  const fm = fmMatch[1];

  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  const toolsMatch = fm.match(/^allowed-tools:\s*(.+)$/m);

  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    description: descMatch ? descMatch[1].trim() : '',
    allowedTools: toolsMatch
      ? toolsMatch[1].split(',').map((t) => t.trim()).filter(Boolean)
      : [],
  };
}

export function stripSkillFrontmatter(skillContent: string): string {
  return skillContent.replace(FRONTMATTER_STRIP_RE, '');
}

export function wrapAsMdc(content: string, skillName: string): string {
  const meta = parseSkillMeta(content);
  const alwaysApply = ALWAYS_APPLY[skillName] ?? false;
  const body = stripSkillFrontmatter(content);
  return `---\ndescription: ${meta.description}\nalwaysApply: ${alwaysApply}\n---\n${body}`;
}
