"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/sign-in" });
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-white/70">
          Temporary page for auth testing. The real dashboard will be added later.
        </p>

        <button
          onClick={handleSignOut}
          className="mt-6 rounded-lg bg-orange-500 px-5 py-3 font-medium text-white transition hover:bg-orange-600"
        >
          Sign out
        </button>
      </div>
    </main>
  );
}