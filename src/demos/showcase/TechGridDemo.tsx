import { useCurrentFrame, useVideoConfig } from "remotion";

const HORIZON_RATIO = 0.42;
const N_V_LINES = 23;
const N_H_LINES = 32;
const CYCLE_SECONDS = 2.5;
const GRID_SPREAD = 2.4; // grid bottom width as multiple of screen width
const C = "0,210,255"; // cyan-blue base color

export const TechGridDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const horizonY = height * HORIZON_RATIO;
  const floorH = height - horizonY;
  const phase = (frame % (CYCLE_SECONDS * fps)) / (CYCLE_SECONDS * fps);
  const vpX = width / 2;

  // 水平线：在屏幕空间均匀分布，向观察者方向持续滚动
  const hLines = Array.from({ length: N_H_LINES }, (_, i) => {
    const d = ((i / N_H_LINES) + phase) % 1; // 0=地平线, 1=近处
    return {
      y: horizonY + floorH * d,
      opacity: Math.pow(d, 0.55) * 0.78,
      sw: 0.3 + d * 2.4,
    };
  });

  // 垂直线：从消失点放射到底部边缘外侧
  const vLines = Array.from({ length: N_V_LINES }, (_, i) => {
    const t = i / (N_V_LINES - 1);
    return { bx: vpX + (t - 0.5) * width * GRID_SPREAD };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#050810",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          {/* 背景径向渐变 */}
          <radialGradient
            id="tg-bg"
            cx="50%"
            cy={`${HORIZON_RATIO * 100}%`}
            r="75%"
          >
            <stop offset="0%" stopColor="#0c1a2e" />
            <stop offset="50%" stopColor="#070c18" />
            <stop offset="100%" stopColor="#050810" />
          </radialGradient>

          {/* 网格线发光滤镜 */}
          <filter id="tg-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 地平线强发光滤镜 */}
          <filter id="tg-horiz-glow" x="-5%" y="-800%" width="110%" height="1700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 地板渐隐遮罩：地平线处透明 → 近处不透明 */}
          <linearGradient
            id="tg-floor-fade"
            x1="0"
            y1={horizonY}
            x2="0"
            y2={height}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="22%" stopColor="white" stopOpacity="0.35" />
            <stop offset="55%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="tg-floor-mask">
            <rect
              x={-width}
              y={horizonY}
              width={width * 3}
              height={height}
              fill="url(#tg-floor-fade)"
            />
          </mask>

          {/* 天空渐变 */}
          <linearGradient
            id="tg-sky"
            x1="0"
            y1="0"
            x2="0"
            y2={horizonY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#050810" stopOpacity="1" />
            <stop offset="100%" stopColor="#050810" stopOpacity="0" />
          </linearGradient>

          {/* 底部渐隐 */}
          <linearGradient
            id="tg-bottom"
            x1="0"
            y1={height * 0.78}
            x2="0"
            y2={height}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#050810" stopOpacity="0" />
            <stop offset="100%" stopColor="#050810" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* 背景 */}
        <rect width={width} height={height} fill="url(#tg-bg)" />

        {/* 地平线区域微弱光晕（营造深空感） */}
        <ellipse
          cx={vpX}
          cy={horizonY}
          rx={width * 0.55}
          ry={height * 0.06}
          fill={`rgba(${C},0.04)`}
          filter="url(#tg-horiz-glow)"
        />

        {/* 地板网格 */}
        <g mask="url(#tg-floor-mask)" filter="url(#tg-glow)">
          {/* 垂直线 */}
          {vLines.map(({ bx }, i) => (
            <line
              key={`v${i}`}
              x1={vpX}
              y1={horizonY}
              x2={bx}
              y2={height + 80}
              stroke={`rgba(${C},0.28)`}
              strokeWidth="1"
            />
          ))}

          {/* 水平线（滚动动画） */}
          {hLines.map(({ y, opacity, sw }, i) => (
            <line
              key={`h${i}`}
              x1={-width * 0.6}
              y1={y}
              x2={width * 1.6}
              y2={y}
              stroke={`rgba(${C},${opacity})`}
              strokeWidth={sw}
            />
          ))}
        </g>

        {/* 地平线发光线 */}
        <line
          x1={0}
          y1={horizonY}
          x2={width}
          y2={horizonY}
          stroke={`rgba(${C},0.95)`}
          strokeWidth="1.5"
          filter="url(#tg-horiz-glow)"
        />

        {/* 天空叠层 */}
        <rect width={width} height={horizonY + 2} fill="url(#tg-sky)" />

        {/* 底部渐隐叠层 */}
        <rect
          y={height * 0.78}
          width={width}
          height={height * 0.22}
          fill="url(#tg-bottom)"
        />
      </svg>
    </div>
  );
};
