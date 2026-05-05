/**
 * T3: 微距推近
 *
 * 摄像机推近（scale 1→2.5），聚焦芝士/肉饼区域
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import { SteamParticles } from "../components/SteamParticles";
import { BurgerStack } from "../components/BurgerIngredients";
import { BURGER } from "../constants";

export const T3MacroPush: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  // 推近缩放 1.0 → 2.5
  const scale = interpolate(frame, [0, durationInFrames], [1.0, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 聚焦到芝士/肉饼区域（中心偏上）
  const translateY = interpolate(frame, [0, durationInFrames], [0, -100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 芝士融化增强
  const meltAmount = interpolate(frame, [0, durationInFrames], [8, 20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 背景模糊随推近增强
  const bgBlur = interpolate(frame, [0, durationInFrames], [0, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={1.2} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "50% 45%",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <BurgerStack
            x={BURGER.centerX}
            y={BURGER.centerY}
            width={BURGER.ingredientWidth}
            meltAmount={meltAmount}
          />
        </svg>
      </div>

      {/* 蒸汽（微距尺度更大更慢） */}
      <SteamParticles localFrame={frame + 40} startY={BURGER.centerY - 240} scale={scale * 0.4} />

      <LensEffects blurAmount={bgBlur} vignetteIntensity={0.6} />
    </AbsoluteFill>
  );
};
