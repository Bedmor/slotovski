"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export interface GameState {
  grid: ("hidden" | "diamond" | "mine")[][];
  revealed: boolean[][];
  isGameOver: boolean;
  currentMultiplier: number;
  diamondsFound: number;
  betAmount: number;
  gameId: string;
}

export async function startGame(betAmount: number, mineCount: number) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (betAmount <= 0) {
    return { error: "Invalid bet amount" };
  }

  if (mineCount < 1 || mineCount > 20) {
    return { error: "Mine count must be between 1 and 20" };
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

  // Deduct bet amount
  await db.user.update({
    where: { id: user.id },
    data: { credits: user.credits - betAmount },
  });

  // Generate 6x6 grid with mines
  const grid: ("hidden" | "diamond" | "mine")[][] = Array.from(
    { length: 6 },
    () =>
      Array.from(
        { length: 6 },
        () => "hidden" as "hidden" | "diamond" | "mine",
      ),
  );

  // Place mines randomly
  const positions: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j]!, positions[i]!];
  }

  // Place mines
  for (let i = 0; i < mineCount; i++) {
    const [row, col] = positions[i]!;
    grid[row]![col] = "mine";
  }

  // Fill rest with diamonds
  for (let i = mineCount; i < 36; i++) {
    const [row, col] = positions[i]!;
    grid[row]![col] = "diamond";
  }

  const revealed: boolean[][] = Array.from({ length: 6 }, () =>
    Array.from({ length: 6 }, () => false),
  );

  const gameId = `${user.id}-${Date.now()}`;

  const gameState: GameState = {
    grid,
    revealed,
    isGameOver: false,
    currentMultiplier: 1.0,
    diamondsFound: 0,
    betAmount,
    gameId,
  };

  revalidatePath("/diamonds");

  return {
    success: true,
    gameState,
    newCredits: user.credits - betAmount,
  };
}

export async function revealTile(
  gameState: GameState,
  row: number,
  col: number,
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (gameState.isGameOver) {
    return { error: "Game is already over" };
  }

  if (gameState.revealed[row]?.[col]) {
    return { error: "Tile already revealed" };
  }

  const newRevealed = gameState.revealed.map((r) => [...r]);
  newRevealed[row]![col] = true;

  const tileType = gameState.grid[row]?.[col];

  if (tileType === "mine") {
    // Hit a mine - game over
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      gameState: {
        ...gameState,
        revealed: newRevealed,
        isGameOver: true,
      },
      hitMine: true,
      newCredits: user.credits,
    };
  } else {
    // Found a diamond
    const diamondsFound = gameState.diamondsFound + 1;
    const totalDiamonds =
      36 - gameState.grid.flat().filter((t) => t === "mine").length;

    // Calculate multiplier based on mine count and diamonds found
    // More mines = higher multiplier per diamond
    const mineCount = gameState.grid.flat().filter((t) => t === "mine").length;
    const baseMultiplierIncrease = 0.1 + mineCount / 100; // Base increase scales with mine count
    const newMultiplier = gameState.currentMultiplier + baseMultiplierIncrease;

    return {
      success: true,
      gameState: {
        ...gameState,
        revealed: newRevealed,
        currentMultiplier: newMultiplier,
        diamondsFound,
        isGameOver: diamondsFound === totalDiamonds, // Won if all diamonds found
      },
      hitMine: false,
      newCredits: null,
    };
  }
}

export async function cashOut(gameState: GameState) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (gameState.isGameOver) {
    return { error: "Game is already over" };
  }

  if (gameState.diamondsFound === 0) {
    return { error: "Must find at least one diamond before cashing out" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const winAmount = Math.round(
    gameState.betAmount * gameState.currentMultiplier,
  );

  await db.user.update({
    where: { id: user.id },
    data: { credits: user.credits + winAmount },
  });

  revalidatePath("/diamonds");

  return {
    success: true,
    winAmount,
    newCredits: user.credits + winAmount,
    gameState: {
      ...gameState,
      isGameOver: true,
    },
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
