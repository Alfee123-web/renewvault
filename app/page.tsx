"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import InfiniteCoverflow from "@/app/components/InfiniteCoverflow";
import StatsSection from "@/app/components/StatsSection";
import FeatureGrid from "@/app/components/FeatureGrid";
import RecentFeatures from "@/app/components/RecentFeatures";
import StatusPill from "@/app/components/StatusPill";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [simulatedCount, setSimulatedCount] = useState(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState("/sign-in");

  const handleSimulate = (name: string, price: string) => {
    setSimulatedCount((prev) => prev + 1);
    setToastMessage(`Successfully simulated tracking ${name} (${price})!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setTargetUrl("/dashboard");
        }
      })
      .catch((err) => console.error("Session check failed", err));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="animate-mesh-sweep pointer-events-none fixed inset-0 z-0 opacity-40" />

      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/95 border border-indigo-500/40 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <p className="text-xs font-medium text-zinc-200">{toastMessage}</p>
        </div>
      )}

      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.05), transparent 40%)`,
        }}
      />

      <div
        className="animate-pan-grid pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="meteor-trail meteor-1" />
        <div className="meteor-trail meteor-2" />
        <div className="meteor-trail meteor-3" />
      </div>

      <div className="animate-float-a pointer-events-none absolute top-[15vh] right-0 z-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--accent)]/10 blur-[150px]" />
      <div className="animate-float-b pointer-events-none absolute top-[55vh] left-0 z-0 h-[420px] w-[420px] -translate-x-1/3 rounded-full bg-[var(--secondary)]/12 blur-[150px]" />
      <div className="animate-float-c pointer-events-none absolute top-[85vh] right-[10%] z-0 h-[300px] w-[300px] rounded-full bg-[var(--violet-glow)]/8 blur-[140px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-14 px-6 pb-32 pt-16 lg:min-h-[calc(100vh-80px)] lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-24 lg:px-8">
        {/* Left: copy */}
        <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <div className="animate-fade-in-up mb-6 flex items-center gap-2">
            <img src="/logo.svg" alt="RenewVault" className="h-9 w-9" />
            <span className="text-sm font-medium tracking-wide text-[var(--text-primary)]">
              RenewVault
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Never get charged{" "}
            <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
              by surprise again.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--text-body)] sm:text-lg lg:mx-0">
            Scan a receipt, split the cost with friends, and get reminded before
            every renewal, all in one calm, secure workspace.
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-row flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href={targetUrl}>
              <Button className="h-11 rounded-full bg-[var(--secondary)] px-8 text-base font-medium text-[var(--text-primary)] shadow-md shadow-black/30 transition-colors hover:bg-[var(--secondary-hover)] cursor-pointer">
                Get started
              </Button>
            </Link>
            <a
              href="#whats-new"
              className="inline-flex h-11 items-center rounded-full border border-[var(--border)] px-6 text-base font-medium text-[var(--text-body)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-primary)]"
            >
              See what&rsquo;s new
            </a>
          </div>
        </div>

        {/* Right: Interactive Live Simulation Stack (Replaces static diagram) */}
        <div className="relative w-full max-w-md lg:max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] rounded-3xl blur-xl opacity-20 animate-pulse pointer-events-none" />

          <div className="relative rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)]/90 p-5 shadow-2xl shadow-black/50 backdrop-blur-md flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Live Interactive Vault
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {simulatedCount} Active
              </span>
            </div>

            {/* Simulation Card 1 */}
            <div className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-[var(--accent)]/60 transition-all flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Netflix Pro</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">$15.00/mo • Due in 2 days</p>
              </div>
              <button
                onClick={() => handleSimulate("Netflix Pro", "$15.00")}
                className="rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white px-2.5 py-1 text-[11px] font-medium border border-[var(--accent)]/20 transition-all cursor-pointer"
              >
                Simulate
              </button>
            </div>

            {/* Simulation Card 2 */}
            <div className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-[var(--accent)]/60 transition-all flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">GitHub Copilot</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">$10.00/mo • Due in 5 days</p>
              </div>
              <button
                onClick={() => handleSimulate("GitHub Copilot", "$10.00")}
                className="rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white px-2.5 py-1 text-[11px] font-medium border border-[var(--accent)]/20 transition-all cursor-pointer"
              >
                Simulate
              </button>
            </div>

            {/* Simulation Card 3 (shows cost splitting) */}
            <div className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 hover:border-[var(--accent)]/60 transition-all flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Spotify Family</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  $9.99/mo • <span className="text-[#8b8df1]">$3.33 your share</span> (split 3 ways)
                </p>
              </div>
              <button
                onClick={() => handleSimulate("Spotify Family", "$9.99")}
                className="rounded-lg bg-[var(--accent)]/10 hover:bg-[var(--accent)] text-[var(--accent)] hover:text-white px-2.5 py-1 text-[11px] font-medium border border-[var(--accent)]/20 transition-all cursor-pointer"
              >
                Simulate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Coverflow Carousel */}
      <InfiniteCoverflow />

      {/* Animated Stats Section */}
      <StatsSection />

      {/* Interactive Feature Grid with mouse-tracking */}
      <FeatureGrid />

      {/* Recently added features */}
      <RecentFeatures />

      {/* Closing call to action */}
      <section className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-2)]/80 px-6 py-12 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:px-12">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[var(--accent)]/20 blur-[90px]" />
          <h2 className="relative text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Track, split, and stay ahead of every renewal.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base leading-relaxed text-[var(--text-body)]">
            Pick from 40+ popular services or scan a receipt, and RenewVault takes care of the reminders.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link href={targetUrl}>
              <Button className="h-11 rounded-full bg-[var(--secondary)] px-8 text-base font-medium text-[var(--text-primary)] shadow-md shadow-black/30 transition-colors hover:bg-[var(--secondary-hover)] cursor-pointer">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Updated Footer with Status Pill */}
      <footer className="relative z-10 border-t border-[var(--border)] py-6 backdrop-blur-sm mt-auto">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <span className="text-sm text-[var(--text-muted)]">
            © 2026 RenewVault. All rights reserved.
          </span>
          <StatusPill />
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse-dot {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.7);
          }
        }
        .pulse-dot {
          animation: pulse-dot 1.6s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}