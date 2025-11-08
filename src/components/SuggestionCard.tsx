import StarIcon from '@mui/icons-material/Star';
import { Box, Chip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { AnimeListItem } from '../types/anime';

const gradients = [
  'linear-gradient(180deg, #2b205f 0%, #6d34d2 60%, #f59e0b 120%)',
  'linear-gradient(180deg, #1c3faa 0%, #2563eb 60%, #38bdf8 120%)',
  'linear-gradient(180deg, #064e3b 0%, #0f766e 60%, #34d399 120%)',
  'linear-gradient(180deg, #6b21a8 0%, #a855f7 60%, #f472b6 120%)',
  'linear-gradient(180deg, #7c2d12 0%, #b45309 60%, #f97316 120%)',
];

interface SuggestionCardProps {
  anime: AnimeListItem;
  index: number;
}

const fallbackImage =
  'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

const truncate = (value: string, max = 120) =>
  value.length > max ? `${value.slice(0, max).trim()}…` : value;

export function SuggestionCard({ anime, index }: SuggestionCardProps) {
  const gradient = gradients[index % gradients.length];

  const imageUrl =
    anime.images.webp?.large_image_url ??
    anime.images.webp?.image_url ??
    anime.images.jpg.large_image_url ??
    anime.images.jpg.image_url ??
    fallbackImage;

  const synopsis =
    anime.synopsis && anime.synopsis.trim().length > 0
      ? truncate(anime.synopsis, 140)
      : 'Synopsis not available yet. Discover it on the detail page!';

  const scoreLabel =
    typeof anime.score === 'number' && !Number.isNaN(anime.score)
      ? anime.score.toFixed(1)
      : 'N/A';

  const yearLabel = anime.year ?? 'Unknown';
  const typeLabel = anime.type ?? 'Unknown';

  return (
    <Box
      component={RouterLink}
      to={`/anime/${anime.mal_id}`}
      sx={{
        textDecoration: 'none',
        display: 'inline-flex',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: 220, sm: 240, md: 250 },
          height: { xs: 320, sm: 360, md: 380 },
          borderRadius: 6,
          overflow: 'hidden',
          background: gradient,
          color: '#fff',
          boxShadow: '0 18px 38px rgba(15, 15, 40, 0.35)',
          px: 3,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 26px 55px rgba(15, 15, 55, 0.45)',
          },
          '&:hover .suggestion-overlay': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.8 }}>
            {typeLabel}
          </Typography>
          <Chip
            size="small"
            icon={<StarIcon fontSize="small" />}
            label={scoreLabel}
            sx={{
              bgcolor: 'rgba(255,255,255,0.18)',
              color: '#fff',
              '& .MuiChip-icon': {
                color: '#fde68a',
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            src={imageUrl}
            alt={anime.title}
            loading="lazy"
            sx={{
              width: '110%',
              maxHeight: '96%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 18px 25px rgba(15, 15, 35, 0.45))',
              transform: 'translateY(12px)',
              borderRadius: 6,
            }}
          />
        </Box>

        <Box
          className="suggestion-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,15,40,0.85) 0%, rgba(10,10,25,0.95) 100%)',
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.5,
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
            Featured Anime
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              lineHeight: 1.15,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {anime.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {synopsis}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              size="small"
              icon={<StarIcon fontSize="small" />}
              label={`Score ${scoreLabel}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff' }}
            />
            <Chip
              size="small"
              label={`Year ${yearLabel}`}
              sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}
            />
            <Chip
              size="small"
              label={typeLabel}
              sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

