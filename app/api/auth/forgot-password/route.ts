import { NextResponse } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function getResetPasswordEmailHtml(resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset your password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#0b0b12;font-family:'Inter',Arial,Helvetica,sans-serif;color:#ffffff;">
        <div style="margin:0 auto;max-width:640px;padding:40px 20px;">
          <div style="border:1px solid #222235;background:#11111a;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">
            <div style="padding:32px 32px 20px 32px;border-bottom:1px solid #1f1f2b;text-align:center;">
              <div style="font-size:20px;font-weight:700;letter-spacing:0.2px;color:#ffffff;font-family:'Inter',Arial,Helvetica,sans-serif;">
                RenewVault
              </div>
              <div style="margin-top:8px;font-size:14px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                Secure access to your renewal workspace
              </div>
            </div>

            <div style="padding:32px;">
              <h1 style="margin:0 0 14px 0;font-size:28px;line-height:36px;color:#ffffff;font-weight:700;font-family:'Inter',Arial,Helvetica,sans-serif;">
                Reset your password
              </h1>

              <p style="margin:0 0 14px 0;font-size:15px;line-height:26px;color:#d4d4d8;font-family:'Inter',Arial,Helvetica,sans-serif;">
                We received a request to reset your RenewVault password. Click the button below to set a new password.
              </p>

              <p style="margin:0 0 28px 0;font-size:15px;line-height:26px;color:#d4d4d8;font-family:'Inter',Arial,Helvetica,sans-serif;">
                This reset link will expire in 30 minutes for security reasons.
              </p>

              <div style="margin:0 0 28px 0;text-align:center;">
                <a
                  href="${resetUrl}"
                  style="display:inline-block;padding:14px 24px;border-radius:999px;background:#5b5cf0;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;font-family:'Inter',Arial,Helvetica,sans-serif;"
                >
                  Reset password
                </a>
              </div>

              <p style="margin:0 0 10px 0;font-size:13px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                If the button does not work, copy and paste this link into your browser:
              </p>

              <p style="margin:0 0 24px 0;word-break:break-all;font-family:'Inter',Arial,Helvetica,sans-serif;">
                <a
                  href="${resetUrl}"
                  style="font-size:13px;line-height:22px;color:#8b5cf6;text-decoration:none;font-family:'Inter',Arial,Helvetica,sans-serif;"
                >
                  ${resetUrl}
                </a>
              </p>

              <div style="padding-top:20px;border-top:1px solid #1f1f2b;">
                <p style="margin:0 0 8px 0;font-size:13px;line-height:22px;color:#a1a1aa;font-family:'Inter',Arial,Helvetica,sans-serif;">
                  If you did not request a password reset, you can safely ignore this email.
                </p>
                <p style="margin:0;font-size:13px;line-height:22px;color:#71717a;font-family:'Inter',Arial,Helvetica,sans-serif;">
                  © 2026 RenewVault. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "RenewVault <reminders@renewvault.me>";
    const appUrl = normalizeBaseUrl(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    );

    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    const html = getResetPasswordEmailHtml(resetUrl);

    // Safely attempt to read logo (supports svg or png if present)
    let attachments: any[] = [];
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.svg");
      const logoBuffer = await fs.readFile(logoPath);
      attachments.push({
        filename: "logo.svg",
        content: logoBuffer,
        contentId: "renewvault-logo",
      });
    } catch {
      // Ignore if logo doesn't exist so email still sends successfully
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset your RenewVault password",
      html,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}