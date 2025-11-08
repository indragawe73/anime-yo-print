import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Box, Button, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { clearDetail, loadAnimeDetail, selectAnimeDetail } from '../features/anime/animeSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

const posterFallback =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const AnimeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector(selectAnimeDetail);

  useEffect(() => {
    if (!id) return;
    const parsedId = Number(id);
    if (Number.isNaN(parsedId)) return;
    dispatch(clearDetail());
    const promise = dispatch(loadAnimeDetail({ id: parsedId }));
    return () => promise.abort();
  }, [dispatch, id]);

  const isLoading = status === 'loading';

  const featurePoster = useMemo(() => {
    if (!data) return posterFallback;
    return (
      data.images.webp?.large_image_url ??
      data.images.jpg.large_image_url ??
      data.images.jpg.image_url ??
      posterFallback
    );
  }, [data]);

  const infoChips = useMemo((): string[] => {
    if (!data) return [];
    const chips: string[] = [];
    if (typeof data.score === 'number') chips.push(`Score ${data.score.toFixed(1)}`);
    if (data.episodes) chips.push(`${data.episodes} Episodes`);
    if (data.duration) chips.push(data.duration);
    if (data.status) chips.push(data.status);
    if (data.rating) chips.push(data.rating);
    return chips;
  }, [data]);

  const relatedGallery = useMemo(() => {
    if (!data?.relations) return [];
    return data.relations.flatMap((relation) => relation.entry ?? []).slice(0, 3);
  }, [data]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(140% 120% at 100% 0%, rgba(79,70,229,0.28) 0%, rgba(15,23,42,0) 60%), radial-gradient(120% 140% at -10% 10%, rgba(236,72,153,0.32) 0%, rgba(15,23,42,0) 55%), linear-gradient(180deg, #050615 0%, #090b1f 60%, #050615 100%)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ alignSelf: 'flex-start', color: '#cbd5f5' }}
          >
            Back
          </Button>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={48} thickness={5} />
            </Box>
          )}

          {error && (
            <Box
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: 'rgba(239,68,68,0.18)',
                border: '1px solid rgba(248,113,113,0.3)',
                color: '#fecaca',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Unable to load anime details
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          {!isLoading && !error && data && (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: { xs: 4, md: 6 },
                background:
                  'linear-gradient(120deg, rgba(20,24,45,0.92) 15%, rgba(15,18,36,0.95) 60%, rgba(30,34,62,0.9) 100%)',
                border: '1px solid rgba(99,102,241,0.22)',
                boxShadow: '0 55px 95px rgba(5, 8, 30, 0.65)',
                px: { xs: 3, md: 6 },
                py: { xs: 4, md: 6 },
              }}
            >
              <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="h2"
                        sx={{
                          fontWeight: 800,
                          lineHeight: 1.05,
                          fontSize: { xs: '2.4rem', md: '3.2rem' },
                          color: '#f8f9ff',
                        }}
                      >
                        {data.title}
                      </Typography>
                      {data.title_english && data.title_english !== data.title && (
                        <Typography
                          variant="subtitle1"
                          sx={{ color: 'rgba(203,213,225,0.8)', mt: 0.5 }}
                        >
                          {data.title_english}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" rowGap={1}>
                        {infoChips.map((chip) => (
                          <Chip
                            key={chip}
                            icon={chip.includes('Score') ? <StarIcon fontSize="small" /> : undefined}
                            label={chip}
                            sx={{
                              bgcolor: 'rgba(99,102,241,0.2)',
                              color: '#e0e7ff',
                              borderRadius: '999px',
                              '& .MuiChip-icon': {
                                color: '#fde68a',
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {data.synopsis && (
                      <Typography variant="body1" sx={{ color: 'rgba(226,232,240,0.78)', lineHeight: 1.7 }}>
                        {data.synopsis}
                      </Typography>
                    )}

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      {data.trailer?.url && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PlayArrowIcon />}
                          href={data.trailer.url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            minWidth: 180,
                            fontWeight: 700,
                            borderRadius: '999px',
                            textTransform: 'none',
                          }}
                        >
                          Watch Trailer
                        </Button>
                      )}
                      {data.url && (
                        <Button
                          variant="outlined"
                          startIcon={<PublicIcon />}
                          href={data.url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            minWidth: 180,
                            fontWeight: 700,
                            borderRadius: '999px',
                            textTransform: 'none',
                            borderColor: 'rgba(148,163,184,0.35)',
                            color: '#e2e8f0',
                            '&:hover': {
                              borderColor: '#6366f1',
                              color: '#c7d2fe',
                              backgroundColor: 'rgba(99,102,241,0.15)',
                            },
                          }}
                        >
                          Visit MyAnimeList
                        </Button>
                      )}
                    </Stack>

                    <Stack spacing={1.5}>
                      {data.studios && data.studios.length > 0 && (
                        <Typography sx={{ color: 'rgba(226,232,240,0.75)' }}>
                          <strong>Studio:</strong> {data.studios.map((s) => s.name).join(', ')}
                        </Typography>
                      )}
                      {data.producers && data.producers.length > 0 && (
                        <Typography sx={{ color: 'rgba(226,232,240,0.75)' }}>
                          <strong>Producers:</strong> {data.producers.map((s) => s.name).join(', ')}
                        </Typography>
                      )}
                      {data.premiered && (
                        <Typography sx={{ color: 'rgba(226,232,240,0.75)' }}>
                          <strong>Premiered:</strong> {data.premiered}
                        </Typography>
                      )}
                      {data.aired?.string && (
                        <Typography sx={{ color: 'rgba(226,232,240,0.75)' }}>
                          <strong>Aired:</strong> {data.aired.string}
                        </Typography>
                      )}
                      {data.source && (
                        <Typography sx={{ color: 'rgba(226,232,240,0.75)' }}>
                          <strong>Source:</strong> {data.source}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 320,
                        height: 320,
                        borderRadius: '50%',
                        filter: 'blur(120px)',
                        background: 'rgba(99,102,241,0.45)',
                        opacity: 0.6,
                        transform: 'translate(-10%, -10%)',
                      }}
                    />
                    <Box
                      component="img"
                      src={featurePoster}
                      alt={data.title}
                      loading="lazy"
                      sx={{
                        position: 'relative',
                        width: { xs: '80%', md: '90%' },
                        borderRadius: 5,
                        boxShadow: '0 45px 80px rgba(12,16,42,0.65)',
                        border: '1px solid rgba(148,163,184,0.25)',
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {(data.genres?.length || data.themes?.length) && (
                <Stack spacing={1.5} mt={6}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(226,232,240,0.72)' }}>
                    Tags &amp; Mood
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1.2}>
                    {data.genres?.map((genre) => (
                      <Chip
                        key={genre.name}
                        label={genre.name}
                        sx={{
                          bgcolor: 'rgba(59,130,246,0.18)',
                          color: '#bfdbfe',
                          borderRadius: '999px',
                        }}
                      />
                    ))}
                    {data.themes?.map((theme) => (
                      <Chip
                        key={theme.name}
                        label={theme.name}
                        sx={{
                          bgcolor: 'rgba(236,72,153,0.2)',
                          color: '#fbcfe8',
                          borderRadius: '999px',
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
              )}

              {relatedGallery.length > 0 && (
                <Box mt={6}>
                  <Typography variant="subtitle2" sx={{ color: '#cbd5f5', mb: 2 }}>
                    Check other anime connected to this title
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2}>
                    {relatedGallery.map((entry) => (
                      <Button
                        key={entry?.mal_id ?? `${entry?.name ?? 'related'}-${entry?.type ?? 'anime'}`}
                        component="a"
                        href={
                          entry?.mal_id
                            ? `https://myanimelist.net/anime/${entry.mal_id}`
                            : 'https://myanimelist.net/anime'
                        }
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: 1,
                          width: 180,
                          textTransform: 'none',
                          color: '#f1f5f9',
                          bgcolor: 'rgba(15,23,42,0.6)',
                          borderRadius: 3,
                          border: '1px solid rgba(148,163,184,0.18)',
                          p: 2,
                          boxShadow: '0 25px 45px rgba(5,8,28,0.45)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 35px 55px rgba(5,8,28,0.6)',
                          },
                        }}
                      >
                        <TheatersIcon sx={{ color: '#facc15' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'left' }}>
                          {entry?.name ?? 'Related Title'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.6)' }}>
                          {entry?.type ?? 'Anime'}
                        </Typography>
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default AnimeDetailPage;
