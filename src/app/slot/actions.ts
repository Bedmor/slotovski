"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

const weightedItems: string[] = [
  ...Array<string>(10).fill("cherry"),
  ...Array<string>(10).fill("mouse"),
  ...Array<string>(10).fill("heart"),
  ...Array<string>(10).fill("sword"),
  ...Array<string>(10).fill("diamonds"),
  ...Array<string>(20).fill("angry"),
  ...Array<string>(10).fill("banana"),
];

function getRandomItem() {
  return weightedItems[Math.floor(Math.random() * weightedItems.length)]!;
}

function calculateWin(
  matrix: string[][],
  betAmount: number,
): {
  winAmount: number;
  message: string;
  iconKey: string;
} {
  const middleRow = matrix[1];
  if (middleRow?.every((item) => item === middleRow[0])) {
    const item = middleRow[0];
    const multiplier = betAmount / 10; // Base bet is 10
    switch (item) {
      case "cherry":
        return {
          winAmount: 10 * multiplier,
          message: `Cherry Jackpot! ${10 * multiplier} coins!`,
          iconKey: "cherry",
        };
      case "mouse":
        return {
          winAmount: 20 * multiplier,
          message: `Squeak! ${20 * multiplier} coins!`,
          iconKey: "mouse",
        };
      case "heart":
        return {
          winAmount: 30 * multiplier,
          message: `Love is in the air! ${30 * multiplier} coins!`,
          iconKey: "heart",
        };
      case "sword":
        return {
          winAmount: 50 * multiplier,
          message: `Sharp! ${50 * multiplier} coins!`,
          iconKey: "sword",
        };
      case "diamonds":
        return {
          winAmount: 100 * multiplier,
          message: `RICHES! ${100 * multiplier} coins!`,
          iconKey: "diamonds",
        };
      case "angry":
        return {
          winAmount: 5 * multiplier,
          message: `Angry Win! ${5 * multiplier} coins!`,
          iconKey: "angry",
        };
      case "banana":
        return {
          winAmount: 15 * multiplier,
          message: `Potassium Power! ${15 * multiplier} coins!`,
          iconKey: "banana",
        };
      default:
        return { winAmount: 0, message: "", iconKey: "" };
    }
  }
  return { winAmount: 0, message: "", iconKey: "" };
}

export async function spin(betAmount: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (betAmount <= 0) {
    return { error: "Invalid bet amount" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < betAmount) {
    return { error: "Insufficient credits" };
  }

  // Generate result
  const resultMatrix = [
    [
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
    ],
    [
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
    ],
    [
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
      getRandomItem(),
    ],
  ];

  const { winAmount, message, iconKey } = calculateWin(resultMatrix, betAmount);

  const newCredits = user.credits - betAmount + winAmount;

  await db.user.update({
    where: { id: user.id },
    data: { credits: newCredits },
  });

  revalidatePath("/slot");

  return {
    matrix: resultMatrix,
    winAmount,
    newCredits,
    message,
    iconKey,
  };
}

export async function getCredits() {
  const session = await auth();
  if (!session?.user) return 0;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}

export async function addCredits(amount: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await db.user.update({
    where: { id: session.user.id },
    data: { credits: { increment: amount } },
  });

  revalidatePath("/slot");
}
