import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateReminderEmailHtml } from "./email-templates";
import fs from "fs";
import path from "path";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function processDailyReminders() {
  console.log("Starting daily reminder processing...");

  // 1. Get "today" normalized to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Fetch all renewals that have reminders enabled
  const activeRenewals = await prisma.renewal.findMany({
    where: {
      reminderEnabled: true,
      status: { in: ["upcoming", "due-soon"] },
      reminderDaysBefore: { not: null }, 
    },
    include: {
      user: true, 
    },
  });

  let emailsSent = 0;

  // Read the PNG logo
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  let logoBuffer: Buffer | null = null;
  try {
    logoBuffer = fs.readFileSync(logoPath);
  } catch (error) {
    console.error("Warning: logo.png not found.");
  }

  // 3. Loop through and check all reminder days
  for (const renewal of activeRenewals) {
    if (!renewal.user?.email || !renewal.reminderDaysBefore) continue;

    // Safely cast to string and parse into a number array
    const rawReminders = String(renewal.reminderDaysBefore);
    const daysArray = rawReminders
      .split(',')
      .map(Number)
      .filter((n: number) => !isNaN(n));

    // Find if ANY of the reminder days match "today" with explicit type annotation
    const matchedDays = daysArray.find((days: number) => {
      const alertDate = new Date(renewal.dueDate);
      alertDate.setDate(alertDate.getDate() - days);
      alertDate.setHours(0, 0, 0, 0);
      return alertDate.getTime() === today.getTime();
    });

    // 4. If we found a match, send the email
    if (matchedDays !== undefined) {
      try {
        const html = generateReminderEmailHtml(
          renewal.user.name || "Vault User",
          renewal.name,
          renewal.amount,
          renewal.currency,
          renewal.dueDate, // Pass the Date object directly without .toISOString()
          matchedDays 
        );
        
        const attachments = logoBuffer ? [
          {
            filename: "logo.png",
            content: logoBuffer,
            contentId: "renewvault-logo",
          },
        ] : [];

        await resend.emails.send({
          from: "RenewVault <reminders@renewvault.me>", 
          to: renewal.user.email, 
          subject: `Reminder: ${renewal.name} renews in ${matchedDays} day${matchedDays === 1 ? '' : 's'}`,
          html: html,
          attachments: attachments,
        });

        emailsSent++;
        console.log(`Sent reminder to ${renewal.user.email} for ${renewal.name}`);
      } catch (error) {
        console.error(`Failed to send reminder for renewal ID ${renewal.id}:`, error);
      }
    }
  }

  console.log(`Finished processing. Sent ${emailsSent} emails.`);
  return { success: true, emailsSent };
}