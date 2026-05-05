/**
 * 音频可视化示例
 *
 * 展示内容：
 * - 模拟音频频谱可视化
 * - 动态音量插值
 * - Sequence 延迟播放概念
 * - 多音轨叠加概念
 * - muted 静音控制
 *
 * 实际音频播放需要将文件放入 public/ 目录，此处展示可视化效果
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BAR_COUNT = 32;

export const AudioDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 模拟频谱数据（正弦波组合）
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
    const base = Math.sin((frame * 0.12) + i * 0.3) * 0.3 + 0.5;
    const wave = Math.sin((frame * 0.06) + i * 0.7) * 0.2;
    const pulse = Math.sin((frame * 0.03) + i * 0.1) > 0.5 ? 0.15 : 0;
    return Math.max(0.05, Math.min(1, base + wave + pulse));
  });

  // 模拟音量曲线
  const volumeFadeIn = interpolate(frame, [0, 1 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });
  const volumeFadeOut = interpolate(
    frame,
    [durationInFrames - 1 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const currentVolume = volumeFadeIn * volumeFadeOut;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "#e5e5e7",
          fontSize: 48,
          fontFamily: "sans-serif",
          marginBottom: 60,
        }}
      >
        音频可视化示例
      </h1>

      {/* 频谱可视化 */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          height: 200,
          padding: "0 40px",
        }}
      >
        {bars.map((value, i) => {
          const height = value * 200 * currentVolume;
          const hue = (i / BAR_COUNT) * 120;
          return (
            <div
              key={i}
              style={{
                width: 16,
                height,
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                borderRadius: 4,
                boxShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.3)`,
              }}
            />
          );
        })}
      </div>

      {/* 音量指示器 */}
      <div style={{ marginTop: 40, display: "flex", gap: 40, alignItems: "center" }}>
        <span style={{ color: "#00ff88", fontSize: 20, fontFamily: "monospace" }}>
          音量: {(currentVolume * 100).toFixed(0)}%
        </span>
        <div
          style={{
            width: 300,
            height: 8,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${currentVolume * 100}%`,
              height: "100%",
              backgroundColor: "#00ff88",
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* API 说明 */}
      <div
        style={{
          marginTop: 40,
          padding: "16px 24px",
          backgroundColor: "rgba(255,255,255,0.03)",
          borderRadius: 8,
          maxWidth: 600,
        }}
      >
        <p style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace", margin: 0 }}>
          实际音频使用方式：
        </p>
        <code
          style={{
            color: "#00ff88",
            fontSize: 13,
            fontFamily: "monospace",
            display: "block",
            marginTop: 8,
            whiteSpace: "pre",
          }}
        >
          {`<Audio src={staticFile("sample.mp3")}
  volume={0.5}
  playbackRate={1.5}
  loop />`}
        </code>
      </div>
    </AbsoluteFill>
  );
};
