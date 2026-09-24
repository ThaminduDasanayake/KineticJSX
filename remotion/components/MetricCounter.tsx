import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface MetricCounterProps {
  value: number;
  label: string;
  startFrame?: number;
  durationFrames?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  label,
  startFrame = 0,
  durationFrames = 45,
  prefix = "",
  suffix = "%",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progressFrame = Math.max(0, frame - startFrame);

  const springEntrance = spring({
    frame: progressFrame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 100 },
  });

  const animatedValue = interpolate(
    progressFrame,
    [0, durationFrames],
    [0, value],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const formattedNumber =
    value % 1 !== 0
      ? animatedValue.toFixed(1)
      : Math.round(animatedValue).toString();

  const opacity = interpolate(progressFrame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${0.9 + springEntrance * 0.1})`,
      }}
      className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-md shadow-2xl ${className}`}
    >
      <div className="text-5xl font-black tracking-tight text-white flex items-center">
        <span>{prefix}</span>
        <span className="tabular-nums">{formattedNumber}</span>
        <span className="text-sky-400 ml-1">{suffix}</span>
      </div>
      <div className="mt-2 text-sm font-medium tracking-wide uppercase text-slate-400">
        {label}
      </div>
    </div>
  );
};
