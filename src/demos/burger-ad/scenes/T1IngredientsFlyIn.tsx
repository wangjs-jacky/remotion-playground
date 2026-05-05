/**
 * T1: 食材飞入
 *
 * 6 种食材从画面四角飞入中心，弧形运动 + 发光残影
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import {
  BottomBun,
  Patty,
  Cheese,
  Lettuce,
  Tomato,
  Onion,
  TopBun,
} from "../components/BurgerIngredients";
import { BURGER, COLORS, glowStyle } from "../constants";

// 食材飞入顺序和起始位置
const FLY_ITEMS = [
  { id: "bottomBun", Component: BottomBun, startX: -200, startY: 900, delay: 0 },
  { id: "patty", Component: Patty, startX: 2100, startY: -100, delay: 5 },
  { id: "cheese", Component: Cheese, startX: -300, startY: -150, delay: 10 },
  { id: "lettuce", Component: Lettuce, startX: 2200, startY: 800, delay: 15 },
  { id: "tomato", Component: Tomato, startX: -250, startY: 850, delay: 20 },
  { id: "onion", Component: Onion, startX: 2100, startY: -100, delay: 25 },
];

// 目标位置（堆叠 Y 坐标）
const TARGET_Y: Record<string, number> = {
  bottomBun: BURGER.centerY,
  patty: BURGER.centerY - 32,
  cheese: BURGER.centerY - 64,
  lettuce: BURGER.centerY - 96,
  tomato: BURGER.centerY - 128,
  onion: BURGER.centerY - 160,
};

export const T1IngredientsFlyIn: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={0.8} />
      <LensEffects vignetteIntensity={0.5} />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {FLY_ITEMS.map(({ id, Component, startX, startY, delay }) => {
          const localFrame = Math.max(0, frame - delay);
          const flyDuration = 30; // 飞入持续 30 帧

          // 进度 0→1
          const progress = interpolate(localFrame, [0, flyDuration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // 弧形路径（贝塞尔）
          const t = progress;
          const currentX = startX + (BURGER.centerX - startX) * t;
          const arcHeight = -150 * Math.sin(t * Math.PI); // 弧形高度
          const currentY = startY + (TARGET_Y[id] - startY) * t + arcHeight;

          // 残影透明度
          const trailOpacity = interpolate(localFrame, [0, flyDuration, flyDuration + 20], [0.6, 0.3, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={id}>
              {/* 残影 - 起始位置 */}
              {progress < 1 && (
                <g style={{ opacity: trailOpacity }} filter={glowStyle(COLORS.bun, 12)}>
                  <Component x={startX} y={startY} width={BURGER.ingredientWidth} />
                </g>
              )}

              {/* 飞行中的食材 */}
              <g style={{ opacity: progress > 0 ? 1 : 0 }}>
                <Component x={currentX} y={currentY} width={BURGER.ingredientWidth} />
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
