import React from "react";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { KineticText } from "../components/KineticText";
import { BentoCard } from "../components/BentoCard";
import { MetricCounter } from "../components/MetricCounter";
import { KineticVideoProps } from "../types";
import {
  Lightning,
  Code,
  FilmSlate,
  Sparkle,
  Cube,
  Cpu,
} from "@phosphor-icons/react";

export const KineticShowcase: React.FC<KineticVideoProps> = ({
  title,
  subtitle,
  highlightText,
  badgeText,
  metricsValue,
  metricsLabel,
  accentColor,
  secondaryColor,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Intro badge bounce
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  const isVertical = aspectRatio === "9:16";

  return (
    <AbsoluteFill className="bg-slate-950 text-white font-sans overflow-hidden select-none">
      <BackgroundGrid accentColor={accentColor} secondaryColor={secondaryColor} />

      {/* 🎬 SCENE 1: Kinetic Typography Hero (Frames 0 - 100) */}
      <Sequence from={0} durationInFrames={100}>
        <AbsoluteFill className="flex flex-col items-center justify-center px-12 text-center">
          {/* Badge */}
          <div
            style={{
              opacity: badgeSpring,
              transform: `scale(${badgeSpring})`,
            }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-sm font-semibold tracking-wide mb-6 shadow-lg shadow-sky-500/10"
          >
            <Sparkle size={16} weight="fill" className="text-sky-400" />
            <span>{badgeText}</span>
          </div>

          {/* Kinetic Headline */}
          <KineticText
            text={title}
            highlightWord={highlightText}
            startFrame={10}
            staggerFrames={5}
            className={
              isVertical
                ? "text-4xl sm:text-5xl font-black tracking-tight leading-tight max-w-lg"
                : "text-6xl sm:text-7xl font-black tracking-tight leading-none max-w-4xl"
            }
          />

          {/* Subtitle */}
          <p
            style={{
              opacity: spring({ frame: Math.max(0, frame - 35), fps }),
              transform: `translateY(${(1 - spring({ frame: Math.max(0, frame - 35), fps })) * 20}px)`,
            }}
            className="mt-6 text-xl sm:text-2xl text-slate-400 max-w-2xl font-normal leading-relaxed"
          >
            {subtitle}
          </p>
        </AbsoluteFill>
      </Sequence>

      {/* 🎬 SCENE 2: Bento Grid & Metrics (Frames 90 - 190) */}
      <Sequence from={90} durationInFrames={100}>
        <AbsoluteFill className="flex flex-col items-center justify-center p-8 sm:p-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Why Code Your Videos?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Deterministic frame control with standard React state & props.
            </p>
          </div>

          {/* Grid Layout */}
          <div
            className={`grid w-full max-w-5xl gap-5 ${
              isVertical ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            <BentoCard
              title="100% Deterministic"
              description="Zero dropped frames. Mathematical interpolation for flawless MP4 output."
              icon={<Lightning size={24} weight="duotone" />}
              startFrame={0}
              delay={0}
              badge="Accurate"
            />

            <BentoCard
              title="Standard JSX & CSS"
              description="Use Tailwind, SVGs, and Phosphor icons directly in your video components."
              icon={<Code size={24} weight="duotone" />}
              startFrame={0}
              delay={6}
              badge="React 19"
            />

            <BentoCard
              title="Dynamic & Reusable"
              description="Swap text, change aspect ratios, and generate infinite video variations programmatically."
              icon={<FilmSlate size={24} weight="duotone" />}
              startFrame={0}
              delay={12}
              badge="Scalable"
            />
          </div>

          {/* Metric Counter */}
          {!isVertical && (
            <div className="mt-8 w-full max-w-md">
              <MetricCounter
                value={metricsValue}
                label={metricsLabel}
                startFrame={15}
                durationFrames={35}
                suffix="%"
                className="bg-white/[0.03] border-white/[0.08]"
              />
            </div>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* 🎬 SCENE 3: Outro Call-To-Action (Frames 180 - 240) */}
      <Sequence from={180} durationInFrames={60}>
        <AbsoluteFill className="flex flex-col items-center justify-center text-center px-8">
          <div
            style={{
              transform: `scale(${spring({ frame: Math.max(0, frame - 185), fps, config: { damping: 10 } })})`,
              opacity: spring({ frame: Math.max(0, frame - 185), fps }),
            }}
            className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-2xl shadow-sky-500/30 mb-8 border border-white/20"
          >
            <Cube size={40} weight="fill" className="text-white" />
          </div>

          <h2
            style={{
              opacity: spring({ frame: Math.max(0, frame - 192), fps }),
              transform: `translateY(${(1 - spring({ frame: Math.max(0, frame - 192), fps })) * 20}px)`,
            }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
          >
            Turn Your Code Into <br />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              High-Converting Video
            </span>
          </h2>

          <div
            style={{
              opacity: spring({ frame: Math.max(0, frame - 200), fps }),
            }}
            className="mt-6 flex items-center gap-3 text-slate-400 font-mono text-sm"
          >
            <Cpu size={18} className="text-sky-400" />
            <span>npx remotion render</span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
