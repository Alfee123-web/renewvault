"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileName(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const newName = formData.get("name") as string;

  if (!newName || newName.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  // Update the user in the database
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name: newName.trim() },
  });

  // Refresh the settings page to show the new name
  revalidatePath("/dashboard/settings");
}