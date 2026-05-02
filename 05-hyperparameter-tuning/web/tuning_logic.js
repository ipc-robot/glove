// ==========================================
// 数学逻辑移植 (从 Python)
// ==========================================

function pressure_fn(v) {
    // 7.78 * v / (0.98 - v)
    return (7.78 * v) / (0.98 - v);
}

function calc_v_true(v_val, r_ref, vcc_mv = 5000.0) {
    // (vcc_mv * (r_ref - v_val)) / (r_ref * (vcc_mv - v_val))
    return (vcc_mv * (r_ref - v_val)) / (r_ref * (vcc_mv - v_val));
}

function angle_fn(v_true, gain = 1.0) {
    let v_corr = v_true * gain;
    let e = 0.53 * Math.pow(v_corr, 3) - 3.43 * Math.pow(v_corr, 2) + 27.74 * v_corr;
    return e * (90.0 / 85.0) * 100;
}

// 模拟 Python 的 voltage_baseline_correction
function voltage_baseline_correction(y_arr) {
    const n = y_arr.length;
    if (n < 50) {
        let median = medianArr(y_arr);
        return { v_corrected: y_arr.map(v => v - median), v_drift: new Array(n).fill(median) };
    }
    
    let v_start = medianArr(y_arr.slice(0, 20));
    let v_end = medianArr(y_arr.slice(n - 20));
    
    // 简单近似的漂移线: 线性连接首尾
    let v_drift = new Array(n);
    for(let i=0; i<n; i++) {
        v_drift[i] = v_start + (v_end - v_start) * (i / (n - 1));
    }
    
    let v_corrected = new Array(n);
    for(let i=0; i<n; i++) {
        v_corrected[i] = y_arr[i] - (v_drift[i] - v_start);
    }
    
    return { v_corrected, v_drift };
}

function medianArr(arr) {
    if (arr.length === 0) return 0;
    let sorted = [...arr].sort((a, b) => a - b);
    let half = Math.floor(sorted.length / 2);
    if (sorted.length % 2) return sorted[half];
    return (sorted[half - 1] + sorted[half]) / 2.0;
}

// ==========================================
// 状态与数据管理
// ==========================================

let rawData = [];
let timeData = [];
let chColumns = []; // names like "CH1", "CH2"
let currentMode = 'strain'; // 'strain' or 'force'
let myChart = null;

let segments = [
    { id: 1, t_start: 0, t_end: 9999, params: {} }
];
let activeSegmentId = 1;

// 默认参数配置
const DEFAULT_STRAIN = { "CH1": 1.0, "CH2": 1.0, "CH3": 0.2099, "CH4": 1.0, "CH5": 1.0, "CH6": 1.0, "CH7": 1.0, "CH8": 1.0 };
const DEFAULT_FORCE = { "FX": 1.0, "FY": 0.667, "FZ": 1.0 };

// 初始化 ECharts
function initChart() {
    const dom = document.getElementById('mainChart');
    myChart = echarts.init(dom);
    window.addEventListener('resize', () => myChart.resize());
}

// 处理 CSV 上传
function processCSVData(data) {
    if(data.length === 0) return;
    
    // 提取时间和通道列
    let keys = Object.keys(data[0]);
    let timeKey = keys.find(k => k.toLowerCase().includes('time') || k.includes('时间'));
    chColumns = keys.filter(k => k.startsWith('CH')).sort((a, b) => {
        return parseInt(a.replace('CH', '')) - parseInt(b.replace('CH', ''));
    });
    
    timeData = data.map(row => row[timeKey] || 0);
    
    // 整理为按通道的数组
    rawData = {};
    chColumns.forEach(ch => {
        rawData[ch] = data.map(row => row[ch] || 0);
    });
    
    // 重置片段
    let maxT = timeData[timeData.length - 1];
    segments = [
        { id: 1, t_start: 0, t_end: maxT, params: currentMode === 'strain' ? {...DEFAULT_STRAIN} : {...DEFAULT_FORCE} }
    ];
    activeSegmentId = 1;
    
    document.getElementById('fileStatus').innerText = `已加载 ${data.length} 行`;
    document.getElementById('segmentPlaceholder').style.display = 'none';
    document.getElementById('segmentEditor').style.display = 'block';
    
    renderSegmentsList();
    renderSliders();
    processAndPlot();
}

document.getElementById('csvFileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('fileStatus').innerText = `加载中: ${file.name}`;
    
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            processCSVData(results.data);
        }
    });
});

document.getElementById('presetDataSelect').addEventListener('change', function(e) {
    const url = e.target.value;
    if (!url) return;
    
    // 自动切换模式
    if (url.includes('strain')) {
        document.querySelector('input[name="tuneMode"][value="strain"]').checked = true;
        currentMode = 'strain';
    } else if (url.includes('force')) {
        document.querySelector('input[name="tuneMode"][value="force"]').checked = true;
        currentMode = 'force';
    }
    
    document.getElementById('fileStatus').innerText = `正在加载预设数据...`;
    Papa.parse(url, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            processCSVData(results.data);
        },
        error: function(err) {
            document.getElementById('fileStatus').innerText = `加载失败: ${err}. 请确保在使用HTTP服务器运行(如 python -m http.server)`;
            alert("加载预设数据失败。这通常是因为您直接双击打开了HTML文件，导致浏览器跨域限制。\n请在 web 文件夹下运行：\npython -m http.server 8000\n然后访问 http://localhost:8000 即可。");
        }
    });
});

// 切换模式
document.querySelectorAll('input[name="tuneMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentMode = e.target.value;
        if(timeData.length > 0) {
            let maxT = timeData[timeData.length - 1];
            segments = [
                { id: 1, t_start: 0, t_end: maxT, params: currentMode === 'strain' ? {...DEFAULT_STRAIN} : {...DEFAULT_FORCE} }
            ];
            activeSegmentId = 1;
            renderSegmentsList();
            renderSliders();
            processAndPlot();
        }
    });
});

// ==========================================
// UI 渲染与交互
// ==========================================

function renderSegmentsList() {
    const list = document.getElementById('segmentsList');
    list.innerHTML = '';
    
    segments.sort((a, b) => a.t_start - b.t_start);
    
    segments.forEach((seg, index) => {
        const item = document.createElement('div');
        item.className = `segment-item ${seg.id === activeSegmentId ? 'active' : ''}`;
        item.innerHTML = `
            <span>片段 ${index+1} [${seg.t_start.toFixed(1)}s - ${seg.t_end.toFixed(1)}s]</span>
            ${segments.length > 1 ? `<button onclick="deleteSegment(${seg.id})">×</button>` : ''}
        `;
        item.onclick = (e) => {
            if(e.target.tagName !== 'BUTTON') {
                activeSegmentId = seg.id;
                renderSegmentsList();
                renderSliders();
            }
        };
        list.appendChild(item);
    });
    updateJSON();
}

document.getElementById('addSegmentBtn').onclick = () => {
    if(timeData.length === 0) return;
    let maxT = timeData[timeData.length - 1];
    let newId = Date.now();
    
    // 获取当前活动片段的参数复制过来
    let activeSeg = segments.find(s => s.id === activeSegmentId);
    let newParams = activeSeg ? {...activeSeg.params} : (currentMode === 'strain' ? {...DEFAULT_STRAIN} : {...DEFAULT_FORCE});
    
    // 如果上一个片段的结束时间不是最大时间，接着往后开辟；否则分成两半
    let lastSeg = segments[segments.length - 1];
    if (lastSeg.t_end < maxT) {
        segments.push({ id: newId, t_start: lastSeg.t_end, t_end: maxT, params: newParams });
    } else {
        let mid = (lastSeg.t_start + lastSeg.t_end) / 2;
        lastSeg.t_end = mid;
        segments.push({ id: newId, t_start: mid, t_end: maxT, params: newParams });
    }
    
    activeSegmentId = newId;
    renderSegmentsList();
    renderSliders();
    processAndPlot();
};

window.deleteSegment = (id) => {
    segments = segments.filter(s => s.id !== id);
    if(activeSegmentId === id && segments.length > 0) {
        activeSegmentId = segments[0].id;
    }
    renderSegmentsList();
    renderSliders();
    processAndPlot();
};

function renderSliders() {
    const container = document.getElementById('slidersContainer');
    container.innerHTML = '';
    
    let activeSeg = segments.find(s => s.id === activeSegmentId);
    if(!activeSeg) return;
    
    // 设置时间输入框
    document.getElementById('segStart').value = activeSeg.t_start;
    document.getElementById('segEnd').value = activeSeg.t_end;
    
    // 监听时间输入变化
    document.getElementById('segStart').onchange = (e) => {
        activeSeg.t_start = parseFloat(e.target.value) || 0;
        renderSegmentsList();
        processAndPlot();
    };
    document.getElementById('segEnd').onchange = (e) => {
        activeSeg.t_end = parseFloat(e.target.value) || 0;
        renderSegmentsList();
        processAndPlot();
    };
    
    let params = activeSeg.params;
    
    for(let key in params) {
        const val = params[key];
        const group = document.createElement('div');
        group.className = 'slider-group';
        
        const min = 0.0;
        const max = key.includes('F') ? 5.0 : 3.0; // Force coefficients usually larger, strain usually ~1.0
        const step = 0.01;
        
        group.innerHTML = `
            <div class="slider-header">
                <span>${key} 增益</span>
                <span class="val" id="val_${key}">${val.toFixed(3)}</span>
            </div>
            <input type="range" id="slider_${key}" min="${min}" max="${max}" step="${step}" value="${val}">
        `;
        
        container.appendChild(group);
        
        document.getElementById(`slider_${key}`).addEventListener('input', (e) => {
            let newVal = parseFloat(e.target.value);
            document.getElementById(`val_${key}`).innerText = newVal.toFixed(3);
            activeSeg.params[key] = newVal;
            updateJSON();
            processAndPlot();
        });
    }
}

function updateJSON() {
    const jsonOut = document.getElementById('jsonOutput');
    // 简化输出供用户复制
    let outArr = segments.map(s => ({
        t_start: parseFloat(s.t_start.toFixed(2)),
        t_end: parseFloat(s.t_end.toFixed(2)),
        params: s.params
    }));
    jsonOut.value = JSON.stringify(outArr, null, 2);
}

document.getElementById('copyBtn').onclick = () => {
    const jsonOut = document.getElementById('jsonOutput');
    jsonOut.select();
    document.execCommand('copy');
    const btn = document.getElementById('copyBtn');
    btn.innerText = '已复制！';
    setTimeout(() => btn.innerText = '复制代码', 2000);
};

// ==========================================
// 核心处理与图表渲染
// ==========================================

function getParamsForTime(t) {
    // 寻找适用的片段，找不到则返回第一个
    for(let s of segments) {
        if(t >= s.t_start && t <= s.t_end) return s.params;
    }
    return segments[0].params;
}

function processAndPlot() {
    if(timeData.length === 0 || !myChart) return;
    
    if(currentMode === 'strain') {
        plotStrain();
    } else {
        plotForce();
    }
}

function plotStrain() {
    let series = [];
    
    // 只处理前8个通道
    let activeChs = chColumns.slice(0, 8);
    
    activeChs.forEach(ch => {
        let raw = rawData[ch];
        let {v_corrected} = voltage_baseline_correction(raw);
        let r0_corr = medianArr(v_corrected.slice(0, 10)) || 1.0;
        
        let processed = [];
        for(let i=0; i<v_corrected.length; i++) {
            let v_true = calc_v_true(v_corrected[i], r0_corr);
            let t = timeData[i];
            let params = getParamsForTime(t);
            let gain = params[ch] !== undefined ? params[ch] : 1.0;
            let angle = angle_fn(v_true, gain);
            processed.push(angle);
        }
        
        series.push({
            name: ch + ' Angle',
            type: 'line',
            showSymbol: false,
            data: processed,
            smooth: true
        });
    });
    
    myChart.setOption({
        title: { text: '应变角度 (Strain Angle) 解析' },
        tooltip: { trigger: 'axis' },
        legend: { data: series.map(s => s.name), top: 30 },
        xAxis: { type: 'category', data: timeData.map(t => t.toFixed(2)) },
        yAxis: { type: 'value', name: 'Angle' },
        series: series
    }, true); // true to clear previous
}

function plotForce() {
    let series = [];
    
    // 力传感器通常是 4个通道为1组。这里简单示例为假设有 CH9-CH12 等组成力传感器。
    // 如果没有，直接把所有通道当作力传感器的输入来展示，比如 S1_Fx 组合 CH1~CH4
    let numSensors = Math.floor(chColumns.length / 4);
    if(numSensors === 0) return;
    
    let fxData = [], fyData = [], fzData = [];
    
    // 以第一组传感器(S1)为例展示 (前4个通道)
    let chs = chColumns.slice(0, 4);
    let v_corr_arr = chs.map(ch => voltage_baseline_correction(rawData[ch]).v_corrected);
    let r0_arr = v_corr_arr.map(arr => medianArr(arr.slice(0, 10)) || 1.0);
    
    for(let i=0; i<timeData.length; i++) {
        let P = [];
        for(let j=0; j<4; j++) {
            let v_true = calc_v_true(v_corr_arr[j][i], r0_arr[j]);
            P.push(pressure_fn(v_true));
        }
        
        let t = timeData[i];
        let params = getParamsForTime(t);
        let fx_k = params.FX || 1.0;
        let fy_k = params.FY || 0.667;
        let fz_k = params.FZ || 1.0;
        
        // P[0]=CH1, P[1]=CH2, P[2]=CH3, P[3]=CH4
        let fx = fx_k * (P[1] + P[3] - P[0] - P[2]);
        let fy = fy_k * (P[0] + P[1] - P[2] - P[3]);
        let fz = fz_k * (P[0] + P[1] + P[2] + P[3]);
        
        fxData.push(fx);
        fyData.push(fy);
        fzData.push(fz);
    }
    
    series = [
        { name: 'S1_Fx', type: 'line', showSymbol: false, data: fxData },
        { name: 'S1_Fy', type: 'line', showSymbol: false, data: fyData },
        { name: 'S1_Fz', type: 'line', showSymbol: false, data: fzData }
    ];
    
    myChart.setOption({
        title: { text: '三维力 (3D Force) 解析 (以 Sensor 1 为例)' },
        tooltip: { trigger: 'axis' },
        legend: { data: ['S1_Fx', 'S1_Fy', 'S1_Fz'], top: 30 },
        xAxis: { type: 'category', data: timeData.map(t => t.toFixed(2)) },
        yAxis: { type: 'value', name: 'Force' },
        series: series
    }, true);
}

// 页面加载完成初始化
window.onload = () => {
    initChart();
};
