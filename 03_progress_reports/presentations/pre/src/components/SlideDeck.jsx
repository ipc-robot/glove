import React, { useState, useCallback, useEffect } from 'react'
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import {
  ArrowForward,
  ArrowBack,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material'
import Slide from './Slide'

function SlideDeck({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const goToNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(c => c + 1)
    }
  }, [currentSlide, slides.length])

  const goToPrev = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(c => c - 1)
    }
  }, [currentSlide])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(c => c + 1)
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentSlide > 0) {
        setCurrentSlide(c => c - 1)
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentSlide, slides.length])

  const CurrentSlideComponent = slides[currentSlide]

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Slide>
          <CurrentSlideComponent />
        </Slide>
      </Box>

      <Box
        sx={{
          position: 'absolute',
        bottom: theme.spacing(2),
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 4,
        px: 2,
        py: 1,
        boxShadow: 2,
      }}
    >
      <IconButton
        onClick={goToPrev}
        disabled={currentSlide === 0}
        color="primary"
      >
        {isMobile ? <KeyboardArrowLeft /> : <ArrowBack />}
      </IconButton>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60, textAlign: 'center' }}>
        {currentSlide + 1} / {slides.length}
      </Typography>
      <IconButton
        onClick={goToNext}
        disabled={currentSlide === slides.length - 1}
        color="primary"
      >
        {isMobile ? <KeyboardArrowRight /> : <ArrowForward />}
      </IconButton>
    </Box>
  </Box>
  )
}

export default SlideDeck
