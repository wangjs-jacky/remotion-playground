/**
 * GIF / 动图示例
 *
 * 展示内容：
 * - <AnimatedImage> 组件（推荐）
 * - <Gif> 组件（备选）
 * - playbackRate 控制速度
 * - loopBehavior 循环行为
 * - fit 缩放模式
 */
import React from "react";
import {
  AbsoluteFill,
  AnimatedImage,
  staticFile,
} from "remotion";

export const GifDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
      }}
    >
      <h1 style={{ color: "#e5e5e7", fontSize: 48, fontFamily: "sans-serif" }}>
        GIF / 动图示例
      </h1>

      <div style={{ display: "flex", gap: 40 }}>
        {/* 正常速度 */}
        <div style={{ textAlign: "center" }}>
          {/* 需要放入 public/animation.gif */}
          <AnimatedImage
            src={staticFile("animation.gif")}
            width={300}
            height={300}
            fit="contain"
            loopBehavior="loop"
            style={{ borderRadius: 16, backgroundColor: "#131316" }}
          />
          <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace", marginTop: 12 }}>
            正常速度
          </span>
        </div>

        {/* 2 倍速 */}
        <div style={{ textAlign: "center" }}>
          <AnimatedImage
            src={staticFile("animation.gif")}
            width={300}
            height={300}
            fit="contain"
            playbackRate={2}
            style={{ borderRadius: 16, backgroundColor: "#131316" }}
          />
          <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace", marginTop: 12 }}>
            2x 速度
          </span>
        </div>

        {/* 播放一次 */}
        <div style={{ textAlign: "center" }}>
          <AnimatedImage
            src={staticFile("animation.gif")}
            width={300}
            height={300}
            fit="contain"
            loopBehavior="pause-after-finish"
            style={{ borderRadius: 16, backgroundColor: "#131316" }}
          />
          <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace", marginTop: 12 }}>
            播放一次
          </span>
        </div>
      </div>

      <div style={{ color: "#6b6b76", fontSize: 16, fontFamily: "monospace" }}>
        将 animation.gif 放入 public/ 目录
      </div>
    </AbsoluteFill>
  );
};
