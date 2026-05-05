/**
 * 裁剪示例
 *
 * 展示内容：
 * - 负 from 值裁剪动画开头
 * - durationInFrames 裁剪动画结尾
 * - 嵌套 Sequence 组合裁剪 + 延迟
 * - 裁剪入场动画跳过开头部分
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// 一个完整的长动画（3 秒旋转）
const RotatingSquare: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = interpolate(frame, [0, 3 * fps], [0, 360], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const scale = interpolate(frame, [0, 3 * fps], [0.5, 1.5], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 120,
        height: 120,
        backgroundColor: "#00ff88",
        borderRadius: 16,
        transform: `rotate(${rotation}deg) scale(${scale})`,
      }}
    />
  );
};

export const TrimmingDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 40, fontFamily: "sans-serif", marginBottom: 40 }}>
        裁剪 Trimming 示例
      </h1>

      <div style={{ display: "flex", gap: 60, alignItems: "flex-start" }}>
        {/* 原始动画 */}
        <div>
          <h3 style={{ color: "#6b6b76", fontSize: 18, fontFamily: "monospace", marginBottom: 20 }}>
            原始动画 (90 帧)
          </h3>
          <Sequence from={0} durationInFrames={3 * fps}>
            <RotatingSquare />
          </Sequence>
        </div>

        {/* 裁剪开头：跳过前 1 秒 */}
        <div>
          <h3 style={{ color: "#ffb800", fontSize: 18, fontFamily: "monospace", marginBottom: 20 }}>
            裁剪开头 (from=-30)
          </h3>
          <Sequence from={0} durationInFrames={3 * fps}>
            <Sequence from={-1 * fps}>
              <RotatingSquare />
            </Sequence>
          </Sequence>
        </div>

        {/* 裁剪结尾：只播放 1 秒 */}
        <div>
          <h3 style={{ color: "#00d4ff", fontSize: 18, fontFamily: "monospace", marginBottom: 20 }}>
            裁剪结尾 (duration=30)
          </h3>
          <Sequence from={0} durationInFrames={1 * fps}>
            <RotatingSquare />
          </Sequence>
        </div>

        {/* 裁剪开头 + 延迟 */}
        <div>
          <h3 style={{ color: "#ff4757", fontSize: 18, fontFamily: "monospace", marginBottom: 20 }}>
            裁剪 + 延迟 (from=30, inner=-15)
          </h3>
          <Sequence from={1 * fps}>
            <Sequence from={-15}>
              <RotatingSquare />
            </Sequence>
          </Sequence>
        </div>
      </div>

      {/* 底部帧计数器 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          color: "#6b6b76",
          fontSize: 16,
          fontFamily: "monospace",
        }}
      >
        当前帧: {frame} / {3 * fps}
      </div>
    </AbsoluteFill>
  );
};
