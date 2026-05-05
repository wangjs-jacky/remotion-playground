/**
 * Easing 缓动曲线示例
 *
 * 展示内容：
 * - Easing.in / Easing.out / Easing.inOut
 * - 不同曲线：quad / sin / exp / circle
 * - 自定义贝塞尔曲线
 * - 对比线性插值与缓动插值
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const EASINGS = [
  { label: "linear", easing: Easing.linear },
  { label: "inOut(quad)", easing: Easing.inOut(Easing.quad) },
  { label: "out(sin)", easing: Easing.out(Easing.sin) },
  { label: "inOut(exp)", easing: Easing.inOut(Easing.exp) },
  { label: "out(circle)", easing: Easing.out(Easing.circle) },
  { label: "bezier(0.8,0.22,0.96,0.65)", easing: Easing.bezier(0.8, 0.22, 0.96, 0.65) },
];

export const EasingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 总动画时间 4 秒
  const progress = interpolate(frame, [0, 4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 48, fontFamily: "sans-serif", marginBottom: 20 }}>
        Easing 缓动曲线对比
      </h1>

      {EASINGS.map((item, i) => {
        const value = interpolate(progress, [0, 1], [0, 1], {
          easing: item.easing,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const barWidth = value * 800;

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                color: "#e5e5e7",
                fontSize: 16,
                fontFamily: "monospace",
                width: 280,
                textAlign: "right",
              }}
            >
              {item.label}
            </span>
            <div
              style={{
                width: barWidth,
                height: 24,
                backgroundColor: i === 0 ? "#6b6b76" : "#00ff88",
                borderRadius: 4,
              }}
            />
            <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace" }}>
              {value.toFixed(3)}
            </span>
          </div>
        );
      })}

      {/* 时间进度条 */}
      <div style={{ marginTop: 40 }}>
        <div
          style={{
            width: progress * 800,
            height: 4,
            backgroundColor: "#ffb800",
            borderRadius: 2,
          }}
        />
        <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace", marginTop: 8 }}>
          总进度: {(progress * 100).toFixed(1)}%
        </span>
      </div>
    </AbsoluteFill>
  );
};
