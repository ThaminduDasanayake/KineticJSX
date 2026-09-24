import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface BentoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  startFrame?: number;
  delay?: number;
  className?: string;
  badge?: string;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  icon,
  startFrame = 0,
  delay = 0,
  className = "",
  badge,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = Math.max(0, frame - (startFrame + delay));

  const springEntrance = spring({
    frame: activeFrame,
    fps,
    config: {
      damping: 15,
      mass: 0.8,
      stiffness: 110,
    },
  });

  return (
    <div
      style={{
        opacity: springEntrance,
        transform: `translateY(${(1 - springEntrance) * 30}px) scale(${0.92 + springEntrance * 0.08})`,
      }}
      className={`relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/[0.12] backdrop-blur-xl shadow-2xl transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
          {icon}
        </div>
        {badge && (
          <span className="px-2.5 py-1 text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-500/30 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-white tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
