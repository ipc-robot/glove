import numpy as np

def pressure_fn(v):
    """
    非线性压力转换函数：将校准后的电压变化率 v 转为压力 P (kPa)
    """
    return 7.78 * v / (0.98 - v)

def calc_v_true(v_val, r_ref, vcc_mv=5000.0):
    """
    计算真实的物理响应（电阻相对变化率）
    v_val: 测量电压 (mV)
    r_ref: 基准参考值 (mV)
    """
    return (vcc_mv * (r_ref - v_val)) / (r_ref * (vcc_mv - v_val))

def voltage_baseline_correction(y):
    """
    在电压级别进行基线校准
    y: 原始电压序列 (CHx)
    返回: (修正后的电压, 估算的电压漂移线)
    """
    n = len(y)
    if n < 50: 
        return y, np.full(n, np.median(y))
    
    # 1. 提取首尾基准
    v_start = np.median(y[:20])
    v_end = np.median(y[-20:])
    
    # 2. 寻找起始点：利用矢量化操作代替手动循环
    noise_std = np.std(y[:50])
    thresh = max(noise_std * 5, 2.0) # 至少偏离 2mV 才算开始
    
    # 截取中间部分进行比较，避免首尾基准影响
    diff = np.abs(y[20:-20] - v_start)
    mask = diff > thresh
    if np.any(mask):
        change_idx = np.argmax(mask) + 20
    else:
        change_idx = 0
            
    # 3. 构造电压漂移线
    v_drift = np.zeros(n)
    if change_idx == 0:
        # 如果全过程没找到剧烈起始点，默认线性漂移
        v_drift = np.linspace(v_start, v_end, n)
    else:
        # 起始点前：绝对水平
        v_drift[:change_idx] = v_start
        # 起始点后：线性连接到终点
        v_drift[change_idx:] = np.linspace(v_start, v_end, n - change_idx)
        
    # 修正电压：原始电压 - (漂移值 - 初始参考值)
    v_corrected = y - (v_drift - v_start)
    
    return v_corrected, v_drift
# --- 应变片通道增益校准字典 ---
# key: 通道名称 (如 "CH3"), value: 增益系数 (Gain)
# 默认增益为 1.0。若某个通道信号过大/过小，可在此处定义补偿系数。
STRAIN_CALIBRATION = {
    "CH1": 1.0,
    "CH2": 1.0,
    "CH3": 0.2099, # 缩放 CH3 以对齐其余通道的平均最大变化值
    "CH4": 1.0,
    "CH5": 1.0,
    "CH6": 1.0,
    "CH7": 1.0,
    "CH8": 1.0,
}

# --- 3D 力传感器解析特征系数 (Fx, Fy, Fz 比例系数) ---
FORCE_COEFFS = {
    "FX": 1.0,
    "FY": 1.0,
    "FZ": 1.0,
}

# --- 摩擦电通道增益补偿 (默认 1.0) ---
TRIBO_CALIBRATION = {
    # 可以在此添加特定通道的增益，如 "CH1": 1.1
}

def angle_fn(v_true, gain=1.0):
    """
    应变物理公式转换：电阻相对变化率 v_true -> 弯曲角度 Angle
    gain: 通道增益补偿系数
    """
    # 应用增益补偿 (灵敏度校正)
    v_true_corr = v_true * gain
    
    # 基于 R-应变% 标定公式：e 定义为应变 %
    e = 0.53 * (v_true_corr**3) - 3.43 * (v_true_corr**2) + 27.74 * v_true_corr
    angle = e * (90.0 / 85.0) * 100
    return angle
