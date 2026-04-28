import polars as pl
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import time
import sys
import numpy as np
import pandas as pd
from calibration_utils import (
    voltage_baseline_correction,
    calc_v_true,
    pressure_fn,
    angle_fn,
    STRAIN_CALIBRATION,
    FORCE_COEFFS,
    TRIBO_CALIBRATION
)

# 尝试解决 Windows 控制台编码问题
try:
    if sys.stdout.encoding.lower() != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
except Exception:
    pass

# ==============================================================================
# 🎛️ 提取任务配置
# ==============================================================================

TRIBO_FILE = "anmo_teng_processed.csv"
TRIBO_SLICES = [
    (70.776, 74.785, "g"),
    (96.0,   106.0,   "h"),
    (149.7,  152.5,   "i"),
    (210.5,  222.0,   "j"),
    (260.259, 280.5, "k"),
    (306.0,  316.7,  "l"),
]

FORCE_FILE = "anmo_pressure_processed.csv"
FORCE_SLICES = [
    (70.776, 74.785, "m"),
    (96.0,   106.0,  "n"),
    (149.7,  152.5,  "o"),
    (210.5,  222.0,  "p"),
    (260.259, 280.5, "q"),
    (306.0,  316.7,  "r"),
]

STRAIN_FILE = "anmo_pressure_processed.csv"
STRAIN_SLICES = [
    (70.776, 74.776, "s"),
    (96.0,   106.0,  "t"),
    (149.7,  152.7,  "u"),
    (210.5,  222.5,  "v"),
    (260.259, 280.259, "w"),
    (306.0,  316.0,  "x"),
]

# ==============================================================================
# ⚙️ 核心处理逻辑
# ==============================================================================

def process_tribo_slice(df_pl, t_start, suffix, rename_map, out_dir):
    try:
        if TRIBO_CALIBRATION:
            cols_to_scale = [c for c in df_pl.columns if c in TRIBO_CALIBRATION]
            if cols_to_scale:
                df_pl = df_pl.with_columns([(pl.col(c) * TRIBO_CALIBRATION.get(c, 1.0)) for c in cols_to_scale])
        save_path = out_dir / f"5-5.{suffix}.csv"
        df_pl.write_csv(save_path)
        return f"[Success] Tribo: 5-5.{suffix}.csv ({df_pl.height} rows)"
    except Exception as e:
        return f"[Error] Tribo Slice {suffix} failed: {e}"

def process_force_slice(df_pl, t_start, suffix, out_dir):
    try:
        time_rel = df_pl.get_column('Relative_Time').to_numpy()
        ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
        ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
        num_sensors = len(ch_cols) // 4
        sensor_forces = {}
        for i in range(num_sensors):
            sensor_id = i + 1
            cols = ch_cols[i*4 : (i+1)*4]
            data_raw = df_pl.select(cols).to_numpy() 
            v_corrected = np.zeros_like(data_raw)
            for j in range(4):
                temp_v_corr, _ = voltage_baseline_correction(data_raw[:, j])
                v_corrected[:, j] = temp_v_corr
            r0 = np.median(v_corrected[:10, :], axis=0)
            v_true = calc_v_true(v_corrected, r0)
            P = pressure_fn(v_true)
            fx_k, fy_k, fz_k = FORCE_COEFFS.get("FX", 1.0), FORCE_COEFFS.get("FY", 0.667), FORCE_COEFFS.get("FZ", 1.0)
            P1, P2, P3, P4 = P[:,0], P[:,1], P[:,2], P[:,3]
            sensor_forces[f'S{sensor_id}_Fx'] = fx_k * (P2 + P4 - P1 - P3)
            sensor_forces[f'S{sensor_id}_Fy'] = fy_k * (P1 + P2 - P3 - P4)
            sensor_forces[f'S{sensor_id}_Fz'] = fz_k * (P1 + P2 + P3 + P4)
        out_dict = {'Relative_Time': time_rel}
        out_dict.update(sensor_forces)
        df_out = pl.DataFrame(out_dict)
        df_out.write_csv(out_dir / f"5-5.{suffix}_resolved.csv")
        df_pl.write_csv(out_dir / f"5-5.{suffix}.csv")
        return f"[Success] Force: 5-5.{suffix}_resolved.csv ({df_out.height} rows)"
    except Exception as e:
        return f"[Error] Force Slice {suffix} failed: {e}"

def process_strain_slice(df_pl, t_start, suffix, out_dir):
    try:
        time_rel = df_pl.get_column('Relative_Time').to_numpy()
        ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
        ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
        sensor_angles = {}
        for col_name in ch_cols:
            raw_data = df_pl.get_column(col_name).to_numpy()
            v_corrected, _ = voltage_baseline_correction(raw_data)
            r0_corr = np.median(v_corrected[:10])
            if r0_corr == 0: r0_corr = 1.0
            v_true = calc_v_true(v_corrected, r0_corr)
            gain = STRAIN_CALIBRATION.get(col_name, 1.0)
            sensor_angles[f"{col_name}_Angle"] = angle_fn(v_true, gain=gain)
        out_dict = {'Relative_Time': time_rel}
        out_dict.update(sensor_angles)
        df_out = pl.DataFrame(out_dict)
        df_out.write_csv(out_dir / f"5-5.{suffix}_resolved.csv")
        df_pl.write_csv(out_dir / f"5-5.{suffix}.csv")
        return f"[Success] Strain: 5-5.{suffix}_resolved.csv ({df_out.height} rows)"
    except Exception as e:
        return f"[Error] Strain Slice {suffix} failed: {e}"

# ==============================================================================
# 🚀 主流程调度
# ==============================================================================

def main():
    base_dir = Path(__file__).parent
    raw_dir, processed_dir = base_dir.parent / "raw", base_dir.parent / "processed"
    tribo_dir, force_dir, strain_dir = processed_dir / "figure_tribo_array", processed_dir / "figure_3d_force", processed_dir / "figure_strain_array"
    for d in [tribo_dir, force_dir, strain_dir]: d.mkdir(parents=True, exist_ok=True)

    start_time = time.perf_counter()
    all_queries = []
    task_metadata = [] # list of (callback_fn, args)

    # --- 1. Tribo Queries ---
    tribo_path = raw_dir / TRIBO_FILE
    if tribo_path.exists():
        schema = pl.scan_csv(tribo_path, n_rows=0).collect_schema().names()
        source_channels = [f"CH{i}_adaptive_sg" for i in [1, 2, 3, 4, 5, 6, 8] if f"CH{i}_adaptive_sg" in schema]
        rename_map = {f"CH{i}_adaptive_sg": f"CH{i}" for i in range(1, 9) if f"CH{i}_adaptive_sg" in schema}
        read_cols = ["Time"] + list(rename_map.keys())
        lf = pl.scan_csv(tribo_path, low_memory=True).select(read_cols)
        if "CH7_adaptive_sg" not in schema and source_channels:
            lf = lf.with_columns([pl.mean_horizontal(source_channels).alias("CH7_adaptive_sg")])
            rename_map["CH7_adaptive_sg"] = "CH7"
        for t_start, t_end, suffix in TRIBO_SLICES:
            q = lf.filter((pl.col("Time") >= t_start) & (pl.col("Time") <= t_end)).with_columns([(pl.col("Time") - t_start).alias("Relative_Time")]).rename(rename_map).select(["Relative_Time"] + list(rename_map.values()))
            all_queries.append(q)
            task_metadata.append((process_tribo_slice, (t_start, suffix, rename_map, tribo_dir)))

    # --- 2. Pressure & Strain Queries ---
    pressure_path = raw_dir / FORCE_FILE
    if pressure_path.exists():
        schema = pl.scan_csv(pressure_path, n_rows=0).collect_schema().names()
        time_col = [c for c in schema if any(k in c.lower() for k in ['时间', 'time'])][0]
        ch_cols_all = sorted([c for c in schema if c.startswith('CH')], key=lambda x: int(x.replace('CH', '')))
        lf = pl.scan_csv(pressure_path, low_memory=True).select([time_col] + ch_cols_all)
        # Force
        active_chs_force = ch_cols_all[8:] if len(ch_cols_all) > 8 else []
        for t_start, t_end, suffix in FORCE_SLICES:
            q = lf.filter((pl.col(time_col) >= t_start) & (pl.col(time_col) <= t_end)).select([time_col] + active_chs_force).with_columns([(pl.col(time_col) - t_start).alias("Relative_Time")])
            all_queries.append(q)
            task_metadata.append((process_force_slice, (t_start, suffix, force_dir)))
        # Strain
        active_chs_strain = ch_cols_all[:8]
        for t_start, t_end, suffix in STRAIN_SLICES:
            q = lf.filter((pl.col(time_col) >= t_start) & (pl.col(time_col) <= t_end)).select([time_col] + active_chs_strain).with_columns([(pl.col(time_col) - t_start).alias("Relative_Time")])
            all_queries.append(q)
            task_metadata.append((process_strain_slice, (t_start, suffix, strain_dir)))

    print(f"\n🚀 Batch collecting ALL {len(all_queries)} slices from multiple sources...")
    results = pl.collect_all(all_queries)

    print(f"⚙️ Post-processing in parallel...")
    with ThreadPoolExecutor() as executor:
        futures = [executor.submit(metadata[0], results[i], *metadata[1]) for i, metadata in enumerate(task_metadata)]
        for f in futures: print(f.result())

    print(f"\n🎉 Pipeline Finished in {time.perf_counter() - start_time:.3f} seconds.\n")

if __name__ == "__main__":
    main()
