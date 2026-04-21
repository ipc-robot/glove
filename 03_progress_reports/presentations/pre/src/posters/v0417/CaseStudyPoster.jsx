import React from 'react';

const CaseStudyPoster = () => {
   return (
      <div style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', boxSizing: 'border-box' }}>
         {/* Header */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
               <div className="glass-badge" style={{ padding: '8px 20px', marginBottom: '12px', display: 'inline-block', fontSize: '1.1rem' }}>
                  <span style={{ color: '#ec4899', fontWeight: 800, marginRight: '8px' }}>03</span> 实验结果 (Experimental Results)
               </div>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <h3 style={{ fontSize: '2.5rem', color: '#1e293b', margin: 0, fontWeight: 800, lineHeight: 1 }}>
                     <span className="text-gradient" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>视觉-触觉协同智能体</span> 结果展示
                  </h3>
                  <div style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600, paddingBottom: '3px' }}>
                     (以“动态抓法 gms”标定为例)
                  </div>
               </div>
            </div>
            <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 20px', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', color: '#475569' }}>
               全局时间跨度：<span style={{ color: '#0f172a' }}>4.01 s</span>
            </div>
         </div>

         {/* NLE Editor Container */}
         <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#f8fafc', border: '1px solid #cbd5e1', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            
            {/* Timeline Ruler */}
            <div style={{ display: 'flex', borderBottom: '1px solid #94a3b8', background: '#e2e8f0', minHeight: '45px' }}>
               {/* Track Headers Column (Width 280px) */}
               <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '0 15px', display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: '1rem', color: '#334155' }}>
                  多模态通道 (Data Channels)
               </div>
               
               {/* Timeline Ticks */}
               <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', background: 'repeating-linear-gradient(to right, transparent, transparent 49px, rgba(148, 163, 184, 0.3) 50px)' }}>
                  <div style={{ position: 'absolute', left: '10%', top: 0, bottom: 0, borderLeft: '2px solid #ef4444', paddingLeft: '8px', paddingTop: '10px', fontSize: '0.95rem', fontWeight: 'bold', color: '#ef4444' }}>
                     1.45s
                  </div>
                  <div style={{ position: 'absolute', left: '47%', top: 0, bottom: 0, borderLeft: '2px solid #ef4444', paddingLeft: '8px', paddingTop: '10px', fontSize: '0.95rem', fontWeight: 'bold', color: '#ef4444' }}>
                     2.32s
                  </div>
                  <div style={{ position: 'absolute', left: '67.4%', top: 0, bottom: 0, borderLeft: '2px solid #ef4444', paddingLeft: '8px', paddingTop: '10px', fontSize: '0.95rem', fontWeight: 'bold', color: '#ef4444' }}>
                     2.80s
                  </div>
                  <div style={{ position: 'absolute', left: '90%', top: 0, bottom: 0, borderLeft: '1px solid #94a3b8', paddingLeft: '8px', paddingTop: '10px', fontSize: '0.95rem', fontWeight: 'bold', color: '#64748b' }}>
                     3.33s (End)
                  </div>
               </div>
            </div>

            {/* Tracks Area */}
            <div style={{ display: 'flex', flexDirection: 'column', background: '#f1f5f9', position: 'relative' }}>
               
               {/* Track 1: RGB */}
               <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', background: '#ffffff', position: 'relative', zIndex: 1, minHeight: '85px' }}>
                  <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '10px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#2563eb' }}>👁️ V1: Vision (RGB)</div>
                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>视觉几何形态与接触先验</div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', padding: '10px 0' }}>
                     <div style={{ position: 'absolute', left: '10%', width: '80%', height: 'calc(100% - 20px)', background: 'linear-gradient(90deg, #dbeafe, #eff6ff)', border: '1px solid #93c5fd', borderRadius: '4px', padding: '0 15px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.95rem', color: '#1e40af', fontWeight: 600 }}>[全掌/五指] [大面接触] —— 目标为柔软的可形变软组织表面</span>
                     </div>
                  </div>
               </div>

               {/* Track 2: Force Fz */}
               <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', background: '#f8fafc', position: 'relative', zIndex: 1, minHeight: '110px' }}>
                  <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '10px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#d946ef' }}>📉 F1: Force Z (S1)</div>
                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>法向总力度走势</div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                     <div style={{ position: 'absolute', left: '10%', width: '37%', height: 'calc(100% - 24px)', background: '#fae8ff', border: '1px solid #f0abfc', borderRadius: '6px', borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#86198f' }}>0.50N ↗ 2.93N</div>
                        <div style={{ fontSize: '0.85rem', color: '#a21caf', marginTop: '4px' }}>[力度渐增]斜率3.2N/s</div>
                     </div>
                     <div style={{ position: 'absolute', left: '47%', width: '20.4%', height: 'calc(100% - 24px)', background: '#fdf4ff', border: '1px solid #f5d0fe', borderLeft: 'none', borderRadius: '0', padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#86198f' }}>2.93N ↘ 1.54N</div>
                        <div style={{ fontSize: '0.85rem', color: '#a21caf', marginTop: '4px' }}>[力度渐弱]峰值回落</div>
                     </div>
                     <div style={{ position: 'absolute', left: '67.4%', width: '22.6%', height: 'calc(100% - 24px)', background: '#fdf4ff', border: '1px solid #e9d5ff', borderLeft: 'none', borderRadius: '6px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#86198f' }}>1.54N ↘ 0.51N</div>
                        <div style={{ fontSize: '0.85rem', color: '#a21caf', marginTop: '4px' }}>[极轻力]退压消退</div>
                     </div>
                  </div>
               </div>

               {/* Track 3: Tribo */}
               <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1', background: '#ffffff', position: 'relative', zIndex: 1, minHeight: '95px' }}>
                  <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '10px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#f59e0b' }}>⚡ T1: Triboelectric</div>
                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>摩擦电微观滑动脉冲</div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                     <div style={{ position: 'absolute', left: '10%', width: '37%', height: 'calc(100% - 24px)', background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '6px', borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: '8px 15px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.95rem', color: '#b45309', fontWeight: 600 }}>5814次尖峰 [轻微滑动]</span>
                     </div>
                     <div style={{ position: 'absolute', left: '47%', width: '20.4%', height: 'calc(100% - 24px)', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0', borderLeft: 'none', padding: '8px 15px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.95rem', color: '#d97706', fontWeight: 600 }}>1144次尖峰 [轻微滑动]</span>
                     </div>
                     <div style={{ position: 'absolute', left: '67.4%', width: '22.6%', height: 'calc(100% - 24px)', background: '#f9fafb', border: '1px dashed #cbd5e1', borderRadius: '6px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', padding: '8px 15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: 600 }}>0次尖峰 [无滑动]</span>
                     </div>
                  </div>
               </div>

               {/* Track 4: Strain (Angle) */}
               <div style={{ display: 'flex', borderBottom: '1px solid #94a3b8', background: '#f8fafc', position: 'relative', zIndex: 1, minHeight: '110px' }}>
                  <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '10px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                     <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#10b981' }}>📐 A1: Angle (Strain)</div>
                     <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>关节宏观形变姿态</div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                     <div style={{ position: 'absolute', left: '10%', width: '37%', height: 'calc(100% - 24px)', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '6px', borderTopRightRadius: 0, borderBottomRightRadius: 0, padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#047857' }}>-21° ↗ 38°</div>
                        <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '4px' }}>Δ59° 弯曲收拢</div>
                     </div>
                     <div style={{ position: 'absolute', left: '47%', width: '20.4%', height: 'calc(100% - 24px)', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0', borderLeft: 'none', padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#047857' }}>38° ↘ -8°</div>
                        <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '4px' }}>Δ47° 主动伸展</div>
                     </div>
                     <div style={{ position: 'absolute', left: '67.4%', width: '22.6%', height: 'calc(100% - 24px)', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', padding: '8px 15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#047857' }}>-9° ↗ 12°</div>
                        <div style={{ fontSize: '0.85rem', color: '#059669', marginTop: '4px' }}>Δ21° 恢复平展</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sub-Track 1: Reasoning Strategy */}
            <div style={{ display: 'flex', background: '#fafafa', borderBottom: '1px solid #cbd5e1', position: 'relative', zIndex: 2, minHeight: '150px' }}>
               <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#6366f1' }}>🤖 分析策略 (Reasoning)</div>
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '8px' }}>大模型动态推理与特征查询规划</div>
               </div>
               <div style={{ flex: 1, position: 'relative', padding: '14px 0' }}>
                  <div style={{ position: 'absolute', left: '10%', width: '37%', height: 'calc(100% - 28px)', background: '#eef2ff', border: '1px dashed #818cf8', borderRadius: '8px', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', padding: '12px 18px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '0.95rem', color: '#4f46e5', fontWeight: 'bold', marginBottom: '8px', flexShrink: 0 }}>【调用与分析意图】</div>
                     <div style={{ fontSize: '0.85rem', color: '#3730a3', lineHeight: 1.7, overflowY: 'auto' }}>
                        1. 获取 S1通道 三维力Fz/Fx/Fy统计特征，分析力度增长趋势<br/>
                        2. 获取 CH1 摩擦电通道脉冲计数，分析接触摩擦状态<br/>
                        3. 获取 CH1 关节角度变化，验证手指弯曲收拢过程
                     </div>
                  </div>
                  <div style={{ position: 'absolute', left: '47%', width: '20.4%', height: 'calc(100% - 28px)', background: '#eef2ff', border: '1px dashed #818cf8', borderRadius: '0', borderRight: 'none', padding: '12px 18px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '0.95rem', color: '#4f46e5', fontWeight: 'bold', marginBottom: '8px', flexShrink: 0 }}>【调用与分析意图】</div>
                     <div style={{ fontSize: '0.85rem', color: '#3730a3', lineHeight: 1.7, overflowY: 'auto' }}>
                        1. 分析力峰值后的衰减变化趋势<br/>
                        2. 判断高频摩擦脉冲以确认接触粘滞<br/>
                        3. 监测关节回弹姿态变化
                     </div>
                  </div>
                  <div style={{ position: 'absolute', left: '67.4%', width: '22.6%', height: 'calc(100% - 28px)', background: '#eef2ff', border: '1px dashed #818cf8', borderRadius: '8px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '12px 18px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '0.95rem', color: '#4f46e5', fontWeight: 'bold', marginBottom: '8px', flexShrink: 0 }}>【调用与分析意图】</div>
                     <div style={{ fontSize: '0.85rem', color: '#3730a3', lineHeight: 1.7, overflowY: 'auto' }}>
                        1. 分析最终满释放期的法向力消退状态<br/>
                        2. 通过摩擦电尖峰验证彻底物理脱离<br/>
                        3. 确认骨骼关节角已回归零位
                     </div>
                  </div>
               </div>
            </div>

            {/* Sub-Track 2: Final Logical Execution Block */}
            <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #cbd5e1', position: 'relative', zIndex: 2, minHeight: '210px' }}>
               <div style={{ width: '280px', borderRight: '1px solid #94a3b8', padding: '15px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0369a1' }}>📄 最终规划 (Plan)</div>
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '8px' }}>基于客观测度数据组装指导性动作序列</div>
               </div>
               <div style={{ flex: 1, position: 'relative', padding: '14px 0' }}>
                  <div style={{ position: 'absolute', left: '10%', width: '37%', height: 'calc(100% - 28px)', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none', padding: '15px 20px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '1.05rem', color: '#0369a1', fontWeight: 'bold', marginBottom: '10px', flexShrink: 0 }}>【收拢接触阶段】</div>
                     <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.8, overflowY: 'auto' }}>
                        拇指从自然伸展状态开始，逐步弯曲收拢，指尖逐渐接触到目标软组织。随着弯曲角度增大，拇指指腹持续施加渐增的抓握力度，指腹与软组织表面逐渐贴合，过程中伴随轻微的自然相对滑动，直至达到最大弯曲角度和预定抓握力度。
                     </div>
                  </div>
                  <div style={{ position: 'absolute', left: '47%', width: '20.4%', height: 'calc(100% - 28px)', background: '#e0f2fe', border: '1px solid #7dd3fc', borderRadius: '0', borderRight: 'none', padding: '15px 20px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '1.05rem', color: '#075985', fontWeight: 'bold', marginBottom: '10px', flexShrink: 0 }}>【抓放维持阶段】</div>
                     <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.8, overflowY: 'auto' }}>
                        拇指达到最大弯曲完成收拢后，随即开始逐步伸展手指并减轻抓握力度，指腹仍然保持与软组织的接触，整体力度稳步减弱，关节角度逐步回正。
                     </div>
                  </div>
                  <div style={{ position: 'absolute', left: '67.4%', width: '22.6%', height: 'calc(100% - 28px)', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, padding: '15px 20px', display: 'flex', flexDirection: 'column' }}>
                     <div style={{ fontSize: '1.05rem', color: '#0369a1', fontWeight: 'bold', marginBottom: '10px', flexShrink: 0 }}>【释放脱离阶段】</div>
                     <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.8, overflowY: 'auto' }}>
                        拇指继续伸展，抓握力度进一步减弱，指腹逐渐脱离软组织表面，最终完全松开回到接近初始的伸展姿态，力度完全释放。
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
};

export default CaseStudyPoster;
