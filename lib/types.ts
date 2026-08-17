// UI-layer type only. Once your teammate's Prisma schema is ready,
// this can be swapped for the generated type — keep the shape identical
// so the dashboard components don't need to change.
export type RenewalStatus = "upcoming" | "due-soon" | "overdue";

export interface Renewal {
  id: string;
  name: string;
  category: string;
  dueDate: string; 
  amount: number;
  currency: string;
  billingCycle?: string; 
  status: "upcoming" | "due-soon" | "overdue" | "renewed" | "cancelled" | string;
  reminderEnabled: boolean;
  reminderDaysBefore: number[]; // UI handles this as an array
  websiteDomain?: string | null;
}

export interface DashboardStats {
  upcoming: number;
  dueThisWeek: number;
  savedReminders: number;
}