import polars as pl
import numpy as np
from pathlib import Path
from calibration_core import (
    voltage_baseline_correction,
    calc_v_true,
    angle_fn,
    STRAIN_CALIBRATION
)

def process_strain(input_csv: str, output_csv: str, strain_gains: dict = None):
    if strain_gains is None:
        strain_gains = STRAIN_CALIBRATION
        
    print(f"Loading {input_csv}...")
    df_pl = pl.read_csv(input_csv)
    
    time_cols = [c for c in df_pl.columns if any(k in c.lower() for k in ['时间', 'time', 'relative_time'])]
    if not time_cols:
        time_rel = np.arange(df_pl.height)
    else:
        time_rel = df_pl.get_column(time_cols[0]).to_numpy()
        
    ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
    ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
    
    if len(ch_cols) == 0:
        print("Error: No CH columns found.")
        return
        
    print(f"Processing {len(ch_cols)} strain sensors...")
    sensor_angles = {}
    
    for col_name in ch_cols:
        raw_data = df_pl.get_column(col_name).to_numpy()
        v_corrected, _ = voltage_baseline_correction(raw_data)
        
        r0_corr = np.median(v_corrected[:10])
        if r0_corr == 0: 
            r0_corr = 1.0
            
        v_true = calc_v_true(v_corrected, r0_corr)
        
        gain = strain_gains.get(col_name, 1.0)
        sensor_angles[f"{col_name}_Angle"] = angle_fn(v_true, gain=gain)
        
    out_dict = {'Relative_Time': time_rel}
    out_dict.update(sensor_angles)
    df_out = pl.DataFrame(out_dict)
    
    df_out.write_csv(output_csv)
    print(f"Success! Output saved to {output_csv}")

if __name__ == "__main__":
    # Example usage:
    # 调整超参数
    custom_strain_gains = {
        "CH1": 1.0,
        "CH2": 1.0,
        "CH3": 0.2099, # 进行增益缩放
        "CH4": 1.0,
        "CH5": 1.0,
        "CH6": 1.0,
        "CH7": 1.0,
        "CH8": 1.0,
    }
    
    # 替换为你实际的相对路径
    input_file = "test_strain_input.csv"
    output_file = "test_strain_output.csv"
    
    if Path(input_file).exists():
        process_strain(input_file, output_file, custom_strain_gains)
    else:
        print(f"Please provide a valid input file path. {input_file} not found.")
