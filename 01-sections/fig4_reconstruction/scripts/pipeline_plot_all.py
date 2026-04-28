import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from pathlib import Path
import sys
from scipy.signal import savgol_filter
from concurrent.futures import ProcessPoolExecutor
import time

try:
    if sys.stdout.encoding.lower() != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
except Exception:
    pass

# ==============================================================================
# 🎛️ 全局配置与公用控制面板
# ==============================================================================
DPI = 300
COLUMNS = 3
SUBPLOT_WIDTH_CM = 6.0
SUBPLOT_HEIGHT_CM = 4.5
FONT_SIZE = 8
AXES_LINEWIDTH = 0.8

TRIBO_SLICES = ["g", "h", "i", "j", "k", "l"]
FORCE_SLICES = ["m", "n", "o", "p", "q", "r"]
STRAIN_SLICES = ["s", "t", "u", "v", "w", "x"]

def setup_plot_style():
    """配置全局绘图样式"""
    matplotlib.rcParams['font.family'] = 'sans-serif'
    matplotlib.rcParams['font.sans-serif'] = ['Arial', 'Liberation Sans', 'DejaVu Sans']
    matplotlib.rcParams['font.size'] = FONT_SIZE
    matplotlib.rcParams['axes.linewidth'] = AXES_LINEWIDTH
    matplotlib.rcParams['svg.fonttype'] = 'none'

def create_subplots(num_sensors, suffix, title):
    rows_plot = (num_sensors + COLUMNS - 1) // COLUMNS
    fig_width = (SUBPLOT_WIDTH_CM * COLUMNS) / 2.54
    fig_height = (SUBPLOT_HEIGHT_CM * rows_plot) / 2.54
    fig = plt.figure(figsize=(fig_width, fig_height))
    fig.suptitle(f"{title} [Slice {suffix.upper()}]", 
                 fontsize=FONT_SIZE + 4, fontweight='bold', y=0.98)
    from matplotlib.gridspec import GridSpec
    gs = GridSpec(rows_plot, COLUMNS, figure=fig, wspace=0.35, hspace=0.5)
    return fig, gs, rows_plot

def setup_axis(ax, row, col, rows_plot, col_name, y_label, ext_label=""):
    ax.set_title(f"Channel: {col_name} {ext_label}", fontsize=FONT_SIZE, pad=3)
    if row == rows_plot - 1:
        ax.set_xlabel('Time (s)', fontsize=FONT_SIZE - 1)
    if col == 0:
        ax.set_ylabel(y_label, fontsize=FONT_SIZE - 1)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(axis='both', which='both', direction='in', labelsize=FONT_SIZE-2)

def mark_extrema_and_dynamic_ticks(ax, time_rel, data, is_force=False):
    max_val, min_val = np.max(data), np.min(data)
    max_t, min_t = time_rel[np.argmax(data)], time_rel[np.argmin(data)]
    t_start, t_end = time_rel.min(), time_rel.max()
    
    ax.set_xlim(t_start, t_end)
    ax.plot([t_start, max_t], [max_val, max_val], color='#8B0000', linestyle='--', lw=0.7, alpha=0.5, zorder=3)
    ax.plot([t_start, min_t], [min_val, min_val], color='#8B0000', linestyle='--', lw=0.7, alpha=0.5, zorder=3)
    ax.scatter([max_t, min_t], [max_val, min_val], color='#8B0000', s=12, zorder=4)

    normal_ticks = ax.get_yticks()
    safe_dist = (max_val - min_val) * 0.12 if (max_val != min_val) else 0.1
    safe_ticks = [t for t in normal_ticks if abs(t - max_val) > safe_dist and abs(t - min_val) > safe_dist]
    final_ticks = sorted(list(set(safe_ticks) | {min_val, max_val}))
    
    ax.set_yticks(final_ticks)
    for tick in ax.get_yticklabels():
        val_str = tick.get_text().replace('−', '-')
        try:
            val = float(val_str) if val_str else 0
        except ValueError:
            val = 0
            
        if np.isclose(val, max_val) or np.isclose(val, min_val):
            tick.set_color('#8B0000')
            tick.set_fontsize(FONT_SIZE - 1)
            tick.set_fontweight('bold')
        else:
            tick.set_color('#333333')
            tick.set_fontsize(FONT_SIZE - 2)

# ==============================================================================
# 单个切片渲染函数 (用于并行)
# ==============================================================================

def render_one_tribo(args):
    data_dir, output_dir, suffix = args
    path = data_dir / f"5-5.{suffix}.csv"
    if not path.exists(): return f"Skipped Tribo-{suffix}"
        
    df = pd.read_csv(path)
    ch_cols = [c for c in df.columns if c.startswith('CH')]
    ch_cols.sort(key=lambda x: int(x.replace('CH', '')) if x.replace('CH', '').isdigit() else 999)
    
    time_rel = df['Relative_Time'].values
    fig, gs, rows_plot = create_subplots(len(ch_cols), suffix, "Triboelectric Voltage Array")
    
    for i, col_name in enumerate(ch_cols):
        data = df[col_name].values
        if len(data) > 31: data = savgol_filter(data, 31, 3)
        
        row, col = i // COLUMNS, i % COLUMNS
        ax = fig.add_subplot(gs[row, col])
        ax.plot(time_rel, data, color='#2A9D8F', lw=1.2, label='Tribo', zorder=2)
        ax.axhline(0, color='gray', linestyle='-', lw=0.6, zorder=1)
        
        mark_extrema_and_dynamic_ticks(ax, time_rel, data)
        setup_axis(ax, row, col, rows_plot, col_name, 'Voltage (V)')

    save_name = f"Tribo_Grid_Nx3_{suffix}"
    plt.savefig(output_dir / f"{save_name}.png", dpi=DPI, bbox_inches='tight')
    plt.savefig(output_dir / f"{save_name}.svg", bbox_inches='tight')
    plt.close(fig)
    return f"✅ [Tribo - {suffix}] Rendered."

def render_one_force(args):
    data_dir, output_dir, suffix = args
    path = data_dir / f"5-5.{suffix}_resolved.csv"
    if not path.exists(): return f"Skipped Force-{suffix}"
        
    df = pd.read_csv(path)
    time_rel = df['Relative_Time'].values
    ch_names = [c for c in df.columns if c.endswith('_Fz')]
    num_sensors = len(ch_names)
    
    fig, gs, rows_plot = create_subplots(num_sensors, suffix, "3D Force Vector Array")
    
    for i in range(num_sensors):
        sensor_id = i + 1 
        fz_col = f"S{sensor_id}_Fz"
        fx_col = f"S{sensor_id}_Fx"
        fy_col = f"S{sensor_id}_Fy"
        
        if fz_col not in df.columns: continue
        
        Fz, Fx, Fy = df[fz_col].values, df[fx_col].values, df[fy_col].values
        if len(Fz) > 21:
            Fz_p, Fx_p, Fy_p = savgol_filter(Fz, 21, 2), savgol_filter(Fx, 21, 2), savgol_filter(Fy, 21, 2)
        else:
            Fz_p, Fx_p, Fy_p = Fz, Fx, Fy
            
        row, col = i // COLUMNS, i % COLUMNS
        ax = fig.add_subplot(gs[row, col])
        ax.plot(time_rel, Fz_p, color='#E63946', lw=1.2, label='Fz', zorder=2)
        ax.plot(time_rel, Fx_p, color='#1D3557', lw=0.8, label='Fx', zorder=2)
        ax.plot(time_rel, Fy_p, color='#457B9D', lw=0.8, label='Fy', zorder=2)
        ax.axhline(0, color='gray', linestyle='-', lw=0.6, zorder=1)
        
        mark_extrema_and_dynamic_ticks(ax, time_rel, Fz, is_force=True)
        setup_axis(ax, row, col, rows_plot, f"Sensor {sensor_id}", 'Force (kPa)')
        if i == 0: ax.legend(loc='best', fontsize=FONT_SIZE-2, frameon=False)
        
    save_name = f"3D_Force_Grid_Nx3_{suffix}"
    plt.savefig(output_dir / f"{save_name}.png", dpi=DPI, bbox_inches='tight')
    plt.savefig(output_dir / f"{save_name}.svg", bbox_inches='tight')
    plt.close(fig)
    return f"✅ [3D Force - {suffix}] Rendered."

def render_one_strain(args):
    data_dir, output_dir, suffix = args
    path = data_dir / f"5-5.{suffix}_resolved.csv"
    if not path.exists(): return f"Skipped Strain-{suffix}"
        
    df = pd.read_csv(path)
    time_rel = df['Relative_Time'].values
    col_names = [c for c in df.columns if c.endswith('_Angle')]
    col_names.sort(key=lambda x: int(x.split('_')[0].replace('CH', '')) if 'CH' in x else 999)
    
    fig, gs, rows_plot = create_subplots(len(col_names), suffix, "Strain Bending Angle Array")
    
    for i, col_full in enumerate(col_names):
        angle_raw = df[col_full].values
        if len(angle_raw) > 31: angle_p = savgol_filter(angle_raw, 31, 3)
        else: angle_p = angle_raw
            
        row, col = i // COLUMNS, i % COLUMNS
        ax = fig.add_subplot(gs[row, col])
        ax.plot(time_rel, angle_p, color='#D62828', lw=1.2, label='Angle', zorder=2)
        ax.axhline(0, color='gray', linestyle='-', lw=0.6, zorder=1)
        
        mark_extrema_and_dynamic_ticks(ax, time_rel, angle_raw)
        setup_axis(ax, row, col, rows_plot, col_full.split('_')[0], 'Angle (°)')

    save_name = f"Strain_Angle_Grid_Nx3_{suffix}"
    plt.savefig(output_dir / f"{save_name}.png", dpi=DPI, bbox_inches='tight')
    plt.savefig(output_dir / f"{save_name}.svg", bbox_inches='tight')
    plt.close(fig)
    return f"✅ [Strain - {suffix}] Rendered."

# ==============================================================================
# 🎬 主入口
# ==============================================================================
def main():
    start_all = time.time()
    base_dir = Path(__file__).parent
    processed_dir = base_dir.parent / "processed"
    render_dir = base_dir.parent / "renders"

    setup_plot_style()
    
    tribo_data_dir = processed_dir / "figure_tribo_array"
    tribo_out_dir = render_dir / "figure_tribo_array"
    tribo_out_dir.mkdir(parents=True, exist_ok=True)

    force_data_dir = processed_dir / "figure_3d_force"
    force_out_dir = render_dir / "figure_3d_force"
    force_out_dir.mkdir(parents=True, exist_ok=True)

    strain_data_dir = processed_dir / "figure_strain_array"
    strain_out_dir = render_dir / "figure_strain_array"
    strain_out_dir.mkdir(parents=True, exist_ok=True)

    print("\n🚀 启动并行渲染任务...")
    
    all_tasks = []
    for s in TRIBO_SLICES: all_tasks.append((render_one_tribo, (tribo_data_dir, tribo_out_dir, s)))
    for s in FORCE_SLICES: all_tasks.append((render_one_force, (force_data_dir, force_out_dir, s)))
    for s in STRAIN_SLICES: all_tasks.append((render_one_strain, (strain_data_dir, strain_out_dir, s)))

    with ProcessPoolExecutor() as executor:
        # submit 方式可以更灵活地处理不同类型的任务
        futures = [executor.submit(func, args) for func, args in all_tasks]
        for f in futures:
            print(f.result())

    duration = time.time() - start_all
    print(f"\n🎉 All Plotting Tasks Finished successfully in {duration:.2f}s!")

if __name__ == "__main__":
    main()
