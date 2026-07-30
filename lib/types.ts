// UI-layer type only. Once your teammate's Prisma schema is ready,
// this can be swapped for the generated type — keep the shape identical
// so the dashboard components don't need to change.
export type RenewalStatus = "upcoming" | "due-soon" | "overdue";

export interface Renewal {
  id: string;
  name: string;
  category: string; // e.g. "Subscription", "Domain", "Insurance"
  dueDate: string; // ISO date string
  amount?: number;
  currency?: string;
  status: RenewalStatus;
}