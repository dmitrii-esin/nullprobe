import { select, input, confirm, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { AIPlatform, ExtraMcpId, InitAnswers } from '../types.js';
import { PLATFORMS } from '../scaffolder/platforms.js';
import { EXTRA_MCP_CHOICES } from '../scaffolder/templates/mcp-context7.js';

export async function runInitFlow(targetPath: string): Promise<InitAnswers> {
  console.log(chalk.bold('\n  nullprobe v0.1\n'));
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

  const approach = await select({
    message: 'How do you want to set up your AI toolkit?',
    choices: [
      {
        name: 'Include recommended tools & methodologies (curated, battle-tested)',
        value: 'recommended',
      },
      {
        name: 'I want to add something specific (tell me what you need)',
        value: 'specific',
      },
      {
        name: 'Search internet & reference repos for compatible tools to deploy',
        value: 'search',
      },
    ],
  });

  let installSkill = true;

  if (approach === 'specific') {
    const details = await input({
      message: 'What tools, plugins, or techniques do you want to include?',
    });
    console.log(
      chalk.dim(`\n  Got it — "${details}". This will be handled by the nullprobe-intro skill after scaffolding.\n`)
    );
  } else if (approach === 'search') {
    console.log(
      chalk.dim(
        '\n  The nullprobe-intro skill will search the internet and reference repos for you after scaffolding.\n'
      )
    );
  } else {
    console.log(
      chalk.dim('\n  Installing recommended setup: AI_FRAMEWORK.md + nullprobe-intro skill + wiki.\n')
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

  const extraMcps = await pickExtraMcps();

  const finalPath = path.resolve(targetPath);
  const platformConfig = PLATFORMS[platform];
  const existingFiles = await checkExistingFiles(finalPath, platformConfig.detectPaths);
  if (existingFiles.length > 0) {
    console.log(chalk.yellow(`\n  These files already exist in ${finalPath}:`));
    existingFiles.forEach((f) => console.log(chalk.yellow(`    • ${f}`)));
    const overwrite = await confirm({
      message: 'Overwrite them?',
      default: false,
    });
    if (!overwrite) {
      console.log(chalk.dim('  Aborted. Nothing was written.'));
      process.exit(0);
    }
  }

  return { platform, targetPath: finalPath, installSkill, extraMcps };
}

async function pickExtraMcps(): Promise<ExtraMcpId[]> {
  const customize = await confirm({
    message: 'Customize MCP servers? (default scaffolds context7 only)',
    default: false,
  });
  if (!customize) return [];

  const picked = await checkbox<ExtraMcpId>({
    message: 'Pick optional MCPs to scaffold alongside context7:',
    choices: EXTRA_MCP_CHOICES.map((c) => ({
      name: `${c.label} — ${c.description}`,
      value: c.id,
    })),
  });
  return picked;
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
