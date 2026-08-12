"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import InfiniteCoverflow from "@/app/components/InfiniteCoverflow";
import StatsSection from "@/app/components/StatsSection";
import FeatureGrid from "@/app/components/FeatureGrid";
import StatusPill from "@/app/components/StatusPill";

const WORKFLOW_STEPS = [
  {
    id: "add",
    label: "Subscription added",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    id: "remind",
    label: "Reminder scheduled",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    id: "track",
    label: "Renewal tracked",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

const LOG_MESSAGES = [
  "Renewal tracked — Notion Pro",
  "Reminder sent — AWS",
  "Subscription added — Spotify",
  "Renewal tracked — Figma",
  "Reminder sent — Adobe CC",
  "Subscription added — Linear",
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleLogs, setVisibleLogs] = useState<
    { key: number; text: string }[]
  >([{ key: 0, text: LOG_MESSAGES[0] }]);
  const logIndexRef = useRef(1);
  const logKeyRef = useRef(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisibleLogs([
        { key: 0, text: LOG_MESSAGES[0] },
        { key: 1, text: LOG_MESSAGES[1] },
        { key: 2, text: LOG_MESSAGES[2] },
      ]);
      return;
    }

    const interval = setInterval(() => {
      setVisibleLogs((prev) => {
        const next = {
          key: logKeyRef.current++,
          text: LOG_MESSAGES[logIndexRef.current % LOG_MESSAGES.length],
        };
        logIndexRef.current += 1;
        return [next, ...prev].slice(0, 3);
      });
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="animate-mesh-sweep pointer-events-none fixed inset-0 z-0 opacity-40" />

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

      {/* Live Status Pill at the very top */}
      <StatusPill />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-14 px-6 pb-32 pt-4 lg:min-h-[calc(100vh-80px)] lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:pb-24 lg:px-8">
        {/* Left: copy */}
        <div className="flex w-full max-w-2xl flex-col items-center text-center lg:items-start lg:text-left">
          <div className="animate-fade-in-up mb-6 flex items-center gap-2">
            <img src="/logo.svg" alt="RenewVault" className="h-9 w-9" />
            <span className="text-sm font-medium tracking-wide text-[var(--text-primary)]">
              RenewVault
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Track Renewals, Due Dates, and Reminders{" "}
            <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
              In One Place.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--text-body)] sm:text-lg lg:mx-0">
            A simple workspace to manage important dates and never miss a
            renewal.
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-row items-center justify-center gap-4 lg:justify-start">
            <Link href="/sign-in">
              <Button className="h-11 rounded-full bg-[var(--secondary)] px-8 text-base font-medium text-[var(--text-primary)] shadow-md shadow-black/30 transition-colors hover:bg-[var(--secondary-hover)]">
                Get started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: animated workflow demo */}
        <div className="relative w-full max-w-md pb-16 lg:max-w-lg lg:pb-8">
          <div
            className="animate-fade-in-up relative rounded-[20px] border border-[var(--border)] bg-[var(--surface-2)]/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
            style={{ animationDelay: "400ms" }}
          >
            <p className="mb-6 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              How RenewVault works
            </p>

            <div className="relative flex items-start justify-between">
              <div className="absolute left-5 right-5 top-5 h-px overflow-hidden bg-[var(--border)]">
                <div className="workflow-line-fill h-full bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)]" />
              </div>

              {WORKFLOW_STEPS.map((step, i) => {
                const isLast = i === WORKFLOW_STEPS.length - 1;
                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex w-1/3 flex-col items-center gap-2"
                  >
                    <div
                      className={`workflow-node flex h-10 w-10 items-center justify-center rounded-full border ${
                        isLast
                          ? "border-transparent bg-gradient-to-br from-[var(--accent)] to-[var(--secondary)] text-white"
                          : "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--accent)]"
                      }`}
                      style={{ animationDelay: `${700 + i * 350}ms` }}
                    >
                      {step.icon}
                    </div>
                    <span className="max-w-[90px] text-center text-[11px] leading-tight text-[var(--text-muted)]">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floating live activity panel */}
          <div
            className="animate-fade-in-up absolute -bottom-2 left-1/2 w-[88%] -translate-x-1/2 rounded-[16px] border border-[var(--border)] bg-[var(--surface)]/95 p-4 shadow-xl shadow-black/50 backdrop-blur-md lg:-bottom-6 lg:left-auto lg:right-[-8%] lg:w-[75%] lg:translate-x-0"
            style={{ animationDelay: "1200ms" }}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Live activity
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {visibleLogs.map((log) => (
                <div
                  key={log.key}
                  className="log-entry flex items-center gap-2 text-xs text-[var(--text-body)]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-[var(--accent)]"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span className="truncate">{log.text}</span>
                </div>
              ))}
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

      <footer className="relative z-10 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)] backdrop-blur-sm">
        © 2026 RenewVault. All rights reserved.
      </footer>

      <style jsx global>{`
        @keyframes workflow-line-fill {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
        .workflow-line-fill {
          animation: workflow-line-fill 1.6s ease-out 0.6s both;
        }

        @keyframes workflow-node-pop {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .workflow-node {
          animation: workflow-node-pop 0.5s ease-out both;
        }

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

        @keyframes log-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .log-entry {
          animation: log-in 0.4s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .workflow-line-fill,
          .workflow-node,
          .pulse-dot,
          .log-entry {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}