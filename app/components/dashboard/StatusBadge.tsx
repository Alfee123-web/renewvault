import { Renewal } from "@/lib/types";

interface StatusBadgeProps {
  status: Renewal["status"];
}

const statusConfig: Record<
  Renewal["status"],
  { label: string; className: string }
> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-[var(--secondary-soft)] text-[var(--secondary-text)]",
  },
  "due-soon": {
    label: "Due Soon",
    className: "bg-amber-500/10 text-amber-400",
  },
  overdue: {
    label: "Overdue",
    className: "bg-[var(--danger-soft)] text-[var(--danger-text)]",
  },
  renewed: {
    label: "Renewed",
    className: "bg-[var(--success-soft)] text-[var(--success-text)]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[var(--surface-3)] text-[var(--text-muted)]",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}