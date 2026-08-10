"use client";

import { Renewal } from "@/lib/types";

interface RenewalCardProps {
  renewal: Renewal;
  onEdit: (renewal: Renewal) => void;
  onDelete: (id: string) => void;
  onMarkRenewed: (id: string) => void;
}

const STATUS_STYLES: Record<Renewal["status"], string> = {
  upcoming: "bg-[var(--secondary-soft)] text-[var(--secondary-text)]",
  "due-soon": "bg-amber-500/10 text-amber-400",
  overdue: "bg-[var(--danger-soft)] text-[var(--danger-text)]",
  renewed: "bg-[var(--success-soft)] text-[var(--success-text)]",
  cancelled: "bg-[var(--surface-3)] text-[var(--text-muted)]",
};

const STATUS_LABELS: Record<Renewal["status"], string> = {
  upcoming: "Upcoming",
  "due-soon": "Due Soon",
  overdue: "Overdue",
  renewed: "Renewed",
  cancelled: "Cancelled",
};

const STATUS_BORDER_COLORS: Record<Renewal["status"], string> = {
  upcoming: "border-l-[var(--secondary)]",
  "due-soon": "border-l-amber-400",
  overdue: "border-l-[var(--danger)]",
  renewed: "border-l-[var(--success)]",
  cancelled: "border-l-[var(--border-strong)]",
};

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export default function RenewalCard({ renewal, onEdit, onDelete, onMarkRenewed }: RenewalCardProps) {
  const isRenewed = renewal.status === "renewed";

  return (
    <div
      className={`group flex flex-col rounded-2xl border border-[var(--border)] border-l-4 ${STATUS_BORDER_COLORS[renewal.status]} bg-[var(--surface)]/80 backdrop-blur-md p-5 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--border-strong)] hover:border-l-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-[var(--text-primary)]">{renewal.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">{renewal.category}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[renewal.status]}`}>
          {STATUS_LABELS[renewal.status]}
        </span>
      </div>

      <div className="my-4 h-px bg-[var(--border)]" />

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[var(--text-primary)]">{formatAmount(renewal.amount, renewal.currency)}</span>
        <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
          <CalendarIcon />
          {formatDate(renewal.dueDate)}
        </span>
      </div>

      <div className="my-4 h-px bg-[var(--border)]" />
<div className="flex flex-col gap-2 xs:flex-row xs:items-center">
  <button
    onClick={() => onMarkRenewed(renewal.id)}
    disabled={isRenewed}
    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--success)]/30 bg-[var(--success-soft)] px-3 py-2 text-xs font-semibold text-[var(--success-text)] transition-colors hover:bg-[var(--success)]/20 disabled:cursor-not-allowed disabled:opacity-50 xs:flex-1"
  >
    <CheckIcon />
    {isRenewed ? "Renewed" : "Mark renewed"}
  </button>
  <div className="flex items-center gap-2 self-end xs:self-auto">
    <button onClick={() => onEdit(renewal)} aria-label="Edit renewal" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">
      <EditIcon />
    </button>
    <button onClick={() => onDelete(renewal.id)} aria-label="Delete renewal" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--danger)]/30 text-[var(--danger-text)] transition-colors hover:bg-[var(--danger-soft)]">
      <TrashIcon />
    </button>
  </div>
</div>
    </div>
  );
}