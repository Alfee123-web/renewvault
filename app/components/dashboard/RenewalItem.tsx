"use client";

import { Renewal } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface RenewalItemProps {
  renewal: Renewal;
  onEdit: (renewal: Renewal) => void;
  onDelete: (id: string) => void;
  onMarkRenewed: (id: string) => void;
}

export default function RenewalItem({
  renewal,
  onEdit,
  onDelete,
  onMarkRenewed,
}: RenewalItemProps) {
  const formattedDate = new Date(renewal.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md p-5 hover:border-[#5b5fd8]/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      
      {/* Top Section: Title & Status */}
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="min-w-0">
          <p className="font-bold text-base text-[var(--text-primary)] leading-tight mb-1 truncate">
            {renewal.name}
          </p>
          <p className="text-[10px] font-bold text-[#888] uppercase tracking-widest truncate">
            {renewal.category}
          </p>
        </div>
        <div className="shrink-0 scale-90 origin-top-right">
          <StatusBadge status={renewal.status} />
        </div>
      </div>

      {/* Middle Section: Price & Due Date */}
      <div className="py-4 border-y border-[var(--border)]/60 my-2">
        <p className="text-2xl font-bold text-[var(--text-primary)] flex items-baseline gap-1">
          <span className="text-xs font-medium text-[#888]">{renewal.currency}</span>
          {renewal.amount.toFixed(2)}
        </p>
        <p className="text-xs font-medium text-[#888] mt-1.5 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Due {formattedDate}
        </p>
      </div>

      {/* Bottom Section: Actions */}
      <div className="flex items-center gap-2 mt-3">
        {renewal.status !== "renewed" && (
          <button
            onClick={() => onMarkRenewed(renewal.id)}
            className="flex-1 rounded-lg border border-[var(--border)] py-2 text-[11px] font-semibold text-[var(--text-primary)] hover:text-[#5b5fd8] hover:border-[#5b5fd8] transition-colors cursor-pointer"
            title="Mark as renewed"
          >
            ✓ Renewed
          </button>
        )}
        <button
          onClick={() => onEdit(renewal)}
          className="flex-1 rounded-lg border border-[var(--border)] py-2 text-[11px] font-semibold text-[#888] hover:text-white hover:border-[#666] transition-colors cursor-pointer"
          title="Edit renewal"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(renewal.id)}
          className="flex-1 rounded-lg border border-[var(--border)] py-2 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors cursor-pointer"
          title="Delete renewal"
        >
          Delete
        </button>
      </div>
    </div>
  );
}