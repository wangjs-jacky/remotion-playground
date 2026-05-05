/**
 * 饼图示例
 *
 * 展示内容：
 * - SVG 饼图
 * - stroke-dashoffset 动画
 * - 从 12 点方向开始绘制
 * - 图例 + 百分比标签
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const DATA = [
  { label: "React", value: 40, color: "#00ff88" },
  { label: "TypeScript", value: 25, color: "#00d4ff" },
  { label: "CSS", value: 20, color: "#ffb800" },
  { label: "Node.js", value: 15, color: "#ff4757" },
];

const RADIUS = 180;
const STROKE_WIDTH = 60;
const CENTER = 250;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const PieChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 总绘制进度
  const progress = interpolate(frame, [0, 3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 计算每段的偏移量
  const total = DATA.reduce((sum, d) => sum + d.value, 0);

  let cumulativeOffset = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 48, fontFamily: "sans-serif", marginBottom: 40 }}>
        饼图 Pie Chart
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
        {/* SVG 饼图 */}
        <svg width={CENTER * 2} height={CENTER * 2}>
          {DATA.map((item, i) => {
            const segmentLength = (item.value / total) * CIRCUMFERENCE;
            const gapLength = CIRCUMFERENCE - segmentLength;

            // 当前段是否应该开始绘制
            const segmentStart = cumulativeOffset / CIRCUMFERENCE;
            const segmentEnd = segmentStart + item.value / total;
            cumulativeOffset += segmentLength;

            // 每段的绘制进度
            const segmentProgress = interpolate(
              progress,
              [segmentStart, segmentEnd],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const offset = interpolate(segmentProgress, [0, 1], [segmentLength, 0]);

            // 计算段起始角度（用于旋转）
            const rotationOffset = (i === 0 ? 0 : DATA.slice(0, i).reduce((s, d) => s + d.value, 0));

            return (
              <circle
                key={i}
                r={RADIUS}
                cx={CENTER}
                cy={CENTER}
                fill="none"
                stroke={item.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${segmentLength} ${gapLength}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                style={{
                  transformOrigin: `${CENTER}px ${CENTER}px`,
                }}
              />
            );
          })}
        </svg>

        {/* 图例 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {DATA.map((item, i) => {
            const percent = ((item.value / total) * 100).toFixed(0);
            const opacity = interpolate(
              progress,
              [i * 0.25, i * 0.25 + 0.1],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: item.color,
                  }}
                />
                <span style={{ color: "#e5e5e7", fontSize: 24, fontFamily: "sans-serif" }}>
                  {item.label}
                </span>
                <span style={{ color: "#6b6b76", fontSize: 20, fontFamily: "monospace" }}>
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
