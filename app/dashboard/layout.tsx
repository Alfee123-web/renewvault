import Sidebar from "@/app/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--bg)] text-[var(--text-primary)]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}