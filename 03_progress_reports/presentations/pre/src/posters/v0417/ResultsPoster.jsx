import React from 'react';

function ResultsPoster() {
  const stats = [
    { label: 'Top-1 Acc (绝对提升)', value: '+4.3%', color: '#2563eb' },
    { label: 'Top-5 准确率峰值', value: '98.6%', color: '#7c3aed' },
    { label: '极限轻量化参数量', value: '28.1M', color: '#db2777' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 0', height: '100%', position: 'relative' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-badge" style={{ padding: '8px 24px' }}>
          <span style={{ color: '#7c3aed', fontWeight: 800, marginRight: '8px' }}>03</span> 实验结果 (Experimental Results)
        </div>
      </div>

      <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '3rem' }}>
        突破预期的 <span className="text-gradient">全栈性能跨越</span>
      </h2>

      {/* KPI Stats */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ 
            flex: 1, minWidth: '250px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', background: 'rgba(255, 255, 255, 0.8)' 
          }}>
            <div style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
            <div style={{ fontSize: '4.5rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '4rem', flex: 1, flexWrap: 'wrap' }}>
        {/* Table Comparison */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', minWidth: '500px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#1e293b', marginBottom: '2rem', fontWeight: 700 }}>
            <span style={{ color: '#8b5cf6', marginRight: '10px' }}>📊</span>模型性能横向评测阵列
          </h3>
          <div className="glass-card" style={{ padding: '2rem', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.6)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#334155', fontSize: '1.1rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '1.5rem 1rem', color: '#0f172a' }}>底层架构 (Architecture)</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#0f172a' }}>Top-1 Acc</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#0f172a' }}>Top-5 Acc</th>
                  <th style={{ padding: '1.5rem 1rem', color: '#0f172a' }}>Param Size</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 500 }}>ResNet-50 (Baseline)</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>85.2%</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>97.1%</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>25.6M</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 500 }}>ResNet-101</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>86.8%</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>97.8%</td>
                  <td style={{ padding: '1.5rem 1rem', color: '#64748b' }}>44.5M</td>
                </tr>
                <tr style={{ background: 'rgba(139, 92, 246, 0.05)' }}>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 800, color: '#7c3aed' }}>本文提出模型 (Ours)</td>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 800, color: '#2563eb' }}>89.5%</td>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 800, color: '#2563eb' }}>98.6%</td>
                  <td style={{ padding: '1.5rem 1rem', fontWeight: 800, color: '#0f172a' }}>28.1M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Core Insights */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: '350px' }}>
          <h3 style={{ fontSize: '1.6rem', color: '#1e293b', marginBottom: '2rem', fontWeight: 700 }}>
            <span style={{ color: '#3b82f6', marginRight: '10px' }}>💡</span>核心结论萃取
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.25rem', color: '#475569', lineHeight: 1.8 }}>
             <li className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.7)' }}>
                相比基线，Top-1 准确率实现了 <strong style={{color:'#2563eb'}}>4.3%</strong> 的绝对阶跃提升，大幅超越预期表现。
             </li>
             <li className="glass-card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.7)' }}>
                架构极其高效。仅需额外付出 <strong style={{color:'#ec4899'}}>2.5M</strong> 的参数量代价，即可获得压倒更深层笨重网络的推断能力。
             </li>
             <li className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)' }}>
                针对<strong style={{color:'#0f172a'}}>严重遮挡和小目标检测</strong>场景，多尺度注意力模块的收益被完备的验证了。
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResultsPoster;
