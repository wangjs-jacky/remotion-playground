# Terminal Noir 汉堡广告视频 — 设计规格

> 基于 GPT Image 2.0 提示词故事板，用 Remotion 程序化动画还原 15 秒高端食品广告

## 1. 概述

### 目标

在 `jacky-remotion` 项目中新增一个 Burger Ad Composition，用 Terminal Noir 风格的程序化动画还原文章 OBA-xstqsfr2 中的 15 秒汉堡广告故事板。

### 约束

- **技术栈**：Remotion 4.0 + React 19 + TypeScript
- **输出规格**：1920×1080, 30fps, 450 帧（15 秒）
- **风格**：Terminal Noir — 深色背景 + 霓虹发光轮廓线
- **食材表现**：SVG 几何图形 + 发光描边 + 半透明渐变
- **实现模式**：状态机驱动场景切换

## 2. 架构

### 文件结构

```
src/demos/burger-ad/
├── BurgerAdDemo.tsx              # Composition 入口，注册到 Root.tsx
├── SceneManager.tsx              # 状态机：帧号 → 当前场景
├── scenes/
│   ├── S1EmptyStage.tsx          # 空石面 + 聚光灯亮起
│   ├── T1IngredientsFlyIn.tsx    # 食材飞入（运动轨迹残影）
│   ├── S2Stacking.tsx            # 汉堡堆叠组装
│   ├── T2BunDrop.tsx             # 慢动作面包落下 + 酱汁滴落
│   ├── S3Landing.tsx             # 成品落地 + 蒸汽升起
│   ├── T3MacroPush.tsx           # 微距推近（芝士融化特写）
│   ├── S4TextureReveal.tsx       # 质感展现
│   └── T4S5HeroShot.tsx          # 快速转场 → 最终英雄镜头
├── components/
│   ├── BurgerIngredients.tsx     # SVG 食材组件库
│   ├── SteamParticles.tsx        # 蒸汽粒子动画
│   ├── SpotlightEffect.tsx       # 暖光聚光灯
│   ├── LensEffects.tsx           # 镜头效果（景深/光晕/暗角）
│   └── Background.tsx            # 石质纹理背景
└── constants.ts                  # 时间线常量、配色方案
```

### 状态机逻辑

`SceneManager` 维护一个场景映射表：

```typescript
const TIMELINE = [
  { id: 'S1', startFrame: 0,   endFrame: 59  },
  { id: 'T1', startFrame: 60,  endFrame: 119 },
  { id: 'S2', startFrame: 120, endFrame: 179 },
  { id: 'T2', startFrame: 180, endFrame: 239 },
  { id: 'S3', startFrame: 240, endFrame: 299 },
  { id: 'T3', startFrame: 300, endFrame: 359 },
  { id: 'S4', startFrame: 360, endFrame: 404 },
  { id: 'T4S5', startFrame: 405, endFrame: 449 },
] as const;
```

根据 `useCurrentFrame()` 查表得到当前场景 ID，渲染对应组件。每个场景组件接收 `{frame: number, durationInFrames: number}` props，内部用 `interpolate()` 管理动画。

场景之间的转场通过共享 CSS 变量和坐标系统实现视觉连续性。

## 3. 视觉系统

### 配色方案

| 用途 | CSS 变量 | 值 |
|------|----------|-----|
| 深黑背景 | `--bg-dark` | `#0a0a0b` |
| 石质表面 | `--bg-stone` | `#1a1a1f` |
| 抬升层 | `--bg-elevated` | `#131316` |
| 面包 | `--bun` | `#ffb800` |
| 肉饼 | `--patty` | `#ff4757` |
| 生菜 | `--lettuce` | `#00ff88` |
| 芝士 | `--cheese` | `#ffd166` |
| 番茄 | `--tomato` | `#ff6b35` |
| 洋葱 | `--onion` | `#e0d6ff` |
| 酱汁 | `--sauce` | `#ff2e63` |
| 蒸汽 | — | `rgba(255,255,255,0.15)` |
| 聚光灯 | — | `rgba(255,184,0,0.08)` |

### SVG 食材设计

| 食材 | 形状 | 关键特征 |
|------|------|----------|
| 顶层面包 | 半圆（上宽下窄） | 芝麻粒（小圆点），琥珀色发光轮廓 |
| 肉饼 | 圆角矩形（略扁） | 烤痕纹理（斜线条），赤红发光 |
| 生菜 | 不规则波浪形 | 霓虹绿描边，半透明填充 |
| 芝士 | 方形（边缘下垂/融化） | 金黄发光，融化边缘可动画 |
| 番茄 | 圆形（薄切片） | 橙红渐变，同心圆纹理 |
| 洋葱 | 半透明环形 | 淡紫白，多层同心环 |
| 底层面包 | 半圆（下宽上窄） | 同顶层面包，倒置 |

每个食材组件共用发光描边模式：

```
stroke: 对应霓虹色
strokeWidth: 2
filter: drop-shadow(0 0 8px <霓虹色>80)
fill: <霓虹色>15（半透明）
```

### 蒸汽粒子系统

- 20-30 个半透明白色圆形粒子
- 从汉堡顶部向上飘散
- 大小 4px-16px 随机分布
- 透明度随上升递减（0.15 → 0）
- 左右摆动幅度 ±8px（sine 波）

### 镜头效果

- **浅景深**：背景层 `filter: blur(2px)`，前景清晰
- **暗角**：四角径向渐变遮罩（`radial-gradient`）
- **暖光光晕**：聚光灯位置 `box-shadow: 0 0 120px 60px rgba(255,184,0,0.08)`

## 4. 场景动画设计

### S1: EmptyStage（帧 0-59）

- 石质表面纹理渐显（opacity 0→1，帧 0-20）
- 聚光灯从中心顶部亮起，琥珀色光锥扩散（帧 10-40）
- 静态俯视 30° 角度

### T1: IngredientsFlyIn（帧 60-119）

- 6 种食材从画面四角飞入中心
- 弧形运动路径 + 发光残影轨迹
- 食材间隔 5 帧依次飞入：面包→肉饼→芝士→生菜→番茄→洋葱

### S2: Stacking（帧 120-179）

- 食材在画面中心垂直堆叠
- 顺序（从下到上）：底层面包→肉饼→芝士（融化下垂）→生菜（波浪展开）→番茄→洋葱
- 每个食材 8 帧归位，spring 弹跳动画
- 正面 45° 略仰视角度

### T2: BunDrop（帧 180-239）

- 顶层面包从上方慢动作落下（帧 180-210）
- 着陆弹跳（帧 210-220）
- 酱汁从两侧滴落（2-3 条品红色流体曲线，重力加速）
- 芝士边缘继续向下拉伸
- 微距侧视角度

### S3: Landing（帧 240-299）

- 完整汉堡整体下沉着陆（5px + 回弹）
- 蒸汽粒子系统激活
- 聚光灯亮度 +20%，光晕扩大
- 拉远到标准英雄角度

### T3: MacroPush（帧 300-359）

- 摄像机推近（scale 1.0→2.5），聚焦芝士/肉饼区域
- 微观芝士融化动画
- 肉饼烤痕细节发光闪烁
- 背景层模糊加剧

### S4: TextureReveal（帧 360-404）

- 发光轮廓线逐一高亮每种食材描边
- 面包纹理→肉饼烤痕→芝士光泽→生菜叶脉
- 每种食材 10 帧高亮 + 5 帧渐退
- 维持微距距离

### T4+S5: HeroShot（帧 405-449）

- T4（帧 405-420）：快速拉远（scale 2.5→1.0），短暂运动模糊
- S5（帧 420-449）：完整汉堡居中，全聚光灯照亮，蒸汽持续，所有轮廓线同时亮起
- 收尾：缩放呼吸效果（scale 1.0→1.02→1.0）

## 5. Root.tsx 注册

新增 `09-BurgerAd` Folder：

```tsx
<Folder name="09-BurgerAd">
  <Composition
    id="BurgerAd"
    component={BurgerAdDemo}
    durationInFrames={450}
    fps={30}
    width={1920}
    height={1080}
  />
</Folder>
```

## 6. 验收标准

- [ ] 视频总时长 15 秒（450 帧），30fps
- [ ] 8 个场景/转场按时间线顺序正确切换
- [ ] SVG 食材具有霓虹发光效果，Terminal Noir 配色
- [ ] 蒸汽粒子动画在 S3 之后持续运行
- [ ] 镜头效果（景深、暗角、光晕）贯穿全程
- [ ] `npm run start` 可在 Remotion Studio 中预览
- [ ] 可通过 `npx remotion render` 输出 MP4 文件
