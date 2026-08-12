"use client";

import React, { useEffect, useState, useRef } from "react";

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]/50 p-8 backdrop-blur-md">
        
        {/* Stat 1 */}
        <div className="text-center md:text-left flex flex-col justify-between">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
            Saved Subscriptions
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">
            {isVisible ? "$1,200+" : "$0"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Average annual savings from cancelled charges.
          </p>
        </div>

        {/* Stat 2 */}
        <div className="text-center md:text-left flex flex-col justify-between border-y md:border-y-0 md:border-x border-[var(--border)] py-6 md:py-0 md:px-6">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
            Active Trackers
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">
            {isVisible ? "99.9%" : "0%"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Uptime tracking for all your scheduled renewals.
          </p>
        </div>

        {/* Stat 3 */}
        <div className="text-center md:text-left flex flex-col justify-between">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-medium">
            Reminders Sent
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-white mt-2">
            {isVisible ? "50K+" : "0"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Delivered right before you get billed.
          </p>
        </div>

      </div>
    </section>
  );
}