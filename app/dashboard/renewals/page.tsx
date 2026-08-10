import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import EmptyState from "@/app/components/dashboard/EmptyState";

function RenewalsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
    </svg>
  );
}

export default function RenewalsPage() {
  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <PageHeader
          title="Renewals"
          description="A full history and list of every renewal you're tracking."
        />
        <EmptyState
          icon={<RenewalsIcon />}
          title="Renewals list coming soon"
          description="This page will show a detailed table of all your renewals once connected to the backend."
        />
      </div>
    </div>
  );
}