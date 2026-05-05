/**
 * 折线图示例
 *
 * 展示内容：
 * - @remotion/paths 路径动画
 * - evolvePath 绘制路径动画
 * - getPointAtLength 路径跟随标记
 * - 数据点到 SVG 路径转换
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  evolvePath,
  getLength,
  getPointAtLength,
} from "@remotion/paths";

// 数据集
const DATA_POINTS = [
  { x: 0, y: 350 },
  { x: 100, y: 280 },
  { x: 200, y: 320 },
  { x: 300, y: 200 },
  { x: 400, y: 250 },
  { x: 500, y: 150 },
  { x: 600, y: 180 },
  { x: 700, y: 100 },
  { x: 800, y: 130 },
  { x: 900, y: 80 },
  { x: 1000, y: 60 },
  { x: 1100, y: 90 },
];

// 数据点偏移（适配图表区域）
const OFFSET_X = 80;
const OFFSET_Y = 50;
const CHART_WIDTH = 1200;
const CHART_HEIGHT = 500;

// 生成平滑路径（使用贝塞尔曲线）
const generateSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return "";
  const adjusted = points.map((p) => ({
    x: p.x + OFFSET_X,
    y: p.y + OFFSET_Y,
  }));

  let path = `M ${adjusted[0].x} ${adjusted[0].y}`;
  for (let i = 1; i < adjusted.length; i++) {
    const prev = adjusted[i - 1];
    const curr = adjusted[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
};

const path = generateSmoothPath(DATA_POINTS);
const pathLength = getLength(path);

export const LineChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 路径绘制进度
  const drawProgress = interpolate(frame, [15, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 获取路径动画的 dash 属性
  const { strokeDasharray, strokeDashoffset } = evolvePath(drawProgress, path);

  // 路径跟随点
  const currentPoint = getPointAtLength(path, drawProgress * pathLength);

  // 标题淡入
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
      }}
    >
      <h1
        style={{
          color: "#e5e5e7",
          fontSize: 48,
          fontFamily: "sans-serif",
          marginBottom: 40,
          opacity: titleOpacity,
        }}
      >
        折线图 Line Chart
      </h1>

      <svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* 网格线 */}
        {Array.from({ length: 6 }, (_, i) => {
          const y = OFFSET_Y + (i / 5) * (CHART_HEIGHT - 100);
          return (
            <line
              key={i}
              x1={OFFSET_X}
              y1={y}
              x2={CHART_WIDTH - 80}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          );
        })}

        {/* 渐变填充区域 */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 路径动画 */}
        <path
          d={path}
          fill="none"
          stroke="#00ff88"
          strokeWidth={3}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />

        {/* 跟随圆点 */}
        <circle
          cx={currentPoint.x}
          cy={currentPoint.y}
          r={8}
          fill="#00ff88"
          style={{
            filter: "drop-shadow(0 0 10px rgba(0,255,136,0.5))",
          }}
        />

        {/* 已绘制的数据点 */}
        {DATA_POINTS.map((point, i) => {
          const x = point.x + OFFSET_X;
          const y = point.y + OFFSET_Y;

          // 只显示已绘制过的点
          const pointProgress = interpolate(
            drawProgress,
            [i / (DATA_POINTS.length - 1) - 0.01, i / (DATA_POINTS.length - 1)],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={4 * pointProgress}
              fill="#0a0a0b"
              stroke="#00ff88"
              strokeWidth={2}
              opacity={pointProgress}
            />
          );
        })}
      </svg>

      <div
        style={{
          marginTop: 20,
          color: "#6b6b76",
          fontSize: 16,
          fontFamily: "monospace",
        }}
      >
        路径进度: {(drawProgress * 100).toFixed(1)}% | 使用 @remotion/paths 的 evolvePath + getPointAtLength
      </div>
    </AbsoluteFill>
  );
};
