import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-10 text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <section className="flex flex-col justify-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--text-muted)]">
              RenewVault
            </p>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
              Track renewals, due dates, and reminders in one place.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--text-body)]">
              A simple workspace to manage important dates and never miss a renewal.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-[var(--text-secondary)]">
              <p>Authentication with clean validation states.</p>
              <p>Google sign-in support will be added next.</p>
              <p>Built to stay minimal, readable, and scalable.</p>
            </div>
          </section>

          <div className="flex items-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}