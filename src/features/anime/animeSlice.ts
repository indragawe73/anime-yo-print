import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  fetchAnimeDetail,
  fetchAnimeSearch,
  fetchCurrentSeasonAnime,
} from '../../services/jikanApi';
import type { AnimeEntity, AnimeListItem } from '../../types/anime';

const SEARCH_PAGE_SIZE = 12;

interface SearchState {
  query: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  items: AnimeListItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

interface DetailState {
  data?: AnimeEntity;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

interface AnimeState {
  search: SearchState;
  detail: DetailState;
  suggestions: {
    items: AnimeListItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
  };
}

const initialState: AnimeState = {
  search: {
    query: '',
    page: 1,
    pageSize: SEARCH_PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    items: [],
    status: 'idle',
  },
  detail: {
    status: 'idle',
  },
  suggestions: {
    items: [],
    status: 'idle',
  },
};

export const loadAnimeSearch = createAsyncThunk<
  {
    items: AnimeListItem[];
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    query: string;
    page: number;
  },
  { query: string; page?: number },
  { rejectValue: string }
>('anime/loadAnimeSearch', async ({ query, page = 1 }, { signal, rejectWithValue }) => {
  try {
    const result = await fetchAnimeSearch({
      query,
      page,
      limit: SEARCH_PAGE_SIZE,
      signal,
    });

    return {
      items: result.data,
      total: result.pagination.items.total ?? result.data.length,
      totalPages: result.pagination.last_visible_page,
      hasNextPage: result.pagination.has_next_page,
      query,
      page: result.pagination.current_page,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return rejectWithValue('aborted');
    }

    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to fetch anime list.',
    );
  }
});

export const loadAnimeDetail = createAsyncThunk<
  AnimeEntity,
  { id: number },
  { rejectValue: string }
>('anime/loadAnimeDetail', async ({ id }, { signal, rejectWithValue }) => {
  try {
    return await fetchAnimeDetail({ id, signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return rejectWithValue('aborted');
    }

    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to fetch anime detail.',
    );
  }
});

export const loadAnimeSuggestions = createAsyncThunk<
  AnimeListItem[],
  void,
  { rejectValue: string }
>('anime/loadAnimeSuggestions', async (_, { signal, rejectWithValue }) => {
  try {
    const items = await fetchCurrentSeasonAnime(12, signal);
    return items;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return rejectWithValue('aborted');
    }

    return rejectWithValue(
      error instanceof Error ? error.message : 'Unable to fetch seasonal anime.',
    );
  }
});

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.search.query = action.payload;
      state.search.page = 1;
    },
    setSearchPage(state, action: PayloadAction<number>) {
      state.search.page = action.payload;
    },
    clearSearchResults(state) {
      state.search.items = [];
      state.search.total = 0;
      state.search.totalPages = 0;
      state.search.hasNextPage = false;
      state.search.status = 'idle';
      state.search.error = undefined;
    },
    clearDetail(state) {
      state.detail.data = undefined;
      state.detail.status = 'idle';
      state.detail.error = undefined;
    },
    clearSuggestions(state) {
      state.suggestions.items = [];
      state.suggestions.status = 'idle';
      state.suggestions.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAnimeSearch.pending, (state) => {
        state.search.status = 'loading';
        state.search.error = undefined;
      })
      .addCase(loadAnimeSearch.fulfilled, (state, action) => {
        state.search.status = 'succeeded';
        state.search.items = action.payload.items;
        state.search.total = action.payload.total;
        state.search.totalPages = action.payload.totalPages;
        state.search.hasNextPage = action.payload.hasNextPage;
        state.search.query = action.payload.query;
        state.search.page = action.payload.page;
      })
      .addCase(loadAnimeSearch.rejected, (state, action) => {
        if (action.meta.aborted || action.payload === 'aborted') {
          state.search.status = 'idle';
          return;
        }
        state.search.status = 'failed';
        state.search.error =
          action.payload ?? action.error.message ?? 'Something went wrong.';
      })
      .addCase(loadAnimeDetail.pending, (state) => {
        state.detail.status = 'loading';
        state.detail.error = undefined;
      })
      .addCase(loadAnimeDetail.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.data = action.payload;
      })
      .addCase(loadAnimeDetail.rejected, (state, action) => {
        if (action.meta.aborted || action.payload === 'aborted') {
          state.detail.status = 'idle';
          return;
        }
        state.detail.status = 'failed';
        state.detail.error =
          action.payload ?? action.error.message ?? 'Unable to load anime detail.';
      })
      .addCase(loadAnimeSuggestions.pending, (state) => {
        state.suggestions.status = 'loading';
        state.suggestions.error = undefined;
      })
      .addCase(loadAnimeSuggestions.fulfilled, (state, action) => {
        state.suggestions.status = 'succeeded';
        state.suggestions.items = action.payload;
      })
      .addCase(loadAnimeSuggestions.rejected, (state, action) => {
        if (action.meta.aborted || action.payload === 'aborted') {
          state.suggestions.status = 'idle';
          return;
        }
        state.suggestions.status = 'failed';
        state.suggestions.error =
          action.payload ?? action.error.message ?? 'Unable to load suggestions.';
      });
  },
});

export const {
  setSearchQuery,
  setSearchPage,
  clearSearchResults,
  clearDetail,
  clearSuggestions,
} = animeSlice.actions;

export default animeSlice.reducer;

export const selectAnimeSearch = (state: { anime: AnimeState }) => state.anime.search;
export const selectAnimeDetail = (state: { anime: AnimeState }) => state.anime.detail;
export const selectAnimeSuggestions = (state: { anime: AnimeState }) =>
  state.anime.suggestions;

