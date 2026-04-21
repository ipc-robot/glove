import React from 'react';

function QAPoster() {
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
          <span style={{ color: '#2563eb', fontWeight: 900, marginRight: '12px', fontSize: '1.1rem' }}>05</span> 
          <span style={{ color: '#0f172a', fontWeight: 700 }}>问答与讨论 (Q&A)</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
      
      {/* Soft but huge impact glow elements */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, rgba(255,255,255,0) 60%)', filter: 'blur(70px)', zIndex: -1, animation: 'pulse-glow 4s infinite alternate' }} />
      <div style={{ position: 'absolute', top: '30%', left: '40%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, rgba(255,255,255,0) 60%)', filter: 'blur(70px)', zIndex: -1 }} />

      <h1 
        className="text-gradient"
        style={{ 
          fontSize: 'clamp(6rem, 12vw, 10rem)', 
          fontWeight: 900, 
          marginBottom: '1.5rem', 
          letterSpacing: '-5px', 
          lineHeight: 1
        }}
      >
        Q & A
      </h1>

      <div style={{ fontSize: '2.5rem', color: '#64748b', marginBottom: '4rem', fontWeight: 400, letterSpacing: '4px' }}>
        敬请各位评委批评指正
      </div>

      <div className="glass-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 3rem', borderRadius: '50px', background: 'rgba(255,255,255,0.7)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
           <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444' }}></div>
           <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#eab308' }}></div>
           <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22c55e' }}></div>
        </div>
        <div style={{ width: '2px', height: '30px', background: 'rgba(0,0,0,0.1)' }}></div>
        <div style={{ color: '#475569', fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 600 }}>
           awaiting_questions_for_response...
        </div>
      </div>
    </div>
  );
}

export default QAPoster;
