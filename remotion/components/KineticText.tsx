import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface KineticTextProps {
  text: string;
  startFrame?: number;
  staggerFrames?: number;
  className?: string;
  highlightWord?: string;
  highlightGradient?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame = 0,
  staggerFrames = 4,
  className = "",
  highlightWord = "",
  highlightGradient = "from-sky-400 via-indigo-400 to-cyan-300",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-2 ${className}`}>
      {words.map((word, index) => {
        const wordDelay = startFrame + index * staggerFrames;
        const currentProgress = frame - wordDelay;

        // Spring animation for smooth bounce entrance
        const springVal = spring({
          frame: currentProgress,
          fps,
          config: {
            damping: 14,
            mass: 0.6,
            stiffness: 120,
          },
        });

        // Vertical slide up
        const translateY = interpolate(
          springVal,
          [0, 1],
          [40, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        // Opacity fade in
        const opacity = interpolate(
          currentProgress,
          [0, 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const isHighlight =
          highlightWord &&
          word.toLowerCase().includes(highlightWord.toLowerCase());

        return (
          <span
            key={`${word}-${index}`}
            style={{
              opacity,
              transform: `translateY(${translateY}px) scale(${0.8 + springVal * 0.2})`,
              display: "inline-block",
            }}
            className={
              isHighlight
                ? `bg-gradient-to-r ${highlightGradient} bg-clip-text text-transparent font-extrabold`
                : ""
            }
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
