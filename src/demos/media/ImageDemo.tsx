/**
 * 图片展示示例
 *
 * 展示内容：
 * - <Img> 组件用法（必须使用 Remotion 的 Img）
 * - staticFile() 引用本地图片
 * - 远程 URL 图片
 * - Ken Burns 效果（缩放 + 平移）
 * - 多图轮播
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

// 模拟图片列表（实际使用时放入 public/ 目录）
const IMAGES = [
  { src: "https://picsum.photos/1920/1080?random=1", alt: "图片 1" },
  { src: "https://picsum.photos/1920/1080?random=2", alt: "图片 2" },
  { src: "https://picsum.photos/1920/1080?random=3", alt: "图片 3" },
];

export const ImageDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0b" }}>
      {IMAGES.map((image, i) => {
        const duration = 2 * fps; // 每张展示 2 秒
        const transitionDuration = 0.5 * fps;

        return (
          <Sequence
            key={i}
            from={i * (duration - transitionDuration)}
            durationInFrames={duration}
            premountFor={transitionDuration}
          >
            <KenBurnsImage src={image.src} alt={image.alt} />
          </Sequence>
        );
      })}

      {/* 底部指示器 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 12,
        }}
      >
        {IMAGES.map((_, i) => {
          const isActive =
            frame >= i * (2 * fps - 0.5 * fps) &&
            frame < (i + 1) * (2 * fps - 0.5 * fps);

          return (
            <div
              key={i}
              style={{
                width: isActive ? 40 : 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: isActive ? "#00ff88" : "rgba(255,255,255,0.2)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Ken Burns 效果：缓慢缩放 + 平移
 */
const KenBurnsImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 缓慢放大 1.0 → 1.3
  const scale = interpolate(frame, [0, 2 * fps], [1.0, 1.3], {
    extrapolateRight: "clamp",
  });

  // 缓慢平移
  const translateX = interpolate(frame, [0, 2 * fps], [0, -50], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
