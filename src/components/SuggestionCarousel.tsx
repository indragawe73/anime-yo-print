import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import type { AnimeListItem } from '../types/anime';
import { SuggestionCard } from './SuggestionCard';

interface SuggestionCarouselProps {
  items: AnimeListItem[];
  maxItems?: number;
}

export function SuggestionCarousel({ items, maxItems = 10 }: SuggestionCarouselProps) {
  const theme = useTheme();
  const downSm = useMediaQuery(theme.breakpoints.down('sm'));
  const downMd = useMediaQuery(theme.breakpoints.down('md'));
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  const visibleCount = useMemo(() => {
    if (downSm) return 1;
    if (downMd) return 2;
    if (downLg) return 3;
    return 5;
  }, [downSm, downMd, downLg]);

  const [index, setIndex] = useState(0);

  const cappedItems = useMemo(() => items.slice(0, maxItems), [items, maxItems]);

  const maxIndex = Math.max(0, cappedItems.length - visibleCount);

  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [index, maxIndex]);

  const cardWidth = downSm ? 220 : downMd ? 240 : 252;
  const gap = downSm ? 14 : 26;
  const offset = (cardWidth + gap) * index;

  const handlePrev = () => {
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', pt: 1 }}>
      {cappedItems.length > visibleCount && (
        <>
          <IconButton
            onClick={handlePrev}
            disabled={index === 0}
            sx={{
              position: 'absolute',
              top: '50%',
              left: -16,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(15,15,30,0.7)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(15,15,30,0.9)' },
              zIndex: 2,
            }}
            size="large"
            aria-label="Previous suggestions"
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            disabled={index === maxIndex}
            sx={{
              position: 'absolute',
              top: '50%',
              right: -16,
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(15,15,30,0.7)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(15,15,30,0.9)' },
              zIndex: 2,
            }}
            size="large"
            aria-label="Next suggestions"
          >
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </>
      )}

      <Box
        sx={{
          overflow: 'hidden',
          px: { xs: 0, sm: 1 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: `${gap}px`,
            transform: `translateX(-${offset}px)`,
            transition: 'transform 0.45s ease',
            willChange: 'transform',
            width: cappedItems.length * (cardWidth + gap),
          }}
        >
          {cappedItems.map((anime, itemIndex) => (
            <Box
              key={`suggestion-${anime.mal_id}`}
              sx={{
                flex: `0 0 ${cardWidth}px`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SuggestionCard anime={anime} index={itemIndex} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

