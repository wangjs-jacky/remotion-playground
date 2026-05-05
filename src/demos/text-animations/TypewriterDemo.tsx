/**
 * 打字机效果示例
 *
 * 展示内容：
 * - 字符串切片实现逐字出现
 * - 闪烁光标效果
 * - 分段文字 + 间隔停顿
 * - 使用 string slicing（不使用逐字 opacity）
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const LINES = [
  "用 React 创建视频",
  "每一帧都是组件",
  "Remotion 让视频编程成为可能",
];

// 每行文字的打字速度（每秒多少个字符）
const CHARS_PER_SECOND = 10;

export const TypewriterDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 计算每行的起止帧
  let currentFrame = 0;
  const lineTimings = LINES.map((line) => {
    const typingDuration = Math.ceil((line.length / CHARS_PER_SECOND) * fps);
    const pauseDuration = Math.ceil(0.5 * fps); // 每行打完后停顿 0.5 秒
    const start = currentFrame;
    const typingEnd = start + typingDuration;
    const end = typingEnd + pauseDuration;
    currentFrame = end;
    return { start, typingEnd, end };
  });

  // 光标闪烁（每秒闪 2 次）
  const cursorVisible = Math.floor(frame / (fps / 2)) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <h1 style={{ color: "#6b6b76", fontSize: 24, fontFamily: "monospace", marginBottom: 40 }}>
        打字机效果 Typewriter
      </h1>

      {LINES.map((line, i) => {
        const { start, typingEnd } = lineTimings[i];

        // 计算当前行已显示的字符数
        const charsVisible = interpolate(
          frame,
          [start, typingEnd],
          [0, line.length],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        // 当前行的文字（使用字符串切片）
        const visibleText = line.slice(0, Math.floor(charsVisible));

        // 是否是最后一行（显示光标）
        const isLastLine = i === LINES.length - 1;
        const isTyping = frame >= start && frame <= typingEnd;

        return (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? 64 : 40,
              fontWeight: i === 0 ? "bold" : "normal",
              color: i === 0 ? "#00ff88" : "#e5e5e7",
              fontFamily: "monospace",
            }}
          >
            {visibleText}
            {/* 光标：当前正在打字的行，或最后一行打完后 */}
            {((isTyping || (isLastLine && frame > typingEnd)) && cursorVisible) && (
              <span
                style={{
                  color: "#00ff88",
                  fontWeight: "bold",
                }}
              >
                |
              </span>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
