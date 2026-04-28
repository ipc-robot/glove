import polars as pl
import numpy as np
from pathlib import Path

def calculate_stats():
    base_dir = Path("d:/whr/dev/2026/glove/01-sections/fig4_reconstruction/processed/figure_strain_array")
    slices = ["s", "t", "u", "v", "w", "x"]
    
    all_max_changes = []
    
    for s in slices:
        p = base_dir / f"5-5.{s}.csv"
        if not p.exists(): continue
        
        # 使用 polars 读取
        df = pl.read_csv(p)
        ch_cols = [f"CH{i}" for i in range(1, 9)]
        
        # 计算每个通道在该 slice 中的最大波动 (max - min)
        # 用 polars 聚合计算
        agg_exprs = [(pl.col(col).max() - pl.col(col).min()).alias(col) for col in ch_cols]
        stats = df.select(agg_exprs).to_dicts()[0]
        all_max_changes.append(stats)
        
    if not all_max_changes:
        print("No data found.")
        return

    # 对所有 slice 的最大波动取平均
    df_changes = pl.DataFrame(all_max_changes)
    mean_changes = df_changes.mean()
    
    print("\n--- 各通道平均最大电压变化 (mV) ---")
    mean_dict = mean_changes.to_dicts()[0]
    for col, val in mean_dict.items():
        print(f"{col}: {val:.2f}")
    
    # 排除 CH3
    others = [f"CH{i}" for i in [1, 2, 4, 5, 6, 7, 8]]
    avg_others = np.mean([mean_dict[c] for c in others])
    ch3_val = mean_dict["CH3"]
    
    scale_factor = avg_others / ch3_val if ch3_val != 0 else 1.0
    
    print(f"\n非 CH3 通道的平均变化值: {avg_others:.2f}")
    print(f"CH3 的变化值: {ch3_val:.2f}")
    print(f"建议 CH3 缩放比例 (Gain): {scale_factor:.4f}")

if __name__ == "__main__":
    calculate_stats()
