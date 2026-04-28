"""
电阻-应变关系绘图脚本
功能：读取电阻仪和疲劳机数据，时间对齐后绘制应变-电阻变化率曲线
"""

import matplotlib
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import pandas as pd
from scipy import signal
from pathlib import Path

# ==============================================================================
# 🎛️ 绘图控制面板（在此处手动调整参数）
# ==============================================================================

# --- Physical Specs (from 3-3.a.py) ---
WIDTH_CM = 4.863       # 画布宽度(厘米)
HEIGHT_CM = 5.99       # 画布高度(厘米)
DPI = 1200             # 输出图片DPI
MARGIN_CM = 0.9        # 基础边距(厘米)

# --- Layout (Custom Horizontal, Default Vertical) ---
L_MARGIN = 0.70 / WIDTH_CM     # Slightly tighter left margin
R_MARGIN = 0.25 / WIDTH_CM     # Tight right margin (no labels there)

# 1. 基础设置
FONT_FAMILY = 'sans-serif' # 字体族
FONT_SIZE = 8              # 字体大小
AXES_LINEWIDTH = 0.8       # 坐标轴边框粗细

# 2. 坐标轴范围 (设为 None 则自动计算)
X_LIMIT_MIN = -5           # 横坐标最小值
X_LIMIT_MAX = 92           # 横坐标最大值 (None = 自动设为应变最大值向上取整)
Y_LIMIT_MIN = -0.2         # 纵坐标最小值 (None = 自动设为 S_min - 0.1)
Y_LIMIT_MAX = None         # 纵坐标最大值 (None = 自动设为 S_max + 0.5)

# 3. 刻度控制
# 横坐标刻度 (手动输入列表如 [0, 1, 2, 3]，或设为 None 使用自动逻辑)
MANUAL_XTICKS = [0, 17, 34, 51, 68, 86]

# 自动横坐标刻度参数 (仅当 MANUAL_XTICKS = None 时生效)
XTICKS_NBINS = 4           # 期望的刻度数量
XTICKS_INTEGER = True      # 是否仅使用整数刻度
XTICKS_OVERLAP_RATIO = 0.15  # 防重叠阈值 (若最后一个刻度距最大值小于此比例则剔除)

# 纵坐标刻度 (手动输入列表，或设为 None 使用默认)
MANUAL_YTICKS = None

# ==============================================================================
# 📊 核心功能函数
# ==============================================================================

def setup_plot_style():
    """配置全局绘图样式"""
    matplotlib.rcParams['font.family'] = FONT_FAMILY
    matplotlib.rcParams['font.sans-serif'] = ['Arial']
    matplotlib.rcParams['font.size'] = FONT_SIZE
    matplotlib.rcParams['axes.linewidth'] = AXES_LINEWIDTH

def load_and_preprocess_data():
    """加载并预处理电阻仪和疲劳机数据"""
    # 路径设置
    base_dir = Path(__file__).parent
    # 调整数据目录：指向原始数据（raw 目录）
    data_dir = base_dir.parent / "raw"
    output_dir = base_dir.parent / "renders"
    output_dir.mkdir(parents=True, exist_ok=True)

    # 数据文件路径
    path_resistance = data_dir / "1.1.电阻.xlb1.csv"
    path_fatigue = data_dir / "1.1.疲劳机.xlb1.csv"

    # 读取电阻数据
    df_resistance = pd.read_csv(path_resistance)
    df_resistance.columns = [col.strip().strip('"') for col in df_resistance.columns]
    
    # 自动匹配时间和电阻列
    time_col_r = [col for col in df_resistance.columns if '时间' in col][0]
    resistance_col_r = [col for col in df_resistance.columns if '电阻' in col][0]
    
    # 重构电阻数据框
    df_resistance = pd.DataFrame({
        'time': df_resistance[time_col_r].astype(float),
        'resistance': df_resistance[resistance_col_r].astype(float)
    })
    df_resistance['time'] -= df_resistance['time'].iloc[0]  # 时间归零

    # 读取疲劳机数据
    df_fatigue = pd.read_csv(path_fatigue)
    df_fatigue.columns = [col.strip() for col in df_fatigue.columns]
    
    # 自动匹配列名 (支持中英文)
    strain_col_f = [col for col in df_fatigue.columns if '应变' in col or 'Strain' in col][0]
    force_col_f = [col for col in df_fatigue.columns if '力' in col or 'Force' in col][0]
    time_col_f = [col for col in df_fatigue.columns if '时间' in col or 'Time' in col][0]
    
    # 重构疲劳机数据框
    df_fatigue = pd.DataFrame({
        'time': df_fatigue[time_col_f].astype(float),
        'force': df_fatigue[force_col_f].astype(float),
        'strain': df_fatigue[strain_col_f].astype(float)
    })
    df_fatigue['time'] -= df_fatigue['time'].iloc[0]  # 时间归零
    df_fatigue['strain'] = df_fatigue['strain'].abs()  # 取应变绝对值

    # 打印数据基本信息
    print(f"电阻仪: {len(df_resistance)} 个数据点  时间范围=[0, {df_resistance['time'].max():.1f}] 秒")
    print(
        f"疲劳机: {len(df_fatigue)} 个数据点  "
        f"时间范围=[0, {df_fatigue['time'].max():.1f}] 秒  "
        f"最大应变={df_fatigue['strain'].max():.2f} %"
    )

    return df_resistance, df_fatigue, output_dir

def align_time_axis(df_resistance, df_fatigue):
    """时间轴对齐处理"""
    time_step = df_resistance['time'].diff().median()

    # 计算时间交集
    time_min = max(df_resistance['time'].min(), df_fatigue['time'].min())
    time_max = min(df_resistance['time'].max(), df_fatigue['time'].max())
    time_grid = np.arange(time_min, time_max, time_step)

    # 插值对齐
    resistance_interp = np.interp(time_grid, df_resistance['time'], df_resistance['resistance'])
    strain_interp = np.interp(time_grid, df_fatigue['time'], df_fatigue['strain'])

    # 归一化计算互相关
    resistance_norm = (resistance_interp - resistance_interp.mean()) / (resistance_interp.std() + 1e-9)
    strain_norm = (strain_interp - strain_interp.mean()) / (strain_interp.std() + 1e-9)

    correlation = signal.correlate(resistance_norm, strain_norm, mode='full')
    lags = signal.correlation_lags(len(resistance_norm), len(strain_norm), mode='full')
    time_offset = lags[np.argmax(correlation)] * time_step

    df_fatigue['time'] -= time_offset
    print(f"时间对齐偏移量: {time_offset:.4f} 秒")

    return df_resistance, df_fatigue, time_step

def calculate_sensitivity(df_resistance, df_fatigue, time_step):
    """计算电阻变化率（灵敏度）"""
    # 重新计算时间交集（对齐后）
    time_min = max(df_resistance['time'].min(), df_fatigue['time'].min())
    time_max = min(df_resistance['time'].max(), df_fatigue['time'].max())
    time_comm = np.arange(time_min, time_max, time_step)

    # 公共时间轴插值
    r_comm = np.interp(time_comm, df_resistance['time'], df_resistance['resistance'])
    e_comm = np.interp(time_comm, df_fatigue['time'], df_fatigue['strain'])

    # 基准 R0 计算
    e_max = e_comm.max()
    idle = e_comm < e_max * 0.01
    r0 = float(np.median(r_comm[idle])) if idle.sum() >= 5 else float(r_comm[0])
    print(f"基准电阻 R0 = {r0:.4f} Ω")

    # 计算电阻变化率（非百分比）
    s_comm = (r_comm - r0) / r0

    # 截取纯加载段
    start_i = int(np.argmax(e_comm > e_max * 0.01))
    peak_i = int(np.argmax(e_comm))

    e_load = e_comm[start_i: peak_i + 1]
    s_load = s_comm[start_i: peak_i + 1]

    # 按应变排序并插值
    sort_idx = np.argsort(e_load)
    e_grid = np.linspace(0, e_max, 2000)
    s_grid = np.interp(e_grid, e_load[sort_idx], s_load[sort_idx])

    # 平滑处理
    s_grid = signal.savgol_filter(s_grid, 101, 1)

    print(
        f"加载段: {peak_i - start_i} 个数据点  "
        f"应变范围=[0, {e_max:.2f}] %  "
        f"最大电阻变化率={s_grid[-1]:.4f}"
    )

    return e_grid, s_grid, e_max

def plot_figure(e_grid, s_grid, e_max, output_dir):
    """绘制并保存最终图形（恢复自定义边距）"""
    # 尺寸转换 (厘米转英寸)
    width_in = WIDTH_CM / 2.54
    height_in = HEIGHT_CM / 2.54
    
    # 恢复自定义边距计算逻辑
    b_frac = MARGIN_CM / HEIGHT_CM  # 底部边距比例
    ax_left = L_MARGIN
    ax_bottom = b_frac
    ax_width = 1 - L_MARGIN - R_MARGIN  # 宽度 = 1 - 左距 - 右距
    ax_height = 1 - b_frac - (MARGIN_CM / HEIGHT_CM)  # 高度适配

    # 创建画布和坐标轴（使用自定义边距）
    fig = plt.figure(figsize=(width_in, height_in))
    ax = fig.add_axes([ax_left, ax_bottom, ax_width, ax_height])

    # 绘制曲线
    ax.plot(e_grid, s_grid, color='#E63946', lw=0.8)

    # 应用坐标轴范围控制
    final_x_max = X_LIMIT_MAX if X_LIMIT_MAX is not None else int(np.ceil(e_max))
    final_y_min = Y_LIMIT_MIN if Y_LIMIT_MIN is not None else (s_grid.min() - 0.1)
    final_y_max = Y_LIMIT_MAX if Y_LIMIT_MAX is not None else (s_grid.max() + 0.5)

    ax.set_xlim(X_LIMIT_MIN, final_x_max)
    ax.set_ylim(final_y_min, final_y_max)

    # 应用横坐标刻度控制
    if MANUAL_XTICKS is not None:
        valid_ticks = MANUAL_XTICKS
    else:
        # 自动刻度逻辑
        locator = ticker.MaxNLocator(nbins=XTICKS_NBINS, integer=XTICKS_INTEGER)
        default_ticks = locator.tick_values(X_LIMIT_MIN, final_x_max)
        valid_ticks = [t for t in default_ticks if X_LIMIT_MIN <= t < final_x_max]
        
        # 防重叠处理
        if valid_ticks and (final_x_max - valid_ticks[-1]) < (final_x_max * XTICKS_OVERLAP_RATIO):
            valid_ticks.pop()
        
        valid_ticks.append(final_x_max)

    ax.set_xticks(valid_ticks)

    # 应用纵坐标刻度控制
    if MANUAL_YTICKS is not None:
        ax.set_yticks(MANUAL_YTICKS)

    # 样式优化
    for spine in ax.spines.values():
        spine.set_visible(True)
        spine.set_linewidth(AXES_LINEWIDTH)

    ax.tick_params(
        axis='both', 
        which='both', 
        direction='in',
        top=False, 
        right=False, 
        labelleft=True, 
        labelbottom=True
    )

    ax.set_title('')
    ax.set_xlabel('')
    ax.set_ylabel('')
    ax.grid(False)

    # 保存图片
    fig.savefig(output_dir / "3-9.a.png", dpi=DPI)
    fig.savefig(output_dir / "3-9.a.svg")
    plt.close(fig)

    print(f"已保存: 3-9.a.png / 3-9.a.svg (横坐标刻度: {valid_ticks})")

def main():
    """主函数：整合所有流程"""
    # 1. 配置绘图样式
    setup_plot_style()
    
    # 2. 加载预处理数据
    df_resistance, df_fatigue, output_dir = load_and_preprocess_data()
    
    # 3. 时间轴对齐
    df_resistance, df_fatigue, time_step = align_time_axis(df_resistance, df_fatigue)
    
    # 4. 计算电阻变化率
    e_grid, s_grid, e_max = calculate_sensitivity(df_resistance, df_fatigue, time_step)
    
    # 5. 绘制并保存图形
    plot_figure(e_grid, s_grid, e_max, output_dir)

# ==============================================================================
# 🚀 程序入口
# ==============================================================================
if __name__ == "__main__":
    main()