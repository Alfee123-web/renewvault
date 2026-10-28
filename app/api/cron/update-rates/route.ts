import { NextResponse } from "next/server";
// Import your existing global Prisma client instance
// (Adjust the path to "@/db/prisma" or wherever your project exports it if needed)
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
  // Security check: Ensure this is actually Vercel triggering the cron job in production
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV === "production" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch live rates from Frankfurter API (Base: USD)
    const response = await fetch("https://api.frankfurter.app/latest?from=USD");
    
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    const rates = data.rates;

    // We explicitly store USD as 1.0 just in case we need it for math later
    rates["USD"] = 1.0;

    // 2. Upsert the rates into our database (Update if exists, Create if not)
    const upsertPromises = Object.entries(rates).map(([currency, rate]) => {
      return prisma.exchangeRate.upsert({
        where: { currency },
        update: { rate: Number(rate) },
        create: { currency, rate: Number(rate) },
      });
    });

    // Run all database transactions concurrently for maximum speed
    await Promise.all(upsertPromises);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${Object.keys(rates).length} exchange rates.`,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Cron Job Error - Exchange Rates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update rates" },
      { status: 500 }
    );
  }
}