/**
 * Terminal Noir 汉堡广告 - Composition 入口
 *
 * 15 秒 × 30fps = 450 帧
 * 1920 × 1080
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneManager } from "./SceneManager";

export const BurgerAdDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0b" }}>
      <SceneManager />
    </AbsoluteFill>
  );
};
