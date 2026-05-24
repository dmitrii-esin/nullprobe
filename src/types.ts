export type AIPlatform = 'claude' | 'cursor' | 'gemini-cli' | 'antigravity';

export interface InitAnswers {
  platform: AIPlatform;
  targetPath: string;
  installSkill: boolean;
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
