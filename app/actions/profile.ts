"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

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

export async function uploadAvatar(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file provided");
  }

  // Upload to Vercel Blob
  const filename = `avatars/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, { access: "public" });

  // Update the user's image URL in the database
  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: blob.url },
  });

  // Refresh the settings page
  revalidatePath("/dashboard/settings");
  
  return blob.url;
}