"use server";

import {prisma} from "@/lib/prisma";

export async function getExchangeRates() {
  try {
    const rates = await prisma.exchangeRate.findMany();
    
    // Convert array of objects [{ currency: "USD", rate: 1 }, { currency: "INR", rate: 84 }]
    // into a single easy-to-use dictionary: { USD: 1, INR: 84 }
    const ratesMap: Record<string, number> = {};
    rates.forEach((r) => {
      ratesMap[r.currency] = r.rate;
    });

    return ratesMap;
  } catch (error) {
    console.error("Failed to fetch rates:", error);
    // Fallback safe rates just in case the database is completely empty
    return { USD: 1.0, INR: 84.0, EUR: 0.92, GBP: 0.76 };
  }
}