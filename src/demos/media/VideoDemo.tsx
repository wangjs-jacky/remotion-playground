/**
 * 视频嵌入示例
 *
 * 展示内容：
 * - <Video> 基础用法
 * - trimBefore / trimAfter 裁剪
 * - volume 动态音量
 * - playbackRate 变速
 * - loop 循环播放
 * - Sequence 延迟出现
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";

// 使用 Remotion 官方公开视频
const VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const VideoDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 动态音量：前 1 秒淡入，后 1 秒淡出
  const volume = (f: number) => {
    const fadeIn = interpolate(f, [0, 1 * fps], [0, 1], {
      extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(f, [8 * fps, 10 * fps], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return fadeIn * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0b" }}>
      {/* 主视频 */}
      <Sequence from={0} premountFor={1 * fps}>
        <Video
          src={VIDEO_URL}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          volume={volume}
          // trimBefore={2 * fps}  // 跳过前 2 秒
          // trimAfter={10 * fps}  // 在 10 秒处结束
          // playbackRate={1.5}    // 1.5 倍速
          // loop                  // 循环播放
        />
      </Sequence>

      {/* 底部信息栏 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 40,
          right: 40,
          padding: "16px 24px",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#00ff88", fontSize: 18, fontFamily: "monospace" }}>
          视频示例
        </span>
        <span style={{ color: "#6b6b76", fontSize: 14, fontFamily: "monospace" }}>
          远程视频 + 动态音量淡入淡出
        </span>
        <span style={{ color: "#e5e5e7", fontSize: 14, fontFamily: "monospace" }}>
          音量: {(volume(frame) * 100).toFixed(0)}%
        </span>
      </div>
    </AbsoluteFill>
  );
};
