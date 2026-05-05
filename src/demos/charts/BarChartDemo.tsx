/**
 * 柱状图示例
 *
 * 展示内容：
 * - SVG 柱状图
 * - spring 交错入场动画
 * - 数值标签
 * - 网格线
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const DATA = [
  { label: "一月", value: 65, color: "#00ff88" },
  { label: "二月", value: 45, color: "#00d4ff" },
  { label: "三月", value: 80, color: "#ffb800" },
  { label: "四月", value: 55, color: "#ff4757" },
  { label: "五月", value: 70, color: "#e056fd" },
  { label: "六月", value: 90, color: "#22a6b3" },
];

const CHART_WIDTH = 1200;
const CHART_HEIGHT = 500;
const BAR_WIDTH = 80;
const BAR_GAP = 60;
const MAX_VALUE = 100;
const STAGGER_DELAY = 6;

export const BarChartDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题淡入
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
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
        柱状图 Bar Chart
      </h1>

      <div
        style={{
          width: CHART_WIDTH,
          height: CHART_HEIGHT,
          position: "relative",
          marginLeft: 60,
        }}
      >
        {/* 网格线 */}
        {Array.from({ length: 5 }, (_, i) => {
          const y = (i / 4) * CHART_HEIGHT;
          const value = MAX_VALUE - (i / 4) * MAX_VALUE;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: y,
                  width: CHART_WIDTH,
                  height: 1,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: -50,
                  top: y - 10,
                  color: "#6b6b76",
                  fontSize: 14,
                  fontFamily: "monospace",
                }}
              >
                {value}
              </span>
            </React.Fragment>
          );
        })}

        {/* 柱状条 */}
        {DATA.map((item, i) => {
          const progress = spring({
            frame,
            fps,
            delay: i * STAGGER_DELAY + 15, // 标题出现后再开始
            config: { damping: 200 },
          });

          const barHeight = (item.value / MAX_VALUE) * CHART_HEIGHT * progress;
          const x = i * (BAR_WIDTH + BAR_GAP);
          const y = CHART_HEIGHT - barHeight;

          // 数值标签透明度
          const labelOpacity = interpolate(
            progress,
            [0.8, 1],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: BAR_WIDTH,
                  height: barHeight,
                  backgroundColor: item.color,
                  borderRadius: "8px 8px 0 0",
                }}
              />
              {/* 数值 */}
              <span
                style={{
                  position: "absolute",
                  left: x,
                  top: y - 28,
                  width: BAR_WIDTH,
                  textAlign: "center",
                  color: item.color,
                  fontSize: 18,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  opacity: labelOpacity,
                }}
              >
                {item.value}
              </span>
              {/* 标签 */}
              <span
                style={{
                  position: "absolute",
                  left: x,
                  top: CHART_HEIGHT + 12,
                  width: BAR_WIDTH,
                  textAlign: "center",
                  color: "#6b6b76",
                  fontSize: 16,
                  fontFamily: "sans-serif",
                }}
              >
                {item.label}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
