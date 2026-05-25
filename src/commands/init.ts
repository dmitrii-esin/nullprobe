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

// ---------------------------------------------------------------------------
// nextStepMessage
//
// Line 1: what was created (one line, no list)
// Line 2: exact next step for that platform (terminal command or UI action)
//
// Constraints: short, specific, copy-pasteable. No generic AI-tool language.
// ---------------------------------------------------------------------------

function nextStepMessage(platform: AIPlatform): string {
  switch (platform) {
    case 'claude':
      // Skills are in .claude/skills/ — Claude Code picks them up
      // automatically. The user opens a session and invokes by name.
      return (
        chalk.dim('\n  AI_FRAMEWORK.md + wiki + 4 skills installed into .claude/skills/\n') +
        chalk.dim('  Next: ') +
        chalk.white('claude') +
        chalk.dim(' — then type ') +
        chalk.white('/nullprobe-intro') +
        chalk.dim(' to orient the AI and populate the wiki.\n')
      );

    case 'cursor':
      // Context7 MCP is in .cursor/mcp.json. Skills are in .claude/skills/
      // (v0.1 fallback — see scaffolder divergence note). The user opens
      // Cursor's AI chat and references the framework file directly.
      return (
        chalk.dim('\n  AI_FRAMEWORK.md + wiki + Context7 MCP written to .cursor/mcp.json\n') +
        chalk.dim('  Next: open Cursor, start a chat, type ') +
        chalk.white('@AI_FRAMEWORK.md') +
        chalk.dim(' and say "orient yourself using this document".\n')
      );

    case 'gemini-cli':
      // GEMINI.md is not yet scaffolded (v0.1 uses the Claude layout as
      // fallback). The user runs `gemini` in the project root; it picks up
      // GEMINI.md automatically. Until that file is written by nullprobe,
      // tell the user to reference AI_FRAMEWORK.md manually.
      return (
        chalk.dim('\n  AI_FRAMEWORK.md + wiki + MCP config written to .agent/mcp_config.json\n') +
        chalk.dim('  Next: ') +
        chalk.white('gemini') +
        chalk.dim(' — then type ') +
        chalk.white('@AI_FRAMEWORK.md orient yourself using this document') +
        chalk.dim('.\n')
      );

    case 'antigravity':
      // Antigravity (Windsurf) reads .windsurf/rules/ automatically.
      // v0.1 fallback: skills are in .claude/skills/; tell user to add
      // AI_FRAMEWORK.md as a Windsurf rule via the IDE until v0.2 ships
      // the .windsurf/rules/ writer.
      return (
        chalk.dim('\n  AI_FRAMEWORK.md + wiki + MCP config written to .agent/mcp_config.json\n') +
        chalk.dim('  Next: in Windsurf, open Settings → Rules → Add rule → pick ') +
        chalk.white('AI_FRAMEWORK.md') +
        chalk.dim(', then start a new Cascade session.\n')
      );
  }
}
