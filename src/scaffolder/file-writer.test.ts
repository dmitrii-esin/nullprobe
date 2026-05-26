import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mergeMcpServers } from './file-writer.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

describe('file-writer', () => {
  let tmpDir: string;
  let filePath: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'nullprobe-test-'));
    filePath = path.join(tmpDir, 'mcp.json');
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  const newContent = JSON.stringify({ mcpServers: { newServer: { command: 'echo' } } });

  it('Case 1: File does not exist -> writes newContent as-is', async () => {
    await mergeMcpServers(filePath, newContent);
    const result = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    expect(result.mcpServers).toHaveProperty('newServer');
  });

  it('Case 3: File exists, invalid JSON -> backs up the original then overwrites', async () => {
    const corrupt = 'invalid{json';
    await fs.writeFile(filePath, corrupt);
    await mergeMcpServers(filePath, newContent);

    // New content is in place
    const result = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    expect(result.mcpServers).toHaveProperty('newServer');

    // A backup file containing the original corrupt content also exists
    const files = await fs.readdir(tmpDir);
    const backup = files.find((f) => f.startsWith('mcp.json.bak-'));
    expect(backup).toBeDefined();
    const backupContent = await fs.readFile(path.join(tmpDir, backup!), 'utf-8');
    expect(backupContent).toBe(corrupt);
  });

  it('Case 4: File exists, valid JSON, no mcpServers key -> injects mcpServers block', async () => {
    await fs.writeFile(filePath, JSON.stringify({ otherConfig: true }));
    await mergeMcpServers(filePath, newContent);
    const result = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    expect(result).toHaveProperty('otherConfig', true);
    expect(result.mcpServers).toHaveProperty('newServer');
  });

  it('Case 5: File exists, mcpServers present, key already there -> no-op', async () => {
    const existing = { mcpServers: { newServer: { command: 'echo' }, other: {} } };
    await fs.writeFile(filePath, JSON.stringify(existing));
    await mergeMcpServers(filePath, newContent);
    const result = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    expect(result.mcpServers).toHaveProperty('other'); // Preserved untouched
  });

  it('Case 6: File exists, mcpServers present, other servers -> merges and preserves all', async () => {
    const existing = { mcpServers: { oldServer: { command: 'cat' } } };
    await fs.writeFile(filePath, JSON.stringify(existing));
    await mergeMcpServers(filePath, newContent);
    const result = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    expect(result.mcpServers).toHaveProperty('oldServer');
    expect(result.mcpServers).toHaveProperty('newServer');
  });

  it('throws if incoming newContent is malformed or lacks mcpServers', async () => {
    await expect(mergeMcpServers(filePath, 'invalid json')).rejects.toThrow(/not valid JSON/);
    await expect(mergeMcpServers(filePath, '{}')).rejects.toThrow(/has no mcpServers key/);
  });
});
