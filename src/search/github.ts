/**
 * src/search/github.ts
 *
 * GitHub search for AI tooling repos and config files.
 *
 * Two Octokit calls per query:
 *   1. search.repos  — finds repos whose name/description/topics match
 *   2. search.code   — finds AI config files (CLAUDE.md, .cursorrules, etc.)
 *                       inside repos that wouldn't surface in repo search alone
 *
 * Rate limits (unauthenticated): 60 req/hr, burst ~10 req/min for search.
 * Set GITHUB_TOKEN in the environment to raise this to 30 req/min / 5000 req/hr.
 */

import { Octokit } from '@octokit/rest';
import { RequestError } from '@octokit/request-error';

// ─── Public types ─────────────────────────────────────────────────────────────

/**
 * Unified result shape — matches any future Tavily / web-search provider.
 * content: repo description → topics → empty string (no extra API calls).
 */
export interface SearchResult {
  title: string;   // e.g. "rohitg00/agentmemory"
  url: string;     // e.g. "https://github.com/rohitg00/agentmemory"
  content: string; // human-readable summary
}

/** Thrown when GitHub returns 403/429 with a depleted quota. */
export class RateLimitError extends Error {
  constructor(
    message = 'GitHub rate limit reached. Wait ~1 minute or set GITHUB_TOKEN in your environment.',
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Disjunctive AI-context terms appended to general queries.
 * Disjunction (OR) preserves recall — AND would miss repos where the user's
 * term appears only inside a CLAUDE.md section heading.
 */
const AI_CONTEXT_TERMS = [
  'claude',
  'cursor',
  'ai assistant',
  'llm',
  'system prompt',
  'ai rules',
  'ai coding',
];

/**
 * Filenames that reliably signal an AI tooling config file.
 * Code search requires at least one filename/path/extension qualifier;
 * these also make every hit directly actionable.
 */
const AI_CONFIG_FILENAMES = [
  'CLAUDE.md',
  '.cursorrules',
  'AI_FRAMEWORK.md',
  '.windsurfrules',
  'AGENTS.md',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Enrich a raw query for repo search by appending an AI-context disjunction.
 * Queries that already contain a signal term (e.g. "cursor rules") pass through.
 *
 * "memory management" →
 *   'memory management (claude OR cursor OR "ai assistant" OR ...)'
 */
export function enrichQuery(raw: string): string {
  const lower = raw.toLowerCase();
  const alreadySpecific = AI_CONTEXT_TERMS.some((t) => lower.includes(t));
  if (alreadySpecific) return raw;

  // Wrap multi-word terms in quotes for phrase matching
  const disjunction = AI_CONTEXT_TERMS.map((t) =>
    t.includes(' ') ? `"${t}"` : t,
  ).join(' OR ');

  return `${raw} (${disjunction})`;
}

/** True when err is an Octokit rate-limit response. */
function isRateLimited(err: unknown): boolean {
  if (err instanceof RequestError) {
    if (err.status === 403 || err.status === 429) return true;
    if (err.message.toLowerCase().includes('rate limit')) return true;
  }
  return false;
}

// ─── Search functions ─────────────────────────────────────────────────────────

async function searchRepos(
  octokit: Octokit,
  raw: string,
  limit: number,
): Promise<SearchResult[]> {
  let data;
  try {
    ({ data } = await octokit.search.repos({
      q: enrichQuery(raw),
      sort: 'stars',
      order: 'desc',
      per_page: limit,
    }));
  } catch (err) {
    if (isRateLimited(err)) throw new RateLimitError();
    return []; // network / bad query — let code search still run
  }

  return data.items.map((item) => ({
    title: item.full_name,
    url: item.html_url,
    content: item.description ?? item.topics?.join(', ') ?? '',
  }));
}

async function searchCode(
  octokit: Octokit,
  raw: string,
  limit: number,
): Promise<SearchResult[]> {
  const filenameClause = AI_CONFIG_FILENAMES.map((f) => `filename:${f}`).join(' OR ');
  const phrase = raw.includes('"') ? raw : `"${raw}"`;
  const q = `${phrase} in:file ${filenameClause}`;

  let data;
  try {
    ({ data } = await octokit.search.code({ q, per_page: limit }));
  } catch (err) {
    if (isRateLimited(err)) throw new RateLimitError();
    return [];
  }

  return data.items.map((item) => {
    const repo = item.repository;
    const fileHint = `Found in ${item.name} (${item.path})`;
    const desc = repo.description ?? '';
    return {
      title: repo.full_name,
      url: repo.html_url,
      content: desc ? `${desc} — ${fileHint}` : fileHint,
    };
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface GitHubSearchOptions {
  /** Token source: explicit value → GITHUB_TOKEN env var → unauthenticated. */
  token?: string;
  /** Max results per search type before deduplication. Default 10. */
  perPage?: number;
}

/**
 * Search GitHub for AI tooling repos and config files matching `query`.
 *
 * Runs repo search and code search in parallel, deduplicates by html_url
 * (repo results win when a URL appears in both), and returns a flat array.
 *
 * @throws RateLimitError if GitHub returns 403/429 with empty quota
 *
 * @example
 *   const results = await searchGitHub('memory management');
 *   for (const r of results) console.log(r.title, r.url, r.content);
 */
export async function searchGitHub(
  query: string,
  opts: GitHubSearchOptions = {},
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const token = opts.token ?? process.env['GITHUB_TOKEN'];
  const perPage = opts.perPage ?? 10;
  const octokit = new Octokit(token ? { auth: token } : {});

  const [repoResults, codeResults] = await Promise.all([
    searchRepos(octokit, query, perPage),
    searchCode(octokit, query, perPage),
  ]);

  // Repo results lead; code results fill in repos not already present.
  const seen = new Set<string>();
  const merged: SearchResult[] = [];

  for (const r of [...repoResults, ...codeResults]) {
    if (!seen.has(r.url)) {
      seen.add(r.url);
      merged.push(r);
    }
  }

  return merged;
}
