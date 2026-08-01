import type { ReactNode } from "react";

export function AuthShell({
  children,
  centered = false,
}: {
  children: ReactNode;
  centered?: boolean;
}) {
  return (
    <main className="h-screen overflow-hidden bg-[var(--bg)] px-6 py-8 text-[var(--text-primary)]">
      <div
        className={`mx-auto grid h-full max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr] ${
          centered ? "content-center" : ""
        }`}
      >
        <section className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
          <span className="mb-4 w-fit rounded-full border border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            RenewVault
          </span>

          <h1 className="hidden max-w-xl text-3xl font-semibold leading-tight md:block md:text-4xl lg:text-5xl">
            Track renewals, due dates, and reminders{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--violet-glow)] bg-clip-text text-transparent">
              in one place.
            </span>
          </h1>

          <p className="mt-4 hidden max-w-lg text-sm leading-6 text-[var(--text-body)] md:block">
            A simple workspace to manage important dates and never miss a renewal.
          </p>

        </section>

        <div className="flex items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}