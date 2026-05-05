/**
 * 交错文字动画示例
 *
 * 展示内容：
 * - 逐字母动画
 * - 每个字母独立 spring 动画
 * - 从下方弹起效果
 * - 结合颜色渐变
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const TEXT = "REMOTION";

export const StaggeredTextDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 入场动画
  const letters = TEXT.split("");

  // 退场动画（最后 1 秒）
  const outProgress = spring({
    frame,
    fps,
    durationInFrames: 1 * fps,
    delay: durationInFrames - 1 * fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        {letters.map((letter, i) => {
          // 每个字母延迟 5 帧
          const delay = i * 5;

          // 入场 spring
          const inProgress = spring({
            frame,
            fps,
            delay,
            config: { damping: 12, stiffness: 200 },
          });

          // 最终 scale = 入场 - 退场
          const scale = inProgress - outProgress;

          // Y 轴偏移
          const translateY = interpolate(inProgress, [0, 1], [100, 0]);

          // 颜色渐变：根据位置给不同颜色
          const hue = (i / letters.length) * 120; // 0~120 范围 = 红到绿
          const color = `hsl(${hue}, 100%, 60%)`;

          return (
            <div
              key={i}
              style={{
                fontSize: 120,
                fontWeight: "bold",
                fontFamily: "sans-serif",
                color,
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: inProgress,
              }}
            >
              {letter}
            </div>
          );
        })}
      </div>

      {/* 底部说明 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          color: "#6b6b76",
          fontSize: 20,
          fontFamily: "monospace",
        }}
      >
        逐字母 Spring 弹性动画 + 颜色渐变
      </div>
    </AbsoluteFill>
  );
};
