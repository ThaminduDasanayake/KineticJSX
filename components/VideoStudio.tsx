"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { KineticShowcase } from "@/remotion/compositions/KineticShowcase";
import { KineticVideoProps, defaultVideoProps } from "@/remotion/types";
import {
  Desktop,
  DeviceMobile,
  Square,
  Sparkle,
  SlidersHorizontal,
  TerminalWindow,
  FilmStrip,
  Copy,
  Check,
  Lightning,
} from "@phosphor-icons/react";

const ASPECT_RATIO_CONFIGS = {
  "16:9": {
    width: 1920,
    height: 1080,
    label: "16:9 Landscape",
    icon: Desktop,
    containerClass: "aspect-video max-w-4xl",
  },
  "9:16": {
    width: 1080,
    height: 1920,
    label: "9:16 Vertical Reel",
    icon: DeviceMobile,
    containerClass: "aspect-[9/16] max-w-sm",
  },
  "1:1": {
    width: 1080,
    height: 1080,
    label: "1:1 Square",
    icon: Square,
    containerClass: "aspect-square max-w-lg",
  },
} as const;

export const VideoStudio: React.FC = () => {
  const [props, setProps] = useState<KineticVideoProps>(defaultVideoProps);
  const [copied, setCopied] = useState(false);

  const activeRatio = ASPECT_RATIO_CONFIGS[props.aspectRatio];

  const compositionId = `KineticShowcase-${props.aspectRatio.replace(":", "-")}`;
  const cliCommand = `npx remotion render remotion/index.ts ${compositionId} out/${compositionId}.mp4`;

  const copyCliCommand = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <FilmStrip size={22} weight="bold" className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              KineticJSX Studio
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-400 font-medium">
                React 19 + Remotion
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Deterministic code-driven video synthesis
            </p>
          </div>
        </div>

        {/* Aspect Ratio Toggles */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          {(["16:9", "9:16", "1:1"] as const).map((ratio) => {
            const Config = ASPECT_RATIO_CONFIGS[ratio];
            const IconComponent = Config.icon;
            const isActive = props.aspectRatio === ratio;

            return (
              <button
                key={ratio}
                onClick={() => setProps((prev) => ({ ...prev, aspectRatio: ratio }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <IconComponent size={16} weight={isActive ? "fill" : "regular"} />
                <span>{ratio}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto">
        {/* Left / Center: Interactive Video Player Viewport */}
        <main className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col items-center">
            {/* Player Container */}
            <div
              className={`w-full ${activeRatio.containerClass} rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl shadow-sky-500/5 transition-all duration-300 relative`}
            >
              <Player
                component={KineticShowcase}
                durationInFrames={240}
                compositionWidth={activeRatio.width}
                compositionHeight={activeRatio.height}
                fps={30}
                inputProps={props}
                controls
                autoPlay
                loop
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>

            {/* Quick Export / Terminal Info Banner */}
            <div className="mt-6 w-full max-w-4xl p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <TerminalWindow size={20} weight="duotone" />
                </div>
                <div className="truncate">
                  <div className="text-xs text-slate-400 font-medium">
                    Render to MP4 CLI Command:
                  </div>
                  <code className="text-xs font-mono text-sky-300 truncate block">
                    {cliCommand}
                  </code>
                </div>
              </div>

              <button
                onClick={copyCliCommand}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Right: Live Controller Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-5 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <SlidersHorizontal size={18} className="text-sky-400" />
            <span>Live Scene Parameters</span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            {/* Headline */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={props.title}
                onChange={(e) =>
                  setProps((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Highlighted Word */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Highlighted Word(s)
              </label>
              <input
                type="text"
                value={props.highlightText}
                onChange={(e) =>
                  setProps((prev) => ({
                    ...prev,
                    highlightText: e.target.value,
                  }))
                }
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={props.subtitle}
                onChange={(e) =>
                  setProps((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Badge Text */}
            <div>
              <label className="block text-slate-400 font-medium mb-1.5">
                Badge Label
              </label>
              <input
                type="text"
                value={props.badgeText}
                onChange={(e) =>
                  setProps((prev) => ({ ...prev, badgeText: e.target.value }))
                }
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">
                  Metric Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={props.metricsValue}
                  onChange={(e) =>
                    setProps((prev) => ({
                      ...prev,
                      metricsValue: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">
                  Metric Label
                </label>
                <input
                  type="text"
                  value={props.metricsLabel}
                  onChange={(e) =>
                    setProps((prev) => ({
                      ...prev,
                      metricsLabel: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Accent Color Presets */}
            <div>
              <label className="block text-slate-400 font-medium mb-2">
                Color Scheme Presets
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Sky / Indigo", primary: "#38bdf8", secondary: "#818cf8" },
                  { label: "Emerald / Cyan", primary: "#34d399", secondary: "#22d3ee" },
                  { label: "Rose / Violet", primary: "#f43f5e", secondary: "#a855f7" },
                  { label: "Amber / Orange", primary: "#fbbf24", secondary: "#f97316" },
                ].map((palette) => (
                  <button
                    key={palette.label}
                    onClick={() =>
                      setProps((prev) => ({
                        ...prev,
                        accentColor: palette.primary,
                        secondaryColor: palette.secondary,
                      }))
                    }
                    className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-600 transition-all text-[10px]"
                  >
                    <div className="flex gap-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: palette.secondary }}
                      />
                    </div>
                    <span className="text-slate-400">{palette.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="mt-2 p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-200/90 text-xs leading-relaxed flex items-start gap-2.5">
            <Lightning size={20} weight="fill" className="text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sky-100 mb-0.5">Live Deterministic State</p>
              <p className="text-slate-400 text-[11px]">
                Any edits in this panel update the video frame math instantly without re-rendering or buffering.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
