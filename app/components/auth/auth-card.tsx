import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--bg)] p-6">
      {children}
    </div>
  );
}