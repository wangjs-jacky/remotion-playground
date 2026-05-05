/**
 * 聚光灯效果
 *
 * 琥珀色暖光聚光灯，从顶部投射
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../constants";

export const SpotlightEffect: React.FC<{
  frame: number;
  durationInFrames: number;
  intensity?: number; // 0-1，亮度倍率
}> = ({ frame, durationInFrames, intensity = 1 }) => {
  const spotlightProgress = interpolate(
    frame,
    [0, Math.min(30, durationInFrames * 0.5)],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const baseIntensity = spotlightProgress * intensity;

  return (
    <AbsoluteFill>
      {/* 聚光灯锥形光 */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 1200,
          background: `conic-gradient(
            from 170deg at 50% 0%,
            transparent 0deg,
            rgba(255,184,0,${0.06 * baseIntensity}) 20deg,
            rgba(255,184,0,${0.12 * baseIntensity}) 30deg,
            rgba(255,184,0,${0.06 * baseIntensity}) 40deg,
            transparent 60deg
          )`,
        }}
      />

      {/* 中心光斑 */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 300,
          borderRadius: "50%",
          background: `radial-gradient(
            ellipse at center,
            rgba(255,184,0,${0.08 * baseIntensity}) 0%,
            rgba(255,184,0,${0.03 * baseIntensity}) 40%,
            transparent 70%
          )`,
          filter: `blur(40px)`,
        }}
      />
    </AbsoluteFill>
  );
};
