import React from 'react';
import fig2 from './fig2.png';
import fig3 from './fig3.png';

function ResultsPoster() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0', height: '100%', boxSizing: 'border-box' }}>

      {/* Unified Header */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div className="glass-badge" style={{
          padding: '8px 24px',
          borderRadius: '100px',
          border: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.7)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <span style={{ color: '#2563eb', fontWeight: 900, marginRight: '12px', fontSize: '1.1rem' }}>03</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>论文核心成果图表展示</span>
        </div>
      </div>

      <h2 style={{ fontSize: '2.8rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1.8rem', letterSpacing: '-0.04em' }}>
        正文 <span className="text-gradient">组图</span>
      </h2>

      {/* Main Image Display Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        flex: 1,
        minHeight: 0,
        paddingBottom: '1rem'
      }}>

        {/* Left: Fig 2 */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,255,255,0.5)',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid #ffffff'
        }}>
          <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, color: '#1e293b' }}>Figure 2</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>器件设计与物理模型表征</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <img src={fig2} alt="Fig 2" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
        </div>

        {/* Right: Fig 3 */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255,255,255,0.5)',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid #ffffff'
        }}>
          <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, color: '#1e293b' }}>Figure 3</span>
            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>系统集成与动态采集验证</span>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <img src={fig3} alt="Fig 3" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }} />
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .text-gradient {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
      `}} />
    </div>
  );
}

export default ResultsPoster;
