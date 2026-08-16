"use client";

import { useState } from "react";
import { Renewal } from "@/lib/types";

// --- ICONS ---
function ChevronLeftIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>; }
function ChevronRightIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>; }

interface CalendarViewProps {
  renewals: Renewal[];
  onEdit: (renewal: Renewal) => void;
}

export default function CalendarView({ renewals, onEdit }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Math
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to match renewal string dates (YYYY-MM-DD) with calendar days
  const formatDateString = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const todayString = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md shadow-sm overflow-hidden animate-fade-in-up delay-300">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-5 border-b border-zinc-800/60">
        <h2 className="text-lg font-bold text-white">
          {monthName} <span className="text-zinc-500 font-medium">{year}</span>
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
            Today
          </button>
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <button onClick={prevMonth} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer">
              <ChevronLeftIcon />
            </button>
            <div className="w-px h-4 bg-zinc-800"></div>
            <button onClick={nextMonth} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer">
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-zinc-800/60 bg-zinc-900/30">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-2.5 text-center text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {/* Empty padding days before the 1st of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="min-h-[100px] p-2 border-b border-r border-zinc-800/30 bg-[#121214]/40" />
        ))}

        {/* Actual days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateString = formatDateString(year, month, day);
          const isToday = dateString === todayString;
          
          // Find renewals due on this exact date
          const daysRenewals = renewals.filter((r) => r.dueDate === dateString);

          return (
            <div 
              key={day} 
              className={`min-h-[100px] p-2 border-b border-r border-zinc-800/30 transition-colors ${isToday ? 'bg-[#5b5fd8]/5' : 'hover:bg-zinc-900/30'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#5b5fd8] text-white' : 'text-zinc-400'}`}>
                  {day}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 mt-1">
                {daysRenewals.map((renewal) => (
                  <button
                    key={renewal.id}
                    onClick={() => onEdit(renewal)}
                    className="text-left w-full truncate px-1.5 py-1 text-[10px] font-medium rounded bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 hover:bg-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {renewal.websiteDomain ? (
                      <img src={`https://www.google.com/s2/favicons?domain=${renewal.websiteDomain}&sz=32`} alt="" className="w-3 h-3 rounded-sm object-contain" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5b5fd8]" />
                    )}
                    <span className="truncate">{renewal.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}