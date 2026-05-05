/**
 * 镜头效果
 *
 * 暗角 + 景深模糊 + 光晕
 */
import React from "react";
import { AbsoluteFill } from "remotion";

export const LensEffects: React.FC<{
  blurAmount?: number; // 背景模糊量
  vignetteIntensity?: number; // 暗角强度 0-1
}> = ({ blurAmount = 0, vignetteIntensity = 0.4 }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 暗角 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 30%,
            rgba(0,0,0,${vignetteIntensity}) 100%
          )`,
        }}
      />

      {/* 可选的镜头光晕 */}
      {blurAmount > 0 && (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${blurAmount}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
