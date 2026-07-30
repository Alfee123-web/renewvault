import { RenewalStatus } from "@/lib/types";

const STATUS_STYLES: Record<RenewalStatus, { label: string; className: string }> = {
  "upcoming": {
    label: "Upcoming",
    className: "text-[var(--text-muted)] border-[var(--border)]",
  },
  "due-soon": {
    label: "Due soon",
    className: "text-[var(--warning,#f59e0b)] border-[var(--warning,#f59e0b)]/40",
  },
  "overdue": {
    label: "Overdue",
    className: "text-[var(--danger,#ef4444)] border-[var(--danger,#ef4444)]/40",
  },
};

export default function StatusBadge({ status }: { status: RenewalStatus }) {
  const { label, className } = STATUS_STYLES[status];
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}