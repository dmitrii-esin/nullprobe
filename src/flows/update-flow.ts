import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { checkAllSources } from '../github/client.js';
import { SOURCE_REPOS } from '../github/sources.js';
import { appendToWikiLog } from '../wiki/append.js';
import { searchGitHub, RateLimitError } from '../search/github.js';
import { tavilySearch, TavilyError } from '../search/tavily.js';

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

    // Ask which search backend to use. Tavily requires an API key; if it is
    // not set in the environment we dim the option and gate behind a setup
    // message. The check happens before rendering so the label reflects the
    // actual state of the user's environment.
    const tavilyReady = Boolean(process.env['TAVILY_API_KEY']);

    // The Tavily choice label is annotated when the key is not present so
    // users understand upfront why selecting it will not immediately search.
    // Using a suffix annotation (rather than disabling the choice) keeps the
    // option visible and discoverable — "needs setup" is more informative
    // than a grayed-out item with no explanation.
    const tavilyLabel = tavilyReady
      ? 'Tavily (fast, AI-optimized web search)'
      : 'Tavily (fast, AI-optimized web search)  — needs API key, shows setup';

    const backend = await select({
      message: 'Which search backend?',
      choices: [
        {
          name: 'GitHub commits only (no key needed — uses data already shown above)',
          value: 'github',
        },
        {
          name: tavilyLabel,
          value: 'tavily',
        },
      ],
    });

    if (backend === 'tavily' && !tavilyReady) {
      // Tavily is not configured. Print the exact setup sequence — every
      // token is copy-pasteable and there are no placeholders.
      console.log(
        chalk.yellow('\n  Tavily API key not found in your environment.\n') +
          '\n' +
          chalk.dim('  1. Get a free key (5,000 searches/month) at:\n') +
          chalk.white('     https://app.tavily.com/sign-up\n') +
          '\n' +
          chalk.dim('  2. Export the key in your shell profile:\n') +
          chalk.white('     export TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n') +
          '\n' +
          chalk.dim('  3. Reload your shell, then re-run:\n') +
          chalk.white('     nullprobe update\n'),
      );
      // Record the intent so the AI session can pick up the queued search
      // once Tavily is configured.
      await appendToWikiLog([
        {
          operation: 'search',
          title: `Queued Tavily search: "${query}"`,
          lines: [
            `Query: ${query}`,
            `Backend: tavily — not yet configured`,
            `Blocked by: TAVILY_API_KEY not set`,
            `Next: set TAVILY_API_KEY then run: nullprobe update`,
          ],
        },
      ]);
      return;
    }

    if (backend === 'tavily' && tavilyReady) {
      const apiKey = process.env['TAVILY_API_KEY']!;
      const tavilySpinner = ora(`Searching Tavily for "${query}"...`).start();
      try {
        const results = await tavilySearch(query, apiKey);
        tavilySpinner.succeed(`Found ${results.length} results.`);
        for (const r of results.slice(0, 5)) {
          console.log(
            `\n  ${chalk.white(r.title)}\n  ${chalk.dim(r.url)}\n  ${chalk.dim(r.content.slice(0, 120))}...`,
          );
        }
        await appendToWikiLog([
          {
            operation: 'search',
            title: `Tavily search: "${query}"`,
            lines: [
              `Query: ${query}`,
              `Backend: tavily`,
              `Results: ${results.length}`,
              ...results.slice(0, 5).map((r) => `- ${r.title} — ${r.url}`),
            ],
          },
        ]);
      } catch (err) {
        if (err instanceof TavilyError) {
          tavilySpinner.fail(`Tavily error: ${err.message} (${err.code})`);
        } else {
          tavilySpinner.fail('Search failed.');
        }
      }
    } else {
      // backend === 'github'
      const ghSpinner = ora(`Searching GitHub for "${query}"...`).start();
      try {
        const ghResults = await searchGitHub(query);
        ghSpinner.succeed(`Found ${ghResults.length} results.`);
        for (const r of ghResults.slice(0, 5)) {
          console.log(`\n  ${chalk.white(r.title)}\n  ${chalk.dim(r.url)}`);
        }
        await appendToWikiLog([
          {
            operation: 'search',
            title: `GitHub search: "${query}"`,
            lines: [
              `Query: ${query}`,
              `Backend: github`,
              `Results: ${ghResults.length}`,
              ...ghResults.slice(0, 5).map((r) => `- ${r.title} — ${r.url}`),
            ],
          },
        ]);
      } catch (err) {
        if (err instanceof RateLimitError) {
          ghSpinner.fail('GitHub rate limit hit. Wait a minute and try again.');
        } else {
          ghSpinner.fail('GitHub search failed.');
        }
      }
    }
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
