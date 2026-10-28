import {prisma} from "@/lib/prisma";

export const revalidate = 3600; // Cache on edge for 1 hour

export default async function ExchangeRatesPage() {
  const rates = await prisma.exchangeRate.findMany({
    orderBy: {
      currency: "asc",
    },
  });

  const lastUpdated = rates.length > 0 ? rates[0].updatedAt : new Date();

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      {/* Complete Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[var(--bg)]">
        <div className="absolute inset-0 animate-mesh-sweep opacity-40"></div>
        <div className="absolute inset-0 animate-pan-grid opacity-15" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 0L0 0L0 36' fill='none' stroke='%234338ca' stroke-opacity='0.2' stroke-width='1'/%3E%3C/svg%3E")` }}></div>
        <div className="animate-float-a absolute top-[10vh] right-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/4 rounded-full bg-[var(--accent)]/10 blur-[150px]" />
        <div className="animate-float-b absolute top-[50vh] left-0 h-[420px] w-[420px] -translate-x-1/3 rounded-full bg-[var(--secondary)]/12 blur-[150px]" />
        <div className="animate-float-c absolute top-[80vh] right-[10%] h-[300px] w-[300px] rounded-full bg-[var(--violet-glow)]/8 blur-[140px]" />
        <div className="meteor-trail meteor-1" />
        <div className="meteor-trail meteor-2" />
        <div className="meteor-trail meteor-3" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
              Live Exchange Rates
            </h1>
            <p className="text-sm text-gray-400">
              Real-time currency rates relative to <span className="text-white font-medium">USD</span> used for multi-currency calculations.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Updated: {lastUpdated.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </div>
        </div>

        {/* Grid Display */}
        {rates.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-8 text-center text-zinc-400 shadow-sm">
            No exchange rates found. Run the update cron route to seed values.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {rates.map((rate) => (
              <div
                key={rate.id}
                className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm transition-colors hover:border-zinc-700 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white tracking-wide">
                    {rate.currency}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-500 uppercase">
                    / USD
                  </span>
                </div>
                <div className="mt-3">
                  <p className="font-mono text-lg font-semibold text-zinc-200 group-hover:text-white transition-colors">
                    {rate.rate.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}