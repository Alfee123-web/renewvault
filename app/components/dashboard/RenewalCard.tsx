"use client";

import { Renewal } from "@/lib/types";

interface RenewalCardProps {
  renewal: Renewal;
  onEdit: (renewal: Renewal) => void;
  onDelete: (id: string) => void;
  onMarkRenewed: (id: string) => void;
}

// --- ICONS ---
function CalendarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function EditIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>; }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>; }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>; }

export default function RenewalCard({
  renewal,
  onEdit,
  onDelete,
  onMarkRenewed,
}: RenewalCardProps) {
  // Format Date (e.g., "Aug 28, 2026")
  const formattedDate = new Date(renewal.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Format Currency
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: renewal.currency || "USD",
  }).format(renewal.amount);

  // Map the cycle to a shorthand label
  const cycleLabel = renewal.billingCycle === "yearly" ? "/yr" : "/mo";

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 hover:shadow-md transition-all relative overflow-hidden group">
      
      {/* Optional: Subtle Left Accent Border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5b5fd8]/50 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* --- TOP SECTION (Logo, Name, Category, Status) --- */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Logo / Favicon Engine */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 overflow-hidden">
            {renewal.websiteDomain ? (
              <img 
                src={`https://www.google.com/s2/favicons?domain=${renewal.websiteDomain}&sz=128`} 
                alt={`${renewal.name} logo`} 
                className="w-6 h-6 object-contain rounded-sm"
              />
            ) : (
              <span className="text-sm font-bold text-[#5b5fd8]">
                {renewal.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-white text-[15px] leading-tight">
              {renewal.name}
            </h3>
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">
              {renewal.category}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <span className="shrink-0 inline-flex items-center rounded-full bg-[#5b5fd8]/10 px-2.5 py-1 text-[11px] font-semibold text-[#8b8df1]">
          {renewal.status.charAt(0).toUpperCase() + renewal.status.slice(1)}
        </span>
      </div>

      {/* --- MIDDLE SECTION (Amount & Date) --- */}
      <div className="flex items-end justify-between mb-6 pb-6 border-b border-zinc-800/60">
        <div>
          <p className="text-2xl font-bold text-white flex items-baseline gap-1">
            {formattedAmount}
            <span className="text-sm font-medium text-zinc-500">{cycleLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <CalendarIcon />
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
      </div>

      {/* --- BOTTOM SECTION (Actions) --- */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => onMarkRenewed(renewal.id)}
          disabled={renewal.status === "renewed"}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
            renewal.status === "renewed"
              ? "bg-emerald-900/20 text-emerald-600/50 cursor-not-allowed border border-emerald-900/30"
              : "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 border border-emerald-800/50"
          }`}
        >
          <CheckIcon />
          {renewal.status === "renewed" ? "Renewed" : "Mark renewed"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(renewal)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Edit renewal"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => onDelete(renewal.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-900/30 bg-red-900/10 text-red-500 hover:bg-red-900/30 hover:text-red-400 transition-colors"
            title="Delete renewal"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      
    </div>
  );
}