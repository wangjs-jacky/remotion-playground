/**
 * S2: 堆叠组装
 *
 * 食材在画面中心垂直堆叠组装，spring 弹跳
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
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
} from "../components/BurgerIngredients";
import { BURGER } from "../constants";

const STACK_ITEMS = [
  { id: "bottomBun", Component: BottomBun, y: BURGER.centerY, delay: 0 },
  { id: "patty", Component: Patty, y: BURGER.centerY - 32, delay: 8 },
  { id: "cheese", Component: Cheese, y: BURGER.centerY - 64, delay: 16 },
  { id: "lettuce", Component: Lettuce, y: BURGER.centerY - 96, delay: 24 },
  { id: "tomato", Component: Tomato, y: BURGER.centerY - 128, delay: 32 },
  { id: "onion", Component: Onion, y: BURGER.centerY - 160, delay: 40 },
];

export const S2Stacking: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={0.9} />
      <LensEffects vignetteIntensity={0.5} />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {STACK_ITEMS.map(({ id, Component, y, delay }) => {
          const localFrame = Math.max(0, frame - delay);

          // spring 弹跳入场
          const springVal = spring({
            frame: localFrame,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          // 从上方落下
          const offsetY = interpolate(springVal, [0, 1], [-80, 0]);

          return (
            <Component
              key={id}
              x={BURGER.centerX}
              y={y + offsetY}
              width={BURGER.ingredientWidth}
              meltAmount={id === "cheese" ? 5 * springVal : undefined}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
