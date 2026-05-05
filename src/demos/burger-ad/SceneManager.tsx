/**
 * 场景管理器 - 状态机
 *
 * 根据当前帧号判断场景，渲染对应组件
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { TIMELINE, type SceneId } from "./constants";
import { S1EmptyStage } from "./scenes/S1EmptyStage";
import { T1IngredientsFlyIn } from "./scenes/T1IngredientsFlyIn";
import { S2Stacking } from "./scenes/S2Stacking";
import { T2BunDrop } from "./scenes/T2BunDrop";
import { S3Landing } from "./scenes/S3Landing";
import { T3MacroPush } from "./scenes/T3MacroPush";
import { S4TextureReveal } from "./scenes/S4TextureReveal";
import { T4S5HeroShot } from "./scenes/T4S5HeroShot";

// 场景组件映射
const SCENE_MAP: Record<SceneId, React.FC<{ frame: number; durationInFrames: number }>> = {
  S1: S1EmptyStage,
  T1: T1IngredientsFlyIn,
  S2: S2Stacking,
  T2: T2BunDrop,
  S3: S3Landing,
  T3: T3MacroPush,
  S4: S4TextureReveal,
  T4S5: T4S5HeroShot,
};

export const SceneManager: React.FC = () => {
  const frame = useCurrentFrame();

  // 查找当前帧对应的场景
  const currentScene = TIMELINE.find(
    ({ startFrame, endFrame }) => frame >= startFrame && frame <= endFrame
  );

  if (!currentScene) return null;

  const SceneComponent = SCENE_MAP[currentScene.id];
  if (!SceneComponent) return null;

  // 场景内本地帧（从 0 开始）
  const localFrame = frame - currentScene.startFrame;
  const durationInFrames = currentScene.endFrame - currentScene.startFrame + 1;

  return <SceneComponent frame={localFrame} durationInFrames={durationInFrames} />;
};
