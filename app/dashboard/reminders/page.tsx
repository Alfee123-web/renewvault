import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import EmptyState from "@/app/components/dashboard/EmptyState";

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default function RemindersPage() {
  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHeader
          title="Reminders"
          description="Manage upcoming alerts for your renewals."
        />
        <EmptyState
          icon={<BellIcon />}
          title="No reminders configured yet"
          description="Reminders you enable on renewals will appear here once the backend is connected."
        />
      </div>
    </div>
  );
}