'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Renewal } from '@/lib/types';
import { getExchangeRates } from '@/app/actions/rates';

// --- ICONS ---
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function ActivityIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>; }
function TrendingUpIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>; }
function ChevronDownIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹', USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', JPY: '¥', CNY: '¥'
};

interface SpendingSummaryProps {
  renewals: Renewal[];
  isLoading: boolean;
}

export default function SpendingSummary({ renewals, isLoading }: SpendingSummaryProps) {
  const [currency, setCurrency] = useState<string>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1.0 });
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['USD']);

  useEffect(() => {
    async function loadRates() {
      const rates = await getExchangeRates();
      setExchangeRates(rates);
      setAvailableCurrencies(Object.keys(rates).sort());
    }
    loadRates();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { totalMonthlyBase, totalYearlyBase, totalActive, monthlyTrendBase } = useMemo(() => {
    let monthlyBase = 0;
    let yearlyBase = 0;
    let active = 0;
    let previousMonthBase = 0;

    const now = new Date();
    const currentAbsoluteMonth = now.getFullYear() * 12 + now.getMonth();

    renewals.forEach((renewal) => {
      if (renewal.status !== 'cancelled') {
        active += 1;
        const renewalCurrency = renewal.currency || 'USD';
        const rate = exchangeRates[renewalCurrency] || 1.0;
        const amountInBase = renewal.amount / rate;

        const monthlyContribution = renewal.billingCycle === 'yearly' ? amountInBase / 12 : amountInBase;
        const yearlyContribution = renewal.billingCycle === 'yearly' ? amountInBase : amountInBase * 12;

        monthlyBase += monthlyContribution;
        yearlyBase += yearlyContribution;

        const createdDate = renewal.createdAt ? new Date(renewal.createdAt) : new Date();
        const createdAbsoluteMonth = createdDate.getFullYear() * 12 + createdDate.getMonth();

        if (createdAbsoluteMonth < currentAbsoluteMonth) {
          previousMonthBase += monthlyContribution;
        }
      }
    });

    const trend = monthlyBase - previousMonthBase;

    return { 
      totalMonthlyBase: monthlyBase, 
      totalYearlyBase: yearlyBase, 
      totalActive: active,
      monthlyTrendBase: trend
    };
  }, [renewals, exchangeRates]);

  const formatAmount = (amountInBase: number) => {
    const targetRate = exchangeRates[currency] || 1.0;
    const finalAmount = amountInBase * targetRate;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(finalAmount);
  };

  if (isLoading || Object.keys(exchangeRates).length === 1) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-8 animate-fade-in-up delay-100 relative z-50">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 h-[160px] animate-pulse"></div>
        <div className="flex flex-col gap-4">
           <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 h-[72px] animate-pulse"></div>
           <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 h-[72px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 animate-fade-in-up delay-100 relative z-50">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        
        {/* Monthly Spend Card */}
        <div className="lg:col-span-2 min-w-0 rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 sm:p-6 shadow-sm hover:border-zinc-700 transition-colors flex flex-col justify-between relative group z-20">
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#4338ca]/10 rounded-full blur-2xl group-hover:bg-[#4338ca]/20 transition-all duration-500" />
          </div>
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
              <div>
                <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase leading-snug">
                  Monthly Spend
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 tracking-tight truncate" title={formatAmount(totalMonthlyBase)}>
                  {formatAmount(totalMonthlyBase)}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 bg-[#1a1827] hover:bg-[#221f35] text-zinc-200 text-xs font-medium border border-indigo-500/40 hover:border-indigo-500 rounded-lg px-2.5 py-1.5 outline-none transition-all shadow-sm cursor-pointer"
                  >
                    <span>{currency}</span>
                    <span className={`transition-transform duration-200 text-indigo-400 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDownIcon />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-24 sm:w-28 max-h-56 overflow-y-auto rounded-xl bg-[#161521]/95 border border-indigo-500/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] z-[100] py-1.5 backdrop-blur-2xl animate-fade-in [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {availableCurrencies.map((cur) => (
                        <button
                          key={cur}
                          onClick={() => {
                            setCurrency(cur);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            currency === cur 
                              ? 'bg-[#4338ca] text-white' 
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-sm font-semibold text-zinc-300">
                  {CURRENCY_SYMBOLS[currency] || currency.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400">
            <span className={`inline-flex items-center gap-1 font-semibold ${monthlyTrendBase >= 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>
              <TrendingUpIcon />
              {monthlyTrendBase >= 0 ? `+${formatAmount(monthlyTrendBase)}` : formatAmount(monthlyTrendBase)}
            </span>
            <span>vs last month budget burn</span>
          </div>
        </div>

        {/* Right Stack: Yearly Spend & Active Renewals Cards */}
        <div className="flex flex-col gap-4 relative z-10">
          
          <div className="min-w-0 rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase leading-snug">
                Yearly Spend
              </p>
              <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 truncate" title={formatAmount(totalYearlyBase)}>
                {formatAmount(totalYearlyBase)}
              </p>
            </div>
            <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-amber-400">
              <CalendarIcon />
            </span>
          </div>

          <div className="min-w-0 rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase leading-snug">
                Active Renewals
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                {totalActive}
              </p>
            </div>
            <span className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-[#4338ca]">
              <ActivityIcon />
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}