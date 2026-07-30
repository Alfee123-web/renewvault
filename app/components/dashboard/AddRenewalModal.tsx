"use client";

import { useState } from "react";

interface AddRenewalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddRenewalModal({ open, onClose }: AddRenewalModalProps) {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: once backend/API route exists, POST { name, dueDate } here.
    // Coordinate the payload shape with your teammate before wiring this up.
    console.log("New renewal (not yet saved):", { name, dueDate });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Add a renewal</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Track a new subscription, domain, or bill.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-sm text-[var(--text-primary)]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Netflix"
              required
              className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--focus-ring)]"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--text-primary)]">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="mt-1 w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-[var(--text-primary)] outline-none focus:border-[var(--focus-ring)]"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] px-4 py-2 text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[var(--radius-lg)] bg-[var(--accent)] px-4 py-2 font-semibold text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}