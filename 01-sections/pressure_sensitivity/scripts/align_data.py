import os
import pandas as pd
import numpy as np
from scipy.interpolate import interp1d
import glob
import re
from scipy import signal
import matplotlib.pyplot as plt

# =================配置=================
# 获取脚本所在目录的绝对路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 根目录为 scripts 的上一级，即 "压力传感器-灵敏度" 文件夹
BASE_DIR = os.path.dirname(SCRIPT_DIR)

RAW_DIR = os.path.join(BASE_DIR, "raw")
OUTPUT_DIR = os.path.join(BASE_DIR, "processed")
TARGET_HZ = 50
ENCODINGS = ['utf-8-sig', 'gbk', 'utf-8']
# =======================================

def get_column(df, pattern):
    """根据模式匹配列名"""
    for col in df.columns:
        if re.search(pattern, col):
            return col
    return None

def find_time_lag(t1, v1, t2, v2, fs):
    """
    使用互相关寻找 v1 和 v2 之间的滞后时间。
    v1: 电阻信号 (Resistance)
    v2: 载荷信号 (Load)
    fs: 采样频率
    """
    # 插值到统一的时间网格进行互相关计算
    t_start = max(t1.min(), t2.min())
    t_end = min(t1.max(), t2.max())
    t_common = np.arange(t_start, t_end, 1/fs)
    
    f1 = interp1d(t1, v1, kind='linear', fill_value="extrapolate")
    f2 = interp1d(t2, v2, kind='linear', fill_value="extrapolate")
    
    s1 = f1(t_common)
    s2 = f2(t_common)
    
    # 标准化信号 (Z-score)
    s1_norm = (s1 - np.mean(s1)) / (np.std(s1) + 1e-9)
    s2_norm = (s2 - np.mean(s2)) / (np.std(s2) + 1e-9)
    
    # 载荷(负值)增加(变小)时，电阻也减小，两者是正相关
    corr = signal.correlate(s2_norm, s1_norm, mode='full')
    lags = signal.correlation_lags(len(s2_norm), len(s1_norm), mode='full')
    
    lag_idx = np.argmax(corr)
    lag_samples = lags[lag_idx]
    lag_time = lag_samples / fs
    
    return lag_time, t_common, s1, s2, corr, lags

def process_file_pair(res_path, fat_path, output_name):
    print(f"正在处理: {os.path.basename(res_path)} <-> {os.path.basename(fat_path)}")
    
    # 尝试不同编码读取文件
    df_res = None
    for enc in ENCODINGS:
        try:
            df_res = pd.read_csv(res_path, encoding=enc)
            break
        except Exception:
            continue
            
    df_fat = None
    for enc in ENCODINGS:
        try:
            df_fat = pd.read_csv(fat_path, encoding=enc)
            break
        except Exception:
            continue
            
    if df_res is None or df_fat is None:
        print(f"错误: 无法读取文件 {res_path} 或 {fat_path}")
        return

    # 识别关键列
    res_time_col = get_column(df_res, r'Relative Time')
    res_val_col = get_column(df_res, r'Reading')
    
    fat_time_col = get_column(df_fat, r'Time/s')
    fat_val_col = get_column(df_fat, r'载荷/N') # 匹配 "载荷/N"
    
    if not all([res_time_col, res_val_col, fat_time_col, fat_val_col]):
        print(f"错误: 关键列缺失。")
        print(f"电阻列: {res_time_col}, {res_val_col}")
        print(f"疲劳机列: {fat_time_col}, {fat_val_col}")
        return

    # 获取时间交集
    t_start = max(df_res[res_time_col].min(), df_fat[fat_time_col].min())
    t_end = min(df_res[res_time_col].max(), df_fat[fat_time_col].max())
    
    if t_start >= t_end:
        print(f"警告: 时间区间无交集，跳过。")
        return

    # --- 互相关相位对齐 ---
    # 使用较短的高频插值来计算滞后
    lag_time, t_common, s1_raw, s2_raw, corr, lags = find_time_lag(
        df_res[res_time_col], df_res[res_val_col],
        df_fat[fat_time_col], df_fat[fat_val_col],
        fs=50 # 使用 50Hz 寻找更细致的相位
    )
    
    print(f"  [INFO] 检测到相位差 (Time Offset): {lag_time:.3f} s")
    
    # 修正电阻时间轴 (将电阻信号对齐到载荷信号)
    # 如果 lag_time > 0, 说明电阻信号落后，需要减去这个时间
    res_time_adjusted = df_res[res_time_col] + lag_time

    # 获取修正后的时间交集
    t_start_adj = max(res_time_adjusted.min(), df_fat[fat_time_col].min())
    t_end_adj = min(res_time_adjusted.max(), df_fat[fat_time_col].max())
    
    # 生成 10Hz 的新时间轴
    new_times = np.arange(t_start_adj, t_end_adj, 1.0/TARGET_HZ)
    
    # 插值函数 - 使用 Cubic 提高平滑度
    f_res = interp1d(res_time_adjusted, df_res[res_val_col], kind='cubic', fill_value="extrapolate")
    f_fat = interp1d(df_fat[fat_time_col], df_fat[fat_val_col], kind='cubic', fill_value="extrapolate")
    
    res_synced = f_res(new_times)
    load_synced = -f_fat(new_times) # 注意载荷可能需要反号

    # 合并数据
    aligned_df = pd.DataFrame({
        'Time (s)': new_times,
        'Resistance (Ohm)': res_synced,
        'Load (N)': load_synced
    })
    
    # --- 可视化验证 ---
    os.makedirs(os.path.join(OUTPUT_DIR, "verification"), exist_ok=True)
    plt.figure(figsize=(12, 8))
    
    # 子图1: 原始对比 (均值移除后)
    plt.subplot(2, 2, 1)
    plt.plot(t_common, (s1_raw - np.mean(s1_raw))/np.std(s1_raw), label='Res (Original)', alpha=0.7)
    plt.plot(t_common, (s2_raw - np.mean(s2_raw))/np.std(s2_raw), label='Load (Original)', alpha=0.7)
    plt.title("Original Comparison (Normalized)")
    plt.legend()
    
    # 子图2: 互相关曲线
    plt.subplot(2, 2, 2)
    plt.plot(lags / 50.0, corr)
    plt.axvline(lag_time, color='r', linestyle='--', label=f'Lag: {lag_time:.3f}s')
    plt.title("Cross-correlation")
    plt.xlabel("Lag (s)")
    plt.legend()
    
    # 子图3: 对齐后对比
    plt.subplot(2, 1, 2)
    # 为了直观验证，我们将信号展示为同向趋势：
    # 1. 载荷已取反为正压力 (Load_synced)
    # 2. 电阻取反 (-Res_synced)，代表“电阻下降量”，随压力增加而增加
    s1_viz = -(res_synced - np.mean(res_synced))/np.std(res_synced)
    s2_viz = (load_synced - np.mean(load_synced))/np.std(load_synced)
    
    plt.plot(new_times, s1_viz, label='-Resistance (Trend)', color='tab:blue')
    plt.plot(new_times, s2_viz, label='Load (Positive)', color='tab:orange', alpha=0.8)
    plt.title("Synced Comparison (Aligned Trends)")
    plt.ylabel("Normalized Amplitude")
    plt.legend()
    
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, "verification", output_name.replace(".csv", ".png")))
    plt.close()

    # 导出
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    save_path = os.path.join(OUTPUT_DIR, output_name)
    aligned_df.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"成功导出: {output_name}")

def main():
    # 获取所有“电阻”文件 (_R.csv)
    res_files = glob.glob(os.path.join(RAW_DIR, "*_R.csv"))
    
    processed_count = 0
    for res_path in res_files:
        # 构建对应的“载荷”文件名 (_F.csv)
        # 例如: raw_exp2_sensor1_R.csv -> raw_exp2_sensor1_F.csv
        fat_path = res_path.replace("_R.csv", "_F.csv")
        
        if os.path.exists(fat_path):
            output_name = os.path.basename(res_path).replace("_R", "_aligned")
            process_file_pair(res_path, fat_path, output_name)
            processed_count += 1
        else:
            print(f"未找到匹配的疲劳机文件: {res_path}")

    print(f"\n处理完成！共对齐 {processed_count} 组数据。")

if __name__ == "__main__":
    main()
