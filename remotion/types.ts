export type KineticVideoProps = {
  title: string;
  subtitle: string;
  highlightText: string;
  badgeText: string;
  metricsValue: number;
  metricsLabel: string;
  accentColor: string;
  secondaryColor: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  [key: string]: unknown;
};

export const defaultVideoProps: KineticVideoProps = {
  title: "Build Videos with Code",
  subtitle: "Kinetic typography, spring physics & vector motion in pure JSX.",
  highlightText: "Pure React",
  badgeText: "KineticJSX v1.0",
  metricsValue: 99.8,
  metricsLabel: "Frame Accuracy",
  accentColor: "#38bdf8",
  secondaryColor: "#818cf8",
  aspectRatio: "16:9",
};
