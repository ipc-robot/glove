import React from 'react';

function ProgressPoster() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 0 1rem 0', height: '100%', position: 'relative' }}>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
      <div style={{ marginBottom: '1.2rem' }}>
        <div className="glass-badge" style={{ 
            padding: '8px 24px', 
            borderRadius: '100px', 
            border: '1px solid rgba(0,0,0,0.05)',
            background: 'rgba(255,255,255,0.7)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <span style={{ color: '#2563eb', fontWeight: 900, marginRight: '12px', fontSize: '1.1rem' }}>02</span> 
          <span style={{ color: '#0f172a', fontWeight: 700 }}>核心进展概述 (Project Overview)</span>
        </div>
      </div>
      <h2 style={{ fontSize: '2.8rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1.8rem', letterSpacing: '-0.04em' }}>
        近期 <span className="text-gradient">工作进展回顾</span>
      </h2>
        </div>
        
        <div className="glass-card" style={{ padding: '1rem 3rem', borderRadius: '100px', display: 'flex', alignItems: 'baseline', gap: '1.5rem', background: 'rgba(255,255,255,0.8)' }}>
          <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>阶段目标总攻进度</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>
            65<span style={{ fontSize: '1.5rem' }}>%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1, paddingBottom: '1rem', overflowY: 'auto' }}>
        
        {/* Pillar 1: Previous 2 Weeks */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>前两周回顾 (Weeks 1-2)</span>
             <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.2rem' }}>✓</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '1.5rem' }}>
             硬件定型与感知建模
          </h3>
          <ul style={{ paddingLeft: '1.2rem', color: '#334155', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <li><strong>硬件架构：</strong> 完成了高密度传感器阵列的性能表征，起草了描述硬件物理基础的 Fig 1-3 雏形。</li>
             <li><strong>模型铺设：</strong> 实现了手部 3D 力解析算法，初步确立了用于接触重建的拓扑映射机制。</li>
             <li><strong>标注流水线：</strong> 验证了触觉语义自动化生成的可行性，完成了 Fig 5 所示的原型系统测试。</li>
          </ul>
        </div>

        {/* Pillar 2: This Week (The New Focus) */}
        <div className="glass-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.95)', border: '1px solid #2563eb', boxShadow: '0 20px 40px rgba(37, 99, 235, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ background: '#dbeafe', color: '#2563eb', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>本周重点进展 (This Week)</span>
             <span style={{ color: '#2563eb', fontWeight: 900, fontSize: '1.2rem' }}>95%</span>
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#1e3a8a', fontWeight: 900, marginBottom: '1.5rem' }}>
             论文框架确立与深度绘图
          </h3>
          <ul style={{ paddingLeft: '0.2rem', color: '#1e293b', fontSize: '1.05rem', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: '14px', listStyleType: 'none' }}>
             <li style={{ fontWeight: 600 }}>
               <span style={{ color: '#2563eb', marginRight: '8px' }}>●</span> 
               论文 FIG 及正文章节的讨论与确定
             </li>
             <li style={{ fontWeight: 600 }}>
               <span style={{ color: '#2563eb', marginRight: '8px' }}>●</span> 
               SI (Supplementary Info) 各章节内容确定
             </li>
             <li style={{ fontWeight: 600 }}>
               <span style={{ color: '#2563eb', marginRight: '8px' }}>●</span> 
               基于论文框架指导的数据处理与作图
             </li>
          </ul>
          <div style={{ marginTop: 'auto', background: '#eff6ff', padding: '12px', borderRadius: '12px', color: '#1e40af', fontSize: '0.85rem', fontWeight: 700 }}>
            * 核心产出：完成了符合顶刊逻辑链条的完整图表集。
          </div>
        </div>

        {/* Pillar 3: Next Sprint */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>下周计划 (Next Sprint)</span>
             <span style={{ color: '#d97706', fontWeight: 800, fontSize: '1.2rem' }}>执笔落文</span>
          </div>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✍️</div>
          <h3 style={{ fontSize: '1.4rem', color: '#b45309', fontWeight: 800, marginBottom: '1.2rem' }}>
             正文文稿组织与收尾
          </h3>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            在现有高质量图表的基础上，启动 Methods 实验描述与 Results 数据结果分析的正式撰写工作。
          </p>
          <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
             按照论文框架逐步填充细节内容
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProgressPoster;
