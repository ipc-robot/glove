import pandas as pd
import numpy as np
from pathlib import Path
import os
import sys

# 尝试解决 Windows 控制台编码问题
try:
    if sys.stdout.encoding.lower() != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
except Exception:
    pass

# ==============================================================================
# 🎛️ 配置与路径
# ==============================================================================

# 基础目录设置
SCRIPT_DIR = Path(__file__).parent
BASE_DIR = SCRIPT_DIR.parent
PROCESSED_DIR = BASE_DIR / "processed"
WEB_DIR = Path(r"d:\whr\dev\2026\glove\03_progress_reports\presentations\ipc-robot.github.io")
PUBLIC_DIR = WEB_DIR / "public"

# 传感器数据目录
TRIBO_DIR = PROCESSED_DIR / "figure_tribo_array"
FORCE_DIR = PROCESSED_DIR / "figure_3d_force"
STRAIN_DIR = PROCESSED_DIR / "figure_strain_array"

# 动作分组 (Tribo, Force, Strain)
ACTION_GROUPS = [
    ("g", "m", "s"),
    ("h", "n", "t"),
    ("i", "o", "u"),
    ("j", "p", "v"),
    ("k", "q", "w"),
    ("l", "r", "x"),
]

TARGET_FPS = 30
TIME_STEP = 1.0 / TARGET_FPS

# ==============================================================================
# 🛠️ 处理函数
# ==============================================================================

def process_action_group(index, tribo_suffix, force_suffix, strain_suffix):
    print(f"[*] Processing Action {index} (suffixes: {tribo_suffix}, {force_suffix}, {strain_suffix})...")
    
    # 1. 加载数据
    try:
        df_tribo = pd.read_csv(TRIBO_DIR / f"5-5.{tribo_suffix}.csv")
        df_force = pd.read_csv(FORCE_DIR / f"5-5.{force_suffix}_resolved.csv")
        df_strain = pd.read_csv(STRAIN_DIR / f"5-5.{strain_suffix}_resolved.csv")
    except FileNotFoundError as e:
        print(f"  [!] Skip Action {index}: File not found ({e})")
        return None

    # 2. 确定统一的时间轴 (30Hz)
    t_end = min(df_tribo['Relative_Time'].max(), df_force['Relative_Time'].max(), df_strain['Relative_Time'].max())
    new_time = np.arange(0, t_end, TIME_STEP)
    
    # 3. 构造输出 DataFrame (严格控制列顺序)
    # 顺序：Timestamp, Strain_1..10, Force_1_X..14_Z, Tribo_1..8
    res_cols = ['Timestamp']
    # Strain
    for i in range(1, 11): res_cols.append(f"Strain_{i}")
    # Force
    for i in range(1, 15):
        for axis in ['X', 'Y', 'Z']: res_cols.append(f"Force_{i}_{axis}")
    # Tribo
    for i in range(1, 9): res_cols.append(f"Tribo_{i}")
    
    res = pd.DataFrame(columns=res_cols)
    res['Timestamp'] = new_time

    # 4. 数据映射与符号校正
    # Strain 映射关系 (对应 HandSkeleton.jsx 索引):
    # joints[0,1] -> Index (Strain_1, 2) <- CH3, 4
    # joints[2,3] -> Middle (Strain_3, 4) <- CH5, 6
    # joints[4,5] -> Ring (Strain_5, 6) <- CH7, 8
    # joints[6,7] -> Pinky (Strain_7, 8) <- 0
    # joints[8,9] -> Thumb (Strain_9, 10) <- CH1, 2
    
    strain_mapping = {
        "Strain_1": "CH3_Angle", "Strain_2": "CH4_Angle",  # Index
        "Strain_3": "CH5_Angle", "Strain_4": "CH6_Angle",  # Middle
        "Strain_5": "CH7_Angle", "Strain_6": "CH8_Angle",  # Ring
        "Strain_9": "CH1_Angle", "Strain_10": "CH2_Angle", # Thumb
    }
    
    for target, source in strain_mapping.items():
        if source in df_strain.columns:
            # 数据符号修正：由于原始转换公式 vt 为负值，此处取反以获得正的角度
            raw_angles = np.interp(new_time, df_strain['Relative_Time'], df_strain[source])
            res[target] = -1.0 * raw_angles
        else:
            res[target] = 0.0
    
    # 小拇指补 0
    res["Strain_7"] = 0.0
    res["Strain_8"] = 0.0

    # Force (S1_Fx/Fy/Fz to S14_Fx/Fy/Fz)
    for i in range(1, 15):
        for axis in ['x', 'y', 'z']:
            col_name = f"S{i}_F{axis}"
            target_col = f"Force_{i}_{axis.upper()}"
            if col_name in df_force.columns:
                res[target_col] = np.interp(new_time, df_force['Relative_Time'], df_force[col_name])
            else:
                res[target_col] = 0.0

    # Tribo (CH1 to CH8)
    for i in range(1, 9):
        col_name = f"CH{i}"
        if col_name in df_tribo.columns:
            res[f"Tribo_{i}"] = np.interp(new_time, df_tribo['Relative_Time'], df_tribo[col_name])
        else:
            res[f"Tribo_{i}"] = 0.0

    # 5. 保存文件
    if not PUBLIC_DIR.exists():
        PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    
    out_name = f"demo_action_{index}.csv"
    res.to_csv(PUBLIC_DIR / out_name, index=False)
    print(f"  [+] Saved to {PUBLIC_DIR / out_name} ({len(res)} frames)")
    
    return res

# ==============================================================================
# 🚀 主程序
# ==============================================================================

def main():
    all_actions = []
    for i, (t_s, f_s, s_s) in enumerate(ACTION_GROUPS):
        result = process_action_group(i, t_s, f_s, s_s)
        if result is not None:
            all_actions.append(result)

    if all_actions:
        # 默认取 Action 0
        default_csv = PUBLIC_DIR / "demo.csv"
        all_actions[0].to_csv(default_csv, index=False)
        print(f"\n[Done] Successfully updated {default_csv} with Action 0.")
        
    print("\n[All Done] All Web data preparation finished.")

if __name__ == "__main__":
    main()
