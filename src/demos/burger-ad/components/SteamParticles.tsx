/**
 * 蒸汽粒子动画
 *
 * 半透明白色粒子从汉堡顶部向上飘散
 */
import React from "react";
import { interpolate } from "remotion";
import { BURGER } from "../constants";

interface Particle {
  id: number;
  x: number;
  size: number;
  speed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  delay: number;
}

// 预生成粒子参数（确定性，不随帧变化）
const PARTICLES: Particle[] = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: (Math.sin(i * 2.7) * 0.5 + 0.5) * BURGER.width * 0.6 - BURGER.width * 0.3,
  size: 4 + (Math.cos(i * 1.3) * 0.5 + 0.5) * 12,
  speed: 0.8 + (Math.sin(i * 3.1) * 0.5 + 0.5) * 0.6,
  wobbleAmp: 4 + (Math.cos(i * 2.1) * 0.5 + 0.5) * 8,
  wobbleFreq: 0.03 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.02,
  delay: i * 3,
}));

export const SteamParticles: React.FC<{
  frame?: number;
  localFrame: number; // 场景内帧数
  startY?: number; // 蒸汽起始 Y 坐标
  scale?: number; // 整体缩放
}> = ({ localFrame, startY = BURGER.centerY - 240, scale = 1 }) => {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {PARTICLES.map((p) => {
        const particleFrame = Math.max(0, localFrame - p.delay);
        if (particleFrame <= 0) return null;

        const maxRise = 200 * scale;
        const progress = Math.min(1, (particleFrame * p.speed) / maxRise);

        const y = startY - progress * maxRise;
        const x = BURGER.centerX + p.x + Math.sin(particleFrame * p.wobbleFreq) * p.wobbleAmp;
        const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.15, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size * scale,
              height: p.size * scale,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, transparent 70%)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
};
