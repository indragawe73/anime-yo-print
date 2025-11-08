import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Container, Pagination, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import { AnimeCard } from '../components/AnimeCard';
import { SearchBar } from '../components/SearchBar';
import { SuggestionCarousel } from '../components/SuggestionCarousel';
import {
  clearSearchResults,
  loadAnimeSearch,
  loadAnimeSuggestions,
  selectAnimeSearch,
  selectAnimeSuggestions,
  setSearchPage,
  setSearchQuery,
} from '../features/anime/animeSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const SearchPage = () => {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector(selectAnimeSearch);
  const suggestionState = useAppSelector(selectAnimeSuggestions);
  const { items, status, error, total, totalPages, page, query } = searchState;

  const [searchTerm, setSearchTerm] = useState(query);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const [heroContentHeight, setHeroContentHeight] = useState<number>(0);
  const debouncedQuery = useDebouncedValue(searchTerm, 250);
  const showSuggestions = !debouncedQuery.trim();

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery === query) {
      return;
    }
    dispatch(setSearchQuery(debouncedQuery));
  }, [debouncedQuery, dispatch, query]);

  const lastRequestedRef = useRef<{ query: string; page: number } | null>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      lastRequestedRef.current = null;
      dispatch(clearSearchResults());
      return;
    }

    if (
      lastRequestedRef.current &&
      lastRequestedRef.current.query === trimmed &&
      lastRequestedRef.current.page === page
    ) {
      return;
    }

    const promise = dispatch(loadAnimeSearch({ query: trimmed, page }));
    lastRequestedRef.current = { query: trimmed, page };
    return () => {
      promise.abort();
    };
  }, [debouncedQuery, page, dispatch]);

  useEffect(() => {
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

  useEffect(() => {
    if (!showSuggestions) {
      return;
    }

    if (suggestionState.items.length > 0 || suggestionState.status === 'loading') {
      return;
    }

    void dispatch(loadAnimeSuggestions());
  }, [dispatch, showSuggestions, suggestionState.items.length, suggestionState.status]);

  useEffect(() => {
    const measure = () => {
      if (heroContentRef.current) {
        setHeroContentHeight(heroContentRef.current.scrollHeight);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!isSearchFocused && heroContentRef.current) {
      setHeroContentHeight(heroContentRef.current.scrollHeight);
    }
  }, [isSearchFocused]);

  const isLoading = status === 'loading';
  const hasResults = items.length > 0;
  const showEmptyState = !isLoading && !hasResults && !error && !!debouncedQuery.trim();
  const isSuggestionLoading = suggestionState.status === 'loading';
  const suggestionError = suggestionState.status === 'failed' ? suggestionState.error : null;

  const isInitialView = showSuggestions && !hasResults && !isLoading;

  const heroSectionSx = isInitialView
    ? {
        py: { xs: 6, sm: 7, md: 8 },
        minHeight: { xs: 'auto', md: '52vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }
    : {};

  return (
    <Container
      maxWidth={false}
      sx={{
        py: { xs: 5, md: 6 },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        px: { xs: 2, sm: 4, md: 8, lg: 10 },
      }}
    >
      <Stack spacing={6} sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 4, md: 6 },
            px: { xs: 3, sm: 6, md: 10 },
            py: { xs: 8, sm: 10, md: 12 },
            background:
              'radial-gradient(140% 160% at 90% -20%, rgba(56,189,248,0.35) 0%, rgba(30,64,175,0) 40%), radial-gradient(120% 140% at -20% 0%, rgba(236,72,153,0.35) 0%, rgba(30,64,175,0) 45%), linear-gradient(165deg, #09091d 0%, #101636 45%, #09091d 100%)',
            color: '#f8fafc',
            boxShadow: '0 55px 90px rgba(10, 10, 40, 0.45)',
            flexShrink: 0,
            ...heroSectionSx,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 320,
                height: 320,
                right: -120,
                top: -120,
                background: 'radial-gradient(circle, rgba(79,70,229,0.45) 0%, rgba(79,70,229,0) 70%)',
                filter: 'blur(10px)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 360,
                height: 360,
                left: -160,
                bottom: -160,
                background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0) 70%)',
                filter: 'blur(12px)',
              },
            }}
          />

          <Stack spacing={4} alignItems="center" textAlign="center" position="relative" zIndex={1}>
            <Box
              ref={heroContentRef}
              sx={{
                width: '100%',
                overflow: 'hidden',
                maxHeight: isSearchFocused
                  ? 0
                  : heroContentHeight
                  ? `${heroContentHeight}px`
                  : 'none',
                transition: 'max-height 0.55s ease 0.45s',
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                  transform: isSearchFocused ? 'translateY(-24px)' : 'translateY(0)',
                  opacity: isSearchFocused ? 0 : 1,
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.4rem', sm: '3rem', md: '3.6rem' },
                    lineHeight: 1.05,
                  }}
                >
                  Fun Anime Explorer
                  <Box component="span" sx={{ color: '#60a5fa' }}>
                    {' '}
                    Hub
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    maxWidth: 560,
                    mx: 'auto',
                    color: 'rgba(226,232,240,0.7)',
                    fontSize: { xs: '1rem', md: '1.05rem' },
                  }}
                >
                  Dive into our curated selection of anime. We continuously refresh the library so you can
                  discover hidden gems and beloved classics with ease.
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                width: '100%',
                maxWidth: isSearchFocused ? 780 : 640,
                transition: 'max-width 1s ease',
                borderRadius: { xs: 4, md: 6 },
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(14px)',
                padding: { xs: 1.5, sm: 2 },
                boxShadow: '0 35px 70px rgba(8, 8, 28, 0.55)',
              }}
            >
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                helperText="Start typing to search instantly. Results update as you type."
                variant="outlined"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '999px',
                    backgroundColor: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    px: { xs: 1, sm: 2.5 },
                    py: 0.75,
                    boxShadow: '0 24px 45px rgba(7, 10, 30, 0.55)',
                    transition: 'border 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.35)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#818cf8',
                      boxShadow: '0 28px 65px rgba(99,102,241,0.45)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#f8fafc',
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.05rem' },
                    letterSpacing: 0.3,
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#f8fafc',
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'rgba(226,232,240,0.7)',
                    fontSize: '0.85rem',
                    mt: 1.5,
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>

        {error && (
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {/* {showSuggestions && !isLoading && !hasResults && !error && (
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Start your search
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try searching for popular titles like &quot;Naruto&quot;, &quot;Attack on Titan&quot;,
              or &quot;Fullmetal Alchemist&quot;.
            </Typography>
          </Box>
        )} */}

        {showEmptyState && (
          <Box
            sx={{
              p: 4,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No anime found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We couldn&apos;t find any anime matching &quot;{debouncedQuery}&quot;. Try refining your
              keywords or check for typos.
            </Typography>
          </Box>
        )}

        {showSuggestions && suggestionError && (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <Typography variant="body2">
              We couldn&apos;t load the latest anime suggestions right now. Try searching for a
              specific title instead.
            </Typography>
          </Box>
        )}

        {showSuggestions && suggestionState.items.length > 0 && (
          <Stack
            spacing={3}
            sx={{
              position: 'relative',
              zIndex: 2,
              mt: isInitialView ? 2 : { xs: 4, md: -4 },
              px: { xs: 2, sm: 4 },
              py: { xs: 3, sm: 4 },
              borderRadius: { xs: 4, md: 5 },
              background:
                'linear-gradient(180deg, rgba(15,17,34,0.9) 0%, rgba(10,12,28,0.85) 100%), radial-gradient(140% 180% at 100% 0%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 60%)',
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 40px 65px rgba(5,8,28,0.55)',
              flexGrow: isInitialView ? 1 : 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={1}
            >
              <Typography variant="h4" fontWeight={800}>
                Fresh This Season
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(226,232,240,0.6)' }}>
                Discover what&apos;s airing right now while you search.
              </Typography>
            </Stack>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SuggestionCarousel items={suggestionState.items} maxItems={12} />
            </Box>
          </Stack>
        )}

        {showSuggestions && isSuggestionLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 4,
            }}
          >
            <CircularProgress size={36} thickness={5} />
          </Box>
        )}

        {hasResults && (
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Showing page {page} of {totalPages} &mdash; {total} results found.
            </Typography>
            <Grid container spacing={3}>
              {items.map((anime) => (
                <Grid
                  key={anime.mal_id}
                  size={{ xs: 6, sm: 6, md: 4 }}
                >
                  <AnimeCard anime={anime} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 6,
            }}
          >
            <CircularProgress size={48} thickness={5} />
          </Box>
        )}

        {hasResults && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
            <Pagination
              color="primary"
              shape="rounded"
              count={totalPages}
              page={page}
              onChange={(_, value) => dispatch(setSearchPage(value))}
            />
          </Box>
        )}
      </Stack>
    </Container>
  );
};

export default SearchPage;

