import { Renewal } from "@/lib/types";
import StatusBadge from "./StatusBadge";

function formatDueDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RenewalItem({ renewal }: { renewal: Renewal }) {
  return (
    <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] px-5 py-4 transition-colors hover:border-[var(--accent)]/50">
      <div>
        <p className="font-medium text-[var(--text-primary)]">{renewal.name}</p>
        <p className="text-sm text-[var(--text-muted)]">
          {renewal.category} · Due {formatDueDate(renewal.dueDate)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {renewal.amount != null && (
          <span className="text-sm text-[var(--text-secondary)]">
            {renewal.currency ?? "USD"} {renewal.amount.toFixed(2)}
          </span>
        )}
        <StatusBadge status={renewal.status} />
      </div>
    </div>
  );
}