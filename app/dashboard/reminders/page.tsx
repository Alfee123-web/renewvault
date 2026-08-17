import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import EmptyState from "@/app/components/dashboard/EmptyState";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import { getRenewals } from "@/app/actions/renewals";

// --- ICONS ---
function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// --- HELPERS ---
const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Calculates the exact dates the reminder should trigger (Handles arrays!)
function getAlertDate(dueDate: string, daysBefore: number[] | any) {
  if (!daysBefore || !Array.isArray(daysBefore) || daysBefore.length === 0) return formatDate(dueDate);
  
  // Sort descending (e.g. 30, 7, 1) so the earliest calendar date appears first in the UI list
  const sortedDays = [...daysBefore].sort((a, b) => b - a);
  
  return sortedDays.map(days => {
    const date = new Date(dueDate);
    date.setDate(date.getDate() - days);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }).join(", ");
}

export default async function RemindersPage() {
  const allRenewals = await getRenewals();
  
  // Filter for ONLY renewals that have reminders enabled, and sort by the Earliest Alert Date
  const reminders = allRenewals
    .filter((r) => r.reminderEnabled && Array.isArray(r.reminderDaysBefore) && r.reminderDaysBefore.length > 0)
    .sort((a, b) => {
      const aMaxDays = Math.max(...(a.reminderDaysBefore || [0]));
      const dateA = new Date(a.dueDate);
      dateA.setDate(dateA.getDate() - aMaxDays);
      
      const bMaxDays = Math.max(...(b.reminderDaysBefore || [0]));
      const dateB = new Date(b.dueDate);
      dateB.setDate(dateB.getDate() - bMaxDays);
      
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHeader
          title="Reminders"
          description="Manage upcoming alerts for your renewals."
        />

        {reminders.length === 0 ? (
          <EmptyState
            icon={<BellIcon />}
            title="No active reminders"
            description="You haven't configured any reminders yet. Edit a renewal to enable alerts."
          />
        ) : (
          <div className="mt-8 animate-fade-in-up">
            
            {/* --- MOBILE & TABLET VIEW: Vertical Cards (Hidden on lg+ screens) --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {reminders.map((renewal) => (
                <div key={renewal.id} className="rounded-2xl border border-zinc-800/80 bg-[#121214]/90 p-5 shadow-sm backdrop-blur-md">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between border-b border-zinc-800/50 pb-4">
                    <div>
                      <h3 className="font-semibold text-white text-base">{renewal.name}</h3>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500 font-medium">{renewal.category}</p>
                    </div>
                    <StatusBadge status={renewal.status} />
                  </div>

                  {/* Card Body */}
                  <div className="mt-4 flex flex-col gap-3 text-sm">
                    
                    {/* Highlighted Alert Dates (Stacked Vertically for Readability) */}
                    <div className="flex flex-col gap-1.5 rounded-lg bg-amber-500/5 border border-amber-500/15 p-3">
                      <div className="flex items-center gap-1.5 text-amber-500 font-medium text-xs">
                        <AlertIcon />
                        <span>Alert Dates</span>
                      </div>
                      <div className="font-semibold text-amber-500 text-sm pl-5 leading-relaxed">
                        {getAlertDate(renewal.dueDate, renewal.reminderDaysBefore)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1 pt-1">
                      <span className="text-zinc-500">Renews On</span>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <CalendarIcon />
                        {formatDate(renewal.dueDate)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <span className="text-zinc-500">Amount</span>
                      <span className="font-semibold text-white">{formatAmount(renewal.amount, renewal.currency)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- DESKTOP VIEW: Table (Hidden below lg screens) --- */}
            <div className="hidden overflow-hidden rounded-2xl border border-zinc-800 bg-[#121214]/80 shadow-sm backdrop-blur-md lg:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300 whitespace-nowrap">
                  <thead className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-amber-500/90">Alert Dates</th>
                      <th className="px-6 py-4">Renewal Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {reminders.map((renewal) => (
                      <tr key={renewal.id} className="transition-colors hover:bg-zinc-800/40">
                        <td className="px-6 py-4 font-medium text-white">{renewal.name}</td>
                        <td className="px-6 py-4 text-zinc-400">{renewal.category}</td>
                        
                        {/* Highlighted Alert Dates */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-medium text-amber-500">
                            <AlertIcon />
                            {getAlertDate(renewal.dueDate, renewal.reminderDaysBefore)}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            {formatDate(renewal.dueDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          {formatAmount(renewal.amount, renewal.currency)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={renewal.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}