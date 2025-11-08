export interface AnimeImageVariant {
  image_url: string;
  small_image_url?: string;
  large_image_url?: string;
}

export interface AnimeImages {
  jpg: AnimeImageVariant;
  webp?: AnimeImageVariant;
}

export interface AnimeListItem {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis?: string;
  score?: number;
  year?: number;
  episodes?: number;
  status?: string;
  type?: string;
  images: AnimeImages;
}

export interface AnimeSearchPaginationItems {
  count: number;
  total: number;
  per_page: number;
}

export interface AnimeSearchPagination {
  current_page: number;
  has_next_page: boolean;
  last_visible_page: number;
  items: AnimeSearchPaginationItems;
}

export interface AnimeSearchResponse {
  data: AnimeListItem[];
  pagination: AnimeSearchPagination;
}

export interface AnimeTrailer {
  youtube_id?: string;
  url?: string;
  embed_url?: string;
  images?: {
    image_url?: string;
    small_image_url?: string;
    medium_image_url?: string;
    large_image_url?: string;
    maximum_image_url?: string;
  };
}

export interface AnimeEntity extends AnimeListItem {
  url?: string;
  background?: string;
  duration?: string;
  rating?: string;
  source?: string;
  trailer?: AnimeTrailer;
  synopsis?: string;
  score?: number;
  episodes?: number;
  year?: number;
  genres?: { name: string }[];
  themes?: { name: string }[];
  studios?: { name: string }[];
  producers?: { name: string }[];
  licensors?: { name: string }[];
  popularity?: number;
  members?: number;
  favorites?: number;
  premiered?: string;
  aired?: {
    string?: string;
    from?: string;
    to?: string | null;
  };
  relations?: Array<{
    relation: string;
    entry?: Array<{
      mal_id: number;
      name: string;
      type: string;
      url?: string;
    }>;
  }>;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
}

