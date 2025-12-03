"use server";

import { db } from "~/server/db";
import { broadcastCrash } from "../api/crash/sse/sse-utils";
import type { CrashState } from "./types";

type Engine = {
  state: CrashState;
  tickTimer?: NodeJS.Timeout | null;
  phaseTimer?: NodeJS.Timeout;
  ensure(): void;
  startBetting(): Promise<void>;
  startRun(): Promise<void>;
  endRun(): Promise<void>;
};

declare global {
  // singleton
  var __crashEngine: Engine | undefined;
}

const BETTING_DURATION_MS = 7000; // 7s lobby
const BETWEEN_ROUNDS_MS = 5000; // 5s after crash
const TICK_MS = 10; // update frequency (smoother graph)

function chooseCrashPoint(): number {
  // Heavily skewed to low values with occasional higher ones
  // Pareto-like sampling
  const u = Math.random();
  // Tune these to reduce frequency of very-low crashes while keeping
  // a heavy tail for occasional big rounds.
  const alpha = 1.6; // lower alpha => heavier tail (more big values)
  const xm = 1.08; // raise minimum multiplier so very-low crashes are rarer

  // Inverse CDF for Pareto: x = xm / (1 - u)^(1/alpha)
  const raw = xm / Math.pow(1 - u, 1 / alpha);

  // Cap to avoid extreme values
  const capped = Math.min(raw, 200);

  // Return with modest precision (engine uses higher precision elsewhere)
  return Math.max(xm, Math.round(capped * 1000) / 1000);
}

function multiplierAt(msElapsed: number): number {
  // Smooth exponential growth
  const t = msElapsed / 1000;
  const m = Math.exp(0.065 * t); // ~ x1.93 at 10s
  // Keep full precision for rendering smoothness; UI rounds for display
  return Math.max(1.0, parseFloat(m.toFixed(4)));
}

function baseState(): CrashState {
  return {
    roundId: null,
    phase: "betting",
    currentMultiplier: 1.0,
  };
}

async function markUncashedAsLost(roundId: string) {
  await db.crashBet.updateMany({
    where: { gameId: roundId, winAmount: null, cashedOutAt: null },
    data: { winAmount: 0 },
  });
}

async function createNewRoundRecord(): Promise<{
  id: string;
  crashPoint: number;
}> {
  const crashPoint = chooseCrashPoint();
  // Use cuid from DB default? Our CrashGame.id has no default; we must set manually.
  const id = Math.random().toString(36).slice(2, 12).toUpperCase();
  await db.crashGame.create({
    data: { id, crashPoint, status: "betting" },
  });
  return { id, crashPoint };
}

function getEngine(): Engine {
  global.__crashEngine ??= {
    state: baseState(),
    async startBetting() {
      // Create round with selected crashPoint
      const { id } = await createNewRoundRecord();

      const bettingEndsAt = Date.now() + BETTING_DURATION_MS;
      this.state = {
        roundId: id,
        phase: "betting",
        currentMultiplier: 1.0,
        bettingEndsAt,
        crashPoint: null, // not revealed
      };
      broadcastCrash(this.state);

      // schedule run start
      clearTimeout(this.phaseTimer);
      this.phaseTimer = setTimeout(() => {
        void this.startRun();
      }, BETTING_DURATION_MS);
    },
    async startRun() {
      if (!this.state.roundId) {
        await this.startBetting();
        return;
      }
      const roundId = this.state.roundId;
      const round = await db.crashGame.update({
        where: { id: roundId },
        data: { status: "running", startTime: new Date() },
      });
      const startTime = Date.now();
      const crashPoint = round.crashPoint;

      this.state = {
        roundId,
        phase: "running",
        startTime,
        currentMultiplier: 1.0,
        // do not expose crashPoint yet
      };
      broadcastCrash(this.state);

      if (this.tickTimer) clearInterval(this.tickTimer);
      this.tickTimer = setInterval(() => {
        const ms = Date.now() - startTime;
        const m = multiplierAt(ms);
        if (m >= crashPoint) {
          if (this.tickTimer) clearInterval(this.tickTimer);
          void this.endRun();
        } else {
          this.state.currentMultiplier = m;
          broadcastCrash(this.state);
        }
      }, TICK_MS);
    },
    async endRun() {
      const roundId = this.state.roundId!;
      // mark game crashed in DB and settle non-cashed bets
      await db.crashGame.update({
        where: { id: roundId },
        data: { status: "crashed" },
      });
      await markUncashedAsLost(roundId);
      const nextRoundStartsAt = Date.now() + BETWEEN_ROUNDS_MS;
      // reveal crashPoint to clients by fetching
      const game = await db.crashGame.findUnique({ where: { id: roundId } });
      this.state = {
        roundId,
        phase: "crashed",
        currentMultiplier: game?.crashPoint ?? this.state.currentMultiplier,
        crashPoint: game?.crashPoint ?? this.state.currentMultiplier,
        nextRoundStartsAt,
      };
      broadcastCrash(this.state);

      clearTimeout(this.phaseTimer);
      this.phaseTimer = setTimeout(() => {
        void this.startBetting();
      }, BETWEEN_ROUNDS_MS);
    },
    ensure() {
      if (!this.state.roundId) void this.startBetting();
    },
  };
  return global.__crashEngine;
}

export async function ensureCrashEngine() {
  getEngine().ensure();
}

export async function getCrashState(): Promise<CrashState> {
  return getEngine().state;
}
