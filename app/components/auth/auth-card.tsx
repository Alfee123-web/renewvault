import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="max-h-[calc(100vh-3rem)] w-full overflow-y-auto p-5">
      {children}
    </div>
  );
}