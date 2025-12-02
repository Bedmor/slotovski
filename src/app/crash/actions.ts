// empty file
"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { broadcastGlobal } from "~/app/api/sse/sse-utils";
import { revalidatePath } from "next/cache";
import type { CrashActiveBet, CrashRoundState } from "./types";

declare global {
  var crashState: CrashRoundState | undefined;
  var crashSseClients:
    | Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>
    | undefined;
}

function ensureGlobalState() {
  global.crashState ??= {
    running: false,
    multiplier: 1,
    phase: "cooldown",
    activeBets: {},
    pendingBets: {},
    history: [],
  };
  global.crashSseClients ??= new Map();
}

async function broadcast(payload: Record<string, unknown>) {
  ensureGlobalState();
  if (!global.crashSseClients) return;
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  const enc = new TextEncoder().encode(data);
  for (const set of global.crashSseClients.values()) {
    for (const c of set) {
      try {
        c.enqueue(enc);
      } catch {}
    }
  }
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

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return { userId: null, credits: 0 };
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, credits: true },
  });
  if (!user) return { userId: null, credits: 0 };
  return { userId: user.id, credits: user.credits };
}

export async function placeBet(betAmount: number) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  if (betAmount <= 0) return { error: "Invalid bet" };
  ensureGlobalState();
  const state = global.crashState!;
  // Only accept pending bets during the betting phase
  if (state.phase !== "betting") {
    return { error: "Betting is closed for this round" };
  }

  // If user already has a pending bet, disallow placing another one
  if (state.pendingBets?.[session.user.id]) {
    return { error: "Bet already pending" };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "User not found" };
  if (user.credits < betAmount) return { error: "Insufficient credits" };

  // Deduct now and put into pending
  const newCredits = user.credits - betAmount;
  await db.user.update({
    where: { id: user.id },
    data: { credits: newCredits },
  });

  // Add pending bet
  state.pendingBets[session.user.id] = {
    playerId: session.user.id,
    betAmount,
  } as CrashActiveBet;

  // Broadcast bet placed
  await broadcast({ type: "player_bet", playerId: session.user.id, betAmount });

  revalidatePath("/crash");
  return { newCredits };
}

export async function cancelBet() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  ensureGlobalState();
  const pending = global.crashState!.pendingBets[session.user.id];
  if (!pending) return { error: "No pending bet" };

  // Refund
  await db.user.update({
    where: { id: session.user.id },
    data: { credits: { increment: pending.betAmount } },
  });
  delete global.crashState!.pendingBets[session.user.id];
  await broadcast({
    type: "bet_cancelled",
    playerId: session.user.id,
    amount: pending.betAmount,
  });
  revalidatePath("/crash");
  return { ok: true };
}

export async function cashOut() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  ensureGlobalState();
  const active = global.crashState!.activeBets[session.user.id];
  if (!active) return { error: "No active bet" };
  if (active.cashedOut) return { error: "Already cashed out" };

  const multiplier = global.crashState!.multiplier;
  const payout = Math.round(active.betAmount * multiplier);

  // Add payout
  await db.user.update({
    where: { id: session.user.id },
    data: { credits: { increment: payout } },
  });

  active.cashedOut = true;
  active.cashedOutMultiplier = multiplier;

  await broadcast({
    type: "player_cashed_out",
    playerId: session.user.id,
    payout,
    multiplier,
  });
  try {
    broadcastGlobal({
      type: "player_cashed_out",
      playerId: session.user.id,
      payout,
      multiplier,
      game: "crash",
    });
  } catch {}
  revalidatePath("/crash");
  return { payout, multiplier };
}

export async function startNextRound() {
  ensureGlobalState();
  if (global.crashState!.running) return { error: "Round already running" };
  // This action triggers nothing; SSE loop handles rounds. Just broadcast a start signal
  await broadcast({ type: "admin_start_round" });
  return { ok: true };
}
