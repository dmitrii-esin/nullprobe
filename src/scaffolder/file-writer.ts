import fs from 'node:fs/promises';
import path from 'node:path';
import type { ExtraFile, McpConfig } from '../types.js';

export async function writeFile(absolutePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf-8');
}

// ---------------------------------------------------------------------------
// mergeMcpServers
//
// Merges the mcpServers from `newContent` (a JSON string) into the file at
// `filePath`. Handles every real-world state the file can be in:
//
//   1. File does not exist            → write newContent as-is
//   2. File exists, unreadable        → throw (permissions problem, surface it)
//   3. File exists, invalid JSON      → overwrite with newContent (corrupt file
//                                        is worse than losing unknown content;
//                                        the caller already warned the user)
//   4. File exists, valid JSON, no mcpServers key → inject mcpServers block
//   5. File exists, mcpServers present, context7 already there → no-op
//   6. File exists, mcpServers present, other servers → merge, preserve all
//
// Write strategy: temp file in the same directory + atomic rename so that a
// crash mid-write never leaves a half-written config behind. Same-directory
// temp ensures the rename is within one filesystem (no cross-device move).
// ---------------------------------------------------------------------------

export async function mergeMcpServers(
  filePath: string,
  newContent: string,
): Promise<void> {
  const dir = path.dirname(filePath);

  // Parse the incoming servers. If newContent is malformed, throw immediately
  // so the caller gets a clear error rather than a silent no-op.
  const incoming = parseJsonOrThrow<McpConfig>(newContent, 'newContent');
  if (!incoming.mcpServers || typeof incoming.mcpServers !== 'object') {
    throw new Error(`mergeMcpServers: newContent has no mcpServers key`);
  }

  await fs.mkdir(dir, { recursive: true });

  // --- Read existing file ---------------------------------------------------
  let raw: string | null = null;
  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err: unknown) {
    if (isNodeError(err) && err.code === 'ENOENT') {
      // Case 1: file doesn't exist — write newContent directly
      await atomicWrite(filePath, dir, JSON.stringify(incoming, null, 2) + '\n');
      return;
    }
    // Case 2: any other read error (EACCES, etc.) — surface it
    throw err;
  }

  // --- Parse existing content -----------------------------------------------
  let existing: Record<string, unknown>;
  try {
    existing = JSON.parse(raw);
    if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) {
      throw new SyntaxError('Root value is not an object');
    }
  } catch {
    // Case 3: invalid / corrupt JSON — overwrite cleanly
    await atomicWrite(filePath, dir, JSON.stringify(incoming, null, 2) + '\n');
    return;
  }

  // --- Merge ----------------------------------------------------------------
  const existingServers =
    typeof existing['mcpServers'] === 'object' &&
    existing['mcpServers'] !== null &&
    !Array.isArray(existing['mcpServers'])
      ? (existing['mcpServers'] as Record<string, unknown>)
      : {}; // Cases 4: no mcpServers key

  // Case 5: every key in incoming.mcpServers already present → idempotent no-op
  const incomingKeys = Object.keys(incoming.mcpServers);
  const allPresent = incomingKeys.every((k) => k in existingServers);
  if (allPresent) return;

  // Case 6: merge — incoming servers win on key collision, others preserved
  const merged: McpConfig = {
    ...existing,
    mcpServers: {
      ...existingServers,
      ...incoming.mcpServers, // incoming takes precedence (version bumps, etc.)
    } as McpConfig['mcpServers'],
  };

  await atomicWrite(filePath, dir, JSON.stringify(merged, null, 2) + '\n');
}

// ---------------------------------------------------------------------------
// writeExtraFile — dispatches based on the ExtraFile discriminator
// ---------------------------------------------------------------------------

export async function writeExtraFile(
  base: string,
  file: ExtraFile,
): Promise<void> {
  const absolutePath = path.join(base, file.relPath);

  switch (file.ifExists) {
    case 'overwrite':
      await writeFile(absolutePath, file.content);
      return;
    case 'merge-mcp':
      await mergeMcpServers(absolutePath, file.content);
      return;
    default: {
      // Exhaustiveness check: TypeScript will error here if a new variant is
      // added to ExtraFile without a matching case.
      const _exhaustive: never = file;
      throw new Error(`writeExtraFile: unknown ifExists mode on ${(_exhaustive as ExtraFile).relPath}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseJsonOrThrow<T>(text: string, label: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new Error(`mergeMcpServers: ${label} is not valid JSON — ${String(err)}`);
  }
}

async function atomicWrite(
  targetPath: string,
  dir: string,
  content: string,
): Promise<void> {
  // Write to a temp file in the same directory so rename() is same-filesystem.
  const tmp = path.join(dir, `.nullprobe-tmp-${Date.now()}-${process.pid}`);
  try {
    await fs.writeFile(tmp, content, { encoding: 'utf-8', flag: 'wx' }); // 'wx' = fail if exists
    await fs.rename(tmp, targetPath);
  } catch (err) {
    // Best-effort cleanup of the temp file on any failure.
    await fs.unlink(tmp).catch(() => undefined);
    throw err;
  }
}

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err;
}
