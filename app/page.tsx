"use client";

import dynamic from "next/dynamic";

const VideoStudio = dynamic(
  () => import("@/components/VideoStudio").then((mod) => mod.VideoStudio),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Initializing Kinetic Studio...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <VideoStudio />;
}
