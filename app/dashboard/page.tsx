"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Renewal } from "@/lib/types";
import RenewalCard from "@/app/components/dashboard/RenewalCard";
import AddRenewalModal from "@/app/components/dashboard/AddRenewalModal";

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Due Soon", value: "due-soon" },
  { label: "Overdue", value: "overdue" },
  { label: "Renewed", value: "renewed" },
  { label: "Cancelled", value: "cancelled" },
];

const SORT_OPTIONS = [
  { label: "Due date (soonest)", value: "date-asc" },
  { label: "Due date (latest)", value: "date-desc" },
  { label: "Amount (high to low)", value: "amount-desc" },
  { label: "Amount (low to high)", value: "amount-asc" },
];

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function CloseSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function ArrowUpDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" />
    </svg>
  );
}

export default function Dashboard() {
  const [renewals, setRenewals] = useState<Renewal[]>([
    { id: "1", name: "Spotify Premium", category: "Subscription", dueDate: "2026-08-02", amount: 11.99, currency: "USD", status: "due-soon", reminderEnabled: true, reminderDaysBefore: 7 },
    { id: "2", name: "renewvault.app Domain", category: "Domain", dueDate: "2026-08-06", amount: 14.0, currency: "USD", status: "upcoming", reminderEnabled: true, reminderDaysBefore: 30 },
    { id: "3", name: "Car Insurance", category: "Insurance", dueDate: "2026-07-28", amount: 320.0, currency: "USD", status: "overdue", reminderEnabled: false, reminderDaysBefore: null },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState<Renewal | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label;

  const stats = useMemo(() => ({
    upcoming: renewals.filter((r) => r.status === "upcoming").length,
    dueThisWeek: renewals.filter((r) => r.status === "due-soon").length,
    savedReminders: renewals.filter((r) => r.reminderEnabled).length,
  }), [renewals]);

  const filteredRenewals = useMemo(() => {
    const filtered = renewals.filter((renewal) => {
      const matchesSearch =
        renewal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        renewal.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || renewal.status === activeFilter;
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "date-desc":
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [renewals, searchQuery, activeFilter, sortBy]);

  const handleAddRenewal = (newRenewal: Renewal) => setRenewals((prev) => [...prev, newRenewal]);
  const handleUpdateRenewal = (updatedRenewal: Renewal) =>
    setRenewals((prev) => prev.map((r) => (r.id === updatedRenewal.id ? updatedRenewal : r)));
  const handleDeleteRenewal = (id: string) => setRenewals((prev) => prev.filter((r) => r.id !== id));
  const handleMarkRenewed = (id: string) =>
    setRenewals((prev) => prev.map((r) => (r.id === id ? { ...r, status: "renewed" } : r)));
  const openEditModal = (renewal: Renewal) => {
    setEditingRenewal(renewal);
    setIsModalOpen(true);
  };

  const STAT_CARDS = [
    { label: "Upcoming", value: stats.upcoming, icon: ClockIcon, color: "text-[var(--secondary-text)]" },
    { label: "Due this week", value: stats.dueThisWeek, icon: AlertIcon, color: "text-amber-400" },
    { label: "Saved reminders", value: stats.savedReminders, icon: BellIcon, color: "text-[var(--text-primary)]" },
  ];

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">

      {/* --- ATMOSPHERIC BACKGROUND --- */}
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

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 pt-14 lg:pt-0 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="hidden sm:block text-sm text-zinc-400 mt-1">
              Manage and track your upcoming digital and financial renewals.
            </p>
          </div>
          <button
            onClick={() => { setEditingRenewal(null); setIsModalOpen(true); }}
            className="self-start rounded-xl bg-[#4338ca] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#3730a3] hover:-translate-y-0.5 transition-all cursor-pointer sm:self-auto"
          >
            + Add renewal
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8 animate-fade-in-up delay-100">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-zinc-800 bg-[#121214]/80 backdrop-blur-md p-5 shadow-sm hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-400 tracking-wider uppercase">{label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 ${color}`}>
                  <Icon />
                </span>
              </div>
              <p className={`text-3xl font-bold mt-3 ${color === "text-amber-400" ? color : "text-white"}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* --- COMMAND / FILTER BAR --- */}
        <div className="flex flex-col gap-4 mb-8 rounded-2xl border border-zinc-800 bg-[#121214]/90 backdrop-blur-md p-3.5 shadow-sm animate-fade-in-up delay-200 lg:flex-row lg:items-center lg:justify-between">

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search renewals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-9 pr-8 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#4338ca] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-2.5 flex items-center text-zinc-400 hover:text-white"
              >
                <CloseSmallIcon />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide lg:flex-wrap lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
            {FILTER_OPTIONS.map((option) => {
              const isActive = activeFilter === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#4338ca] text-white shadow-sm"
                      : "bg-zinc-900/40 text-zinc-400 border border-zinc-800/80 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Status & Results Header */}
        <div className="flex flex-col gap-3 mb-4 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Showing {filteredRenewals.length} {filteredRenewals.length === 1 ? 'renewal' : 'renewals'}
          </p>

          <div className="relative self-start sm:self-auto" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 pl-3 pr-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] transition-colors cursor-pointer"
            >
              <ArrowUpDownIcon />
              <span>{activeSortLabel}</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] shadow-lg">
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`block w-full px-3.5 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[#4338ca] text-white"
                          : "text-zinc-300 hover:bg-zinc-800/80"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Card Grid */}
        <div className="animate-fade-in-up delay-300">
          {filteredRenewals.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md border-dashed py-16 text-center">
              <p className="text-zinc-300 font-medium text-sm">No renewals found</p>
              <p className="text-zinc-500 text-xs mt-1">Try adjusting your search terms or filter selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredRenewals.map((renewal) => (
                <RenewalCard
                  key={renewal.id}
                  renewal={renewal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteRenewal}
                  onMarkRenewed={handleMarkRenewed}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddRenewalModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddRenewal}
          onUpdate={handleUpdateRenewal}
          editingRenewal={editingRenewal}
        />
      )}
    </div>
  );
}