import fs from 'node:fs/promises';
import path from 'node:path';

export async function writeFile(absolutePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, content, 'utf-8');
}
