"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeaturesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
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

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-6 py-8 text-center lg:px-8">
        <div className="flex w-full flex-col items-center text-center">
          <div className="animate-fade-in-up mb-6 flex items-center gap-2">
            <img src="/logo.svg" alt="RenewVault" className="h-9 w-9" />
            <span className="text-sm font-medium tracking-wide text-[var(--text-primary)]">
              RenewVault
            </span>
          </div>

          <h1 className="animate-fade-in-up delay-100 max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Track Renewals, Due Dates, and Reminders{" "}
            <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
              In One Place.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--text-body)] sm:text-lg">
            A simple workspace to manage important dates and never miss a
            renewal.
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-row items-center justify-center gap-4">
            <Link href="/sign-in">
              <Button className="h-11 rounded-full bg-[var(--secondary)] px-8 text-base font-medium text-[var(--text-primary)] shadow-md shadow-black/30 transition-colors hover:bg-[var(--secondary-hover)]">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        ref={featuresRef}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24"
      >
        <div
          className={`mb-12 text-center reveal-card ${
            isFeaturesVisible ? "is-visible" : ""
          }`}
        >
          <h2 className="text-2xl font-semibold md:text-3xl">
            Everything you need to stay organized
          </h2>
          <p className="mt-4 text-[var(--text-body)]">
            Designed to keep your subscriptions and vaults in check.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div
            className={`reveal-card delay-100 relative z-0 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-all duration-300 ease-out hover:z-20 hover:scale-110 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:shadow-2xl hover:shadow-black/40 ${
              isFeaturesVisible ? "is-visible" : ""
            }`}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Smart Alerts
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Get notified before you get charged. Set custom alerts for upcoming
              renewals so you are never caught off guard.
            </p>
          </div>

          <div
            className={`reveal-card delay-200 relative z-0 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-all duration-300 ease-out hover:z-20 hover:scale-110 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:shadow-2xl hover:shadow-black/40 ${
              isFeaturesVisible ? "is-visible" : ""
            }`}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-text)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Secure Vault
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Keep your sensitive renewal dates, licensing info, and service
              contracts in an isolated, secure workspace.
            </p>
          </div>

          <div
            className={`reveal-card delay-300 relative z-0 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-all duration-300 ease-out hover:z-20 hover:scale-110 hover:border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:shadow-2xl hover:shadow-black/40 ${
              isFeaturesVisible ? "is-visible" : ""
            }`}
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-text)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Sync Anywhere
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Access your dashboard from your laptop or phone. Your data stays
              perfectly synced across all your devices.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)] backdrop-blur-sm">
        © 2026 RenewVault. All rights reserved.
      </footer>
    </main>
  );
}