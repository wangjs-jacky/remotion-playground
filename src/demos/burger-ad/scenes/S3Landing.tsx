/**
 * S3: 成品着陆
 *
 * 完整汉堡整体下沉着陆 + 蒸汽升起 + 聚光灯增强
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import { SteamParticles } from "../components/SteamParticles";
import { BurgerStack } from "../components/BurgerIngredients";
import { BURGER } from "../constants";

export const S3Landing: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  // 着陆下沉弹跳
  const landingSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const offsetY = interpolate(landingSpring, [0, 1], [-15, 0]);

  // 蒸汽从帧 20 开始
  const steamFrame = Math.max(0, frame - 20);

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={1.2} />
      <LensEffects vignetteIntensity={0.4} />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <g style={{ transform: `translateY(${offsetY}px)` }}>
          <BurgerStack
            x={BURGER.centerX}
            y={BURGER.centerY}
            width={BURGER.ingredientWidth}
            meltAmount={8}
          />
        </g>
      </svg>

      {/* 蒸汽粒子 */}
      <SteamParticles localFrame={steamFrame} startY={BURGER.centerY - 220} />
    </AbsoluteFill>
  );
};
