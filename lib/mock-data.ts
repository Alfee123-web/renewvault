import { Renewal } from "./types";

// TEMP: replace with a real fetch (e.g. `await fetch("/api/renewals")`)
// once your teammate exposes the endpoint. Keep the return shape = Renewal[].
export const mockRenewals: Renewal[] = [
  {
    id: "1",
    name: "Spotify Premium",
    category: "Subscription",
    dueDate: "2026-08-02",
    amount: 11.99,
    currency: "USD",
    status: "due-soon",
  },
  {
    id: "2",
    name: "renewvault.app Domain",
    category: "Domain",
    dueDate: "2026-08-06",
    amount: 14.0,
    currency: "USD",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    category: "Subscription",
    dueDate: "2026-08-14",
    amount: 54.99,
    currency: "USD",
    status: "upcoming",
  },
  {
    id: "4",
    name: "Car Insurance",
    category: "Insurance",
    dueDate: "2026-07-28",
    amount: 320,
    currency: "USD",
    status: "overdue",
  },
];

export const mockStats = {
  upcoming: 12,
  dueThisWeek: 5,
  savedReminders: 24,
};