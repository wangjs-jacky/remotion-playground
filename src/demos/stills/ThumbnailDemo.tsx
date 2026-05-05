/**
 * 静态图（Still）示例
 *
 * 展示内容：
 * - <Still> 组件用于生成单帧图片
 * - 缩略图、封面图等静态内容
 * - 使用 useCurrentFrame 不需要动画时
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
} from "remotion";

export const ThumbnailDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 24,
          background: "linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 50%, #16213e 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          border: "2px solid rgba(0, 255, 136, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#00ff88",
            fontSize: 64,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        >
          Remotion Demo
        </h1>
        <p
          style={{
            color: "#6b6b76",
            fontSize: 28,
            fontFamily: "monospace",
          }}
        >
          使用 React 创建视频
        </p>
        <div
          style={{
            marginTop: 20,
            padding: "12px 32px",
            backgroundColor: "rgba(0, 255, 136, 0.1)",
            borderRadius: 30,
            border: "1px solid rgba(0, 255, 136, 0.3)",
          }}
        >
          <span style={{ color: "#00ff88", fontSize: 20, fontFamily: "monospace" }}>
            查看示例
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
