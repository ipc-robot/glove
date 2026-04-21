import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardActionArea, CardContent, Grid, Container } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FluidBackground from '../components/FluidBackground';

function PresentationHub() {
  const navigate = useNavigate();

  const presentations = [
    {
      id: '2026-04-22',
      title: '最新进展汇报 (04-22)',
      date: '2026-04-22',
      description: '包含最新的架构调整、方法论优化及最新进度展示。',
      path: '/2026-04-22'
    },
    {
      id: '2026-04-17',
      title: 'V1 - 首次课题汇报 (04-17)',
      date: '2026-04-17',
      description: '基础框架搭建与初始核心内容汇报。',
      path: '/2026-04-17'
    }
  ];

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <FluidBackground />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, pt: 15, pb: 4 }}>
         <Box sx={{ mb: 8, textAlign: 'center', color: '#0f172a' }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }} className="text-gradient">
              Presentation Hub
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.8, fontWeight: 500, color: '#334155' }}>
              选择你要查阅的演示文稿版本
            </Typography>
         </Box>
         
         <Grid container spacing={4} justifyContent="center">
           {presentations.map((item) => (
             <Grid item xs={12} md={8} key={item.id}>
               <div className="glass-card" style={{ transition: 'all 0.4s ease' }}>
                 <CardActionArea onClick={() => navigate(item.path)} sx={{ p: 4, borderRadius: '24px' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                     <PlayCircleOutlineIcon sx={{ fontSize: 56, mr: 3, color: '#2563eb' }} />
                     <Box>
                       <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 0.5, color: '#0f172a' }}>
                         {item.title}
                       </Typography>
                       <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                         更新日期: {item.date}
                       </Typography>
                     </Box>
                   </Box>
                   <Typography variant="h6" sx={{ fontWeight: 400, color: '#334155', mt: 2, lineHeight: 1.6 }}>
                     {item.description}
                   </Typography>
                 </CardActionArea>
               </div>
             </Grid>
           ))}
         </Grid>
      </Container>
    </Box>
  );
}

export default PresentationHub;
