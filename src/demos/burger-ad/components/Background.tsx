/**
 * 石质纹理背景
 *
 * 深色背景 + 微妙石质纹理图案 + 暗角效果
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../constants";

export const Background: React.FC<{
  frame: number;
  opacity?: number;
}> = ({ frame, opacity: propOpacity }) => {
  const baseOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = propOpacity !== undefined ? propOpacity * baseOpacity : baseOpacity;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* 深黑底色 */}
      <AbsoluteFill style={{ backgroundColor: COLORS.bgDark }} />

      {/* 石质纹理 - 使用 CSS 渐变模拟 */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 50% 80%, ${COLORS.bgStone} 0%, transparent 60%),
            repeating-conic-gradient(rgba(255,255,255,0.01) 0% 25%, transparent 0% 50%) 0 0 / 4px 4px
          `,
        }}
      />

      {/* 暗角效果 */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
