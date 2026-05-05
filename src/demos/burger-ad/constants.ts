/**
 * Terminal Noir 汉堡广告 - 常量定义
 *
 * 时间线、配色方案、食材参数
 */

// ─── 时间线 ────────────────────────────────────
// 15 秒 × 30fps = 450 帧

export const FPS = 30;
export const TOTAL_FRAMES = 450;

export const TIMELINE = [
  { id: "S1", label: "空舞台", startFrame: 0, endFrame: 59 },
  { id: "T1", label: "食材飞入", startFrame: 60, endFrame: 119 },
  { id: "S2", label: "堆叠组装", startFrame: 120, endFrame: 179 },
  { id: "T2", label: "面包落下", startFrame: 180, endFrame: 239 },
  { id: "S3", label: "成品着陆", startFrame: 240, endFrame: 299 },
  { id: "T3", label: "微距推近", startFrame: 300, endFrame: 359 },
  { id: "S4", label: "质感展现", startFrame: 360, endFrame: 404 },
  { id: "T4S5", label: "英雄镜头", startFrame: 405, endFrame: 449 },
] as const;

export type SceneId = (typeof TIMELINE)[number]["id"];

// ─── 配色方案 ──────────────────────────────────

export const COLORS = {
  // 背景
  bgDark: "#0a0a0b",
  bgStone: "#1a1a1f",
  bgElevated: "#131316",

  // 食材霓虹色
  bun: "#ffb800",
  patty: "#ff4757",
  lettuce: "#00ff88",
  cheese: "#ffd166",
  tomato: "#ff6b35",
  onion: "#e0d6ff",
  sauce: "#ff2e63",

  // 效果色
  steam: "rgba(255,255,255,0.15)",
  spotlight: "rgba(255,184,0,0.08)",
  textMuted: "#6b6b76",
  textPrimary: "#e5e5e7",
} as const;

// ─── 发光效果 ──────────────────────────────────

export const glowStyle = (color: string, intensity = 8) =>
  `drop-shadow(0 0 ${intensity}px ${color}80) drop-shadow(0 0 ${intensity * 2}px ${color}40)`;

// ─── 食材定义 ──────────────────────────────────

export const INGREDIENTS = [
  { id: "bottomBun", name: "底层面包", color: COLORS.bun, yOffset: 0, height: 40 },
  { id: "patty", name: "肉饼", color: COLORS.patty, yOffset: -50, height: 30 },
  { id: "cheese", name: "芝士", color: COLORS.cheese, yOffset: -90, height: 20 },
  { id: "lettuce", name: "生菜", color: COLORS.lettuce, yOffset: -120, height: 25 },
  { id: "tomato", name: "番茄", color: COLORS.tomato, yOffset: -155, height: 20 },
  { id: "onion", name: "洋葱", color: COLORS.onion, yOffset: -185, height: 18 },
  { id: "topBun", name: "顶层面包", color: COLORS.bun, yOffset: -220, height: 45 },
] as const;

// ─── 汉堡尺寸 ──────────────────────────────────

export const BURGER = {
  centerX: 960, // 1920/2
  centerY: 600, // 偏下
  width: 320,
  ingredientWidth: 280,
};
