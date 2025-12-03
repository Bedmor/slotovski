"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { broadcastGlobal } from "~/app/api/sse/sse-utils";
import { ensureCrashEngine, getCrashState } from "./engine";

export async function getState() {
  await ensureCrashEngine();
  const state = await getCrashState();
  return { success: true, state };
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

export async function getMyBet() {
  const session = await auth();
  if (!session?.user) return { hasBet: false } as const;
  await ensureCrashEngine();
  const state = await getCrashState();
  if (!state.roundId) return { hasBet: false } as const;
  const bet = await db.crashBet.findFirst({
    where: { userId: session.user.id, gameId: state.roundId },
  });
  if (!bet) return { hasBet: false } as const;
  return {
    hasBet: true,
    amount: bet.amount,
    cashedOutAt: bet.cashedOutAt ?? null,
    winAmount: bet.winAmount ?? null,
  } as const;
}

export async function placeBet(amount: number) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Invalid bet" } as const;

  await ensureCrashEngine();
  const state = await getCrashState();
  if (
    state.phase !== "betting" ||
    !state.roundId ||
    (state.bettingEndsAt && Date.now() >= state.bettingEndsAt)
  ) {
    return { error: "Betting is closed" } as const;
  }

  // Ensure user has not already bet
  const existing = await db.crashBet.findFirst({
    where: { userId: session.user.id, gameId: state.roundId },
  });
  if (existing) return { error: "Already placed a bet" } as const;

  // Check credits
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true },
  });
  if (!user || user.credits < amount)
    return { error: "Insufficient credits" } as const;

  // Deduct and create bet
  await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: Math.floor(amount) } },
    }),
    db.crashBet.create({
      data: {
        userId: session.user.id,
        gameId: state.roundId,
        amount: Math.floor(amount),
      },
    }),
  ]);

  const newCredits = await getCredits();
  return { success: true, credits: newCredits } as const;
}

export async function cashOut() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await ensureCrashEngine();
  const state = await getCrashState();
  if (state.phase !== "running" || !state.roundId || !state.startTime) {
    return { error: "Cannot cash out now" } as const;
  }

  // Get user's active bet
  const bet = await db.crashBet.findFirst({
    where: {
      userId: session.user.id,
      gameId: state.roundId,
      cashedOutAt: null,
    },
  });
  if (!bet) return { error: "No active bet" } as const;

  const currentMultiplier = state.currentMultiplier;
  // Compute payout
  const payout = Math.max(0, Math.floor(bet.amount * currentMultiplier));

  // Mark cashout and credit user
  await db.$transaction([
    db.crashBet.update({
      where: { id: bet.id },
      data: { cashedOutAt: currentMultiplier, winAmount: payout },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: payout } },
    }),
  ]);

  try {
    broadcastGlobal({
      type: "player_cashed_out",
      playerId: session.user.id,
      payout,
      game: "crash",
    });
  } catch {}

  const newCredits = await getCredits();
  return {
    success: true,
    credits: newCredits,
    cashedOutAt: currentMultiplier,
    payout,
  } as const;
}

export async function getLastCrashes(limit = 12): Promise<number[]> {
  // No auth required to view history
  const games = await db.crashGame.findMany({
    where: { status: "crashed" },
    orderBy: { startTime: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
    select: { crashPoint: true, id: true },
  });
  return games.map((g) => Number(g.crashPoint));
}
