import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMEWORK_PATH = path.resolve(__dirname, '../../../AI_FRAMEWORK.md');

let _cached: string | null = null;

export async function getAiFrameworkContent(): Promise<string> {
  if (!_cached) {
    _cached = await readFile(FRAMEWORK_PATH, 'utf-8');
  }
  return _cached;
}
