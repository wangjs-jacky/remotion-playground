/**
 * Sequence 序列编排示例
 *
 * 展示内容：
 * - <Sequence> 基础用法（延迟出现、限制时长）
 * - premountFor 预挂载
 * - 嵌套 Sequence
 * - layout="none" 行内布局
 * - useCurrentFrame() 在 Sequence 内返回局部帧
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fps: _fps } = { fps: 30 };

// 单个色块组件
const ColorBlock: React.FC<{
  color: string;
  label: string;
  delay: number;
}> = ({ color, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 注意：在 Sequence 内部，frame 从 0 开始
  const scale = spring({
    frame,
    fps,
    delay,
    config: { damping: 12 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 200,
        height: 200,
        backgroundColor: color,
        borderRadius: 16,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <span style={{ color: "#0a0a0b", fontSize: 24, fontWeight: "bold", fontFamily: "sans-serif" }}>
        {label}
      </span>
    </div>
  );
};

export const SequenceDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 48, fontFamily: "sans-serif", marginBottom: 20 }}>
        Sequence 编排示例
      </h1>
      <p style={{ color: "#6b6b76", fontSize: 18, fontFamily: "monospace", marginBottom: 40 }}>
        当前帧: {frame} | 每个色块在不同帧出现
      </p>

      {/* 三个色块按时间错开出现 */}
      <div style={{ display: "flex", gap: 40 }}>
        <Sequence from={0} premountFor={1 * fps}>
          <ColorBlock color="#00ff88" label="T=0s" delay={0} />
        </Sequence>

        <Sequence from={1 * fps} premountFor={1 * fps}>
          <ColorBlock color="#ffb800" label="T=1s" delay={0} />
        </Sequence>

        <Sequence from={2 * fps} premountFor={1 * fps}>
          <ColorBlock color="#00d4ff" label="T=2s" delay={0} />
        </Sequence>

        <Sequence from={3 * fps} premountFor={1 * fps}>
          <ColorBlock color="#ff4757" label="T=3s" delay={0} />
        </Sequence>
      </div>

      {/* 嵌套 Sequence 示例 */}
      <Sequence from={3.5 * fps}>
        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          <Sequence from={0} layout="none">
            <ColorBlock color="#e056fd" label="嵌套 1" delay={0} />
          </Sequence>
          <Sequence from={10} layout="none">
            <ColorBlock color="#22a6b3" label="嵌套 2" delay={0} />
          </Sequence>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
