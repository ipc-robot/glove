import React from 'react'
import { Paper } from '@mui/material'

function GlassCard({ children, sx = {}, ...props }) {
  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        borderRadius: { xs: 2, md: 3 },
        boxShadow:
          '0 8px 32px rgba(31, 38, 135, 0.12), 0 2px 8px rgba(31, 38, 135, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

export default GlassCard
