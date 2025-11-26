"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

const weightedItems: string[] = [
  ...Array<string>(30).fill("cherry"), // Increased
  ...Array<string>(60).fill("mouse"), // Increased
  ...Array<string>(80).fill("heart"), // Increased
  ...Array<string>(10).fill("sword"), // Same
  ...Array<string>(5).fill("diamonds"), // Rare
  ...Array<string>(30).fill("angry"), // Very Common
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
  winningIndices: number[][][];
} {
  let totalWin = 0;
  let bestMessage = "";
  let bestIcon = "";
  let highestSingleWin = 0;
  const winningIndices: number[][][] = [];

  // Define Paylines (Coordinates: [row, col])
  const PAYLINES = [
    // Horizontal Rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
    ], // Top
    [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [1, 4],
    ], // Middle
    [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3],
      [2, 4],
    ], // Bottom

    // Diagonals (V-Shapes)
    [
      [0, 0],
      [1, 1],
      [2, 2],
      [1, 3],
      [0, 4],
    ], // V Shape
    [
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 3],
      [2, 4],
    ], // Inverted V Shape

    // Vertical Columns
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ], // Col 1
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ], // Col 2
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ], // Col 3
    [
      [0, 3],
      [1, 3],
      [2, 3],
    ], // Col 4
    [
      [0, 4],
      [1, 4],
      [2, 4],
    ], // Col 5
  ];

  // Check each payline
  for (const payline of PAYLINES) {
    // Extract symbols for this payline
    const symbols = payline.map(([r, c]) => {
      if (r === undefined || c === undefined) return "";
      return matrix[r]?.[c] ?? "";
    });

    // Find longest consecutive sequence anywhere in the payline
    let maxMatchCount = 0;
    let bestItem = "";
    let bestStartIndex = 0;

    let currentItem = symbols[0];
    let currentCount = 1;
    let currentStartIndex = 0;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] === currentItem) {
        currentCount++;
      } else {
        if (currentCount > maxMatchCount) {
          maxMatchCount = currentCount;
          bestItem = currentItem!;
          bestStartIndex = currentStartIndex;
        }
        currentItem = symbols[i];
        currentCount = 1;
        currentStartIndex = i;
      }
    }
    if (currentCount > maxMatchCount) {
      maxMatchCount = currentCount;
      bestItem = currentItem!;
      bestStartIndex = currentStartIndex;
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
      let winFactor = 0;
      if (maxMatchCount === 3) winFactor = 0.5;
      if (maxMatchCount === 4) winFactor = 0.75;
      if (maxMatchCount === 5) winFactor = 1.0;

      const lineWin = Math.max(1, Math.round(baseWin * multiplier * winFactor));

      totalWin += lineWin;

      // Add winning coordinates
      const winningSegment = payline.slice(
        bestStartIndex,
        bestStartIndex + maxMatchCount,
      );
      // Filter out any undefined coordinates just in case, though they shouldn't be there
      const validSegment = winningSegment.filter(
        (coord) => coord[0] !== undefined && coord[1] !== undefined,
      );
      winningIndices.push(validSegment);

      if (lineWin > highestSingleWin) {
        highestSingleWin = lineWin;
        bestMessage = `${name} ${maxMatchCount}x Combo! ${lineWin} coins!`;
        bestIcon = bestItem ?? "";
      }
    }
  }

  if (totalWin > 0) {
    return {
      winAmount: totalWin,
      message:
        totalWin > highestSingleWin
          ? `Multi-Line Win! ${totalWin} coins!`
          : bestMessage,
      iconKey: bestIcon,
      winningIndices,
    };
  }

  return { winAmount: 0, message: "", iconKey: "", winningIndices: [] };
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

  const { winAmount, message, iconKey, winningIndices } = calculateWin(
    resultMatrix,
    betAmount,
  );

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
    winningIndices,
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
