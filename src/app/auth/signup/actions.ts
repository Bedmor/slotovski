"use server";

import { hash } from "bcryptjs";
import { db } from "~/server/db";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  if (!email || !password || !username) {
    return { error: "Missing required fields" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  // Check if user exists
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { name: username }],
    },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  await db.user.create({
    data: {
      email,
      name: username,
      password: hashedPassword,
    },
  });

  redirect("/auth/signin");
}
