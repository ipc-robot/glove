import React from 'react';

function NextStepsPoster() {
  const steps = [
    { num: '4.1~4.7', title: '4月第一周', status: 'done', color: '#94a3b8', tags: ['硬件架构成文', '姿态感知模型铺设'], desc: '启动 Fig 1-3 的论文主干写作（单器件数据已齐备）；同时开展手部姿态追踪与接触模型（Fig 4）的设计与实现。' },
    { num: '4.8~4.14', title: '4月第二周', status: 'done', color: '#10b981', tags: ['系统级框架验证', '过程语义标注测试'], desc: '推进系统级验证环节，重点开展触觉过程性语义自动化标注策略（Fig 5）的设计与实现。' },
    { num: '4.15~4.21', title: '4月第三周', status: 'active', color: '#d97706', tags: ['实证实验数据闭环', 'Method/Results成文'], desc: '完成验证实验；集中撰写涉及宏观算法（Fig 4 - Fig 5）的 Results 段落，并推进 Method 部分内容的写作。' },
    { num: '4.22~4.28', title: '4月第四周', status: 'planned', color: '#ea580c', tags: ['核心摘要与引言落笔', '全文逻辑脉络梳理'], desc: '完成 Introduction、Discussion 与 Abstract，确定全文逻辑主线并组装主干内容。' },
    { num: '4.29~5.5', title: '5月第一周', status: 'planned', color: '#db2777', tags: ['补充实验视频录制', 'SI图表规范化排版'], desc: '编制补充材料 (SI)，包括实验细节、视频制作、图表检查与参考文献校对排版。' },
    { num: '5.6~5.15', title: '5月中旬', status: 'planned', color: '#7c3aed', tags: ['首稿 (First Draft)', '内部交叉审阅迭代'], desc: '正式完成论文初稿 (First Draft)，提交团队内部审阅，开始收集意见并进入多轮打磨阶段。' },
    { num: '5月底', title: '定稿与投稿', status: 'planned', color: '#e11d48', tags: ['手稿格式最终校核', '目标期刊预备投递'], desc: '完成各方修改意见的整合与终稿排版，正式提交手稿。目标期刊：FlexMat / npj / Adv. Sci.' },
  ];

  const allTags = steps.flatMap(s => s.tags.map(t => ({ text: t, status: s.status, color: s.color })));
  const completedCount = allTags.filter(t => t.status === 'done').length;
  const activeCount = allTags.filter(t => t.status === 'active').length;
  const plannedCount = allTags.filter(t => t.status === 'planned').length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 0 1rem 0', height: '100%', position: 'relative' }}>
      <div style={{ marginBottom: '1rem' }}>
        <div className="glass-badge" style={{ padding: '6px 20px', display: 'inline-block' }}>
          <span style={{ color: '#db2777', fontWeight: 800, marginRight: '8px' }}>04</span> 下一步计划 (Next Steps)
        </div>
      </div>

      {/* Top Section: The Compact Explosion Pool */}
      <div className="glass-card" style={{ padding: '1.2rem 2rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.7)', border: '1px solid #ffffff', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a', fontWeight: 900 }}>
             全栈攻坚任务池 <span style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>({allTags.length} Clusters)</span>
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 800 }}>
             <span style={{ color: '#64748b' }}>✅ 已斩获 {completedCount} 项</span>
             <span style={{ color: '#10b981' }}>当前集火 {activeCount} 项</span>
             <span style={{ color: '#f59e0b' }}>待收割 {plannedCount} 项</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allTags.map((tag, idx) => {
             const isDone = tag.status === 'done';
             return (
               <div key={idx} style={{ 
                 padding: '4px 12px', background: isDone ? '#f1f5f9' : `${tag.color}15`, 
                 color: isDone ? '#94a3b8' : tag.color,
                 borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                 border: `1px solid ${isDone ? '#e2e8f0' : `${tag.color}30`}`,
                 textDecoration: isDone ? 'line-through' : 'none'
               }}>
                  {tag.text}
               </div>
             );
          })}
        </div>
      </div>
      
      {/* Bottom Section: Vertical Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', paddingTop: '0.5rem' }}>
        {steps.map((step, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '2rem', marginBottom: '1.2rem', position: 'relative' }}>
             {/* Timeline Vertical Axis */}
             <div style={{ 
                 position: 'absolute', left: '138px', top: '22px', 
                 bottom: idx === steps.length - 1 ? '50%' : '-1.5rem', 
                 width: '2px', background: 'rgba(15, 23, 42, 0.08)', zIndex: 0 
             }}></div>
             
             {/* Left Date Box */}
             <div style={{ width: '110px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingTop: '8px', flexShrink: 0 }}>
                 <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{step.title}</div>
                 <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em', marginTop: '2px' }}>{step.num}</div>
             </div>

             {/* Circle Node */}
             <div style={{ 
                 width: '18px', height: '18px', borderRadius: '50%', background: step.status === 'done' ? '#cbd5e1' : step.color,
                 marginTop: '12px', border: '4px solid #fff', boxShadow: step.status === 'active' ? `0 0 0 3px ${step.color}40` : 'none',
                 position: 'relative', zIndex: 1, flexShrink: 0
             }}></div>

             {/* Right Description Glass Node */}
             <div className="glass-card" style={{ 
                 flex: 1, padding: '1rem 1.5rem', background: step.status === 'active' ? '#fff' : 'rgba(255,255,255,0.6)',
                 border: step.status === 'active' ? `2px solid ${step.color}` : '1px solid rgba(255,255,255,0.8)',
                 boxShadow: step.status === 'active' ? `0 10px 25px ${step.color}15` : '0 2px 5px rgba(0,0,0,0.02)',
                 borderRadius: '12px', opacity: step.status === 'done' ? 0.6 : 1, display: 'flex', flexDirection: 'column', gap: '10px'
             }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     <p style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.6, flex: 1 }}>{step.desc}</p>
                     {step.status === 'active' && <div style={{ background: step.color, color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, marginLeft: '1rem', flexShrink: 0 }}>当前冲刺</div>}
                 </div>
                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                     {step.tags.map((tag, tIdx) => (
                        <span key={tIdx} style={{ 
                           padding: '2px 10px', background: step.status === 'done' ? '#f1f5f9' : `${step.color}15`, 
                           color: step.status === 'done' ? '#94a3b8' : step.color, borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 
                        }}>
                           {tag}
                        </span>
                     ))}
                 </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NextStepsPoster;
