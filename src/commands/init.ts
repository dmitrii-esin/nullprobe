import chalk from 'chalk';
import ora from 'ora';
import { runInitFlow } from '../flows/init-flow.js';
import { scaffold } from '../scaffolder/index.js';

export async function runInit(targetPath: string): Promise<void> {
  const answers = await runInitFlow(targetPath);

  const spinner = ora('Scaffolding...').start();
  const written = await scaffold(answers);
  spinner.succeed('Done!');

  console.log(chalk.green('\n  Created:'));
  written.forEach((f) => console.log(chalk.green(`    ✓ ${f}`)));
  console.log(
    chalk.dim(`\n  Next: open a session in your AI tool and invoke the nullprobe-intro skill.\n`)
  );
}
