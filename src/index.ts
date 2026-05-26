#!/usr/bin/env node
import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runUpdate } from './commands/update.js';
import { VERSION } from './version.js';

const program = new Command();

program
  .name('nullprobe')
  .description('Lightweight tool that deploys a living AI collaboration layer into your project')
  .version(VERSION);

program
  .command('init')
  .description('Scaffold an AI collaboration layer into your project')
  .argument('[path]', 'Target directory', '.')
  .action(runInit);

program
  .command('update')
  .description('Check source repos for new tools and techniques')
  .action(runUpdate);

program.parse();
