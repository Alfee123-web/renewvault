import { prisma } from "@/lib/prisma";
import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import RatesExplorer from "@/app/components/dashboard/RatesExplorer";

export const revalidate = 3600; // Cache on edge for 1 hour

// Rates older than this are flagged as possibly outdated
const STALE_AFTER_HOURS = 48;

export default async function ExchangeRatesPage() {
  const rates = await prisma.exchangeRate.findMany({
    orderBy: {
      currency: "asc",
    },
  });

  // Newest update across ALL rows (the first row alone can be older than the rest)
  const lastUpdated =
    rates.length > 0
      ? new Date(Math.max(...rates.map((r) => new Date(r.updatedAt).getTime())))
      : null;

  const ageHours = lastUpdated ? (Date.now() - lastUpdated.getTime()) / 36e5 : null;
  const isStale = ageHours !== null && ageHours > STALE_AFTER_HOURS;

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  // Only plain, serializable data goes to the client component
  const rateItems = rates.map((r) => ({
    id: r.id,
    currency: r.currency,
    rate: r.rate,
  }));

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />

      <div className="relative z-10 mx-auto max-w-6xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Exchange Rates
            </h1>
            <p className="text-sm text-zinc-400">
              Currency rates relative to <span className="font-medium text-white">USD</span>, used for
              multi-currency calculations.
            </p>
          </div>

          {updatedLabel && (
            <div
              className={`inline-flex flex-shrink-0 items-center gap-2 self-start whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${
                isStale
                  ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isStale ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                }`}
              />
              {isStale ? `May be outdated · Updated ${updatedLabel}` : `Updated: ${updatedLabel}`}
            </div>
          )}
        </div>

        {rateItems.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 p-8 text-center text-zinc-400 shadow-sm backdrop-blur-md">
            No exchange rates found. Run the update cron route to seed values.
          </div>
        ) : (
          <RatesExplorer rates={rateItems} />
        )}
      </div>
    </div>
  );
}