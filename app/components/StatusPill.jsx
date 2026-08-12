"use client";

import React from "react";

export default function StatusPill() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-black/20 backdrop-blur-md text-[11px] shadow-sm">
      {/* Pulse Dot (added shrink-0 so it doesn't squish) */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
      
      {/* Primary Status (always visible, prevented from wrapping) */}
      <span className="text-zinc-200 font-medium tracking-wide whitespace-nowrap">
        v1.0 Live
      </span>
      
      {/* Separator and Secondary Text (hidden on mobile, visible on small screens and up) */}
      <span className="text-zinc-700 font-light hidden sm:inline">•</span>
      <span className="text-zinc-400 hidden sm:inline whitespace-nowrap">
        All systems normal
      </span>
    </div>
  );
}