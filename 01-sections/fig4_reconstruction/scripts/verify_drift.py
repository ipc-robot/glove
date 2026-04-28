import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import sys
from pathlib import Path
import polars as pl
import time

# 尝试解决 Windows 控制台编码问题
try:
    if sys.stdout.encoding.lower() != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
except Exception:
    pass

from calibration_utils import (
    pressure_fn, 
    calc_v_true, 
    voltage_baseline_correction, 
    angle_fn,
    STRAIN_CALIBRATION
)

def verify_force(base_dir, render_dir):
    """
    针对 3D Force 传感器的 56 个通道进行漂移验证
    """
    data_path = base_dir / 'processed/figure_3d_force/5-5.m.csv'
    if not data_path.exists():
        print(f"   [!] Force raw slice not found: {data_path}. Skipping.")
        return
    
    # 使用 polars 加速读取
    df_pl = pl.read_csv(data_path)
    time_rel = df_pl['Relative_Time'].to_numpy()
    ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
    ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
    
    rows, cols = 7, 8 # 56 通道
    
    fig1, axes1 = plt.subplots(rows, cols, figsize=(24, 18))
    fig1.suptitle('56-Channel Force Voltage Verification: Raw vs Drift Baseline', 
                  fontsize=20, fontweight='bold', y=0.98)
    
    fig2, axes2 = plt.subplots(rows, cols, figsize=(24, 18))
    fig2.suptitle('56-Channel Force Pressure Verification: Raw kPa vs Corrected kPa', 
                  fontsize=20, fontweight='bold', y=0.98)

    print(f"   > Processing {len(ch_cols)} force channels...")
    
    for i, ch in enumerate(ch_cols):
        r, c = i // cols, i % cols
        v_raw = df_pl[ch].to_numpy()
        
        # 核心算法：漂移修正
        v_corr, v_drift = voltage_baseline_correction(v_raw)
        
        # 压力转换 (对比修正前后)
        r0_raw = np.median(v_raw[:10])
        vt_raw = calc_v_true(v_raw, r0_raw)
        p_raw = pressure_fn(vt_raw)
        
        r0_corr = np.median(v_corr[:10])
        vt_corr = calc_v_true(v_corr, r0_corr)
        p_corr = pressure_fn(vt_corr)

        # 绘制电压对比 (图 1)
        ax_v = axes1[r, c]
        ax_v.plot(time_rel, v_raw, color='#bbbbbb', label='Raw', lw=0.8)
        ax_v.plot(time_rel, v_drift, 'r--', label='Drift', lw=1.0)
        ax_v.plot(time_rel, v_corr, '#3498db', label='Corrected', alpha=0.7, lw=0.9)
        ax_v.set_title(f"{ch}", fontsize=9, pad=1)
        ax_v.tick_params(labelsize=7)
        if c == 0: ax_v.set_ylabel('mV', fontsize=8)
        if r == rows - 1: ax_v.set_xlabel('s', fontsize=8)
        if i == 0: ax_v.legend(fontsize=7, loc='upper right')

        # 绘制压力对比 (图 2)
        ax_p = axes2[r, c]
        ax_p.plot(time_rel, p_raw, color='#bbbbbb', label='Raw', lw=0.8)
        ax_p.plot(time_rel, p_corr, '#e67e22', label='Corrected', lw=1.0)
        ax_p.set_title(f"{ch}", fontsize=9, pad=1)
        ax_p.tick_params(labelsize=7)
        if c == 0: ax_p.set_ylabel('kPa', fontsize=8)
        if r == rows - 1: ax_p.set_xlabel('s', fontsize=8)
        if i == 0: ax_p.legend(fontsize=7, loc='upper right')

    fig1.tight_layout(rect=[0.02, 0.02, 1, 0.97])
    fig2.tight_layout(rect=[0.02, 0.02, 1, 0.97])
    
    # 适当降低 DPI 以加速保存大图
    fig1.savefig(render_dir / 'verification_force_voltages.png', dpi=120)
    fig2.savefig(render_dir / 'verification_force_pressures.png', dpi=120)
    plt.close(fig1)
    plt.close(fig2)
    print("   ✅ Force verification plots generated.")

def verify_strain(base_dir, render_dir):
    """
    针对 Strain 传感器的 8 个通道进行漂移验证
    """
    data_path = base_dir / 'processed/figure_strain_array/5-5.s.csv'
    if not data_path.exists():
        print(f"   [!] Strain raw slice not found: {data_path}. Skipping.")
        return
        
    df_pl = pl.read_csv(data_path)
    time_rel = df_pl['Relative_Time'].to_numpy()
    ch_cols = [c for c in df_pl.columns if c.startswith('CH')]
    ch_cols.sort(key=lambda x: int(x.replace('CH', '')))
    
    rows, cols = 2, 4 # 8 通道布局
    
    fig1, axes1 = plt.subplots(rows, cols, figsize=(18, 9))
    fig1.suptitle('8-Channel Strain Voltage Verification: Raw vs Drift Baseline', 
                  fontsize=18, fontweight='bold', y=0.98)
    
    fig2, axes2 = plt.subplots(rows, cols, figsize=(18, 9))
    fig2.suptitle('8-Channel Strain Angle Verification: Raw Angle vs Corrected Angle', 
                  fontsize=18, fontweight='bold', y=0.98)

    print(f"   > Processing {len(ch_cols)} strain channels...")

    for i, ch in enumerate(ch_cols):
        r, c = i // cols, i % cols
        v_raw = df_pl[ch].to_numpy()
        
        # 核心算法：漂移修正
        v_corr, v_drift = voltage_baseline_correction(v_raw)
        gain = STRAIN_CALIBRATION.get(ch, 1.0)

        # 角度转换 (对比修正前后)
        r0_raw = np.median(v_raw[:10])
        vt_raw = calc_v_true(v_raw, r0_raw)
        a_raw = angle_fn(vt_raw, gain=gain)
        
        r0_corr = np.median(v_corr[:10])
        vt_corr = calc_v_true(v_corr, r0_corr)
        a_corr = angle_fn(vt_corr, gain=gain)

        # 绘制电压对比 (图 1)
        ax_v = axes1[r, c]
        ax_v.plot(time_rel, v_raw, color='#bbbbbb', label='Raw', lw=1.2)
        ax_v.plot(time_rel, v_drift, 'r--', label='Drift', lw=1.5)
        ax_v.plot(time_rel, v_corr, '#3498db', label='Corrected', alpha=0.8, lw=1.2)
        ax_v.set_title(f"Strain {ch}", fontsize=11)
        if c == 0: ax_v.set_ylabel('mV', fontsize=10)
        if i == 0: ax_v.legend(fontsize=9)

        # 绘制角度对比 (图 2)
        ax_a = axes2[r, c]
        ax_a.plot(time_rel, a_raw, color='#bbbbbb', label='Raw', lw=1.2)
        ax_a.plot(time_rel, a_corr, '#27ae60', label='Corrected', lw=1.5)
        ax_a.set_title(f"Strain {ch}", fontsize=11)
        if c == 0: ax_a.set_ylabel('Degrees', fontsize=10)
        if i == 0: ax_a.legend(fontsize=9)

    fig1.tight_layout(rect=[0.02, 0.02, 1, 0.97])
    fig2.tight_layout(rect=[0.02, 0.02, 1, 0.97])
    
    fig1.savefig(render_dir / 'verification_strain_voltages.png', dpi=120)
    fig2.savefig(render_dir / 'verification_strain_angles.png', dpi=120)
    plt.close(fig1)
    plt.close(fig2)
    print("   ✅ Strain verification plots generated.")

if __name__ == "__main__":
    start_time = time.time()
    base_dir = Path(__file__).parent.parent
    render_dir = base_dir / 'renders/verification'
    render_dir.mkdir(exist_ok=True, parents=True)
    
    print("\n🚀 Starting drift verification pipeline...")
    verify_force(base_dir, render_dir)
    verify_strain(base_dir, render_dir)
    
    duration = time.time() - start_time
    print(f"\n🎉 All verifications finished in {duration:.2f}s successfully!\n")
