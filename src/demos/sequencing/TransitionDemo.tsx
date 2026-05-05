/**
 * 场景过渡示例
 *
 * 展示内容：
 * - <TransitionSeries> 过渡系列
 * - fade 淡入淡出
 * - slide 滑动过渡
 * - wipe 擦除过渡
 * - linearTiming / springTiming
 * - 过渡时长对总时长的影响
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

// 场景组件
const Scene: React.FC<{
  bg: string;
  text: string;
  subtext: string;
}> = ({ bg, text, subtext }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = frame < 1 * fps
    ? 0.8 + 0.2 * (frame / (1 * fps))
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        transform: `scale(${scale})`,
      }}
    >
      <h1 style={{ color: "#fff", fontSize: 72, fontFamily: "sans-serif" }}>
        {text}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, fontFamily: "monospace" }}>
        {subtext}
      </p>
    </AbsoluteFill>
  );
};

export const TransitionDemo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* 场景 1 */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <Scene
            bg="#0a0a0b"
            text="Fade 淡入淡出"
            subtext="→ 向右淡入淡出过渡到下一个场景"
          />
        </TransitionSeries.Sequence>

        {/* 淡入淡出过渡 */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* 场景 2 */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <Scene
            bg="#1a1a2e"
            text="Slide 滑动"
            subtext="← 从左滑入过渡"
          />
        </TransitionSeries.Sequence>

        {/* 滑动过渡 */}
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 } })}
        />

        {/* 场景 3 */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <Scene
            bg="#16213e"
            text="Wipe 擦除"
            subtext="→ 擦除过渡到结尾"
          />
        </TransitionSeries.Sequence>

        {/* 擦除过渡 */}
        <TransitionSeries.Transition
          presentation={wipe()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* 场景 4 */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <Scene
            bg="#0f3460"
            text="过渡完成"
            subtext="Fade + Slide + Wipe 三种过渡"
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
