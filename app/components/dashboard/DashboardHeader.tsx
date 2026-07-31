"use client";

interface DashboardHeaderProps {
  onAddClick: () => void;
}

export default function DashboardHeader({ onAddClick }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs tracking-widest text-[var(--text-muted)]">RENEWVAULT</p>
        <h1 className="mt-1 text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
      </div>
      <button
        onClick={onAddClick}
        className="rounded-[var(--radius-lg)] bg-[var(--accent)] px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90"
      >
        + Add renewal
      </button>
    </div>
  );
}