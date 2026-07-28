import type { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      {children}
    </div>
  );
}