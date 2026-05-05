/**
 * 字体示例
 *
 * 展示内容：
 * - @remotion/google-fonts 加载 Google 字体
 * - 多字体对比展示
 * - 字重变化
 * - 动态字体大小动画
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadRoboto } from "@remotion/google-fonts/Roboto";
import { loadFont as loadLobster } from "@remotion/google-fonts/Lobster";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

// 加载字体
const montserrat = loadMontserrat("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const roboto = loadRoboto("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const lobster = loadLobster();
const jetbrainsMono = loadJetBrainsMono();

const FONTS = [
  { name: "Montserrat", family: montserrat.fontFamily, sample: "现代无衬线" },
  { name: "Roboto", family: roboto.fontFamily, sample: "经典可读性" },
  { name: "Lobster", family: lobster.fontFamily, sample: "手写装饰" },
  { name: "JetBrains Mono", family: jetbrainsMono.fontFamily, sample: "等宽代码" },
];

export const FontDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 48,
      }}
    >
      <h1
        style={{
          color: "#e5e5e7",
          fontSize: 36,
          fontFamily: montserrat.fontFamily,
          marginBottom: 20,
        }}
      >
        Google Fonts 字体示例
      </h1>

      {FONTS.map((font, i) => {
        const delay = i * 8;
        const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const translateX = interpolate(frame, [delay, delay + 15], [200, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateX(${translateX}px)`,
              display: "flex",
              alignItems: "baseline",
              gap: 24,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontFamily: font.family,
                color: "#00ff88",
                fontWeight: "bold",
                width: 280,
              }}
            >
              {font.name}
            </span>
            <span
              style={{
                fontSize: 32,
                fontFamily: font.family,
                color: "#e5e5e7",
              }}
            >
              {font.sample}
            </span>
            <span
              style={{
                fontSize: 20,
                fontFamily: font.family,
                color: "#6b6b76",
                fontWeight: 400,
              }}
            >
              AaBbCc 你好世界 0123
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
