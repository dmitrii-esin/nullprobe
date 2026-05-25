import { describe, it, expect, vi } from 'vitest';
import { enrichQuery, searchGitHub, RateLimitError } from './github.js';

vi.mock('@octokit/rest', () => {
  const Octokit = vi.fn();
  Octokit.prototype.search = {
    repos: vi.fn(),
    code: vi.fn(),
  };
  return { Octokit };
});
import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';

describe('github search', () => {
  it('enrichQuery passes through if AI terms present', () => {
    expect(enrichQuery('cursor rules')).toBe('cursor rules');
    expect(enrichQuery('claude stuff')).toBe('claude stuff');
  });

  it('enrichQuery appends disjunction if no AI terms', () => {
    const q = enrichQuery('memory management');
    expect(q).toContain('memory management');
    expect(q).toContain('cursor');
    expect(q).toContain('"ai assistant"');
  });

  it('searchGitHub throws RateLimitError on 403', async () => {
    const mockOctokit = new Octokit();
    (mockOctokit.search.repos as any).mockRejectedValue(new RequestError('rate limit', 403, { request: { method: 'GET', url: '', headers: {} } } as any));
    (mockOctokit.search.code as any).mockResolvedValue({ data: { items: [] } });

    await expect(searchGitHub('test query')).rejects.toThrow(RateLimitError);
  });
});
