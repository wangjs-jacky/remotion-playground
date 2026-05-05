/**
 * S1: 空舞台
 *
 * 纯黑背景，石质表面渐显，聚光灯从中心亮起
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";

export const S1EmptyStage: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  // 石质表面渐显
  const surfaceOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background frame={frame} opacity={surfaceOpacity} />
      <SpotlightEffect frame={frame} durationInFrames={durationInFrames} />
      <LensEffects vignetteIntensity={0.5} />
    </AbsoluteFill>
  );
};
