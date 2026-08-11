import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { generateReminderEmailHtml } from "./email-templates";
import fs from "fs";
import path from "path";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function processDailyReminders() {
  console.log("Starting daily reminder processing...");

  // 1. Get "today" normalized to midnight (to safely compare dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Fetch all renewals that have reminders enabled AND aren't already renewed/cancelled
  const activeRenewals = await prisma.renewal.findMany({
    where: {
      reminderEnabled: true,
      status: { in: ["upcoming", "due-soon"] },
    },
    include: {
      user: true, 
    },
  });

  let emailsSent = 0;

  // Read the PNG logo from the public folder
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  let logoBuffer: Buffer | null = null;
  
  try {
    logoBuffer = fs.readFileSync(logoPath);
  } catch (error) {
    console.error("Warning: logo.png not found in public folder. Email will send without logo attachment.");
  }

  // 3. Loop through and calculate the alert date for each
  for (const renewal of activeRenewals) {
    if (!renewal.user?.email) continue;

    // Calculate the target alert date
    const alertDate = new Date(renewal.dueDate);
    alertDate.setDate(alertDate.getDate() - (renewal.reminderDaysBefore || 0));
    alertDate.setHours(0, 0, 0, 0);

    // 4. If the alert date exactly matches today, send the email!
    if (alertDate.getTime() === today.getTime()) {
      try {
        const html = generateReminderEmailHtml(
          renewal.user.name || "Vault User",
          renewal.name,
          renewal.amount,
          renewal.currency,
          renewal.dueDate,
          renewal.reminderDaysBefore || 0
        );
        
        // Prepare attachments array with contentId
        const attachments = logoBuffer ? [
          {
            filename: "logo.png",
            content: logoBuffer,
            contentId: "renewvault-logo",
          },
        ] : [];

        await resend.emails.send({
          from: "onboarding@resend.dev", 
          to: renewal.user.email, 
          subject: `Reminder: ${renewal.name} renews soon`,
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