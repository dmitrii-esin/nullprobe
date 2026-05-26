import type { ExtraMcpId, McpConfig, McpServerEntry } from '../../types.js';

// Default MCP shipped on every nullprobe init: context7.
// API key is sourced from the user's shell env (CONTEXT7_API_KEY).
const CONTEXT7: McpServerEntry = {
  command: 'npx',
  args: ['-y', '@upstash/context7-mcp', '--api-key', '${CONTEXT7_API_KEY}'],
};

// Optional MCPs — opted-in via the init flow's "Customize MCPs?" step.
// Keep entries here lean and dev-server agnostic; secrets must come from env.
const EXTRA_MCP_REGISTRY: Record<ExtraMcpId, McpServerEntry> = {
  shadcn: {
    command: 'npx',
    args: ['shadcn@latest', 'mcp'],
  },
  'chrome-devtools': {
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp'],
  },
  github: {
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_PERSONAL_ACCESS_TOKEN}' },
  },
};

export const EXTRA_MCP_CHOICES: Array<{ id: ExtraMcpId; label: string; description: string }> = [
  { id: 'shadcn', label: 'shadcn', description: 'shadcn/ui component registry — UI scaffolding' },
  { id: 'chrome-devtools', label: 'chrome-devtools', description: 'Chrome DevTools MCP — browser debugging from the AI' },
  { id: 'github', label: 'github', description: 'GitHub MCP — repo/issue/PR access (needs GITHUB_PERSONAL_ACCESS_TOKEN)' },
];

export function buildMcpConfig(extras: ExtraMcpId[]): string {
  const servers: Record<string, McpServerEntry> = { context7: CONTEXT7 };
  for (const id of extras) {
    const entry = EXTRA_MCP_REGISTRY[id];
    if (entry) servers[id] = entry;
  }
  const config: McpConfig = { mcpServers: servers };
  return JSON.stringify(config, null, 2) + '\n';
}
