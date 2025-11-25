"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function updateProfileImage(imageUrl: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  revalidatePath("/");
}
