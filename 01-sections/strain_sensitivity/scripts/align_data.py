import os
import pandas as pd
import numpy as np
from scipy.interpolate import interp1d
import glob
import re

# =================配置=================
# 获取脚本所在目录的绝对路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 根目录为 scripts 的上一级，即 "应变片-灵敏度" 文件夹
BASE_DIR = os.path.dirname(SCRIPT_DIR)

RAW_DIR = os.path.join(BASE_DIR, "raw")
OUTPUT_DIR = os.path.join(BASE_DIR, "processed")
TARGET_HZ = 10
ENCODINGS = ['utf-8-sig', 'gbk', 'utf-8']
# =======================================

def get_column(df, pattern):
    """根据模式匹配列名"""
    for col in df.columns:
        if re.search(pattern, col):
            return col
    return None

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
    res_time_col = get_column(df_res, r'时间')
    res_val_col = get_column(df_res, r'电阻')
    
    fat_time_col = get_column(df_fat, r'时间')
    fat_val_col = get_column(df_fat, r'应变\(%\)') # 匹配 "应变(%)"
    
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

    # 生成 10Hz 的新时间轴
    # 按照 0.1s 步长
    new_times = np.arange(t_start, t_end, 1.0/TARGET_HZ)
    
    # 插值函数
    f_res = interp1d(df_res[res_time_col], df_res[res_val_col], kind='linear', fill_value="extrapolate")
    f_fat = interp1d(df_fat[fat_time_col], df_fat[fat_val_col], kind='linear', fill_value="extrapolate")
    
    # 合并数据
    aligned_df = pd.DataFrame({
        'Time (s)': new_times,
        'Resistance (Ohm)': f_res(new_times),
        'Strain (%)': f_fat(new_times)
    })
    
    # 导出
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    save_path = os.path.join(OUTPUT_DIR, output_name)
    aligned_df.to_csv(save_path, index=False, encoding='utf-8-sig')
    print(f"成功导出: {output_name}")

def main():
    # 获取所有“电阻”文件
    res_files = glob.glob(os.path.join(RAW_DIR, "*.电阻*.csv"))
    
    processed_count = 0
    for res_path in res_files:
        # 构建对应的“疲劳机”文件名
        # 例如: 1.1.电阻.csv -> 1.1.疲劳机.csv
        # 1.1.电阻.xlb1.csv -> 1.1.疲劳机.xlb1.csv
        fat_path = res_path.replace("电阻", "疲劳机")
        
        if os.path.exists(fat_path):
            output_name = os.path.basename(res_path).replace("电阻", "aligned")
            process_file_pair(res_path, fat_path, output_name)
            processed_count += 1
        else:
            print(f"未找到匹配的疲劳机文件: {res_path}")

    print(f"\n处理完成！共对齐 {processed_count} 组数据。")

if __name__ == "__main__":
    main()
