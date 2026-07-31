"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

// --- CUSTOM MAGNETIC BUTTON WRAPPER ---
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Multiply by a factor (e.g., 0.2) to control how far it pulls
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-block"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: position.x === 0 ? "transform 0.5s ease" : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);

  // Track mouse movement for the spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Track scroll position for feature cards reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeaturesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the section is visible
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="animate-mesh-sweep pointer-events-none fixed inset-0 z-0 opacity-40" />

      {/* Interactive Mouse Spotlight */}
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

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-8 lg:flex-row lg:justify-between lg:gap-16">
        
        {/* LEFT SIDE */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <p className="animate-fade-in-up mb-6 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs tracking-[0.2em] text-[var(--text-muted)] backdrop-blur-md">
            RENEWVAULT 1.0
          </p>

          <h1 className="animate-fade-in-up delay-100 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Track renewals, due dates, and reminders{" "}
            <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mt-6 max-w-md text-base leading-relaxed text-[var(--text-body)] sm:text-lg">
            A simple workspace to manage important dates and never miss a renewal.
          </p>

          <div className="animate-fade-in-up delay-300 mt-8 flex flex-row items-center gap-4">
            {/* Magnetic Button Wrapper Applied Here */}
            <MagneticWrapper>
              <Button
                style={{ backgroundColor: "#6366F1" }}
                className="h-11 px-8 text-base shadow-lg shadow-[#6366F1]/20 transition-all hover:scale-105 hover:!bg-[#4F46E5]"
              >
                Get started
              </Button>
            </MagneticWrapper>
            <Button variant="secondary" className="h-11 px-8 text-base transition-all hover:bg-[var(--surface-3)]">
              Sign in
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE: Mock App Window */}
        <div className="group animate-fade-in-up delay-200 relative w-full max-w-2xl lg:w-1/2">
          <div className="animate-pulse-glow pointer-events-none absolute inset-0 rounded-[30px] bg-[var(--accent)]/10 blur-[80px] transition-all duration-700 group-hover:bg-[var(--secondary)]/20 group-hover:blur-[100px]" />
          
          <Card className="relative overflow-hidden border border-[var(--border-strong)] bg-[#0a0a0b]/80 shadow-2xl shadow-black/50 backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 group-hover:shadow-[var(--secondary)]/10">
            <div className="relative z-10">
              <div className="flex items-center border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="cursor-pointer rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]">
                    <p className="text-xs text-[var(--text-muted)]">Upcoming</p>
                    <p className="mt-1 text-xl font-semibold">12</p>
                  </div>
                  <div className="cursor-pointer rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]">
                    <p className="text-xs text-[var(--text-muted)]">Due this week</p>
                    <p className="mt-1 text-xl font-semibold">5</p>
                  </div>
                  <div className="cursor-pointer rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left transition-colors hover:bg-[var(--surface-3)]">
                    <p className="text-xs text-[var(--text-muted)]">Saved</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--success-text)]">24</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[14px] border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-4 text-left">
                  <p className="mb-3 text-xs text-[var(--text-muted)]">Preview</p>
                  <div className="space-y-2">
                    <div className="cursor-pointer flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]">
                      <span className="text-sm">Spotify Premium</span>
                      <span className="text-xs text-[var(--text-muted)]">Renews in 3 days</span>
                    </div>
                    <div className="cursor-pointer flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]">
                      <span className="text-sm">Domain renewal</span>
                      <span className="text-xs text-[var(--text-muted)]">Due next week</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* --- 3. FEATURES GRID (WITH SCROLL REVEAL) --- */}
      <section 
        ref={featuresRef} 
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24"
      >
        <div className={`mb-12 text-center reveal-card ${isFeaturesVisible ? "is-visible" : ""}`}>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Everything you need to stay organized
          </h2>
          <p className="mt-4 text-[var(--text-body)]">
            Designed to keep your subscriptions and vaults in check.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* Card 1 */}
          <div className={`reveal-card delay-100 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)] ${isFeaturesVisible ? "is-visible" : ""}`}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">Smart Alerts</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Get notified before you get charged. Set custom alerts for upcoming renewals so you are never caught off guard.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`reveal-card delay-200 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)] ${isFeaturesVisible ? "is-visible" : ""}`}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-text)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">Secure Vault</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Keep your sensitive renewal dates, licensing info, and service contracts in an isolated, secure workspace.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`reveal-card delay-300 rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)] ${isFeaturesVisible ? "is-visible" : ""}`}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--secondary-text)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">Sync Anywhere</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Access your dashboard from your laptop or phone. Your data stays perfectly synced across all your devices.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)] backdrop-blur-sm">
        © 2026 RenewVault. All rights reserved.
      </footer>
    </main>
  );
}
