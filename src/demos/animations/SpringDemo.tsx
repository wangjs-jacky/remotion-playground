/**
 * Spring 弹性动画示例
 *
 * 展示内容：
 * - spring() 基础用法
 * - 不同物理参数：smooth / snappy / bouncy / heavy
 * - spring delay 延迟
 * - spring + interpolate 组合映射到自定义范围
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 四种 spring 配置
const CONFIGS = [
  { label: "smooth (damping: 200)", config: { damping: 200 } },
  { label: "snappy (damping: 20, stiffness: 200)", config: { damping: 20, stiffness: 200 } },
  { label: "bouncy (damping: 8)", config: { damping: 8 } },
  { label: "heavy (mass: 2, damping: 15, stiffness: 80)", config: { damping: 15, stiffness: 80, mass: 2 } },
];

export const SpringDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 48, fontFamily: "sans-serif", marginBottom: 40 }}>
        Spring 弹性动画
      </h1>

      {CONFIGS.map((item, i) => {
        // 每个 spring 有不同延迟，错落展示
        const delay = i * 10;

        const progress = spring({
          frame,
          fps,
          config: item.config,
          delay,
        });

        // 将 spring 的 0→1 映射到位移量
        const translateX = interpolate(progress, [0, 1], [-600, 0]);
        // 映射到透明度
        const opacity = interpolate(progress, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              transform: `translateX(${translateX}px)`,
              opacity,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 60 + progress * 60,
                height: 30,
                backgroundColor: "#00ff88",
                borderRadius: 8,
              }}
            />
            <span style={{ color: "#e5e5e7", fontSize: 24, fontFamily: "monospace" }}>
              {item.label}
            </span>
            <span style={{ color: "#6b6b76", fontSize: 18, fontFamily: "monospace" }}>
              progress: {progress.toFixed(3)}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
