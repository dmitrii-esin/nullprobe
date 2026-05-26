import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Resolves to the same package.json in dev (src/version.ts) and in build
// output (dist/version.js): one level up from this file in both cases.
const here = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.resolve(here, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as { version: string };

export const VERSION: string = pkg.version;
