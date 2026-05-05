/**
 * T4+S5: 英雄镜头
 *
 * T4: 快速拉远（scale 2.2→1.0）+ 运动模糊
 * S5: 完整汉堡居中，全聚光灯，所有轮廓线亮起，定格呼吸
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import { SteamParticles } from "../components/SteamParticles";
import { BurgerStack } from "../components/BurgerIngredients";
import { BURGER, INGREDIENTS } from "../constants";

export const T4S5HeroShot: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  // T4 阶段（帧 0-15）：快速拉远
  const t4Scale = interpolate(frame, [0, 15], [2.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // S5 阶段（帧 15+）：定格呼吸
  const breathScale = frame >= 15
    ? 1.0 + 0.02 * Math.sin((frame - 15) * 0.15)
    : 1.0;

  const finalScale = frame < 15 ? t4Scale : breathScale;

  // 运动模糊效果（T4 阶段）
  const motionBlur = interpolate(frame, [0, 15], [3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 所有食材高亮（S5 阶段）
  const allHighlightIds = frame >= 15
    ? INGREDIENTS.map((ing) => ing.id)
    : [];

  // 聚光灯最终亮度
  const spotlightIntensity = interpolate(frame, [0, 15, durationInFrames], [1.0, 1.5, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={spotlightIntensity} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: `scale(${finalScale})`,
          transformOrigin: "50% 50%",
          filter: motionBlur > 0 ? `blur(${motionBlur}px)` : undefined,
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
            highlightIds={allHighlightIds}
            meltAmount={10}
          />
        </svg>
      </div>

      <SteamParticles localFrame={frame + 100} startY={BURGER.centerY - 220} />
      <LensEffects vignetteIntensity={0.4} />
    </AbsoluteFill>
  );
};
