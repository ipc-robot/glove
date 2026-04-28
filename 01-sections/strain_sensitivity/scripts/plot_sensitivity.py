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
from scipy import signal
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

# --- 留白与显示 ---
PLOT_MARGIN = 0.05      # 子图留白比例 (0.05 = 5% 数据范围)

# ==============================================================================
# 📊 核心处理逻辑
# ==============================================================================

def setup_plot_style():
    """配置全局绘图样式"""
    matplotlib.rcParams['font.family'] = FONT_FAMILY
    matplotlib.rcParams['font.sans-serif'] = ['Arial']
    matplotlib.rcParams['font.size'] = FONT_SIZE
    matplotlib.rcParams['axes.linewidth'] = AXES_LINEWIDTH

def process_single_file(file_path):
    """处理单个数据文件，计算应变和电阻变化率关系"""
    try:
        df = pd.read_csv(file_path)
        # 获取列名（处理可能的空格或引号）
        df.columns = [col.strip().strip('"') for col in df.columns]
        
        # 提取关键列
        strain_col = [col for col in df.columns if '应变' in col or 'Strain' in col][0]
        resistance_col = [col for col in df.columns if '电阻' in col or 'Resistance' in col][0]
        
        strain = df[strain_col].abs().values
        resistance = df[resistance_col].values
        
        # 1. 计算基准电阻 R0 (参考 3-9.a.py 逻辑)
        e_max = strain.max()
        idle_mask = strain < (e_max * 0.01)
        if idle_mask.sum() >= 5:
            r0 = np.median(resistance[idle_mask])
        else:
            r0 = resistance[0]
            
        # 2. 计算电阻变化率 (S = ΔR / R0)
        s_raw = (resistance - r0) / r0
        
        # 3. 截断异常值 (应变片断裂处理)
        # 找到第一个非有限值或超过阈值的点
        valid_indices = np.where((s_raw >= S_THRESHOLD) | (~np.isfinite(s_raw)))[0]
        if len(valid_indices) > 0:
            break_idx = valid_indices[0]
            strain = strain[:break_idx]
            s_raw = s_raw[:break_idx]
            print(f"✂️  截断文件 {file_path.name}: 在索引 {break_idx} 处发现异常值")

        # 4. 提取纯加载段进行平滑同时转换为百分比 (%)
        s_smooth = signal.savgol_filter(s_raw, 51, 1) if len(s_raw) > 51 else s_raw
        s_pct = s_smooth * 100
        
        return strain, s_pct, file_path.name
    except Exception as e:
        print(f"❌ 错误: 无法处理文件 {file_path.name} -> {e}")
        return None, None, file_path.name

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
    print(f"🚀 开始处理 {n_files} 个文件...")
    for i, file_path in enumerate(data_files):
        ax = axes_flat[i]
        strain, s_change, name = process_single_file(file_path)
        
        if strain is not None:
            # 绘制曲线
            ax.plot(strain, s_change, color='#E63946', lw=0.6)
            
            # 标题 (去除后缀)
            clean_name = name.replace(".aligned", "").replace(".csv", "")
            ax.set_title(clean_name, pad=4, fontsize=FONT_SIZE)
            
            # --- 方案重构：按照用户思路手动创建 4 等分刻度点 (0 起始 + 百分比) ---
            # 强制从 0 开始
            x_min, x_max = 0, strain.max()
            y_min, y_max = 0, s_change.max()
            
            x_span = x_max - x_min
            y_span = y_max - y_min
            
            # 1. 强制生成 5 个刻度点（4 等分），确保最后一个刻度在 max 上
            ax.set_xticks(np.linspace(x_min, x_max, 5))
            ax.set_yticks(np.linspace(y_min, y_max, 5))
            
            # 2. 优化标签格式：强制显示为整数 (%d)
            ax.xaxis.set_major_formatter(ticker.FormatStrFormatter('%d'))
            ax.yaxis.set_major_formatter(ticker.FormatStrFormatter('%d'))
            
            # 3. 设置物理留白：恢复双向 5% Margin，确保原点 (0,0) 处也有统一留白
            ax.set_xlim(x_min - x_span * PLOT_MARGIN, x_max + x_span * PLOT_MARGIN)
            ax.set_ylim(y_min - y_span * PLOT_MARGIN, y_max + y_span * PLOT_MARGIN)
            
            # 设置标签
            ax.set_xlabel('Strain (%)', labelpad=2)
            ax.set_ylabel(r'$\Delta R/R_0$ (%)', labelpad=2)
            
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
    
    print(f"✅ 生成完成！")
    print(f"🖼️ PNG: {save_path_png}")
    print(f"📐 SVG: {save_path_svg}")

if __name__ == "__main__":
    main()
