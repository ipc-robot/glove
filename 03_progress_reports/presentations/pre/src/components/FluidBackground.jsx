import React from 'react';

const FluidBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      background: '#f8fafc', // Clean bright base
      pointerEvents: 'none' 
    }}>
      {/* Soft Pastel Blue Orb */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '70vw',
        height: '70vw',
        background: 'radial-gradient(circle, rgba(186, 230, 253, 0.6) 0%, rgba(255,255,255,0) 65%)',
        animation: 'fluid-blob 25s infinite ease-in-out',
        filter: 'blur(90px)',
      }} />
      
      {/* Soft Peach / Pink Orb */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '80vw',
        height: '80vw',
        background: 'radial-gradient(circle, rgba(254, 205, 211, 0.5) 0%, rgba(255,255,255,0) 65%)',
        animation: 'fluid-blob 30s infinite ease-in-out reverse',
        filter: 'blur(100px)',
      }} />
      
      {/* Soft Lavender / Mint Orb */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(216, 180, 254, 0.3) 0%, rgba(255,255,255,0) 65%)',
        animation: 'fluid-blob 22s infinite ease-in-out',
        filter: 'blur(90px)',
      }} />

      {/* Extremely subtle noise texture for premium glass/paper blend */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.03,
        mixBlendMode: 'multiply',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
      }} />
    </div>
  );
};

export default FluidBackground;
