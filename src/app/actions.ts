"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  credits: number;
  lastDailyReward: Date | null;
}

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

export async function claimDailyReward() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = (await db.user.findUnique({
    where: { id: session.user.id },
  })) as User | null;

  if (!user) throw new Error("User not found");

  const now = new Date();
  const lastReward = user.lastDailyReward;

  if (lastReward) {
    const isSameDay =
      lastReward.getDate() === now.getDate() &&
      lastReward.getMonth() === now.getMonth() &&
      lastReward.getFullYear() === now.getFullYear();

    if (isSameDay) {
      return { success: false, message: "Already claimed today" };
    }
  }

  const REWARD_AMOUNT = 100;

  await db.user.update({
    where: { id: session.user.id },
    data: {
      credits: { increment: REWARD_AMOUNT },
      lastDailyReward: now,
    },
  });

  revalidatePath("/");
  return { success: true, message: `Claimed ${REWARD_AMOUNT} credits!` };
}
