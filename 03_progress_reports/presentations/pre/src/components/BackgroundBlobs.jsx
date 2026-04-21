import React from 'react'
import { Box } from '@mui/material'

function BackgroundBlobs() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          top: '-10%',
          left: '-10%',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0.15) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          top: '30%',
          right: '-15%',
          background:
            'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.12) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '45vw',
          height: '45vw',
          bottom: '-10%',
          left: '20%',
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 9s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          top: '60%',
          left: '40%',
          background:
            'radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, rgba(167, 139, 250, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 11s ease-in-out infinite reverse',
        }}
      />
    </Box>
  )
}

export default BackgroundBlobs
