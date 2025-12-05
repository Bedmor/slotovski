"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function getCredits() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");
  return user.credits;
}

export async function play(betAmount: number, numBalls: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (betAmount <= 0 || numBalls <= 0) return { error: "Invalid bet or balls" };
  if (numBalls > 300) return { error: "Too many balls" };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  const totalStake = betAmount * numBalls;
  if (user.credits < totalStake) return { error: "Insufficient credits" };

  // Deduct stake first
  await db.user.update({
    where: { id: user.id },
    data: { credits: user.credits - totalStake },
  });

  // Determine bins and multipliers
  const binsCount = 11;
  const multipliers = [3, 2, 1.5, 1.25, 1, 0.75, 1, 1.25, 1.5, 2, 3];

  // A helper to approximate a normal distribution via CLT - sum of uniform samples
  function sampleBinIndex() {
    let s = 0;
    // find average of 6 randoms -> approx normal dist
    for (let i = 0; i < 6; i++) s += Math.random();
    const avg = s / 6;
    // map onto bins
    const idx = Math.floor(avg * binsCount);
    return Math.min(binsCount - 1, Math.max(0, idx));
  }

  const ballBins: number[] = [];
  const bins: number[] = Array.from({ length: binsCount }, () => 0);
  let totalWin = 0;

  for (let i = 0; i < numBalls; i++) {
    const binIndex = sampleBinIndex();
    ballBins.push(binIndex);
    bins[binIndex] = (bins[binIndex] ?? 0) + 1;
    const mul = multipliers[binIndex] ?? 0;
    totalWin += Math.round(betAmount * mul);
  }

  // Add winnings
  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: { credits: user.credits - totalStake + totalWin },
  });

  // Revalidate path for the client to pick up new credits
  revalidatePath("/plinko");

  return {
    success: true,
    bins,
    ballBins,
    winAmount: totalWin,
    newCredits: updatedUser.credits,
  };
}
