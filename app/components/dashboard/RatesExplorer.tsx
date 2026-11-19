"use client";

import { useEffect, useMemo, useState } from "react";

export interface RateItem {
  id: string;
  currency: string;
  rate: number;
}

interface RatesExplorerProps {
  rates: RateItem[];
}

const DEFAULT_PINNED = ["USD", "INR", "EUR", "GBP"];
const STORAGE_KEY = "renewvault:pinned-currencies";

// --- HELPERS ---
let displayNames: Intl.DisplayNames | null = null;
try {
  displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
} catch {
  displayNames = null;
}

function currencyName(code: string): string {
  try {
    return displayNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

const rateFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

function formatResult(value: number): string {
  const maxDigits = Math.abs(value) < 1 ? 4 : 2;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDigits,
  }).format(value);
}

// --- ICONS ---
function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function SwapIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>; }
function StarIcon({ filled }: { filled: boolean }) { return <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>; }
function XIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }

// --- RATE CARD ---
function RateCard({
  code,
  rate,
  isPinned,
  isTarget,
  onSelect,
  onTogglePin,
}: {
  code: string;
  rate: number;
  isPinned: boolean;
  isTarget: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow-sm backdrop-blur-md transition-all cursor-pointer focus:outline-none focus-visible:border-[#5b5fd8] ${
        isTarget
          ? "border-[#5b5fd8]/60 bg-[#5b5fd8]/5"
          : "border-zinc-800 bg-[#121214]/80 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-bold tracking-wide text-white">{code}</p>
          <p className="mt-0.5 truncate text-[11px] text-zinc-500">{currencyName(code)}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          aria-label={isPinned ? `Unpin ${code}` : `Pin ${code}`}
          title={isPinned ? "Unpin" : "Pin to top"}
          className={`-mr-1.5 -mt-1.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isPinned ? "text-amber-400" : "text-zinc-600 hover:text-zinc-300"
          }`}
        >
          <StarIcon filled={isPinned} />
        </button>
      </div>

      <div className="mt-4">
        <p className="font-mono text-lg font-semibold text-zinc-100 transition-colors group-hover:text-white sm:text-xl">
          {rateFormatter.format(rate)}
        </p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          per 1 USD
        </p>
      </div>
    </div>
  );
}

// --- MAIN ---
export default function RatesExplorer({ rates }: RatesExplorerProps) {
  // USD is the base, so it is always 1 even if it has no row in the table
  const rateMap = useMemo(() => {
    const map: Record<string, number> = { USD: 1 };
    rates.forEach((r) => {
      map[r.currency] = r.rate;
    });
    return map;
  }, [rates]);

  const codes = useMemo(() => Object.keys(rateMap).sort(), [rateMap]);

  const [query, setQuery] = useState("");
  const [pinned, setPinned] = useState<string[]>(DEFAULT_PINNED);
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState(
    codes.includes("INR") ? "INR" : codes.find((c) => c !== "USD") ?? "USD"
  );

  // Load saved pins (per device) after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPinned(parsed.filter((c): c is string => typeof c === "string"));
        }
      }
    } catch {
      // storage unavailable: defaults are fine
    }
  }, []);

  const togglePin = (code: string) => {
    const next = pinned.includes(code) ? pinned.filter((c) => c !== code) : [...pinned, code];
    setPinned(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // --- CONVERTER ---
  const numericAmount = parseFloat(amount);
  const hasRates = rateMap[from] !== undefined && rateMap[to] !== undefined;
  const converted =
    hasRates && numericAmount > 0 ? (numericAmount / rateMap[from]) * rateMap[to] : null;
  const unitRate = hasRates ? rateMap[to] / rateMap[from] : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  // --- SEARCH & GROUPS ---
  const q = query.trim().toLowerCase();
  const matches = (code: string) =>
    !q || code.toLowerCase().includes(q) || currencyName(code).toLowerCase().includes(q);

  const pinnedCodes = pinned.filter((c) => rateMap[c] !== undefined && matches(c));
  const otherCodes = codes.filter((c) => !pinned.includes(c) && matches(c));
  const nothingFound = pinnedCodes.length === 0 && otherCodes.length === 0;

  const gridClass =
    "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6";

  const selectClass =
    "w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-sm font-semibold text-white focus:outline-none focus:border-[#5b5fd8] transition-colors cursor-pointer [&>option]:bg-[#121214]";

  return (
    <div className="space-y-8">
      {/* --- CONVERTER --- */}
      <section className="rounded-2xl border border-zinc-800 bg-[#121214]/80 p-4 sm:p-6 shadow-sm backdrop-blur-md">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Quick converter
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_2fr] md:gap-4">
          <div>
            <label htmlFor="rates-amount" className="sr-only">Amount</label>
            <input
              id="rates-amount"
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-lg font-semibold text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5b5fd8] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="rates-from" className="sr-only">From currency</label>
            <select id="rates-from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
              {codes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={swap}
              aria-label="Swap currencies"
              title="Swap"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-[#5b5fd8]/60 hover:text-white cursor-pointer"
            >
              <SwapIcon />
            </button>

            <label htmlFor="rates-to" className="sr-only">To currency</label>
            <select id="rates-to" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
              {codes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#5b5fd8]/20 bg-[#5b5fd8]/5 px-4 py-4">
          {converted !== null ? (
            <>
              <p className="text-xs text-zinc-400">
                {formatResult(numericAmount)} {from} =
              </p>
              <p className="mt-1 break-words font-mono text-2xl font-bold text-white sm:text-3xl">
                {formatResult(converted)} <span className="text-lg font-semibold text-[#8b8df1]">{to}</span>
              </p>
              {unitRate !== null && (
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  1 {from} = {rateFormatter.format(unitRate)} {to}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500">Enter an amount to see the converted value.</p>
          )}
        </div>
        <p className="mt-3 text-[11px] text-zinc-600">Tip: tap any currency card below to set it as the target.</p>
      </section>

      {/* --- SEARCH --- */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search currency (e.g. INR or Euro)..."
          className="w-full rounded-xl border border-zinc-800 bg-[#121214]/80 py-3 pl-11 pr-10 text-sm text-white placeholder:text-zinc-500 backdrop-blur-md focus:outline-none focus:border-[#5b5fd8] transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* --- PINNED --- */}
      {pinnedCodes.length > 0 && (
        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            Pinned
          </h2>
          <div className={gridClass}>
            {pinnedCodes.map((code) => (
              <RateCard
                key={code}
                code={code}
                rate={rateMap[code]}
                isPinned
                isTarget={to === code}
                onSelect={() => setTo(code)}
                onTogglePin={() => togglePin(code)}
              />
            ))}
          </div>
        </section>
      )}

      {/* --- ALL CURRENCIES --- */}
      {otherCodes.length > 0 && (
        <section>
          <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
            {q ? "Results" : "All currencies"} · {otherCodes.length}
          </h2>
          <div className={gridClass}>
            {otherCodes.map((code) => (
              <RateCard
                key={code}
                code={code}
                rate={rateMap[code]}
                isPinned={false}
                isTarget={to === code}
                onSelect={() => setTo(code)}
                onTogglePin={() => togglePin(code)}
              />
            ))}
          </div>
        </section>
      )}

      {nothingFound && (
        <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 p-8 text-center text-sm text-zinc-400 backdrop-blur-md">
          No currency matches &ldquo;{query}&rdquo;. Try a code like USD or a name like Euro.
        </div>
      )}
    </div>
  );
}