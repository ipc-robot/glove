import React from 'react'
import { Box, Paper } from '@mui/material'

function Slide({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        maxWidth: 1200,
        maxHeight: 675,
        aspectRatio: '16/9',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Paper>
  )
}

export default Slide
