import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio, Video } from "@remotion/media";

// ─── 字幕数据 ────────────────────────────────────
const SUBTITLES: { start: number; end: number; text: string }[] = [
  { start: 1, end: 2.2, text: "哈喽哈喽，大家好！" },
  { start: 2.2, end: 8.8, text: "今天分享一个本地使用 Claude Code 的高效经验" },
  { start: 9, end: 14.3, text: "这个经验跟同事讲了以后，他们都觉得非常神奇" },
  { start: 14.4, end: 17, text: "所以我觉得有必要分享一下" },
  { start: 17.3, end: 21.6, text: "一共会用到两个插件" },
  { start: 22.6, end: 29.6, text: "第一个是 create-ai 的 VSCode 插件，可以在插件市场搜索到" },
  { start: 30, end: 32.9, text: "直接在插件市场上搜索即可" },
  { start: 33.6, end: 43.8, text: "还有一个工具是闪电说，帮助你进行快速的语音输入" },
  { start: 44.2, end: 46.4, text: "最后呈现的效果给大家演示一下" },
  { start: 47, end: 48.7, text: "鼠标选择第一个终端" },
  { start: 49.6, end: 50.5, text: "哈喽哈喽，你好" },
  { start: 53.9, end: 57.6, text: "帮我看一下当前项目，是什么项目？" },
  { start: 57.6, end: 58.4, text: "有哪些功能？" },
  { start: 61.9, end: 66.3, text: "帮我看一下我的套餐使用额度是多少？" },
  { start: 69.5, end: 81.2, text: "可以通过语音同时控制 5~6 个 Claude Code 终端，完全语音输入" },
  { start: 81.8, end: 86.6, text: "装了插件后右下角有 Claude 和 Open Code 的按钮" },
  { start: 86.6, end: 88.4, text: "比如同时点六下" },
  { start: 90.2, end: 94, text: "然后直接拖拽过来" },
  { start: 98.5, end: 100.4, text: "最后就形成了这个页面布局" },
  { start: 100.5, end: 102.9, text: "甚至可以开个 Open Code 也可以" },
  { start: 104.3, end: 105, text: "类似这种" },
  { start: 108, end: 110, text: "整个界面都是可以拖拽的" },
  { start: 113.1, end: 115.3, text: "都可以随意调整和拖拽" },
  { start: 116.2, end: 119.5, text: "最后达到自己喜欢的一个布局效果" },
  { start: 121.1, end: 135.9, text: "还有个小技巧：VSCode 可以把终端拖到外面形成独立页面" },
  { start: 137.2, end: 141, text: "跟 VSCode 并排使用，这是个非常有意思的技巧" },
];

// ─── 辅助函数 ─────────────────────────────────────
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const progressBetween = (
  frame: number,
  start: number,
  end: number,
  easing: (v: number) => number = Easing.linear,
) => {
  if (start === end) return frame >= end ? 1 : 0;
  const raw = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return easing(clamp01(raw));
};

// ─── 字幕组件 ─────────────────────────────────────
const Subtitle: React.FC<{
  text: string;
  progress: number;
  fadeOut: number;
}> = ({ text, progress, fadeOut }) => {
  const opacity = interpolate(
    fadeOut,
    [0, 1],
    [
      interpolate(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]),
      0,
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const translateY = interpolate(progress, [0, 0.15, 0.85, 1], [30, 0, 0, -20]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          padding: "14px 36px",
          borderRadius: 14,
          background: "rgba(0, 0, 0, 0.72)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
          color: "#f0f0f2",
          fontSize: 38,
          fontWeight: 600,
          fontFamily: "'DM Sans', 'PingFang SC', sans-serif",
          whiteSpace: "nowrap",
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ─── 主组件 ───────────────────────────────────────
export const VideoRotationDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ 动画阶段 ═══
  // 阶段1: 开场旋转入场 (0 ~ 2s)
  const introSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 },
  });

  // 阶段2: 微妙的浮动呼吸 (全程)
  const breathX = Math.sin(frame * 0.025) * 1.5;
  const breathY = Math.cos(frame * 0.018) * 1.0;

  // 阶段3: 场景间旋转切换 (适配 141s 视频)
  const sceneRotations = [
    { start: 0, from: -28, to: -2 },       // 入场
    { start: 70, from: -2, to: 6 },         // ~2.3s
    { start: 250, from: 6, to: -4 },        // ~8.3s
    { start: 500, from: -4, to: 8 },        // ~16.7s
    { start: 900, from: 8, to: -5 },        // ~30s
    { start: 1350, from: -5, to: 7 },       // ~45s
    { start: 1800, from: 7, to: -4 },       // ~60s
    { start: 2250, from: -4, to: 6 },       // ~75s
    { start: 2700, from: 6, to: -5 },       // ~90s
    { start: 3150, from: -5, to: 7 },       // ~105s
    { start: 3600, from: 7, to: -3 },       // ~120s
    { start: 3900, from: -3, to: 0 },       // ~130s 回正
  ];

  let rotateY = lerp(-28, -2, introSpring);
  for (let i = sceneRotations.length - 1; i >= 0; i--) {
    const { start, from, to } = sceneRotations[i];
    if (frame >= start) {
      const p = progressBetween(frame, start, start + 45, Easing.out(Easing.cubic));
      rotateY = lerp(from, to, p);
      break;
    }
  }

  // X 轴旋转：开场从俯视角度
  const rotateX = lerp(18, 2, introSpring) + Math.sin(frame * 0.02) * 0.5;

  // Z 轴微旋转
  const rotateZ = Math.sin(frame * 0.015 + 0.8) * 0.4;

  // 缩放：开场 + 微呼吸
  const introScale = lerp(0.6, 0.88, introSpring);
  const breathScale = 1 + Math.sin(frame * 0.03) * 0.005;

  // 结尾淡出 (最后 2 秒)
  const outroProgress = progressBetween(frame, 4170, 4230, Easing.inOut(Easing.cubic));
  const outroRotateY = interpolate(outroProgress, [0, 1], [0, 22]);
  const outroScale = interpolate(outroProgress, [0, 1], [1, 0.7]);
  const outroOpacity = interpolate(outroProgress, [0, 1], [1, 0]);

  const finalRotateX = rotateX;
  const finalRotateY = rotateY + outroRotateY;
  const finalRotateZ = rotateZ;
  const finalScale = introScale * breathScale * outroScale;

  // 位移
  const translateX = Math.sin(frame * 0.012) * 6 + breathX;
  const translateY = Math.cos(frame * 0.01) * 4 + breathY;

  // ═══ 当前字幕 ═══
  const currentSubtitle = SUBTITLES.find(
    (s) => frame >= s.start * fps && frame < s.end * fps,
  );
  const subtitleProgress = currentSubtitle
    ? (frame - currentSubtitle.start * fps) /
      ((currentSubtitle.end - currentSubtitle.start) * fps)
    : 0;

  // 背景光效位移
  const bgShiftX = Math.sin(frame * 0.008) * 100;
  const bgShiftY = Math.cos(frame * 0.01) * 60;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1200px 700px at 25% 20%, rgba(0,212,255,0.14), transparent 55%), " +
          "radial-gradient(900px 600px at 75% 25%, rgba(0,255,136,0.12), transparent 60%), " +
          "linear-gradient(140deg, #060709 0%, #0b1015 45%, #0a0a0b 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 网格背景 */}
      <div
        style={{
          position: "absolute",
          inset: -200,
          transform: `translate(${bgShiftX}px, ${bgShiftY}px)`,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.25,
        }}
      />

      {/* 暗角 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, transparent 25%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* TTS 语音音频 */}
      <Audio src={staticFile("tts-subtitles.mp3")} />

      {/* ═══ 3D 视频容器 ═══ */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1720,
          height: 920,
          transform: [
            `translate(-50%, -50%)`,
            `perspective(2200px)`,
            `rotateX(${finalRotateX}deg)`,
            `rotateY(${finalRotateY}deg)`,
            `rotateZ(${finalRotateZ}deg)`,
            `translate(${translateX}px, ${translateY}px)`,
            `scale(${finalScale})`,
          ].join(" "),
          transformStyle: "preserve-3d",
          borderRadius: 24,
          overflow: "hidden",
          opacity: outroOpacity,
          boxShadow: [
            "0 80px 160px rgba(0,0,0,0.55)",
            "0 24px 48px rgba(0,0,0,0.4)",
            "0 0 0 1px rgba(0,255,136,0.08)",
            "0 0 120px rgba(0,212,255,0.06)",
          ].join(", "),
        }}
      >
        {/* 顶部 Chrome 栏 */}
        <div
          style={{
            height: 52,
            background:
              "linear-gradient(180deg, rgba(30,35,44,0.95) 0%, rgba(18,21,28,0.98) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 7 }}>
            {["#ff5f57", "#ffbd2f", "#28c840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: c,
                  boxShadow: `0 0 10px ${c}55`,
                }}
              />
            ))}
          </div>

          <div
            style={{
              flex: 1,
              height: 32,
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "rgba(229,229,231,0.55)",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ marginRight: 8, color: "#00ff88" }}>🔒</span>
            it-tools.tech
          </div>
        </div>

        {/* 视频内容 */}
        <Video
          src={staticFile("video-1.mp4")}
          style={{
            width: "100%",
            height: 868,
            objectFit: "cover",
            display: "block",
          }}
          muted
        />

        {/* 玻璃高光层 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.08), transparent 22%), " +
              "linear-gradient(305deg, rgba(255,255,255,0.04), transparent 30%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* ═══ 字幕 ═══ */}
      {currentSubtitle && (
        <Subtitle
          text={currentSubtitle.text}
          progress={subtitleProgress}
          fadeOut={outroProgress}
        />
      )}

      {/* 左上角标题 */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 36,
          color: "rgba(229, 236, 246, 0.88)",
          fontSize: 18,
          letterSpacing: 0.5,
          fontWeight: 700,
          opacity: outroOpacity,
        }}
      >
        IT: 工具 · Remotion 旋转展示
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 62,
          color: "rgba(152, 170, 191, 0.75)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          opacity: outroOpacity,
        }}
      >
        intro → rotate → float → rotate → outro
      </div>
    </AbsoluteFill>
  );
};
