/**
 * 参数化视频示例
 *
 * 展示内容：
 * - z.object() 定义参数 schema
 * - zColor() 颜色选择器
 * - defaultProps 默认值
 * - 侧边栏实时编辑参数
 * - calculateMetadata 动态元数据
 */
import React from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 定义参数 schema（可在 Remotion Studio 侧边栏编辑）
export const ParameterizedSchema = z.object({
  title: z.string().describe("标题文字"),
  subtitle: z.string().describe("副标题文字"),
  bgColor: zColor().describe("背景颜色"),
  textColor: zColor().describe("文字颜色"),
});

// 从 schema 推断类型
type ParameterizedProps = z.infer<typeof ParameterizedSchema>;

export const ParameterizedDemo: React.FC<ParameterizedProps> = ({
  title,
  subtitle,
  bgColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 标题 spring 入场
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // 副标题延迟入场
  const subtitleProgress = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });

  // 背景脉冲效果
  const pulse = interpolate(
    frame,
    [0, 2 * fps, 3 * fps],
    [0, 0.05, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 脉冲叠加层 */}
      <AbsoluteFill
        style={{
          backgroundColor: textColor,
          opacity: pulse,
        }}
      />

      <div
        style={{
          transform: `scale(${titleScale})`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: textColor,
            fontSize: 80,
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        >
          {title}
        </h1>
      </div>

      <div
        style={{
          opacity: subtitleProgress,
          transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
          textAlign: "center",
          marginTop: 20,
        }}
      >
        <p
          style={{
            color: textColor,
            fontSize: 32,
            fontFamily: "sans-serif",
            opacity: 0.7,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 底部提示 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          color: textColor,
          fontSize: 14,
          fontFamily: "monospace",
          opacity: 0.3,
        }}
      >
        在 Remotion Studio 侧边栏编辑参数实时预览
      </div>
    </AbsoluteFill>
  );
};
