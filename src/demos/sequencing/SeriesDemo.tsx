/**
 * Series 顺序播放示例
 *
 * 展示内容：
 * - <Series> 顺序排列场景
 * - <Series.Sequence> 指定每个场景时长
 * - 场景间无间隙自动衔接
 * - 每个场景内部独立动画
 */
import React from "react";
import {
  AbsoluteFill,
  Series,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 场景 A：标题
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity }}>
        <h1 style={{ color: "#00ff88", fontSize: 80, fontFamily: "sans-serif" }}>
          Series 播放
        </h1>
        <p style={{ color: "#6b6b76", fontSize: 24, fontFamily: "monospace", textAlign: "center" }}>
          场景 A: 标题入场 (45 帧)
        </p>
      </div>
    </AbsoluteFill>
  );
};

// 场景 B：内容
const SceneContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const translateY = interpolate(frame, [0, 1 * fps], [100, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#131316",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ transform: `translateY(${translateY}px)` }}>
        <h2 style={{ color: "#ffb800", fontSize: 64, fontFamily: "sans-serif" }}>
          场景 B: 内容展示
        </h2>
        <p style={{ color: "#e5e5e7", fontSize: 28, fontFamily: "sans-serif" }}>
          自动衔接上一场景 (60 帧)
        </p>
      </div>
    </AbsoluteFill>
  );
};

// 场景 C：结尾
const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 入场
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 退场
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeIn * fadeOut,
      }}
    >
      <h2 style={{ color: "#ff4757", fontSize: 64, fontFamily: "sans-serif" }}>
        场景 C: 结尾
      </h2>
      <p style={{ color: "#6b6b76", fontSize: 24, fontFamily: "monospace" }}>
        最后 45 帧
      </p>
    </AbsoluteFill>
  );
};

export const SeriesDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={45}>
          <SceneTitle />
        </Series.Sequence>
        <Series.Sequence durationInFrames={60}>
          <SceneContent />
        </Series.Sequence>
        <Series.Sequence durationInFrames={45}>
          <SceneOutro />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
