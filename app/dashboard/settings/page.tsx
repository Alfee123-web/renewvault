import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import ProfileForm from "@/app/components/dashboard/ProfileForm";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma"; // <-- ADDED PRISMA IMPORT

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  // --- NEW: FETCH FRESH USER DATA FROM DATABASE ---
  const freshUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Use the fresh DB user if found, otherwise fallback to the session cookie
  const displayUser = freshUser || session.user;

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-4xl">
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and notifications."
        />

        <div className="mt-8 flex flex-col gap-6 animate-fade-in-up">
          
          {/* --- PASS THE FRESH USER TO THE FORM --- */}
          <ProfileForm user={displayUser} />

          {/* --- NOTIFICATIONS SECTION --- */}
          <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214]/90 shadow-sm backdrop-blur-md">
            <div className="border-b border-zinc-800/50 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Notifications</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
                    <BellIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email Reminders</p>
                    <p className="text-xs text-zinc-500">Receive alerts when renewals are due.</p>
                  </div>
                </div>
                
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Active
                </span>
              </div>
            </div>
          </section>

          {/* --- DANGER ZONE --- */}
          <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214]/90 shadow-sm backdrop-blur-md">
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Sign out</h3>
                <p className="text-xs text-zinc-500 mt-1">Securely log out of your RenewVault account on this device.</p>
              </div>
              
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/sign-in" });
                }}
              >
                <button
                  type="submit"
                  className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                >
                  <span className="transition-colors duration-200 group-hover:text-red-400">
                    <LogOutIcon />
                  </span>
                  Sign out
                </button>
              </form>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}