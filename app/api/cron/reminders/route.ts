import { NextResponse } from "next/server";
import { processDailyReminders } from "@/lib/reminders";

export async function GET(request: Request) {
  // Check the authorization header to ensure this request is actually coming from Vercel
  const authHeader = request.headers.get("authorization");
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized: Invalid CRON_SECRET", { status: 401 });
  }

  try {
    const result = await processDailyReminders();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Cron processing failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}