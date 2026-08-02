"use client";

import { useState, useEffect, type ReactNode } from "react";

export function AuthShell({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-[var(--bg)] px-6 py-8 text-[var(--text-primary)]">
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="animate-mesh-sweep pointer-events-none fixed inset-0 z-0 opacity-40" />

      {/* Interactive mouse spotlight */}
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

      {/* Meteors */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="meteor-trail meteor-1" />
        <div className="meteor-trail meteor-2" />
        <div className="meteor-trail meteor-3" />
      </div>

      <div className="animate-float-a pointer-events-none absolute top-[15vh] right-0 z-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--accent)]/10 blur-[150px]" />
      <div className="animate-float-b pointer-events-none absolute top-[55vh] left-0 z-0 h-[420px] w-[420px] -translate-x-1/3 rounded-full bg-[var(--secondary)]/12 blur-[150px]" />
      <div className="animate-float-c pointer-events-none absolute top-[85vh] right-[10%] z-0 h-[300px] w-[300px] rounded-full bg-[var(--violet-glow)]/8 blur-[140px]" />

      {/* --- CONTENT --- */}
      <div
        className={`relative z-10 mx-auto grid h-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr] ${
          centered ? "content-center" : ""
        }`}
      >
        <section className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
          <div
            className={`animate-fade-in-up mb-4 flex items-center justify-center gap-2 md:justify-start md:mt-0 ${
              !centered ? "mt-8" : ""
            }`}
          >
            <img src="/logo.svg" alt="RenewVault" className="h-14 w-14 md:h-9 md:w-9" />
            <span className="hidden text-sm font-medium tracking-wide text-[var(--text-primary)] md:inline">
              RenewVault
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 hidden max-w-xl text-3xl font-semibold leading-tight md:block md:text-4xl lg:text-5xl">
            Track renewals, due dates, and reminders{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--violet-glow)] bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mt-4 hidden max-w-lg text-sm leading-6 text-[var(--text-body)] md:block">
            A simple workspace to manage important dates and never miss a renewal.
          </p>
        </section>

        <div className="animate-fade-in-up delay-200 flex items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}