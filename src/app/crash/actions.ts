"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { startCrashLoopIfNeeded } from "../api/crash/loop";
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
  } as CrashRoundState;
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
      } catch {
        /* ignore */
      }
    }
  }
}

export async function getCredits() {
  const s = await auth();
  if (!s?.user) return 0;
  const u = await db.user.findUnique({
    where: { id: s.user.id },
    select: { credits: true },
  });
  return u?.credits ?? 0;
}

export async function getSessionUser() {
  const s = await auth();
  if (!s?.user) return { userId: null, credits: 0 };
  const u = await db.user.findUnique({
    where: { id: s.user.id },
    select: { id: true, credits: true },
  });
  if (!u) return { userId: null, credits: 0 };
  return { userId: u.id, credits: u.credits };
}

/**
 * Place a pending bet. If a round is running, bet is rejected.
 * Deducts credits immediately and stores into pendingBets.
 */
export async function placeBet(betAmount: number) {
  const s = await auth();
  if (!s?.user) return { error: "Unauthorized" };
  if (!betAmount || betAmount <= 0) return { error: "Invalid bet" };
  ensureGlobalState();
  const state = global.crashState!;
  if (state.running) return { error: "Betting is closed" };
  if (state.pendingBets[s.user.id] || state.activeBets[s.user.id])
    return { error: "Already placed" };

  const user = await db.user.findUnique({ where: { id: s.user.id } });
  if (!user) return { error: "User not found" };
  if (user.credits < betAmount) return { error: "Insufficient credits" };

  // Deduct credits immediately
  const newCredits = user.credits - betAmount;
  await db.user.update({
    where: { id: s.user.id },
    data: { credits: newCredits },
  });

  // Add to pending bets
  const bet: CrashActiveBet = { playerId: s.user.id, betAmount };
  state.pendingBets[s.user.id] = bet;

  // Broadcast small events for UI and full state
  await broadcast({ type: "player_bet", playerId: s.user.id, betAmount });
  await broadcast({ type: "state", state: global.crashState });

  // Ensure server loop runs (start if needed)
  try {
    startCrashLoopIfNeeded();
  } catch {}

  revalidatePath("/crash");
  return { newCredits };
}

/**
 * Cancel a pending bet: refund user and remove the pending entry.
 */
export async function cancelBet() {
  const s = await auth();
  if (!s?.user) return { error: "Unauthorized" };
  ensureGlobalState();
  const pending = global.crashState!.pendingBets[s.user.id];
  if (!pending) return { error: "No pending bet" };
  await db.user.update({
    where: { id: s.user.id },
    data: { credits: { increment: pending.betAmount } },
  });
  delete global.crashState!.pendingBets[s.user.id];
  await broadcast({
    type: "bet_cancelled",
    playerId: s.user.id,
    amount: pending.betAmount,
  });
  await broadcast({ type: "state", state: global.crashState });
  revalidatePath("/crash");
  return { ok: true };
}

/**
 * Cash out an active bet for the current user.
 */
export async function cashOut() {
  const s = await auth();
  if (!s?.user) return { error: "Unauthorized" };
  ensureGlobalState();
  const active = global.crashState!.activeBets[s.user.id];
  if (!active) return { error: "No active bet" };
  if (active.cashedOut) return { error: "Already cashed out" };
  const multiplier = global.crashState!.multiplier;
  const payout = Math.round(active.betAmount * multiplier);
  await db.user.update({
    where: { id: s.user.id },
    data: { credits: { increment: payout } },
  });
  active.cashedOut = true;
  active.cashedOutMultiplier = multiplier;
  await broadcast({
    type: "player_cashed_out",
    playerId: s.user.id,
    payout,
    multiplier,
  });
  await broadcast({ type: "state", state: global.crashState });
  try {
    broadcastGlobal({
      type: "player_cashed_out",
      playerId: s.user.id,
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
  await broadcast({ type: "admin_start_round" });
  return { ok: true };
}
