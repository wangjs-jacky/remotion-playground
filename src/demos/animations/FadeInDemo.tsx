/**
 * 淡入淡出动画示例
 *
 * 展示内容：
 * - interpolate 基础线性插值
 * - extrapolateLeft / extrapolateRight 钳制
 * - 淡入 + 淡出组合
 * - 多元素错落淡入（stagger）
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ITEMS = ["Remotion", "视频编程", "React 驱动"];

export const FadeInDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 整体淡入：前 1 秒从 0 → 1
  const fadeIn = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 整体淡出：最后 1 秒从 1 → 0
  const fadeOut = interpolate(frame, [2 * fps, 3 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = fadeIn * fadeOut;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ opacity }}>
        {ITEMS.map((text, i) => {
          // 每个元素错开 10 帧出现
          const itemOpacity = interpolate(
            frame,
            [i * 10, i * 10 + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // 每个元素从下方滑入
          const translateY = interpolate(
            frame,
            [i * 10, i * 10 + 15],
            [30, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                opacity: itemOpacity,
                transform: `translateY(${translateY}px)`,
                color: i === 0 ? "#00ff88" : "#e5e5e7",
                fontSize: i === 0 ? 72 : 48,
                fontWeight: "bold",
                fontFamily: "sans-serif",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
