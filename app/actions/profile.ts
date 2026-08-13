"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const newName = formData.get("name") as string;
  const newImage = formData.get("image") as string; // Get the image URL from the form

  if (!newName || newName.trim() === "") {
    throw new Error("Name cannot be empty");
  }

  // Update BOTH name and image in the database AT THE SAME TIME
  await prisma.user.update({
    where: { email: session.user.email },
    data: { 
      name: newName.trim(),
      image: newImage === "" ? null : newImage, // If empty string, set it to null (removed)
    },
  });

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

  // ONLY upload to Vercel Blob and return the URL. 
  // We do NOT update the database here anymore, so "Cancel" works safely!
  const filename = `avatars/${Date.now()}-${file.name}`;
  const blob = await put(filename, file, { access: "public" });
  
  return blob.url;
}