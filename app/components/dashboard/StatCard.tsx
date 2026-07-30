interface StatCardProps {
  label: string;
  value: number | string;
  accent?: boolean;
}

export default function StatCard({ label, value, accent = false }: StatCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-6 py-5">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p
        className={`mt-2 text-3xl font-bold ${
          accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}