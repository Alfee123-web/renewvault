"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

type SignupInput = {
  name: string;
  email: string;
  password: string;
  remember?: boolean;
};

export async function signup({
  name,
  email,
  password,
  remember = false,
}: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, message: "User already exists." };
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await signIn("credentials", {
    email,
    password,
    remember: remember ? "on" : "off",
    redirectTo: "/dashboard",
  });

  return { success: true };
}