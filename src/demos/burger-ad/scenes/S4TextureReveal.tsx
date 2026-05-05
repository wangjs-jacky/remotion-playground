/**
 * S4: 质感展现
 *
 * 发光轮廓线逐一高亮每种食材描边
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SpotlightEffect } from "../components/SpotlightEffect";
import { LensEffects } from "../components/LensEffects";
import { SteamParticles } from "../components/SteamParticles";
import { BurgerStack } from "../components/BurgerIngredients";
import { BURGER } from "../constants";

// 高亮顺序和时序
const HIGHLIGHT_SEQUENCE = [
  { id: "topBun", label: "面包纹理", startFrame: 0 },
  { id: "patty", label: "肉饼烤痕", startFrame: 11 },
  { id: "cheese", label: "芝士光泽", startFrame: 22 },
  { id: "lettuce", label: "生菜叶脉", startFrame: 33 },
];

export const S4TextureReveal: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  // 计算当前高亮列表
  const highlightIds = HIGHLIGHT_SEQUENCE.filter(
    ({ startFrame }) => frame >= startFrame
  ).map(({ id }) => id);

  return (
    <AbsoluteFill>
      <Background frame={30} opacity={1} />
      <SpotlightEffect frame={30} durationInFrames={durationInFrames} intensity={1.3} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transform: "scale(2.2) translateY(-90px)",
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
            highlightIds={highlightIds}
            meltAmount={12}
          />
        </svg>
      </div>

      <SteamParticles localFrame={frame + 80} startY={BURGER.centerY - 260} scale={0.8} />
      <LensEffects vignetteIntensity={0.5} />
    </AbsoluteFill>
  );
};
