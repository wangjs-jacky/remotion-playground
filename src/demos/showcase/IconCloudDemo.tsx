import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

// ── 可配置参数 Schema ────────────────────────────────────────────
export const IconCloudSchema = z.object({
  cardSize: z.number().min(60).max(220).default(110),
  sphereRadius: z.number().min(150).max(700).default(380),
  rotationSpeed: z.number().min(0.1).max(4.0).default(1.0),
  cardOpacity: z.number().min(0.2).max(1.0).default(0.9),
  perspectiveDepth: z.number().min(500).max(3000).default(1300),
  tiltAngle: z.number().min(0).max(70).default(20),
});

export type IconCloudProps = z.infer<typeof IconCloudSchema>;

// ── AI 工具图标数据 ──────────────────────────────────────────────
type IconDef = {
  name: string;
  cardBg: string;
  symbol: string;
  fg: string;
  fs: number; // font-size ratio relative to card size
  fw: string;
};

const ICONS: IconDef[] = [
  { name: "ChatGPT",     cardBg: "#FFFFFF", symbol: "⊕",  fg: "#000000", fs: 0.44, fw: "600" },
  { name: "Gemini",      cardBg: "#FFFFFF", symbol: "✦",  fg: "#5D6CE2", fs: 0.52, fw: "700" },
  { name: "Claude",      cardBg: "#D97757", symbol: "A",  fg: "#FFFFFF", fs: 0.50, fw: "800" },
  { name: "Perplexity",  cardBg: "#1C1C1E", symbol: "◈",  fg: "#FFFFFF", fs: 0.46, fw: "600" },
  { name: "Meta AI",     cardBg: "#FFFFFF", symbol: "AI", fg: "#0064E1", fs: 0.32, fw: "900" },
  { name: "ElevenLabs",  cardBg: "#0A0A0A", symbol: "11", fg: "#FFFFFF", fs: 0.42, fw: "800" },
  { name: "Suno",        cardBg: "#0D0D0D", symbol: "♫",  fg: "#FF4081", fs: 0.50, fw: "400" },
  { name: "Midjourney",  cardBg: "#FFFFFF", symbol: "Mj", fg: "#000000", fs: 0.38, fw: "600" },
  { name: "Runway",      cardBg: "#111111", symbol: "▶",  fg: "#FFFFFF", fs: 0.46, fw: "400" },
  { name: "Pika",        cardBg: "#5956E9", symbol: "P",  fg: "#FFFFFF", fs: 0.50, fw: "700" },
  { name: "Copilot",     cardBg: "#FFFFFF", symbol: "◎",  fg: "#000000", fs: 0.46, fw: "400" },
  { name: "Cursor",      cardBg: "#0D0D0D", symbol: "↗",  fg: "#3AEFB2", fs: 0.50, fw: "400" },
  { name: "Grok",        cardBg: "#000000", symbol: "G",  fg: "#FFFFFF", fs: 0.52, fw: "700" },
  { name: "HuggingFace", cardBg: "#FFD21E", symbol: "HF", fg: "#000000", fs: 0.36, fw: "800" },
  { name: "Notion AI",   cardBg: "#FFFFFF", symbol: "N",  fg: "#000000", fs: 0.52, fw: "700" },
  { name: "Firefly",     cardBg: "#FA0F00", symbol: "Ff", fg: "#FFFFFF", fs: 0.38, fw: "700" },
  { name: "Cohere",      cardBg: "#39594A", symbol: "C",  fg: "#FFFFFF", fs: 0.52, fw: "700" },
  { name: "Mistral",     cardBg: "#F56800", symbol: "M",  fg: "#FFFFFF", fs: 0.50, fw: "700" },
  { name: "Stability",   cardBg: "#7B2FBE", symbol: "SD", fg: "#FFFFFF", fs: 0.38, fw: "700" },
  { name: "Kling",       cardBg: "#F0F0F0", symbol: "K",  fg: "#000000", fs: 0.52, fw: "700" },
  { name: "Luma",        cardBg: "#0D0D0D", symbol: "L",  fg: "#FFFFFF", fs: 0.52, fw: "700" },
  { name: "Leonardo",    cardBg: "#181818", symbol: "L·", fg: "#FFFFFF", fs: 0.40, fw: "700" },
  { name: "Canva AI",    cardBg: "#00C4CC", symbol: "C",  fg: "#FFFFFF", fs: 0.52, fw: "700" },
  { name: "Gemma",       cardBg: "#4285F4", symbol: "G",  fg: "#FFFFFF", fs: 0.52, fw: "700" },
];

const N = ICONS.length; // 24
// Fibonacci 球面分布：黄金角，每步旋转约 137.5°，确保均匀铺满球面
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.3998 rad

// ── 主组件 ────────────────────────────────────────────────────────
export const IconCloudDemo: React.FC<IconCloudProps> = ({
  cardSize = 110,
  sphereRadius = 380,
  rotationSpeed = 1.0,
  cardOpacity = 0.9,
  perspectiveDepth = 1300,
  tiltAngle = 20,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const tiltRad = (tiltAngle * Math.PI) / 180;
  // speed=1 → 绕 Y 轴一圈 20 秒
  const rotY = (frame / (30 * 20)) * rotationSpeed * Math.PI * 2;

  const cards = Array.from({ length: N }, (_, i) => {
    // ── Fibonacci 球面分布（静态位置）──
    const y0 = 1 - (i / (N - 1)) * 2;           // Y 从 +1 到 -1（极点到极点）
    const r0 = Math.sqrt(Math.max(0, 1 - y0 * y0)); // 该纬度圈半径
    const phi = GOLDEN_ANGLE * i;                 // 黄金角累积，确保均匀分布

    let x = r0 * Math.cos(phi) * sphereRadius;
    let y = y0 * sphereRadius;
    let z = r0 * Math.sin(phi) * sphereRadius;

    // ── 绕 Y 轴旋转（整球自转动画）──
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    x = x1;
    z = z1;

    // ── 绕 X 轴倾斜（相机俯视角）──
    const cosT = Math.cos(tiltRad);
    const sinT = Math.sin(tiltRad);
    const y2 = y * cosT - z * sinT;
    const z2 = y * sinT + z * cosT;

    // ── 透视投影 ──
    const d = perspectiveDepth / (perspectiveDepth + z2);
    const sx = width / 2 + x * d;
    const sy = height / 2 + y2 * d;

    // 深度渐隐：球背面更透明
    const depthFade = Math.max(0.15, Math.min(1, d * 0.9 + 0.1));

    return { sx, sy, scale: d, z: z2, depthFade, iconIndex: i };
  });

  // 由远到近排序，确保近处卡片覆盖远处（painter's algorithm）
  cards.sort((a, b) => a.z - b.z);

  return (
    // 无背景色 → 透明背景，渲染时加 --transparent 参数
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {cards.map(({ sx, sy, scale, depthFade, iconIndex }, idx) => {
        const icon = ICONS[iconIndex];
        const sz = cardSize * scale;
        const opacity = cardOpacity * depthFade;

        return (
          <div
            key={`card-${iconIndex}`}
            style={{
              position: "absolute",
              left: sx - sz / 2,
              top: sy - sz / 2,
              width: sz,
              height: sz,
              borderRadius: sz * 0.22,
              background: icon.cardBg,
              opacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 ${sz * 0.04}px ${sz * 0.18}px rgba(0,0,0,0.16)`,
              border: `${Math.max(0.5, sz * 0.012)}px solid rgba(255,255,255,0.55)`,
              overflow: "hidden",
              zIndex: idx,
            }}
          >
            <span
              style={{
                color: icon.fg,
                fontSize: Math.max(8, sz * icon.fs),
                fontWeight: icon.fw as React.CSSProperties["fontWeight"],
                lineHeight: 1,
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                userSelect: "none",
                letterSpacing: "-0.02em",
              }}
            >
              {icon.symbol}
            </span>
          </div>
        );
      })}
    </div>
  );
};
