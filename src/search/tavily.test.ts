import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tavilySearch, TavilyError } from './tavily.js';

describe('tavilySearch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('maps successful response and renames published_date → publishedDate', async () => {
    const mockResponse = {
      results: [
        { title: 'Result 1', url: 'https://foo.com', content: 'bar', score: 0.9, published_date: '2025-01-01' },
      ],
    };
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const results = await tavilySearch('query', 'api-key');
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      title: 'Result 1',
      url: 'https://foo.com',
      content: 'bar',
      score: 0.9,
      publishedDate: '2025-01-01',
    });
  });

  it('returns undefined publishedDate when published_date is absent', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ title: 'No date', url: 'https://foo.com', content: 'bar', score: 0.5 }],
      }),
    });

    const results = await tavilySearch('q', 'k');
    expect(results[0].publishedDate).toBeUndefined();
  });

  it('maps HTTP 401 to AUTH_INVALID', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 401 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'AUTH_INVALID', httpStatus: 401 });
  });

  it('maps HTTP 402 to QUOTA_EXHAUSTED', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 402 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'QUOTA_EXHAUSTED', httpStatus: 402 });
  });

  it('maps HTTP 403 to AUTH_FORBIDDEN', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 403 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'AUTH_FORBIDDEN', httpStatus: 403 });
  });

  it('maps HTTP 422 to BAD_REQUEST', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 422 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'BAD_REQUEST', httpStatus: 422 });
  });

  it('maps HTTP 429 to RATE_LIMITED', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 429 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('maps HTTP 500 to SERVER_ERROR', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 500 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'SERVER_ERROR', httpStatus: 500 });
  });

  it('maps unknown HTTP status to SERVER_ERROR', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 418 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'SERVER_ERROR', httpStatus: 418 });
  });

  it('throws NETWORK_ERROR on fetch failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network disconnected'));
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
});
