import pandas as pd
import numpy as np
from pathlib import Path
import os
import sys

# 设置工作目录
SCRIPT_DIR = Path(r"d:\whr\dev\2026\glove\01-sections\fig4_reconstruction\scripts")
BASE_DIR = SCRIPT_DIR.parent
PROCESSED_DIR = BASE_DIR / "processed"
TUNING_PUBLIC_DIR = Path(r"d:\whr\dev\2026\glove\05-hyperparameter-tuning\web\public\data\tuning_raw")

# 传感器数据目录
TRIBO_DIR = PROCESSED_DIR / "figure_tribo_array"
FORCE_DIR = PROCESSED_DIR / "figure_3d_force"
STRAIN_DIR = PROCESSED_DIR / "figure_strain_array"

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

def main():
    if not TUNING_PUBLIC_DIR.exists():
        TUNING_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    for idx, (t_s, f_s, s_s) in enumerate(ACTION_GROUPS):
        print(f"Processing Action {idx+1}...")
        try:
            df_tribo = pd.read_csv(TRIBO_DIR / f"5-5.{t_s}.csv")
            df_force = pd.read_csv(FORCE_DIR / f"5-5.{f_s}.csv") # Raw
            df_strain = pd.read_csv(STRAIN_DIR / f"5-5.{s_s}.csv") # Raw
        except Exception as e:
            print(f"Skipping Action {idx+1}: {e}")
            continue
            
        t_end = min(df_tribo['Relative_Time'].max(), df_force['Relative_Time'].max(), df_strain['Relative_Time'].max())
        new_time = np.arange(0, t_end, TIME_STEP)
        
        res = pd.DataFrame({'Relative_Time': new_time})
        
        # 1. Strain (CH1 to CH8)
        for i in range(1, 9):
            col = f"CH{i}"
            if col in df_strain.columns:
                res[f"Strain_{col}"] = np.interp(new_time, df_strain['Relative_Time'], df_strain[col])
            else:
                res[f"Strain_{col}"] = 0.0
                
        # 2. Force (CH9 to CH64)
        for i in range(9, 65):
            col = f"CH{i}"
            if col in df_force.columns:
                res[f"Force_{col}"] = np.interp(new_time, df_force['Relative_Time'], df_force[col])
            else:
                res[f"Force_{col}"] = 0.0
                
        # 3. Tribo (CH1 to CH8)
        for i in range(1, 9):
            col = f"CH{i}"
            if col in df_tribo.columns:
                res[f"Tribo_{col}"] = np.interp(new_time, df_tribo['Relative_Time'], df_tribo[col])
            else:
                res[f"Tribo_{col}"] = 0.0
                
        out_path = TUNING_PUBLIC_DIR / f"action_{idx+1}.csv"
        res.to_csv(out_path, index=False)
        print(f"Saved {out_path}")

if __name__ == "__main__":
    main()
