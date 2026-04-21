import React from 'react';

const CaseStudyPoster = () => {
    const mainText = [
        { id: 'Fig.1', title: '多模态触觉系统概述', detail: '系统架构及物理基础总览', status: 'completed' },
        { id: 'Fig.2', title: '传感单元设计与表征', detail: '器件制备工艺及基本性能测试', status: 'completed' },
        { id: 'Fig.3', title: '系统集成与信号验证', detail: '硬件部署与多模态数据对齐验证', status: 'completed' },
        { id: 'Fig.4', title: '手部感知图拓扑构建', detail: '本周重点：确立触觉-几何映射规则', status: 'active' },
        { id: 'Fig.5', title: '触觉描述词化自动标注', detail: '本周重点：确立 4 个核心物理维度标准', status: 'active' },
        { id: 'Fig.6', title: '应用展望：具身动作生成', detail: '正在筹备：VLA 训练集增强价值验证', status: 'pending' },
    ];

    const siChapters = [
        { id: 'S1-S3', title: '传感单元制备细节', detail: 'CNT 配比、滴铸固化参数', status: 'completed' },
        { id: 'S4-S5', title: '手套集成与 FPC 设计', detail: 'PI 柔性板布线与手工缝合逻辑', status: 'completed' },
        { id: 'S6', title: '扫描电路硬件实现', detail: '译码器逐行扫描与增益调节电路', status: 'completed' },
        { id: 'S7', title: '电学/力学综合表征', detail: '应变抑制效果评估 (97.6% 精度)', status: 'completed' },
        { id: 'S8', title: '传感器静态标定方法', detail: 'PDMS 平台 0-40N 压力梯度标定', status: 'completed' },
        { id: 'S9', title: '系统集成与实时显示', detail: '13Hz 采样率与上位机可视化', status: 'completed' },
        { id: 'S10', title: '多模态数据采集协议', detail: '进行中：确立 6 类物体的交互规范', status: 'active' },
        { id: 'S11', title: '标注流水线算法实现', detail: '进行中：视觉粗定位+触觉细解析算法', status: 'active' },
        { id: 'S12', title: '效果评估与应用模型', detail: '未开始：动作阶段划分准确率验证', status: 'pending' },
    ];

    const ChapterCard = ({ item }) => {
        const isCompleted = item.status === 'completed';
        const isActive = item.status === 'active';
        
        return (
            <div className={`chapter-card ${item.status}`} style={{
                padding: '1rem',
                borderRadius: '12px',
                background: isCompleted ? '#ffffff' : (isActive ? 'rgba(37, 99, 235, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                border: isActive ? '2px solid #2563eb' : (isCompleted ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.03)'),
                opacity: isCompleted || isActive ? 1 : 0.4,
                boxShadow: isCompleted ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                position: 'relative',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                minHeight: '80px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: isActive ? '#2563eb' : (isCompleted ? '#64748b' : '#94a3b8'), textTransform: 'uppercase' }}>
                        {item.id}
                    </span>
                    {isCompleted && <span style={{ fontSize: '0.8rem' }}>✅</span>}
                    {isActive && <div className="pulse-dot"></div>}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isCompleted || isActive ? '#0f172a' : '#94a3b8' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: isCompleted || isActive ? '#64748b' : '#cbd5e1', lineHeight: 1.4 }}>{item.detail}</div>
            </div>
        );
    };

    return (
        <div style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '1.2rem' }}>
                <div className="glass-badge" style={{ 
                    padding: '8px 24px', 
                    borderRadius: '100px', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    background: 'rgba(255,255,255,0.7)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}>
                    <span style={{ color: '#2563eb', fontWeight: 900, marginRight: '12px', fontSize: '1.1rem' }}>05</span> 
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>基于论文框架引导的论证逻辑案例</span>
                </div>
            </div>

            <h2 style={{ fontSize: '2.8rem', fontWeight: 1000, color: '#0f172a', marginBottom: '1.8rem', letterSpacing: '-0.04em' }}>
                论证细节与 <span className="text-gradient">典型案例深挖</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(500px, 1.2fr)', gap: '2.5rem', flex: 1, overflow: 'hidden' }}>
                {/* Left: Main Text */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#1e293b', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#2563eb' }}>📑</span> 正文 Results 章节
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', overflowY: 'auto', paddingRight: '10px' }}>
                        {mainText.map((item, idx) => <ChapterCard key={idx} item={item} />)}
                    </div>
                </div>

                {/* Right: SI / Methods */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.4rem', color: '#1e293b', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#059669' }}>🛠️</span> SI / Methods 支撑库
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', overflowY: 'auto', paddingRight: '10px' }}>
                        {siChapters.map((item, idx) => <ChapterCard key={idx} item={item} />)}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .chapter-card.active {
                    box-shadow: 0 0 20px rgba(37, 99, 235, 0.1);
                    animation: active-glow 2s infinite ease-in-out;
                }
                @keyframes active-glow {
                    0% { border-color: rgba(37, 99, 235, 0.3); }
                    50% { border-color: rgba(37, 99, 235, 1); }
                    100% { border-color: rgba(37, 99, 235, 0.3); }
                }
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #2563eb;
                    border-radius: 50%;
                    position: relative;
                }
                .pulse-dot::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: inherit;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `}} />
        </div>
    );
};

export default CaseStudyPoster;
