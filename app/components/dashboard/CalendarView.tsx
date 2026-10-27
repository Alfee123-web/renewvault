"use client";

import { useState } from "react";
import { Renewal } from "@/lib/types";

// --- ICONS ---
function ChevronLeftIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>; }
function ChevronRightIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>; }
function CloseIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }

interface CalendarViewProps {
  renewals: Renewal[];
  onEdit: (renewal: Renewal) => void;
  onSelectDate: (dateString: string) => void;
}

export default function CalendarView({ renewals, onEdit, onSelectDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatDateString = (y: number, m: number, d: number) => {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const todayString = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const selectedDayRenewals = selectedDay ? renewals.filter((r) => r.dueDate === selectedDay) : [];

  const DOT_COLORS = ["var(--accent)", "var(--ember)", "var(--success)", "var(--secondary-text)"];

  return (
    <div
      className="relative rounded-2xl backdrop-blur-md shadow-sm overflow-hidden animate-fade-in-up delay-300"
      style={{ border: "1px solid var(--border)", background: "color-mix(in srgb, var(--surface) 80%, transparent)" }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 sm:p-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          {monthName} <span style={{ color: "var(--text-muted)" }} className="font-medium">{year}</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            style={{ color: "var(--text-secondary)", background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            Today
          </button>
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}>
            <button onClick={prevMonth} className="p-1.5 transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <ChevronLeftIcon />
            </button>
            <div className="w-px h-4" style={{ background: "var(--border)" }} />
            <button onClick={nextMonth} className="p-1.5 transition-colors cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-2.5 text-center text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
            <span className="hidden xs:inline">{day}</span>
            <span className="xs:hidden">{day[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="min-h-[56px] sm:min-h-[100px] p-1.5 sm:p-2"
            style={{ borderBottom: "1px solid color-mix(in srgb, var(--border) 60%, transparent)", borderRight: "1px solid color-mix(in srgb, var(--border) 60%, transparent)", background: "color-mix(in srgb, var(--bg) 40%, transparent)" }}
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateString = formatDateString(year, month, day);
          const isToday = dateString === todayString;
          const isPast = dateString < todayString;
          const daysRenewals = renewals.filter((r) => r.dueDate === dateString);
          const hasRenewals = daysRenewals.length > 0;

          return (
            <button
              key={day}
              onClick={() => {
                if (isPast) return; // Prevent clicking past dates completely
                if (hasRenewals && window.innerWidth < 640) {
                  setSelectedDay(dateString);
                } else {
                  onSelectDate(dateString);
                }
              }}
              className={`relative min-h-[56px] sm:min-h-[100px] p-1.5 sm:p-2 transition-all duration-200 text-left flex flex-col sm:block ${
                isPast 
                  ? "opacity-40 cursor-default pointer-events-none" 
                  : "cursor-pointer hover:z-20 hover:scale-[1.03] hover:shadow-2xl hover:rounded-xl hover:border-[#5b5fd8]/50"
              }`}
              style={{
                borderBottom: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
                borderRight: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
                background: isToday ? "var(--accent-soft)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!isToday && !isPast) e.currentTarget.style.background = "#1a1a24"; }}
              onMouseLeave={(e) => { if (!isToday && !isPast) e.currentTarget.style.background = "transparent"; }}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className="text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full"
                  style={
                    isToday
                      ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 0 3px color-mix(in srgb, var(--violet-glow) 25%, transparent)" }
                      : isPast
                      ? { color: "var(--text-muted)" }
                      : { color: "#ffffff" }
                  }
                >
                  {day}
                </span>
              </div>

              {/* Dots — mobile + tablet (below sm / 640px) */}
              {hasRenewals && (
                <div className="flex sm:hidden items-center gap-1 mt-1 flex-wrap">
                  {daysRenewals.slice(0, 4).map((r, i) => (
                    <span key={r.id} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: DOT_COLORS[i % DOT_COLORS.length] }} />
                  ))}
                </div>
              )}

              {/* Logo-focused compact badge pills — sm (640px) and up */}
              <div className="hidden sm:flex flex-col gap-1.5 mt-1">
                {daysRenewals.map((renewal) => (
                  <div
                    key={renewal.id}
                    onClick={(e) => { e.stopPropagation(); onEdit(renewal); }}
                    title={`${renewal.name} (${renewal.currency || 'USD'} ${renewal.amount})`}
                    className="group relative text-left w-full px-2 py-1.5 text-[11px] font-medium rounded-lg flex items-center justify-between cursor-pointer transition-all border border-zinc-800/80 bg-zinc-900/80 hover:bg-[#5b5fd8]/20 hover:border-[#5b5fd8]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {renewal.websiteDomain ? (
                        <img src={`https://www.google.com/s2/favicons?domain=${renewal.websiteDomain}&sz=32`} alt="" className="w-4 h-4 rounded object-contain flex-shrink-0 bg-zinc-950 p-0.5 border border-zinc-800" />
                      ) : (
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                      )}
                      <span className="truncate text-white font-semibold text-[11px]">{renewal.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-300 font-mono shrink-0 pl-1">
                      {renewal.currency === "INR" ? "₹" : "$"}{renewal.amount}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile popover for multiple items on small screens */}
      {selectedDay && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="w-full rounded-t-2xl p-4 pb-6 animate-fade-in-up"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderBottom: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">
                {new Date(selectedDay + "T00:00:00").toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button onClick={() => setSelectedDay(null)} style={{ color: "var(--text-muted)" }}>
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setSelectedDay(null); onSelectDate(selectedDay); }}
                className="w-full py-2.5 mb-1 rounded-lg text-xs font-semibold text-white bg-[#5b5fd8] hover:bg-[#4a4ec4] transition-colors cursor-pointer"
              >
                + Add renewal on this date
              </button>
              {selectedDayRenewals.map((renewal) => (
                <button
                  key={renewal.id}
                  onClick={() => { onEdit(renewal); setSelectedDay(null); }}
                  className="flex items-center justify-between w-full text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {renewal.websiteDomain ? (
                      <img src={`https://www.google.com/s2/favicons?domain=${renewal.websiteDomain}&sz=32`} alt="" className="w-5 h-5 rounded object-contain flex-shrink-0 bg-zinc-950 p-0.5 border border-zinc-800" />
                    ) : (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                    )}
                    <span className="text-sm font-semibold text-white truncate">{renewal.name}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-300">
                    {renewal.currency === "INR" ? "₹" : "$"}{renewal.amount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}