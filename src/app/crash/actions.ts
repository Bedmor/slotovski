"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { revalidatePath } from "next/cache";

export async function startGame(betAmount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.credits < betAmount) {
    return { error: "Insufficient credits" };
  }

  // Deduct bet amount immediately
  await db.user.update({
    where: { id: user.id },
    data: { credits: { decrement: betAmount } },
  });

  // Generate crash point
  // "Bigger multiplier chances are higher" logic
  // Standard crash is 1/x. We want better odds.
  // Let's use a distribution that favors 2x-5x range more than standard.
  // Standard: 50% < 2.0x.
  // Generous: Let's make it 30% < 2.0x.

  const r = Math.random();
  let crashPoint = 1.0;

  // Simple generous algorithm:
  // 10% chance of instant crash (1.0x - 1.1x)
  // 20% chance of 1.1x - 2.0x
  // 40% chance of 2.0x - 5.0x
  // 20% chance of 5.0x - 10.0x
  // 10% chance of 10.0x - 100.0x

  if (r < 0.1) {
    crashPoint = 1.0 + Math.random() * 0.1;
  } else if (r < 0.3) {
    crashPoint = 1.1 + Math.random() * 0.9;
  } else if (r < 0.7) {
    crashPoint = 2.0 + Math.random() * 3.0;
  } else if (r < 0.9) {
    crashPoint = 5.0 + Math.random() * 5.0;
  } else {
    crashPoint = 10.0 + Math.random() * 90.0;
  }

  // Round to 2 decimals
  crashPoint = Math.floor(crashPoint * 100) / 100;

  const game = await db.crashGame.create({
    data: {
      userId: user.id,
      betAmount,
      crashPoint,
      result: "PENDING",
    },
  });

  revalidatePath("/crash");
  return {
    success: true,
    gameId: game.id,
    crashPoint,
    credits: user.credits - betAmount,
  };
}

export async function cashOut(gameId: string, multiplier: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const game = await db.crashGame.findUnique({
    where: { id: gameId },
  });

  if (!game || game.userId !== session.user.id) {
    return { error: "Game not found" };
  }

  if (game.result !== "PENDING") {
    return { error: "Game already finished" };
  }

  // Verify multiplier
  if (multiplier > game.crashPoint) {
    // This shouldn't happen if client is honest, but if they lag or cheat:
    // We mark it as loss/crashed.
    await db.crashGame.update({
      where: { id: gameId },
      data: { result: "CRASHED" },
    });
    return { error: "Crashed" };
  }

  const winAmount = Math.floor(game.betAmount * multiplier);

  await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: winAmount } },
    }),
    db.crashGame.update({
      where: { id: gameId },
      data: {
        result: "WIN",
        cashOutPoint: multiplier,
      },
    }),
  ]);

  revalidatePath("/crash");
  return { success: true, winAmount };
}

export async function finishGame(gameId: string) {
  // Called when client animation finishes and user didn't cash out
  const session = await auth();
  if (!session?.user?.id) return;

  const game = await db.crashGame.findUnique({ where: { id: gameId } });
  if (game?.result !== "PENDING") return;

  await db.crashGame.update({
    where: { id: gameId },
    data: { result: "LOSS" },
  });
}
