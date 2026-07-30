"use client";

import { useState } from "react";
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatCard from "@/app/components/dashboard/StatCard";
import RenewalsList from "@/app/components/dashboard/RenewalsList";
import AddRenewalModal from "@/app/components/dashboard/AddRenewalModal";
import { mockRenewals, mockStats } from "@/lib/mock-data";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: swap mockRenewals/mockStats for real data once your teammate's
  // API routes / auth session are ready. Keep this component's shape the
  // same so the swap is a one-line change.

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <DashboardHeader onAddClick={() => setModalOpen(true)} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Upcoming" value={mockStats.upcoming} />
          <StatCard label="Due this week" value={mockStats.dueThisWeek} accent />
          <StatCard label="Saved reminders" value={mockStats.savedReminders} />
        </div>

        <RenewalsList renewals ={mockRenewals} />
      </div>

      <AddRenewalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}