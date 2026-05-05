/**
 * 缩放与旋转动画示例
 *
 * 展示内容：
 * - interpolate 映射到不同属性
 * - scale 缩放动画
 * - rotate 旋转动画
 * - 多属性组合动画
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const ScaleRotateDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 缩放：0 → 1.2 → 1（先放大再回弹）
  const scale = interpolate(frame, [0, 0.5 * fps, 1 * fps], [0, 1.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 旋转：0° → 360°
  const rotation = interpolate(frame, [0, 3 * fps], [0, 360], {
    extrapolateRight: "clamp",
  });

  // 圆角：从 0 到 40
  const borderRadius = interpolate(
    frame,
    [0, 1 * fps],
    [0, 40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 300,
          height: 300,
          backgroundColor: "#00ff88",
          borderRadius,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "#0a0a0b",
            fontFamily: "sans-serif",
          }}
        >
          R
        </span>
      </div>

      {/* 底部提示文字 */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          color: "#6b6b76",
          fontSize: 24,
          fontFamily: "monospace",
        }}
      >
        scale: {scale.toFixed(2)} | rotate: {rotation.toFixed(0)}° | radius: {borderRadius.toFixed(0)}px
      </div>
    </AbsoluteFill>
  );
};
