import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Added curly braces here
import { auth } from "@/auth"; 

export async function GET(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Fetch all renewals for this specific user
    const renewals = await prisma.renewal.findMany({
      where: {
        userId: session.user.id,
      },
    });

    // 3. Initialize our math variables
    let monthlySpend = 0;
    let yearlySpend = 0;
    const activeCount = renewals.length;

    // 4. Calculate the burn rate
    renewals.forEach((renewal) => {
      if (renewal.billingCycle === "monthly") {
        monthlySpend += renewal.amount;
        yearlySpend += renewal.amount * 12;
      } else if (renewal.billingCycle === "yearly") {
        monthlySpend += renewal.amount / 12;
        yearlySpend += renewal.amount;
      }
    });

    // 5. Send the calculated stats back to the frontend
    return NextResponse.json({
      monthlySpend,
      yearlySpend,
      activeCount,
    });

  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}