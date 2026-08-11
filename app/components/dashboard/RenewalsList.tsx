"use client";

import { useMemo, useState } from "react";
import { Renewal } from "@/lib/types";
import RenewalItem from "./RenewalItem";

interface RenewalsListProps {
  renewals: Renewal[];
  onEdit: (renewal: Renewal) => void;
  onDelete: (id: string) => void;
  onMarkRenewed: (id: string) => void;
}

const statusFilters: { label: string; value: Renewal["status"] | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Due Soon", value: "due-soon" },
  { label: "Overdue", value: "overdue" },
  { label: "Renewed", value: "renewed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function RenewalsList({
  renewals,
  onEdit,
  onDelete,
  onMarkRenewed,
}: RenewalsListProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Renewal["status"] | "all">("all");

  const filtered = useMemo(() => {
    return renewals.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = activeFilter === "all" || r.status === activeFilter;
      return matchesQuery && matchesFilter;
    });
  }, [renewals, query, activeFilter]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search renewals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] sm:w-64"
        />

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                activeFilter === f.value
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((r) => (
            <RenewalItem
              key={r.id}
              renewal={r}
              onEdit={onEdit}
              onDelete={onDelete}
              onMarkRenewed={onMarkRenewed}
            />
          ))
        ) : (
          <p className="py-8 text-center text-sm text-[var(--text-muted)]">
            No renewals match your search.
          </p>
        )}
      </div>
    </div>
  );
}