import { runUpdateFlow } from '../flows/update-flow.js';

export async function runUpdate(): Promise<void> {
  await runUpdateFlow();
}
