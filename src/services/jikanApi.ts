import type {
  AnimeEntity,
  AnimeSearchPagination,
  AnimeSearchResponse,
} from '../types/anime';

const BASE_URL = 'https://api.jikan.moe/v4';

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

const emptyPagination = (perPage: number): AnimeSearchPagination => ({
  current_page: 1,
  has_next_page: false,
  last_visible_page: 1,
  items: {
    count: 0,
    total: 0,
    per_page: perPage,
  },
});

export async function fetchAnimeSearch({
  query,
  page = 1,
  limit = 12,
  signal,
}: SearchParams): Promise<AnimeSearchResponse> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      data: [],
      pagination: emptyPagination(limit),
    };
  }

  const url = new URL(`${BASE_URL}/anime`);
  url.searchParams.set('q', trimmedQuery);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('order_by', 'score');
  url.searchParams.set('sort', 'desc');

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch anime. Status ${response.status}: ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as AnimeSearchResponse;
  return payload;
}

interface AnimeDetailParams {
  id: number;
  signal?: AbortSignal;
}

export async function fetchAnimeDetail({
  id,
  signal,
}: AnimeDetailParams): Promise<AnimeEntity> {
  const url = `${BASE_URL}/anime/${id}/full`;

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch anime detail. Status ${response.status}: ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as { data: AnimeEntity };
  return payload.data;
}

export async function fetchCurrentSeasonAnime(limit = 12, signal?: AbortSignal) {
  const url = new URL(`${BASE_URL}/seasons/now`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sfw', 'true');

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch seasonal anime. Status ${response.status}: ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as AnimeSearchResponse;
  return payload.data;
}

