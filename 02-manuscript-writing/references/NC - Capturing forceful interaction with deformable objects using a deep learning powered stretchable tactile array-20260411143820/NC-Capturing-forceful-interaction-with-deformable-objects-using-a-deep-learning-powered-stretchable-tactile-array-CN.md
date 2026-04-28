# Capturing forceful interaction with deformable objects using a deep learning- powered stretchable tactile array

# 利用深度学习驱动的可拉伸触觉阵列捕捉与可变形物体的强力交互

Chunpeng Jiang 6 ${}^{1,7}$ , Wenqiang Xu ${}^{2,7}$ , Yutong Li ${}^{2}$ , Zhenjun Yu @ ${}^{2}$ , Longchun Wang ${}^{1}$ , Xiaotong Hu ${}^{1,3}$ , Zhengyi Xie ${}^{1,3}$ , Qingkun Liu ${}^{1}$ Bin Yang ${}^{1}$ , Xiaolin Wang ${}^{1}$ , Wenxin Du ${}^{2}$ , Tutian Tang © ${}^{2}$ , Dongzhe Zheng ${}^{2}$ , Siqiong Yao ${}^{2}$ , Cewu Lu ${}^{5,6}$ & Jingquan Liu ${}^{1}$ )

Chunpeng Jiang 6 ${}^{1,7}$ , Wenqiang Xu ${}^{2,7}$ , Yutong Li ${}^{2}$ , Zhenjun Yu @ ${}^{2}$ , Longchun Wang ${}^{1}$ , Xiaotong Hu ${}^{1,3}$ , Zhengyi Xie ${}^{1,3}$ , Qingkun Liu ${}^{1}$ Bin Yang ${}^{1}$ , Xiaolin Wang ${}^{1}$ , Wenxin Du ${}^{2}$ , Tutian Tang © ${}^{2}$ , Dongzhe Zheng ${}^{2}$ , Siqiong Yao ${}^{2}$ , Cewu Lu ${}^{5,6}$ & Jingquan Liu ${}^{1}$ )

Capturing forceful interaction with deformable objects during manipulation benefits applications like virtual reality, telemedicine, and robotics. Replicating full hand-object states with complete geometry is challenging because of the occluded object deformations. Here, we report a visual-tactile recording and tracking system for manipulation featuring a stretchable tactile glove with 1152 force-sensing channels and a visual-tactile joint learning framework to estimate dynamic hand-object states during manipulation. To overcome the strain interference caused by contact with deformable objects, an active suppression method based on symmetric response detection and adaptive calibration is proposed and achieves 97.6% accuracy in force measurement, contributing to an improvement of 45.3%. The learning framework processes the visual-tactile sequence and reconstructs hand-object states. We experiment on 24 objects from 6 categories including both deformable and rigid ones with an average reconstruction error of ${1.8}\mathrm{\;{cm}}$ for all sequences, demonstrating a universal ability to replicate human knowledge in manipulating objects with varying degrees of deformability.

在操作过程中捕捉与可变形物体的强力交互，对虚拟现实、远程医疗和机器人技术等应用大有裨益。由于物体变形存在遮挡，复现完整的手-物交互状态极具挑战。本文提出了一种用于操作的视触觉记录与追踪系统，该系统配备了具有1152个力传感通道的可拉伸触觉手套，以及一个用于估计操作过程中动态手-物状态的视触觉联合学习框架。为克服与可变形物体接触产生的应变干扰，我们提出了一种基于对称响应检测和自适应校准的主动抑制方法，使力测量精度达到97.6%，提升了45.3%。该学习框架通过处理视触觉序列来重构手-物状态。我们对涵盖可变形和刚性物体的6类共24个物体进行了实验，所有序列的平均重构误差为 ${1.8}\mathrm{\;{cm}}$，证明了该系统在复现人类操作不同变形程度物体时的通用能力。

---

Received: 20 February 2024

收稿日期:2024年2月20日

Accepted: 18 October 2024

接受日期:2024年10月18日

Published online: 04 November 2024

在线发表:2024年11月4日

B. Check for updates

B. 检查更新

---

Human-machine interaction (HMI) systems serve as gateways to the metaverse, acting as bridges between the physical world and the digital realm. A natural user interface in HMI allows humans to perform natural and intuitive control ${}^{1}$ . Although the non-forceful interfaces such as hand gestures (Fig. 1A(i)) can be tracked using technologies like inertial measurement units ${\left( \mathrm{{IMU}}\right) }^{2}$ , electromyography (EMG) ${\text{ sensors }}^{3,4}$ , strain sensors ${}^{5,6}$ , video recording ${}^{7}$ and triboelectric sensors ${}^{8}$ , the forceful interfaces such as interaction with objects, i.e., the human manipulation, are less explored ${}^{9,{10}}$ . Capturing forceful human manipulation has extensive potential applications, such as virtual reality ${\left( \mathrm{{VR}}\right) }^{{11},{12}}$ , telemedicine ${}^{13}$ , robotics ${}^{{14},{15}}$ , and contributes to real-world understanding for large artificial intelligence (AI) models ${}^{16}$ . Replicating the hand-object interplay is the first step to applying human manipulation knowledge in these applications. However, the hand-object states captured in previous research were far from complete. They mainly explore tasks like semantic recognition and spatial localization to predict object category and position (Fig. 1A(ii)) ${}^{{17} - {20}}$ . Imagine a general manipulation case: when a human rubs plasticine to a desired shape, he needs to sense the surface deformation and track the object's geometric states. Tactile perception takes precedence in analyzing deformations within the contact area ${}^{21}$ , while visual perception is utilized to estimate the overall object states (Fig. 1B(i)) ${}^{22}$ . Thus, to capture the comprehensive information during manipulation in a human-like way ${}^{23}$ , a system that can record the visual-tactile sensory data and estimate the fine-grained hand-object states is desired.

人机交互(HMI)系统是通往元宇宙的门户，充当着物理世界与数字领域之间的桥梁。HMI中的自然用户界面允许人类进行自然且直观的控制 ${}^{1}$。尽管非强力交互界面(如手势，图1A(i))可以通过惯性测量单元 ${\left( \mathrm{{IMU}}\right) }^{2}$、肌电图(EMG) ${\text{ sensors }}^{3,4}$、应变传感器 ${}^{5,6}$、视频记录 ${}^{7}$ 和摩擦电传感器 ${}^{8}$ 等技术进行追踪，但强力交互界面(即人类操作物体)的研究尚不充分 ${}^{9,{10}}$。捕捉强力人类操作具有广泛的应用前景，如虚拟现实 ${\left( \mathrm{{VR}}\right) }^{{11},{12}}$、远程医疗 ${}^{13}$、机器人技术 ${}^{{14},{15}}$，并有助于大型人工智能(AI)模型对现实世界的理解 ${}^{16}$。复现手-物交互是应用人类操作知识的第一步。然而，以往研究中捕捉到的手-物状态远未达到完整。它们主要探索语义识别和空间定位等任务，以预测物体类别和位置(图1A(ii)) ${}^{{17} - {20}}$。设想一个通用的操作案例:当人类揉捏橡皮泥至所需形状时，需要感知表面变形并追踪物体的几何状态。触觉感知在分析接触区域内的变形时占据优先地位 ${}^{21}$，而视觉感知则用于估计物体的整体状态(图1B(i)) ${}^{22}$。因此，为了以类人的方式捕捉操作过程中的全面信息 ${}^{23}$，亟需一种能够记录视触觉感知数据并估计细粒度手-物状态的系统。

---

${}^{1}$ National Key Laboratory of Advanced Micro and Nano Manufacture Technology, Shanghai Jiao Tong University, Shanghai, China. ${}^{2}$ School of Electronic Information and Electrical Engineering, Shanghai Jiao Tong University, Shanghai, China. ${}^{3}$ IFSA-DCI Team, Department of Micro/Nano Electronics, School of Electronic Information and Electrical Engineering, Shanghai Jiao Tong University, Shanghai, China. ${}^{4}$ SJTU-Yale Joint Center of Biostatistics and Data Science, National Center for Translational Medicine, MoE, Key Lab of Artificial Intelligence, AI Institute Shanghai Jiao Tong University, Shanghai, China. ${}^{5}$ School of Artificial Intelligence, Shanghai Jiao Tong University, Shanghai, China. ${}^{6}$ Present address: School of Electronic Information and Electrical Engineering, Shanghai Jiao Tong University, Shanghai, China. 7These authors contributed equally: Chunpeng Jiang, Wenqiang Xu. & e-mail: lucewu@sjtu.edu.cn; jqliu@sjtu.edu.cn

${}^{1}$ 上海交通大学先进微纳制造技术全国重点实验室，中国上海。${}^{2}$ 上海交通大学电子信息与电气工程学院，中国上海。${}^{3}$ 上海交通大学电子信息与电气工程学院微纳电子学系，IFSA-DCI团队，中国上海。${}^{4}$ 上海交通大学生物统计与数据科学联合中心、国家转化医学中心、教育部人工智能重点实验室、人工智能研究院，中国上海。${}^{5}$ 上海交通大学人工智能学院，中国上海。${}^{6}$ 现通讯地址:上海交通大学电子信息与电气工程学院，中国上海。7这些作者对本文贡献均等:姜春鹏，徐文强。& 电子邮箱:lucewu@sjtu.edu.cn; jqliu@sjtu.edu.cn

---

![bo_d7cuo9qlb0pc73dec7d0_1_153_126_1459_1420_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_1_153_126_1459_1420_0.jpg)

Fig. 1 | The tactile array-based glove, enhanced by deep learning, with an advantage of capturing the forceful interaction with deformable objects. A The (i) non-forceful and (ii) forceful interactions that involve human manipulation in the field of HMI and their response results demonstrating the progress from low to high dimensions. B The overview of our proposed ViTaM system: (i) A human-inspired joint perception method of processing cross-modal visual and tactile signals simultaneously during manipulation to realize state tracking; (ii) The sensing error caused by the strain at stretchable interfaces, which deteriorates the accuracy of force measurement and the application effectiveness of tactile sensors; (iii) The force recording solution that includes a high-density, stretchable tactile glove with active strain interference suppression and a VR interface to show the results of distributed force detections; (iv) The applications of object state estimation powered by a deep learning architecture, enabling the reconstruction of overall object geometry and the fine-grained surface deformation in the contact area, particularly for deformable items.

图1 | 基于深度学习增强的触觉阵列手套，其优势在于能够捕捉与可变形物体之间的强力交互。A (i)非强力与(ii)强力交互，涉及人机交互(HMI)领域中的人类操作及其响应结果，展示了从低维到高维的演进。B 我们提出的ViTaM系统概览:(i)一种受人类启发的联合感知方法，在操作过程中同步处理跨模态视觉和触觉信号，以实现状态跟踪；(ii)由可拉伸界面上的应变引起的传感误差，这会降低力测量的精度和触觉传感器的应用效果；(iii)力记录解决方案，包括具有主动应变干扰抑制功能的高密度可拉伸触觉手套，以及用于展示分布式力检测结果的VR界面；(iv)由深度学习架构驱动的物体状态估计应用，能够实现物体整体几何形状的重建以及接触区域的精细表面变形，特别适用于可变形物体。

Recording tactile data in hand-object interplay is challenging, particularly when recording forces on stretchable interfaces during interactions with deformable objects. On the one hand, the tactile array should feature a high-density distribution of force-sensing units to cover multiple contact areas during object operation. A natural choice is to integrate a tactile array into a wearable glove using textile techniques ${}^{{24} - {26}}$ . On the other hand, the tactile array should be a stretchable interface, ensuring conformal contact with deformable objects ${}^{27}$ . However, when in contact with a deformable surface, the extension or bending of the stretchable tactile array could encounter undesired interference with output signals due to the increasing strain (Fig. 1B(ii)) ${}^{{28} - {32}}$ . Unlike traditional rigid-rigid or flexible-rigid interfaces without stretchability, it is suggested that the normal force cannot be independently measured at the stretchable surfaces, otherwise the strain will significantly impair precise force measurement ${}^{33}$ . To achieve strain insensitivity, previous studies have typically solved the problem from structural or material perspectives. Structurally, methods include stretchable geometric structures ${}^{{34} - {37}}$ , stress isolation structures ${}^{{38} - {41}}$ , and Negative Poisson's ratio structures ${}^{{42} - {44}}$ . Material strategies include strain redundancy techniques ${}^{{45} - {48}}$ , localized microcracking techniques ${}^{{49} - {51}}$ , and nanofiber network encapsulation technique ${}^{{52} - {54}}$ . These techniques belong to the source-protection approach, concentrating on the "input end" of the sensor and aiming to reduce or eliminate the influence of strain interference on tactile arrays in an open-loop non-adaptive manner ${}^{{55} - {57}}$ . However, these techniques have three limitations: no quantitative assessment of the strain received, no quantitative assessment of the strain suppressed and no measurement standard considering real-time testing conditions. Thus, a closed-loop adaptive tactile data recording approach is desired, where the closed-loop monitoring quantitatively detects and suppresses the strain interference and adaptive force estimation highly suits the deformable interface with unpredictable or high degrees of freedom.

在手与物体的交互中记录触觉数据极具挑战性，尤其是在与可变形物体交互时，记录可拉伸界面上的力更是如此。一方面，触觉阵列应具备高密度的力传感单元分布，以覆盖物体操作过程中的多个接触区域。一种自然的选择是利用纺织技术将触觉阵列集成到可穿戴手套中${}^{{24} - {26}}$。另一方面，触觉阵列应作为一种可拉伸界面，确保与可变形物体实现共形接触${}^{27}$。然而，当与可变形表面接触时，可拉伸触觉阵列的拉伸或弯曲可能会因应变增加而对输出信号产生不必要的干扰(图1B(ii))${}^{{28} - {32}}$。与不具备可拉伸性的传统刚性-刚性或柔性-刚性界面不同，研究表明，在可拉伸表面上无法独立测量法向力，否则应变将严重损害力测量的精度${}^{33}$。为了实现对应变的解耦，以往的研究通常从结构或材料的角度解决该问题。在结构上，方法包括可拉伸几何结构${}^{{34} - {37}}$、应力隔离结构${}^{{38} - {41}}$以及负泊松比结构${}^{{42} - {44}}$。材料策略包括应变冗余技术${}^{{45} - {48}}$、局部微裂纹技术${}^{{49} - {51}}$以及纳米纤维网络封装技术${}^{{52} - {54}}$。这些技术属于源头保护方法，侧重于传感器的“输入端”，旨在以开环非自适应的方式减少或消除应变干扰对触觉阵列的影响${}^{{55} - {57}}$。然而，这些技术存在三个局限性:缺乏对应变接收的定量评估、缺乏对应变抑制的定量评估，以及缺乏考虑实时测试条件的测量标准。因此，需要一种闭环自适应触觉数据记录方法，通过闭环监测定量检测并抑制应变干扰，且自适应力估计非常适合具有不可预测性或高自由度的可变形界面。

Although closed-loop adaptive perception of tactile data facilitates the estimation of object deformation at the contact area, it is insufficient for recovering the complete object state, as some parts of the object remain out of contact. Thus, it is naturally necessary to adopt the assistance of global signals, such as visual perception, to obtain the full object geometry ${}^{58}$ . Previous works on visual-tactile joint learning have primarily relied on camera-based tactile sensors ${}^{{59} - {61}}$ , benefiting from their locally high-resolution and 2D grid-like data format. Along with visual images, they have been utilized for hand pose estimation, in-manipulation object pose estimation, and geometric reconstruction ${}^{{62},{63}}$ . However, these visual-tactile models capture the hand-object interaction in static settings and do not consider the temporal consistency of hand movements and object deformation ${}^{64}$ . Supplementary Table 1 compares visual-only, tactile-only, and visual-tactile modalities for object understanding and manipulation.

尽管触觉数据的闭环自适应感知有助于估计接触区域的物体形变，但由于物体部分区域处于非接触状态，仅凭此不足以恢复物体的完整状态。因此，引入视觉感知等全局信号来获取完整的物体几何形状是必然之举 ${}^{58}$。以往关于视觉-触觉联合学习的研究主要依赖于基于相机的触觉传感器 ${}^{{59} - {61}}$，得益于其局部高分辨率和二维网格状的数据格式。结合视觉图像，它们已被用于手部姿态估计、操作中的物体姿态估计以及几何重建 ${}^{{62},{63}}$。然而，这些视觉-触觉模型仅在静态环境下捕捉手与物体的交互，并未考虑手部运动和物体形变的时间一致性 ${}^{64}$。补充表1比较了仅视觉、仅触觉以及视觉-触觉模态在物体理解与操作方面的差异。

To capture the forceful human manipulation of deformable objects, this paper proposed a visual-tactile recording and tracking system for manipulation named ViTaM, which employs a high-density, glove-shaped stretchable tactile array for force recording and a deep learning framework for visual-tactile data processing and hand-object state estimation. Especially, the stretchable tactile array works in an output-focus sensing paradigm by measuring forces under different strains in a closed-loop adaptive manner. Based on the proposed negative/positive stretching-resistive effect, quantitative symmetric response detection and suppression evaluation of strain interference are achieved, enabling accurate force measurement on the stretchable interface with an accuracy of 97.6%, which has an improvement of 45.3% compared with the uncalibrated measurements. Meanwhile, a point cloud sequence as visual observations captures the entire interaction process. During data processing and hand-object state estimation, the learning framework adopts two distinct neural network branches to encode visual and tactile information respectively, and reconstructs the fine-grained surface deformation and the complete object geometry. To demonstrate the generalization ability of the learning framework, we select 24 objects from 6 categories, including both deformable and rigid ones, and we can achieve an average reconstruction error of ${1.8}\mathrm{\;{cm}}$ over all sequences. This work marks a revolutionary advancement of perception tools for human manipulation, takes a step towards a more generic recording approach for both rigid and deformable objects, completes the last mile of forceful interaction by machine intelligence, and improves the learning framework for linking the physical world and the digital realm.

为了捕捉人类对可变形物体施加的力交互，本文提出了一种名为 ViTaM 的视觉-触觉记录与跟踪系统。该系统采用高密度手套式可拉伸触觉阵列进行力记录，并利用深度学习框架进行视觉-触觉数据处理及手-物状态估计。特别是，该可拉伸触觉阵列采用输出聚焦传感范式，通过闭环自适应方式测量不同应变下的力。基于所提出的负/正拉伸电阻效应，实现了应变干扰的定量对称响应检测与抑制评估，使可拉伸界面上的力测量精度达到 97.6%，较未校准测量提升了 45.3%。同时，点云序列作为视觉观测捕捉了整个交互过程。在数据处理和手-物状态估计过程中，学习框架采用两个独立的神经网络分支分别编码视觉和触觉信息，并重建精细的表面形变及完整的物体几何形状。为验证学习框架的泛化能力，我们选取了涵盖可变形和刚性物体的 6 类共 24 个物体，在所有序列中实现了 ${1.8}\mathrm{\;{cm}}$ 的平均重建误差。这项工作标志着人类操作感知工具的革命性进步，向更通用的刚性和可变形物体记录方法迈出了一步，补全了机器智能在力交互领域的最后一块拼图，并改进了连接物理世界与数字领域的学习框架。

## Results

## 结果

## Overview of the ViTaM system

## ViTaM 系统概述

The design of the ViTaM system is rooted in the idea of capturing fine-grained information during forceful interaction with deformable objects. It records the manipulation process with a proposed high-density, stretchable tactile glove, and a 3D camera, and estimates the hand-object state at the geometric level with a proposed visual-tactile joint learning framework. When the user interacts with objects, the hand-object state at the contact area is recorded by the tactile glove. It has high-density tactile sensing units with a maximum of 1152 channels distributed all over the palm and can accurately capture the force dynamics with a frame rate of ${13}\mathrm{\;{Hz}}$ on the stretchable interface between the hand and object during interaction (Fig. 1B(iii)). Meanwhile, the hand-object state at the non-contact area is recorded by a high-precision depth camera. The captured force measurement and point cloud sequence are processed by the visual-tactile learning model proposed in this article, facilitating cross-modal data feature fusion, ultimately enabling the tracking and geometric 3D reconstruction of manipulated objects with varying deformability, including both deformable (e.g., elastic and plastic) and rigid ones (Fig. 1B(iv)).

ViTaM 系统的设计初衷在于捕捉可变形物体在受力交互过程中的细粒度信息。它利用所提出的高密度可拉伸触觉手套和 3D 相机记录操作过程，并通过提出的视觉-触觉联合学习框架在几何层面估计手-物状态。当用户与物体交互时，接触区域的手-物状态由触觉手套记录。该手套在手掌各处分布有最多 1152 个通道的高密度触觉传感单元，能够以 ${13}\mathrm{\;{Hz}}$ 的帧率精确捕捉手与物体在交互过程中可拉伸界面上的力动态(图 1B(iii))。同时，非接触区域的手-物状态由高精度深度相机记录。所捕获的力测量值和点云序列由本文提出的视觉-触觉学习模型进行处理，促进了跨模态数据特征融合，最终实现了对不同形变能力(包括可变形物体如弹性体和塑性体，以及刚性物体)的被操作物体的跟踪与 3D 几何重建(图 1B(iv))。

## Design and fabrication of the tactile glove

## 触觉手套的设计与制造

The tactile glove contains the following modules (Fig. 2A): tactile sensing blocks, a fabric glove, flexible printed circuits (FPCs), a multichannel scanning circuit, a processing circuit, and a bracelet. The naming labels of tactile sensing blocks are given in Fig. S1. Three types of FPCs connect the finger and palm sensing areas with the multichannel scanning circuit and processing circuit (Fig. S2). Fixing and encapsulation methods are detailed in Fig. S3. The modular design allows for optimal performance, on-demand density expansion, and detachability. The multi-channel scanning circuit (Fig. S4), which contains a force sensing circuit (Fig. S5A) and strain interference detection circuits (Fig. S5B), supports up to 1152 sensing units per frame, with the prototype demonstrating 456 sensing units. Additionally, a custom data transmission protocol ensures efficient and adaptable data transfer (Fig. S6). In Fig. S7A, the tactile glove demonstrates excellent wearability and conformability through two distinct gestures. To validate the yield rate of the prototype, external forces were applied to each area of the five fingers (Fig. S7B) and palm (Fig. S7C) of the tactile glove. Upon calculation, the yield rate was determined to be 97.15%, which is sufficient to meet the requirements of most human-machine interaction applications. Besides, the estimated costs of the tactile glove and hardware are \$3.38 (Supplementary Table 2) and \$26.63 (Supplementary Table 3), respectively, fostering widespread public acceptance ${}^{16}$ . In the future, due to the simplicity of the processing procedure and automation advancements in processing equipment (such as sewing machines), there is significant potential for mass production of this tactile glove.

该触觉手套包含以下模块(图2A):触觉传感块、织物手套、柔性印刷电路(FPC)、多通道扫描电路、处理电路和腕带。触觉传感块的命名标签见图S1。三种类型的FPC将手指和手掌传感区域与多通道扫描电路及处理电路连接起来(图S2)。固定和封装方法详见图S3。模块化设计实现了最佳性能、按需密度扩展和可拆卸性。多通道扫描电路(图S4)包含力传感电路(图S5A)和应变干扰检测电路(图S5B)，每帧支持多达1152个传感单元，原型机展示了456个传感单元。此外，定制的数据传输协议确保了高效且灵活的数据传输(图S6)。在图S7A中，触觉手套通过两种不同的手势展示了出色的穿戴性和贴合性。为验证原型机的成品率，我们对触觉手套的五个手指(图S7B)和手掌(图S7C)的每个区域施加了外力。经计算，成品率为97.15%，足以满足大多数人机交互应用的需求。此外，触觉手套和硬件的预估成本分别为3.38美元(补充表2)和26.63美元(补充表3)，有助于其在公众中的广泛普及 ${}^{16}$ 。未来，得益于加工流程的简便性以及加工设备(如缝纫机)的自动化进步，该触觉手套具有巨大的量产潜力。

The tactile array consists of multiple tactile sensing blocks, and each block includes a positive strain sensor, a negative strain sensor, and a force sensor array (Fig. 2B(i)). The negative and positive strain electrodes are connected with the assembled composite film, respectively (Fig. 2B(ii)). Besides, the conductive fabric wires are sewn onto the assembled composite film, forming the row electrode array and column electrode array of the tactile force sensor array, with the rows and columns positioned perpendicular to each other. The fully woven wiring method is given in Fig. S8A and the overlap of a row electrode, an assembled composite film, and a column electrode forms a tactile sensing unit (Fig. S8B). As shown in the cross-sectional view of Fig. 2B(iii), the electrodes are tightly shuttled between the films, avoiding the use of an adhesive layer and showing better assembling. Different from conventional techniques like photolithography or screen print, which assemble the top and bottom electrode layers on the two sides of the sensing film, this fully woven wiring method requires no adhesive for layer contact, so interlayer delamination will not occur, leading to better reliability, conformality, and wear resistance. Adjacent blocks share the row and column electrodes (Fig. S9).

触觉阵列由多个触觉传感块组成，每个传感块包含一个正应变传感器、一个负应变传感器和一个力传感器阵列(图2B(i))。负应变电极和正应变电极分别与组装好的复合薄膜相连(图2B(ii))。此外，导电织物线被缝合在组装好的复合薄膜上，形成触觉力传感器阵列的行电极阵列和列电极阵列，行与列相互垂直。全编织布线方法见图S8A，行电极、组装复合薄膜和列电极的重叠部分构成了一个触觉传感单元(图S8B)。如图2B(iii)的横截面图所示，电极紧密穿梭于薄膜之间，避免了使用粘合层，展现出更好的组装效果。与传统的光刻或丝网印刷技术(将顶部和底部电极层组装在传感薄膜两侧)不同，这种全编织布线方法在层间接触时无需粘合剂，因此不会发生层间剥离，从而具有更高的可靠性、贴合性和耐磨性。相邻的传感块共享行电极和列电极(图S9)。

The above assembled composite film is composed of stacked positive effect membrane (the orange layer) and negative effect membrane (the blue layer), each linked to a strain detection module via electrode pairs. Figure S10 illustrates the fabrication of negative and positive effect membranes. The negative stretching-resistive effect was first proposed in our previous work ${}^{65}$ . The positive or negative effect of a film is determined by the content of carbon nanotubes (CNTs). A higher weight ratio of CNTs than 3.3 wt% in the natural latex substrate leads to a negative stretching-resistive effect, while a lower CNT weight ratio results in a positive effect. In this experiment, the CNT contents of 5 wt% and 2.9 wt% are chosen because they show comparable resistance changes with similar amplitudes but opposite changing trends when the strain increases gradually from 0 to ${50}\%$ (Fig. 2C). This phenomenon enables the measurement of the strain variation across a wide range, covering the maximum extension region of the fingertip of ${40}{\% }^{66}$ .

上述组装好的复合薄膜由堆叠的正效应膜(橙色层)和负效应膜(蓝色层)组成，每一层都通过电极对与应变检测模块相连。图S10展示了负效应膜和正效应膜的制造过程。负拉伸电阻效应最早在我们之前的工作中提出 ${}^{65}$ 。薄膜的正效应或负效应由碳纳米管(CNT)的含量决定。天然乳胶基底中CNT的重量比高于3.3 wt%时会产生负拉伸电阻效应，而较低的CNT重量比则产生正效应。在本实验中，选择5 wt%和2.9 wt%的CNT含量，是因为当应变从0逐渐增加到 ${50}\%$ 时，它们表现出幅度相似但变化趋势相反的电阻变化(图2C)。这一现象使得测量大范围内的应变变化成为可能，覆盖了指尖 ${40}{\% }^{66}$ 的最大伸展区域。

![bo_d7cuo9qlb0pc73dec7d0_3_156_130_1456_1007_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_3_156_130_1456_1007_0.jpg)

Fig. 2 | Design, fabrication, and testing of the tactile glove with the capability of strain interference suppression. A The blow-up schematic of the high-density and stretchable tactile glove with a maximum sensing channel of 1152; B (i) The structure of a tactile sensing block with two pairs of strain electrodes, row electrode array, and column electrode array; (ii) the enlarged view showing the positions of strain electrodes; (iii) the side view of the tactile sensing block showing tight assembling. C The relative resistance variation curves of the positive effect membranes and negative effect membranes when subjected to a strain increasing from 0 to 50%, which is named a symmetric response to the sensing error of strain. D The closed-loop and quantitatively adaptive system for the detection and suppression of strain interference on the stretchable interface.

图 2 | 具备应变干扰抑制能力的触觉手套的设计、制造与测试。A 高密度可拉伸触觉手套的爆炸图，最大传感通道数为 1152；B (i) 包含两对应变电极、行电极阵列和列电极阵列的触觉传感单元结构；(ii) 显示应变电极位置的放大视图；(iii) 显示紧密组装的触觉传感单元侧视图。C 正效应膜和负效应膜在应变从 0 增加到 50% 时的相对电阻变化曲线，即对应变传感误差的对称响应。D 用于检测和抑制可拉伸界面上应变干扰的闭环定量自适应系统。

## Adaptive strain interference suppression method

## 自适应应变干扰抑制方法

To improve the accuracy of force measurements when manipulating deformable objects, an adaptive strain interference suppression method is proposed for the detection and suppression of strain interference on the stretchable interface (Fig. 2D). Generally, the tactile array outputs a signal variation with the applied force changing, and a curve depicting the relationship of the forces and the outputs is obtained (called force estimation curve). Inferring a force based on the specified and pre-tested force estimation curve is the conventional open-loop measurement method for tactile sensors. However, in this work, in addition to the forces exerted on the composite film, the strain interference is also detected in a closed-loop manner. Prior to force calibration, several tests are performed to measure the force estimation curves under several different strains (shown in the next section). The following steps shown in Fig. S11A offer the detailed process: (i) First, how can the presence of strain interference be determined? The positive and negative effect membranes are connected with the strain detection module, respectively, constituting a novel dual input mode. As soon as an increased strain interference occurs, the output voltage of the strain detection circuit promptly shows a synchronized rise edge and further generates a warning flag to alert the existence of strain interference; (ii) Second, how can the magnitude of the strain interference be quantitatively determined? If strain interference exists, the strain ${\varepsilon }_{\mathrm{x}}$ can be inferred from the relative resistive variation curve based on Fig. 2C. This stage determines the appropriate calibration coefficient in the subsequent calibration step; (iii) Third, how to obtain the force estimation curve under ${\varepsilon }_{\mathrm{x}}$ ? Since it is impractical to enumerate force estimation curves for all possible strain interferences, this study proposes a method called "local domain curve interpolation" to update the force estimation curve corresponding to ${\varepsilon }_{\mathrm{x}}$ . As shown in Fig. S11, identifying the two strain values closest to ${\varepsilon }_{\mathrm{x}}$ among the known conditions (named ${\varepsilon }_{\_ \text{ up }}$ and ${\varepsilon }_{\text{ \_bottom }}$ ) and their corresponding force estimation curves (named curve_up and curve_bottom). Then, a new curve is interpolated between curve_up and curve_bottom in proportion to the distance between ${\varepsilon }_{\mathrm{x}}$ and ${\varepsilon }_{\text{ \_up }},{\varepsilon }_{\text{ \_bottom }}$ . This interpolated curve (named curve_x) represents the force estimation curve corresponding to the strain interference ${\varepsilon }_{\mathrm{x}}$ ; (iv) Fourthly, using curve_x to calculate the force under the strain interference ${\varepsilon }_{\mathrm{x}}$ . The examples in Fig. S11B illustrate the obtained interpolated force estimation curve when the ${\varepsilon }_{\mu \mathrm{p}}$ is ${10}\% ,{\varepsilon }_{\mu \text{ bottom is 0 }\% \text{ , and }}{\varepsilon }_{\mathrm{x}}$ is 2.5%,5%, and 7.5%, respectively.

为提高操作可变形物体时力测量的准确性，本研究提出了一种自适应应变干扰抑制方法，用于检测并抑制可拉伸界面上的应变干扰(图 2D)。通常，触觉阵列的输出信号随施加力的变化而变化，由此可获得描述力与输出之间关系的曲线(称为力估计曲线)。基于预先测试的特定力估计曲线来推断力，是触觉传感器传统的开环测量方法。然而，在本研究中，除了作用于复合薄膜的力之外，应变干扰也以闭环方式被检测。在力校准之前，需进行多次测试以测量不同应变下的力估计曲线(详见下一节)。图 S11A 展示了详细步骤:(i) 首先，如何确定应变干扰的存在？正、负效应膜分别与应变检测模块连接，构成一种新型双输入模式。一旦出现应变干扰，应变检测电路的输出电压会立即显示同步上升沿，并生成警告标志以提示应变干扰的存在；(ii) 其次，如何定量确定应变干扰的大小？若存在应变干扰，可根据图 2C 的相对电阻变化曲线推断出应变 ${\varepsilon }_{\mathrm{x}}$。该阶段确定了后续校准步骤中合适的校准系数；(iii) 第三，如何获得 ${\varepsilon }_{\mathrm{x}}$ 下的力估计曲线？由于枚举所有可能应变干扰下的力估计曲线不切实际，本研究提出了一种称为“局部域曲线插值”的方法，用于更新对应于 ${\varepsilon }_{\mathrm{x}}$ 的力估计曲线。如图 S11 所示，识别出已知条件中与 ${\varepsilon }_{\mathrm{x}}$ 最接近的两个应变值(记为 ${\varepsilon }_{\_ \text{ up }}$ 和 ${\varepsilon }_{\text{ \_bottom }}$)及其对应的力估计曲线(记为 curve_up 和 curve_bottom)。然后，根据 ${\varepsilon }_{\mathrm{x}}$ 与 ${\varepsilon }_{\text{ \_up }},{\varepsilon }_{\text{ \_bottom }}$ 之间的距离比例，在 curve_up 和 curve_bottom 之间进行插值。这条插值曲线(记为 curve_x)即代表对应于应变干扰 ${\varepsilon }_{\mathrm{x}}$ 的力估计曲线；(iv) 第四，使用 curve_x 计算应变干扰 ${\varepsilon }_{\mathrm{x}}$ 下的力。图 S11B 中的示例展示了当 ${\varepsilon }_{\mu \mathrm{p}}$ 为 ${10}\% ,{\varepsilon }_{\mu \text{ bottom is 0 }\% \text{ , and }}{\varepsilon }_{\mathrm{x}}$ 分别为 2.5%、5% 和 7.5% 时所获得的插值力估计曲线。

![bo_d7cuo9qlb0pc73dec7d0_4_154_132_1454_1445_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_4_154_132_1454_1445_0.jpg)

Fig. 3 | Characterizations of the tactile array. A Photographs of the tactile sensing film with various forms: (i) flat, (ii) rolled and (iii) rounded. B The SEM image of the cross-section appearance of the membrane. C The TEM image showing the distributions of the aligned CNTs and the natural latex particles. D Photographs of a tactile sensing block attached to the knuckle inside the glove as it bends and straightens. E (i) The relative resistive variations of the positive, and negative effect films and (ii) the output voltage with rise edges. F Circuit simulation of (i) the relative resistive variations of the positive and negative effect membranes; and (ii) the voltages of positive, and negative effect membranes and the output voltage, respectively. G Changes in the output voltage versus force curves of the tactile sensing unit under different strain interferences. H The fitted curve of the calibration module when strain interference occurs between 0 and 10%. I The relative error between the estimated forces and the applied forces under different strains. J The relative resistance variation of a tactile sensing unit in the range of 0 to 400 kPa, under a strain of 5%. K The repeatability test under a load pressure of 5 kPa over 2000 times. L The final voltage output curve of the tactile sensing unit versus the loaded forces or pressures.

图 3 | 触觉阵列的表征。A 触觉传感薄膜的各种形态照片:(i) 平展，(ii) 卷曲，(iii) 圆形。B 薄膜横截面的扫描电子显微镜(SEM)图像。C 显示排列的碳纳米管(CNTs)与天然乳胶颗粒分布的透射电子显微镜(TEM)图像。D 触觉传感块安装在手套内指关节处，随手指弯曲和伸直时的照片。(E) (i) 正效应膜与负效应膜的相对电阻变化，以及 (ii) 带有上升沿的输出电压。F (i) 正效应膜与负效应膜的相对电阻变化；以及 (ii) 正效应膜、负效应膜的电压及输出电压的电路仿真。G 在不同应变干扰下，触觉传感单元输出电压随力变化的曲线。H 当应变干扰在 0 到 10% 之间时，校准模块的拟合曲线。I 在不同应变下，估计力与施加力之间的相对误差。J 在 5% 应变下，触觉传感单元在 0 到 400 kPa 范围内的相对电阻变化。K 在 5 kPa 负载压力下，经过 2000 次循环的重复性测试。L 触觉传感单元输出电压随负载力或压力变化的最终曲线。

In this adaptive system, the force measurement improves from a single-factor derivation of voltage alone to a dual dependent variable control of voltage and strain, surpassing the traditional single-electrode approaches and improving the accuracy of force estimation. In previous studies ${}^{{67},{68}}$ , the resistance rise or fall of the piezoresistive sensor cannot determine whether the sensor is subjected to strain, load force, or both. As for our method, the two inputs that are simultaneously monitored show opposite change trends, preventing false judgments and offering sensitive responses even with the slightest strain disturbances. Supplementary Table 4 compares the current methods for strain interference suppression and our method, revealing the proposed way is more straightforward without additional strain redistributing/releasing micro-structures or stress-absorbing materials. Therefore, this strategy has the potential to expand from prototypes to applications in wider fields that contain strain interference.

在该自适应系统中，力测量从单一的电压推导改进为电压与应变双变量控制，超越了传统的单电极方法，提高了力估计的准确性。在以往的研究 ${}^{{67},{68}}$ 中，压阻传感器的电阻上升或下降无法确定传感器是受到应变、负载力还是两者共同作用。而我们的方法通过同时监测两个输入信号，它们呈现出相反的变化趋势，从而避免了误判，即使在极微小的应变干扰下也能提供灵敏的响应。补充表 4 对比了现有的应变干扰抑制方法与我们的方法，表明所提出的方案更为直接，无需额外的应变重分布/释放微结构或吸应力材料。因此，该策略具有从原型扩展到包含应变干扰的更广泛应用领域的潜力。

## Characterization of the optimized tactile sensing performance

## 优化后的触觉传感性能表征

The assembled composite films shown in Fig. 3A present good deformation adaptiveness when it is rolled up and rounded up, respectively. Figure 3B is the scanning electron microscope (ULTRA55, Zeiss, Oberkochen, Germany) image of the membrane cross-section, displaying the beneficial inhomogeneous microstructure for the high sensitivity to force responses. The image of the transmission electron microscope (TEM) clearly shows the alignment of CNTs in the substrate of natural latex occurs along the direction of strain generation (Fig. 3C).

如图 3A 所示，组装后的复合薄膜在卷曲和圆形状态下均表现出良好的形变适应性。图 3B 为薄膜横截面的扫描电子显微镜(ULTRA55, Zeiss, Oberkochen, Germany)图像，展示了有利于高灵敏度力响应的非均匀微观结构。透射电子显微镜(TEM)图像清晰地显示了天然乳胶基底中碳纳米管沿应变产生方向的排列情况(图 3C)。

To evaluate the strain interference suppression method, a tactile sensing block is attached to the knuckle inside the glove (Fig. 3D). As the finger bends backward and recovers, a pair of relative resistance variations with opposite changing trends but the same amplitudes bring about rise edges when the strain raises (Fig. 3E). It is also simulated by the Multisim software and the results are displayed in Fig. 3F. To construct the calibration module of the strain interference suppression method, the relationship between the output voltage of the tactile array and the applied force is tested under different strains. Figure 3G shows the strain from 0 to 30% sharply deteriorates the output voltages. Especially when the strain exceeds 10%, the voltage deviates significantly from the measured value under no strain, so it urgently requires dynamical calibration under the current strain. Due to the impracticality of enumerating all output voltage curves under various strain interferences, the calibration module fits a curve between the two closest curves, which serves as the updated one to output the calibrated estimated value of the force (Fig. 3H). It is worth mentioning that the hardware circuit with high-precision ADC chips of 12-bit can distinguish a subtle output increase even under large strain interference. The relative error between the estimated forces and the applied forces is depicted in Fig. 3I, where the estimated forces without calibration are generally smaller than the applied forces, and the deviations increase severely with increasing strain. After calibration, the estimated forces establish a strong consistency with the applied forces, proving the effectiveness of the proposed strain interference suppression strategy with an accuracy of 97.6% and an improvement of 45.3% compared with the uncalibrated measurements.

为了评估应变干扰抑制方法，将一个触觉传感块安装在手套内的指关节处(图 3D)。当手指弯曲和恢复时，一对变化趋势相反但幅度相同的相对电阻变化在应变增加时产生了上升沿(图 3E)。通过 Multisim 软件进行的仿真结果如图 3F 所示。为构建应变干扰抑制方法的校准模块，我们在不同应变下测试了触觉阵列输出电压与施加力之间的关系。图 3G 显示，0 到 30% 的应变会严重恶化输出电压。特别是当应变超过 10% 时，电压与无应变下的测量值偏差显著，因此迫切需要在当前应变下进行动态校准。由于枚举各种应变干扰下的所有输出电压曲线不切实际，校准模块在两条最接近的曲线之间进行拟合，作为更新后的曲线，用于输出校准后的力估计值(图 3H)。值得一提的是，采用 12 位高精度 ADC 芯片的硬件电路即使在较大的应变干扰下也能分辨出细微的输出增加。估计力与施加力之间的相对误差如图 3I 所示，其中未校准的估计力通常小于施加力，且偏差随应变的增加而严重增大。校准后，估计力与施加力表现出高度一致性，证明了所提出的应变干扰抑制策略的有效性，其准确率达到 97.6%，较未校准测量提升了 45.3%。

The mechanical responses of the tactile array under a 5% strain are discussed. Figure 3J shows the tactile array has a high sensitivity of ${271.26}{\mathrm{{kPa}}}^{-1}$ within the range of ${100}\mathrm{{kPa}}$ . It can meet the general range of hand grasping pressure below ${20}\mathrm{{kPa}}$ , which is equivalent to a palm carrying a weight of ${20}\mathrm{\;{kg}}$ . As illustrated in the inset image of Fig. 3J, the tactile array displays a significant relative resistive variation even when the pressure is below $1\mathrm{{kPa}}$ . This level of pressure is comparable to lifting a strawberry by the fingertip. The relative resistance variations to continuous but varying pressures are shown in Fig. S12. The response time and recovery time are measured as ${52}\mathrm{\;{ms}}$ and ${80}\mathrm{\;{ms}}$ , respectively (Fig. S13A). The relative resistance variation during the pressure loading and releasing is given in Fig. S13B. Besides, the signal-to-noise ratio of the tactile array is calculated to be 70.64, and the minimum sensing limitation is ${36}\mathrm{\;{Pa}}$ , which means the array can detect subtle changes when manipulating light objects, such as detecting a small weight of ${50}\mathrm{{mg}}$ with a contact surface of ${3.5}\mathrm{\;{mm}} \times  4\mathrm{\;{mm}}$ . Moreover, Fig. 3K demonstrates the repeatability of the tactile array under a load pressure of $5\mathrm{{kPa}}$ over 2000 times, indicating an extended lifespan in practical applications. The negligible drifting after extensive use with human hands was discussed in Fig. S14. Besides, each tactile sensing block was calibrated point by point by the calibration platform shown in Fig. S15. To improve the system-level output response of the tactile glove, the influence of different ${R}_{g}$ on the output voltage was investigated (Fig. S16A). When the ${R}_{g}$ is set to 0.1 times the resistance to be measured, the percentage of resistance decrease $\beta$ shows the maximum tolerance. Similarly, the reference voltage ${V}_{\text{ ref }}$ of ${2.5}\mathrm{\;V}$ can offer the maximum voltage variation range $\bigtriangleup V$ , as shown in Fig. S16B. The final output curve of the tactile glove is given in Fig. 3L and the consistency from different tactile sensing areas has been well demonstrated (Fig. S17). The comparison of the current tactile gloves and our work is given in Supplementary Table 5.

本文讨论了触觉阵列在 5% 应变下的机械响应。图 3J 显示，该触觉阵列在 ${100}\mathrm{{kPa}}$ 范围内具有 ${271.26}{\mathrm{{kPa}}}^{-1}$ 的高灵敏度。它能够满足 ${20}\mathrm{{kPa}}$ 以下的一般手部抓握压力范围，这相当于手掌承载 ${20}\mathrm{\;{kg}}$ 的重量。如图 3J 插图所示，即使压力低于 $1\mathrm{{kPa}}$，触觉阵列也能表现出显著的相对电阻变化。这一压力水平相当于用指尖提起一颗草莓。图 S12 展示了在持续但变化的压力下的相对电阻变化。响应时间和恢复时间分别测得为 ${52}\mathrm{\;{ms}}$ 和 ${80}\mathrm{\;{ms}}$(图 S13A)。压力加载和释放过程中的相对电阻变化见图 S13B。此外，触觉阵列的信噪比经计算为 70.64，最小传感极限为 ${36}\mathrm{\;{Pa}}$，这意味着该阵列在操作轻型物体时能够检测到细微变化，例如检测接触面积为 ${3.5}\mathrm{\;{mm}} \times  4\mathrm{\;{mm}}$ 的 ${50}\mathrm{{mg}}$ 的微小重量。此外，图 3K 展示了触觉阵列在 $5\mathrm{{kPa}}$ 的负载压力下经过 2000 次循环后的重复性，表明其在实际应用中具有较长的使用寿命。图 S14 讨论了在人手长期使用后可忽略不计的漂移。此外，每个触觉传感模块均通过图 S15 所示的校准平台进行了逐点校准。为了改善触觉手套的系统级输出响应，研究了不同 ${R}_{g}$ 对输出电压的影响(图 S16A)。当 ${R}_{g}$ 设置为待测电阻的 0.1 倍时，电阻下降百分比 $\beta$ 显示出最大容差。同样，如图 S16B 所示，${2.5}\mathrm{\;V}$ 的参考电压 ${V}_{\text{ ref }}$ 可提供 $\bigtriangleup V$ 的最大电压变化范围。触觉手套的最终输出曲线见图 3L，且不同触觉传感区域的一致性已得到充分验证(图 S17)。现有触觉手套与本工作的对比见补充表 5。

## Analysis of the interactions between the tactile glove and deformable objects

## 触觉手套与可变形物体交互的分析

To validate the tactile glove, a dynamic dumpling-making task is performed using soft plasticine as a highly deformable object. The task involves kneading the plasticine into a ball, pressing it into a flat shape (acting as the dumpling wrapper), and pinching the wrapper together. Firstly, as the plasticine ball is rolled by the palm, the VR interface displays the distribution and values of the detected forces (Fig. S18 and Supplementary Movie 1). Figure 4A shows the normalized pressure of the blocks on the palm sensing area (called palm blocks) during kneading. Figure S19A shows the Spearman correlation analysis result of the palm blocks, where the correlation coefficients higher than 85% are highlighted (indicating a strong correlation). Figure S20A shows the blocks with strong correlations in this step. Secondly, the palm applies a substantial force to the plasticine ball by pressing (Fig. 4B) and the normalized pressure with strain interference correction is higher than the uncorrected one. Figure S19B and S20B show that more palm blocks contribute to the pressing process; thirdly, the operator folds the wrapper in half and then tightly pinches the edges together with the thumb and index finger (Fig. 4C). The normalized pressure of pinching shows the corrected curve displays an obvious increase in the three sub-stages, which could be caused by the significant strain and the reduction in the uncalibrated compressive force. The result of Spearman correlation analysis between the blocks on the finger sensing areas (called finger blocks) and the palm blocks is given in Fig. S19C, showing that block 1-1 and block 2-1 are highly collaborative with a coefficient of 92.3%, which is consistent with the pinching operation (Fig. S20C). Additionally, correlations between all blocks were analyzed as the operator grabbed a piece of foam board and a toy, and rolled the plasticine (Fig. S21).

为验证触觉手套，我们使用软橡皮泥作为高形变物体执行了一项动态包饺子任务。该任务包括将橡皮泥揉成球状、压扁(作为饺子皮)以及捏合边缘。首先，当手掌揉搓橡皮泥球时，VR界面会显示检测到的力分布及数值(图S18和补充视频1)。图4A展示了揉搓过程中手掌感应区域(称为手掌块)的归一化压力。图S19A显示了手掌块的斯皮尔曼相关性分析结果，其中相关系数高于85%的部分被高亮显示(表明存在强相关性)。图S20A展示了该步骤中具有强相关性的感应块。其次，手掌通过按压对橡皮泥球施加较大的力(图4B)，经应变干扰校正后的归一化压力高于未校正值。图S19B和S20B显示，更多的手掌块参与了按压过程；第三，操作者将饺子皮对折，并用拇指和食指紧紧捏住边缘(图4C)。捏合过程的归一化压力显示，校正后的曲线在三个子阶段有明显增加，这可能是由显著的应变以及未校准压缩力的减少所致。手指感应区域(称为手指块)与手掌块之间的斯皮尔曼相关性分析结果见图S19C，显示块1-1与块2-1具有92.3%的高度协同性，这与捏合操作一致(图S20C)。此外，当操作者抓取泡沫板、玩具以及揉搓橡皮泥时，我们也分析了所有感应块之间的相关性(图S21)。

Moreover, the tactile sensing blocks before and after strain interference calibration were also explored in operations requiring the cooperation of fingers and the palm. For example, a sponge is repeatedly pinched and released (Fig. 4D, Supplementary Movie 2). This operation without correction only involves six active finger blocks and nine active palm blocks with correlation coefficients greater than 85% (Fig. 4E(i)). Calibration revealed two more active finger blocks and five more active palm blocks, as depicted in Fig. 4E(ii). Figure 4F(i) illustrates normalized pressure changes of the active blocks before calibration, and Fig. 4F(ii) reveals blocks with minor pressure changes after strain interference correction. Spearman correlation results without and with calibration are shown in Fig. 4G(i) and Fig. 4G(ii), respectively. Block 3-1, located on the distal phalange of the middle finger, exhibited the strongest correlation coefficients with other blocks. After calibration, additional correlations emerge, indicating the involvement of all finger blocks in sponge grasping-particularly blocks 2-2, block 5-1, block 5-2, and block 5-3. Some blocks, like block 3-1 and block 2-1, exhibit increasing correlation coefficients than 85% after calibration, underscoring heightened synergistic effects between involved blocks. The increased number of strong correlations in Fig. $4\mathrm{H}$ demonstrates how calibration enhances the exploration of dependencies between different fingers and the palm, even if strain interference exists. Furthermore, the tactile glove facilitates shape estimation during manipulation, evident in grasping various objects-both soft (a plastic dropper, a towel, a plastic bottle) and hard (a paintbrush, a spoon, a small needle)-with discernible force responses along the object edges in the VR interface (Fig. S22).

此外，我们还探讨了在需要手指与手掌配合的操作中，应变干扰校正前后的触觉感应块表现。例如，反复捏放海绵(图4D，补充视频2)。在未校正的情况下，该操作仅涉及6个活跃手指块和9个活跃手掌块，其相关系数大于85%(图4E(i))。如图4E(ii)所示，校正后发现了更多活跃的手指块(2个)和手掌块(5个)。图4F(i)展示了校正前活跃块的归一化压力变化，图4F(ii)揭示了应变干扰校正后压力变化较小的感应块。校正前后的斯皮尔曼相关性结果分别如图4G(i)和图4G(ii)所示。位于中指远节指骨的块3-1与其他感应块表现出最强的相关系数。校正后，出现了额外的相关性，表明所有手指块都参与了海绵抓取过程，特别是块2-2、块5-1、块5-2和块5-3。一些感应块(如块3-1和块2-1)在校正后表现出超过85%的相关系数，凸显了参与感应块之间增强的协同效应。图$4\mathrm{H}$中强相关性数量的增加证明了即使存在应变干扰，校正方法也能增强对不同手指与手掌间依赖关系的探索。此外，触觉手套有助于操作过程中的形状估计，这在抓取各种物体(包括软物体如塑料滴管、毛巾、塑料瓶，以及硬物体如画笔、勺子、小针)时表现明显，VR界面中可观察到沿物体边缘的显著力响应(图S22)。

The interference of hand pose is also considered. Figures S23-S25 respectively compare the normalized pressure curves of three typical actions-kneading dough, grasping a sponge, and pinching a paper cup-between empty hand poses and interactions with real objects. The normalized pressure curves during real interactions are 12, 16, and 6 times those of the empty hand poses. These noises with lower amplitudes can be easily filtered out by the proposed visual-tactile jointly learning framework, which possesses denoising capabilities. Under a supervised learning setting, signals related to the supervised task (e.g., contact reconstruction) are enhanced, while unrelated signals are attenuated.

手势干扰也被纳入考虑。图S23-S25分别比较了揉面、抓海绵和捏纸杯这三种典型动作在空手姿态与实际物体交互时的归一化压力曲线。实际交互过程中的归一化压力曲线分别是空手姿态时的12倍、16倍和6倍。这些低幅值的噪声可以很容易地被所提出的视觉-触觉联合学习框架过滤掉，该框架具备去噪能力。在监督学习设置下，与监督任务(如接触重建)相关的信号得到增强，而无关信号则被衰减。

![bo_d7cuo9qlb0pc73dec7d0_6_167_284_1433_1690_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_6_167_284_1433_1690_0.jpg)

Fig. 4 | Evaluation and analysis of the tactile glove with strain interference suppression for hand-deformable objects interaction. A dumpling-making task and the results of tactile response and normalized pressure in three actions: (A) kneading, (B) pressing, and (C) pinching. D Photographs of a grasping task that repeatedly pinches and releases a deformable sponge. E The distributions of the active tactile sensing blocks in the sponge grasping task (i) without and (ii) with strain interference suppression. F The normalized pressure curves of (i) the active blocks without strain interference suppression and (ii) the further revealed blocks after suppression. G The chord images of the Spearman correlation analysis in the sponge grasping task (i) without and (ii) with strain interference suppression. H The number of strong correlations of all finger blocks and palm blocks before and after correction.

图 4 | 具有应变干扰抑制功能的触觉手套在手部与可变形物体交互中的评估与分析。包饺子任务及三种动作下的触觉响应与归一化压力结果:(A) 揉捏，(B) 按压，(C) 捏取。(D) 反复捏取和释放可变形海绵的抓取任务照片。(E) 海绵抓取任务中活跃触觉传感块的分布:(i) 未使用应变干扰抑制，(ii) 使用应变干扰抑制。(F) 归一化压力曲线:(i) 未使用应变干扰抑制的活跃传感块，(ii) 抑制后进一步显现的传感块。(G) 海绵抓取任务中 Spearman 相关性分析的弦图:(i) 未使用应变干扰抑制，(ii) 使用应变干扰抑制。(H) 校正前后所有手指传感块和手掌传感块的强相关性数量。

![bo_d7cuo9qlb0pc73dec7d0_7_168_131_1440_1173_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_7_168_131_1440_1173_0.jpg)

Fig. 5 | The pipeline of the visual-tactile joint learning framework. This model contains hand reconstructors, feature extractors, a temporal feature fusion, and a winding number field (WNF) predictor. The global and local features are extracted from visual and tactile inputs, and based on block positions on the hand. We fuse the features to compute the per-point feature with a temporal cross-attention module, predict WNF for sampled positions, and reconstruct object geometry by the marching cube algorithm.

图 5 | 视觉-触觉联合学习框架流程。该模型包含手部重构器、特征提取器、时序特征融合模块和卷绕数场 (WNF) 预测器。通过视觉和触觉输入，结合手部传感块位置提取全局与局部特征。我们利用时序交叉注意力模块融合特征以计算逐点特征，预测采样位置的 WNF，并通过移动立方体算法重构物体几何形状。

## Visual-tactile learning of human manipulation

## 人类操作的视觉-触觉学习

With the tactile glove, we are interested in uncovering the dynamics of the hand-object state, particularly deformable objects susceptible to strain interference during manipulation. Estimating deformed geometry is inherently challenging due to near-infinite degrees of freedom in the deformable region. The glove can measure the distributed forces that cause the deformation at the contact region, but it only covers a partial object surface, though high-density and distributed. Thus, we also need visual observations to help recover the complete object geometry. Such visual-tactile mechanisms in manipulation are similar to the human cognitive process ${}^{23}$ .

借助触觉手套，我们旨在揭示手-物交互状态的动力学，特别是针对操作过程中易受应变干扰的可变形物体。由于可变形区域具有近乎无限的自由度，估计其变形几何形状具有内在挑战性。手套虽能测量接触区域导致变形的分布力，但其覆盖范围仅为物体表面的一部分，尽管其具有高密度和分布式的特点。因此，我们还需要视觉观测来辅助恢复完整的物体几何形状。这种操作中的视觉-触觉机制类似于人类的认知过程 ${}^{23}$ 。

We introduce the visual-tactile learning framework during manipulation for hand-object reconstruction and tracking, adept at reconstructing complete object geometry even amid highly non-rigid deformation. Figure 5 provides an overview of our model. To assess the learning framework, a visual-tactile dataset is curated, comprising 7680 samples involving 24 objects across 6 categories. Among them, sponges, plasticine, bottles, and cups are deformable objects, while folding racks and scissors represent rigid objects. Each object undergoes 20 touches and 16 camera views. Training data are generated from RFUniverse ${}^{69}$ , a finite element method (FEM)-based simulation environment, while the test set is collected from the real world.

我们引入了操作过程中的视觉-触觉学习框架，用于手-物重构与追踪，该框架即便在高度非刚性变形下也能胜任完整物体几何形状的重构。图 5 展示了我们模型的概览。为评估该学习框架，我们构建了一个视觉-触觉数据集，包含 6 个类别共 24 个物体的 7680 个样本。其中，海绵、橡皮泥、瓶子和杯子为可变形物体，折叠架和剪刀为刚性物体。每个物体均经过 20 次触摸和 16 个摄像机视角的采集。训练数据由基于有限元方法 (FEM) 的仿真环境 RFUniverse ${}^{69}$ 生成，测试集则采集自真实世界。

We present the in-contact object reconstruction for two elastic objects (sponges) and a rigid object (a scissor). The quantitative results are reported in Supplementary Table 6, and the qualitative results are shown in Fig. 6A. In Supplementary Table 6, we can see that the performances of our model on both simulation and real data are remarkable since the calculated chamfer distances are within an acceptable range. We can see in Fig. 6A that the hands and objects are well reconstructed in real data, and with the help of tactile information, we can reconstruct the detailed shape occluded by the hand (Supplementary Movie 3). More importantly, the reconstructed deformable sponges based on the tactile feedback after strain interference suppression could show more negligible details in the region with obvious strain, and the completeness of the rigid object obtains improvements because the method of strain interference suppression helps to recover the real small forces exerted on the rigid edges. In Fig. 6B, we present the gradually deformed plasticine that represents a dumpling-making task of pinching the dumpling wrapper. The deformation of the plasticine in every step has been well demonstrated. In Fig. 6C, the reconstruction of a rigid folding rack is achieved, which employs multiple contacts with the hand on different spots on the object. The details of the folding rack have been completed through multiple contacts with procedural tactile embedding. Moreover, to demonstrate the necessity of visual-tactile joint learning, we present visual-only and visual-and-tactile results for a scissor, a folding rack, and a bottle in Fig. 6D and Supplementary Movie 4. Benefiting from the combining visual and tactile features, both the rigid and deformable objects have been well reconstructed. In Fig. 6E and Supplementary Movie 5, the well-reconstructed sequences prove our method is capable of handling sequential data with multiple frames. Therefore, the improved performance of our visual-tactile model proves that it is crucial to introduce tactile information with strain interference suppression, both for obtaining the feature occluded by the hand and for acquiring the dynamic deformation of the objects on the stretchable interfaces.

我们展示了两种弹性物体(海绵)和一种刚性物体(剪刀)的接触式物体重构结果。定量结果见补充表 6，定性结果见图 6A。在补充表中可见，我们的模型在仿真和真实数据上的表现均十分出色，计算出的倒角距离均在可接受范围内。如图 6A 所示，真实数据中的手部和物体得到了良好的重构，且在触觉信息的辅助下，我们能够重构出被手部遮挡的细节形状(补充视频 3)。更重要的是，基于应变干扰抑制后的触觉反馈，重构出的可变形海绵在应变明显的区域能显示出更细微的细节；而刚性物体的完整性也得到了提升，因为应变干扰抑制方法有助于恢复作用于刚性边缘的真实微小力。在图 6B 中，我们展示了代表捏饺子皮任务的橡皮泥逐渐变形的过程，橡皮泥在每一步的变形都得到了很好的演示。在图 6C 中，实现了对刚性折叠架的重构，该过程利用了手部在物体不同点上的多次接触。通过程序化触觉嵌入的多次接触，折叠架的细节得以补全。此外，为证明视觉-触觉联合学习的必要性，我们在图 6D 和补充视频 4 中展示了剪刀、折叠架和瓶子的仅视觉与视觉-触觉结合的重构结果。得益于视觉与触觉特征的结合，刚性和可变形物体均得到了良好的重构。在图 6E 和补充视频 5 中，重构序列证明了我们的方法能够处理包含多帧的时序数据。因此，视觉-触觉模型性能的提升证明了引入带有应变干扰抑制的触觉信息至关重要，这不仅有助于获取被手部遮挡的特征，也有助于获取可变形界面上物体的动态变形。

![bo_d7cuo9qlb0pc73dec7d0_8_151_129_1463_1626_0.jpg](images/bo_d7cuo9qlb0pc73dec7d0_8_151_129_1463_1626_0.jpg)

Fig. 6 | Hand-object reconstructions based on the ViTaM system. A The in-contact object reconstructions for two elastic sponges and a rigid scissor without and with strain interference suppression. B Three reconstruction stages of a gradually deformed dumpling-shaped plasticine manipulated by the hand without and with strain interference suppression. C A rigid folding rack reconstruction with multiple contacts by the hand on different spots on the object. D Visual-only and visual-tactile reconstruction results for a scissor, a rack, and a bottle, demonstrate the superiority of the visual-tactile joint learning. E Reconstruction sequence results of a deformable cup and a deformable sponge based on the visual-tactile data collected in the real world.

图 6 | 基于 ViTaM 系统的手-物体重建。A:在有无应变干扰抑制的情况下，对两个弹性海绵和一个刚性剪刀的接触物体重建结果。B:手部在有无应变干扰抑制的情况下，对逐渐变形的饺子状橡皮泥进行操作的三个重建阶段。C:手部在物体不同位置进行多次接触的刚性折叠架重建。D:仅视觉与视觉-触觉重建结果对比(针对剪刀、架子和瓶子)，证明了视觉-触觉联合学习的优越性。E:基于现实世界中采集的视觉-触觉数据，对可变形杯子和海绵的重建序列结果。

To validate the effectiveness of our proposed ViTaM system, qualitative and quantitative comparative tests have been conducted to answer the following questions: (1) whether the tactile array-specific data format is effective in conveying the geometry information to the learning algorithm? (2) whether it is more effective compared to other forms of sensors, such as RGB-D cameras, or optical tactile sensors? In experiments, first, we compared the performance of existing vision-only solutions with the algorithm of the ViTaM system excluding the tactile encoder ${}^{{70},{71}}$ ; second, the algorithm is compared with a previous work, VTacO7, which employs a gel-based optical tactile sensor, DIGIT, to record contact deformation. The comparison of chamfer distance is shown in Supplementary Table 7. Due to the poor wearability and flexibility of the VTacO system, it was only used for two simple actions: touching and grasping objects (Fig. S26). The results are shown in Fig. S27, Supplementary Table 8, and Supplementary Table 9. It can be found that the ViTaM system demonstrates superior performance over purely visual methods in reconstructing four types of objects: elastic, plastic, articulated, and rigid. For example, the chamfer distance of reconstructing a sponge using the ViTaM system is only 0.467 cm, which is an improvement of 36% compared to that of VTacO. While gel-based optical sensors can obtain higher-resolution local geometry information, such as sharp edges or severe deformation, our distributed design of the tactile glove can obtain more comprehensive features when the occlusion is too severe for the vision information.

为验证所提 ViTaM 系统的有效性，我们进行了定性和定量对比测试，以回答以下问题:(1) 触觉阵列特定的数据格式在向学习算法传递几何信息方面是否有效？(2) 与 RGB-D 相机或光学触觉传感器等其他形式的传感器相比，它是否更有效？在实验中，首先，我们将现有纯视觉解决方案的性能与剔除触觉编码器 ${}^{{70},{71}}$ 的 ViTaM 系统算法进行了比较；其次，将该算法与先前工作 VTacO7 进行了对比，后者采用基于凝胶的光学触觉传感器 DIGIT 来记录接触变形。倒角距离的比较见补充表 7。由于 VTacO 系统穿戴性和灵活性较差，它仅被用于两种简单动作:触摸和抓取物体(图 S26)。结果如图 S27、补充表 8 和补充表 9 所示。可以看出，ViTaM 系统在重建弹性、塑性、关节连接和刚性这四类物体时，表现出优于纯视觉方法的性能。例如，使用 ViTaM 系统重建海绵的倒角距离仅为 0.467 厘米，较 VTacO 提升了 36%。虽然基于凝胶的光学传感器可以获得更高分辨率的局部几何信息(如锐利边缘或严重变形)，但我们的分布式触觉手套设计在视觉信息遮挡严重时，能够获取更全面的特征。

To validate the design of the algorithm, we ablate the temporal transformer module in the temporal feature fusion part. For testing the performance without it, we only use a self-attention module to encode the fused feature and use the same WNF Predictor to decode the winding number values. The results are shown in Supplementary Table 10. They indicate that the introduction of the temporal transformer module significantly enhances performance, likely due to the consistency of inter-frame features within a video sequence and the force differences between frames, which provide information about object deformation or changes in joint states. In summary, the tactile glove with good wearability and the accompanying algorithm exhibits significant improvements over existing vision-based tactile sensors, ensuring superior operational flexibility in hand-object interaction tasks and demonstrating obvious advantages in reconstruction results. Besides, we report the performance over the video sequence to validate the temporal consistency. The results are given in Supplementary Table 11. The "Per-frame" row reports the mean per-frame error for the entire category. While the "full-video" row reports the chamfer distance calculated by first average on a full video, then on a whole category. Due to the difference in frame numbers between different manipulation processes, these two metrics have different scores. The variance in the full-video metric is also reported. Additionally, we tested the model's average inference runtime on one Nvidia RTX 4090 GPU, which is around 3-5 frames per second.

为验证算法设计，我们对时间特征融合部分的时间 Transformer 模块进行了消融实验。在测试无该模块的性能时，我们仅使用自注意力模块对融合特征进行编码，并使用相同的 WNF 预测器解码卷绕数(winding number)值。结果见补充表 10。这些结果表明，引入时间 Transformer 模块显著增强了性能，这可能是因为视频序列内帧间特征的一致性以及帧间的力差异提供了关于物体变形或关节状态变化的信息。总之，具有良好穿戴性的触觉手套及其配套算法较现有视觉触觉传感器表现出显著改进，确保了手-物体交互任务中卓越的操作灵活性，并在重建结果中展现出明显优势。此外，我们报告了视频序列上的性能以验证时间一致性。结果见补充表 11。“单帧(Per-frame)”行报告了整个类别的平均单帧误差，而“全视频(full-video)”行报告了先对完整视频取平均、再对整个类别取平均计算出的倒角距离。由于不同操作过程的帧数不同，这两个指标得分不同。文中还报告了全视频指标的方差。此外，我们在单块 Nvidia RTX 4090 GPU 上测试了模型的平均推理运行时间，约为每秒 3-5 帧。

The extensive experiments have proved the efficacy of the proposed algorithm on the compatibility to the glove, the superiority over the baseline methods, and the consistency of dynamic reconstruction.

大量实验证明了所提算法在与手套的兼容性、优于基准方法以及动态重建一致性方面的有效性。

## Discussion

## 讨论

Recording the tactile data between the hand and deformable objects and further estimating the hand-object states is challenging in general manipulation scenarios. The absence of an accurate, distributed, and stretchable tactile array impedes the fusion of visual-tactile learning and constrains the understanding of general human manipulation. Especially, the strain interference on the stretchable interface deteriorates the accuracy of force measurement and the application effectiveness.

在一般操作场景中，记录手与可变形物体之间的触觉数据并进一步估计手-物体状态具有挑战性。缺乏精确、分布式且可拉伸的触觉阵列阻碍了视觉-触觉学习的融合，并限制了对一般人类操作的理解。特别是可拉伸界面上的应变干扰，降低了力测量的准确性和应用效果。

Our work proposed a visual-tactile recording and tracking system for manipulation, in which the tactile inputs are captured by a high-density stretchable tactile glove with 1152 sensing channels and a frame rate of ${13}\mathrm{\;{Hz}}$ . This tactile glove has integrated with an active method of strain interference suppression with an accuracy of 97.6% in force measurement. Compared with the uncalibrated measurements, the accuracy of the proposed sensor has improved by 45.3%. This active method works at the material-circuit level, which is more in accord with the adaptive tactile perception of humans when touch rigid or deformable objects. Compared with traditional strain interference suppression strategies from the perspectives of structure design and material selection, our active method is simple to integrate, cost-effective, and has large-area wearability, great durability, and wide suppression range of strain. The ViTaM system has realized the fusion of cross-modal data features, revealed the occluded states during hand-object interaction, and enabled the tracking and geometric 3D reconstruction of deformable objects, which brings the interactive understanding capability of intelligent agents in HMI one step closer to the level of human tactile perception.

本研究提出了一种用于操作任务的视觉-触觉记录与追踪系统，其中触觉输入由一款具有1152个传感通道、帧率为 ${13}\mathrm{\;{Hz}}$ 的高密度可拉伸触觉手套采集。该触觉手套集成了一种主动式应变干扰抑制方法，力测量精度达到97.6%。与未校准的测量结果相比，所提传感器的精度提升了45.3%。这种主动式方法在材料-电路层面工作，更符合人类在触摸刚性或可变形物体时的自适应触觉感知。与传统从结构设计和材料选择角度出发的应变干扰抑制策略相比，我们的主动式方法易于集成、成本效益高，且具备大面积穿戴性、高耐用性以及宽应变抑制范围。ViTaM系统实现了跨模态数据特征的融合，揭示了手-物交互过程中的遮挡状态，并实现了可变形物体的追踪与几何三维重建，使智能体在人机交互(HMI)中的交互理解能力向人类触觉感知水平迈进了一步。

In future work, the ViTaM system will be integrated into body-covered and mass-produced electronic skin on any surface of robots to seamlessly interact with its surroundings, and discern and respond to diverse environmental stimuli. Moreover, capturing and recovering the dynamic state of human manipulation will facilitate a better understanding of human behaviors and enhance the capacity of robot dexterous manipulation from object-type specific manipulation to general scenarios.

在未来的工作中，ViTaM系统将被集成到覆盖全身且可大规模生产的电子皮肤中，应用于机器人的任何表面，以实现与周围环境的无缝交互，并识别和响应多样的环境刺激。此外，捕捉和恢复人类操作的动态状态将有助于更好地理解人类行为，并增强机器人灵巧操作的能力，使其从特定对象的操作扩展到通用场景。

## Methods

## 方法

## Preparation of the tactile sensing block

## 触觉传感模块的制备

Similar to our previous research ${}^{65}$ , the multi-walled CNT aqueous dispersion (XFZ29, Nanjing XFNANO Materials Tech Co. Ltd., China; length of the CNTs $\leq  {10\mu }\mathrm{m}$ ) and the natural latex solution (001a, Maoming Zhengmao Petrochemical Co. Ltd., China; ammonia content: 0.2%) are pre-dispersed by ultrasound for 15 min in ice bath. They are respectively mixed in the ratio of 1 to 1 (equal to 5 wt% CNT content) and 1 to 2.5 (equal to 2.9 wt% CNT content) to fabricate the negative and positive effect membrane. The mixtures with 5 wt% and 2.9 wt% CNT content are magnetically stirred for $6\mathrm{\;h}$ and $9\mathrm{\;h}$ in the ice bath, respectively. Then, the above mixtures are all molded by drop-casting and cured for ${15}\mathrm{\;h}$ , followed by being cut into rectangular shapes with a size of ${10}\mathrm{\;{mm}} \times  {20}\mathrm{\;{mm}} \times  {0.4}\mathrm{\;{mm}}$ . After releasing from the molds, sew the conductive fabric wires that serve as electrodes at both ends of each membrane to monitor the strain variation. The resistivity of the conductive fabric wire is $1 - {2\Omega } \cdot  \mathrm{{cm}}$ . The negative and positive effect membranes are assembled with non-conductive adhesive. These two pairs of electrodes are respectively connected to the strain interference detection circuit.

参考我们之前的研究 ${}^{65}$ ，将多壁碳纳米管(CNT)水性分散液(XFZ29，南京先丰纳米材料科技有限公司，中国；CNT长度 $\leq  {10\mu }\mathrm{m}$ )与天然乳胶溶液(001a，茂名正茂石化有限公司，中国；氨含量:0.2%)在冰浴中超声预分散15分钟。将它们分别按1:1(相当于5 wt%的CNT含量)和1:2.5(相当于2.9 wt%的CNT含量)的比例混合，以制备负效应膜和正效应膜。将CNT含量为5 wt%和2.9 wt%的混合物分别在冰浴中磁力搅拌 $6\mathrm{\;h}$ 和 $9\mathrm{\;h}$ 。随后，将上述混合物全部通过滴铸成型并固化 ${15}\mathrm{\;h}$ ，然后切割成 ${10}\mathrm{\;{mm}} \times  {20}\mathrm{\;{mm}} \times  {0.4}\mathrm{\;{mm}}$ 大小的矩形。从模具中取出后，在每层膜的两端缝合作为电极的导电织物线，以监测应变变化。导电织物线的电阻率为 $1 - {2\Omega } \cdot  \mathrm{{cm}}$ 。将负效应膜和正效应膜用非导电胶粘合在一起。这两对电极分别连接到应变干扰检测电路。

## Fabrication of the tactile glove

## 触觉手套的制作

For every piece of the block shown in Fig. S8A, four-row electrodes, and three-column electrodes are vertically sewn onto the block, sequentially. The spaces between row and column electrodes are set to ${2.5}\mathrm{\;{mm}}$ and $3\mathrm{\;{mm}}$ , respectively. The wire end of each electrode is fixed by UV curing adhesive to prevent shedding. For the index, middle, ring, and little fingers, there is a tactile sensing block on each of the three knuckles of each finger, whereas there are two tactile sensing blocks on the two knuckles of the thumb. So, the number of tactile sensing blocks on the fingers is fourteen. Tactile sensing blocks on the same finger share column electrodes. The tactile sensing blocks on the palm are arranged in a $4 \times  6$ array. All the tactile sensing blocks share the row electrodes. To stably encapsulate the conductive fabric wires and the pads on the FPC, the conductive fabric wire is first fixed on the pad by tying a knot, then fixed with low-temperature fast-drying conductive silver paste, and then finally encapsulated with UV curing adhesive.

对于图S8A中所示的每一块模块，依次垂直缝合四行电极和三列电极。行电极和列电极之间的间距分别设置为 ${2.5}\mathrm{\;{mm}}$ 和 $3\mathrm{\;{mm}}$ 。每根电极的线端均用紫外(UV)固化胶固定，以防脱落。对于食指、中指、无名指和小指，每个手指的三个指节上各有一个触觉传感模块，而拇指的两个指节上则有两个触觉传感模块。因此，手指上的触觉传感模块总数为十四个。同一手指上的触觉传感模块共享列电极。手掌上的触觉传感模块排列成 $4 \times  6$ 阵列。所有触觉传感模块共享行电极。为了稳定封装导电织物线和柔性印刷电路(FPC)上的焊盘，首先通过打结将导电织物线固定在焊盘上，然后用低温快干导电银浆固定，最后用UV固化胶进行封装。

Secondly, there are three types of FPCs: finger FPCs and a palm FPC connecting the finger blocks and palm blocks with the multichannel scanning circuit; the general FPCs connecting the scanning circuit and the processing circuit. The first two kinds of FPCs that sewed on the fabric glove by fixing holes have electrical pads with exposed deposited gold on them. The FPCs are fabricated by typical processes including copper electroplating on the polyimide (PI) layer, dry film lamination, exposure, developing, etching, dry film stripping, cover PI layer lamination, laser cutting, and assembling.

其次，柔性印刷电路(FPC)分为三种类型:连接手指模块与手掌模块及多通道扫描电路的手指FPC和手掌FPC；以及连接扫描电路与处理电路的通用FPC。前两种通过固定孔缝合在织物手套上的FPC，其电气焊盘上沉积有裸露的金。FPC的制造采用典型工艺，包括在聚酰亚胺(PI)层上进行电镀铜、干膜层压、曝光、显影、蚀刻、干膜剥离、覆盖PI层层压、激光切割及组装。

Third, the tactile glove is integrated with a modular assembly process. The tactile sensing blocks are fixed on the fabric glove by a handmade sewing process. The miniaturized multi-channel scanning circuit is fixed on the back of the glove hand. The processing circuit is fixed in the middle of the bracelet.

第三，触觉手套采用模块化组装工艺进行集成。触觉传感模块通过手工缝合工艺固定在织物手套上。微型多通道扫描电路固定在手套手背处。处理电路则固定在腕带中部。

## Hardware implementation and simulation of the scanning circuit

## 扫描电路的硬件实现与仿真

Based on the multiplexing technology of electrodes, this scanning circuit can realize row-by-row and column-by-column scanning of 24- row electrodes by 48-column electrodes for a total of 1152 tactile sensing units. There are 6 sample modules in this current-mode scanning circuit, in which every sample module has one 8-channel ADC chip (AD7928, Analog Devices Inc., USA) and two 4-channel amplifier chips (ADA4691-4, Analog Devices Inc., USA). Every column electrode is connected to an amplifier. By matching the resistor ${R}_{\mathrm{g}}$ with the tactile sensing unit, gain-adjustable amplification of tactile signals can be achieved. To perform a cyclic scanning read of the row electrodes, two 4-to-16-line decoders are used. For 24 rows of electrodes, only one electrode is grounded at a time, while the other unselected electrodes remain connected to the reference voltage. The voltage at the positive input of the amplifier also needs to be set to the reference voltage, which is as same as the voltage at the unselected row electrodes, so no leakage current flows at the unselected row electrodes. The multichannel scanning circuit also includes two sets of independent power supplies to ensure that the multi-channel scanning sampling design has sufficient driving capacity. In addition, the processing circuit not only connects the column electrodes of the tactile sensing blocks on the palm range with the multi-channel scanning circuit but also includes a microcontroller unit (MCU) (ESP32, Espressif Systems (Shanghai) Co., Ltd., China) and communication modules for data processing and transmission.

基于电极复用技术，该扫描电路可实现24行电极与48列电极的逐行逐列扫描，共计1152个触觉传感单元。该电流模式扫描电路包含6个采样模块，每个采样模块配有一枚8通道ADC芯片(AD7928，Analog Devices Inc.，美国)和两枚4通道放大器芯片(ADA4691-4，Analog Devices Inc.，美国)。每一列电极均连接至一个放大器。通过将电阻 ${R}_{\mathrm{g}}$ 与触觉传感单元匹配，可实现触觉信号的增益可调放大。为执行行电极的循环扫描读取，使用了两个4-16线译码器。对于24行电极，每次仅有一个电极接地，其余未选中的电极保持连接至参考电压。放大器正向输入端的电压也需设置为参考电压，该电压与未选中行电极的电压相同，从而确保未选中的行电极处无漏电流流过。多通道扫描电路还包含两组独立电源，以确保多通道扫描采样设计具备充足的驱动能力。此外，处理电路不仅将手掌区域触觉传感模块的列电极与多通道扫描电路相连，还集成了微控制器单元(MCU)(ESP32，乐鑫科技，中国)及用于数据处理与传输的通信模块。

## Electrical and mechanical characterization

## 电学与力学表征

The tactile sensing block is sequentially stretched to different strains from 5% to 30% and fixed on the Teflon substrate. The tensile tester (AGS-X 50N, SHIMADZU) equipped with a customized probe is used to apply normal force. Meanwhile, the resistance changes of the tactile sensing unit are measured by an LCR meter (4100, Wayne Kerr). To validate the robustness of the tactile sensing block, a dynamic thermomechanical analysis machine (Q850, TA Instruments) is employed for the repeatability test. The output voltage of the tactile sensing block is collected by the proposed circuit.

将触觉传感模块依次拉伸至5%至30%的不同应变，并固定在聚四氟乙烯(Teflon)基底上。使用配备定制探头的拉力试验机(AGS-X 50N，岛津)施加法向力。同时，利用LCR测试仪(4100，Wayne Kerr)测量触觉传感单元的电阻变化。为验证触觉传感模块的稳健性，采用动态热机械分析仪(Q850，TA Instruments)进行重复性测试。触觉传感模块的输出电压由所设计的电路采集。

## The static calibration of the tactile sensing blocks

## 触觉传感模块的静态标定

The tactile sensing blocks of the tactile glove are placed on the test platform made by PDMS elastomer (Sylgard-184, Dow Corning), which has a similar elastic modulus to human skin. All of the tactile sensing blocks have been calibrated with a force interval of ${0.05}\mathrm{\;N}$ by the tensile tester (AGS-X 50 N, SHIMADZU) from 0 N to 40 N. The voltage changes of the tactile sensing unit are directly read out from the computer synchronously. The relationship between voltage change and loading force is determined through a mathematical fitting model (Supplementary Note 1). Testing of all modules is performed 4 times and averaged to minimize test errors. Mechanical exception values of some tactile sensing units are multiplied by a calibration factor to obtain a relatively smooth calibration curve.

将触觉手套的触觉传感模块放置在由PDMS弹性体(Sylgard-184，道康宁)制成的测试平台上，该材料的弹性模量与人体皮肤相似。所有触觉传感模块均通过拉力试验机(AGS-X 50 N，岛津)在0 N至40 N范围内以 ${0.05}\mathrm{\;N}$ 的力间隔进行了标定。触觉传感单元的电压变化同步直接从计算机读取。电压变化与加载力之间的关系通过数学拟合模型确定(补充说明1)。所有模块的测试均进行4次并取平均值，以最大限度减少测试误差。对部分触觉传感单元的机械异常值乘以校准系数，以获得相对平滑的标定曲线。

## System integration of the hardware and VR environment

## 硬件与VR系统的集成

The high-density tactile glove generates a frame of ${24} \times  {48}$ tactile data, which is sent to a personal computer (PC) via a standard serial port. The other end of the serial port is connected to a PC running the real-time visualization program. The visualization program is comprised of two components: an interactive RFUniverse-based interface, and a parser that decrypts serial port data. The parser continuously monitors the incoming data from the serial port; upon detecting a header, it interprets the subsequent data as a frame and verifies it against the checksum. Although inconsistencies between data frames and their checksums are rare, the parser discards any non-compliant data frames automatically, which ensures data integrity. Frames with correct checksums are converted back into a two-dimensional matrix by the parser. During the restoration process, a pre-calibrated voltage-to-pressure mapping is applied, translating voltage readings back into pressure measurements. This two-dimensional matrix is later transmitted to the RFUniverse interface with RFUniverse's communication protocol. Through this interactive interface, users can interact with a user-friendly GUI to observe the status of the glove intuitively. Following these procedures, the pressure values of the glove are consistently gathered and demonstrated animatedly and in real-time. If necessary, the parser simultaneously copies the data stream to local storage for further in-depth utilization.

高密度触觉手套生成一帧 ${24} \times  {48}$ 触觉数据，并通过标准串口发送至个人电脑(PC)。串口的另一端连接着运行实时可视化程序的 PC。该可视化程序包含两个组件:基于 RFUniverse 的交互式界面，以及用于解密串口数据的解析器。解析器持续监测来自串口的输入数据；一旦检测到帧头，便将后续数据解释为一帧并进行校验和验证。尽管数据帧与校验和不一致的情况很少见，但解析器会自动丢弃任何不符合规范的数据帧，以确保数据完整性。校验和正确的帧由解析器转换回二维矩阵。在还原过程中，应用预先校准的电压-压力映射，将电压读数转换为压力测量值。该二维矩阵随后通过 RFUniverse 的通信协议传输至 RFUniverse 界面。通过此交互式界面，用户可以使用友好的图形用户界面(GUI)直观地观察手套的状态。遵循这些步骤，手套的压力值被持续采集，并以动画形式实时呈现。如有必要，解析器会同时将数据流复制到本地存储，以供后续深入使用。

## Data collection in simulation and real-world

## 仿真与现实世界中的数据采集

In simulation, we generate a random pose with a human hand model to interact with an object. Both hand and object are modeled by FEM. The contact is modeled by incremental potential contact (IPC) ${}^{71}$ to guarantee mesh intersection-free and inversion-free during dynamics simulation. The simulation environment to generate training data is supported by RFUniverse. We run RFUniverse on a PC with an Intel i9 13900K CPU, NVIDIA GTX 4090 Graphics card, and 64 GB memory. The runtime for generating a data sample is 0.5 fps.

在仿真中，我们生成一个随机姿态的人手模型来与物体交互。手和物体均由有限元方法(FEM)建模。接触过程通过增量势能接触(IPC)${}^{71}$ 建模，以确保在动力学仿真过程中网格不发生相交或反转。用于生成训练数据的仿真环境由 RFUniverse 提供支持。我们在配备 Intel i9 13900K CPU、NVIDIA GTX 4090 显卡和 64 GB 内存的 PC 上运行 RFUniverse。生成一个数据样本的运行速度为 0.5 fps。

In the real world, we collect five objects of the same category but unseen instances from the training set. The operator wears the tactile glove and sits in front of a table. A top-down RGB-D camera is set to record the manipulation process. For objects with elasticity and rigidity, we apply grasping and pinching manipulation. After the manipulation is done, we present the in-contact object to the camera. For objects with plasticity, such as the plasticine, we apply multi-step manipulation. After each manipulation, we move the hand away from the object so that the object can be directly presented to the camera. When labeling the data, we manually remove the non-object point cloud from the RGB-D camera. The RGB-D camera to record the test data in the real world is the Photoneo MotionCam M+ model. It is placed ${1.55}\mathrm{\;m}$ high up and straight down to the table and records the data at 10 fps with an ${800} \times  {1120}$ RGB stream and ${800} \times  {1120}$ depth stream.

在现实世界中，我们采集了与训练集类别相同但未见过的五个物体实例。操作员佩戴触觉手套坐在桌前。设置一台自上而下的 RGB-D 相机来记录操作过程。对于具有弹性和刚性的物体，我们采用抓取和捏取操作。操作完成后，我们将接触物体呈现给相机。对于橡皮泥等具有塑性的物体，我们采用多步操作。每次操作后，我们将手移开，以便将物体直接呈现给相机。在标注数据时，我们手动移除了 RGB-D 相机拍摄的点云中的非物体部分。用于记录现实世界测试数据的 RGB-D 相机为 Photoneo MotionCam M+ 型号。它被放置在 ${1.55}\mathrm{\;m}$ 高处，垂直向下对准桌面，并以 10 fps 的帧率记录 ${800} \times  {1120}$ RGB 流和 ${800} \times  {1120}$ 深度流数据。

## Reconstruction and tracking of highly non-rigid objects

## 高度非刚性物体的重建与跟踪

The visual-tactile learning model is adapted from our previous work VTacO ${}^{71}$ . VTacO processes the regular-format tactile image as the tactile representation, while here we process the tactile reading as an 1152- d vector. Thus, we replace the tactile encoder in VTacO with a 3-layer MLP and a self-attention module and divide the tactile reading into 38 blocks to compute the tactile feature. The contact positions are inferred by the positions of every sensor block on the glove, and block positions are predicted through hand shape estimation. In addition, we recast the visual-tactile reconstruction framework into a tracking pipeline, so that it can take multiple frames of visual-tactile images as input and give reconstruction for each frame with spatial-temporal consistency. The detailed structure and implementation details are described and illustrated in Supplementary Note 2-4.

视觉-触觉学习模型改编自我们之前的工作 VTacO ${}^{71}$。VTacO 将常规格式的触觉图像作为触觉表征，而此处我们将触觉读数处理为 1152 维向量。因此，我们将 VTacO 中的触觉编码器替换为 3 层 MLP 和自注意力模块，并将触觉读数划分为 38 个块来计算触觉特征。接触位置通过手套上每个传感器块的位置推断得出，而块位置则通过手部形状估计进行预测。此外，我们将视觉-触觉重建框架重构为跟踪流水线，使其能够接收多帧视觉-触觉图像作为输入，并为每一帧提供具有时空一致性的重建结果。详细的结构和实现细节在补充说明 2-4 中进行了描述和说明。

## Data availability

## 数据可用性

All data needed to evaluate the conclusions in the paper are present in the paper and the Supplementary Information. The computational data is available from GitHub at https://github.com/jeffsonyu/ViTaM/ tree/main/Data. DOI identifier: 10.5281/zenodo.13860422. year: 2024. Source data are provided with this paper.

评估本文结论所需的所有数据均包含在论文及补充信息中。计算数据可从 GitHub 获取:https://github.com/jeffsonyu/ViTaM/tree/main/Data。DOI 标识符:10.5281/zenodo.13860422。年份:2024。本文提供原始数据。

## Code availability

## 代码可用性

The codes that support the visual-tactile learning within this paper and other findings of this research are available from GitHub at https:// github.com/jeffsonyu/ViTaM. DOI identifier: 10.5281/zenodo.13860422. year: 2024.

支持本文视觉-触觉学习研究及其他发现的代码可从 GitHub 获取:https://github.com/jeffsonyu/ViTaM。DOI 标识符:10.5281/zenodo.13860422。年份:2024。

## References

## 参考文献

1. Clabaugh, C. & Matarić, M. Robots for the people, by the people:personalizing human-machine interaction. Sci. Robot. 3, eaat7451

个性化人机交互。《科学·机器人》第 3 卷，eaat7451(2018).

2. Pan, T.-Y., Chang, C.-Y., Tsai, W.-L. & Hu, M.-C. Multisensor-based3D gesture recognition for a decision-making training system. IEEE Sens. J. 21, 706-716 (2021).

用于决策训练系统的 3D 手势识别。《IEEE 传感器期刊》第 21 卷，706-716 (2021)。

3. Moin, A. et al. A wearable biosensing system with in-sensor adaptivemachine learning for hand gesture recognition. Nat. Electron. 4, 54-63 (2021).

用于手势识别的机器学习。《自然-电子学》4, 54-63 (2021)。

4. Lee, H. et al. Stretchable array electromyography sensor with graphneural network for static and dynamic gestures recognition system. npj Flex. Electron. 7, 1-13 (2023).

用于静态和动态手势识别系统的神经网络。《npj-柔性电子》7, 1-13 (2023)。

5. Zhou, Z. et al. Sign-to-speech translation using machine-learning-assisted stretchable sensor arrays. Nat. Electron. 3, 571-578 (2020).

辅助式可拉伸传感器阵列。《自然-电子学》3, 571-578 (2020)。

6. Tashakori, A. et al. Capturing complex hand movements and objectinteractions using machine learning-powered stretchable smart textile gloves. Nat. Mach. Intell. 6, 106-118 (2024).

使用机器学习驱动的可拉伸智能纺织手套进行交互。《自然-机器智能》6, 106-118 (2024)。

7. Wang, M. et al. Gesture recognition using a bioinspired learningarchitecture that integrates visual data with somatosensory data from stretchable sensors. Nat. Electron. 3, 563-570 (2020).

将视觉数据与来自可拉伸传感器的体感数据相集成的架构。《自然-电子学》3, 563-570 (2020)。

8. Wen, F., Zhang, Z., He, T. & Lee, C. Al enabled sign languagerecognition and VR space bidirectional communication using triboelectric smart glove. Nat. Commun. 12, 5378 (2021).

使用摩擦电智能手套进行识别和虚拟现实空间双向通信。《自然-通讯》12, 5378 (2021)。

9. Cui, J. & Trinkle, J. Toward next-generation learned robot manip-ulation. Sci. Robot. 6, eabd9461 (2021).

仿真。《科学-机器人》6, eabd9461 (2021)。

10. Billard, A. & Kragic, D. Trends and challenges in robot manipulation.Science 364, eaat8414 (2019).

《科学》364, eaat8414 (2019)。

11. Sun, Z., Zhu, M., Shan, X. & Lee, C. Augmented tactile-perceptionand haptic-feedback rings as human-machine interfaces aiming for immersive interactions. Nat. Commun. 13, 5224 (2022).

以及旨在实现沉浸式交互的人机界面触觉反馈环。《自然-通讯》13, 5224 (2022)。

12. Zhu, M. et al. Haptic-feedback smart glove as a creative human-machine interface (HMI) for virtual/augmented reality applications. Sci. Adv. 6, eaaz8693 (2020).

用于虚拟/增强现实应用的人机界面 (HMI)。《科学-进展》6, eaaz8693 (2020)。

13. Heng, W., Solomon, S. & Gao, W. Flexible electronics and devices ashuman-machine interfaces for medical robotics. Adv. Mater. 34, 2107902 (2022).

用于医疗机器人的人机界面。《先进材料》34, 2107902 (2022)。

14. Sundaram, S. How to improve robotic touch. Science 370, 768-769 (2020).

15. Yu, Y. et al. All-printed soft human-machine interface for roboticphysicochemical sensing. Sci. Robot. 7, eabn0495 (2022).

物理化学传感。《科学-机器人》7, eabn0495 (2022)。

16. Sundaram, S. et al. Learning the signatures of the human graspusing a scalable tactile glove. Nature 569, 698-702 (2019).

使用可扩展触觉手套。《自然》569, 698-702 (2019)。

17. Liu, Y. et al. Enhancing generalizable 6D pose tracking of an in-handobject with tactile sensing. IEEE Robot. Autom. Lett. 9, 1106-1113

具有触觉感知的物体。《IEEE机器人与自动化快报》9, 1106-1113(2024).

18. Liang, J. et al. In-hand object pose tracking via contact feedbackand GPU-accelerated robotic simulation. In: Proc. IEEE International Conference on Robotics and Automation (ICRA) 6203-6209 (IEEE,

以及GPU加速的机器人仿真。收录于:IEEE机器人与自动化国际会议 (ICRA) 论文集 6203-6209 (IEEE,Paris, France, 2020).

19. Chiu, Z.-Y., Richter, F. & Yip, M. C. Real-time constrained 6D object-pose tracking of an in-hand suture needle for minimally invasive robotic surgery. In: Proc. IEEE International Conference on Robotics and Automation (ICRA) 4761-4767 (IEEE, London, United Kingdom, 2023).

微创机器人手术中手内缝合针的姿态跟踪。收录于:IEEE机器人与自动化国际会议 (ICRA) 论文集 4761-4767 (IEEE, 英国伦敦, 2023)。

20. Jacobson, A., Kavan, L. & Sorkine-Hornung, O. Robust inside-outside segmentation using generalized winding numbers. ACM Trans. Graph. 32, 1-12 (2013).

使用广义卷绕数进行外部分割。《ACM图形学汇刊》32, 1-12 (2013)。

21. Boutry, C. M. et al. A hierarchically patterned, bioinspired e-skinable to detect the direction of applied pressure for robotics. Sci. Robot. 3, eaau6914 (2018).

能够检测机器人所受压力的方向。《科学·机器人学》3, eaau6914 (2018)。

22. Fazeli, N. et al. See, feel, act: hierarchical learning for complexmanipulation skills with multisensory fusion. Sci. Robot. 4, eaav3123

具有多传感器融合的操纵技能。《科学·机器人学》4, eaav3123(2019).

23. Merabet, L. et al. Feeling by sight or seeing by touch? Neuron 42,173-179 (2004).

24. Pyo, S., Lee, J., Bae, K., Sim, S. & Kim, J. Recent progress in flexibletactile sensors for human-interactive systems: from sensors to advanced applications. Adv. Mater. 33, 2005902 (2021).

用于人机交互系统的触觉传感器:从传感器到高级应用。《先进材料》33, 2005902 (2021)。

25. Ozioko, O. & Dahiya, R. Smart tactile gloves for haptic interaction,communication, and rehabilitation. Adv. Intell. Syst. 4, 2100091 (2022).

通信与康复。《先进智能系统》4, 2100091 (2022)。

26. Luo, Y. et al. Learning human-environment interactions usingconformal tactile textiles. Nat. Electron. 4, 193-201 (2021).

共形触觉纺织品。《自然·电子学》4, 193-201 (2021)。

27. Yin, H., Varava, A. & Kragic, D. Modeling, learning, perception, andcontrol methods for deformable object manipulation. Sci. Robot. 6, eabd8803 (2021).

可变形物体操作的控制方法。《机器人科学》第6卷，eabd8803 (2021)。

28. Wang, W. et al. Strain-insensitive intrinsically stretchable transistorsand circuits. Nat. Electron. 4, 143-150 (2021).

及电路。《自然-电子学》第4卷，143-150 (2021)。

29. Yoo, J. et al. Industrial grade, bending-insensitive, transparentnanoforce touch sensor via enhanced percolation effect in a hierarchical nanocomposite film. Adv. Funct. Mater. 28, 1804721 (2018).

通过分级纳米复合薄膜中增强渗流效应实现的纳米力触觉传感器。《先进功能材料》第28卷，1804721 (2018)。

30. Xin, Y., Zhou, J., Nesser, H. & Lubineau, G. Design strategies forstrain-insensitive wearable healthcare sensors and perspective based on the Seebeck coefficient. Adv. Electron. Mater. 9, 2200534

基于塞贝克系数的应变不敏感可穿戴医疗传感器及展望。《先进电子材料》第9卷，2200534(2023).

31. Lee, H. J., Chun, K.-Y., Oh, J. H. & Han, C.-S. Wearable triboelectricstrain-insensitive pressure sensors based on hierarchical superposition patterns. ACS Sens. 6, 2411-2418 (2021).

基于分级叠加图案的应变不敏感压力传感器。《ACS传感器》第6卷，2411-2418 (2021)。

32. Sharma, S. et al. Stretchable and all-directional strain-insensitiveelectronic glove for robotic skins and human-machine interfacing. ACS Nano 17, 8355-8366 (2023).

用于机器人皮肤和人机交互的电子手套。《ACS纳米》第17卷，8355-8366 (2023)。

33. Lee, S. et al. A transparent bending-insensitive pressure sensor. Nat.Nanotechnol. 11, 472-478 (2016).

《纳米技术》第11卷，472-478 (2016)。

34. Jang, S. et al. A high aspect ratio serpentine structure for use as astrain-insensitive, stretchable transparent conductor. Small 14, 1702818 (2018).

应变不敏感、可拉伸透明导体。《Small》第14卷，1702818 (2018)。

35. Su, Q. et al. A stretchable and strain-unperturbed pressure sensorfor motion interference-free tactile monitoring on skins. Sci. Adv. 7, eabi4563 (2021).

用于皮肤上无运动干扰的触觉监测。《科学进展》第7卷，eabi4563 (2021)。

36. Liu, H. et al. Robust and multifunctional kirigami electronics with atough and permeable aramid nanofiber framework. Adv. Mater. 34, 2207350 (2022).

坚韧且可渗透的芳纶纳米纤维框架。《先进材料》第34卷，2207350 (2022)。

37. Wang, Z. et al. 3D-printed graphene/polydimethylsiloxane com-posites for stretchable and strain-insensitive temperature sensors. ACS Appl. Mater. Interfaces 11, 1344-1352 (2019).

用于可拉伸和应变不敏感温度传感器的复合材料。《ACS应用材料与界面》第11卷，1344-1352 (2019)。

38. Nan, K. et al. Engineered elastomer substrates for guided assemblyof complex 3D mesostructures by spatially nonuniform compressive buckling. Adv. Funct. Mater. 27, 1604281 (2017).

通过空间非均匀压缩屈曲实现复杂三维介观结构。《先进功能材料》第27卷，1604281 (2017)。

39. Jang, K.-I. et al. Self-assembled three dimensional network designsfor soft electronics. Nat. Commun. 8, 15894 (2017).

用于柔性电子器件。《自然-通讯》第8卷，15894 (2017)。

40. Cao, Y. et al. Direct fabrication of stretchable electronics on apolymer substrate with process-integrated programmable rigidity. Adv. Funct. Mater. 28, 1804604 (2018).

具有工艺集成可编程刚度的聚合物基底。《先进功能材料》第28卷，1804604 (2018)。

41. Won, D.-J., Yoo, D. & Kim, J. Effect of a microstructured dielectric layer on a bending-insensitive capacitive-type touch sensor with shielding. ACS Appl. Electron. Mater. 2, 846-854 (2020).

41. Won, D.-J., Yoo, D. & Kim, J. 微结构介电层对带屏蔽功能的弯曲不敏感电容式触觉传感器的影响。《ACS应用电子材料》第2卷，846-854 (2020)。

42. Weng, C., Dai, Z., Wang, G., Liu, L. & Zhang, Z. Elastomer-free,stretchable, and conformable silver nanowire conductors enabled by three-dimensional buckled microstructures. ACS Appl. Mater. Interfaces 11, 6541-6549 (2019).

通过三维屈曲微结构实现的可拉伸且共形的银纳米线导体。《ACS应用材料与界面》第11卷，6541-6549 (2019)。

43. Kim, M. S. et al. Skin-like omnidirectional stretchable platform withnegative Poisson's ratio for wearable strain-pressure simultaneous sensor. Adv. Funct. Mater. 33, 2208792 (2023).

用于可穿戴应变-压力同步传感器的负泊松比。Adv. Funct. Mater. 33, 2208792 (2023)。

44. Dai, Z. et al. Multifunctional polymer-based graphene foams withbuckled structure and negative Poisson's ratio. Sci. Rep. 6, 32989 (2016).

屈曲结构与负泊松比。Sci. Rep. 6, 32989 (2016)。

45. He, J. et al. Strain-insensitive self-powered tactile sensor arraysbased on intrinsically stretchable and patternable ultrathin conformal wrinkled graphene-elastomer composite. Adv. Funct. Mater. 32, 2107281 (2022).

基于本质可拉伸且可图案化的超薄共形褶皱石墨烯-弹性体复合材料。Adv. Funct. Mater. 32, 2107281 (2022)。

46. Zhao, Y. et al. A moss-inspired electroless gold-coating strategytoward stretchable fiber conductors by dry spinning. Adv. Electron. Mater. 5, 1800462 (2019).

通过干法纺丝实现可拉伸纤维导体。Adv. Electron. Mater. 5, 1800462 (2019)。

47. Xu, F. et al. Highly stretchable carbon nanotube transistors with iongel gate dielectrics. Nano Lett. 14, 682-686 (2014).

凝胶栅极电介质。Nano Lett. 14, 682-686 (2014)。

48. Veeramuthu, L. et al. Human skin-inspired electrospun patternedrobust strain-insensitive pressure sensors and wearable flexible light-emitting diodes. ACS Appl. Mater. Interfaces 14, 30160-30173

稳健的应变不敏感压力传感器与可穿戴柔性发光二极管。ACS Appl. Mater. Interfaces 14, 30160-30173(2022).

49. Zhao, Y. et al. Soft strain-insensitive bioelectronics featuring brittlematerials. Science 378, 1222-1227 (2022).

材料。Science 378, 1222-1227 (2022)。

50. Li, H. et al. A hybrid strategy-based ultra-narrow stretchablemicroelectrodes with cell-level resolution. Adv. Funct. Mater. 33, 2300859 (2023).

具有细胞级分辨率的微电极。Adv. Funct. Mater. 33, 2300859 (2023)。

51. Gong, S. et al. Local crack-programmed gold nanowire electronicskin tattoos for in-plane multisensor integration. Adv. Mater. 31, 1903789 (2019).

用于面内多传感器集成的皮肤纹身。Adv. Mater. 31, 1903789 (2019)。

52. Li, F., Xue, H., Lin, X., Zhao, H. & Zhang, T. Wearable temperaturesensor with high resolution for skin temperature monitoring. ACS Appl. Mater. Interfaces 14, 43844-43852 (2022).

用于皮肤温度监测的高分辨率传感器。ACS Appl. Mater. Interfaces 14, 43844-43852 (2022)。

53. Ho, M. D., Liu, Y., Dong, D., Zhao, Y. & Cheng, W. Fractal goldnanoframework for highly stretchable transparent strain-insensitive conductors. Nano Lett. 18, 3593-3599 (2018).

用于高可拉伸透明应变不敏感导体的纳米框架。Nano Lett. 18, 3593-3599 (2018)。

54. Choi, G. M. et al. PEDOT:PSS/polyacrylamide nanoweb: highlyreliable soft conductors with swelling resistance. ACS Appl. Mater. Interfaces 11, 10099-10107 (2019).

具有抗溶胀性能的可靠软导体。ACS Appl. Mater. Interfaces 11, 10099-10107 (2019)。

55. Li, Y. et al. Strain-insensitive bioelectronics. Chem. Eng. J. 482,148758 (2024).

56. Liu, Z. et al. Highly breathable and stretchable strain sensors withinsensitive response to pressure and bending. Adv. Funct. Mater. 31, 2007622 (2021).

对压力和弯曲的不敏感响应。Adv. Funct. Mater. 31, 2007622 (2021)。

57. Hu, H. et al. A review of structure engineering of strain-tolerantarchitectures for stretchable electronics. Small Methods 7, 2300671

可拉伸电子器件的架构。Small Methods 7, 2300671(2023).

58. Peters, B. & Kriegeskorte, N. Capturing the objects of vision withneural networks. Nat. Hum. Behav. 5, 1127-1144 (2021).

神经网络。Nat. Hum. Behav. 5, 1127-1144 (2021)。

59. Grady, P. et al. PressureVision: estimating hand pressure from asingle RGB image. In: Proc. European Conference on Computer

单张 RGB 图像。见:Proc. European Conference on ComputerVision (ECCV) (Springer, Tel Aviv, Israel, 2022).

60. Sun, H., Kuchenbecker, K. J. & Martius, G. A soft thumb-sized vision-based sensor with accurate all-round force perception. Nat. Mach. Intell. 4, 135-145 (2022).

基于传感器的精确全方位力感知。《自然-机器智能》4, 135-145 (2022)。

61. Yuan, W., Dong, S. & Adelson, E. Gelsight: high-resolution robottactile sensors for estimating geometry and force. Sensors 17, 2762

用于估计几何形状和力的触觉传感器。《传感器》17, 2762(2017).

62. Fan, Z. et al. ARCTIC: a dataset for dexterous bimanual hand-objectmanipulation. In: Proc. IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) 12943-12954 (IEEE, Vancouver, Canada, 2023).

操作。见:IEEE/CVF 计算机视觉与模式识别会议 (CVPR) 论文集 12943-12954 (IEEE, 加拿大温哥华, 2023)。

63. Abad, A. C. & Ranasinghe, A. Visuotactile sensors with emphasis onGelsight sensor: a review. IEEE Sens. J. 20, 7628-7638 (2020).

Gelsight 传感器:综述。《IEEE 传感器杂志》20, 7628-7638 (2020)。

64. Mitrano, P., MConachie, D. & Berenson, D. Learning where to trustunreliable models in an unstructured world for deformable object manipulation. Sci. Robot. 6, eabd8170 (2021).

非结构化世界中用于可变形物体操作的不可靠模型。《科学-机器人》6, eabd8170 (2021)。

65. Hong, W. et al. Self-adaptive cardiac optogenetics device based onnegative stretching-resistive strain sensor. Sci. Adv. 7, eabj4273

负拉伸电阻应变传感器。《科学进展》7, eabj4273(2021).

66. Liu, S., Rao, Y., Jang, H., Tan, P. & Lu, N. Strategies for body-conformable electronics. Matter 5, 1104-1136 (2022).

共形电子学。《物质》5, 1104-1136 (2022)。

67. Lu, N., Lu, C., Yang, S. & Rogers, J. Highly sensitive skin-mountablestrain gauges based entirely on elastomers. Adv. Funct. Mater. 22, 4044-4050 (2012).

完全基于弹性体的应变计。《先进功能材料》22, 4044-4050 (2012)。

68. Amjadi, M., Pichitpajongkit, A., Lee, S., Ryu, S. & Park, I. Highlystretchable and sensitive strain sensor based on silver nanowire-elastomer nanocomposite. ACS Nano 8, 5154-5163 (2014).

基于银纳米线-弹性体纳米复合材料的可拉伸且灵敏的应变传感器。《ACS 纳米》8, 5154-5163 (2014)。

69. Fu, H. et al. RFUniverse: a multiphysics simulation platform forembodied AI. In: Proc. Robotics: Science and Systems XIX 87 (IFRR,

具身智能。见:机器人:科学与系统 XIX 论文集 87 (IFRR,Daegu, Korea, 2023).

70. Chen, J. et al. Tracking and reconstructing hand object interactionsfrom point cloud sequences in the Wild. In: Proc. 2023 AAAI Conference on Artificial Intelligence (AAAI-23) 304-312 (AAAI,

来自野外点云序列。见:2023 年 AAAI 人工智能会议 (AAAI-23) 论文集 304-312 (AAAI,Washington, DC, USA, 2023).

71. Li, K. et al. Chord: Category-level hand-held object reconstructionvia shape deformation. In: Proc. IEEE/CVF International Conference

通过形状变形。见:IEEE/CVF 国际会议论文集on Computer Vision (ICCV) 9410-9420 (IEEE, Paris, France, 2023).

72. Xu, W. et al. Visual-tactile sensing for in-hand object reconstruction.In: Proc. IEEE/CVF Conference on Computer Vision and Pattern

见:IEEE/CVF 计算机视觉与模式识别会议论文集Recognition (CVPR) 8803-8812 (IEEE, Vancouver, Canada, 2023).

## Acknowledgements

## 致谢

This work was partially supported by the STI 2030-Major Projects (2022ZD0208601, 2022ZD0208600), the National Key R&D Program of China under the grant (2022YFF120301, 2020YFB1313502), the Fundamental Research Funds for the Central Universities, the Strategic Priority Research Program of Chinese Academy of Sciences (Grant No. XDA25040100, XDA25040200 and XDA25040300), the National Natural Science Foundation of China (No. 42127807-03), Project supported by Shanghai Municipal Science and Technology Major Project (2021SHZDZX), Shanghai Pilot Program for Basic Research-Shanghai Jiao Tong University (No. 21TQ1400203), SJTU Trans-med Award (No.2019015, 21×010301627), the Oceanic Interdisciplinary Program of Shanghai Jiao Tong University (No.SL2020ZD205, SL2020MS017, SL2103), Scientific Research Fund of Second Institute of Oceanography, MNR (No.SL2020ZD205). The authors are also grateful to the Center for Advanced Electronic Materials and Devices (AEMD) of Shanghai Jiao Tong University.

本研究得到了科技创新 2030-重大项目 (2022ZD0208601, 2022ZD0208600)、国家重点研发计划 (2022YFF120301, 2020YFB1313502)、中央高校基本科研业务费、中国科学院战略性先导科技专项 (项目编号 XDA25040100, XDA25040200 及 XDA25040300)、国家自然科学基金 (No. 42127807-03)、上海市市级科技重大专项 (2021SHZDZX)、上海市基础研究特区计划-上海交通大学 (No. 21TQ1400203)、上海交通大学转化医学交叉研究基金 (No. 2019015, 21×010301627)、上海交通大学海洋交叉研究基金 (No. SL2020ZD205, SL2020MS017, SL2103) 以及自然资源部第二海洋研究所科学研究基金 (No. SL2020ZD205) 的部分资助。作者同时感谢上海交通大学先进电子材料与器件平台 (AEMD) 的支持。

## Author contributions

## 作者贡献

C.J. and W.X. contributed equally to this work. C.J. and W.X. conceived the project and designed the studies. C.J. designed and fabricated the materials, devices, and circuits. Y.L. assisted in realizing the data transfer and visualizations. W.X. and Z.Y. completed the visual-tactile joint learning framework. C.J. and Z.Y. worked on the testing experiments and data analysis. X.H. and Z.X assisted in the preparation of devices. L.W., Q.L., B.Y., and X.W. evaluated the experiments. C.J. and W.X. composed the manuscript. W.D., T.T., D.Z., S.Y., C.L., and J.L. edited the manuscript. All authors discussed the results and provided valuable feedback on the manuscript.

C.J.与W.X.对本工作贡献均等。C.J.与W.X.构思了本项目并设计了研究方案。C.J.负责材料、器件与电路的设计及制造。Y.L.协助实现了数据传输与可视化。W.X.与Z.Y.完成了视觉-触觉联合学习框架。C.J.与Z.Y.负责测试实验与数据分析。X.H.与Z.X.协助了器件的制备。L.W.、Q.L.、B.Y.与X.W.对实验进行了评估。C.J.与W.X.撰写了论文。W.D.、T.T.、D.Z.、S.Y.、C.L.与J.L.对论文进行了编辑。所有作者讨论了研究结果并对论文提出了宝贵意见。

## Competing interests

## 利益冲突

The authors declare no competing interests.

作者声明不存在利益冲突。

## Additional information

## 附加信息

Supplementary information The online version contains supplementary material available at https://doi.org/10.1038/s41467-024-53654-y.

补充信息 在线版本包含补充材料，可通过 https://doi.org/10.1038/s41467-024-53654-y 获取。

Correspondence and requests for materials should be addressed to Cewu Lu or Jingquan Liu.

通讯及材料索取请联系Cewu Lu或Jingquan Liu。

Peer review information Nature Communications thanks Yunzhu Li, and the other, anonymous, reviewer(s) for their contribution to the peer review of this work. A peer review file is available.

同行评审信息 Nature Communications感谢Yunzhu Li及其他匿名审稿人对本工作同行评审所作的贡献。同行评审文件可供查阅。

## Reprints and permissions information is available at

## 转载与许可信息可从以下网址获取

http://www.nature.com/reprints

Publisher's note Springer Nature remains neutral with regard to jurisdictional claims in published maps and institutional affiliations.

出版商说明 对于已发表地图中的管辖权主张及所属机构，Springer Nature保持中立。

Open Access This article is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License, which permits any non-commercial use, sharing, distribution and reproduction in any medium or format, as long as you give appropriate credit to the original author(s) and the source, provide a link to the Creative Commons licence, and indicate if you modified the licensed material. You do not have permission under this licence to share adapted material derived from this article or parts of it. The images or other third party material in this article are included in the article's Creative Commons licence, unless indicated otherwise in a credit line to the material. If material is not included in the article's Creative Commons licence and your intended use is not permitted by statutory regulation or exceeds the permitted use, you will need to obtain permission directly from the copyright holder. To view a copy of this licence, visit http:// creativecommons.org/licenses/by-nc-nd/4.0/.

开放获取 本文采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。只要您给予原作者及来源适当的署名，提供指向知识共享许可协议的链接，并说明是否对许可材料进行了修改，您即可在任何媒介或格式下以非商业目的分享、分发及复制本文。根据本许可协议，您无权分享基于本文改编的材料或其部分内容。本文中的图片或其他第三方材料均包含在文章的知识共享许可协议中，除非在材料的署名中另有说明。如果材料未包含在文章的知识共享许可协议中，且您的预期用途不符合法定许可或超出许可使用范围，您需要直接获得版权持有人的许可。如需查看本许可协议的副本，请访问 http://creativecommons.org/licenses/by-nc-nd/4.0/。

© The Author(s) 2024

© 作者 2024