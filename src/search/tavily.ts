export interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  publishedDate?: string;
}

export type TavilyErrorCode =
  | 'AUTH_INVALID'
  | 'QUOTA_EXHAUSTED'
  | 'AUTH_FORBIDDEN'
  | 'BAD_REQUEST'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR';

export class TavilyError extends Error {
  constructor(
    public code: TavilyErrorCode,
    message: string,
    public httpStatus: number,
  ) {
    super(message);
    this.name = 'TavilyError';
  }
}

interface TavilyApiResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyApiResponse {
  results: TavilyApiResult[];
}

// Reads a fetch Response body with an enforced timeout so a server that returns
// headers but stalls the body cannot block indefinitely.
async function readJsonWithTimeout<T>(response: Response, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new TavilyError('NETWORK_ERROR', `Response body timeout after ${ms}ms`, 0)), ms),
  );
  return Promise.race([response.json() as Promise<T>, timeout]);
}

export async function tavilySearch(
  query: string,
  apiKey: string,
): Promise<TavilyResult[]> {
  let response: Response;
  try {
    response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, search_depth: 'basic', max_results: 7 }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'unknown';
    throw new TavilyError('NETWORK_ERROR', `Network error: ${reason}`, 0);
  }

  if (!response.ok) {
    const code = httpStatusToCode(response.status);
    throw new TavilyError(code, `HTTP ${response.status}`, response.status);
  }

  const data = await readJsonWithTimeout<TavilyApiResponse>(response, 10_000);
  return data.results.map((r) => ({
    title: r.title,
    url: r.url,
    content: r.content,
    score: r.score,
    publishedDate: r.published_date,
  }));
}

function httpStatusToCode(status: number): TavilyErrorCode {
  switch (status) {
    case 401: return 'AUTH_INVALID';
    case 402: return 'QUOTA_EXHAUSTED';
    case 403: return 'AUTH_FORBIDDEN';
    case 422: return 'BAD_REQUEST';
    case 429: return 'RATE_LIMITED';
    default:
      if (status >= 500 && status <= 504) return 'SERVER_ERROR';
      return 'SERVER_ERROR';
  }
}
