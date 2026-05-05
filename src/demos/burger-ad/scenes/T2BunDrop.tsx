/**
 * T2: 面包落下
 *
 * 顶层面包从上方慢动作落下 + 着陆弹跳 + 酱汁滴落
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import {
  BurgerStack,
  TopBun,
  SauceDrip,
} from "../components/BurgerIngredients";
import { BURGER } from "../constants";

export const T2BunDrop: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  // 顶层面包下落（帧 0-30）
  const bunDropProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 弹跳效果（帧 30-45）
  const bounceSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 8, stiffness: 300 },
  });

  // 顶层面包 Y 位置
  const bunTargetY = BURGER.centerY - 32 * 6.5;
  const bunStartY = -200;
  const bunY = interpolate(bunDropProgress, [0, 1], [bunStartY, bunTargetY]);
  const finalBunY = interpolate(bounceSpring, [0, 1], [bunY, bunTargetY]);

  // 酱汁滴落（帧 35+ 开始）
  const sauceDripLength = interpolate(frame, [35, 60], [0, 35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={1} />
      <LensEffects vignetteIntensity={0.5} />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* 已堆叠的食材（不含顶层面包） */}
        <BurgerStack
          x={BURGER.centerX}
          y={BURGER.centerY}
          width={BURGER.ingredientWidth}
          meltAmount={5 + sauceDripLength * 0.1}
        />

        {/* 顶层面包落下 */}
        <TopBun x={BURGER.centerX} y={finalBunY} width={BURGER.ingredientWidth} />

        {/* 酱汁滴落 */}
        {sauceDripLength > 0 && (
          <>
            <SauceDrip
              x={BURGER.centerX - 60}
              startY={finalBunY + 20}
              dripLength={sauceDripLength}
            />
            <SauceDrip
              x={BURGER.centerX + 80}
              startY={finalBunY + 15}
              dripLength={sauceDripLength * 0.7}
            />
            <SauceDrip
              x={BURGER.centerX + 20}
              startY={finalBunY + 25}
              dripLength={sauceDripLength * 0.5}
            />
          </>
        )}
      </svg>
    </AbsoluteFill>
  );
};
