import AtmosphericBackground from "@/app/components/dashboard/AtmBack";
import PageHeader from "@/app/components/dashboard/PageHeader";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

// --- ICONS ---
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

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
  // Fetch the active session
  const session = await auth();
  
  // Protect the route just in case
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get initials for the avatar placeholder
  const name = session.user.name || "Vault User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <AtmosphericBackground />
      <div className="relative z-10 mx-auto max-w-4xl">
        <PageHeader
          title="Settings"
          description="Manage your account, preferences, and notifications."
        />

        <div className="mt-8 flex flex-col gap-6 animate-fade-in-up">
          
          {/* --- PROFILE SECTION --- */}
          <section className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#121214]/90 shadow-sm backdrop-blur-md">
            <div className="border-b border-zinc-800/50 bg-zinc-900/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Profile Information</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                
                {/* Avatar */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4338ca] to-[#3730a3] text-2xl font-bold text-white shadow-lg border-2 border-zinc-800">
                  {session.user.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={session.user.image} alt={name} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
                    <UserIcon />
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Full Name</p>
                      <p className="text-sm font-medium text-white">{name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3">
                    <MailIcon />
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Email Address</p>
                      <p className="text-sm font-medium text-white">{session.user.email}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* --- PREFERENCES SECTION (V2 PREVIEW) --- */}
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
                <span className="inline-flex items-center rounded-md bg-zinc-800/50 px-2 py-1 text-[11px] font-semibold text-zinc-400 border border-zinc-700/50">
                  Coming in V2
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
              
              {/* Server Action Form for Auth.js Sign Out */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/sign-in" });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/20 hover:border-red-500/30 cursor-pointer"
                >
                  <LogOutIcon />
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