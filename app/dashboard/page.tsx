"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Renewal } from "@/lib/types";
import RenewalCard from "@/app/components/dashboard/RenewalCard";
import AddRenewalModal from "@/app/components/dashboard/AddRenewalModal";
import SpendingSummary from "@/app/components/dashboard/SpendingSummary";
import CalendarView from "@/app/components/dashboard/CalendarView";
import {
  getRenewals,
  createRenewal,
  updateRenewal,
  deleteRenewal,
  markRenewalAsRenewed,
} from "@/app/actions/renewals";

const SORT_OPTIONS = [
  { label: "Due date (soonest)", value: "date-asc" },
  { label: "Due date (latest)", value: "date-desc" },
  { label: "Amount (high to low)", value: "amount-desc" },
  { label: "Amount (low to high)", value: "amount-asc" },
];

// --- ICONS ---
function SearchIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>; }
function CloseSmallIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>; }
function ArrowUpDownIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>; }
function SpinnerIcon() { return <svg className="animate-spin h-6 w-6 text-[#4338ca]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>; }
function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>; }
function CalendarToggleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>; }

export default function Dashboard() {
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRenewal, setEditingRenewal] = useState<Renewal | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const sortRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    try {
      setIsLoading(true);
      const data = await getRenewals();
      setRenewals(data);
    } catch (error) {
      console.error("Failed to load renewals:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label;

  const dynamicCategories = useMemo(() => {
    const uniqueCats = new Set(renewals.map((r) => r.category).filter(Boolean));
    return ["All", ...Array.from(uniqueCats)].sort();
  }, [renewals]);

  const filteredRenewals = useMemo(() => {
    const filtered = renewals.filter((renewal) => {
      const matchesSearch =
        renewal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        renewal.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "All" || renewal.category === activeFilter;
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-asc": return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "date-desc": return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc": return a.amount - b.amount;
        default: return 0;
      }
    });
  }, [renewals, searchQuery, activeFilter, sortBy]);

  const handleAddRenewal = async (newRenewal: Renewal) => {
    try {
      const { id, ...dataToSave } = newRenewal;
      const saved = await createRenewal(dataToSave as Omit<Renewal, "id">);
      setRenewals((prev) => [...prev, saved]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateRenewal = async (updatedRenewal: Renewal) => {
    setRenewals((prev) => prev.map((r) => (r.id === updatedRenewal.id ? updatedRenewal : r)));
    try {
      await updateRenewal(updatedRenewal.id, updatedRenewal);
    } catch (error) {
      console.error("Failed to update, reverting...", error);
      loadData();
    }
  };

  const handleDeleteRenewal = async (id: string) => {
    setRenewals((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteRenewal(id);
    } catch (error) {
      console.error("Failed to delete, reverting...", error);
      loadData(); 
    }
  };

  const handleMarkRenewed = async (id: string) => {
    setRenewals((prev) => prev.map((r) => (r.id === id ? { ...r, status: "renewed" } : r)));
    try {
      await markRenewalAsRenewed(id);
    } catch (error) {
      console.error("Failed to mark renewed, reverting...", error);
      loadData();
    }
  };

  const openEditModal = (renewal: Renewal) => {
    setEditingRenewal(renewal);
    setIsModalOpen(true);
  };

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

        {/* --- V2 SPENDING SUMMARY COMPONENT --- */}
        <SpendingSummary renewals={renewals} isLoading={isLoading} />

        {/* --- COMMAND / FILTER BAR --- */}
        <div className="flex flex-col gap-4 mb-8 rounded-2xl border border-zinc-800 bg-[#121214]/90 backdrop-blur-md p-3.5 shadow-sm animate-fade-in-up delay-200 lg:flex-row lg:items-center lg:justify-between">
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
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-2.5 flex items-center text-zinc-400 hover:text-white cursor-pointer">
                <CloseSmallIcon />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide lg:flex-wrap lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
            {dynamicCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === category ? "bg-[#4338ca] text-white shadow-sm" : "bg-zinc-900/40 text-zinc-400 border border-zinc-800/80 hover:text-white hover:border-zinc-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Section Status & Results Header (Added relative z-30 here) */}
        <div className="relative z-30 flex flex-col gap-3 mb-4 px-1 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up delay-300">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Showing {isLoading ? "..." : `${filteredRenewals.length} ${filteredRenewals.length === 1 ? 'renewal' : 'renewals'}`}
          </p>
          
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-0.5">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Grid view"
              >
                <GridIcon />
              </button>
              <button 
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "calendar" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Calendar view"
              >
                <CalendarToggleIcon />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 pl-3 pr-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 transition-colors cursor-pointer">
                <ArrowUpDownIcon />
                <span>{activeSortLabel}</span>
              </button>
              {isSortOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-[#121214] shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                      className={`block w-full px-3.5 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${sortBy === opt.value ? "bg-[#4338ca] text-white" : "text-zinc-300 hover:bg-zinc-800/80"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Grid / Calendar View / Loading State / Empty State */}
        <div className="animate-fade-in-up delay-300">
          {isLoading ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md py-24 flex flex-col items-center justify-center">
               <SpinnerIcon />
               <p className="mt-4 text-sm text-zinc-400 font-medium">Loading your vault...</p>
            </div>
          ) : filteredRenewals.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md border-dashed py-16 text-center">
              <p className="text-zinc-300 font-medium text-sm">No renewals found</p>
              <p className="text-zinc-500 text-xs mt-1">Try adjusting your search terms or filter selection.</p>
            </div>
          ) : viewMode === "calendar" ? (
            <CalendarView renewals={filteredRenewals} onEdit={openEditModal} />
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