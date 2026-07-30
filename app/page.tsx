import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

export default function Home() {
  return (
    <main className="relative flex flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      {/* --- BACKGROUND ELEMENTS --- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="pointer-events-none absolute top-[25vh] right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--accent)]/10 blur-[150px]" />

      {/* --- HERO SECTION (Single Page Screen) --- */}
      {/* Changed to min-h-screen to force this section to take up the entire first view */}
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-8 lg:flex-row lg:justify-between lg:gap-16">
        
        {/* --- LEFT SIDE: Text & CTA --- */}
        <div className="flex w-full flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
          <p className="mb-6 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs tracking-[0.2em] text-[var(--text-muted)]">
            RENEWVAULT 1.0
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Track renewals, due dates, and reminders{" "}
            <span className="mt-2 block bg-gradient-to-r from-[var(--accent)] to-amber-500 bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--text-body)] sm:text-lg">
            A simple workspace to manage important dates and never miss a renewal.
          </p>

          <div className="mt-8 flex flex-row items-center gap-4">
            <Button className="h-11 px-8 text-base shadow-lg shadow-[var(--accent)]/20">
              Get started
            </Button>
            <Button variant="secondary" className="h-11 px-8 text-base">
              Sign in
            </Button>
          </div>
        </div>

        {/* --- RIGHT SIDE: Mock App Window --- */}
        <div className="relative w-full max-w-2xl lg:w-1/2">
          <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-[var(--accent)]/5 blur-[80px]" />
          
          <Card className="overflow-hidden border border-[var(--border-strong)] bg-[#0a0a0b] shadow-2xl shadow-black/50">
            <div className="relative z-10">
              {/* Mock App Window Header */}
              <div className="flex items-center border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              {/* App Content */}
              <div className="p-4 sm:p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                    <p className="text-xs text-[var(--text-muted)]">Upcoming</p>
                    <p className="mt-1 text-xl font-semibold">12</p>
                  </div>
                  <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                    <p className="text-xs text-[var(--text-muted)]">
                      Due this week
                    </p>
                    <p className="mt-1 text-xl font-semibold">5</p>
                  </div>
                  <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                    <p className="text-xs text-[var(--text-muted)]">Saved</p>
                    <p className="mt-1 text-xl font-semibold">24</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[14px] border border-dashed border-[var(--border-strong)] bg-[var(--bg)] p-4 text-left">
                  <p className="mb-3 text-xs text-[var(--text-muted)]">Preview</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]">
                      <span className="text-sm">Spotify Premium</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        Renews in 3 days
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--border-strong)]">
                      <span className="text-sm">Domain renewal</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        Due next week
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* --- 3. FEATURES GRID --- */}
      {/* Because the hero is exactly 100vh, this starts perfectly below the fold */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Everything you need to stay organized
          </h2>
          <p className="mt-4 text-[var(--text-body)]">
            Designed to keep your subscriptions and vaults in check.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Smart Alerts
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Get notified before you get charged. Set custom alerts for upcoming renewals so you are never caught off guard.
            </p>
          </div>

          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Secure Vault
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Keep your sensitive renewal dates, licensing info, and service contracts in an isolated, secure workspace.
            </p>
          </div>

          <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-colors hover:border-[var(--border-strong)]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            </div>
            <h3 className="text-base font-medium text-[var(--text-primary)]">
              Sync Anywhere
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
              Access your dashboard from your laptop or phone. Your data stays perfectly synced across all your devices.
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)]">
        © 2026 RenewVault. All rights reserved.
      </footer>
    </main>
  );
}