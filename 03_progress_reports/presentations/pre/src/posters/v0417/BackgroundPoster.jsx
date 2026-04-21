import React from 'react';

function BackgroundPoster() {
  const applications = [
    { label: '医疗影像', color: '#3b82f6', emoji: '🏥' },
    { label: '智能安防', color: '#ec4899', emoji: '🛡️' },
    { label: '自动驾驶', color: '#0ea5e9', emoji: '🚗' },
    { label: '工业质检', color: '#8b5cf6', emoji: '🏭' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 0', height: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-badge" style={{ padding: '8px 24px' }}>
          <span style={{ color: '#2563eb', fontWeight: 800, marginRight: '8px' }}>01</span> 研究背景 (Background & Motivation)
        </div>
      </div>

      <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '3rem' }}>
        为何我们需要 <span className="text-gradient">打破现有算法体系</span> ？
      </h2>

      <div style={{ display: 'flex', gap: '4rem', marginTop: '1rem', flex: 1, flexWrap: 'wrap' }}>
        
        {/* Left Column */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
          <h3 style={{ fontSize: '2.2rem', color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700 }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', padding: '4px 16px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 900 }}>1</span>
            技术瓶颈与挑战
          </h3>
          
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.3rem', color: '#475569', lineHeight: 2 }}>
            <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#3b82f6' }}>✦</span> 深度学习在计算机视觉领域取得显著进展，但在复杂场景下仍显不足。
            </li>
            <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#3b82f6' }}>✦</span> 现实条件下的光照突变、剧烈遮挡导致传统模型泛化准确率骤降。
            </li>
            <li style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#3b82f6' }}>✦</span> 模型巨量参数规模与端侧部署算力的客观限制存在极大矛盾。
            </li>
          </ul>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: '400px' }}>
          <h3 style={{ fontSize: '2.2rem', color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 700 }}>
            <span style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#db2777', padding: '4px 16px', borderRadius: '12px', fontSize: '1.5rem', fontWeight: 900 }}>2</span>
            破局方案与意义
          </h3>
          
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.3rem', color: '#475569', lineHeight: 2, flex: 1 }}>
            <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#ec4899' }}>✦</span> 提出鲁棒性更强的多尺度注意力机制聚合模型。
            </li>
            <li style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: '#ec4899' }}>✦</span> 突破边缘角落及复杂应用场景下的识别泛化壁垒，为全行业提供更优的技术标尺。
            </li>
          </ul>

          <div className="glass-card" style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.7)' }}>
            <div style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1.5rem', fontWeight: 600 }}>核心应用场景赋能：</div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {applications.map((app, idx) => (
                <div key={idx} style={{ 
                  padding: '10px 20px', borderRadius: '30px', 
                  background: 'rgba(255,255,255,0.9)', border: `1px solid ${app.color}40`,
                  color: '#334155', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  {app.emoji} {app.label}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BackgroundPoster;
