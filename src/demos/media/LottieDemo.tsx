/**
 * Lottie 动画示例
 *
 * 展示内容：
 * - @remotion/lottie 集成
 * - delayRender / continueRender 等待加载
 * - 远程 Lottie JSON 加载
 * - style 样式控制
 */
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Lottie, LottieAnimationData } from "@remotion/lottie";

export const LottieDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 阻塞渲染直到 Lottie 数据加载完成
  const [handle] = useState(() => delayRender("加载 Lottie 动画数据"));
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    // 使用公开的 Lottie 动画示例
    fetch("https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json")
      .then((res) => res.json())
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  if (!animationData) {
    return null;
  }

  // 整体缩放入场动画
  const scale = interpolate(frame, [0, 1 * fps], [0.5, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ transform: `scale(${scale})`, opacity }}>
        <Lottie
          animationData={animationData}
          style={{ width: 500, height: 500 }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          color: "#6b6b76",
          fontSize: 16,
          fontFamily: "monospace",
        }}
      >
        Lottie 远程动画 + 缩放入场
      </div>
    </AbsoluteFill>
  );
};
