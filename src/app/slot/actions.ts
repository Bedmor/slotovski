"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

const weightedItems: string[] = [
  ...Array<string>(60).fill("cherry"), // Increased
  ...Array<string>(30).fill("mouse"), // Increased
  ...Array<string>(20).fill("heart"), // Increased
  ...Array<string>(10).fill("sword"), // Same
  ...Array<string>(5).fill("diamonds"), // Rare
  ...Array<string>(80).fill("angry"), // Very Common
  ...Array<string>(40).fill("banana"), // Increased
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
  if (!middleRow) return { winAmount: 0, message: "", iconKey: "" };

  // Find longest consecutive sequence anywhere in the row
  let maxMatchCount = 0;
  let bestItem = "";

  let currentItem = middleRow[0];
  let currentCount = 1;

  for (let i = 1; i < middleRow.length; i++) {
    if (middleRow[i] === currentItem) {
      currentCount++;
    } else {
      if (currentCount > maxMatchCount) {
        maxMatchCount = currentCount;
        bestItem = currentItem!;
      }
      currentItem = middleRow[i];
      currentCount = 1;
    }
  }
  if (currentCount > maxMatchCount) {
    maxMatchCount = currentCount;
    bestItem = currentItem!;
  }

  // Only win if 3 or more match
  if (maxMatchCount >= 3) {
    const multiplier = betAmount / 10; // Base bet is 10
    let baseWin = 0;
    let name = "";

    switch (bestItem) {
      case "cherry":
        baseWin = 10;
        name = "Cherry";
        break;
      case "mouse":
        baseWin = 20;
        name = "Mouse";
        break;
      case "heart":
        baseWin = 30;
        name = "Heart";
        break;
      case "sword":
        baseWin = 50;
        name = "Sword";
        break;
      case "diamonds":
        baseWin = 100;
        name = "Diamond";
        break;
      case "angry":
        baseWin = 5;
        name = "Angry";
        break;
      case "banana":
        baseWin = 15;
        name = "Banana";
        break;
    }

    // Scale win based on match count
    // 3 matches = 20% of base win
    // 4 matches = 50% of base win
    // 5 matches = 100% of base win
    let winFactor = 0;
    if (maxMatchCount === 3) winFactor = 0.2;
    if (maxMatchCount === 4) winFactor = 0.5;
    if (maxMatchCount === 5) winFactor = 1.0;

    const winAmount = Math.max(1, Math.round(baseWin * multiplier * winFactor));

    return {
      winAmount,
      message: `${name} ${maxMatchCount}x Combo! ${winAmount} coins!`,
      iconKey: bestItem ?? "",
    };
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
