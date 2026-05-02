import polars as pl
import numpy as np
from pathlib import Path
from calibration_core import (
    voltage_baseline_correction,
    calc_v_true,
    pressure_fn,
    FORCE_COEFFS
)

def process_force(input_csv: str, output_csv: str, force_coeffs: dict = None):
    if force_coeffs is None:
        force_coeffs = FORCE_COEFFS
    
    print(f"Loading {input_csv}...")
    df_pl = pl.read_csv(input_csv)
    
    time_cols = [c for c in df_pl.columns if any(k in c.lower() for k in ['时间', 'time', 'relative_time'])]
    if not time_cols:
        time_rel = np.arange(df_pl.height)
    else:
        time_rel = df_pl.get_column(time_cols[0]).to_numpy()
        
    ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
    ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
    
    # 获取所有的力传感器通道 (通常是在应变片之后, 比如从 CH9 开始)
    # 假设这里传入的 CSV 只有力传感器的列，或者我们在外部筛选好
    if len(ch_cols) == 0:
        print("Error: No CH columns found.")
        return
        
    num_sensors = len(ch_cols) // 4
    sensor_forces = {}
    
    print(f"Processing {num_sensors} force sensors with Fx: {force_coeffs.get('FX', 1.0)}, Fy: {force_coeffs.get('FY', 1.0)}, Fz: {force_coeffs.get('FZ', 1.0)}...")
    
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
        
        fx_k = force_coeffs.get("FX", 1.0)
        fy_k = force_coeffs.get("FY", 0.667)
        fz_k = force_coeffs.get("FZ", 1.0)
        
        P1, P2, P3, P4 = P[:,0], P[:,1], P[:,2], P[:,3]
        sensor_forces[f'S{sensor_id}_Fx'] = fx_k * (P2 + P4 - P1 - P3)
        sensor_forces[f'S{sensor_id}_Fy'] = fy_k * (P1 + P2 - P3 - P4)
        sensor_forces[f'S{sensor_id}_Fz'] = fz_k * (P1 + P2 + P3 + P4)
        
    out_dict = {'Relative_Time': time_rel}
    out_dict.update(sensor_forces)
    df_out = pl.DataFrame(out_dict)
    
    df_out.write_csv(output_csv)
    print(f"Success! Output saved to {output_csv}")

if __name__ == "__main__":
    # Example usage:
    # 调整超参数
    custom_force_coeffs = {
        "FX": 1.2,
        "FY": 0.8,
        "FZ": 1.0
    }
    
    # 替换为你实际的相对路径，例如 "../01-sections/fig4_reconstruction/processed/figure_3d_force/5-5.m.csv"
    input_file = "test_force_input.csv"
    output_file = "test_force_output.csv"
    
    if Path(input_file).exists():
        process_force(input_file, output_file, custom_force_coeffs)
    else:
        print(f"Please provide a valid input file path. {input_file} not found.")
