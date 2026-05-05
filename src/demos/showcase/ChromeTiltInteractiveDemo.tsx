import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const URL_TEXT = "https://remotion.dev/chrome-tilt-demo?mode=interactive";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const progressBetween = (
  frame: number,
  start: number,
  end: number,
  easing: ((input: number) => number) = Easing.linear,
) => {
  if (start === end) {
    return frame >= end ? 1 : 0;
  }
  const raw = interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return easing(clamp01(raw));
};

const pulseAt = (frame: number, center: number, radius = 14) => {
  const distance = Math.abs(frame - center);
  return clamp01(1 - distance / radius);
};

const lerp = (from: number, to: number, p: number) => from + (to - from) * p;

export const ChromeTiltInteractiveDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 场景分段时间轴
  const introIn = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 90,
      mass: 0.9,
    },
  });
  const settle = spring({
    frame: frame - 70,
    fps,
    config: {
      damping: 22,
      stiffness: 110,
      mass: 0.9,
    },
  });

  const focusAddressBar = progressBetween(frame, 90, 132, Easing.out(Easing.cubic));
  const typing = progressBetween(frame, 128, 238, Easing.linear);
  const navHover = progressBetween(frame, 242, 270, Easing.out(Easing.quad));
  const scrollPage = progressBetween(frame, 285, 460, Easing.inOut(Easing.cubic));
  const dragSlider = progressBetween(frame, 470, 560, Easing.inOut(Easing.cubic));
  const showPalette = progressBetween(frame, 552, 620, Easing.out(Easing.cubic));
  const outro = progressBetween(frame, 640, 719, Easing.inOut(Easing.cubic));

  const clickA = pulseAt(frame, 132, 10);
  const clickB = pulseAt(frame, 262, 10);
  const clickC = pulseAt(frame, 522, 12);
  const clickD = pulseAt(frame, 597, 10);
  const totalImpact = clickA + clickB + clickC + clickD;

  // 摄像机与浏览器窗口 3D 运动
  const rotateX = lerp(54, 8, introIn) - lerp(0, 4, settle) + Math.sin(frame * 0.032) * 0.7;
  const rotateY =
    lerp(-38, -10, introIn) +
    Math.sin(frame * 0.018 + 1.2) * 1.2 +
    interpolate(outro, [0, 1], [0, 13]);
  const rotateZ = lerp(16, -1.5, introIn) + Math.sin(frame * 0.02 + 2.2) * 0.65;
  const translateX = lerp(680, 0, introIn) + Math.sin(frame * 0.012) * 8;
  const translateY = lerp(300, 8, introIn) - interpolate(scrollPage, [0, 1], [0, 16]);
  const baseScale = lerp(0.55, 0.93, introIn) * lerp(1, 0.88, outro);
  const clickScale = 1 - totalImpact * 0.007;
  const finalScale = baseScale * clickScale;

  // 页面内内容动画
  const typedLength = Math.floor(typing * URL_TEXT.length);
  const typedText = URL_TEXT.slice(0, typedLength);
  const cursorBlink = Math.floor(frame / 10) % 2 === 0;

  const pageScrollY = interpolate(scrollPage, [0, 1], [0, -360]);
  const sliderProgress = dragSlider > 0 ? lerp(0.22, 0.88, dragSlider) : 0.22;
  const sidebarGlow = focusAddressBar * 0.2 + navHover * 0.28;

  // 鼠标路径关键帧
  const cursorFrames = [0, 80, 118, 132, 210, 246, 262, 320, 382, 440, 472, 510, 550, 595, 640, 700, 719];
  const cursorXPoints = [2050, 1540, 980, 980, 1230, 700, 700, 1450, 1450, 1450, 850, 980, 1160, 1050, 980, 1460, 1880];
  const cursorYPoints = [1160, 760, 220, 220, 220, 298, 298, 420, 622, 840, 842, 842, 842, 560, 520, 860, 1220];
  const cursorX = interpolate(frame, cursorFrames, cursorXPoints, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, cursorFrames, cursorYPoints, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 背景光效
  const bgShiftX = Math.sin(frame * 0.008) * 120;
  const bgShiftY = Math.cos(frame * 0.01) * 80;
  const vignetteOpacity = lerp(0.48, 0.74, introIn);

  const timelinePlayhead = sliderProgress;
  const chartWaveA = Math.sin(frame * 0.06) * 0.5 + 0.5;
  const chartWaveB = Math.sin(frame * 0.05 + 0.9) * 0.5 + 0.5;
  const chartWaveC = Math.sin(frame * 0.07 + 1.8) * 0.5 + 0.5;
  const chartBars = [
    lerp(38, 82, chartWaveA * sliderProgress),
    lerp(32, 74, chartWaveB * sliderProgress),
    lerp(44, 90, chartWaveC * sliderProgress),
    lerp(36, 78, chartWaveA * sliderProgress),
    lerp(40, 86, chartWaveB * sliderProgress),
    lerp(28, 70, chartWaveC * sliderProgress),
  ];

  const paletteOpacity = showPalette * (1 - outro * 0.7);
  const paletteOffset = lerp(24, 0, showPalette);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1200px 700px at 20% 15%, rgba(0,212,255,0.20), transparent 55%), radial-gradient(900px 600px at 80% 20%, rgba(0,255,136,0.17), transparent 60%), linear-gradient(140deg, #060709 0%, #0b1015 45%, #0a0a0b 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -200,
          transform: `translate(${bgShiftX}px, ${bgShiftY}px)`,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.28,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            `radial-gradient(circle at 50% 45%, transparent 20%, rgba(0, 0, 0, ${vignetteOpacity}) 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1520,
          height: 920,
          transform: `translate(-50%, -50%) perspective(2200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translate(${translateX}px, ${translateY}px) scale(${finalScale})`,
          transformStyle: "preserve-3d",
          borderRadius: 26,
          overflow: "hidden",
          backgroundColor: "#0d1117",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow:
            "0 100px 180px rgba(0, 0, 0, 0.55), 0 30px 50px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0,255,136,0.08)",
        }}
      >
        {/* Chrome 顶栏 */}
        <div
          style={{
            height: 74,
            background:
              "linear-gradient(180deg, rgba(30,35,44,0.95) 0%, rgba(18,21,28,0.98) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {["#ff5f57", "#ffbd2f", "#28c840"].map((color) => (
              <div
                key={color}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: color,
                  boxShadow: `0 0 14px ${color}66`,
                }}
              />
            ))}
          </div>

          <div
            style={{
              width: 260,
              height: 38,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              color: "rgba(229,229,231,0.66)",
              fontSize: 14,
            }}
          >
            <span style={{ marginRight: 8 }}>◉</span>
            Studio Preview
          </div>

          <div
            style={{
              flex: 1,
              height: 44,
              borderRadius: 12,
              border:
                focusAddressBar > 0
                  ? "1px solid rgba(0, 212, 255, 0.85)"
                  : "1px solid rgba(255,255,255,0.08)",
              background:
                focusAddressBar > 0
                  ? "linear-gradient(90deg, rgba(0,212,255,0.18), rgba(0,255,136,0.08))"
                  : "rgba(255,255,255,0.04)",
              boxShadow:
                focusAddressBar > 0
                  ? "0 0 0 2px rgba(0,212,255,0.18), 0 0 40px rgba(0,212,255,0.20)"
                  : "none",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontFamily: "'JetBrains Mono', monospace",
              color: "#d7dde6",
              fontSize: 16,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            <span style={{ color: "#7de2ff", marginRight: 10 }}>🔒</span>
            <span>{typedText}</span>
            {typing < 1 && cursorBlink ? (
              <span style={{ marginLeft: 2, color: "#00ff88" }}>|</span>
            ) : null}
          </div>
        </div>

        {/* 页面内容区域 */}
        <div
          style={{
            display: "flex",
            height: 846,
            background:
              "linear-gradient(180deg, rgba(13,16,22,1) 0%, rgba(10,12,16,1) 100%)",
          }}
        >
          {/* 侧边栏 */}
          <div
            style={{
              width: 286,
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "24px 16px",
              background:
                `linear-gradient(180deg, rgba(18,24,32,0.75), rgba(9,13,18,0.92)), radial-gradient(circle at 50% 0%, rgba(0,255,136,${sidebarGlow}), transparent 60%)`,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#6b7686",
                letterSpacing: 1.4,
                marginBottom: 16,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              NAVIGATION
            </div>

            {[
              "Overview",
              "Timeline",
              "Interactions",
              "Preview",
              "Render Queue",
            ].map((item, idx) => {
              const isActive = idx === 2;
              const isHover = idx === 2 && navHover > 0;
              const hoverStrength = isHover ? navHover : 0;
              return (
                <div
                  key={item}
                  style={{
                    height: 44,
                    borderRadius: 10,
                    marginBottom: 8,
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: isActive ? "#dffef3" : "#9ba8bb",
                    background: isActive
                      ? `linear-gradient(90deg, rgba(0,255,136,${0.17 + hoverStrength * 0.28}), rgba(0,212,255,${0.08 + hoverStrength * 0.2}))`
                      : "rgba(255,255,255,0.02)",
                    border: isActive
                      ? "1px solid rgba(0,255,136,0.45)"
                      : "1px solid rgba(255,255,255,0.04)",
                    fontSize: 15,
                    transform: isHover ? "translateX(4px)" : "translateX(0px)",
                    boxShadow: isHover ? "0 10px 20px rgba(0,255,136,0.18)" : "none",
                  }}
                >
                  <span>{item}</span>
                  {isActive ? <span style={{ color: "#00ff88" }}>●</span> : null}
                </div>
              );
            })}

            <div
              style={{
                marginTop: 26,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                padding: 14,
                color: "#9aa5b4",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              当前录制模式: <b style={{ color: "#00ff88" }}>Interactive Capture</b>
            </div>
          </div>

          {/* 主内容可滚动区域 */}
          <div
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 0 auto 0",
                transform: `translateY(${pageScrollY}px)`,
                padding: 24,
              }}
            >
              <div
                style={{
                  height: 210,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background:
                    "linear-gradient(115deg, rgba(0,212,255,0.15) 0%, rgba(0,255,136,0.06) 36%, rgba(255,255,255,0.03) 100%)",
                  padding: 24,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    letterSpacing: 1.3,
                    color: "#8d9db2",
                  }}
                >
                  SCENE · CHROME_TILT_INTERACTION
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 44,
                    fontWeight: 700,
                    color: "#ecf3fb",
                    lineHeight: 1.08,
                  }}
                >
                  鼠标轨迹驱动的
                  <br />
                  浏览器交互镜头
                </div>
                <div
                  style={{
                    marginTop: 12,
                    color: "#9db0c7",
                    fontSize: 17,
                  }}
                >
                  结合 3D 倾斜、滚动、拖拽与命令面板，演示可编程 UI 动画链路。
                </div>
              </div>

              <div
                style={{
                  marginTop: 20,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                {[
                  { label: "FPS", value: "30", color: "#00d4ff" },
                  { label: "DURATION", value: "24s", color: "#00ff88" },
                  { label: "LAYERS", value: "38", color: "#ffb800" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "16px 18px",
                    }}
                  >
                    <div style={{ color: "#8a96a8", fontSize: 12 }}>{item.label}</div>
                    <div
                      style={{
                        marginTop: 6,
                        color: item.color,
                        fontSize: 28,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 18,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(3, 7, 12, 0.85)",
                  padding: 16,
                }}
              >
                <div
                  style={{
                    color: "#91a2b6",
                    fontSize: 13,
                    marginBottom: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  app/interactive/sequence.tsx
                </div>
                {[
                  "const pointer = usePointerPath(segments);",
                  "const camera = useTiltCamera({easing: 'spring'});",
                  "playClick('address-bar', {ripple: true});",
                  "startScroll('content-pane', {distance: 360});",
                  "drag('timeline-slider', {to: 0.88});",
                ].map((line, idx) => (
                  <div
                    key={line}
                    style={{
                      color: idx % 2 === 0 ? "#67d3ff" : "#95f5c5",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 15,
                      lineHeight: 1.7,
                      opacity: 0.8 + ((frame + idx * 7) % 28) / 120,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 18,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ color: "#8ea0b4", fontSize: 13, marginBottom: 10 }}>
                    Render Health
                  </div>
                  <div
                    style={{
                      height: 124,
                      borderRadius: 12,
                      background:
                        "linear-gradient(180deg, rgba(0, 212, 255, 0.10), rgba(0, 255, 136, 0.05))",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 8,
                      padding: 12,
                    }}
                  >
                    {chartBars.map((bar, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          height: `${bar}%`,
                          borderRadius: 6,
                          background:
                            idx % 2 === 0
                              ? "linear-gradient(180deg, #00d4ff, #008eff)"
                              : "linear-gradient(180deg, #00ff88, #00b36f)",
                          boxShadow: "0 0 14px rgba(0,255,136,0.25)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ color: "#8ea0b4", fontSize: 13, marginBottom: 10 }}>
                    Timeline Scrubber
                  </div>
                  <div
                    style={{
                      height: 124,
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.3)",
                      padding: 14,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        marginTop: 42,
                        height: 10,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: `${timelinePlayhead * 100}%`,
                          borderRadius: 999,
                          background:
                            "linear-gradient(90deg, rgba(0,212,255,0.95), rgba(0,255,136,0.95))",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: `${timelinePlayhead * 100}%`,
                          top: "50%",
                          width: 22,
                          height: 22,
                          transform: "translate(-50%, -50%)",
                          borderRadius: "50%",
                          backgroundColor: "#f4fffb",
                          border: "2px solid #00ff88",
                          boxShadow: "0 0 20px rgba(0,255,136,0.55)",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: 20,
                        color: "#9fb0c4",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 13,
                      }}
                    >
                      progress = {Math.round(timelinePlayhead * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧滚动条 */}
            <div
              style={{
                position: "absolute",
                top: 22,
                right: 10,
                width: 8,
                height: 800,
                borderRadius: 99,
                background: "rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: `${16 + scrollPage * 600}px`,
                  left: 0,
                  right: 0,
                  height: 110,
                  borderRadius: 99,
                  background:
                    "linear-gradient(180deg, rgba(0,212,255,0.95), rgba(0,255,136,0.95))",
                  boxShadow: "0 0 18px rgba(0,212,255,0.45)",
                }}
              />
            </div>

            {/* 命令面板 */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "34%",
                width: 620,
                transform: `translate(-50%, ${paletteOffset}px)`,
                borderRadius: 16,
                border: "1px solid rgba(0,212,255,0.4)",
                background: "rgba(9,14,22,0.95)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 24px rgba(0,212,255,0.18)",
                overflow: "hidden",
                opacity: paletteOpacity,
              }}
            >
              <div
                style={{
                  height: 50,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  color: "#9ab1c8",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                }}
              >
                Search command... <span style={{ marginLeft: "auto", color: "#00d4ff" }}>⌘K</span>
              </div>
              {[
                "Insert interactive click marker",
                "Attach pointer easing preset",
                "Generate storyboard from timeline",
              ].map((line, idx) => (
                <div
                  key={line}
                  style={{
                    height: 46,
                    borderBottom: idx === 2 ? "none" : "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    color: idx === 0 ? "#d7ffef" : "#99acc0",
                    background: idx === 0 ? "rgba(0,255,136,0.14)" : "transparent",
                    fontSize: 15,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 玻璃高光层 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.10), transparent 24%), linear-gradient(300deg, rgba(255,255,255,0.06), transparent 34%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* 鼠标光标 */}
      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: "#f3f7ff",
          border: "2px solid #12151d",
          boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          transform: "translate(-50%, -50%)",
          zIndex: 20,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: cursorX + 11,
          top: cursorY + 8,
          width: 2,
          height: 24,
          background: "#f3f7ff",
          transform: "rotate(-35deg)",
          transformOrigin: "top center",
          zIndex: 19,
          opacity: 0.9,
        }}
      />

      {/* 点击涟漪 */}
      {[clickA, clickB, clickC, clickD].map((p, idx) => {
        if (p <= 0) {
          return null;
        }
        const ringScale = lerp(0.3, 2.1, 1 - p);
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: cursorX,
              top: cursorY,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "2px solid rgba(0,255,136,0.8)",
              transform: `translate(-50%, -50%) scale(${ringScale})`,
              opacity: p,
              zIndex: 18,
              boxShadow: "0 0 24px rgba(0,255,136,0.4)",
            }}
          />
        );
      })}

      {/* 左上角小标题 */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 36,
          color: "rgba(229, 236, 246, 0.94)",
          fontSize: 20,
          letterSpacing: 0.6,
          fontWeight: 700,
        }}
      >
        Chrome Tilt Interaction • Remotion Showcase
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 66,
          color: "rgba(152, 170, 191, 0.92)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        open → focus → type → click → scroll → drag → command → outro
      </div>
    </AbsoluteFill>
  );
};
