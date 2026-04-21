import React from 'react';

function TitlePoster() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', textAlign: 'left', zIndex: 10, height: '100%', position: 'relative' }}>
      
      {/* Decorative Blur Elements specific to this spread */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '30%', paddingTop: '30%', background: 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(50px)', zIndex: -1, borderRadius: '50%' }} />

      <div 
        className="glass-badge" 
        style={{ 
          padding: '10px 24px', 
          marginBottom: '3rem', 
          fontSize: '1.2rem', 
          fontWeight: 600, 
        }}
      >
        <span style={{ marginRight: '12px', fontSize: '1.3rem' }}>✨</span> 课题组每周例行汇报
      </div>

      <h1 
        style={{ 
          fontSize: 'clamp(3rem, 5vw, 5rem)', 
          fontWeight: 900, 
          marginBottom: '1rem', 
          letterSpacing: '-0.02em', 
          lineHeight: 1.2,
          color: '#0f172a'
        }}
      >
        <span style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', color: '#475569' }}>用于手部姿态追踪与接触状态重建的</span> <br />
        <span className="text-gradient">多模态触觉建模手套</span>
      </h1>

      <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', fontWeight: 500, color: '#64748b', marginBottom: '5rem', letterSpacing: '0.02em', maxWidth: '1200px', lineHeight: 1.6 }}>
        本研究设计了一款基于高密度可拉伸阵列的感力手套，捕捉细粒度物理交互；并前瞻性地提出了触觉动作的过程性标注（触觉描述词化）机制，为视觉-触觉协同模型的构建提供了潜在的自动化标注新范式。
      </h3>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 2rem', gap: '1.5rem', borderRadius: '100px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '1.8rem', fontWeight: 'bold', color: '#fff'
          }}>
            王
          </div>
          <div style={{ textAlign: 'left', paddingRight: '1rem' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>汇报人：王鹤榕</div>
            <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>博士研究生</div>
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'absolute', bottom: '0', 
        color: '#94a3b8', fontSize: '1.1rem', letterSpacing: '0.1em',
        fontWeight: 600
      }}>
        2026年4月15日
      </div>
    </div>
  );
}

export default TitlePoster;
