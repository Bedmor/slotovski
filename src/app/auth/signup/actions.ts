"use server";

import { hash } from "bcryptjs";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import type { Prisma } from "generated/prisma";

export async function signup(formData: FormData) {
  const emailInput = formData.get("email");
  const email =
    typeof emailInput === "string" && emailInput.trim() !== ""
      ? emailInput.trim()
      : null;
  const password = (formData.get("password") as string) ?? "";
  const username = (formData.get("username") as string) ?? "";

  // Only password and username are required; email is optional
  if (!password || !username) {
    return { error: "Missing required fields" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }
  // Check if user exists
  // Check whether a conflicting user exists for the given username or email (if provided)
  const orClauses: Prisma.UserWhereInput[] = [{ name: username }];
  if (email) {
    orClauses.push({ email });
  }

  const existingUser = await db.user.findFirst({
    where: {
      OR: orClauses,
    },
  });

  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  await db.user.create({
    data: {
      // Only set the email field if provided; otherwise omit it so it remains null
      ...(email ? { email } : {}),
      name: username,
      password: hashedPassword,
    },
  });

  redirect("/auth/signin");
}
