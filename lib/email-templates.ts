const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", INR: "₹" };

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${amount.toFixed(2)}`;
}

export function generateReminderEmailHtml(
  userName: string,
  renewalName: string,
  amount: number,
  currency: string,
  dueDate: Date,
  daysBefore: number
) {
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedAmount = formatAmount(amount, currency);
  const timeText = daysBefore === 1 ? "tomorrow" : `in ${daysBefore} days`;
  const currentYear = new Date().getFullYear();
  const dashboardUrl = "http://localhost:3000/dashboard"; // Change to your production URL later

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Upcoming renewal reminder</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#0b0b12;font-family:'Inter',Arial,Helvetica,sans-serif;color:#ffffff;">
        <div style="margin:0 auto;max-width:640px;padding:40px 20px;">
          <div style="border:1px solid #222235;background:#11111a;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">
            
            <!-- Header Section -->
            <div style="padding:32px 32px 20px 32px;border-bottom:1px solid #1f1f2b;text-align:center;">
              <img
                src="cid:renewvault-logo"
                alt="RenewVault"
                width="44"
                height="44"
                style="display:block;margin:0 auto 14px auto;"
              />
              <div style="font-size:20px;font-weight:700;letter-spacing:0.2px;color:#ffffff;font-family:'Inter',Arial,Helvetica,sans-serif;">
                RenewVault
              </div>
              <div style="margin-top:8px;font-size:14px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                Secure access to your renewal workspace
              </div>
            </div>

            <!-- Body Section -->
            <div style="padding:32px;">
              <h1 style="margin:0 0 14px 0;font-size:28px;line-height:36px;color:#ffffff;font-weight:700;font-family:'Inter',Arial,Helvetica,sans-serif;">
                Upcoming renewal reminder
              </h1>

              <p style="margin:0 0 14px 0;font-size:15px;line-height:26px;color:#d4d4d8;font-family:'Inter',Arial,Helvetica,sans-serif;">
                Hi ${userName},
              </p>

              <p style="margin:0 0 24px 0;font-size:15px;line-height:26px;color:#d4d4d8;font-family:'Inter',Arial,Helvetica,sans-serif;">
                We are sending this automated reminder that your <strong>${renewalName}</strong> renewal is due ${timeText}.
              </p>

              <!-- Details Box -->
              <div style="border:1px solid #222235;border-radius:12px;padding:20px;margin:0 0 28px 0;background:#0b0b12;">
                <div style="margin-bottom:12px;">
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;display:block;margin-bottom:4px;font-family:'Inter',Arial,Helvetica,sans-serif;">Subscription / Service</span>
                  <span style="font-size:15px;color:#ffffff;font-weight:500;font-family:'Inter',Arial,Helvetica,sans-serif;">${renewalName}</span>
                </div>
                <div style="margin-bottom:12px;">
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;display:block;margin-bottom:4px;font-family:'Inter',Arial,Helvetica,sans-serif;">Amount Due</span>
                  <span style="font-size:15px;color:#fbbf24;font-weight:600;font-family:'Inter',Arial,Helvetica,sans-serif;">${formattedAmount}</span>
                </div>
                <div>
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#a1a1aa;font-weight:600;display:block;margin-bottom:4px;font-family:'Inter',Arial,Helvetica,sans-serif;">Renewal Date</span>
                  <span style="font-size:15px;color:#ffffff;font-weight:500;font-family:'Inter',Arial,Helvetica,sans-serif;">${formattedDate}</span>
                </div>
              </div>

              <!-- Action Button -->
              <div style="margin:0 0 28px 0;text-align:center;">
                <a
                  href="${dashboardUrl}"
                  style="display:inline-block;padding:14px 24px;border-radius:999px;background:#5b5cf0;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;font-family:'Inter',Arial,Helvetica,sans-serif;"
                >
                  View Dashboard
                </a>
              </div>

              <!-- Fallback Link -->
              <p style="margin:0 0 10px 0;font-size:13px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                If the button does not work, copy and paste this link into your browser:
              </p>

              <p style="margin:0 0 24px 0;word-break:break-all;font-family:'Inter',Arial,Helvetica,sans-serif;">
                <a
                  href="${dashboardUrl}"
                  style="font-size:13px;line-height:22px;color:#8b5cf6;text-decoration:none;font-family:'Inter',Arial,Helvetica,sans-serif;"
                >
                  ${dashboardUrl}
                </a>
              </p>

              <!-- Footer -->
              <div style="padding-top:20px;border-top:1px solid #1f1f2b;">
                <p style="margin:0 0 8px 0;font-size:13px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                  If you did not request to track this, you can safely ignore this email or update your preferences in your dashboard settings.
                </p>
                <p style="margin:0;font-size:13px;line-height:22px;color:#71717a;font-family:'Inter',Arial,Helvetica,sans-serif;">
                  © ${currentYear} RenewVault. All rights reserved.
                </p>
              </div>

            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}