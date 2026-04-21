import React from 'react';

function SummaryPoster() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 0', height: '100%', position: 'relative' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="glass-badge" style={{ padding: '8px 24px' }}>
          <span style={{ color: '#10b981', fontWeight: 800, marginRight: '8px' }}>05</span> 研讨总结 (Summary)
        </div>
      </div>

      <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4rem' }}>
        提纲挈领 · <span className="text-gradient">项目综述</span>
      </h2>

      <div style={{ display: 'flex', gap: '3rem', flex: 1, marginBottom: '4rem', flexWrap: 'wrap' }}>
        {/* Completed */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem', minWidth: '400px', background: 'rgba(255,255,255,0.7)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'linear-gradient(to bottom, #10b981, #34d399)' }}></div>
          <h3 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
             核心达成 (Milestones)
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '1.25rem', lineHeight: 2 }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></div>
              已稳步完成全面文献调研与超大图集的核心数据集部署。
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></div>
              端侧协同下的小型基线模型验证与网络流体重构已通过初期测试。
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }}></div>
              具备创新的跨粒度特征聚合技术证明了其独到优越性。
            </li>
          </ul>
        </div>

        {/* To-Do */}
        <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem', minWidth: '400px', background: 'rgba(255,255,255,0.7)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: 'linear-gradient(to bottom, #8b5cf6, #c084fc)' }}></div>
          <h3 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
             亟待突破 (Objectives)
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#475569', fontSize: '1.25rem', lineHeight: 2 }}>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }}></div>
              更深层次的极致节点架构剪枝与参数精微级的标定调优。
            </li>
            <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }}></div>
              核心特征层的模块级作用机理拆解及鲁棒性消融实验探究。
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', flexShrink: 0 }}></div>
              核心顶会学术论文数据与论点的最终凝练与定稿投递。
            </li>
          </ul>
        </div>
      </div>

      {/* Acknowledgement */}
      <div style={{ textAlign: 'left', marginTop: 'auto', paddingLeft: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#b45309', fontWeight: 700 }}>
           诚挚感谢各位导师和同学一直以来的严谨指导与无私协助！
        </h3>
      </div>
    </div>
  );
}

export default SummaryPoster;
