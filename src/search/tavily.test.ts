import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tavilySearch, TavilyError } from './tavily.js';

describe('tavilySearch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('handles successful search and maps fields correctly', async () => {
    const mockResponse = {
      results: [
        { title: 'Result 1', url: 'https://foo.com', content: 'bar', score: 0.9, published_date: '2025-01-01' }
      ]
    };
    (global.fetch as any).mockResolvedValue({
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

  it('maps HTTP 401 to AUTH_INVALID', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false, status: 401 });
    await expect(tavilySearch('q', 'k')).rejects.toThrowError(TavilyError);
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'AUTH_INVALID', httpStatus: 401 });
  });

  it('maps HTTP 429 to RATE_LIMITED', async () => {
    (global.fetch as any).mockResolvedValue({ ok: false, status: 429 });
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('throws NETWORK_ERROR on fetch failure', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network disconnected'));
    await expect(tavilySearch('q', 'k')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
});
