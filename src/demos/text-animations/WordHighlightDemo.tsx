/**
 * 文字高亮动画示例
 *
 * 展示内容：
 * - 模拟荧光笔高亮效果
 * - 逐词高亮动画
 * - 背景色从左到右展开
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const WORDS = [
  "Remotion",
  "是",
  "一个",
  "React",
  "视频",
  "框架",
  "让你",
  "用",
  "代码",
  "创造",
  "视频",
];

// 每个词高亮的间隔帧数
const HIGHLIGHT_INTERVAL = 8;

export const WordHighlightDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
      }}
    >
      <h1 style={{ color: "#6b6b76", fontSize: 24, fontFamily: "monospace", marginBottom: 60 }}>
        文字高亮效果 Word Highlight
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
          maxWidth: 1200,
        }}
      >
        {WORDS.map((word, i) => {
          // 每个词的高亮时间窗口
          const highlightStart = i * HIGHLIGHT_INTERVAL + 1 * fps;
          const highlightEnd = highlightStart + 12;

          // 高亮进度 0 → 1
          const progress = interpolate(
            frame,
            [highlightStart, highlightEnd],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // 背景色展开宽度
          const bgWidth = progress * 100;

          // 文字颜色变化
          const textColor = progress > 0.5 ? "#0a0a0b" : "#e5e5e7";

          return (
            <div
              key={i}
              style={{
                position: "relative",
                fontSize: 56,
                fontWeight: "bold",
                fontFamily: "sans-serif",
                padding: "4px 12px",
                color: textColor,
              }}
            >
              {/* 高亮背景层 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${bgWidth}%`,
                  height: "100%",
                  backgroundColor: "#00ff88",
                  borderRadius: 4,
                }}
              />
              {/* 文字层 */}
              <span style={{ position: "relative", zIndex: 1 }}>{word}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
