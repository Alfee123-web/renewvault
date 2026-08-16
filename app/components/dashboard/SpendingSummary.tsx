'use client';

import { useMemo } from 'react';
import { Renewal } from '@/lib/types';

// --- ICONS ---
function CalendarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function ActivityIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>; }
function RupeeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>; }

// Approximate exchange rates to INR
const EXCHANGE_RATES: Record<string, number> = {
  USD: 83.0,
  EUR: 90.0,
  GBP: 105.0,
  INR: 1.0,
};

interface SpendingSummaryProps {
  renewals: Renewal[];
  isLoading: boolean;
}

export default function SpendingSummary({ renewals, isLoading }: SpendingSummaryProps) {
  // Convert and aggregate all spending into unified INR
  const { totalMonthlyINR, totalYearlyINR, totalActive } = useMemo(() => {
    let monthlyINR = 0;
    let yearlyINR = 0;
    let active = 0;

    renewals.forEach((renewal) => {
      if (renewal.status !== 'cancelled') {
        active += 1;
        const currency = renewal.currency || 'USD';
        const rate = EXCHANGE_RATES[currency] || 1.0;
        
        // Convert amount to INR first
        const amountInINR = renewal.amount * rate;

        if (renewal.billingCycle === 'yearly') {
          monthlyINR += amountInINR / 12;
          yearlyINR += amountInINR;
        } else {
          monthlyINR += amountInINR;
          yearlyINR += amountInINR * 12;
        }
      }
    });

    return { totalMonthlyINR: monthlyINR, totalYearlyINR: yearlyINR, totalActive: active };
  }, [renewals]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8 animate-fade-in-up delay-100">
        {[1, 2, 3].map((i) => (
           <div key={i} className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 h-[104px] animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8 animate-fade-in-up delay-100">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        
        {/* Monthly Spend Card (Unified in INR) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">Monthly Spend (INR)</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-[var(--secondary-text)]">
              <RupeeIcon />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {formatINR(totalMonthlyINR)}
          </p>
        </div>

        {/* Yearly Spend Card (Unified in INR) */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">Yearly Spend (INR)</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-amber-400">
              <CalendarIcon />
            </span>
          </div>
          <p className="text-3xl font-bold text-amber-400 mt-3">
            {formatINR(totalYearlyINR)}
          </p>
        </div>

        {/* Active Subscriptions Card */}
        <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">Active Renewals</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 text-[#4338ca]">
              <ActivityIcon />
            </span>
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {totalActive}
          </p>
        </div>

      </div>
    </div>
  );
}