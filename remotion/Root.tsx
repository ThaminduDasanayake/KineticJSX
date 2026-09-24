import React from "react";
import "../app/globals.css";
import { Composition } from "remotion";
import { KineticShowcase } from "./compositions/KineticShowcase";
import { defaultVideoProps } from "./types";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape Composition */}
      <Composition
        id="KineticShowcase-16-9"
        component={KineticShowcase}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          ...defaultVideoProps,
          aspectRatio: "16:9",
        }}
      />

      {/* 9:16 Vertical Reel / TikTok Composition */}
      <Composition
        id="KineticShowcase-9-16"
        component={KineticShowcase}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultVideoProps,
          aspectRatio: "9:16",
        }}
      />

      {/* 1:1 Square Post Composition */}
      <Composition
        id="KineticShowcase-1-1"
        component={KineticShowcase}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          ...defaultVideoProps,
          aspectRatio: "1:1",
        }}
      />
    </>
  );
};
