import React from 'react';

function ProgressPoster() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 0 1rem 0', height: '100%', position: 'relative' }}>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div className="glass-badge" style={{ padding: '6px 20px', marginBottom: '1rem', display: 'inline-block' }}>
            <span style={{ color: '#0284c7', fontWeight: 800, marginRight: '8px' }}>02</span> 核心进展概述 (Project Overview)
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            前两周的 <span className="text-gradient">工作进展回顾</span>
          </h2>
        </div>
        
        <div className="glass-card" style={{ padding: '1rem 3rem', borderRadius: '100px', display: 'flex', alignItems: 'baseline', gap: '1.5rem', background: 'rgba(255,255,255,0.8)' }}>
          <div style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>阶段目标总攻进度</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0284c7', lineHeight: 1 }}>
            28<span style={{ fontSize: '1.5rem' }}>%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', flex: 1, paddingBottom: '1rem', overflowY: 'auto' }}>
        
        {/* Pillar 1: Already done */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>4月第一周 (Week 1)</span>
             <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1.2rem' }}>✓</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '1.5rem' }}>
             硬件验证与初步建模
          </h3>
          <ul style={{ paddingLeft: '1.2rem', color: '#334155', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <li><strong>硬件单元测试：</strong>初步完成了柔性器件的抗压与抗干扰测试，整理相关数据并起草了正文前半部分（Fig 1-3）的文章大纲。</li>
             <li><strong>感知模型构建：</strong>基于多通道传感信号，初步实现了手部三维力特征解析与关节角运动估计，尝试性设计了接触拓扑模型（Fig 4）。</li>
          </ul>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '2rem' }}>
             <span style={{ background: 'rgba(0,0,0,0.05)', color: '#475569', borderRadius: '4px', fontSize: '0.8rem', padding: '4px 8px', fontWeight: 700 }}>硬件架构成文</span>
             <span style={{ background: 'rgba(0,0,0,0.05)', color: '#475569', borderRadius: '4px', fontSize: '0.8rem', padding: '4px 8px', fontWeight: 700 }}>姿态感知模型铺设</span>
          </div>
        </div>

        {/* Pillar 2: Transitional (Nearing completion) */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.85)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>4月第二周 (Week 2)</span>
             <span style={{ color: '#4f46e5', fontWeight: 900, fontSize: '1.2rem' }}>85%</span>
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800, marginBottom: '1.5rem' }}>
             级联框架验证与语义标注设计
          </h3>
          <ul style={{ paddingLeft: '1.2rem', color: '#334155', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <li><strong>联合框架测试：</strong>初步梳理了从硬件数据采集到上层算法解析的数据流转关系，进行了各模块协同的初步验证。</li>
             <li><strong>标注方法实现：</strong>设计了将触觉推演空间映射至自然文本的自动化流水线原型（Fig 5），并推进了可行性定样测试。</li>
          </ul>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '2rem' }}>
             <span style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4338ca', borderRadius: '4px', fontSize: '0.8rem', padding: '4px 8px', fontWeight: 700 }}>系统级框架验证</span>
             <span style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4338ca', borderRadius: '4px', fontSize: '0.8rem', padding: '4px 8px', fontWeight: 700 }}>过程语义标注测试</span>
          </div>
        </div>

        {/* Pillar 3: Current Sprint (In Progress Highlight) */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '2px solid #f59e0b', boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)', transform: 'translateY(-10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>本周集火 (Sprint 3)</span>
             <span style={{ color: '#d97706', fontWeight: 800, fontSize: '1.2rem' }}>实证成文</span>
          </div>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏳</div>
          <h3 style={{ fontSize: '1.5rem', color: '#b45309', fontWeight: 900, marginBottom: '1.2rem' }}>
             后续验证实验与论文主干撰写
          </h3>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            研究目前正处于后半程的动作库验证与分析阶段：<br/><br/>
            旨在针对性地精调领域技能（SKILL）提示词配置；同时，逐步启动 Methods 框架与 Results 数据的落文工作。
          </p>
          <div style={{ marginTop: 'auto', background: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '12px 16px', color: '#92400e', fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.5 }}>
             * 预期工作：按节点计划妥善安排遗留的数据采集验证流程，并完善相关的文章书面组织。
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProgressPoster;
