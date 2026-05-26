import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';
import type { CommitInfo, SourceRepo } from '../types.js';
import { RateLimitError } from '../search/github.js';

const octokit = new Octokit();

function isRateLimited(err: unknown): boolean {
  if (err instanceof RequestError) {
    if (err.status === 403 || err.status === 429) return true;
    if (err.message.toLowerCase().includes('rate limit')) return true;
  }
  return false;
}

export async function getLatestCommit(source: SourceRepo): Promise<CommitInfo | null> {
  try {
    if (source.gistId) {
      const res = await fetch(`https://api.github.com/gists/${source.gistId}`, {
        headers: { 'User-Agent': 'nullprobe-cli' },
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        if (res.status === 403 || res.status === 429) throw new RateLimitError();
        return null;
      }
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
      request: { signal: AbortSignal.timeout(10_000) },
    });

    if (!data.length) return null;
    return {
      sourceId: source.id,
      latestSha: data[0].sha.slice(0, 7),
      latestDate: data[0].commit.author?.date ?? '',
      message: data[0].commit.message.split('\n')[0],
    };
  } catch (err) {
    if (err instanceof RateLimitError) throw err;
    if (isRateLimited(err)) throw new RateLimitError();
    return null;
  }
}

export async function checkAllSources(
  sources: SourceRepo[]
): Promise<Array<{ source: SourceRepo; commit: CommitInfo | null }>> {
  const results: Array<{ source: SourceRepo; commit: CommitInfo | null }> = [];
  for (const source of sources) {
    // Lets RateLimitError propagate — rate-limit is a global condition; if one
    // source hits it, the rest will too, so failing fast is more honest than
    // labeling every source [unreachable].
    const commit = await getLatestCommit(source);
    results.push({ source, commit });
  }
  return results;
}
