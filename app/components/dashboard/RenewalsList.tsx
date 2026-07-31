import { Renewal } from "@/lib/types";
import RenewalItem from "./RenewalItem";

export default function RenewalsList({ renewals }: { renewals: Renewal[] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your renewals</h2>
        <span className="text-sm text-[var(--text-muted)]">{renewals.length} total</span>
      </div>

      {renewals.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] py-12 text-center">
          <p className="text-[var(--text-primary)]">No renewals yet</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Add your first subscription, domain, or bill to start tracking due dates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {renewals.map((renewal) => (
            <RenewalItem key={renewal.id} renewal={renewal} />
          ))}
        </div>
      )}
    </div>
  );
}
