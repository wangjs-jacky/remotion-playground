import { Composition, Folder, Still } from "remotion";

// ─── 基础动画示例 ────────────────────────────────
import { FadeInDemo } from "./demos/animations/FadeInDemo";
import { ScaleRotateDemo } from "./demos/animations/ScaleRotateDemo";
import { SpringDemo } from "./demos/animations/SpringDemo";
import { EasingDemo } from "./demos/animations/EasingDemo";

// ─── 文字动画示例 ────────────────────────────────
import { TypewriterDemo } from "./demos/text-animations/TypewriterDemo";
import { WordHighlightDemo } from "./demos/text-animations/WordHighlightDemo";
import { StaggeredTextDemo } from "./demos/text-animations/StaggeredTextDemo";

// ─── 媒体资产示例 ────────────────────────────────
import { VideoDemo } from "./demos/media/VideoDemo";
import { AudioDemo } from "./demos/media/AudioDemo";
import { ImageDemo } from "./demos/media/ImageDemo";
import { GifDemo } from "./demos/media/GifDemo";
import { LottieDemo } from "./demos/media/LottieDemo";
import { FontDemo } from "./demos/media/FontDemo";

// ─── 场景编排示例 ────────────────────────────────
import { SequenceDemo } from "./demos/sequencing/SequenceDemo";
import { SeriesDemo } from "./demos/sequencing/SeriesDemo";
import { TransitionDemo } from "./demos/sequencing/TransitionDemo";
import { TrimmingDemo } from "./demos/sequencing/TrimmingDemo";

// ─── 数据可视化示例 ────────────────────────────────
import { BarChartDemo } from "./demos/charts/BarChartDemo";
import { PieChartDemo } from "./demos/charts/PieChartDemo";
import { LineChartDemo } from "./demos/charts/LineChartDemo";

// ─── 静态图示例 ────────────────────────────────
import { ThumbnailDemo } from "./demos/stills/ThumbnailDemo";

// ─── 参数化示例 ────────────────────────────────
import { ParameterizedDemo, ParameterizedSchema } from "./demos/parameterized/ParameterizedDemo";
import { ChromeTiltInteractiveDemo } from "./demos/showcase/ChromeTiltInteractiveDemo";
import { VideoRotationDemo } from "./demos/showcase/VideoRotationDemo";
import { TechGridDemo } from "./demos/showcase/TechGridDemo";
import { IconCloudDemo, IconCloudSchema } from "./demos/showcase/IconCloudDemo";

// ─── 汉堡广告示例 ────────────────────────────────
import { BurgerAdDemo } from "./demos/burger-ad/BurgerAdDemo";

export const RemotionRoot = () => {
  return (
    <>
      {/* ===== 基础动画 ===== */}
      <Folder name="01-Animations">
        <Composition
          id="FadeIn"
          component={FadeInDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ScaleRotate"
          component={ScaleRotateDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Spring"
          component={SpringDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Easing"
          component={EasingDemo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ===== 文字动画 ===== */}
      <Folder name="02-TextAnimations">
        <Composition
          id="Typewriter"
          component={TypewriterDemo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="WordHighlight"
          component={WordHighlightDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="StaggeredText"
          component={StaggeredTextDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ===== 媒体资产 ===== */}
      <Folder name="03-Media">
        <Composition
          id="VideoPlayer"
          component={VideoDemo}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="AudioPlayer"
          component={AudioDemo}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="ImageDisplay"
          component={ImageDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="GifDisplay"
          component={GifDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LottieAnimation"
          component={LottieDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="FontStyles"
          component={FontDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ===== 场景编排 ===== */}
      <Folder name="04-Sequencing">
        <Composition
          id="SequenceTiming"
          component={SequenceDemo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="SeriesPlayback"
          component={SeriesDemo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Transitions"
          component={TransitionDemo}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Trimming"
          component={TrimmingDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ===== 数据可视化 ===== */}
      <Folder name="05-Charts">
        <Composition
          id="BarChart"
          component={BarChartDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="PieChart"
          component={PieChartDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="LineChart"
          component={LineChartDemo}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>

      {/* ===== 静态图 ===== */}
      <Folder name="06-Stills">
        <Still
          id="Thumbnail"
          component={ThumbnailDemo}
          width={1280}
          height={720}
        />
      </Folder>

      {/* ===== 参数化视频 ===== */}
      <Folder name="07-Parameterized">
        <Composition
          id="ParameterizedVideo"
          component={ParameterizedDemo}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "Remotion 参数化示例",
            subtitle: "在侧边栏修改参数实时预览",
            bgColor: "#0a0a0b",
            textColor: "#00ff88",
          }}
          schema={ParameterizedSchema}
        />
      </Folder>

      {/* ===== 高复杂度交互演示 ===== */}
      <Folder name="08-Showcase">
        <Composition
          id="ChromeTiltInteractive"
          component={ChromeTiltInteractiveDemo}
          durationInFrames={720}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="VideoRotation"
          component={VideoRotationDemo}
          durationInFrames={4230}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="TechGrid"
          component={TechGridDemo}
          durationInFrames={300}
          fps={30}
          width={2560}
          height={1440}
        />
        <Composition
          id="IconCloud"
          component={IconCloudDemo}
          durationInFrames={600}
          fps={30}
          width={2048}
          height={2048}
          schema={IconCloudSchema}
          defaultProps={{"cardSize":110,"majorRadius":300,"minorRadius":130,"rotationSpeed":4,"cardOpacity":0.9,"perspectiveDepth":1300,"tiltAngle":25}}
        />
      </Folder>

      {/* ===== Terminal Noir 汉堡广告 ===== */}
      <Folder name="09-BurgerAd">
        <Composition
          id="BurgerAd"
          component={BurgerAdDemo}
          durationInFrames={450}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
