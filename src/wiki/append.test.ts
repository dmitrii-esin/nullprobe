import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { appendToWikiLog, resolveWikiLogPath } from './append.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

describe('append', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nullprobe-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('resolveWikiLogPath returns absolute path to wiki/log.md', () => {
    const p = resolveWikiLogPath('/foo');
    expect(p).toBe(path.join('/foo', 'wiki', 'log.md'));
  });

  it('appendToWikiLog returns false if wiki/log.md does not exist', async () => {
    const res = await appendToWikiLog([{ operation: 'test', title: 'test', lines: ['a'] }], tmpDir);
    expect(res).toBe(false);
  });

  it('appendToWikiLog appends successfully if wiki/log.md exists', async () => {
    const wikiDir = path.join(tmpDir, 'wiki');
    await fs.mkdir(wikiDir);
    const logPath = path.join(wikiDir, 'log.md');
    await fs.writeFile(logPath, '# Log\n');

    const res = await appendToWikiLog([
      { operation: 'search', title: 'my search', lines: ['Found 1 repo'] }
    ], tmpDir);

    expect(res).toBe(true);

    const content = await fs.readFile(logPath, 'utf-8');
    expect(content).toContain('## [');
    expect(content).toContain('] search | my search');
    expect(content).toContain('  Found 1 repo');
    expect(content).toContain('---');
  });
});
