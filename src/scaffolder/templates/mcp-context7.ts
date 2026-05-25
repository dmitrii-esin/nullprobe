import type { McpConfig } from '../../types.js';

// The context7 MCP server entry that nullprobe deploys for Cursor and
// Antigravity/Gemini CLI projects. Stored as a typed object so TypeScript
// catches structural drift, then serialised once at module load time.
const CONFIG: McpConfig = {
  mcpServers: {
    context7: {
      command: 'npx',
      args: ['-y', '@upstash/context7-mcp@latest'],
    },
  },
};

export const MCP_CONTEXT7_CONFIG: string = JSON.stringify(CONFIG, null, 2) + '\n';
