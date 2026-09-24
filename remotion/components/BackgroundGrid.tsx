import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface BackgroundGridProps {
  accentColor?: string;
  secondaryColor?: string;
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  accentColor = "#38bdf8",
  secondaryColor = "#818cf8",
}) => {
  const frame = useCurrentFrame();

  // Subtle floating background glow
  const glowY = interpolate(frame, [0, 90, 180], [0, 30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glowScale = interpolate(frame, [0, 90, 180], [1, 1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-slate-950 pointer-events-none"
      style={{ opacity }}
    >
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial Gradient Glow 1 */}
      <div
        className="absolute rounded-full blur-[120px] opacity-35"
        style={{
          width: 600,
          height: 600,
          top: "15%",
          left: "25%",
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          transform: `translateY(${glowY}px) scale(${glowScale})`,
        }}
      />

      {/* Radial Gradient Glow 2 */}
      <div
        className="absolute rounded-full blur-[140px] opacity-25"
        style={{
          width: 500,
          height: 500,
          bottom: "10%",
          right: "20%",
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          transform: `translateY(${-glowY}px) scale(${glowScale})`,
        }}
      />
    </div>
  );
};
