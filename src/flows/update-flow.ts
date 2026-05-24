import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { checkAllSources } from '../github/client.js';
import { SOURCE_REPOS } from '../github/sources.js';

export async function runUpdateFlow(): Promise<void> {
  console.log(chalk.bold('\n  nullprobe update\n'));

  const spinner = ora('Checking source repositories...').start();
  const results = await checkAllSources(SOURCE_REPOS);
  spinner.succeed('Sources checked.');

  console.log('');
  const labelWidth = Math.max(...results.map((r) => r.source.label.length)) + 2;

  for (const { source, commit } of results) {
    const label = source.label.padEnd(labelWidth);
    if (commit) {
      const date = commit.latestDate.split('T')[0];
      console.log(
        `  ${chalk.white(label)} ${chalk.dim(commit.latestSha)}  ${chalk.dim(date)}  ${chalk.dim(commit.message)}`
      );
    } else {
      console.log(`  ${chalk.white(label)} ${chalk.red('[unreachable]')}`);
    }
  }

  console.log('');

  const action = await select({
    message: 'What do you want to do?',
    choices: [
      { name: 'Search for new tools/techniques for my environment', value: 'search' },
      { name: 'Refresh AI_FRAMEWORK.md with the latest bundled version', value: 'refresh' },
      { name: 'Nothing — just wanted to check', value: 'none' },
    ],
  });

  if (action === 'search') {
    const query = await input({
      message: 'What are you looking for? (e.g. "memory management", "cursor rules", "new plugins")',
    });
    console.log(
      chalk.dim(
        `\n  Search for "${query}" is planned for v0.2.\n  For now, the commit table above shows recent changes in source repos.\n  Run the nullprobe-intro skill in your AI session — it can search the web for you.\n`
      )
    );
  } else if (action === 'refresh') {
    console.log(
      chalk.dim(
        '\n  Refresh will overwrite AI_FRAMEWORK.md with the version bundled in this CLI.\n  Run: nullprobe init --refresh (coming in v0.2)\n'
      )
    );
  } else {
    console.log(chalk.dim('\n  All good. Run "nullprobe update" any time.\n'));
  }
}
