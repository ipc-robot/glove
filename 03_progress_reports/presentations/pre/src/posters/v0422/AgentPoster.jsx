import React from 'react';

function AgentPoster() {
   return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0', position: 'relative' }}>

         {/* Header */}
         <div style={{ marginBottom: '1.2rem' }}>
            <div className="glass-badge" style={{ 
                padding: '8px 24px', 
                borderRadius: '100px', 
                border: '1px solid rgba(0,0,0,0.05)',
                background: 'rgba(255,255,255,0.7)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}>
               <span style={{ color: '#2563eb', fontWeight: 900, marginRight: '12px', fontSize: '1.1rem' }}>04</span> 
               <span style={{ color: '#0f172a', fontWeight: 700 }}>触觉感知与语义标注智能体 (Methodology)</span>
            </div>
         </div>

         <h2 style={{ fontSize: '2.8rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1.8rem', letterSpacing: '-0.04em' }}>
            <span className="text-gradient">视觉-触觉协同智能体</span> 架构设计
         </h2>

         {/* Main Grid: Row 1 (Fig 5a & Fig 5b) */}
         <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flex: '0 0 auto' }}>

            {/* Fig 5.a: Agent Architecture */}
            <div className="glass-card" style={{ flex: 4, padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.6)' }}>
               <h3 style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '1.8rem', fontWeight: 800 }}>
                  (a) 智能体系统架构 (Agent Architecture)
               </h3>

               {/* Outer Container for Agent */}
               <div style={{ border: '2px solid rgba(139, 92, 246, 0.5)', borderRadius: '15px', padding: '1.8rem 1rem 1rem', background: 'rgba(139, 92, 246, 0.05)', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>

                  {/* Title badge for Agent */}
                  <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', padding: '6px 24px', borderRadius: '30px', fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)', whiteSpace: 'nowrap' }}>
                     🤖 视觉-触觉协同标注智能体 (Agent)
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>

                     {/* Layer 1: 模型层 */}
                     <div style={{ width: '100%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '20px 16px', borderRadius: '12px', color: 'white', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#3b82f6', color: 'white', padding: '4px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)' }}>模型层 (Model Layer)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px', marginTop: '6px' }}>🧠 多模态大模型 (MLLM)</div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>认知与推理大脑 / 任务决策 / 特征提炼</div>
                     </div>

                     {/* Connection Line center */}
                     <div style={{ width: '4px', height: '22px', background: '#cbd5e1' }}></div>

                     {/* Layer 2: 技能层 */}
                     <div style={{ width: '100%', background: 'linear-gradient(135deg, #7e22ce, #581c87)', padding: '20px 16px', borderRadius: '12px', color: 'white', textAlign: 'center', boxShadow: '0 8px 20px rgba(126, 34, 206, 0.25)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#a855f7', color: 'white', padding: '4px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(168, 85, 247, 0.4)' }}>技能层 (Skill Layer)</div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                           <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '14px' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f3e8ff' }}>📝 领域技能 (SKILL)</div>
                              <div style={{ fontSize: '0.8rem', color: '#d8b4fe', marginTop: '6px', lineHeight: 1.5 }}>动作空间规范<br />推演与映射法则</div>
                           </div>
                           <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '14px' }}>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f3e8ff' }}>🛠️ 工具库 (Tools)</div>
                              <div style={{ fontSize: '0.8rem', color: '#d8b4fe', marginTop: '6px', lineHeight: 1.5 }}>Shell 脚本执行<br />时序片段裁切组装</div>
                           </div>
                        </div>
                     </div>

                     {/* Connection Line center */}
                     <div style={{ width: '4px', height: '22px', background: '#cbd5e1' }}></div>

                     {/* Layer 3: 代理层 */}
                     <div style={{ width: '100%', background: 'linear-gradient(135deg, #059669, #064e3b)', padding: '20px 16px', borderRadius: '12px', color: 'white', textAlign: 'center', boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '20px', background: '#10b981', color: 'white', padding: '4px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)' }}>代理层 (Agent Layer)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px', marginTop: '6px' }}>⚙️ OpenClaw Runtime</div>
                        <div style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                           <span>上下文管理</span>
                           <span>•</span>
                           <span>本地文件处理</span>
                           <span>•</span>
                           <span>工具调用编排</span>
                        </div>
                     </div>

                  </div>
               </div>
            </div>

            {/* Fig 5.b: SKILL Internal Details - Academic Paper Style */}
            <div style={{ flex: 5, padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #cbd5e1' }}>
               <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', fontWeight: 600, color: '#0f172a' }}>
                  (b) SKILL 工作流：宏观到微观的多模态降维推演架构
               </h3>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>

                  {/* Phase 1 */}
                  <div style={{ border: '1px solid #64748b', padding: '1rem', background: '#f8fafc', position: 'relative' }}>
                     <div style={{ position: 'absolute', top: '-10px', left: '15px', background: '#fff', padding: '0 8px', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                        Phase I: 宏观分析阶段 (Macro-Level Analysis)
                     </div>

                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', marginTop: '0.8rem' }}>
                        {/* Input */}
                        <div style={{ flex: '0 0 130px', border: '1px dashed #64748b', background: '#ffffff', padding: '0.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>[ 多模态输入 ]</div>
                           <div style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.5 }}>全局操作图像 (RGB)<br />全局力矩波形 (Fz)</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem', color: '#64748b', fontWeight: 'bold' }}>→</div>

                        {/* Processing Modules */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>1. 视觉特征提取 (Visual Feature)</div>
                              <div style={{ fontSize: '0.7rem', color: '#475569' }}>抽取材质及接触部位先验</div>
                           </div>
                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>2. 全局时序分段 (Temporal Slicing)</div>
                              <div style={{ fontSize: '0.7rem', color: '#475569' }}>根据力学(Fz)全过程拐点定界</div>
                           </div>
                           <div style={{ border: '1px dashed #94a3b8', background: '#f8fafc', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>3. 制定全局标注计划 (Plan Formulation)</div>
                              <div style={{ fontSize: '0.7rem', color: '#475569' }}>明确时间切片清单并写入溯源</div>
                           </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem', color: '#64748b', fontWeight: 'bold' }}>→</div>

                        {/* Output */}
                        <div style={{ flex: '0 0 140px', border: '1px solid #0f172a', background: '#e2e8f0', padding: '0.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                           <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>[ 降维输出 ]</div>
                           <div style={{ fontSize: '0.75rem', color: '#1e293b', lineHeight: 1.5 }}>宏观物理语境<br /><strong>N 个独立时间切片</strong></div>
                        </div>
                     </div>
                  </div>

                  {/* Down Arrow between phases */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.4rem 0', position: 'relative', zIndex: 2 }}>
                     <div style={{ background: '#ffffff', padding: '0.2rem 0.5rem', fontSize: '0.75rem', border: '1px solid #94a3b8', color: '#475569', fontWeight: 600 }}>
                        传入 N 个独立时间切片 (N Independent Time Slices)
                     </div>
                  </div>

                  <div style={{ position: 'relative', margin: '-10px auto 0 auto', width: '2px', height: '20px', background: '#64748b', zIndex: 1 }}></div>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #64748b', margin: '0 auto', marginBottom: '0.2rem' }}></div>

                  {/* Phase 2 */}
                  <div style={{ border: '1px solid #64748b', padding: '1rem', background: '#f8fafc', position: 'relative' }}>
                     <div style={{ position: 'absolute', top: '-10px', left: '15px', background: '#fff', padding: '0 8px', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>
                        Phase II: 微观推演阶段 (Micro-Level Analysis) —— 逐切片闭环循环
                     </div>

                     <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>

                        {/* Left side micro */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ border: '1px solid #475569', color: '#334155', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>1</div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>制定查询计划 (Query Plan Formulation)</div>
                                 <div style={{ fontSize: '0.7rem', color: '#475569' }}>确立局部多维提取指标体系</div>
                              </div>
                              <div style={{ fontSize: '0.65rem', border: '1px dashed #94a3b8', padding: '2px 4px', color: '#64748b' }}>[ 记录计划 ]</div>
                           </div>

                           <div style={{ fontSize: '1rem', color: '#64748b', textAlign: 'center', margin: '-6px 0', fontWeight: 'bold' }}>↓</div>

                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ border: '1px solid #475569', color: '#334155', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>2</div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>多模态特征提取 (Multimodal Feature Extraction)</div>
                                 <div style={{ fontSize: '0.7rem', color: '#475569' }}>提取均值/极值/摩擦脉冲</div>
                              </div>
                              <div style={{ fontSize: '0.65rem', border: '1px dashed #94a3b8', padding: '2px 4px', color: '#64748b' }}>[ 记录结果 ]</div>
                           </div>
                        </div>

                        {/* Right side micro */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ border: '1px solid #475569', color: '#334155', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>3</div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>触觉动作推演 (Tactile Action Reasoning)</div>
                                 <div style={{ fontSize: '0.7rem', color: '#475569' }}>交叉研判推演 10 维力学状态</div>
                              </div>
                              <div style={{ fontSize: '0.65rem', border: '1px dashed #94a3b8', padding: '2px 4px', color: '#64748b' }}>[ 记录逻辑 ]</div>
                           </div>

                           <div style={{ fontSize: '1rem', color: '#64748b', textAlign: 'center', margin: '-6px 0', fontWeight: 'bold' }}>↓</div>

                           <div style={{ border: '1px solid #94a3b8', background: '#ffffff', padding: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ border: '1px solid #475569', color: '#334155', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 'bold' }}>4</div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>生成定性描述 (Description Generation)</div>
                                 <div style={{ fontSize: '0.7rem', color: '#475569' }}>组装为指导性纯粹动作计划</div>
                              </div>
                              <div style={{ fontSize: '0.65rem', border: '1px dashed #94a3b8', padding: '2px 4px', color: '#64748b' }}>[ 暂存流转 ]</div>
                           </div>
                        </div>

                     </div>
                  </div>

                  <div style={{ width: '2px', height: '15px', background: '#64748b', margin: '0 auto', marginTop: '0.2rem' }}></div>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid #64748b', margin: '0 auto', marginBottom: '0.2rem' }}></div>

                  {/* Phase 3 */}
                  <div style={{ border: '1px solid #64748b', padding: '0.8rem 1.2rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b', marginBottom: '2px' }}>Phase III: 报告汇总与持久化 (Report Summarization and Persistence)</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>全局上下文验证连贯性，消除显式测度数据，渲染为标准的 Markdown 强溯源性指导报告。</div>
                     </div>
                     <div style={{ fontSize: '0.75rem', border: '1px solid #0f172a', padding: '4px 8px', background: '#e2e8f0', color: '#0f172a', fontWeight: 'bold' }}>
                        Output Report
                     </div>
                  </div>

               </div>
            </div>

         </div>

      </div>
   );
}

export default AgentPoster;
