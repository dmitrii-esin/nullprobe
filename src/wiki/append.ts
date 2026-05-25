/**
 * wiki/append.ts
 *
 * Standalone utility for appending search results to an existing wiki/log.md.
 *
 * Design contract:
 *   - NEVER creates wiki/log.md if it does not exist. The log is a project
 *     artifact created by `nullprobe init`; creating it silently here would
 *     produce an orphan file with no init header and no proper provenance.
 *   - On missing file: prints an actionable failure message, returns false.
 *   - On success: appends a timestamped H2 block, prints one confirmation
 *     line, returns true.
 *   - All I/O errors (permissions, disk full, etc.) bubble as thrown errors
 *     so the caller can decide whether to surface them or swallow them.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';

export interface WikiLogEntry {
  /** Short slug used in the H2 heading, e.g. "search" or "update" */
  operation: string;
  /** Human-readable title, e.g. 'Search results for "memory management"' */
  title: string;
  /** Body lines written verbatim inside the entry block */
  lines: string[];
}

/**
 * Resolve the canonical wiki/log.md path relative to cwd (or an explicit
 * base, useful in tests).
 */
export function resolveWikiLogPath(base: string = process.cwd()): string {
  return path.join(base, 'wiki', 'log.md');
}

/**
 * Append one or more log entries to an existing wiki/log.md.
 *
 * @param entries  One or more entries to append.
 * @param base     Root of the project. Defaults to process.cwd().
 * @returns        true on success, false when wiki/log.md does not exist.
 * @throws         On any I/O error other than ENOENT on the log file itself.
 */
export async function appendToWikiLog(
  entries: WikiLogEntry[],
  base: string = process.cwd(),
): Promise<boolean> {
  const logPath = resolveWikiLogPath(base);

  // --- existence check ---------------------------------------------------
  const exists = await fileExists(logPath);
  if (!exists) {
    const relLog = path.relative(base, logPath);
    console.log(
      chalk.yellow(`\n  wiki/log.md not found in this directory.\n`) +
        chalk.dim(`  ${relLog} is created by "nullprobe init".\n`) +
        chalk.dim(`  Run: `) +
        chalk.white(`nullprobe init`) +
        chalk.dim(` — then re-run this command.\n`),
    );
    return false;
  }

  // --- build the append block --------------------------------------------
  const today = new Date().toISOString().split('T')[0];
  const blocks = entries.map((entry) => buildBlock(today, entry));
  const appendContent = '\n' + blocks.join('\n') + '\n';

  // --- write -------------------------------------------------------------
  await fs.appendFile(logPath, appendContent, 'utf-8');

  const label = entries.length === 1 ? '1 entry' : `${entries.length} entries`;
  console.log(chalk.green(`  Saved ${label} to wiki/log.md\n`));
  return true;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders a single WikiLogEntry as a markdown H2 block.
 *
 * Output format matches the header contract in wiki-log.ts:
 *   ## [YYYY-MM-DD] operation | Title
 */
function buildBlock(date: string, entry: WikiLogEntry): string {
  const heading = `## [${date}] ${entry.operation} | ${entry.title}`;
  const body = entry.lines.map((line) => `  ${line}`).join('\n');
  return `${heading}\n\n${body}\n\n---`;
}
