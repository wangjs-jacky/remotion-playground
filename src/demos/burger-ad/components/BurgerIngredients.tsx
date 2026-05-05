/**
 * SVG 食材组件库
 *
 * 每种食材用简化几何形状 + 霓虹发光描边
 */
import React from "react";
import { COLORS, BURGER, glowStyle } from "../constants";

// ─── 通用发光描边属性 ──────────────────────
const glowProps = (color: string) => ({
  stroke: color,
  strokeWidth: 2,
  fill: `${color}22`,
  filter: glowStyle(color, 6),
});

// ─── 底层面包 ──────────────────────────────
export const BottomBun: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const h = 35;
  const props = glowProps(COLORS.bun);
  return (
    <g style={{ opacity: highlight ? 1 : 0.9, transition: "opacity 0.3s" }}>
      <path
        d={`M${x - width / 2} ${y} Q${x - width / 2} ${y + h} ${x} ${y + h} Q${x + width / 2} ${y + h} ${x + width / 2} ${y} Z`}
        {...props}
        strokeWidth={highlight ? 3 : props.strokeWidth}
      />
      {/* 底部平面线 */}
      <line x1={x - width / 2 + 10} y1={y} x2={x + width / 2 - 10} y2={y} stroke={COLORS.bun} strokeWidth={1} opacity={0.5} />
    </g>
  );
};

// ─── 顶层面包 ──────────────────────────────
export const TopBun: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const h = 45;
  const w = width + 20; // 顶层面包稍宽
  const props = glowProps(COLORS.bun);
  return (
    <g style={{ opacity: highlight ? 1 : 0.9 }}>
      <path
        d={`M${x - w / 2} ${y} Q${x - w / 2} ${y - h} ${x} ${y - h} Q${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`}
        {...props}
        strokeWidth={highlight ? 3 : props.strokeWidth}
      />
      {/* 芝麻粒 */}
      {[
        { dx: -40, dy: -20 },
        { dx: -15, dy: -35 },
        { dx: 20, dy: -25 },
        { dx: 45, dy: -15 },
        { dx: 0, dy: -15 },
        { dx: 30, dy: -35 },
      ].map((seed, i) => (
        <ellipse
          key={i}
          cx={x + seed.dx}
          cy={y + seed.dy}
          rx={4}
          ry={2.5}
          fill={COLORS.bun}
          opacity={0.8}
          transform={`rotate(${20 + i * 15}, ${x + seed.dx}, ${y + seed.dy})`}
        />
      ))}
    </g>
  );
};

// ─── 肉饼 ──────────────────────────────
export const Patty: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const h = 25;
  const w = width - 10;
  const props = glowProps(COLORS.patty);
  return (
    <g style={{ opacity: highlight ? 1 : 0.9 }}>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={8}
        {...props}
        strokeWidth={highlight ? 3 : props.strokeWidth}
      />
      {/* 烤痕 */}
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={x - w / 3 + i * (w / 3)}
          y1={y - h / 2 + 5}
          x2={x - w / 3 + i * (w / 3) + 15}
          y2={y + h / 2 - 5}
          stroke={COLORS.patty}
          strokeWidth={1}
          opacity={0.4}
        />
      ))}
    </g>
  );
};

// ─── 芝士 ──────────────────────────────
export const Cheese: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  meltAmount?: number; // 融化下垂量 0-20
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, meltAmount = 0, highlight }) => {
  const w = width + 20; // 芝士比肉饼宽
  const h = 15;
  const props = glowProps(COLORS.cheese);
  return (
    <g style={{ opacity: highlight ? 1 : 0.9 }}>
      {/* 主体 */}
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={3}
        {...props}
        strokeWidth={highlight ? 3 : props.strokeWidth}
      />
      {/* 左侧融化下垂 */}
      {meltAmount > 0 && (
        <path
          d={`M${x - w / 2} ${y + h / 2} Q${x - w / 2 - 5} ${y + h / 2 + meltAmount * 0.5} ${x - w / 2 + 10} ${y + h / 2 + meltAmount}`}
          stroke={COLORS.cheese}
          strokeWidth={2}
          fill="none"
          opacity={0.7}
        />
      )}
      {/* 右侧融化下垂 */}
      {meltAmount > 0 && (
        <path
          d={`M${x + w / 2} ${y + h / 2} Q${x + w / 2 + 5} ${y + h / 2 + meltAmount * 0.7} ${x + w / 2 - 15} ${y + h / 2 + meltAmount * 0.8}`}
          stroke={COLORS.cheese}
          strokeWidth={2}
          fill="none"
          opacity={0.7}
        />
      )}
    </g>
  );
};

// ─── 生菜 ──────────────────────────────
export const Lettuce: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const w = width + 30; // 生菜最宽，溢出
  const props = glowProps(COLORS.lettuce);
  // 不规则波浪形
  const wavePoints = Array.from({ length: 12 }, (_, i) => {
    const px = x - w / 2 + (w / 11) * i;
    const py = y + (i % 2 === 0 ? -8 : 8);
    return `${i === 0 ? "M" : "L"}${px} ${py}`;
  }).join(" ") + ` L${x + w / 2} ${y + 5} L${x - w / 2} ${y + 5} Z`;

  return (
    <g style={{ opacity: highlight ? 1 : 0.9 }}>
      <path d={wavePoints} {...props} strokeWidth={highlight ? 3 : props.strokeWidth} />
    </g>
  );
};

// ─── 番茄 ──────────────────────────────
export const Tomato: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const r = (width - 20) / 2;
  const props = glowProps(COLORS.tomato);
  return (
    <g style={{ opacity: highlight ? 1 : 0.9 }}>
      <ellipse
        cx={x}
        cy={y}
        rx={r}
        ry={10}
        {...props}
        strokeWidth={highlight ? 3 : props.strokeWidth}
      />
      {/* 同心圆纹理 */}
      <ellipse cx={x} cy={y} rx={r * 0.6} ry={6} stroke={COLORS.tomato} strokeWidth={0.5} fill="none" opacity={0.3} />
      <ellipse cx={x} cy={y} rx={r * 0.3} ry={3} stroke={COLORS.tomato} strokeWidth={0.5} fill="none" opacity={0.3} />
    </g>
  );
};

// ─── 洋葱 ──────────────────────────────
export const Onion: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlight?: boolean;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlight }) => {
  const r = (width - 30) / 2;
  return (
    <g style={{ opacity: highlight ? 1 : 0.85 }}>
      {[r, r * 0.7, r * 0.4].map((radius, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={radius}
          ry={8}
          stroke={COLORS.onion}
          strokeWidth={highlight && i === 0 ? 2.5 : 1.5}
          fill={i === 0 ? `${COLORS.onion}15` : "transparent"}
          filter={i === 0 ? glowStyle(COLORS.onion, 4) : undefined}
          opacity={1 - i * 0.2}
        />
      ))}
    </g>
  );
};

// ─── 酱汁滴落 ──────────────────────────────
export const SauceDrip: React.FC<{
  x: number;
  startY: number;
  dripLength: number; // 滴落长度
}> = ({ x, startY, dripLength }) => {
  return (
    <path
      d={`M${x} ${startY} Q${x + 3} ${startY + dripLength * 0.6} ${x - 2} ${startY + dripLength}`}
      stroke={COLORS.sauce}
      strokeWidth={3}
      fill="none"
      strokeLinecap="round"
      filter={glowStyle(COLORS.sauce, 4)}
      opacity={0.8}
    />
  );
};

// ─── 完整汉堡组合 ──────────────────────────────
// 食材从下到上的 Y 间距
const STACK_GAP = 32;

export const BurgerStack: React.FC<{
  x?: number;
  y?: number;
  width?: number;
  highlightIds?: string[]; // 高亮的食材 ID
  meltAmount?: number;
}> = ({ x = BURGER.centerX, y = BURGER.centerY, width = BURGER.ingredientWidth, highlightIds = [], meltAmount = 5 }) => {
  // 从底部往上堆叠
  const layers = [
    { id: "bottomBun", Component: BottomBun, yOff: 0 },
    { id: "patty", Component: Patty, yOff: -STACK_GAP },
    { id: "cheese", Component: Cheese, yOff: -STACK_GAP * 2 },
    { id: "lettuce", Component: Lettuce, yOff: -STACK_GAP * 3 },
    { id: "tomato", Component: Tomato, yOff: -STACK_GAP * 4 },
    { id: "onion", Component: Onion, yOff: -STACK_GAP * 5 },
    { id: "topBun", Component: TopBun, yOff: -STACK_GAP * 6.5 },
  ];

  return (
    <g>
      {layers.map(({ id, Component, yOff }) => {
        // 芝士传入 meltAmount
        if (id === "cheese") {
          return (
            <Component
              key={id}
              x={x}
              y={y + yOff}
              width={width}
              highlight={highlightIds.includes(id)}
              meltAmount={meltAmount}
            />
          );
        }
        return (
          <Component
            key={id}
            x={x}
            y={y + yOff}
            width={width}
            highlight={highlightIds.includes(id)}
          />
        );
      })}
    </g>
  );
};
