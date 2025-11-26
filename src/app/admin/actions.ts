"use server";

import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return await db.user.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function updateUser(
  userId: string,
  data: { name?: string; credits?: number; role?: string },
) {
  await db.user.update({
    where: { id: userId },
    data,
  });
  revalidatePath("/admin");
  return { success: true };
}
