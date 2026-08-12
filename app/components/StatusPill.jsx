"use client";

import React from "react";

export default function StatusPill() {
  return (
    <div className="w-full flex justify-center pt-6 pb-2 relative z-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-gray-300 shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-medium text-white">v1.0 Live</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-400">All systems normal</span>
      </div>
    </div>
  );
}