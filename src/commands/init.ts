import chalk from 'chalk';
import ora from 'ora';
import { runInitFlow } from '../flows/init-flow.js';
import { scaffold } from '../scaffolder/index.js';
import type { AIPlatform } from '../types.js';

export async function runInit(targetPath: string): Promise<void> {
  const answers = await runInitFlow(targetPath);

  const spinner = ora('Scaffolding...').start();
  const written = await scaffold(answers);
  spinner.succeed('Done!');

  console.log(chalk.green('\n  Created:'));
  written.forEach((f) => console.log(chalk.green(`    ✓ ${f}`)));
  console.log(nextStepMessage(answers.platform));
}

// Next-step instructions per platform. Paths here must match what
// scaffolder/index.ts + scaffolder/platforms.ts actually write.
function nextStepMessage(platform: AIPlatform): string {
  switch (platform) {
    case 'claude':
      return (
        chalk.dim('\n  Claude Code auto-discovers .claude/skills/.\n') +
        chalk.dim('  Next: ') +
        chalk.white('claude') +
        chalk.dim(' — then type ') +
        chalk.white('/nullprobe-intro') +
        chalk.dim(' to orient the AI and populate the wiki.\n')
      );

    case 'cursor':
      return (
        chalk.dim('\n  Cursor auto-loads .cursor/rules/*.mdc.\n') +
        chalk.dim('  Next: open Cursor, start a chat, type ') +
        chalk.white('@AI_FRAMEWORK.md') +
        chalk.dim(' and say "orient yourself using this document".\n')
      );

    case 'gemini-cli':
      return (
        chalk.dim('\n  Gemini CLI auto-loads GEMINI.md (skills inlined as H2 sections).\n') +
        chalk.dim('  Next: ') +
        chalk.white('gemini') +
        chalk.dim(' — ask it to run the nullprobe-intro section.\n')
      );

    case 'antigravity':
      return (
        chalk.dim('\n  Antigravity (Windsurf) auto-loads .antigravitycli/rules/.\n') +
        chalk.dim('  Next: open Windsurf and start a Cascade session; the rules apply automatically.\n')
      );

    default: {
      const _exhaustive: never = platform;
      throw new Error(`Unknown platform: ${_exhaustive as string}`);
    }
  }
}
