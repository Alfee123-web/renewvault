import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] px-4 text-[var(--text-primary)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-[140px]" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center text-center">
        <p className="mb-4 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1 text-xs tracking-[0.25em] text-[var(--text-muted)]">
          RenewVault
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
          Track renewals, due dates, and reminders in one place.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-body)] md:text-lg">
          A simple workspace to manage important dates and never miss a renewal.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button>Get started</Button>
          <Button variant="secondary">Sign in</Button>
        </div>

        <div className="mt-12 w-full max-w-4xl">
          <Card>
            <div className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                  <p className="text-sm text-[var(--text-muted)]">Upcoming</p>
                  <p className="mt-2 text-2xl font-semibold">12</p>
                </div>
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                  <p className="text-sm text-[var(--text-muted)]">Due this week</p>
                  <p className="mt-2 text-2xl font-semibold">5</p>
                </div>
                <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left">
                  <p className="text-sm text-[var(--text-muted)]">Saved reminders</p>
                  <p className="mt-2 text-2xl font-semibold">24</p>
                </div>
              </div>

              <div className="mt-4 rounded-[14px] border border-dashed border-[var(--border)] bg-[var(--bg)] p-6 text-left">
                <p className="text-sm text-[var(--text-muted)]">Preview</p>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <span>Spotify Premium</span>
                    <span className="text-sm text-[var(--text-muted)]">Renews in 3 days</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                    <span>Domain renewal</span>
                    <span className="text-sm text-[var(--text-muted)]">Due next week</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}