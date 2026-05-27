import { select, input, confirm, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AIPlatform, ExtraMcpId, InitAnswers, InitApproach } from '../types.js';
import { PLATFORMS } from '../scaffolder/platforms.js';
import { EXTRA_MCP_CHOICES } from '../scaffolder/templates/mcp-context7.js';
import { VERSION } from '../version.js';

// Directories that almost never represent intentional scaffold targets.
const HAZARDOUS_TARGET_SEGMENTS = [
  'node_modules',
  '.venv',
  'venv',
  '__pycache__',
  '.ipynb_checkpoints',
];

export async function runInitFlow(targetPath: string): Promise<InitAnswers> {
  console.log(chalk.bold(`\n  nullprobe v${VERSION}\n`));
  console.log(
    `  A lightweight tool that deploys a living AI collaboration layer into your project.
  No overloading. No fragile multi-framework design. Just the essentials that compound.\n`
  );

  const platform = await select<AIPlatform>({
    message: 'Hey — what AI environment are you going to use?',
    choices: [
      { name: 'Claude (Claude Code / claude.ai)', value: 'claude' },
      { name: 'Cursor', value: 'cursor' },
      { name: 'Gemini CLI', value: 'gemini-cli' },
      { name: 'Antigravity', value: 'antigravity' },
    ],
  });

  const approach = await select<InitApproach>({
    message: 'How do you want to set up your AI toolkit?',
    choices: [
      { name: 'Include recommended tools & methodologies (curated, battle-tested)', value: 'recommended' },
      { name: 'I want to add something specific (tell me what you need)', value: 'specific' },
      { name: 'Search internet & reference repos for compatible tools to deploy', value: 'search' },
    ],
  });

  let details = '';
  if (approach === 'specific') {
    details = await input({
      message: 'What tools, plugins, or techniques do you want to include?',
    });
    console.log(
      chalk.dim(`\n  Logged to wiki/log.md for the nullprobe-intro skill to pick up.\n`)
    );
  } else if (approach === 'search') {
    console.log(
      chalk.dim('\n  The nullprobe-intro skill will search the internet and reference repos for you after scaffolding.\n')
    );
  } else {
    console.log(
      chalk.dim('\n  Installing recommended setup: AI_FRAMEWORK.md + 4 nullprobe skills + wiki.\n')
    );
  }

  const resolvedPath = path.resolve(targetPath);
  const confirmPath = await confirm({
    message: `Scaffold into ${resolvedPath}?`,
    default: true,
  });

  if (!confirmPath) {
    targetPath = await input({
      message: 'Where should I put it?',
      default: targetPath,
    });
  }

  const finalPath = path.resolve(targetPath);

  const hazardous = findHazardousSegment(finalPath);
  if (hazardous) {
    console.log(chalk.red(`\n  Refusing to scaffold into a "${hazardous}" directory.`));
    console.log(chalk.dim(`  Target: ${finalPath}`));
    console.log(chalk.dim(`  Pick a project directory instead.\n`));
    process.exit(1);
  }

  // Only ask about extra MCPs when the user opted into "specific" — recommended
  // and search both default to context7-only (extraMcps: []).
  const extraMcps: ExtraMcpId[] = approach === 'specific' ? await pickExtraMcps() : [];

  // Optional QA protocols are only offered in "specific" mode to protect the
  // core "two questions and done" lightweight experience on the recommended path.
  const { includeProtocols, protocolPriorities } = approach === 'specific'
    ? await pickQaProtocols()
    : { includeProtocols: false, protocolPriorities: undefined };

  const platformConfig = PLATFORMS[platform];
  const existingFiles = await checkExistingFiles(finalPath, platformConfig.detectPaths);
  if (existingFiles.length > 0) {
    console.log(chalk.yellow(`\n  These files already exist in ${finalPath}:`));
    existingFiles.forEach((f) => console.log(chalk.yellow(`    • ${f}`)));

    const hasProtocols = existingFiles.some(f => f.startsWith('protocols/'));

    if (hasProtocols) {
      console.log(chalk.red(`\n  WARNING: You have existing files in protocols/.`));
      console.log(chalk.red(`  These may contain your customized, project-specific runbooks.`));
      console.log(chalk.dim(`  Consider moving your heavily customized content to a separate folder`));
      console.log(chalk.dim(`  (e.g. protocols/custom/ or my-protocols/) before proceeding.`));
    }

    const overwrite = await confirm({
      message: hasProtocols ? 'Overwrite them anyway?' : 'Overwrite them?',
      default: false,
    });
    if (!overwrite) {
      console.log(chalk.dim('  Aborted. Nothing was written.'));
      process.exit(0);
    }
  }

  return { platform, targetPath: finalPath, approach, details, extraMcps, includeProtocols, protocolPriorities };
}

async function pickExtraMcps(): Promise<ExtraMcpId[]> {
  const customize = await confirm({
    message: 'Customize MCP servers? (default scaffolds context7 only)',
    default: false,
  });
  if (!customize) return [];

  return checkbox<ExtraMcpId>({
    message: 'Pick optional MCPs to scaffold alongside context7:',
    choices: EXTRA_MCP_CHOICES.map((c) => ({
      name: `${c.label} — ${c.description}`,
      value: c.id,
    })),
  });
}

async function pickQaProtocols(): Promise<{ includeProtocols: boolean; protocolPriorities?: string[] }> {
  const include = await confirm({
    message: 'Include customizable QA protocols for this project? (full set of 5 — optional, off by default)',
    default: false,
  });
  if (!include) return { includeProtocols: false };

  const raw = await input({
    message: 'What 1-3 things must never regress? (comma-separated, e.g. login flow, checkout, data export)',
    default: '',
  });

  const priorities = raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (priorities.length > 0) {
    console.log(chalk.dim(`\n  Will seed ${priorities.length} starter cases in protocols/verification.md.\n`));
  }

  return { includeProtocols: true, protocolPriorities: priorities.length ? priorities : undefined };
}

async function checkExistingFiles(base: string, toCheck: string[]): Promise<string[]> {
  const existing: string[] = [];
  for (const rel of toCheck) {
    try {
      await fs.access(path.join(base, rel));
      existing.push(rel);
    } catch {
      // doesn't exist
    }
  }
  return existing;
}

function findHazardousSegment(targetPath: string): string | null {
  const segments = targetPath.split(path.sep);
  for (const seg of HAZARDOUS_TARGET_SEGMENTS) {
    if (segments.includes(seg)) return seg;
  }
  return null;
}
