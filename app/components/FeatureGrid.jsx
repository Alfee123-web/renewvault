"use client";

import React, { useState, useRef } from "react";

const features = [
  {
    title: "Smart Alerts",
    description: "Get notified before you get charged. Set custom alerts for upcoming renewals so you are never caught off guard.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    title: "Secure Vault",
    description: "Keep your sensitive renewal dates, licensing info, and service contracts in an isolated, secure workspace.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Sync Anywhere",
    description: "Access your dashboard from your laptop or phone. Your data stays perfectly synced across all your devices.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
      </svg>
    ),
  },
];

export default function FeatureGrid() {
  const gridRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={gridRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 overflow-hidden"
    >
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-semibold md:text-3xl text-white">
          Everything you need to stay organized
        </h2>
        <p className="mt-4 text-gray-400">
          Designed to keep your subscriptions and vaults in check.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 relative">
        {/* Mouse tracking radial spotlight effect over grid items */}
        {isHovered && (
          <div
            className="absolute pointer-events-none -inset-px rounded-3xl transition duration-300 z-0"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
            }}
          />
        )}

        {features.map((feature, idx) => (
          <div
            key={idx}
            className="relative z-10 rounded-[18px] border border-white/10 bg-[#121218] p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-indigo-400">
              {feature.icon}
            </div>
            <h3 className="text-base font-medium text-white">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}