"""
SI-3: 灵敏度（应变-电阻变化率）汇总绘图脚本
功能：自动读取 data 目录下所有对齐后的数据文件，生成多子图汇总报告。
参考：3-9.a.py
"""

import matplotlib
matplotlib.use('Agg') # 设置非交互式后端以避免 GUI 错误
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import pandas as pd
from scipy import signal, stats
from scipy import signal, stats
from scipy.interpolate import PchipInterpolator
from pathlib import Path
import math
import sys

# ==============================================================================
# 🎛️ 绘图控制面板
# ==============================================================================

# --- 画布与导出设置 ---
DPI = 300              # SI 图片建议 300-600 DPI
COLUMNS = 3            # 每行子图数量
SUBPLOT_WIDTH_CM = 5.0 # 每个子图宽度 (厘米)
SUBPLOT_HEIGHT_CM = 5.0 # 每个子图高度 (厘米)

# --- 字体与样式 ---
FONT_FAMILY = 'sans-serif'
FONT_SIZE = 7          # SI 常用较小字体
AXES_LINEWIDTH = 0.6   # 坐标轴线宽

# --- 刻度控制 ---
XTICKS_NBINS = 4
YTICKS_NBINS = 4

# --- 数据清洗 ---
S_THRESHOLD = 50.0     # 电阻变化率阈值 (50.0 = 5000%)，超过此值视为断裂

# --- 调试与验证 ---
SHOW_DIAGNOSTICS = True  # 生成诊断图以验证加载区间识别
PLOT_MARGIN = 0.05      # 子图留白比例 (0.05 = 5% 数据范围)

# --- 平滑控制参数 (针对 500 点重采样后的曲线) ---
DEFAULT_SMOOTH_WINDOW = 31      # 默认滑动平均窗口大小 (奇数，值越大曲线越丝滑)

# 针对不同的文件/传感器可以配置不同的平滑参数
# 键为文件名中包含的特征字符串，值为对应的窗口大小
CUSTOM_SMOOTH_WINDOWS = {
    "sensor1": 51,
    "sensor2": 17,
    "sensor3": 51,
    "sensor4": 51,
}

# ==============================================================================
# 📊 核心处理逻辑
# ==============================================================================

def setup_plot_style():
    """配置全局绘图样式"""
    matplotlib.rcParams['font.family'] = FONT_FAMILY
    matplotlib.rcParams['font.sans-serif'] = ['Arial']
    matplotlib.rcParams['font.size'] = FONT_SIZE
    matplotlib.rcParams['axes.linewidth'] = AXES_LINEWIDTH

def process_single_file(file_path, smooth_window=DEFAULT_SMOOTH_WINDOW):
    """处理单个数据文件，提取线性度最好的正加载段"""
    try:
        df = pd.read_csv(file_path)
        df.columns = [col.strip().strip('"') for col in df.columns]
        
        # 提取关键列
        x_col = [col for col in df.columns if any(k in col for k in ['应变', 'Strain', 'Load', '负载', '压力'])][0]
        y_col = [col for col in df.columns if any(k in col for k in ['电阻', 'Resistance', 'R (Ohm)'])][0]
        
        x_all = df[x_col].abs().values
        r_all = df[y_col].values
        
        # --- 周期分割逻辑 ---
        # 使用平滑后的数据找波峰波谷
        x_smooth = signal.savgol_filter(x_all, 101, 1) if len(x_all) > 101 else x_all
        peaks, _ = signal.find_peaks(x_smooth, height=x_smooth.max()*0.5, distance=100)
        valleys, _ = signal.find_peaks(-x_smooth, distance=100)
        
        # 补全边界波谷
        valleys = np.sort(np.unique(np.concatenate(([0], valleys, [len(x_all)-1]))))
        
        best_r2 = -1
        best_segment = None
        all_candidates = []
        
        # 遍历每个波谷到其后紧邻的第一个波峰（正加载过程）
        for v in valleys:
            future_peaks = peaks[peaks > v]
            if len(future_peaks) == 0:
                continue
            p = future_peaks[0]
            
            x_seg = x_all[v:p+1]
            r_seg = r_all[v:p+1]
            
            if len(x_seg) < 20: 
                continue
            
            r0 = r_seg[0]
            y_seg = r_seg / r0
            
            slope, intercept, r_value, p_value, std_err = stats.linregress(x_seg, y_seg)
            r2 = r_value**2
            
            cand_info = {'start': v, 'end': p, 'r2': r2, 'x_range': (x_seg.min(), x_seg.max())}
            all_candidates.append(cand_info)
            
            if r2 > best_r2:
                best_r2 = r2
                best_segment = (x_seg, y_seg, r2, v, p)

        diag_data = {
            'x_time': x_all, 
            'peaks': peaks, 
            'valleys': valleys, 
            'candidates': all_candidates,
            'best_idx': (best_segment[3], best_segment[4]) if best_segment else None
        }

        if best_segment:
            # --- 原始数据段 ---
            x_raw, y_raw, _, v, p = best_segment
            
            # --- 核心改进 1：强制单调性过滤 (Sanitization) ---
            # 解决负载传感器抖动产生的数据回退问题，这是导致“折角”和“起点偏差”的关键
            monotonic_indices = [0]
            curr_max_x = x_raw[0]
            for idx in range(1, len(x_raw)):
                if x_raw[idx] > curr_max_x:
                    monotonic_indices.append(idx)
                    curr_max_x = x_raw[idx]
            
            x_mono = x_raw[monotonic_indices]
            y_mono = y_raw[monotonic_indices]

            # --- 核心改进 2：压力域均匀重采样 ---
            num_unif = 500 
            x_unif = np.linspace(x_mono.min(), x_mono.max(), num_unif)
            
            # 升级插值引擎：使用 Pchip (保单调三次分段 Hermite 插值)
            pchip = PchipInterpolator(x_mono, y_mono)
            y_interp = pchip(x_unif)
            
            # --- 核心改进 3：奇对称填充滑动平均 (终结折角魔法) ---
            # 采用用户建议的“带填充的移动平均”，但使用 reflect_type='odd' 奇对称翻折。
            # 这是确保物理起点绝对等于 1.0 且一阶导数连续的最完美的低通滤波方案！
            pad_len = smooth_window
            y_pad = np.pad(y_interp, (pad_len, pad_len), mode='reflect', reflect_type='odd')
            
            # 居中滑动平均
            window = np.ones(smooth_window) / smooth_window
            y_smooth_pad = np.convolve(y_pad, window, mode='same')
            
            # 切除填充区域，还原真实数据长度
            y_final = y_smooth_pad[pad_len:-pad_len]
            
            # 使用重采样并平滑后的数据重新计算 R2
            _, _, r_value, _, _ = stats.linregress(x_unif, y_final)
            r2_final = r_value**2
            
            return x_raw, y_raw, x_unif, y_final, file_path.name, x_col, r2_final, diag_data
        else:
            return None, None, None, None, file_path.name, x_col, 0, diag_data
    except Exception as e:
        print(f"Error: Failed to process {file_path.name} -> {e}")
        return None, None, None, None, file_path.name, "", 0, {}

def main():
    # 1. 路径准备
    base_dir = Path(__file__).parent
    # 调整数据目录：指向对齐后的数据（processed 目录）
    data_dir = base_dir.parent / "processed"
    output_dir = base_dir.parent / "renders"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 2. 获取所有对齐的数据文件
    # 搜索包含 .aligned 且以 .csv 结尾的文件
    data_files = sorted(list(data_dir.glob("*aligned*.csv")))
    if not data_files:
        print("⚠️ 未在大数据目录下找到匹配的文件 (*aligned*.csv)")
        return
    
    n_files = len(data_files)
    n_rows = math.ceil(n_files / COLUMNS)
    
    # 3. 设置整体样式
    setup_plot_style()
    
    # 4. 创建大画布
    fig_width = (SUBPLOT_WIDTH_CM * COLUMNS) / 2.54
    fig_height = (SUBPLOT_HEIGHT_CM * n_rows) / 2.54
    fig, axes = plt.subplots(
        n_rows, COLUMNS, 
        figsize=(fig_width, fig_height),
        constrained_layout=False # 禁用自动调整以获得固定物理尺寸
    )
    
    # 如果只有一行或一列，axes 可能不是二维数组
    if n_files == 1:
        axes = np.array([axes])
    axes_flat = axes.flatten()
    
    # 5. 循环处理与绘图
    print(f"Starting processing {n_files} files...")
    all_diagnostics = []
    
    for i, file_path in enumerate(data_files):
        ax = axes_flat[i]
        
        # 获取当前文件的特定平滑参数
        current_window = DEFAULT_SMOOTH_WINDOW
        for key, win_size in CUSTOM_SMOOTH_WINDOWS.items():
            if key in file_path.name:
                current_window = win_size
                break
                
        x_raw, y_raw, x_smooth, y_smooth, name, col_name, r2_val, diag = process_single_file(file_path, smooth_window=current_window)
        all_diagnostics.append((name, diag))
        
        if x_raw is not None:
            # 打印详细候选段信息用于验证
            print(f"\n--- {name} ---")
            print(f"Detected {len(diag['candidates'])} loading segments.")
            for idx, cand in enumerate(diag['candidates']):
                is_best = "*" if diag['best_idx'] == (cand['start'], cand['end']) else " "
                print(f"  [{idx}]{is_best} Range: {cand['start']:5d} -> {cand['end']:5d} | "
                      f"Force: {cand['x_range'][0]:5.2f}->{cand['x_range'][1]:5.2f}N | R2: {cand['r2']:.4f}")

            # 1. 绘制原始散点 (使用原始坐标)
            ax.scatter(x_raw, y_raw, marker='x', s=4, color='#1D3557', alpha=0.4, linewidths=0.5, zorder=2)
            
            # 2. 绘制平滑折线 (使用压力域重采样后的坐标)
            ax.plot(x_smooth, y_smooth, color='#E63946', lw=1.2, zorder=3)
            
            # 标题 (去除后缀并显示线性度)
            clean_name = name.replace("_aligned", "").replace(".csv", "")
            ax.set_title(f"{clean_name}\n$R^2={r2_val:.4f}$", pad=6, fontsize=FONT_SIZE-1)
            print(f"  Final Selection -> Smooth R2: {r2_val:.4f}")
            
            # --- 方案重构：按照用户思路手动创建 4 等分刻度点 (0 起始 + 百分比) ---
            # 1. 轴范围
            x_min, x_max = 0, x_raw.max()
            y_min, y_max = y_raw.min(), y_raw.max()
            
            x_span = x_max - x_min if x_max != x_min else 1.0
            y_span = y_max - y_min if y_max != y_min else 1.0
            
            # 2. 生成 5 个刻度点
            ax.set_xticks(np.linspace(x_min, x_max, 5))
            ax.set_yticks(np.linspace(y_min, y_max, 5))
            
            # 3. 标签格式
            ax.xaxis.set_major_formatter(ticker.FormatStrFormatter('%d'))
            ax.yaxis.set_major_formatter(ticker.FormatStrFormatter('%.2f'))
            
            # 4. 设置物理留白
            ax.set_xlim(x_min - x_span * PLOT_MARGIN, x_max + x_span * PLOT_MARGIN)
            ax.set_ylim(y_min - y_span * PLOT_MARGIN, y_max + y_span * PLOT_MARGIN)
            
            # 设置标签
            x_label = 'Load (N)' if any(k in col_name for k in ['Load', '压力', '负载']) else 'Strain (%)'
            ax.set_xlabel(x_label, labelpad=2)
            ax.set_ylabel(r'$R/R_0$', labelpad=2)
            
            # 细节优化
            ax.tick_params(axis='both', which='both', direction='in', labelsize=FONT_SIZE-1)
            ax.grid(False) # 通常 SI 不加网格，保持洁净
        else:
            ax.text(0.5, 0.5, 'Error', ha='center')
            
    # 6. 隐藏多余的子图
    for j in range(i + 1, len(axes_flat)):
        axes_flat[j].axis('off')
        
    # 7. 固定子图布局参数，确保所有子图框 (Axes Box) 物理尺寸完全一致
    plt.subplots_adjust(
        left=0.10,    # 左边距
        right=0.95,   # 右边距
        bottom=0.10,  # 下边距
        top=0.92,     # 上边距
        wspace=0.35,  # 子图间水平间距
        hspace=0.45   # 子图间垂直间距
    )
        
    # 8. 保存结果
    save_path_png = output_dir / "SI-3.png"
    save_path_svg = output_dir / "SI-3.svg"
    plt.savefig(save_path_png, dpi=DPI)
    plt.savefig(save_path_svg)
    plt.close(fig)
    
    print(f"Done!")
    print(f"PNG: {save_path_png}")
    print(f"SVG: {save_path_svg}")

    # 9. 额外生成诊断图
    if SHOW_DIAGNOSTICS:
        diag_fig, diag_axes = plt.subplots(n_rows, COLUMNS, figsize=(fig_width, fig_height))
        if n_files == 1: diag_axes = np.array([diag_axes])
        diag_axes_flat = diag_axes.flatten()
        
        print("\nGenerating diagnostic markers plot...")
        for i, (name, diag) in enumerate(all_diagnostics):
            ax = diag_axes_flat[i]
            if not diag: continue
            
            x_time = diag['x_time']
            ax.plot(x_time, color='gray', alpha=0.5, lw=0.5, label='Load')
            

            
            # 高亮最佳加载段
            if diag['best_idx']:
                s, e = diag['best_idx']
                ax.plot(range(s, e+1), x_time[s:e+1], color='green', lw=1.2, label='Best Selection', zorder=4)
            
            clean_name = name.replace("_aligned", "").replace(".csv", "")
            ax.set_title(clean_name, fontsize=FONT_SIZE-1)
            ax.tick_params(labelsize=FONT_SIZE-2)
            if i == 0: ax.legend(fontsize=5, loc='upper right')

        for j in range(i + 1, len(diag_axes_flat)): diag_axes_flat[j].axis('off')
        
        diag_path = output_dir / "SI-3_diag.png"
        plt.tight_layout()
        diag_fig.savefig(diag_path, dpi=DPI)
        plt.close(diag_fig)
        print(f"Diagnostic plot saved to: {diag_path}")

if __name__ == "__main__":
    main()
