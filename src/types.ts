export type AIPlatform = 'claude' | 'cursor' | 'gemini-cli' | 'antigravity';

export type ExtraMcpId = 'shadcn' | 'chrome-devtools' | 'github';

export type InitApproach = 'recommended' | 'specific' | 'search';

export interface InitAnswers {
  platform: AIPlatform;
  targetPath: string;
  approach: InitApproach;
  details: string;       // user-typed text when approach === 'specific'; empty otherwise
  extraMcps: ExtraMcpId[];
  // Optional QA protocols (off by default, per lightweight principle)
  includeProtocols?: boolean;
  protocolPriorities?: string[];  // 0-3 items captured when user opts in
}

export interface SourceRepo {
  id: string;
  label: string;
  owner: string;
  repo: string | null;
  gistId: string | null;
  description: string;
}

export interface CommitInfo {
  sourceId: string;
  latestSha: string;
  latestDate: string;
  message: string;
}

// ---------------------------------------------------------------------------
// MCP config types
// ---------------------------------------------------------------------------

export interface McpServerEntry {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface McpConfig {
  mcpServers: Record<string, McpServerEntry>;
}

// ---------------------------------------------------------------------------
// ExtraFile — a file the scaffolder should produce for a given platform.
//
// `ifExists: 'overwrite'`  — always write the full content (default for new files)
// `ifExists: 'merge-mcp'`  — content is a JSON McpConfig; merge its mcpServers
//                            into whatever already lives at the path, then write.
// ---------------------------------------------------------------------------

export type ExtraFile =
  | { relPath: string; content: string; ifExists: 'overwrite' }
  | { relPath: string; content: string; ifExists: 'merge-mcp' };
