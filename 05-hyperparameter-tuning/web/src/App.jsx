import React, { useState, useEffect, useRef, useMemo } from 'react';
import Papa from 'papaparse';
import ReactECharts from 'echarts-for-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import HandSkeleton from './components/HandSkeleton';
import { pressure_fn, calc_v_true, angle_fn, medianArr, voltage_baseline_correction } from './utils/mathLogic';

const DEFAULT_STRAIN = [1.0, 1.0, 0.2099, 1.0, 1.0, 1.0, 1.0, 1.0];
const DEFAULT_FORCE = Array.from({length: 14}, () => ({ x: 1.0, y: 0.667, z: 1.0 }));

// 提取图表组件以优化性能
const StrainChart = React.memo(({ data, timeData, currentFrame }) => {
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};
    let series = [];
    // 渲染 8 个通道的应变角度（对应前 8 个有效的 joint）
    for (let i = 0; i < 8; i++) {
        let name = `CH${i+1}`;
        if (i===0||i===1) name = `Thumb(CH${i+1})`;
        if (i===2||i===3) name = `Index(CH${i+1})`;
        if (i===4||i===5) name = `Middle(CH${i+1})`;
        if (i===6||i===7) name = `Ring(CH${i+1})`;
        const jointMap = [8, 9, 0, 1, 2, 3, 4, 5];
        series.push({ name, type: 'line', showSymbol: false, data: data.map(r => r.angles[jointMap[i]]) }); 
        // Note: 映射对应关系 (0,1 存了 Index; 8,9 存了 Thumb)
        // 实际上按照 App.jsx 设置的: Index=0,1; Middle=2,3; Ring=4,5; Thumb=8,9
    }

    if (timeData[currentFrame] !== undefined) {
      series[0].markLine = {
        symbol: 'none', silent: true, animation: false,
        lineStyle: { color: '#EF4444', type: 'dashed', width: 2 },
        data: [{ xAxis: timeData[currentFrame].toFixed(2) }]
      };
    }

    return {
      title: { text: `所有应变角度 (All Strain Angles)`, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis' },
      legend: { right: 0, top: 0, textStyle: { fontSize: 10 } },
      grid: { left: 40, right: 10, bottom: 20, top: 30 },
      xAxis: { type: 'category', data: timeData.map(t => t.toFixed(2)), show: false },
      yAxis: { type: 'value' },
      series: series
    };
  }, [data, timeData, currentFrame]);

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
});

const ForceChart = React.memo(({ sensorIdx, data, timeData, currentFrame }) => {
  const option = useMemo(() => {
    if (!data || data.length === 0) return {};
    let series = [
      { name: `Fx`, type: 'line', showSymbol: false, data: data.map(r => r.forces[sensorIdx*3]) },
      { name: `Fy`, type: 'line', showSymbol: false, data: data.map(r => r.forces[sensorIdx*3+1]) },
      { name: `Fz`, type: 'line', showSymbol: false, data: data.map(r => r.forces[sensorIdx*3+2]) }
    ];

    if (timeData[currentFrame] !== undefined) {
      series[0].markLine = {
        symbol: 'none', silent: true, animation: false,
        lineStyle: { color: '#EF4444', type: 'dashed', width: 2 },
        data: [{ xAxis: timeData[currentFrame].toFixed(2) }]
      };
    }

    return {
      title: { text: `S${sensorIdx+1} 3D Force`, textStyle: { fontSize: 12 } },
      tooltip: { trigger: 'axis' },
      legend: { right: 0, top: 0, textStyle: { fontSize: 10 } },
      grid: { left: 35, right: 5, bottom: 20, top: 30 },
      xAxis: { type: 'category', data: timeData.map(t => t.toFixed(2)), show: false },
      yAxis: { type: 'value', axisLabel: { fontSize: 9 } },
      series: series
    };
  }, [sensorIdx, data, timeData, currentFrame]);

  return <ReactECharts option={option} style={{ height: '160px', width: '100%' }} />;
});

export default function App() {
  const [rawData, setRawData] = useState(null);
  const [timeData, setTimeData] = useState([]);
  
  const [strainSegments, setStrainSegments] = useState([
    { id: 1, t_start: 0, t_end: 9999, params: JSON.parse(JSON.stringify(DEFAULT_STRAIN)) }
  ]);
  const [activeStrainSegmentId, setActiveStrainSegmentId] = useState(1);
  
  const [forceSegments, setForceSegments] = useState([
    { id: 1, t_start: 0, t_end: 9999, params: JSON.parse(JSON.stringify(DEFAULT_FORCE)) }
  ]);
  const [activeForceSegmentId, setActiveForceSegmentId] = useState(1);

  const [checkpoints, setCheckpoints] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tuning_checkpoints')) || [];
    } catch {
      return [];
    }
  });

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // File Upload Handling
  const processCSVData = (data) => {
    if(data.length === 0) return;
    let keys = Object.keys(data[0]);
    let timeKey = keys.find(k => k.toLowerCase().includes('time') || k.includes('时间'));
    
    let tData = data.map(row => row[timeKey] || 0);
    let rData = {};
    
    let allTargetCols = keys.filter(k => k.startsWith('Strain_') || k.startsWith('Force_') || k.startsWith('Tribo_'));
    allTargetCols.forEach(col => {
      rData[col] = data.map(row => row[col] || 0);
    });
    
    setTimeData(tData);
    setRawData(rData);
    
    let maxT = tData[tData.length - 1];
    setStrainSegments([{ id: 1, t_start: 0, t_end: maxT, params: JSON.parse(JSON.stringify(DEFAULT_STRAIN)) }]);
    setForceSegments([{ id: 1, t_start: 0, t_end: maxT, params: JSON.parse(JSON.stringify(DEFAULT_FORCE)) }]);
    setActiveStrainSegmentId(1);
    setActiveForceSegmentId(1);
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, { header: true, dynamicTyping: true, skipEmptyLines: true, complete: res => processCSVData(res.data) });
  };

  const handlePresetSelect = (e) => {
    const url = e.target.value;
    if (!url) return;
    
    Papa.parse(url, {
      download: true, header: true, dynamicTyping: true, skipEmptyLines: true,
      complete: res => processCSVData(res.data),
      error: err => alert(`加载失败，请确保使用 python -m http.server 启动。${err}`)
    });
  };

  const activeStrainSegment = strainSegments.find(s => s.id === activeStrainSegmentId) || strainSegments[0];
  const activeForceSegment = forceSegments.find(s => s.id === activeForceSegmentId) || forceSegments[0];

  const addStrainSegment = () => {
    const newId = Math.max(...strainSegments.map(s => s.id), 0) + 1;
    setStrainSegments([...strainSegments, { id: newId, t_start: 0, t_end: 10, params: JSON.parse(JSON.stringify(DEFAULT_STRAIN)) }]);
    setActiveStrainSegmentId(newId);
  };
  
  const deleteStrainSegment = (id) => {
    if (strainSegments.length <= 1) return;
    const newSegs = strainSegments.filter(s => s.id !== id);
    setStrainSegments(newSegs);
    if (activeStrainSegmentId === id) setActiveStrainSegmentId(newSegs[0].id);
  };

  const updateStrainSegmentTime = (id, key, val) => {
    setStrainSegments(prev => prev.map(s => s.id === id ? { ...s, [key]: isNaN(val) ? 0 : val } : s));
  };

  const updateStrainSegmentParam = (idx, val) => {
    setStrainSegments(prev => prev.map(s => {
      if (s.id !== activeStrainSegmentId) return s;
      let newParams = [...s.params];
      newParams[idx] = isNaN(val) ? 0 : val;
      return { ...s, params: newParams };
    }));
  };

  const addForceSegment = () => {
    const newId = Math.max(...forceSegments.map(s => s.id), 0) + 1;
    setForceSegments([...forceSegments, { id: newId, t_start: 0, t_end: 10, params: JSON.parse(JSON.stringify(DEFAULT_FORCE)) }]);
    setActiveForceSegmentId(newId);
  };
  
  const deleteForceSegment = (id) => {
    if (forceSegments.length <= 1) return;
    const newSegs = forceSegments.filter(s => s.id !== id);
    setForceSegments(newSegs);
    if (activeForceSegmentId === id) setActiveForceSegmentId(newSegs[0].id);
  };

  const updateForceSegmentTime = (id, key, val) => {
    setForceSegments(prev => prev.map(s => s.id === id ? { ...s, [key]: isNaN(val) ? 0 : val } : s));
  };

  const updateForceSegmentParam = (sensorIdx, axis, val) => {
    setForceSegments(prev => prev.map(s => {
      if (s.id !== activeForceSegmentId) return s;
      let newParams = JSON.parse(JSON.stringify(s.params));
      newParams[sensorIdx][axis] = isNaN(val) ? 0 : val;
      return { ...s, params: newParams };
    }));
  };

  const getStrainParamsForTime = (t, segs) => {
    for(let s of segs) { if(t >= s.t_start && t <= s.t_end) return s.params; }
    return segs[0].params;
  };

  const getForceParamsForTime = (t, segs) => {
    for(let s of segs) { if(t >= s.t_start && t <= s.t_end) return s.params; }
    return segs[0].params;
  };

  const handleSaveCheckpoint = () => {
    const cp = {
      id: Date.now(),
      name: `快照 ${new Date().toLocaleTimeString()}`,
      strainSegments: JSON.parse(JSON.stringify(strainSegments)),
      forceSegments: JSON.parse(JSON.stringify(forceSegments))
    };
    const newCps = [...checkpoints, cp];
    setCheckpoints(newCps);
    localStorage.setItem('tuning_checkpoints', JSON.stringify(newCps));
  };

  const handleRestoreCheckpoint = (cp) => {
    if(!window.confirm(`确认恢复到 [${cp.name}] 吗？当前未保存的修改将丢失。`)) return;
    setStrainSegments(JSON.parse(JSON.stringify(cp.strainSegments)));
    setForceSegments(JSON.parse(JSON.stringify(cp.forceSegments)));
    setActiveStrainSegmentId(cp.strainSegments[0].id);
    setActiveForceSegmentId(cp.forceSegments[0].id);
  };

  const handleDeleteCheckpoint = (id) => {
    const newCps = checkpoints.filter(c => c.id !== id);
    setCheckpoints(newCps);
    localStorage.setItem('tuning_checkpoints', JSON.stringify(newCps));
  };

  // Calculate Processed Data Memoized
  const processedData = useMemo(() => {
    if (!rawData || timeData.length === 0) return null;

    let outData = [];
    let len = timeData.length;

    // 获取并排序各个传感器的列名
    const sortCols = (prefix) => Object.keys(rawData).filter(k => k.startsWith(prefix)).sort((a,b) => parseInt(a.split('_')[1].replace('CH','')) - parseInt(b.split('_')[1].replace('CH','')));
    let strainCols = sortCols('Strain_');
    let forceCols = sortCols('Force_');
    let triboCols = sortCols('Tribo_');

    // 预计算基线矫正
    const doCorrection = (cols) => {
        return cols.map(ch => {
            let { v_corrected } = voltage_baseline_correction(rawData[ch]);
            let r0 = medianArr(v_corrected.slice(0, 10)) || 1.0;
            return { v_corrected, r0, ch };
        });
    };

    let corrStrain = doCorrection(strainCols);
    let corrForce = doCorrection(forceCols);

    for(let i=0; i<len; i++) {
      let t = timeData[i];
      let strainParams = getStrainParamsForTime(t, strainSegments);
      let forceParams = getForceParamsForTime(t, forceSegments);
      
      let rowAngles = new Array(10).fill(0);
      const setAngle = (jointIdx, strainIdx) => {
          if (corrStrain[strainIdx]) {
              let v_true = calc_v_true(corrStrain[strainIdx].v_corrected[i], corrStrain[strainIdx].r0);
              let chIndex = parseInt(corrStrain[strainIdx].ch.split('_')[1].replace('CH', '')) - 1;
              let gain = (strainParams && strainParams[chIndex] !== undefined) ? strainParams[chIndex] : 1.0;
              rowAngles[jointIdx] = -angle_fn(v_true, gain); // 角度取反以匹配 3D 渲染
          }
      };
      setAngle(0, 2); // CH3 -> Index base
      setAngle(1, 3); // CH4 -> Index tip
      setAngle(2, 4); // CH5 -> Middle base
      setAngle(3, 5); // CH6 -> Middle tip
      setAngle(4, 6); // CH7 -> Ring base
      setAngle(5, 7); // CH8 -> Ring tip
      setAngle(8, 0); // CH1 -> Thumb base
      setAngle(9, 1); // CH2 -> Thumb tip

      let rowForces = new Array(42).fill(0);
      for (let s = 0; s < 14; s++) {
          let fx_k = forceParams && forceParams[s] ? forceParams[s].x : 1.0;
          let fy_k = forceParams && forceParams[s] ? forceParams[s].y : 0.667;
          let fz_k = forceParams && forceParams[s] ? forceParams[s].z : 1.0;
          let baseIdx = s * 4;
          if (baseIdx + 3 < corrForce.length) {
              let P1 = pressure_fn(calc_v_true(corrForce[baseIdx].v_corrected[i], corrForce[baseIdx].r0));
              let P2 = pressure_fn(calc_v_true(corrForce[baseIdx+1].v_corrected[i], corrForce[baseIdx+1].r0));
              let P3 = pressure_fn(calc_v_true(corrForce[baseIdx+2].v_corrected[i], corrForce[baseIdx+2].r0));
              let P4 = pressure_fn(calc_v_true(corrForce[baseIdx+3].v_corrected[i], corrForce[baseIdx+3].r0));
              rowForces[s*3] = fx_k * (P2 + P4 - P1 - P3);
              rowForces[s*3+1] = fy_k * (P1 + P2 - P3 - P4);
              rowForces[s*3+2] = fz_k * (P1 + P2 + P3 + P4);
          }
      }

      let rowTribo = new Array(8).fill(0);
      for(let j=0; j<8; j++) {
          if (triboCols[j]) {
              rowTribo[j] = rawData[triboCols[j]][i];
          }
      }

      outData.push({ angles: rowAngles, forces: rowForces, tribo: rowTribo });
    }
    return outData;
  }, [rawData, timeData, strainSegments, forceSegments]);

  // 移除旧的单图表 chartOption

  // Construct HandSkeleton Data Frame
  const handDataRow = useMemo(() => {
    if (!processedData || !processedData[currentFrame]) return new Array(61).fill(0);
    let d = processedData[currentFrame];
    let row = new Array(61).fill(0);
    row[0] = timeData[currentFrame]; // timestamp

    for(let i=0; i<10; i++) row[i+1] = d.angles[i];
    for(let i=0; i<42; i++) row[i+11] = d.forces[i];
    for(let i=0; i<8; i++) row[i+53] = d.tribo[i];

    return row;
  }, [processedData, currentFrame, timeData]);

  useEffect(() => {
    let timer;
    if (isPlaying && processedData && currentFrame < processedData.length - 1) {
      timer = setTimeout(() => setCurrentFrame(prev => prev + 1), 50 / playbackSpeed);
    } else if (isPlaying && currentFrame >= (processedData?.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentFrame, processedData, playbackSpeed]);

  const handleExportParams = () => {
    const exportData = { strainSegments, forceSegments };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tuned_params.json");
    dlAnchorElem.click();
  };

  const handleExportCSV = () => {
    if (!processedData || timeData.length === 0) return;
    let headers = ["Time"];
    for(let i=0; i<10; i++) headers.push(`Joint_${i}`);
    for(let i=0; i<14; i++) {
        headers.push(`S${i+1}_FX`);
        headers.push(`S${i+1}_FY`);
        headers.push(`S${i+1}_FZ`);
    }
    for(let i=0; i<8; i++) headers.push(`Tribo_${i}`);

    let csvContent = headers.join(",") + "\n";
    for(let i=0; i<processedData.length; i++) {
        let row = [timeData[i].toFixed(3)];
        processedData[i].angles.forEach(v => row.push(v.toFixed(4)));
        processedData[i].forces.forEach(v => row.push(v.toFixed(4)));
        processedData[i].tribo.forEach(v => row.push(v.toFixed(4)));
        csvContent += row.join(",") + "\n";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "synthesized_data.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LEFT: Controls */}
      <aside style={{ width: '420px', borderRight: '1px solid #E2E8F0', padding: '20px', overflowY: 'auto', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>调参面板</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleExportParams} style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>导出参数</button>
            <button onClick={handleExportCSV} disabled={!processedData} style={{ padding: '6px 10px', fontSize: '0.8rem', background: processedData ? '#8B5CF6' : '#CBD5E1', color: '#fff', border: 'none', borderRadius: '4px', cursor: processedData ? 'pointer' : 'not-allowed' }}>导出CSV</button>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>1. 数据源</h3>
          <select onChange={handlePresetSelect} style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>
            <option value="">-- 选择预设动作数据 --</option>
            <option value="/data/tuning_raw/action_1.csv">1. 动态抓法 (融合原始数据)</option>
            <option value="/data/tuning_raw/action_2.csv">2. 静态抓法 (融合原始数据)</option>
            <option value="/data/tuning_raw/action_3.csv">3. 动态揉法 (融合原始数据)</option>
            <option value="/data/tuning_raw/action_4.csv">4. 静态揉法 (融合原始数据)</option>
            <option value="/data/tuning_raw/action_5.csv">5. 动态点法 (融合原始数据)</option>
            <option value="/data/tuning_raw/action_6.csv">6. 静态点法 (融合原始数据)</option>
          </select>
          <input type="file" accept=".csv" onChange={handleFileUpload} style={{ width: '100%', fontSize: '0.85rem' }} />
        </div>

        <div style={{ marginBottom: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.9rem', margin: 0 }}>2. 检查点暂存</h3>
            <button onClick={handleSaveCheckpoint} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ 保存快照</button>
          </div>
          {checkpoints.length === 0 ? <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>暂无快照，点击右上角保存当前参数状态。</div> : (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {checkpoints.map(cp => (
                <div key={cp.id} style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', background: '#E2E8F0', borderRadius: '4px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  <span style={{ cursor: 'pointer', marginRight: '8px' }} onClick={() => handleRestoreCheckpoint(cp)}>{cp.name}</span>
                  <span style={{ cursor: 'pointer', color: '#EF4444', fontWeight: 'bold' }} onClick={() => handleDeleteCheckpoint(cp.id)}>×</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {rawData && (
          <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0 }}>3. 应变时间段与参数</h3>
              <button onClick={addStrainSegment} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ 新增时段</button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {strainSegments.map(s => (
                <div key={s.id} 
                  onClick={() => setActiveStrainSegmentId(s.id)}
                  style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: activeStrainSegmentId === s.id ? '2px solid #3B82F6' : '1px solid #CBD5E1', background: activeStrainSegmentId === s.id ? '#EFF6FF' : '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                  段 {s.id}
                  {strainSegments.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteStrainSegment(s.id); }} style={{ marginLeft: '8px', color: '#EF4444', fontWeight: 'bold', padding: '0 4px' }}>×</span>
                  )}
                </div>
              ))}
            </div>

            {activeStrainSegment && (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', fontSize: '0.85rem' }}>
                  时间范围: 
                  <input type="number" step="0.1" value={activeStrainSegment.t_start} onChange={e => updateStrainSegmentTime(activeStrainSegment.id, 't_start', parseFloat(e.target.value))} style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                  -
                  <input type="number" step="0.1" value={activeStrainSegment.t_end} onChange={e => updateStrainSegmentTime(activeStrainSegment.id, 't_end', parseFloat(e.target.value))} style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                  s
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '4px' }}>
                  {activeStrainSegment.params.map((val, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem' }}>
                      <label style={{ marginBottom: '4px', color: '#64748B' }}>CH{idx+1}</label>
                      <input type="number" step="0.001" value={val} onChange={e => updateStrainSegmentParam(idx, parseFloat(e.target.value))} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {rawData && (
          <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0 }}>4. 三维力时间段与参数</h3>
              <button onClick={addForceSegment} style={{ padding: '4px 8px', fontSize: '0.8rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ 新增时段</button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
              {forceSegments.map(s => (
                <div key={s.id} 
                  onClick={() => setActiveForceSegmentId(s.id)}
                  style={{ padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', border: activeForceSegmentId === s.id ? '2px solid #3B82F6' : '1px solid #CBD5E1', background: activeForceSegmentId === s.id ? '#EFF6FF' : '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                  段 {s.id}
                  {forceSegments.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteForceSegment(s.id); }} style={{ marginLeft: '8px', color: '#EF4444', fontWeight: 'bold', padding: '0 4px' }}>×</span>
                  )}
                </div>
              ))}
            </div>

            {activeForceSegment && (
              <>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', fontSize: '0.85rem' }}>
                  时间范围: 
                  <input type="number" step="0.1" value={activeForceSegment.t_start} onChange={e => updateForceSegmentTime(activeForceSegment.id, 't_start', parseFloat(e.target.value))} style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                  -
                  <input type="number" step="0.1" value={activeForceSegment.t_end} onChange={e => updateForceSegmentTime(activeForceSegment.id, 't_end', parseFloat(e.target.value))} style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                  s
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: '4px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 'bold', color: '#64748B', marginBottom: '4px' }}>
                  <div>ID</div><div>FX</div><div>FY</div><div>FZ</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {activeForceSegment.params.map((f, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: '4px', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: '#475569', textAlign: 'center' }}>S{idx+1}</div>
                      <input type="number" step="0.001" value={f.x} onChange={e => updateForceSegmentParam(idx, 'x', parseFloat(e.target.value))} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                      <input type="number" step="0.001" value={f.y} onChange={e => updateForceSegmentParam(idx, 'y', parseFloat(e.target.value))} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                      <input type="number" step="0.001" value={f.z} onChange={e => updateForceSegmentParam(idx, 'z', parseFloat(e.target.value))} style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </aside>

      {/* RIGHT SIDE: Visualizations + Playback */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        
        {/* TOP: Data Chart & 3D Render */}
        <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0, marginBottom: '20px' }}>
          
          {/* MIDDLE: Charts */}
          <section style={{ flex: 1.5, background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {processedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <StrainChart data={processedData} timeData={timeData} currentFrame={currentFrame} />
                <h4 style={{ margin: '10px 0 0 0', fontSize: '1rem', color: '#334155' }}>各传感器三维力 (14 个图表)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   {Array.from({length: 14}).map((_, i) => (
                     <ForceChart key={i} sensorIdx={i} data={processedData} timeData={timeData} currentFrame={currentFrame} />
                   ))}
                </div>
              </div>
            ) : <div style={{ margin: 'auto', color: '#94A3B8' }}>请先选择或上传数据</div>}
          </section>

          {/* RIGHT: 3D Render */}
          <section style={{ flex: 1, minWidth: '400px', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
            <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={0.9} />
              <HandSkeleton currentData={handDataRow} />
              <OrbitControls makeDefault enableDamping minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} target={[0, 1, 0]} />
              <Grid position={[0, -2, 0]} args={[20, 20]} cellColor="#F1F5F9" sectionColor="#E2E8F0" />
              <Environment preset="studio" />
            </Canvas>
          </section>

        </div>

        {/* BOTTOM: Unified Playback Control */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                disabled={!processedData}
                style={{
                  background: processedData ? '#3B82F6' : '#94A3B8', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: '4px 12px', 
                  cursor: processedData ? 'pointer' : 'not-allowed',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isPlaying ? '⏸ 暂停' : '▶ 播放'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', fontSize: '0.8rem', color: '#64748B' }}>
                <span>倍速: {playbackSpeed.toFixed(1)}x</span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1" 
                  value={playbackSpeed} 
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  disabled={!processedData}
                  style={{ width: '80px', accentColor: '#3B82F6' }}
                />
              </div>
              <span style={{ marginLeft: '12px' }}>全局时间轴拖动与播放（当前时间：{processedData ? timeData[currentFrame]?.toFixed(2) : '0.00'}s）</span>
            </div>
            <span style={{color: processedData ? '#10B981' : '#94A3B8'}}>
              {processedData ? `Frame: ${currentFrame} / ${processedData.length - 1}` : '暂无数据'}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max={processedData ? processedData.length - 1 : 0} 
            value={currentFrame} 
            onChange={(e) => { setCurrentFrame(parseInt(e.target.value)); setIsPlaying(false); }}
            disabled={!processedData}
            style={{ width: '100%', accentColor: '#10B981', cursor: processedData ? 'pointer' : 'not-allowed', height: '6px' }}
          />
        </div>

      </main>
    </div>
  );
}
