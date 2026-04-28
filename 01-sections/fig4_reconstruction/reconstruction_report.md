# 数据解析与动作渲染说明

本文档旨在记录本项目中关节角和三维力数据的底层解析逻辑。通过梳理物理转换公式与空间映射方法，为查阅本部分代码的开发人员提供参考。

## 1. 核心解析逻辑

### 1.1 前置处理：基线校准与电阻变化率转换
无论是应变还是压力传感器，首要步骤是将电压信号统一转换为相对电阻变化率 ($V_{true}$)。这部分包含两步处理：

1. **基线校准 (Baseline Correction)**：
   通常提取每段数据前 10-20 帧的中位数作为初始电压基准。如果发现电压存在较大的趋势性漂移，代码中会尝试用线性插值构造一条基准线，随后减去漂移量，以减轻零点漂移带来的影响。
   
2. **转换电阻变化率 ($V_{true}$)**：
   基于简单的分压模型，将校准后的电压转为实际的电阻变化率：

$$
V_{true} = \frac{V_{cc} \cdot (V_0 - V_{val})}{V_0 \cdot (V_{cc} - V_{val})}
$$

   - $V_{cc}$：供电电压（5000 mV）
   - $V_0$：初始电压基准（Baseline Voltage）

---

### 1.2 关节角初步解析 (Joint Angle)
将提取到的 $V_{true}$ 映射为手指的弯曲角度，主要经过三个步骤：

1. **通道增益调整**：
   考虑到不同传感器的制造可能存在差异，代码中引入了增益系数（Gain）。例如，CH3 通道的增益目前设为 $0.2099$。
   调整后的响应值： $V_{corr} = V_{true} \times Gain$ 。

2. **多项式拟合应变**：
   当前算法采用了一个三阶多项式来拟合物理应变百分比 $e$：

$$
e = 0.53 V_{corr}^3 - 3.43 V_{corr}^2 + 27.74 V_{corr}
$$

   *(**公式来源说明**：该多项式来源于本项目的传感器基础性能标定实验（参考 `01-sections/strain_sensitivity/raw` 中的数据）。在实验中，通过疲劳试验机对传感器施加标准拉伸应变，并同步使用高精度电阻仪记录其电阻变化率。将获取的“拉伸应变-电阻变化率”数据组进行三次多项式回归拟合，从而提取出了上述系数，用于在实际应用中根据采集到的电阻变化率反演手套的真实物理应变。)*

3. **映射物理角度**：
   最后，根据手套的穿戴几何特征，将应变值线性转换为具体的弯曲角度：

$$
\text{Angle} = (e \times 100) \times \frac{90^{\circ}}{85}
$$

   *(**映射原理**：多项式输出的 $e$ 为应变的分数值（例如 0.85 代表 85%）。公式先将其乘以 100 转为百分比。而 `90/85` 是基于穿戴测试得出的经验几何映射比例——当手指关节弯曲 90度 时，贴附在手套背面的传感器恰好会产生约 85% 的机械拉伸应变。因此，通过这个线性换算系数，可以直观地将材料形变转化为手指关节的三维旋转角度。)*

---

### 1.3 三维力初步解耦 (3D Force)
三维力传感器阵列主要由 4 个压力响应点（Pad 1, 2, 3, 4）组合而成。算法通过对这四个点的受力差异进行差模与共模计算，来解耦 Z 轴法向力以及 X/Y 轴的剪切力：

1. **单点压力转换**：
   将各个 Pad 的电阻变化率通过非线性函数转换为垂直压强 $P$ (kPa)：

$$
P = \frac{7.78 \cdot V_{true}}{0.98 - V_{true}}
$$

2. **空间方向解耦**：
   - **X轴剪切力 ($F_x$)**：基于横向点位的压力差，相关系数可根据实际标定作进一步微调。<br>
     $F_x = k_x \cdot (P_2 + P_4 - P_1 - P_3)$ (目前设定 $k_x = 1.0$)
   - **Y轴剪切力 ($F_y$)**：基于纵向点位的压力差。<br>
     $F_y = k_y \cdot (P_1 + P_2 - P_3 - P_4)$ (目前设定 $k_y = 0.667$)
   - **Z轴法向力 ($F_z$)**：四点压力简单相加。<br>
     $F_z = k_z \cdot (P_1 + P_2 + P_3 + P_4)$ (目前设定 $k_z = 1.0$)

---

## 2. 动作切片渲染存档 (Action Renderings)

代码管线将连续的测试数据切分为了 6 个“动作组”（Action 1 到 6）。为了方便直观比对，下方汇总了各动作对应的 **应变角 (Strain Angle)**、**三维力 (3D Force)** 和 **摩擦电 (Tribo Array)** 渲染图。

所有的图片文件都存放在 `https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/` 目录下。

### 🟢 动作 1：动态抓法 (Dynamic Grasping)
- 对应切片：Strain (s) | 3D Force (m) | Tribo (g)

![Action 1 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_s.png)
![Action 1 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_m.png)
![Action 1 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_g.png)

---

### 🟢 动作 2：静态抓法 (Static Grasping)
- 对应切片：Strain (t) | 3D Force (n) | Tribo (h)

![Action 2 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_t.png)
![Action 2 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_n.png)
![Action 2 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_h.png)

---

### 🟢 动作 3：动态揉法 (Dynamic Kneading)
- 对应切片：Strain (u) | 3D Force (o) | Tribo (i)

![Action 3 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_u.png)
![Action 3 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_o.png)
![Action 3 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_i.png)

---

### 🟢 动作 4：静态揉法 (Static Kneading)
- 对应切片：Strain (v) | 3D Force (p) | Tribo (j)

![Action 4 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_v.png)
![Action 4 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_p.png)
![Action 4 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_j.png)

---

### 🟢 动作 5：动态点法 (Dynamic Pressing)
- 对应切片：Strain (w) | 3D Force (q) | Tribo (k)

![Action 5 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_w.png)
![Action 5 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_q.png)
![Action 5 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_k.png)

---

### 🟢 动作 6：静态点法 (Static Pressing)
- 对应切片：Strain (x) | 3D Force (r) | Tribo (l)

![Action 6 - Strain](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_strain_array/Strain_Angle_Grid_Nx3_x.png)
![Action 6 - 3D Force](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_3d_force/3D_Force_Grid_Nx3_r.png)
![Action 6 - Tribo](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/fig4_reconstruction/renders/figure_tribo_array/Tribo_Grid_Nx3_l.png)

---

## 附录：应变传感器标定与经验系数获取说明

为了准确地将传感器采集到的电信号转换回物理应变，在项目初期开展了**基础性能标定实验**（相关数据与代码归档于 `01-sections/strain_sensitivity` 目录）。通过提取实验特征构建多项式，从而获得了前文中的经验公式： $e = 0.53 V_{corr}^3 - 3.43 V_{corr}^2 + 27.74 V_{corr}$ 。具体的参数获取流程如下：

1. **实验装置与同步数据采集**：
   使用疲劳试验机（Fatigue Testing Machine）对待标定传感器施加精确控制的线性拉伸应变（例如，从 0% 逐渐拉伸至特定形变量）。同时，采用高精度电阻仪同步记录材料在受拉伸状态下的电阻变化。原始测试数据保存在 `1.1.疲劳机.csv`（包含拉伸应变）和 `1.1.电阻.csv`（包含实时阻值）等文件中。

2. **时间轴对齐与特征转化**：
   鉴于疲劳机与电阻仪各自独立工作且采样频率不同，程序运用互相关算法（Cross-correlation）将两者的时间戳进行高精度对齐。随后提取纯加载段的数据，计算出传感器在各应变下的相对电阻变化率 $\Delta R / R_0$ (对应前文解算逻辑中的 $V_{true}$)。

3. **反向三阶多项式拟合**：
   获取一系列对齐的“拉伸应变 - 电阻变化率”数据对后，为了让软件能够通过测量到的电阻变化反推出物理应变，分析程序将“电阻变化率”设为自变量 ($x$)，“物理应变”设为因变量 ($y$)，进行了三阶多项式回归拟合（Cubic Polynomial Regression）。拟合最终确定了上述的经验系数（0.53, -3.43, 27.74），能够良好地修正传感器的非线性响应。

下图（SI-3）展示了程序汇总渲染的多组不同实验条件下传感器的灵敏度标定曲线特征：

![Strain Sensitivity Calibration Result](https://raw.githubusercontent.com/ipc-robot/glove/main/01-sections/strain_sensitivity/renders/SI-3.png)
