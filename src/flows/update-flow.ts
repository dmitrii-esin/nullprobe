import { select, input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { checkAllSources } from '../github/client.js';
import { SOURCE_REPOS } from '../github/sources.js';
import { appendToWikiLog } from '../wiki/append.js';
import { searchGitHub, RateLimitError } from '../search/github.js';
import { tavilySearch, TavilyError } from '../search/tavily.js';

// Strips ANSI escape sequences, control characters, and defangs javascript:/data:
// URLs inside markdown links — protects both terminal output and the wiki/log.md
// from injection content sourced over the network (Tavily / GitHub).
function sanitize(s: string): string {
  if (!s) return '';
  // eslint-disable-next-line no-control-regex
  let out = s.replace(/\x1b\[[0-9;]*[A-Za-z]/g, '');
  // eslint-disable-next-line no-control-regex
  out = out.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
  out = out.replace(/\]\(\s*javascript:/gi, '](blocked:');
  out = out.replace(/\]\(\s*data:/gi, '](blocked:');
  if (out.length > 280) out = out.slice(0, 277) + '…';
  return out;
}

export async function runUpdateFlow(): Promise<void> {
  console.log(chalk.bold('\n  nullprobe update\n'));

  const spinner = ora('Checking source repositories...').start();
  let results;
  try {
    results = await checkAllSources(SOURCE_REPOS);
    spinner.succeed('Sources checked.');
  } catch (err) {
    if (err instanceof RateLimitError) {
      spinner.fail('GitHub rate limit hit. Wait ~1 minute, or set GITHUB_TOKEN to raise the limit.');
      return;
    }
    spinner.fail('Source check failed.');
    throw err;
  }

  console.log('');
  const labelWidth = Math.max(...results.map((r) => r.source.label.length)) + 2;

  for (const { source, commit } of results) {
    const label = source.label.padEnd(labelWidth);
    if (commit) {
      const date = commit.latestDate.split('T')[0];
      console.log(
        `  ${chalk.white(label)} ${chalk.dim(commit.latestSha)}  ${chalk.dim(date)}  ${chalk.dim(sanitize(commit.message))}`
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
      { name: 'Nothing — just wanted to check', value: 'none' },
    ],
  });

  if (action === 'search') {
    const query = await input({
      message: 'What are you looking for? (e.g. "memory management", "cursor rules", "new plugins")',
    });

    const tavilyReady = Boolean(process.env['TAVILY_API_KEY']);

    const tavilyLabel = tavilyReady
      ? 'Tavily (fast, AI-optimized web search)'
      : 'Tavily (fast, AI-optimized web search)  — needs API key, shows setup';

    const backend = await select({
      message: 'Which search backend?',
      choices: [
        { name: 'GitHub commits only (no key needed — uses data already shown above)', value: 'github' },
        { name: tavilyLabel, value: 'tavily' },
      ],
    });

    if (backend === 'tavily' && !tavilyReady) {
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
      await appendToWikiLog([
        {
          operation: 'search',
          title: `Queued Tavily search: "${sanitize(query)}"`,
          lines: [
            `Query: ${sanitize(query)}`,
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
      const tavilySpinner = ora(`Searching Tavily for "${sanitize(query)}"...`).start();
      try {
        const results = await tavilySearch(query, apiKey);
        tavilySpinner.succeed(`Found ${results.length} results.`);
        for (const r of results.slice(0, 5)) {
          console.log(
            `\n  ${chalk.white(sanitize(r.title))}\n  ${chalk.dim(sanitize(r.url))}\n  ${chalk.dim(sanitize(r.content))}...`,
          );
        }
        await appendToWikiLog([
          {
            operation: 'search',
            title: `Tavily search: "${sanitize(query)}"`,
            lines: [
              `Query: ${sanitize(query)}`,
              `Backend: tavily`,
              `Results: ${results.length}`,
              ...results.slice(0, 5).map((r) => `- ${sanitize(r.title)} — ${sanitize(r.url)}`),
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
      const ghSpinner = ora(`Searching GitHub for "${sanitize(query)}"...`).start();
      try {
        const ghResults = await searchGitHub(query);
        ghSpinner.succeed(`Found ${ghResults.length} results.`);
        for (const r of ghResults.slice(0, 5)) {
          console.log(`\n  ${chalk.white(sanitize(r.title))}\n  ${chalk.dim(sanitize(r.url))}`);
        }
        await appendToWikiLog([
          {
            operation: 'search',
            title: `GitHub search: "${sanitize(query)}"`,
            lines: [
              `Query: ${sanitize(query)}`,
              `Backend: github`,
              `Results: ${ghResults.length}`,
              ...ghResults.slice(0, 5).map((r) => `- ${sanitize(r.title)} — ${sanitize(r.url)}`),
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
  } else {
    console.log(chalk.dim('\n  All good. Run "nullprobe update" any time.\n'));
  }
}
