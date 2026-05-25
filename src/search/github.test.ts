import { describe, it, expect, vi, beforeEach } from 'vitest';
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

const mockRepos = () => Octokit.prototype.search.repos as ReturnType<typeof vi.fn>;
const mockCode = () => Octokit.prototype.search.code as ReturnType<typeof vi.fn>;

const emptyRepos = { data: { items: [] } };
const emptyCode = { data: { items: [] } };

describe('enrichQuery', () => {
  it('passes through when AI terms present', () => {
    expect(enrichQuery('cursor rules')).toBe('cursor rules');
    expect(enrichQuery('claude stuff')).toBe('claude stuff');
  });

  it('appends disjunction when no AI terms present', () => {
    const q = enrichQuery('memory management');
    expect(q).toContain('memory management');
    expect(q).toContain('cursor');
    expect(q).toContain('"ai assistant"');
  });
});

describe('searchGitHub', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns empty array for blank query', async () => {
    expect(await searchGitHub('')).toEqual([]);
    expect(await searchGitHub('   ')).toEqual([]);
  });

  it('returns merged results from repos and code searches', async () => {
    mockRepos().mockResolvedValue({
      data: {
        items: [
          { full_name: 'user/repo1', html_url: 'https://github.com/user/repo1', description: 'A cool repo', topics: [] },
        ],
      },
    });
    mockCode().mockResolvedValue({
      data: {
        items: [
          {
            name: 'CLAUDE.md',
            path: 'CLAUDE.md',
            repository: { full_name: 'user/repo2', html_url: 'https://github.com/user/repo2', description: null },
          },
        ],
      },
    });

    const results = await searchGitHub('test query');
    expect(results).toHaveLength(2);
    expect(results[0].title).toBe('user/repo1');
    expect(results[0].content).toBe('A cool repo');
    expect(results[1].title).toBe('user/repo2');
    expect(results[1].content).toBe('Found in CLAUDE.md (CLAUDE.md)');
  });

  it('deduplicates when the same URL appears in both repos and code results', async () => {
    mockRepos().mockResolvedValue({
      data: {
        items: [
          { full_name: 'user/repo', html_url: 'https://github.com/user/repo', description: null, topics: ['ai'] },
        ],
      },
    });
    mockCode().mockResolvedValue({
      data: {
        items: [
          {
            name: 'CLAUDE.md',
            path: 'CLAUDE.md',
            repository: { full_name: 'user/repo', html_url: 'https://github.com/user/repo', description: 'cool' },
          },
        ],
      },
    });

    const results = await searchGitHub('test');
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('user/repo');
  });

  it('uses topics join when repo description is absent', async () => {
    mockRepos().mockResolvedValue({
      data: {
        items: [
          { full_name: 'u/r', html_url: 'https://github.com/u/r', description: undefined, topics: ['llm', 'agent'] },
        ],
      },
    });
    mockCode().mockResolvedValue(emptyCode);

    const results = await searchGitHub('test');
    expect(results[0].content).toBe('llm, agent');
  });

  it('uses empty string when both description and topics are absent', async () => {
    mockRepos().mockResolvedValue({
      data: {
        items: [
          { full_name: 'u/r', html_url: 'https://github.com/u/r', description: null, topics: undefined },
        ],
      },
    });
    mockCode().mockResolvedValue(emptyCode);

    const results = await searchGitHub('test');
    expect(results[0].content).toBe('');
  });

  it('includes description and file hint in code result when description present', async () => {
    mockRepos().mockResolvedValue(emptyRepos);
    mockCode().mockResolvedValue({
      data: {
        items: [
          {
            name: 'AGENTS.md',
            path: 'docs/AGENTS.md',
            repository: { full_name: 'u/r', html_url: 'https://github.com/u/r', description: 'My AI tool' },
          },
        ],
      },
    });

    const results = await searchGitHub('test');
    expect(results[0].content).toBe('My AI tool — Found in AGENTS.md (docs/AGENTS.md)');
  });

  it('does not double-quote a pre-quoted query in code search', async () => {
    mockRepos().mockResolvedValue(emptyRepos);
    mockCode().mockResolvedValue(emptyCode);

    await searchGitHub('"memory management"');
    const call = mockCode().mock.calls[0][0] as { q: string };
    expect(call.q).toContain('"memory management"');
    expect(call.q).not.toMatch(/^""/);
  });

  it('throws RateLimitError on 403 from repo search', async () => {
    mockRepos().mockRejectedValue(
      new RequestError('rate limit', 403, { request: { method: 'GET', url: '', headers: {} } } as any),
    );
    mockCode().mockResolvedValue(emptyCode);

    await expect(searchGitHub('test')).rejects.toThrow(RateLimitError);
  });

  it('throws RateLimitError on 429 from code search', async () => {
    mockRepos().mockResolvedValue(emptyRepos);
    mockCode().mockRejectedValue(
      new RequestError('rate limit', 429, { request: { method: 'GET', url: '', headers: {} } } as any),
    );

    await expect(searchGitHub('test')).rejects.toThrow(RateLimitError);
  });

  it('throws RateLimitError when RequestError message contains "rate limit"', async () => {
    mockRepos().mockRejectedValue(
      new RequestError('API rate limit exceeded for user', 200, { request: { method: 'GET', url: '', headers: {} } } as any),
    );
    mockCode().mockResolvedValue(emptyCode);

    await expect(searchGitHub('test')).rejects.toThrow(RateLimitError);
  });

  it('returns code results when a non-rate-limit error occurs in repo search', async () => {
    mockRepos().mockRejectedValue(new Error('generic network error'));
    mockCode().mockResolvedValue({
      data: {
        items: [
          {
            name: 'CLAUDE.md',
            path: 'CLAUDE.md',
            repository: { full_name: 'u/r', html_url: 'https://github.com/u/r', description: null },
          },
        ],
      },
    });

    const results = await searchGitHub('test');
    expect(results).toHaveLength(1);
  });
});
