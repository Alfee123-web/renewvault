import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import EmptyState from "@/app/components/dashboard/EmptyState";
import StatusBadge from "@/app/components/dashboard/StatusBadge";
import { getRenewals } from "@/app/actions/renewals";

// --- ICONS ---
function RenewalsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
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

// --- HELPERS ---
const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function RenewalsPage() {
  // Fetch data securely on the server
  const renewals = await getRenewals();

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHeader
          title="Renewals"
          description="A full history and list of every renewal you're tracking."
        />

        {renewals.length === 0 ? (
          <EmptyState
            icon={<RenewalsIcon />}
            title="No renewals found"
            description="You aren't tracking any renewals yet. Head back to the dashboard to add your first one."
          />
        ) : (
          <div className="mt-8 animate-fade-in-up">
            
            {/* --- MOBILE & TABLET VIEW: Vertical Cards (Hidden on lg+ screens) --- */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {renewals.map((renewal) => (
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
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Due Date</span>
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <CalendarIcon />
                        {formatDate(renewal.dueDate)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Amount</span>
                      <span className="font-semibold text-white">{formatAmount(renewal.amount, renewal.currency)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Reminder</span>
                      {renewal.reminderEnabled && renewal.reminderDaysBefore && renewal.reminderDaysBefore.length > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-[#4338ca]/10 px-2 py-1 text-[11px] font-semibold text-[#5b5fd8] border border-[#4338ca]/20">
                          {renewal.reminderDaysBefore.join(', ')} {renewal.reminderDaysBefore.length === 1 && renewal.reminderDaysBefore[0] === 1 ? 'day' : 'days'} before
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
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
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Reminder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {renewals.map((renewal) => (
                      <tr key={renewal.id} className="transition-colors hover:bg-zinc-800/40">
                        <td className="px-6 py-4 font-medium text-white">{renewal.name}</td>
                        <td className="px-6 py-4 text-zinc-400">{renewal.category}</td>
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
                        <td className="px-6 py-4 text-center">
                          {renewal.reminderEnabled && renewal.reminderDaysBefore && renewal.reminderDaysBefore.length > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-[#4338ca]/10 px-2 py-1.5 text-[11px] font-semibold text-[#5b5fd8] border border-[#4338ca]/20">
                              {renewal.reminderDaysBefore.join(', ')} {renewal.reminderDaysBefore.length === 1 && renewal.reminderDaysBefore[0] === 1 ? 'day' : 'days'} before
                            </span>
                          ) : (
                            <span className="text-zinc-600">-</span>
                          )}
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