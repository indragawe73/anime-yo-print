import StarIcon from '@mui/icons-material/Star';
import TvIcon from '@mui/icons-material/Tv';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { AnimeListItem } from '../types/anime';

interface Props {
  anime: AnimeListItem;
}

const imageFallback =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const labelChipSx = {
  bgcolor: 'rgba(148,163,184,0.14)',
  color: '#e2e8f0',
  borderColor: 'rgba(148,163,184,0.24)',
};

export function AnimeCard({ anime }: Props) {
  const imageUrl =
    anime.images.webp?.large_image_url ??
    anime.images.webp?.image_url ??
    anime.images.jpg.large_image_url ??
    anime.images.jpg.image_url ??
    imageFallback;

  return (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, rgba(21,27,52,0.92) 0%, rgba(10,12,28,0.92) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.18)',
        boxShadow: '0 30px 55px rgba(5, 8, 28, 0.45)',
        overflow: 'hidden',
      }}
      elevation={0}
    >
      <CardActionArea
        component={RouterLink}
        to={`/anime/${anime.mal_id}`}
        sx={{
          height: '100%',
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={anime.title}
          sx={{
            height: 260,
            objectFit: 'cover',
            width: '100%',
            borderBottom: '1px solid rgba(99,102,241,0.2)',
          }}
          loading="lazy"
        />
        <CardContent
          sx={{
            flexGrow: 1,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            color: '#e2e8f0',
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="h6"
              component="h3"
              noWrap
              title={anime.title}
              sx={{ fontWeight: 700, letterSpacing: 0.3 }}
            >
              {anime.title}
            </Typography>
            {anime.synopsis && (
              <Typography
                variant="body2"
                sx={{
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 3,
                  minHeight: '3.6em',
                  color: 'rgba(226,232,240,0.72)',
                }}
              >
                {anime.synopsis}
              </Typography>
            )}
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
              {typeof anime.score === 'number' && (
                <Chip
                  size="small"
                  color="secondary"
                  icon={<StarIcon fontSize="inherit" />}
                  label={Number(anime.score).toFixed(1)}
                  sx={{
                    px: 0.5,
                    bgcolor: 'rgba(99,102,241,0.15)',
                    color: '#c7d2fe',
                    '& .MuiChip-icon': {
                      color: '#f9fafb',
                    },
                  }}
                />
              )}
              {typeof anime.episodes === 'number' && (
                <Chip
                  size="small"
                  icon={<TvIcon fontSize="inherit" />}
                  label={`${anime.episodes} eps`}
                  sx={labelChipSx}
                />
              )}
              {anime.year && (
                <Chip
                  size="small"
                  icon={<CalendarMonthIcon fontSize="inherit" />}
                  label={anime.year}
                  sx={labelChipSx}
                />
              )}
              {anime.type && (
                <Chip
                  size="small"
                  label={anime.type}
                  variant="outlined"
                  sx={{
                    ...labelChipSx,
                    borderStyle: 'solid',
                  }}
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
        <Box sx={{ height: 8 }} />
      </CardActionArea>
    </Card>
  );
}

