import { Octokit } from '@octokit/rest';
import type { CommitInfo, SourceRepo } from '../types.js';

const octokit = new Octokit();

export async function getLatestCommit(source: SourceRepo): Promise<CommitInfo | null> {
  try {
    if (source.gistId) {
      const res = await fetch(`https://api.github.com/gists/${source.gistId}`, {
        headers: { 'User-Agent': 'nullprobe-cli' },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        history: Array<{ version: string; committed_at: string }>;
      };
      if (!data.history?.length) return null;
      const latest = data.history[0];
      return {
        sourceId: source.id,
        latestSha: latest.version.slice(0, 7),
        latestDate: latest.committed_at,
        message: 'gist revision',
      };
    }

    const { data } = await octokit.repos.listCommits({
      owner: source.owner,
      repo: source.repo!,
      per_page: 1,
    });

    if (!data.length) return null;
    return {
      sourceId: source.id,
      latestSha: data[0].sha.slice(0, 7),
      latestDate: data[0].commit.author?.date ?? '',
      message: data[0].commit.message.split('\n')[0],
    };
  } catch {
    return null;
  }
}

export async function checkAllSources(
  sources: SourceRepo[]
): Promise<Array<{ source: SourceRepo; commit: CommitInfo | null }>> {
  const results: Array<{ source: SourceRepo; commit: CommitInfo | null }> = [];
  for (const source of sources) {
    const commit = await getLatestCommit(source);
    results.push({ source, commit });
  }
  return results;
}
